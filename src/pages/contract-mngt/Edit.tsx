import React, { forwardRef, useImperativeHandle, useState, useRef } from "react"
import { Button, Modal, Spin, Form, InputNumber, message, Select } from "antd"
import { BaseInfo, DetailTitle, Attachment, CommonTable, PopTableContent } from "../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import AuthUtil from "../../utils/AuthUtil"
import moment from "moment"
import {
    deliverywayOptions, materialStandardOptions,
    materialTextureOptions, transportationTypeOptions,
    settlementModeOptions
} from "../../configuration/DictionaryOptions"
import { contractBaseInfo, material, addMaterial } from "./contract.json"

// 新加运费信息
import { freightInformation, HandlingChargesInformation } from "./Edit.json";
interface EditProps {
    id: string
    type: "new" | "edit"
}
interface WeightParams {
    width: number | string
    length: number | string
    weightAlgorithm: 1 | 2 | 3
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
const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))
const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))
const transportMethodEnum = transportationTypeOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))
const settlementModeEnum = settlementModeOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))

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
    weight: ({ length, width, weightAlgorithm, proportion }: WeightParams) => {
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
    totalWeight: ({ length, width, weightAlgorithm, proportion, num }: TotalWeightParmas) => {
        if (weightAlgorithm === 1) {
            return ((Number(proportion || 1) * Number(length || 1)) * Number(num || 1) / 1000 / 1000).toFixed(3)
        }
        if (weightAlgorithm === 2) {
            return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) * Number(num || 1) / 1000 / 1000 / 1000).toFixed(3)
        }
        return (Number(proportion || 1) * Number(num || "1") / 1000).toFixed(3)
    }
}

