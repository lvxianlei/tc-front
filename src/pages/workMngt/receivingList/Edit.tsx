import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, Form, message, Spin, Modal, Space, Input } from 'antd'
import { DetailTitle, BaseInfo, formatData, EditableTable } from '../../common'
import ChooseModal from "./ChooseModal"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { unloadModeOptions, settlementModeOptions, materialTextureOptions, materialStandardOptions } from "../../../configuration/DictionaryOptions"
import { BasicInformation, editCargoDetails } from "./receivingListData.json"
import * as calcObj from '@utils/calcUtil'
import moment from "moment"
import styles from './edit.module.less';
/**
 * 纸质单号，原材料税款合计，车辆牌照
 */
interface EditProps {
    id: string,
    type: "new" | "edit"
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}

interface TotalState {
    num?: string
    balanceTotalWeight?: string
    totalTaxPrice?: string
    totalUnTaxPrice?: string
}

export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [cargoData, setCargoData] = useState<any[]>([])
    const [supplierId, setSupplierId] = useState<string>("")
    let [number, setNumber] = useState<number>(0);
    const [total, setTotal] = useState<TotalState>({});
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()

    const [select, setSelect] = useState<any[]>([])

    const { loading: materialLoading, data: taxData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/tax`)
            resole({
                material: result.find((item: any) => item.modeName === "材料税率").taxVal,
                transport: result.find((item: any) => item.modeName === "运费税率").taxVal,
                unload: result.find((item: any) => item.modeName === "装卸税率").taxVal
            })
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: warehouseLoading, data: warehouseData } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get("/tower-storage/warehouse/getWarehouses")
            resole(result?.map((item: any) => ({ value: item.id, label: item.name })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`)
            setSupplierId(result?.supplierId)
            const dataSourceE:any = []
            result?.lists?Promise.all( result?.lists.map(async (item: any) => {
                await RequestUtil.post(`/tower-storage/receiveStock/material/standard`,{materials:[
                    {
                        materialName: item.materialName,
                        materialStandard: item.materialStandard,
                        structureSpec: item.structureSpec
                    }
                ]}).then((res:any)=>{
                    const postData = {
                        ...item,
                        ...( res && res.length>0 ? res[0] : {} ),
                        num: item.num ? item.num : 0
                    }
                    console.log(postData)
                    dataSourceE.push(postData)
                    })
                return item
            })).then((res)=>{
                // console.log(res)
                // console.log(dataSourceE)
                // const seletTotal = dataSourceE.reduce((total: TotalState, current: any) => ({
                //     num: parseFloat(total.num || "0") + parseFloat(current.num || '0'),
                //     balanceTotalWeight: (parseFloat(total.balanceTotalWeight || "0") + parseFloat(current.balanceTotalWeight || '0')).toFixed(5),
                //     totalTaxPrice: (parseFloat(total.totalTaxPrice || "0") + parseFloat(current.totalTaxPrice || '0')).toFixed(2),
                //     totalUnTaxPrice: (parseFloat(total.totalUnTaxPrice || "0") + parseFloat(current.totalUnTaxPrice || '0')).toFixed(2)
                // }), {})
                // setTotal(seletTotal)
                setCargoData(dataSourceE)
            }):setCargoData(result?.lists.map((item: any) => ({
                ...item,
                num: item.num ? item.num : 0
            })) || [])
            const seletTotal = result?.lists.reduce((total: TotalState, current: any) => ({
                num: parseFloat(total.num || "0") + parseFloat(current.num || '0'),
                balanceTotalWeight: (parseFloat(total.balanceTotalWeight || "0") + parseFloat(current.balanceTotalWeight || '0')).toFixed(5),
                totalTaxPrice: (parseFloat(total.totalTaxPrice || "0") + parseFloat(current.totalTaxPrice || '0')).toFixed(2),
                totalUnTaxPrice: (parseFloat(total.totalUnTaxPrice || "0") + parseFloat(current.totalUnTaxPrice|| '0')).toFixed(2)
            }), {})
            setTotal(seletTotal)
            resole({
                ...formatData(BasicInformation, result),
                supplierId: {
                    id: result.supplierId,
                    value: result.supplierName,
                },
                unloadUsersName: {
                    value: result.unloadUsersName,
                    records: result.unloadUsers.split(",").map((userId: any) => ({ userId }))
                }
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](
                `/tower-storage/receiveStock`,
                type === "new" ? data : ({ ...data, id })
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    //随机数
    const random =(min:number, max:number)=> {
        return (Math.random() * (max - min) + min).toFixed(2);
    }
    const handleModalOk = async () => {
        const meteringMode = form.getFieldValue("meteringMode")
        const totalPonderationWeight = form.getFieldValue("totalPonderationWeight") || "0"
        // 所有明细理算重量总和
        const allTotalWeight = modalRef.current?.dataSource.reduce((total, item) =>
            (parseFloat(total) + parseFloat(calcObj.totalWeight({
                length: item.length,
                width: item.width,
                weightAlgorithm: item.weightAlgorithm,
                proportion: item.proportion,
                num: item.num
            }))).toFixed(5), 0)
        const dataSourceE:any = []
        Promise.all( modalRef.current?.dataSource.map(async (item: any) => {
            const weight = calcObj.weight({
                length: item.length,
                width: item.width,
                weightAlgorithm: item.weightAlgorithm,
                proportion: item.proportion
            })

            // 结算重量
            const balanceTotalWeight = calcObj.balanceTotalWeight(
                meteringMode,
                weight,
                item.num,
                totalPonderationWeight,
                allTotalWeight) || '0'
            // 含税金额
            const totalTaxPrice = calcObj.totalTaxPrice(item.taxPrice, balanceTotalWeight) || '0'
            // 不含税金额
            const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, taxData?.material) || '0'
            // 含税运费
            const totalTransportTaxPrice = calcObj.totalTransportTaxPrice(item.transportTaxPrice, balanceTotalWeight) || '0'
            // 不含税运费
            const totalTransportPrice = calcObj.totalTransportPrice(totalTransportTaxPrice, taxData?.transport) || '0'
            // 含税装卸费
            const totalUnloadTaxPrice = calcObj.totalUnloadTaxPrice(item.unloadTaxPrice, balanceTotalWeight) || '0'
            // 不含税装卸费
            const totalUnloadPrice = calcObj.totalUnloadPrice(totalUnloadTaxPrice, taxData?.unload) || '0'
            console.log(item)
            await RequestUtil.post(`/tower-storage/receiveStock/material/standard`,{materials:[
                {
                    materialName: item.materialName,
                    materialStandard: item.materialStandard,
                    structureSpec: item.structureSpec
                }
            ]}).then((res:any)=>{
                const limbWidth = [];
                const thickness = [];
                const caliber = [];
                const measureHeight= [];
                const gageLength = [];
                if( res && res.length > 0 ){
                    let limb = calcObj.calculateWidth(item.materialName,item.structureSpec,item.width)
                    let thick = calcObj.calculateThickness(item.materialName,item.structureSpec)
                    let cali = calcObj.calculatePipeDiameter(item.materialName,item.structureSpec)
                    let hei = calcObj.calculateHeight(item.materialName,item.structureSpec)
                    let len = item.length
                    for(var i = 1;i<=3; i++){
                        console.log(Number(limb)+Number(res[0]?.limbWidthMin))
                        limbWidth.push(random(Number(limb)+Number(res[0]?.limbWidthMin),Number(limb)+Number(res[0]?.limbWidthMax)))
                        thickness.push(random(Number(thick)+Number(res[0]?.thicknessMin),Number(thick)+Number(res[0]?.thicknessMax)))
                        caliber.push(random(Number(cali)+Number(res[0]?.caliberMin),Number(cali)+Number(res[0]?.caliberMax)))
                        measureHeight.push(random(Number(hei)+Number(res[0]?.measureHeightMin),Number(hei)+Number(res[0]?.measureHeightMax)))
                        gageLength.push(random(Number(len)+Number(res[0]?.gageLengthMin),Number(len)+Number(res[0]?.gageLengthMax)))
                    }
                    console.log(limbWidth,thickness,caliber,measureHeight)
                }else{
                    limbWidth.push(calcObj.calculateWidth(item.materialName,item.structureSpec,item.width))
                    thickness.push(calcObj.calculateThickness(item.materialName,item.structureSpec))
                    caliber.push(calcObj.calculatePipeDiameter(item.materialName,item.structureSpec))
                    measureHeight.push(calcObj.calculateHeight(item.materialName,item.structureSpec))
                    gageLength.push(item.length)
                    console.log(limbWidth,thickness,caliber,measureHeight)
                }
                const postData = {
                    ...item,
                    ...( res && res.length>0 ? res[0] : {} ),
                    limbWidth: limbWidth.join(','),
                    thickness: thickness.join(','),
                    caliber: caliber.join(','),
                    measureHeight: measureHeight.join(','),
                    gageLength: gageLength.join(','),
                    materialContractDetailId: item.id,
                    materialName: item.materialName,
                    materialStandard: item.materialStandard,
                    // materialStandardName: item.materialStandardName,
                    num: item.num,
                    contractUnitPrice: item.taxPrice,
                    taxPrice: item.taxPrice,
                    /** 不含税单价 */
                    unTaxPrice: item.price,
                    /** 理算重量 */
                    weight: calcObj.weight({
                        length: item.length,
                        width: item.width,
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                    }),
                    /** 理算总重量 */
                    totalWeight: calcObj.totalWeight({
                        length: item.length,
                        width: item.width,
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        num: item.num
                    }),
                    balanceTotalWeight,
                    totalTaxPrice,
                    totalUnTaxPrice,
                    appearance: item.appearance || 1,
                    totalTransportTaxPrice,
                    totalTransportPrice,
                    totalUnloadTaxPrice,
                    totalUnloadPrice
                }
                console.log(postData)
                delete postData.id
                dataSourceE.push(postData)
                })
            return item
        })).then((res)=>{
            console.log(res)
            console.log(dataSourceE)
            const seletTotal = dataSourceE.reduce((total: TotalState, current: any) => ({
                num: parseFloat(total.num || "0") + parseFloat(current.num || '0'),
                balanceTotalWeight: (parseFloat(total.balanceTotalWeight || "0") + parseFloat(current.balanceTotalWeight || '0')).toFixed(5),
                totalTaxPrice: (parseFloat(total.totalTaxPrice || "0") + parseFloat(current.totalTaxPrice || '0')).toFixed(2),
                totalUnTaxPrice: (parseFloat(total.totalUnTaxPrice || "0") + parseFloat(current.totalUnTaxPrice || '0')).toFixed(2)
            }), {})
            setTotal(seletTotal)
            setCargoData(dataSourceE)
            setVisible(false);
        })
    }

    const onSubmit = () => new Promise(async (resole, reject) => {
        try {
            const baseFormData = await form.validateFields()
            await editForm.validateFields()
            const editData = editForm.getFieldsValue(true).submit
            if(editData.filter((item:any)=>{return item?.meteringMode!==baseFormData?.meteringMode}).length>0){
                message.error('明细与基本信息中的计量方式不一致，不可确定！')
                console.log(editData)
                throw 'error'
            }else{
                const result = {
                    ...baseFormData,
                    supplierId,
                    supplierName: baseFormData.supplierId.value,
                    lists: editData.map((item: any) => {
                        if ([2, "2"].includes(baseFormData.meteringMode)) {
                            return ({ ...item, ponderationWeight: item.balanceTotalWeight })
                        }
                        return item
                    }),
                    num: baseFormData.num,
                    unloadUsersName: baseFormData.unloadUsersName.value,
                    unloadUsers: baseFormData.unloadUsersName.records.map((item: any) => item.userId).join(","),
                }
                await saveRun(result)
            }
            
            resole(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        editForm.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, cargoData, onSubmit, resetFields])

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.supplierId) {
            setSupplierId(fields.supplierId.id)
            modalRef.current?.resetFields()
            const supplierData: any = fields.supplierId.records[0]
            form.setFieldsValue({
                contactsUser: supplierData.contactMan,
                contactsPhone: supplierData.contactManTel
            })
            setCargoData([])
        }
        if (fields.meteringMode || fields.totalPonderationWeight) {
            const meteringMode = fields.meteringMode||form.getFieldValue("meteringMode")
            const totalPonderationWeight = fields.totalPonderationWeight || form.getFieldValue("totalPonderationWeight") || "0"
            const editData = editForm.getFieldsValue(true).submit
            // 所有明细理算重量总和
            const allTotalWeight = editData?.reduce((total: any, item: any) =>
                (parseFloat(total) + parseFloat(calcObj.totalWeight({
                    length: item.length,
                    width: item.width,
                    weightAlgorithm: item.weightAlgorithm,
                    proportion: item.proportion,
                    num: item.num
                }))).toFixed(5), 0)
            const dataSource: any[] = editData?.map((item: any, index: number) => {
                // 结算重量
                const balanceTotalWeight = calcObj.balanceTotalWeight(
                    meteringMode,
                    calcObj.weight({
                        length: item.length,
                        width: item.width,
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion
                    }),
                    item.num,
                    totalPonderationWeight,
                    allTotalWeight
                )

                // 含税金额
                const totalTaxPrice = calcObj.totalTaxPrice(item.taxPrice, balanceTotalWeight)
                // 不含税金额
                const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, taxData?.material)
                // 含税运费
                const totalTransportTaxPrice = calcObj.totalTransportTaxPrice(item.transportTaxPrice, balanceTotalWeight)
                // 不含税运费
                const totalTransportPrice = calcObj.totalTransportPrice(totalTransportTaxPrice, taxData?.transport)
                // 含税装卸费
                const totalUnloadTaxPrice = calcObj.totalUnloadTaxPrice(item.unloadTaxPrice, balanceTotalWeight)
                // 不含税装卸费
                const totalUnloadPrice = calcObj.totalUnloadPrice(totalUnloadTaxPrice, taxData?.unload)

                const postData = {
                    ...item,
                    ...cargoData[index],

                    totalTaxPrice,
                    totalUnTaxPrice,
                    balanceTotalWeight,
                    totalTransportTaxPrice,
                    totalTransportPrice,
                    totalUnloadTaxPrice,
                    totalUnloadPrice
                }
                return postData
            })
            setCargoData(dataSource || [])
            form.setFieldsValue({
                meteringMode: fields.meteringMode?fields.meteringMode:form.getFieldValue("meteringMode"),
                totalPonderationWeight: fields.totalPonderationWeight ? fields.totalPonderationWeight: form.getFieldValue("totalPonderationWeight")
            })
        }
    }

    const handleEditableChange = (data: any) => {
        const changeIndex = data.submit.length - 1
        const changeFiled = data.submit[changeIndex]
        if (changeFiled.balanceTotalWeight) {
            const meteringMode = form.getFieldValue("meteringMode")
            const dataSource: any[] = editForm.getFieldsValue(true)?.submit
            const totalTaxPrice = calcObj.totalTaxPrice(
                dataSource[changeIndex].taxPrice,
                changeFiled.balanceTotalWeight
            )
            const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, taxData?.material)
            dataSource[changeIndex] = {
                ...dataSource[changeIndex],
                totalTaxPrice,
                totalUnTaxPrice
            }
            if (meteringMode === 2) {
                const totalPonderationWeight = dataSource.reduce((count: string, item: any) =>
                    (parseFloat(count) + parseFloat(`${item.balanceTotalWeight}`)).toFixed(5), "0")
                form.setFieldsValue({ totalPonderationWeight })
            }
            // setCargoData(dataSource || [])
            editForm.setFieldsValue({
                submit: dataSource
            })
        }
        if (changeFiled.length || changeFiled.width) {
            const result = editForm.getFieldsValue(true).submit[changeIndex];
            const dataSource: any[] = editForm.getFieldsValue(true).submit
            const meteringMode = form.getFieldValue("meteringMode")
            const totalPonderationWeight = form.getFieldValue("totalPonderationWeight") || "0"
            // 所有明细理算重量总和
            const allTotalWeight = dataSource?.reduce((total: any, item: any) =>
                (parseFloat(total) + parseFloat(calcObj.totalWeight({
                    length: item.length,
                    width: item.width,
                    weightAlgorithm: item.weightAlgorithm,
                    proportion: item.proportion,
                    num: item.num
                }))).toFixed(5), 0)
            // 结算重量
            console.log(calcObj.weight({
                length: result.length,
                width: result.width,
                weightAlgorithm: result.weightAlgorithm,
                proportion: result.proportion,
            }))
            console.log(calcObj.balanceTotalWeight(
                meteringMode,
                calcObj.weight({
                    length: result.length,
                    width: result.width,
                    weightAlgorithm: result.weightAlgorithm,
                    proportion: result.proportion,
                }),
                result.num,
                totalPonderationWeight,
                allTotalWeight
            ))
            const balanceTotalWeight = calcObj.balanceTotalWeight(
                meteringMode,
                calcObj.weight({
                    length: result.length,
                    width: result.width,
                    weightAlgorithm: result.weightAlgorithm,
                    proportion: result.proportion,
                }),
                result.num,
                totalPonderationWeight,
                allTotalWeight
            )
            // 含税金额
            const totalTaxPrice = calcObj.totalTaxPrice(result.taxPrice, balanceTotalWeight)
            // 不含税金额
            const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, taxData?.material)
            // 含税运费
            const totalTransportTaxPrice = calcObj.totalTransportTaxPrice(result.transportTaxPrice, balanceTotalWeight)
            // 不含税运费
            const totalTransportPrice = calcObj.totalTransportPrice(totalTransportTaxPrice, taxData?.transport)
            // 含税装卸费
            const totalUnloadTaxPrice = calcObj.totalUnloadTaxPrice(result.unloadTaxPrice, balanceTotalWeight)
            // 不含税装卸费
            const totalUnloadPrice = calcObj.totalUnloadPrice(totalUnloadTaxPrice, taxData?.unload)

            dataSource[changeIndex] = {
                ...dataSource[changeIndex],
                /** 理算重量 */
                weight: calcObj.weight({
                    length: result.length,
                    width: result.width,
                    weightAlgorithm: result.weightAlgorithm,
                    proportion: result.proportion
                }),
                /** 理算总重量 */
                totalWeight: calcObj.totalWeight({
                    length: result.length,
                    width: result.width,
                    weightAlgorithm: result.weightAlgorithm,
                    proportion: result.proportion,
                    num: result.num
                }),
                /** 结算重量 */
                balanceTotalWeight,
                totalTaxPrice,
                totalUnTaxPrice,
                unTaxPrice: calcObj.unTaxPrice(result.taxPrice, taxData?.material),
                totalTransportTaxPrice,
                totalTransportPrice,
                totalUnloadTaxPrice,
                totalUnloadPrice
            }
            const seletTotal = dataSource.reduce((total: TotalState, current: any) => ({
                num: parseFloat(total.num || "0") + parseFloat(current.num),
                balanceTotalWeight: (parseFloat(total.balanceTotalWeight || "0") + parseFloat(current.balanceTotalWeight)).toFixed(5),
                totalTaxPrice: (parseFloat(total.totalTaxPrice || "0") + parseFloat(current.totalTaxPrice)).toFixed(2),
                totalUnTaxPrice: (parseFloat(total.totalUnTaxPrice || "0") + parseFloat(current.totalUnTaxPrice)).toFixed(2)
            }), {})
            setTotal(seletTotal)
            // setCargoData(dataSource || [])
            editForm.setFieldsValue({
                submit: dataSource
            })
        }
        if (changeFiled.materialStandard){
            const dataSource: any[] = editForm.getFieldsValue(true).submit
            const dataSourceE:any = []
            Promise.all( dataSource.map(async (item: any) => {
                await RequestUtil.post(`/tower-storage/receiveStock/material/standard`,{materials:[
                    {
                        materialName: item.materialName,
                        materialStandard: item.materialStandard,
                        structureSpec: item.structureSpec
                    }
                ]}).then((res:any)=>{
                    const limbWidth = [];
                    const thickness = [];
                    const caliber = [];
                    const measureHeight= [];
                    const gageLength = [];
                    if( res && res.length > 0 ){
                        let limb = calcObj.calculateWidth(item.materialName,item.structureSpec,item.width)
                        let thick = calcObj.calculateThickness(item.materialName,item.structureSpec)
                        let cali = calcObj.calculatePipeDiameter(item.materialName,item.structureSpec)
                        let hei = calcObj.calculateHeight(item.materialName,item.structureSpec)
                        let len = item.length
                        for(var i = 1;i<=3; i++){
                            console.log(Number(limb)+Number(res[0]?.limbWidthMin))
                            limbWidth.push(random(Number(limb)+Number(res[0]?.limbWidthMin),Number(limb)+Number(res[0]?.limbWidthMax)))
                            thickness.push(random(Number(thick)+Number(res[0]?.thicknessMin),Number(thick)+Number(res[0]?.thicknessMax)))
                            caliber.push(random(Number(cali)+Number(res[0]?.caliberMin),Number(cali)+Number(res[0]?.caliberMax)))
                            measureHeight.push(random(Number(hei)+Number(res[0]?.measureHeightMin),Number(hei)+Number(res[0]?.measureHeightMax)))
                            gageLength.push(random(Number(len)+Number(res[0]?.gageLengthMin),Number(len)+Number(res[0]?.gageLengthMax)))
                        }
                        console.log(limbWidth,thickness,caliber,measureHeight)
                    }else{
                        limbWidth.push(calcObj.calculateWidth(item.materialName,item.structureSpec,item.width))
                        thickness.push(calcObj.calculateThickness(item.materialName,item.structureSpec))
                        caliber.push(calcObj.calculatePipeDiameter(item.materialName,item.structureSpec))
                        measureHeight.push(calcObj.calculateHeight(item.materialName,item.structureSpec))
                        gageLength.push(item.length)
                        console.log(limbWidth,thickness,caliber,measureHeight)
                    }
                    const postData = {
                        ...item,
                        ...( res && res.length>0 ? res[0] : {} ),
                        limbWidth: limbWidth.join(','),
                        thickness: thickness.join(','),
                        caliber: caliber.join(','),
                        measureHeight: measureHeight.join(','),
                        gageLength: gageLength.join(','),
                    }
                    console.log(postData)
                    delete postData.id
                    dataSourceE.push(postData)
                    })
                return item
            })).then((res)=>{
                const seletTotal = dataSourceE.reduce((total: TotalState, current: any) => ({
                    num: parseFloat(total.num || "0") + parseFloat(current.num || '0'),
                    balanceTotalWeight: (parseFloat(total.balanceTotalWeight || "0") + parseFloat(current.balanceTotalWeight || '0')).toFixed(5),
                    totalTaxPrice: (parseFloat(total.totalTaxPrice || "0") + parseFloat(current.totalTaxPrice || '0')).toFixed(2),
                    totalUnTaxPrice: (parseFloat(total.totalUnTaxPrice || "0") + parseFloat(current.totalUnTaxPrice || '0')).toFixed(2)
                }), {})
                setTotal(seletTotal)
                // setCargoData(dataSourceE)
                editForm.setFieldsValue({
                    submit: dataSourceE
                })
            })
        }
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        const seletTotal = selectRows.reduce((total: TotalState, current: any) => ({
            num: parseFloat(total.num || "0") + parseFloat(current.num),
            balanceTotalWeight: (parseFloat(total.balanceTotalWeight || "0") + parseFloat(current.balanceTotalWeight)).toFixed(5),
            totalTaxPrice: (parseFloat(total.totalTaxPrice || "0") + parseFloat(current.totalTaxPrice)).toFixed(2),
            totalUnTaxPrice: (parseFloat(total.totalUnTaxPrice || "0") + parseFloat(current.totalUnTaxPrice)).toFixed(2)
        }), {})
        setTotal(seletTotal)
        setSelect(selectedRowKeys)
    }
    return <Spin spinning={loading && warehouseLoading && materialLoading}>
        <Modal
            width={1011}
            visible={visible}
            title="选择货物明细"
            onCancel={() => {
                modalRef.current?.resetFields()
                setVisible(false)
                setNumber(++number)
            }}
            onOk={handleModalOk}>
            <ChooseModal id={supplierId} ref={modalRef} initChooseList={cargoData} numberStatus={number} />
        </Modal>
        <DetailTitle title="收货单基础信息" />
        <BaseInfo
            col={2}
            form={form}
            edit
            onChange={handleBaseInfoChange}
            columns={BasicInformation.map(item => {
                switch (item.dataIndex) {
                    case "paperNumber":
                        return ({
                            ...item,
                            maxLength: 20,
                            rules: [
                                {
                                    pattern: new RegExp(/^[a-zA-Z0-9]*$/g, 'g'),
                                    message: "请输入正确的纸质单号"
                                }
                            ]
                        })
                    case "supplierId":
                        return ({
                            ...item,
                            disabled: type === "edit"
                        })
                    case "unloadMode":
                        return ({
                            ...item,
                            enum: unloadModeOptions?.map((item: any) => ({ value: item.id, label: item.name }))
                        })
                    case "settlementMode":
                        return ({
                            ...item,
                            enum: settlementModeOptions?.map((item: any) => ({ value: item.id, label: item.name }))
                        })
                    case "warehouseId":
                        return ({
                            ...item,
                            enum: warehouseData || []
                        })
                    case "totalPonderationWeight":
                        return ({
                            ...item,
                            required: form.getFieldValue("meteringMode") === 2
                        })
                    default:
                        return item
                }
            })}
            dataSource={{
                meteringMode: form.getFieldValue('meteringMode')?form.getFieldValue('meteringMode'):2,
                receiveTime: moment(),
                settlementMode: settlementModeOptions?.[0]?.id,
                ...data
            }} />
        <DetailTitle
            title="货物明细"
            operation={[
                <Button
                    type="primary"
                    key="choose"
                    ghost
                    onClick={() => {
                        if (!supplierId) {
                            message.warning("请先选择供应商...")
                            return
                        }
                        setVisible(true)
                    }}
                >选择</Button>
            ]}
        />
        <Space style={{ color: "red" }}>
            <div><span>数量合计：</span><span>{total.num || "0"}</span></div>
            <div><span>重量合计(吨)：</span><span>{total.balanceTotalWeight || "0"}</span></div>
            <div><span>含税金额合计(元)：</span><span>{total.totalTaxPrice || "0"}</span></div>
            <div><span>不含税金额合计(元)：</span><span>{total.totalUnTaxPrice || "0"}</span></div>
        </Space>
        <EditableTable
            haveIndex={false}
            form={editForm}
            rowKey="key"
            className={styles.formStyle}
            haveOpration={false}
            onChange={handleEditableChange}
            haveNewButton={false}
            columns={[
                ...editCargoDetails.map((item: any) => {
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            enum: materialStandardOptions?.map(item => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    if (item.dataIndex === "structureTexture") {
                        return ({
                            ...item,
                            enum: materialTextureOptions?.map(item => ({
                                value: item.name,
                                label: item.name
                            }))
                        })
                    }
                    if (item.dataIndex === "measureHeight") {
                        return ({
                            ...item,
                            render: (number: number, record: any, index: number) => {
                                    return <Form.Item name={['submit', index, 'height']} initialValue={number} rules={[
                                        {
                                            validator: (rule, value, callback) => {
                                                const resData:any = (editForm.getFieldsValue(true).submit)[index]
                                                const hei = calcObj.calculateHeight(resData.materialName,resData.structureSpec)
                                                if(!value&&['槽钢','不锈钢槽钢','H型钢','工字钢'].includes(resData.materialName)){
                                                    callback(`请输入高度`);
                                                }else if((resData?.measureHeightMax&&value > Number(resData?.measureHeightMax)+Number(hei) )||(resData?.measureHeightMin&&value< Number(resData?.measureHeightMin) +Number(hei))){
                                                    callback(`请输入大于或等于${Number(resData?.measureHeightMin) +Number(hei)}且小于或等于${Number(resData?.measureHeightMax)+Number(hei)}的值`);
                                                }else{
                                                    callback()
                                                }
                                            },
                                        },
                                    ]}>
                                        <Input  style={{ width: '100%' }} />
                                    </Form.Item>
                            }
                            
                        })
                    }
                    if (item.dataIndex === "limbWidth") {
                        return ({
                            ...item,
                            render: (number: number, record: any, index: number) => {
                                return <Form.Item name={['submit', index, 'limbWidth']} initialValue={number} rules={[
                                    {
                                        validator: (rule, value, callback) => {
                                            const resData:any = (editForm.getFieldsValue(true).submit)[index]
                                            const limb = calcObj.calculateWidth(resData.materialName,resData.structureSpec,resData.width)
                                            if(!value&&!['钢管','无缝钢管','直缝钢管','圆钢','螺纹钢'].includes(resData.materialName)){
                                                callback(`请输入肢宽`);
                                            }else if((resData?.limbWidthMax&&value>Number(resData?.limbWidthMax)+Number(limb)) ||(resData?.limbWidthMin&&value<Number(resData?.limbWidthMin) +Number(limb))){
                                                callback(`请输入大于或等于${Number(resData?.limbWidthMin) +Number(limb)}且小于或等于${Number(resData?.limbWidthMax)+Number(limb)}的值`);
                                            }else{
                                                callback()
                                            }
                                        },
                                    },
                                ]}>
                                    <Input  style={{ width: '100%' }} />
                                </Form.Item>
                            }
                        })
                    }
                    if (item.dataIndex === "thickness") {
                        return ({
                            ...item,
                            render: (number: number, record: any, index: number) => {
                                return <Form.Item name={['submit', index, 'thickness']} initialValue={number} rules={[
                                    {
                                        validator: (rule, value, callback) => {
                                            const resData:any = (editForm.getFieldsValue(true).submit)[index]
                                            const thickness= calcObj.calculateThickness(resData.materialName,resData.structureSpec)
                                            if(!value&&!['圆钢','螺纹钢'].includes(resData.materialName)){
                                                callback(`请输入厚度`);
                                            }else if((resData?.thicknessMax&&value>Number(resData?.thicknessMax)+Number(thickness) )||(resData?.thicknessMin&&value< Number(resData?.thicknessMin)+Number(thickness) )){
                                                callback(`请输入大于或等于${Number(resData?.thicknessMin)+Number(thickness)}且小于或等于${Number(resData?.thicknessMax)+Number(thickness)}的值`);
                                            }else{
                                                callback()
                                            }
                                        },
                                    },
                                ]}>
                                    <Input  style={{ width: '100%' }} />
                                </Form.Item>
                            }
                        })
                    }
                    if (item.dataIndex === "caliber") {
                        return ({
                            ...item,
                            render: (number: number, record: any, index: number) => {
                                return <Form.Item name={['submit', index, 'caliber']} initialValue={number} rules={[
                                    {
                                        validator: (rule, value, callback) => {
                                            const resData:any = (editForm.getFieldsValue(true).submit)[index]
                                            const caliber= calcObj.calculatePipeDiameter(resData.materialName,resData.structureSpec)
                                            if(!value&&['钢管','无缝钢管','直缝钢管','圆钢','螺纹钢','H型钢'].includes(resData.materialName)){
                                                callback(`请输入管径`);
                                            }else if((resData?.caliberMax && value > Number(resData?.caliberMax) + Number(caliber) )||(resData?.caliberMin&&value< Number(resData?.caliberMin)+Number(caliber) )){
                                                callback(`请输入大于或等于${Number(resData?.caliberMin)+Number(caliber)}且小于或等于${Number(resData?.caliberMax) + Number(caliber)}的值`);
                                            }else{
                                                callback()
                                            }
                                        },
                                        
                                    },
                                ]}>
                                    <Input  style={{ width: '100%' }} />
                                </Form.Item>
                            }
                        })
                    }
                    if (item.dataIndex === "测量长度") {
                        return ({
                            ...item,
                            render: (number: number, record: any, index: number) => {
                                return <Form.Item name={['submit', index, 'gageLength']} initialValue={number} rules={[
                                    {
                                        validator: (rule, value, callback) => {
                                            const resData:any = (editForm.getFieldsValue(true).submit)[index]
                                            const gageLength = resData.length
                                            if((resData?.gageLengthMax&& value>Number(resData?.gageLengthMax)+Number(gageLength) )||(resData?.gageLengthMin && value< Number(resData?.gageLengthMin)+Number(gageLength))){
                                                callback(`请输入大于或等于${Number(resData?.gageLengthMin)+Number(gageLength)}且小于或等于${Number(resData?.gageLengthMax)+Number(gageLength)}的值`);
                                            }else{
                                                callback()
                                            }
                                        },
                                        
                                    },
                                ]}>
                                    <Input  style={{ width: '100%' }} />
                                </Form.Item>
                            }
                        })
                    }
                    return item;
                })
            ]}
            dataSource={cargoData.map((item: any, index: number) => ({
                ...item,
                key: item.id || `item-${index}`
            })) || []}
            rowSelection={{
                selectedRowKeys: select,
                type: "checkbox",
                onChange: onSelectChange,
                // onSelect: onSelectChange,
                // onSelectAll,
                getCheckboxProps: data?.getCheckboxProps
            }}
        />
    </Spin>
})