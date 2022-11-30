import React, {forwardRef, useImperativeHandle, useState, useRef, useEffect} from "react"
import {Button, Modal, Spin, Form, InputNumber, message, Select} from "antd"
import {BaseInfo, DetailTitle, Attachment, CommonTable, PopTableContent} from "../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import AuthUtil from "../../utils/AuthUtil"
import moment from "moment"
import {
    deliverywayOptions, materialStandardOptions,
    materialTextureOptions, transportationTypeOptions,
    settlementModeOptions, supplierTypeOptions
} from "../../configuration/DictionaryOptions"
import {contractBaseInfo, material, addMaterial} from "./contract.json"

// 新加运费信息
import {freightInformation, HandlingChargesInformation} from "./Edit.json";

interface EditProps {
    id: string
    type: "new" | "edit",
    visibleP: boolean
}

interface WeightParams {
    width: number | string
    length: number | string
    weightAlgorithm: number
    proportion: number | string
}

interface TotalWeightParmas extends WeightParams {
    num: number | string
}

const oneFreight = [{
    "title": "运输承担",
    "dataIndex": "transportBear",
    "type": "select",
    "enum": [
        {
            "value": 1,
            "label": "供方"
        },
        {
            "value": 2,
            "label": "需方"
        }
    ],
    "rules": [
        {
            "required": true,
            "message": "请选择运输承担..."
        }
    ]
}]
const oneStevedoring = [{
    "title": "卸车承担",
    "dataIndex": "unloadBear",
    "type": "select",
    "enum": [
        {
            "value": 1,
            "label": "供方"
        },
        {
            "value": 2,
            "label": "需方"
        }
    ],
    "rules": [
        {
            "required": true,
            "message": "请选择卸车承担..."
        }
    ]
}]
const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))
const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))
const transportMethodEnum = transportationTypeOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))
const settlementModeEnum = settlementModeOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))
const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))
export const calcFun = {
    /**
     *  运费-不含税价格
     * 运费不含税价格=运费含税价格 /（ 1 + 运费税率 / 100 )
     */
    transportPrice: (taxPrice: any = 0, tax: any = 0) =>
        (taxPrice / (1 + tax / 100)).toFixed(6),
    /**
     *  装卸费-不含税价格
     * 装卸费不含税价格=装卸费含税价格/（1+运费税率/100)
     */
    unloadPrice: (taxPrice: any = 0, tax: any = 0) =>
        (taxPrice / (1 + tax / 100)).toFixed(6),
    /**
     * 理重
     */
    weight: ({length, width, weightAlgorithm, proportion}: WeightParams) => {
        if (weightAlgorithm === 1) {
            return ((Number(proportion || 1) * Number(length || 1)) / 1000 / 1000).toFixed(3)
        }
        if (weightAlgorithm === 2) {
            return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) / 1000 / 1000 / 1000).toFixed(3)
        }
        return (Number(proportion || 1) / 1000).toFixed(3)
    },
    /**
     * 总重量
     */
    totalWeight: ({length, width, weightAlgorithm, proportion, num}: TotalWeightParmas) => {
        if (weightAlgorithm === 1) {
            return ((Number(proportion || 1) * Number(length || 1)) * Number(num || 1) / 1000 / 1000).toFixed(3)
        }
        if (weightAlgorithm === 2) {
            return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) * Number(num || 1) / 1000 / 1000 / 1000).toFixed(3)
        }
        return (Number(proportion || 1) * Number(num || "1") / 1000).toFixed(3)
    }
}
const retain = (num: string, decimal: number) => {
    num = num.toString();
    let index = num.indexOf('.');
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}
export default forwardRef(function ({id, type, visibleP}: EditProps, ref): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [isDisabled, setDisabled] = useState<boolean>(true)
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [materialList, setMaterialList] = useState<any[]>([])
    const [supplierId, setSupplierId] = useState<string>("")
    const [baseForm] = Form.useForm()
    const [freightForm] = Form.useForm()
    const [stevedoringForm] = Form.useForm()
    const [detail, setDetail] = useState<any>({})
    const attchsRef = useRef<{ getDataSource: () => any[], resetFields: () => void }>({
        getDataSource: () => [],
        resetFields: () => {
        }
    })

    const [colunmnBase, setColunmnBase] = useState<any[]>(contractBaseInfo);
    const [addMaterialBy, setAddMaterialBy] = useState<string>(addMaterial.path);
    // 运费的数组
    const [newfreightInformation, setNewfreightInformation] = useState<any>(oneFreight); // 运费信息
    // 装卸费
    const [newHandlingChargesInformation, setNewHandlingChargesInformation] = useState<any>(oneStevedoring); // 装卸费信息

    const {
        loading: taxLoading,
        data: taxData
    } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const materialTax: any = await RequestUtil.get(`/tower-storage/tax/taxMode/material`)
            const freightTax: any = await RequestUtil.get(`/tower-storage/tax/taxMode/freight`)
            const loadUnloadTax: any = await RequestUtil.get(`/tower-storage/tax/taxMode/load_unload`)
            resove({
                materialTax: materialTax?.taxVal,
                freightTax: freightTax?.taxVal,
                loadUnloadTax: loadUnloadTax?.taxVal
            })
            // 供应商类型查询增加选项
            setColunmnBase(colunmnBase.map(((item: any) => {
                if (item.dataIndex === "supplier") {
                    return ({
                        ...item,
                        disabled: false,
                        search: item.search.map((searchItem: any) => {
                            if (searchItem.dataIndex == 'supplierType') {
                                console.log(supplierTypeEnum)
                                return {
                                    ...searchItem,
                                    enum: supplierTypeEnum
                                }
                            } else {
                                return searchItem
                            }
                        }),
                        columns: item.columns.map((columnsItem: any) => {
                            if (columnsItem.dataIndex == 'supplierType') {
                                return {
                                    ...columnsItem,
                                    enum: supplierTypeEnum
                                }
                            } else {
                                return columnsItem
                            }
                        })

                    })
                }

                return item
            })))
        } catch (error) {
            reject(error)
        }
    }))

    const {loading, data} = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialAuxiliaryContract/${id}`)
            setDetail(result)
            const taxNum = await RequestUtil.get(`/tower-storage/tax`)
            // 辅料列表 -字段对应处理
            let list: any[] = result?.materialAuxiliaryContractDetails || []
            // 检查是否有明细被收货单引用，如果被引用了则禁止编辑
            let canEdit: boolean = list.every(item => item.isReceiveStockRef != 2)
            baseForm.setFieldsValue({
                ...result,
                operator: {id: result.operatorId, value: result.operatorName},
                supplier: {id: result.supplierId, value: result.supplierName},
                // purchasePlan: { id: result.purchasePlanId, value: result.purchasePlanNumber },
                // 税率
                taxRate: result.tax,
                // 交货方式
                deliveryMethod: result.deliveryMethod
            })
            // 设置基础信息禁止编辑时，基础数据
            setDisabled(canEdit)

            setSupplierId(result.supplierId)
            setAddMaterialBy(`/tower-supply/auxiliaryComparisonPrice/getComparisonPriceDetailById?supplierId=${result.supplierId}&comparisonStatus=2`)
            // 运输费
            if (result?.transportBear?.transportBear == 1) {
                setNewfreightInformation(oneFreight.slice(0))
                //  todo 清空运输费金额
            } else {
                // 需方
                setNewfreightInformation(
                    freightInformation.map((item: any) => {
                        if (item.dataIndex === "transportCompanyId") {
                            return ({
                                ...item,
                                enum: companyList
                            })
                        }
                        return item
                    })
                );
            }
            freightForm.setFieldsValue({
                ...result.transportBear,
                transportCompanyId: result.transportBear.transportCompanyId + ',' + result.transportBear.transportCompany
            })

            // 装卸费
            if (result?.unloadBear?.unloadBear == 1) {
                setNewHandlingChargesInformation(oneStevedoring.slice(0))
            } else {
                setNewHandlingChargesInformation(
                    HandlingChargesInformation.map((item: any) => {
                        if (item.dataIndex === "transportCompanyId") {
                            return ({
                                ...item,
                                enum: companyList
                            })
                        }
                        return item
                    })
                );
            }
            stevedoringForm.setFieldsValue({
                ...result.unloadBear,
                unloadCompanyId: result.unloadBear.unloadCompanyId + ',' + result.unloadBear.unloadCompany
            })

            list.forEach(el => {
                // 不含税单价
                el.offer = el.price
                // 含税单价
                el.taxOffer = el.taxPrice
                // 详情ID
                // el.comparisonPriceDetailId = el.id
            })
            console.log(list)
            setMaterialList(list)
            setPopDataList(list)
            console.log(list)
            resove({...result, tax: taxNum})
        } catch (error) {
            reject(error)
        }
    }), {manual: type === "new", refreshDeps: [id]})

    const {data: stevedoreCompanyList} = useRequest<any>(() => new Promise(async (resove, reject) => {
        try {
            const data: any = await RequestUtil.get(`/tower-supply/stevedoreCompany?size=100`);
            const list = data?.records?.map((item: { stevedoreCompanyName: string, id: string }) => {
                return {
                    ...item,
                    name: item.stevedoreCompanyName,
                    value: item?.id + ',' + item?.stevedoreCompanyName,
                    label: item?.stevedoreCompanyName
                }
            })
            resove(list)
        } catch (error) {
            reject(error)
        }
    }))

    const {data: companyList} = useRequest<any>(() => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-logistic/carrier?size=100`);
            const list = result?.records?.map((item: { companyName: string, id: string }) => {
                return {
                    ...item,
                    name: item.companyName,
                    value: item?.id + ',' + item?.companyName,
                    label: item?.companyName
                }
            })
            resove(list)
        } catch (error) {
            reject(error)
        }
    }))

    const {run: saveRun} = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/materialAuxiliaryContract`, type === "new" ? data : ({
                ...data,
                id
            }))
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

    const {run: getComparisonPrice} = useRequest<any[]>((supplierId: string) => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/auxiliaryComparisonPrice/getComparisonPriceDetailById?supplierId=${supplierId}&comparisonStatus=2`)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

    const handleAddModalOk = () => {
        const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // const newMaterialList: any[] = [...materialList]
        // newMaterialList.forEach(item => {
        //     item.comparisonPriceDetailId = item.comparisonPriceDetailId || item.id
        //     console.log(item.comparisonPriceDetailId)
        //     delete item.id
        // })

        let list = [...materialList.map(
            (item) => {
                let obj = {
                    ...item,
                    comparisonPriceDetailId: item.comparisonPriceDetailId || item.id
                }
                // 如果辅材信息是选择比价结果的，那么删除id
                if(item.source == 2){
                    delete obj.id
                }
                return obj
            }
        ), ...newMaterialList]
        // 去重操作 提交的时候不能出现两个以及以上一样的 无法添加相同物料名称的辅料 comparisonPriceDetailId
        const arrs: any[] = []
        list.forEach((item: any) => {
            console.log(item)
            let flag = arrs.every((el: any) => el.comparisonPriceDetailId !== item.comparisonPriceDetailId)
            if (flag || arrs.length == 0) {
                arrs.push(item)
            }
        })
        console.log(popDataList, materialList)
        setMaterialList([...newMaterialList])
        setPopDataList([...newMaterialList])
        // 更新价格
        const resultList = updataAllPrice(arrs)
        setMaterialList(resultList)
        setPopDataList(resultList)
        setVisible(false)
    }

    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.comparisonPriceDetailId !== id))
        setPopDataList(materialList.filter((item: any) => item.comparisonPriceDetailId !== id))
    }

    useImperativeHandle(ref, () => ({onSubmit, onSubmitApproval, resetFields, setCanEditBaseInfo, onSubmitCancel}), [ref, materialList])
    const setCanEditBaseInfo = () => {
        setDisabled(false)
    }
    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            if([undefined, 0,'0',2,'2',3,'3',4,'4'].includes(detail?.approval)){
                const baseInfo = await baseForm.validateFields()
                const freightInfo = await freightForm.validateFields()
                const stevedoringInfo = await stevedoringForm.validateFields()
                // 再次更新计算价格
                // console.log(popDataList)
                // console.log(materialList)
                // debugger
                let list = updataAllPrice(materialList)
                setMaterialList(list)
                setPopDataList(list)
                // console.log(list)
                const values = {
                    ...baseInfo,
                    isApproval: false,
                    fileIds: attchsRef.current.getDataSource().map(item => item.id),
                    operatorId: AuthUtil.getUserInfo().user_id,
                    supplierId: baseInfo.supplier.id,
                    supplierName: baseInfo.supplier.value,
                    tax: baseInfo.taxRate,
                    transportBear: {
                        ...freightInfo,
                        transportTaxPrice:freightInfo.transportBear == 2 ? freightInfo.transportTaxPrice:0,
                        transportPrice:freightInfo.transportBear == 2 ? freightInfo.transportPrice:0,
                        transportCompanyId: freightInfo?.transportCompanyId?.split(',')[0],
                        transportCompany: freightInfo?.transportCompanyId?.split(',')[1]
                    },
                    unloadBear: {
                        ...stevedoringInfo,
                        unloadTaxPrice:stevedoringInfo.unloadBear == 2 ? stevedoringInfo.unloadTaxPrice:0,
                        unloadPrice:stevedoringInfo.unloadBear == 2 ? stevedoringInfo.unloadPrice:0,
                        unloadCompanyId: stevedoringInfo?.unloadCompanyId?.split(',')[0],
                        unloadCompany: stevedoringInfo?.unloadCompanyId?.split(',')[1],
                    },
                    materialAuxiliaryContractDetails: list.map((item: any) => {
                        let obj = {
                            ...item,
                            taxPrice: Number(item.taxOffer).toFixed(6),
                            price: Number(item.offer).toFixed(6),
                            totalTaxAmount: Number(item.totalTaxAmount).toFixed(6),
                            totalAmount: Number(item.totalAmount).toFixed(6),
                            // taxTotalAmount: item.taxTotalAmount,
                            // totalAmount: item.totalAmount,
                            comparisonPriceId: item.comparisonPriceId,
                            // comparisonPriceDetailId:item.id,
                            // comparisonPriceNumber:'0123456789'
                        }
                        return (obj)
                    })
                }
                await saveRun(values)
                message.success("保存成功...")
                resove(true)
            }else{
                message.error("当前正在审批中，请撤销审批后再进行修改！")
                throw new Error('当前正在审批，不可修改！')
            }
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
    const onSubmitApproval = () => new Promise(async (resove, reject) => {
        try {
            if([undefined,0,'0',2,'2',3,'3',4,'4'].includes(detail?.approval)){
                const baseInfo = await baseForm.validateFields()
                const freightInfo = await freightForm.validateFields()
                const stevedoringInfo = await stevedoringForm.validateFields()
                // 再次更新计算价格
                // console.log(popDataList)
                // console.log(materialList)
                // debugger
                let list = updataAllPrice(materialList)
                setMaterialList(list)
                setPopDataList(list)
                // console.log(list)
                const values = {
                    ...baseInfo,
                    isApproval: true,
                    fileIds: attchsRef.current.getDataSource().map(item => item.id),
                    operatorId: AuthUtil.getUserInfo().user_id,
                    supplierId: baseInfo.supplier.id,
                    supplierName: baseInfo.supplier.value,
                    tax: baseInfo.taxRate,
                    transportBear: {
                        ...freightInfo,
                        transportTaxPrice:freightInfo.transportBear == 2 ? freightInfo.transportTaxPrice:0,
                        transportPrice:freightInfo.transportBear == 2 ? freightInfo.transportPrice:0,
                        transportCompanyId: freightInfo?.transportCompanyId?.split(',')[0],
                        transportCompany: freightInfo?.transportCompanyId?.split(',')[1]
                    },
                    unloadBear: {
                        ...stevedoringInfo,
                        unloadTaxPrice:stevedoringInfo.unloadBear == 2 ? stevedoringInfo.unloadTaxPrice:0,
                        unloadPrice:stevedoringInfo.unloadBear == 2 ? stevedoringInfo.unloadPrice:0,
                        unloadCompanyId: stevedoringInfo?.unloadCompanyId?.split(',')[0],
                        unloadCompany: stevedoringInfo?.unloadCompanyId?.split(',')[1],
                    },
                    materialAuxiliaryContractDetails: list.map((item: any) => {
                        let obj = {
                            ...item,
                            taxPrice: Number(item.taxOffer).toFixed(6),
                            price: Number(item.offer).toFixed(6),
                            totalTaxAmount: Number(item.totalTaxAmount).toFixed(6),
                            totalAmount: Number(item.totalAmount).toFixed(6),
                            // taxTotalAmount: item.taxTotalAmount,
                            // totalAmount: item.totalAmount,
                            comparisonPriceId: item.comparisonPriceId,
                            // comparisonPriceDetailId:item.id,
                            // comparisonPriceNumber:'0123456789'
                        }
                        return (obj)
                    })
                }
                await saveRun(values)
                message.success("审批发起成功...")
                resove(true)
            }else{
                message.error("当前不可发起审批！")
                throw new Error('当前不可发起审批！')
            }
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
    const onSubmitCancel = () => new Promise(async (resove, reject) => {
        try {
            if([1,'1'].includes(detail?.approval)){
                await RequestUtil.get(`/tower-supply/workflow/contract/cancel/${id}/2`)
                message.success("撤销成功...")
                resove(true)
            }
            else{
                await message.error("不可撤销...")
                throw new Error('不可撤销')
            }
        } catch (error) {
            reject(false)
        }
    })
    const resetFields = () => {
        baseForm.resetFields()
        attchsRef.current?.resetFields()
        setMaterialList([])
        setPopDataList([])
    }

    const handleBaseInfoChange = async (fields: any, allFields: any) => {
        if (fields.supplier) {
            setSupplierId(fields.supplier.id)
            // 供应商选择后，更新询比价查询参数
            setAddMaterialBy(`/tower-supply/auxiliaryComparisonPrice/getComparisonPriceDetailById?supplierId=${fields.supplier.id}&comparisonStatus=2`)
            // const meterialList: any[] = await getComparisonPrice(fields.supplier.id)
            // 重新选择供应商后，清空已选择的比价结果
            setMaterialList([])
            setPopDataList([])
        }
        // todo 税率变更时，更新所有价格
        if (fields?.taxRate) {
            let list = updataAllPrice(popDataList)
            setMaterialList(list)
            setPopDataList(list)
        }
    }

    // 变化重新计算所有价格
    const updataAllPrice = (list: any) => {
        const newMaterialList = list.map((item: any) => {
            const baseInfo = baseForm.getFieldsValue()
            // 当前税率
            let taxRate = baseInfo.taxRate || 0
            // 数量 保留一位小数
            let num = Number(item.num || 1)
            // 含税单价
            let taxPrice = item.taxOffer || 1
            // 不含税单价 含税单价/（1+本次税率）
            let price: any = taxPrice / (1 + (taxRate / 100))
            // console.log(price)
            // console.log(item)
            // console.log(taxRate,num,taxPrice,price)
            return {
                ...item,
                taxPrice,
                price: Number(price).toFixed(6),
                offer: Number(price).toFixed(6),
                // 含税金额总计 数量*含税单价  保留两位小数
                totalTaxAmount: (taxPrice * num).toFixed(2),
                // 不含税金额总计
                totalAmount: (price * num).toFixed(2),
            }
        })
        console.log(newMaterialList)
        return newMaterialList
        // setMaterialList(newMaterialList)
        // setPopDataList(newMaterialList)
    }
    const handleNumChange = (value: number, comparisonPriceDetailId: string, dataIndex: string, id?: string) => {
        console.log(value, comparisonPriceDetailId, dataIndex, id)
        const newData = popDataList.map((item: any) => {
            if (item.comparisonPriceDetailId === id) {
                item[dataIndex] = value
            }
            return item;
        })
        // const newData = popDataList.map((item: any) => {
        //     if (item.materialCode === materialCode) {
        //         const allData: any = {
        //             num: parseFloat(item.num || "1"),
        //             taxPrice: parseFloat(item.taxPrice || "1.00"),
        //             price: parseFloat(item.price || "1.00"),
        //             weight: calcFun.weight({
        //                 weightAlgorithm: item.weightAlgorithm,
        //                 proportion: item.proportion,
        //                 length: item.length,
        //                 width: item.width,
        //                 [type]: value
        //             }),
        //             totalWeight: calcFun.totalWeight({
        //                 length: item.length,
        //                 width: item.width,
        //                 proportion: item.proportion,
        //                 weightAlgorithm: item.weightAlgorithm,
        //                 num: item.num,
        //                 [type]: value
        //             })
        //         }
        //         allData[dataIndex] = value
        //         return ({
        //             ...item,
        //             taxTotalAmount: (allData.num * allData.taxPrice * allData.weight).toFixed(2),
        //             totalAmount: (allData.num * allData.price * allData.weight).toFixed(2),
        //             totalWeight: calcFun.totalWeight({
        //                 length: item.length,
        //                 width: item.width,
        //                 proportion: item.proportion,
        //                 weightAlgorithm: item.weightAlgorithm,
        //                 num: item.num,
        //                 [type]: value
        //             }),
        //             [dataIndex]: value
        //         })
        //     }
        //     return item
        // })

        let resultList = updataAllPrice(newData.slice(0));
        setMaterialList(resultList);
        setPopDataList(resultList)


    }

    // 抽离防止diff算法重新渲染 导致失焦
    const numInputDoneRender = (value: number, records: any, key: number, item: any) => {
        return < InputNumber
            min={1}
            value={value || 1}
            disabled={records.isReceiveStockRef === 2}
            onChange={(value: number) => handleNumChange(value, records.num, item.dataIndex, records.comparisonPriceDetailId)}
            key={key}
        />
    }
    // 运费信息
    const handleBaseInfoChangeFreight = (changeFiled: any) => {
        if (changeFiled.transportBear) {
            // 确定是运输承担改变
            if (changeFiled.transportBear === 1) {
                // 供方
                setNewfreightInformation(oneFreight.slice(0))
            } else {
                // 需方
                setNewfreightInformation(
                    freightInformation.map((item: any) => {
                        if (item.dataIndex === "transportCompanyId") {
                            return ({
                                ...item,
                                enum: companyList
                            })
                        }
                        return item
                    })
                );
            }
            // 并且置空
            freightForm.setFieldsValue({
                transportBear: changeFiled.transportBear,
                transportCompanyId: '',
                transportTaxPrice: '',
                transportPrice: ''
            })
        }
        if (changeFiled.transportTaxPrice) {
            freightForm.setFieldsValue({
                transportPrice: calcFun.transportPrice(changeFiled.transportTaxPrice, taxData?.freightTax)
            })
        }
    }

    // 装卸费信息
    const handleBaseInfoChangeStevedoring = (changeFiled: any) => {
        if (changeFiled.unloadBear) {
            // 确定是运输承担改变
            if (changeFiled.unloadBear === 1) {
                // 供方
                setNewHandlingChargesInformation(oneStevedoring.slice(0))
            } else {
                // 需方
                setNewHandlingChargesInformation(
                    HandlingChargesInformation.map((item: any) => {
                        if (item.dataIndex === "transportCompanyId") {
                            return ({
                                ...item,
                                enum: companyList
                            })
                        }
                        return item
                    })
                );
            }
            // 并且置空
            stevedoringForm.setFieldsValue({
                unloadBear: changeFiled.unloadBear,
                unloadCompanyId: '',
                unloadTaxPrice: '',
                unloadPrice: ''
            })
        }
        if (changeFiled.unloadTaxPrice) {
            stevedoringForm.setFieldsValue({
                unloadPrice: calcFun.unloadPrice(changeFiled.unloadTaxPrice, taxData?.loadUnloadTax)
            })
        }
    }
    useEffect(() => {
        if(visibleP){
            baseForm.setFieldsValue({
                operatorName: AuthUtil.getRealName(),
                signingTime: moment(),
                invoiceCharacter: 1,
                meteringMode: 2,
                // deliveryMethod: deliveryMethodEnum?.[0]?.value,
                settlementMode: settlementModeEnum?.[0]?.value,
            })
        }
    },[visibleP])
    return <Spin spinning={loading && taxLoading}>
        <Modal width={addMaterial.width || 520} title={`选择${addMaterial.title}`} destroyOnClose visible={visible}
               onOk={handleAddModalOk} onCancel={() => setVisible(false)}>
            <PopTableContent data={{
                ...(addMaterial as any),
                path: addMaterialBy
                // columns: (addMaterial as any).columns.map((item: any) => {
                //     if (item.dataIndex === "standard") {
                //         return ({
                //             ...item,
                //             type: "select",
                //             enum: materialStandardEnum
                //         })
                //     }
                //     return item
                // })
            }}
                             value={{
                                 id: "",
                                 records: popDataList,
                                 value: ""
                             }}
                             onChange={(fields: any[]) => {
                                 fields.map((element: any, index: number) => {
                                     // console.log(element)
                                     if (element.structureSpec) {
                                         element["spec"] = element.structureSpec;
                                         element["weight"] = ((Number(element?.proportion || 1) * Number(element.length || 1)) / 1000).toFixed(3);
                                         element["totalWeight"] = ((Number(element?.proportion || 1) * Number(element.length || 1) * (element.planPurchaseNum || 1)) / 1000).toFixed(3);
                                     }
                                 });
                                 console.log(fields)
                                 setMaterialList(
                                     fields.map((item: any) => {
                                             let obj = {...item}
                                             // delete obj.id
                                         console.log(obj)
                                             return {
                                                 ...obj,
                                                 num: item?.num || 1,
                                                 spec: item.structureSpec,
                                                 source: item.source || 2,
                                                 taxPrice: item.taxPrice || 1.00,
                                                 price: item.price || 1.00,
                                                 taxTotalAmount: item.taxTotalAmount || 1.00,
                                                 totalAmount: item.totalAmount || 1.00,
                                                 materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                                                 materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                                                 structureTextureId: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                                                 structureTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                                             }
                                         }
                                     )
                                 )
                             }}/>
        </Modal>
        <DetailTitle title="合同基本信息" key="a"/>
        <BaseInfo
            form={baseForm}
            col={2}
            classStyle={"overall-form-class-padding0"}
            onChange={handleBaseInfoChange}
            columns={colunmnBase.map((item: any) => {
                switch (item.dataIndex) {
                    case "deliveryMethod":
                        return ({...item, enum: deliveryMethodEnum, disabled: !isDisabled})
                    case "transportMethod":
                        return ({...item, enum: transportMethodEnum, disabled: !isDisabled})
                    case "settlementMode":
                        return ({...item, enum: settlementModeEnum, disabled: !isDisabled})
                    case "operatorName":
                        return ({...item, enum: settlementModeEnum, disabled: true})
                    default:
                        return {...item, disabled: !isDisabled}
                }
            })}
            dataSource={{...data}} edit/>
        {/*<DetailTitle title="运费信息" key="b" />*/}
        <p style={{fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', margin: 0}}>运费信息
            <p style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', margin: 0}}>
                <span style={{fontWeight: 400}}>运费：含税金额合计（元）：<span style={{
                    color: '#FF8C00',
                    marginRight: 12
                }}>{freightForm.getFieldValue('transportTaxPrice') || 0}</span>
                    不含税金额合计（元）<span style={{color: '#FF8C00'}}>{freightForm.getFieldValue('transportPrice') || 0}</span>
                </span>
            </p>
        </p>
        <BaseInfo
            form={freightForm}
            col={2}
            classStyle="overall-form-class-padding0"
            onChange={handleBaseInfoChangeFreight}
            columns={
                newfreightInformation.map((item: any) => {
                    if (item.dataIndex === "transportCompanyId") {
                        return ({
                            ...item,
                            enum: companyList,
                            disabled: !isDisabled
                        })
                    }
                    if (item.dataIndex === "transportPrice") {
                        return ({
                            ...item,
                            disabled: true
                        })
                    }
                    return {...item, disabled: !isDisabled}
                })
            }
            dataSource={{transportBear: 1}} edit/>
        {/*<DetailTitle title="装卸费信息" key="c" />*/}
        <p style={{fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', margin: 0}}>装卸费信息
            <p style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', margin: 0}}>
                <span style={{fontWeight: 400}}>装卸费：含税金额合计（元）：<span style={{
                    color: '#FF8C00',
                    marginRight: 12
                }}>{stevedoringForm.getFieldValue('unloadTaxPrice') || 0}</span>
                    不含税金额合计（元）<span
                        style={{color: '#FF8C00'}}>{stevedoringForm.getFieldValue('unloadPrice') || 0}</span>
                </span>
            </p>
        </p>
        <BaseInfo
            form={stevedoringForm}
            col={2}
            classStyle="overall-form-class-padding0"
            onChange={handleBaseInfoChangeStevedoring}
            columns={
                newHandlingChargesInformation.map((item: any) => {
                    if (item.dataIndex === "unloadCompanyId") {
                        return ({
                            ...item,
                            enum: stevedoreCompanyList,
                            disabled: !isDisabled
                        })
                    }
                    if (item.dataIndex === "unloadPrice") {
                        return ({
                            ...item,
                            disabled: true
                        })
                    }
                    return {...item, disabled: !isDisabled}
                })
            }
            dataSource={{unloadBear: 1}} edit/>
        <DetailTitle title="辅材信息" operation={[
            <Button
                type="primary"
                ghost
                key="add"
                onClick={async () => {
                    if (!supplierId) {
                        message.warning("请先选择供应商...")
                        return
                    }
                    setVisible(true)
                }}>选择比价结果</Button>,
        ]}/>
        <CommonTable
            style={{padding: "0"}}
            rowKey="key"
            columns={[
                ...material.map((item: any) => {
                    if (item.dataIndex === "num") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => numInputDoneRender(value, records, key, item)
                        })
                    }
                    // 含税单价 展示格式化 仅展示两位小数
                    if (item.dataIndex === "taxOffer") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => (
                                <span key={key}>{retain(records.taxOffer, 2)}</span>)
                            // <InputNumber
                            // min={1} value={value || 1}
                            // disabled={records.isReceiveStockRef === 2}
                            // onChange={(value: number) => handleNumChange(value, records.taxOffer, item.dataIndex,records.id)} key={key} />
                        })
                    }
                    // 不含税单价
                    if (item.dataIndex === "offer") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => (
                                <span key={key}>{retain(records.offer, 2)}</span>)
                            // (value: number, records: any, key: number) => <InputNumber
                            // min={1} value={value || 1}
                            // onChange={(value: number) => handleNumChange(value, records.offer, item.dataIndex,records.id)} key={key} />
                        })
                    }
                    return item
                }),
                {
                    title: "操作",
                    fixed: "right",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <Button type="link" disabled={records.isReceiveStockRef === 2}
                                                              onClick={() => handleRemove(records.comparisonPriceDetailId)}>移除</Button>
                }]}
            pagination={false}
            dataSource={popDataList.map((item: any) => ({
                ...item,
                key: item.id || Math.random() + new Date().getTime()
            }))}/>
        <Attachment dataSource={data?.attachInfoList || []} edit ref={attchsRef}/>
    </Spin>
})