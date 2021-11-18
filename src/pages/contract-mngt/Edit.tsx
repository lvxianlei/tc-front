import React, { forwardRef, useImperativeHandle, useState, useRef } from "react"
import { Button, Row, Modal, Spin, Form, InputNumber, message, Input } from "antd"
import { BaseInfo, DetailTitle, Attachment, CommonTable, PopTableContent, IntgSelect } from "../common"
import { contractBaseInfo, material, comparison, addMaterial } from "./contract.json"
import ApplicationContext from "../../configuration/ApplicationContext"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface EditProps {
    id: string
    type: "new" | "edit"
}
export default forwardRef(function ({ id, type }: EditProps, ref): JSX.Element {
    const materialStandardEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const deliveryMethodEnum = (ApplicationContext.get().dictionaryOption as any)["128"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const transportMethodEnum = (ApplicationContext.get().dictionaryOption as any)["129"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const [visible, setVisible] = useState<boolean>(false)
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [materialList, setMaterialList] = useState<any[]>([])
    const [supplierId, setSupplierId] = useState<string>("")
    const [baseForm] = Form.useForm()
    const [comparisonForm] = Form.useForm()
    const attchsRef = useRef<{ getDataSource: () => any[], resetFields: () => void }>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            baseForm.setFieldsValue({
                ...result,
                operator: { first: result.operatorDeptId, second: result.operatorId },
                supplier: { id: result.supplierId, value: result.supplierName },
                purchasePlan: { id: result.purchasePlanId, value: result.purchasePlanNumber }
            })
            comparisonForm.setFieldsValue({
                comparisonPrice: { id: result.comparisonPriceId, value: result.comparisonPriceNumber }
            })
            setMaterialList(result?.materialContractDetailVos || [])
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

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
                length: formatSpec(item.structureSpec).length,
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
            const comparisonPrice = await comparisonForm.validateFields()
            await saveRun({
                ...baseInfo,
                materialContractAttachInfoDtos: attchsRef.current.getDataSource(),
                operatorDeptId: baseInfo.operator?.first,
                operatorId: baseInfo.operator?.second,
                supplierId: baseInfo.supplier.id,
                supplierName: baseInfo.supplier.value,
                purchasePlanId: baseInfo.purchasePlan?.id || data?.purchasePlanId,
                purchasePlanNumber: baseInfo.purchasePlan.value || data?.purchasePlanNumber,
                comparisonPriceId: comparisonPrice.comparisonPrice.id,
                comparisonPriceNumber: comparisonPrice.comparisonPrice.value,
                materialContractDetailDtos: materialList.map((item: any) => {
                    delete item.id
                    return ({
                        ...item,
                        taxPrice: item.taxPrice,
                        price: item.price,
                        taxTotalAmount: item.taxTotalAmount,
                        totalAmount: item.totalAmount
                    })
                })
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        baseForm.resetFields()
        comparisonForm.resetFields()
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

    const handleBaseInfoChange = (fields: any) => {
        if (fields.supplier) {
            setSupplierId(fields.supplier.id)
            comparisonForm.resetFields()
            setMaterialList([])
        }
    }
    const handleComparisonPriceChange = async (fields: any) => {
        if (fields.comparisonPrice) {
            const meterialList: any[] = await getComparisonPrice(fields.comparisonPrice.id)
            setMaterialList(meterialList.map((item: any) => {
                const num = parseFloat(item.num || "1")
                const taxPrice = parseFloat(item.taxOffer || "1.00")
                const price = parseFloat(item.offer || "1.00")
                return ({
                    ...item,
                    source: 1,
                    num,
                    taxPrice,
                    price,
                    width: formatSpec(item.structureSpec).width,
                    length: formatSpec(item.structureSpec).length,
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
                }
                allData[dataIndex] = value
                return ({
                    ...item,
                    taxTotalAmount: (allData.num * allData.taxPrice).toFixed(2),
                    totalAmount: (allData.num * allData.price).toFixed(2),
                    [dataIndex]: value
                })
            }
            return item
        })
        setMaterialList(newData)
    }
    return <Spin spinning={loading}>
        <Modal width={addMaterial.width || 520} title={`选择${addMaterial.title}`} destroyOnClose visible={visible} onOk={handleAddModalOk} onCancel={() => setVisible(false)}>
            <PopTableContent data={addMaterial as any} onChange={(fields: any[]) => setPopDataList(fields.map((item: any) => ({
                ...item,
                materialTexture: item.structureTexture,
                spec: item.structureSpec,
                source: 2,
                taxPrice: item.taxPrice || 1.00,
                price: item.price || 1.00,
                taxTotalAmount: item.taxTotalAmount || 1.00,
                totalAmount: item.totalAmount || 1.00
            })))} />
        </Modal>
        <DetailTitle title="合同基本信息" />
        <BaseInfo
            form={baseForm}
            col={3}
            onChange={handleBaseInfoChange}
            columns={contractBaseInfo.map((item: any) => {
                switch (item.dataIndex) {
                    case "materialStandard":
                        return ({ ...item, enum: materialStandardEnum })
                    case "deliveryMethod":
                        return ({ ...item, enum: deliveryMethodEnum })
                    case "transportMethod":
                        return ({ ...item, enum: transportMethodEnum })
                    case "operator":
                        return ({
                            ...item,
                            render: () => <IntgSelect />
                        })
                    default:
                        return item
                }
            })}
            dataSource={{}} edit />
        <DetailTitle title="询比价信息" />
        <BaseInfo form={comparisonForm} col={1} onChange={handleComparisonPriceChange} columns={comparison.map((item: any) => {
            if (item.dataIndex === "comparisonPrice") {
                return ({ ...item, path: `${item.path}?supplierId=${supplierId}&comparisonStatus=2` })
            }
            return item
        })} dataSource={{}} edit />
        <Attachment dataSource={data?.materialContractAttachInfoVos || []} edit ref={attchsRef} />
        <DetailTitle
            title="原材料信息"
            operation={[<Button
                type="primary"
                ghost
                key="add"
                onClick={async () => {
                    const comparisonPrice = await comparisonForm.validateFields()
                    if (!comparisonPrice.comparisonPrice.id) {
                        message.warning("请先选择询比价信息...")
                    } else {
                        setVisible(true)
                    }

                }}>添加</Button>]} />
        <Row></Row>
        <CommonTable
            columns={[
                ...material.map((item: any) => {
                    if (["num", "taxPrice", "price"].includes(item.dataIndex)) {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 0} onChange={(value: number) => handleNumChange(value, records.materialCode, item.dataIndex)} key={key} />
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
            rowKey={(_: any, records: any) => records.materialName}
            pagination={false}
            dataSource={materialList} />
    </Spin>
})