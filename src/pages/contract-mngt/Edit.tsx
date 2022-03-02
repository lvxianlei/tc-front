import React, { forwardRef, useImperativeHandle, useState, useRef } from "react"
import { Button, Row, Modal, Spin, Form, InputNumber, message, Select } from "antd"
import { BaseInfo, DetailTitle, Attachment, CommonTable, IntgSelect } from "../common"
import { contractBaseInfo, material, addMaterial } from "./contract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { PopTableContent } from "./enquiryCompare/ComparesModal"
import { deliverywayOptions, materialStandardOptions, materialTextureOptions, transportationTypeOptions } from "../../configuration/DictionaryOptions"

// 新加运费信息
import { freightInformation, HandlingChargesInformation } from "./Edit.json";
interface EditProps {
    id: string
    type: "new" | "edit"
}
export default forwardRef(function ({ id, type }: EditProps, ref): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const transportMethodEnum = transportationTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const [visible, setVisible] = useState<boolean>(false)
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [materialList, setMaterialList] = useState<any[]>([])
    const [supplierId, setSupplierId] = useState<string>("")
    const [purchasePlanId, setPurchasePlanId] = useState<string>("")
    const [baseForm] = Form.useForm()
    const [freightForm] = Form.useForm()
    const [stevedoringForm] = Form.useForm()
    const attchsRef = useRef<{ getDataSource: () => any[], resetFields: () => void }>({ getDataSource: () => [], resetFields: () => { } })

    // 运费的数组
    const [newfreightInformation, setNewfreightInformation] = useState<any>(freightInformation); // 运费信息
    // 装卸费
    const [newHandlingChargesInformation, setNewHandlingChargesInformation] = useState<any>(HandlingChargesInformation); // 装卸费信息
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
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
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
            setMaterialList(result?.materialContractDetailVos.map((res: any) => {
                const id = res.materialTextureId;
                const name = res.materialTexture;
                return {
                    ...res,
                    materialTexture: id,
                    materialTextureId: name,
                }
            }) || [])
            setSupplierId(result.supplierId);
            setPurchasePlanId(result.comparisonPriceId);
            resove(result)
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

    const { run: getComparisonPrice } = useRequest<any[]>((comparisonPriceId: string) => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/comparisonPrice/getComparisonPriceDetailById?comparisonPriceId=${comparisonPriceId}&supplierId=${supplierId}`)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleAddModalOk = () => {
        const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.num || "1")
            const taxPrice = parseFloat(item.taxOffer || "1.00")
            const price = parseFloat(item.offer || "1.00")
            return ({
                ...item,
                num,
                taxPrice,
                price,
                width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
                taxTotalAmount: (num * taxPrice).toFixed(2),
                totalAmount: (num * price).toFixed(2)
            })
        })])
        setVisible(false)
    }

    const handleRemove = (id: string) => setMaterialList(materialList.filter((item: any) => item.materialCode !== id))

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, materialList])

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseInfo = await baseForm.validateFields()
            const freightInfo = await freightForm.validateFields()
            const stevedoringInfo = await stevedoringForm.validateFields()
            const values = {
                ...baseInfo,
                fileIds: attchsRef.current.getDataSource().map(item => item.id),
                operatorId: baseInfo.operator?.id,
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
                    const id = item.materialTextureId;
                    const name = item.materialTexture;
                    delete item.id
                    return ({
                        ...item,
                        taxPrice: item.taxPrice,
                        price: item.price,
                        taxTotalAmount: item.taxTotalAmount,
                        totalAmount: item.totalAmount,
                        materialTexture: item.source === 1 ? id : item.materialTexture,
                        materialTextureId: item.source === 1 ? name : item.materialTextureId,
                    })
                })
            }
            await saveRun(values)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        baseForm.resetFields()
        attchsRef.current?.resetFields()
        setMaterialList([])
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

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.supplier) {
            setSupplierId(fields.supplier.id)
            setMaterialList([])
            baseForm.setFieldsValue({
                comparisonPriceNumber: {
                    value: "",
                    id: "",
                    records: []
                }
            })
        }
        if (fields.comparisonPriceNumber) {
            setPurchasePlanId(fields.comparisonPriceNumber.id);
            const meterialList: any[] = await getComparisonPrice(fields.comparisonPriceNumber.id)
            setMaterialList(meterialList.map((item: any) => {
                const num = parseFloat(item.num || "1")
                const taxPrice = parseFloat(item.taxOffer || "1.00")
                const price = parseFloat(item.offer || "1.00")
                const id = item.materialTextureId;
                const name = item.materialTexture;
                return ({
                    ...item,
                    source: 1,
                    num,
                    taxPrice,
                    price,
                    width: formatSpec(item.structureSpec).width,
                    materialTexture: id,
                    materialTextureId: name,
                    // length: formatSpec(item.structureSpec).length,
                    weight: item.weight || "1.00",
                    taxTotalAmount: (num * taxPrice).toFixed(2),
                    totalAmount: (num * price).toFixed(2)
                })
            }))
        }
    }

    const handleNumChange = (value: number, materialCode: string, dataIndex: string) => {
        const newData = materialList.map((item: any) => {
            if (item.materialCode === materialCode) {
                const allData: any = {
                    num: parseFloat(item.num || "1"),
                    taxPrice: parseFloat(item.taxPrice || "1.00"),
                    price: parseFloat(item.price || "1.00"),
                    weight: (item.weight && item.weight >= 0) ? parseFloat(item.weight) : parseFloat("0")
                }
                allData[dataIndex] = value
                return ({
                    ...item,
                    taxTotalAmount: (allData.num * allData.taxPrice * allData.weight).toFixed(2),
                    totalAmount: (allData.num * allData.price * allData.weight).toFixed(2),
                    [dataIndex]: value
                })
            }
            return item
        })
        setMaterialList(newData)
    }

    const lengthChange = (value: number, id: string) => {
        const list = materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: item.weightAlgorithm === '0' ? ((item.proportion * item.thickness * item.width * value) / 1000).toFixed(3) : item.weightAlgorithm === '1' ? ((item.proportion * value) / 1000).toFixed(3) : null
                })
            }
            return item
        })
        setMaterialList(list);
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
    }
    return <Spin spinning={loading}>
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
                onChange={(fields: any[]) =>
                    setPopDataList(fields.map((item: any) => ({
                        ...item,
                        spec: item.structureSpec,
                        source: 2,
                        materialTextureId: item.structureTexture,
                        standardName: item.standardName,
                        length: item.length || 1,
                        materialStandard: item.standard,
                        taxPrice: item.taxPrice || 1.00,
                        price: item.price || 1.00,
                        taxTotalAmount: item.taxTotalAmount || 1.00,
                        totalAmount: item.totalAmount || 1.00,
                        weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000).toFixed(3)
                    }))
                    )} />
        </Modal>
        <DetailTitle title="合同基本信息" />
        <BaseInfo
            form={baseForm}
            col={2}
            classStyle={"overall-form-class-padding0"}
            onChange={handleBaseInfoChange}
            columns={contractBaseInfo.map((item: any) => {
                switch (item.dataIndex) {
                    case "deliveryMethod":
                        return ({ ...item, enum: deliveryMethodEnum })
                    case "transportMethod":
                        return ({ ...item, enum: transportMethodEnum })
                    case "comparisonPriceNumber":
                        return ({ ...item, path: `${item.path}?supplierId=${supplierId}&comparisonStatus=2&purchasePlanId=${purchasePlanId}` })
                    default:
                        return item
                }
            })}
            dataSource={{}} edit />
        <DetailTitle title="运费信息" />
        <BaseInfo
            form={freightForm} col={2} classStyle={"overall-form-class-padding0"}
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
            dataSource={{}} edit />
        <DetailTitle title="装卸费信息" />
        <BaseInfo
            form={stevedoringForm} col={2} classStyle={"overall-form-class-padding0"}
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
            dataSource={{}} edit />
        <DetailTitle
            title="原材料信息"
            operation={[<Button
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
                }}>添加</Button>]} />
        <Row></Row>
        <CommonTable
            rowKey={(records: any) => `${records.materialName}${records.spec}${records.length}`}
            style={{ padding: "0" }}
            columns={[
                ...material.map((item: any) => {
                    if (["num", "taxPrice", "price"].includes(item.dataIndex)) {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 0} onChange={(value: number) => handleNumChange(value, records.materialCode, item.dataIndex)} key={key} />
                        })
                    }
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? value : <InputNumber min={1} value={value || 0} onChange={(value: number) => lengthChange(value, records.id)} key={key} />
                        })
                    }
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select style={{ width: '150px' }} value={materialList[key]?.materialStandard && materialList[key]?.materialStandard + ',' + materialList[key]?.materialStandardName} onChange={(e: string) => {
                                const newData = materialList.map((item: any, index: number) => {
                                    if (index === key) {
                                        return {
                                            ...item,
                                            materialStandard: e.split(',')[0],
                                            materialStandardName: e.split(',')[1]
                                        }
                                    }
                                    return item
                                })
                                setMaterialList(newData)
                            }}>
                                {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    if (item.dataIndex === "materialTextureId") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? value : <Select style={{ width: '150px' }} value={materialList[key]?.materialTextureId && materialList[key]?.materialTextureId + ',' + materialList[key]?.materialTexture} onChange={(e: string) => {
                                const newData = materialList.map((item: any, index: number) => {
                                    if (index === key) {
                                        return {
                                            ...item,
                                            materialTextureId: e.split(',')[0],
                                            materialTexture: e.split(',')[1]
                                        }
                                    }
                                    return item
                                })
                                setMaterialList(newData)
                            }}>
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
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
            dataSource={materialList} />
        <Attachment dataSource={data?.materialContractAttachInfoVos || []} edit ref={attchsRef} />
    </Spin>
})