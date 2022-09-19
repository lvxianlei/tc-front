import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, Form, message, Spin, Modal, Space } from 'antd'
import { DetailTitle, BaseInfo, formatData, EditableTable } from '../../common'
import ChooseModal from "./ChooseModal"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { unloadModeOptions, settlementModeOptions, materialTextureOptions, materialStandardOptions } from "../../../configuration/DictionaryOptions"
import { BasicInformation, editCargoDetails } from "./receivingListData.json"

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
    count?: string
    weight?: string
    taxPrice?: string
    unTaxPrice?: string
}

export const calcObj = {
    /**
     *  含税金额 
     * 选择过磅计量时，含税金额 = 单价 × 结算重量
     * @meteringMode 计量方式
    */
    totalTaxPrice: (
        price: any = 0,
        weight: any = 0
    ) => (price * weight).toFixed(2),
    /** 
     *  不含税金额
     * 含税金额 / ( 1 + 材料税率 / 100 )
     */
    totalUnTaxPrice: (totalTaxPrice: any = 0, taxMode: any = 0) =>
        (totalTaxPrice / (1 + taxMode / 100)).toFixed(2),
    /** 
     *  结算重量
     * 选择理算计算时，取理算重量
     * 选择过磅计算时，结算重量 = 过磅重量 *（ 当前原材料理重 / 收货单中所有原材料理重之和 ）
     * 可修改，修改后过磅重量同步调整
     * @meteringMode 计量方式 1:理重；2:过磅
     * @totalPonderationWeight 过磅重量
     * @allTotalWeight 收货单中所有原材料理重之和
     * @totalWeight 理算重量  选填
    */
    balanceTotalWeight: (
        meteringMode: 1 | 2,
        weight: any = 0,
        num: any = 0,
        totalPonderationWeight: any = 0,
        allTotalWeight: any = 0,
        totalWeight?: any
    ) => {
        //当前理重
        const currentWeight: any = totalWeight === undefined ? (weight * num).toFixed(4) : totalWeight
        if (meteringMode === 1) {
            return currentWeight
        }
        return (totalPonderationWeight * (currentWeight / allTotalWeight)) || "0"
    },
    /**
     *  不含税单价
     * 含税单价 / ( 1 + 材料税率 / 100 )
     * 保留六位小数
     */
    unTaxPrice: (taxPrice: any = 0, taxMode: any = 0) =>
        (taxPrice / (1 + taxMode / 100)).toFixed(6),
    /**
     *  理算总重量
     * 单重 * 数量
     */
    totalWeight: (weight: any = 0, num: any = 0) => (weight * num).toFixed(4)
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

    const { loading: materialLoading, data: materialData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/tax/taxMode/material`)
            resole(result)
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
            setCargoData(result?.lists.map((item: any) => ({
                ...item,
                num: item.num ? item.num : 0
            })) || [])
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

    const handleModalOk = () => {
        const meteringMode = form.getFieldValue("meteringMode")
        const totalPonderationWeight = form.getFieldValue("totalPonderationWeight") || "0"
        // 所有明细理算重量总和
        const allTotalWeight = modalRef.current?.dataSource.reduce((total, item) =>
            (parseFloat(total) + parseFloat(calcObj.totalWeight(item.weight, item.num))).toFixed(4), 0)
        const dataSource: any[] = modalRef.current?.dataSource.map((item: any) => {
            // 结算重量
            const balanceTotalWeight = calcObj.balanceTotalWeight(
                meteringMode,
                item.weight,
                item.num,
                totalPonderationWeight,
                allTotalWeight)
            // 含税金额
            const totalTaxPrice = calcObj.totalTaxPrice(item.taxPrice, balanceTotalWeight)
            // 不含税金额
            const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, materialData?.taxVal)

            const postData = {
                ...item,
                materialContractDetailId: item.id,
                materialName: item.materialName,
                materialStandard: item.materialStandard,
                // materialStandardName: item.materialStandardName,
                num: item.num,
                contractUnitPrice: item.taxPrice,
                taxPrice: item.taxPrice,
                /** 理算重量 */
                weight: item.weight,
                /** 理算总重量 */
                totalWeight: calcObj.totalWeight(item.weight, item.num),
                balanceTotalWeight,
                totalTaxPrice,
                totalUnTaxPrice,
                unTaxPrice: calcObj.unTaxPrice(item.taxPrice, materialData?.taxVal),
                appearance: item.appearance || 1
            }
            delete postData.id
            return postData
        })
        setCargoData(dataSource)
        setVisible(false);
    }

    const onSubmit = () => new Promise(async (resole, reject) => {
        try {
            const baseFormData = await form.validateFields()
            const listsFormData = await editForm.validateFields()
            listsFormData?.submit?.map((item: any, index: number) => {
                const v = editForm?.getFieldsValue(true)?.submit[index];
                item["weight"] = v?.weight || item?.weightAlgorithm === "1" ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                    : item?.weightAlgorithm === "2" ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                        : (Number(item?.proportion || 1) / 1000).toFixed(3)
            })
            const result = {
                ...baseFormData,
                supplierId,
                supplierName: baseFormData.supplierId.value,
                // contractNumber: baseFormData.contractNumber.value,
                lists: listsFormData.submit?.map((item: any, index: number) => ({
                    ...cargoData[index],
                    ...item,
                    materialContractDetailId: cargoData[index].materialContractDetailId
                })),
                num: baseFormData.num,
                unloadUsersName: baseFormData.unloadUsersName.value,
                unloadUsers: baseFormData.unloadUsersName.records.map((item: any) => item.userId).join(","),
            }
            await saveRun(result)
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
            console.log(fields.supplierId)
            setSupplierId(fields.supplierId.id)
            modalRef.current?.resetFields()
            const supplierData: any = fields.supplierId.records[0]
            form.setFieldsValue({
                // supplierName: supplierData.supplierName,
                contactsUser: supplierData.contactMan,
                contactsPhone: supplierData.contactManTel
            })
            setCargoData([])
        }
        if (fields.meteringMode || fields.totalPonderationWeight) {
            const meteringMode = form.getFieldValue("meteringMode")
            const totalPonderationWeight = fields.totalPonderationWeight || form.getFieldValue("totalPonderationWeight") || "0"
            const editData = editForm.getFieldsValue().submit
            // 所有明细理算重量总和
            const allTotalWeight = editData?.reduce((total: any, item: any) =>
                (parseFloat(total) + parseFloat(item.totalWeight)).toFixed(4), 0)
            const dataSource: any[] = editData?.map((item: any, index: number) => {
                // 结算重量
                const balanceTotalWeight = calcObj.balanceTotalWeight(
                    meteringMode,
                    item.weight,
                    item.num,
                    totalPonderationWeight,
                    allTotalWeight,
                    item.totalWeight
                )
                // 含税金额
                const totalTaxPrice = calcObj.totalTaxPrice(item.taxPrice, balanceTotalWeight)
                // 不含税金额
                const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, materialData?.taxVal)
                const postData = {
                    ...item,
                    ...cargoData[index],
                    totalTaxPrice,
                    totalUnTaxPrice,
                    balanceTotalWeight
                }
                return postData
            })
            setCargoData(dataSource || [])
        }
    }

    const handleEditableChange = (data: any, allValues: any) => {
        const changeIndex = data.submit.length - 1
        const changeFiled = data.submit[changeIndex]
        if (changeFiled.balanceTotalWeight) {
            const meteringMode = form.getFieldValue("meteringMode")
            const dataSource: any[] = [...allValues?.submit]
            const totalTaxPrice = calcObj.totalTaxPrice(
                dataSource[changeIndex].taxPrice,
                changeFiled.balanceTotalWeight)
            const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, materialData?.taxVal)
            dataSource[changeIndex] = {
                ...dataSource[changeIndex],
                totalTaxPrice,
                totalUnTaxPrice
            }
            if (meteringMode === 2) {
                const totalPonderationWeight = allValues.submit?.reduce((count: string, item: any) =>
                    (parseFloat(count) + parseFloat(`${item.balanceTotalWeight}`)).toFixed(3), "0")
                form.setFieldsValue({ totalPonderationWeight })
            }
            setCargoData(dataSource || [])
        }
        if (changeFiled.length) {
            const result = editForm.getFieldsValue(true).submit[changeIndex];
            const dataSource: any[] = cargoData
            const meteringMode = form.getFieldValue("meteringMode")
            const totalPonderationWeight = form.getFieldValue("totalPonderationWeight") || "0"
            // 所有明细理算重量总和
            const allTotalWeight = modalRef.current?.dataSource.reduce((total, item) =>
                (parseFloat(total) + parseFloat(calcObj.totalWeight(item.weight, item.num))).toFixed(4), 0)
            // 结算重量
            const balanceTotalWeight = calcObj.balanceTotalWeight(
                meteringMode,
                (((result.proportion || 1) * changeFiled.length) / 1000 / 1000).toFixed(3),
                result.num,
                totalPonderationWeight,
                allTotalWeight)
            // 含税金额
            const totalTaxPrice = calcObj.totalTaxPrice(result.taxPrice, balanceTotalWeight)
            // 不含税金额
            const totalUnTaxPrice = calcObj.totalUnTaxPrice(totalTaxPrice, materialData?.taxVal)
            dataSource[changeIndex] = {
                ...dataSource[changeIndex],
                /** 理算重量 */
                weight: (((result.proportion || 1) * changeFiled.length) / 1000 / 1000).toFixed(3),
                /** 理算总重量 */
                totalWeight: calcObj.totalWeight((((result.proportion || 1) * changeFiled.length) / 1000 / 1000).toFixed(3), result.num),
                balanceTotalWeight,
                totalTaxPrice,
                totalUnTaxPrice,
                unTaxPrice: calcObj.unTaxPrice(result.taxPrice, materialData?.taxVal),
            }
            setCargoData(dataSource || [])
        }
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        const seletTotal = selectRows.reduce((total: TotalState, current: any) => ({
            count: parseFloat(total.count || "0") + parseFloat(current.num),
            weight: parseFloat(total.weight || "0") + parseFloat(current.balanceTotalWeight),
            taxPrice: parseFloat(total.taxPrice || "0") + parseFloat(current.totalTaxPrice),
            unTaxPrice: parseFloat(total.unTaxPrice || "0") + parseFloat(current.totalUnTaxPrice)
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
                meteringMode: 1,
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
            <div><span>数量合计：</span><span>{total.count || "0"}</span></div>
            <div><span>重量合计(吨)：</span><span>{total.weight || "0"}</span></div>
            <div><span>含税金额合计(元)：</span><span>{total.taxPrice || "0"}</span></div>
            <div><span>不含税金额合计(元)：</span><span>{total.unTaxPrice || "0"}</span></div>
        </Space>
        <EditableTable
            haveIndex={false}
            form={editForm}
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
                    return item;
                })
            ]}
            dataSource={cargoData || []}
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