export default forwardRef(function ({ id, type }: EditProps, ref): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [materialList, setMaterialList] = useState<any[]>([])
    const [baseForm] = Form.useForm()
    const [freightForm] = Form.useForm()
    const [stevedoringForm] = Form.useForm()
    const attchsRef = useRef<{ getDataSource: () => any[], resetFields: () => void }>({ getDataSource: () => [], resetFields: () => { } })

    const [colunmnBase, setColunmnBase] = useState<any[]>(contractBaseInfo);
    // 运费的数组
    const [newfreightInformation, setNewfreightInformation] = useState<any>(oneFreight); // 运费信息
    // 装卸费
    const [newHandlingChargesInformation, setNewHandlingChargesInformation] = useState<any>(oneStevedoring); // 装卸费信息

    const { loading: taxLoading, data: taxData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const materialTax: any = await RequestUtil.get(`/tower-storage/tax/taxMode/material`)
            const freightTax: any = await RequestUtil.get(`/tower-storage/tax/taxMode/freight`)
            const loadUnloadTax: any = await RequestUtil.get(`/tower-storage/tax/taxMode/load_unload`)
            resove({
                materialTax: materialTax?.taxVal,
                freightTax: freightTax?.taxVal,
                loadUnloadTax: loadUnloadTax?.taxVal
            })
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            const taxNum = await RequestUtil.get(`/tower-storage/tax`)
            baseForm.setFieldsValue({
                ...result,
                operator: { id: result.operatorId, value: result.operatorName },
                supplier: { id: result.supplierId, value: result.supplierName },
                purchasePlan: { id: result.purchasePlanId, value: result.purchasePlanNumber }
            })
            if (result?.transportBearVo?.transportBear == 1) {
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
            freightForm.setFieldsValue({
                ...result.transportBearVo,
                transportCompanyId: result.transportBearVo.transportCompanyId + ',' + result.transportBearVo.transportCompany
            })
            if (result?.unloadBearVo?.unloadBear == 1) {
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
                ...result.unloadBearVo,
                unloadCompanyId: result.unloadBearVo.unloadCompanyId + ',' + result.unloadBearVo.unloadCompany
            })
            setMaterialList(result?.materialContractDetailVos || [])
            setPopDataList(result?.materialContractDetailVos || [])
            resove({ ...result, tax: taxNum })
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { data: stevedoreCompanyList } = useRequest<any>(() => new Promise(async (resove, reject) => {
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

    const { data: companyList } = useRequest<any>(() => new Promise(async (resove, reject) => {
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

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/materialContract`, type === "new" ? data : ({ ...data, id }))
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: getComparisonPrice } = useRequest<any[]>((comparisonPriceId: string, supplierId: string) => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/comparisonPrice/getComparisonPriceDetailById?comparisonPriceId=${comparisonPriceId}&supplierId=${supplierId}`)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleAddModalOk = () => {
        // const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        const newMaterialList: any[] = []
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.num || "1")
            const taxPrice = parseFloat(item.taxOffer || "1.00")
            const price = parseFloat(item.offer || "1.00")
            return ({
                ...item,
                num,
                taxPrice,
                price,
                spec: item.structureSpec,
                width: formatSpec(item.structureSpec).width,
                weight: calcFun.weight({
                    weightAlgorithm: item.weightAlgorithm,
                    proportion: item.proportion,
                    length: item.length,
                    width: item.width
                }),
                taxTotalAmount: (num * taxPrice).toFixed(2),
                totalAmount: (num * price).toFixed(2)
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.num || "1")
            const taxPrice = parseFloat(item.taxOffer || "1.00")
            const price = parseFloat(item.offer || "1.00")
            return ({
                ...item,
                num,
                taxPrice,
                price,
                spec: item.structureSpec,
                width: formatSpec(item.structureSpec).width,
                weight: calcFun.weight({
                    weightAlgorithm: item.weightAlgorithm,
                    proportion: item.proportion,
                    length: item.length,
                    width: item.width
                }),
                taxTotalAmount: (num * taxPrice).toFixed(2),
                totalAmount: (num * price).toFixed(2)
            })
        })])
        setVisible(false)
    }

    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.materialCode !== id))
        setPopDataList(materialList.filter((item: any) => item.materialCode !== id))
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, materialList])

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseInfo = await baseForm.validateFields()
            const freightInfo = await freightForm.validateFields()
            const stevedoringInfo = await stevedoringForm.validateFields()
            const values = {
                ...baseInfo,
                fileIds: attchsRef.current.getDataSource().map(item => item.id),
                operatorId: AuthUtil.getUserId(),
                supplierId: baseInfo.supplier.id,
                supplierName: baseInfo.supplier.value,
                purchasePlanId: baseInfo.purchasePlan?.id || data?.purchasePlanId,
                purchasePlanNumber: baseInfo.purchasePlan.value || data?.purchasePlanNumber,
                comparisonPriceId: baseInfo.comparisonPriceNumber.records ? baseInfo.comparisonPriceNumber.records[0].id : baseInfo.comparisonPriceId,
                comparisonPriceNumber: baseInfo.comparisonPriceNumber.records ? baseInfo.comparisonPriceNumber.records[0].comparisonPriceNumber : baseInfo.comparisonPriceNumber,
                transportBearDto: {
                    ...freightInfo,
                    transportCompanyId: freightInfo?.transportCompanyId?.split(',')[0],
                    transportCompany: freightInfo?.transportCompanyId?.split(',')[1]
                },
                unloadBearDto: {
                    ...stevedoringInfo,
                    unloadCompanyId: stevedoringInfo?.unloadCompanyId?.split(',')[0],
                    unloadCompany: stevedoringInfo?.unloadCompanyId?.split(',')[1],
                },
                materialContractDetailDtos: materialList.map((item: any) => {
                    delete item.id
                    return ({
                        ...item,
                        taxPrice: item.taxPrice,
                        price: item.price,
                        taxTotalAmount: item.taxTotalAmount,
                        totalAmount: item.totalAmount,
                        structureTexture: item.structureTexture,
                        structureTextureId: item.structureTextureId,
                    })
                })
            }
            await saveRun(values)
            message.success("保存成功...")
            resove(true)
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

    const formatSpec = (spec: any): { width: string, length: string } => {
        if (!spec) {
            return ({
                width: "0",
                length: "0"
            })
        }
        const splitArr = spec.replace("∠", "").split("*")
        return ({
            width: splitArr[0] || "0",
            length: splitArr[1] || "0"
        })
    }

    const handleBaseInfoChange = async (fields: any, allFields: any) => {
        if (fields.supplier) {
            if (allFields?.purchasePlan) {
                const comparisonPriceNumberId = baseForm.getFieldValue("comparisonPriceNumber").id
                const meterialList: any[] = await getComparisonPrice(comparisonPriceNumberId, fields.supplier.id)
                setMaterialList(meterialList.map((item: any) => {
                    const num = parseFloat(item.num || "1")
                    const weight = calcFun.weight({
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        length: item.length,
                        width: item.width
                    })
                    const totalWeight = parseFloat(item.totalWeight || "1.00")
                    const taxPrice = parseFloat(item.taxOffer || "1.00")
                    return ({
                        ...item,
                        source: 1,
                        num,
                        weight,
                        taxPrice,
                        price: (taxPrice / (taxData?.materialTax / 100 + 1)).toFixed(6),
                        structureTexture: item.structureTexture,
                        structureTextureId: item.structureTextureId,
                        taxTotalAmount: (totalWeight * taxPrice).toFixed(2),
                        totalAmount: (totalWeight * taxPrice / (taxData?.materialTax / 100 + 1)).toFixed(2)
                    })
                }))
                setPopDataList(meterialList.map((item: any) => {
                    const num = parseFloat(item.num || "1")
                    const weight = calcFun.weight({
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        length: item.length,
                        width: item.width
                    })
                    const totalWeight = parseFloat(item.totalWeight || "1.00")
                    const taxPrice = parseFloat(item.taxOffer || "1.00")
                    return ({
                        ...item,
                        source: 1,
                        num,
                        weight,
                        taxPrice,
                        price: (taxPrice / (taxData?.materialTax / 100 + 1)).toFixed(6),
                        structureTexture: item.structureTexture,
                        structureTextureId: item.structureTextureId,
                        taxTotalAmount: (totalWeight * taxPrice).toFixed(2),
                        totalAmount: (totalWeight * taxPrice / (taxData?.materialTax / 100 + 1)).toFixed(2)
                    })
                }))
            }
        }
        if (fields.comparisonPriceNumber) {
            baseForm.setFieldsValue({
                purchasePlan: {
                    id: fields.comparisonPriceNumber.records?.[0]?.purchasePlanId,
                    value: fields.comparisonPriceNumber.records?.[0]?.purchasePlanCode
                }
            })
            setColunmnBase(colunmnBase.map(((item: any) => {
                if (item.dataIndex === "supplier") {
                    return ({
                        ...item,
                        disabled: false,
                        path: `/tower-supply/comparisonPrice/getComparisonPrice?comparisonPriceId=${fields.comparisonPriceNumber.id}`
                    })
                }
                return item
            })))
        }
    }

    const handleNumChange = (value: number, materialCode: string, dataIndex: string) => {
        const newData = popDataList.map((item: any) => {
            if (item.materialCode === materialCode) {
                const allData: any = {
                    num: parseFloat(item.num || "1"),
                    taxPrice: parseFloat(item.taxPrice || "1.00"),
                    price: parseFloat(item.price || "1.00"),
                    weight: calcFun.weight({
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        length: item.length,
                        width: item.width,
                        [type]: value
                    }),
                    totalWeight: calcFun.totalWeight({
                        length: item.length,
                        width: item.width,
                        proportion: item.proportion,
                        weightAlgorithm: item.weightAlgorithm,
                        num: item.num,
                        [type]: value
                    })
                }
                allData[dataIndex] = value
                return ({
                    ...item,
                    taxTotalAmount: (allData.num * allData.taxPrice * allData.weight).toFixed(2),
                    totalAmount: (allData.num * allData.price * allData.weight).toFixed(2),
                    totalWeight: calcFun.totalWeight({
                        length: item.length,
                        width: item.width,
                        proportion: item.proportion,
                        weightAlgorithm: item.weightAlgorithm,
                        num: item.num,
                        [type]: value
                    }),
                    [dataIndex]: value
                })
            }
            return item
        })
        setMaterialList(newData.slice(0));
        setPopDataList(newData.slice(0))
    }

    const lengthChange = (value: number, id: string, type: "length" | "width") => {
        const list = materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    [type]: value,
                    weight: calcFun.weight({
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        length: item.length,
                        width: item.width,
                        [type]: value
                    }),
                    totalWeight: calcFun.totalWeight({
                        length: item.length,
                        width: item.width,
                        proportion: item.proportion,
                        weightAlgorithm: item.weightAlgorithm,
                        num: item.num,
                        [type]: value
                    }),
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
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

    return <Spin spinning={loading && taxLoading}>
        <Modal width={addMaterial.width || 520} title={`选择${addMaterial.title}`} destroyOnClose visible={visible}
            onOk={handleAddModalOk} onCancel={() => setVisible(false)}>
            <PopTableContent data={{
                ...(addMaterial as any),
                columns: (addMaterial as any).columns.map((item: any) => {
                    if (item.dataIndex === "standard") {
                        return ({
                            ...item,
                            type: "select",
                            enum: materialStandardEnum
                        })
                    }
                    return item
                })
            }}
                value={{
                    id: "",
                    records: popDataList,
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    fields.map((element: any, index: number) => {
                        if (element.structureSpec) {
                            element["spec"] = element.structureSpec;
                            element["weight"] = ((Number(element?.proportion || 1) * Number(element.length || 1)) / 1000).toFixed(3);
                            element["totalWeight"] = ((Number(element?.proportion || 1) * Number(element.length || 1) * (element.planPurchaseNum || 1)) / 1000).toFixed(3);
                        }
                    });
                    setMaterialList(fields.map((item: any) => ({
                        ...item,
                        num: item?.num || 1,
                        spec: item.structureSpec,
                        source: item.source || 2,
                        length: item.length || 1,
                        taxPrice: item.taxPrice || 1.00,
                        price: item.price || 1.00,
                        width: item.width || 0,
                        taxTotalAmount: item.taxTotalAmount || 1.00,
                        totalAmount: item.totalAmount || 1.00,
                        materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                        materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                        structureTextureId: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                        structureTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                        weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000).toFixed(3),
                        totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * (item.planPurchaseNum || 1)) / 1000).toFixed(3),
                    })))
                }} />
        </Modal>
        <DetailTitle title="合同基本信息" />
        <BaseInfo
            form={baseForm}
            col={2}
            classStyle={"overall-form-class-padding0"}
            onChange={handleBaseInfoChange}
            columns={colunmnBase.map((item: any) => {
                switch (item.dataIndex) {
                    case "deliveryMethod":
                        return ({ ...item, enum: deliveryMethodEnum })
                    case "transportMethod":
                        return ({ ...item, enum: transportMethodEnum })
                    case "settlementMode":
                        return ({ ...item, enum: settlementModeEnum })
                    default:
                        return item
                }
            })}
            dataSource={{
                operatorName: AuthUtil.getRealName(),
                signingTime: moment(),
                invoiceCharacter: 1,
                meteringMode: 2,
                deliveryMethod: deliveryMethodEnum?.[1]?.value,
                settlementMode: settlementModeEnum?.[0]?.value
            }} edit />
        <DetailTitle title="运费信息" />
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
                            enum: companyList
                        })
                    }
                    return item
                })
            }
            dataSource={{ transportBear: 1 }} edit />
        <DetailTitle title="装卸费信息" />
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
                            enum: stevedoreCompanyList
                        })
                    }
                    return item
                })
            }
            dataSource={{ unloadBear: 1 }} edit />
        <DetailTitle title="原材料信息" operation={[
            <Button
                type="primary"
                ghost
                key="add"
                onClick={async () => {
                    const baseInfo = await baseForm.validateFields(['comparisonPriceNumber']);
                    if (baseInfo?.comparisonPriceNumber?.records && !baseInfo?.comparisonPriceNumber?.records[0]?.id) {
                        message.warning("请先选择询比价信息...")
                    } else {
                        setVisible(true)
                    }
                }}>添加</Button>
        ]} />
        <CommonTable
            style={{ padding: "0" }}
            columns={[
                ...material.map((item: any) => {
                    if (item.dataIndex === "num") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber
                                min={1} value={value || 1}
                                onChange={(value: number) => handleNumChange(value, records.materialCode, item.dataIndex)} key={key} />
                        })
                    }
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber
                                min={1}
                                value={value || 100}
                                onChange={(value: number) => lengthChange(value, records.id, "length")} key={key} />
                        })
                    }
                    if (item.dataIndex === "width") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber
                                min={1}
                                value={value || 100}
                                onChange={(value: number) => lengthChange(value, records.id, "width")} key={key} />
                        })
                    }
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            render: (_value: number, records: any, key: number) => <Select
                                style={{ width: '150px' }}
                                labelInValue
                                value={{
                                    value: materialList[key]?.materialStandard,
                                    label: materialList[key]?.materialStandardName
                                } as any}
                                onChange={(e: any) => {
                                    const newData = materialList.map((item: any, index: number) => {
                                        if (index === key) {
                                            return {
                                                ...item,
                                                materialStandard: e.value,
                                                materialStandardName: e.label
                                            }
                                        }
                                        return item
                                    })
                                    setMaterialList(newData)
                                }}>
                                {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    if (item.dataIndex === "structureTextureId") {
                        return ({
                            ...item,
                            render: (_value: number, records: any, key: number) => <Select
                                style={{ width: '150px' }}
                                labelInValue={true}
                                value={{
                                    value: materialList[key]?.structureTextureId,
                                    label: materialList[key]?.structureTexture
                                } as any}
                                onChange={(e: any) => {
                                    const newData = materialList.map((item: any, index: number) => {
                                        if (index === key) {
                                            return {
                                                ...item,
                                                structureTextureId: e.value,
                                                structureTexture: e.label
                                            }
                                        }
                                        return item
                                    })
                                    setMaterialList(newData)
                                }}>
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    return item
                }),
                {
                    title: "操作",
                    fixed: "right",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <Button type="link" disabled={records.source === 1} onClick={() => handleRemove(records.materialCode)}>移除</Button>
                }]}
            pagination={false}
            dataSource={popDataList} />
        <Attachment dataSource={data?.materialContractAttachInfoVos || []} edit ref={attchsRef} />
    </Spin>
})