import React, { forwardRef, useImperativeHandle, useState, useRef } from "react"
import { Button, Row, Modal, Spin, Form, InputNumber } from "antd"
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
                purchasePlan: { id: result.purchasePlanNumber, value: result.purchasePlanNumber }
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
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialContract`, { ...data })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: getComparisonPrice } = useRequest<any[]>((comparisonPriceId: string) => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply//comparisonPrice/getComparisonPriceDetailById?comparisonPriceId=${comparisonPriceId}&supplierId=${supplierId}`)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleAddModalOk = () => {
        const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        setMaterialList([...materialList, ...newMaterialList])
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
                operatorDeptId: baseInfo.operator?.first,
                operatorId: baseInfo.operator?.second,
                supplierId: baseInfo.supplier.id,
                supplierName: baseInfo.supplier.value,
                purchasePlanId: baseInfo.purchasePlan?.records[0].id,
                purchasePlanNumber: baseInfo.purchasePlan.value,
                comparisonPriceId: comparisonPrice.comparisonPrice.id,
                comparisonPriceNumber: comparisonPrice.comparisonPrice.value,
                materialContractDetailDtos: materialList.map((item: any) => ({
                    ...item,
                    taxPrice: 1,
                    price: 1,
                    taxTotalAmount: 1,
                    totalAmount: 1
                }))
            })
            resove(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const resetFields = () => {
        baseForm.resetFields()
        comparisonForm.resetFields()
        attchsRef.current?.resetFields()
        setMaterialList([])
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
            setMaterialList(meterialList)
        }
    }

    const handleNumChange = (value: number, materialCode: string) => {
        setMaterialList(materialList.map((item: any) => item.materialCode === materialCode ? ({ ...item, num: value }) : item))
    }
    return <Spin spinning={loading}>
        <Modal width={addMaterial.width || 520} title={`选择${addMaterial.title}`} destroyOnClose visible={visible} onOk={handleAddModalOk} onCancel={() => setVisible(false)}>
            <PopTableContent data={addMaterial as any} onChange={(fields) => setPopDataList(fields)} />
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
                return ({ ...item, path: `${item.path}?supplierId=${supplierId}` })
            }
            return item
        })} dataSource={{}} edit />
        <Attachment dataSource={data?.materialContractAttachInfoVos || []} edit ref={attchsRef} />
        <DetailTitle title="原材料信息" operation={[<Button type="primary" ghost key="add" onClick={() => setVisible(true)}>添加</Button>]} />
        <Row></Row>
        <CommonTable
            columns={[
                ...material.map((item: any) => {
                    if (item.dataIndex === "num") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber value={value} onChange={(value: number) => handleNumChange(value, records.materialCode)} key={key} />
                        })
                    }
                    return item
                }),
                {
                    title: "操作",
                    fixed: "right",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <a onClick={() => handleRemove(records.materialCode)}>移除</a>
                }]}
            dataSource={materialList} />
    </Spin>
})