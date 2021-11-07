import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { Button, Modal, Select, Input, Form, Row, Col, Spin } from "antd"
import { BaseInfo, CommonTable, DetailTitle, PopTableContent, Page } from "../../common"
import { editBaseInfo, materialColumns, addMaterial, choosePlanList } from "./enquiry.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface EditProps {
    id: string
    type: "new" | "edit"
}

const ChoosePlan: React.ForwardRefExoticComponent<any> = forwardRef((props, ref) => {
    const [filterValue, setFilterValue] = useState<any>({})
    const [form] = Form.useForm()
    const [selectRows, setSelectRows] = useState<any[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan`, { ...filterValue })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(filterValue)] })
    useImperativeHandle(ref, () => ({ selectRows }), [JSON.stringify(selectRows)])
    return <>
        <Form form={form} onFinish={(values) => setFilterValue(values)}>
            <Row>
                <Col><Form.Item label="采购类型" name="purchaseType">
                    <Select style={{ width: 200 }}>
                        <Select.Option value="1">外部</Select.Option>
                        <Select.Option value="2">内部</Select.Option>
                        <Select.Option value="3">缺料</Select.Option>
                    </Select>
                </Form.Item></Col>
                <Col><Form.Item label="采购计划编号" name="purchasePlanCode">
                    <Input />
                </Form.Item></Col>
                <Col><Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>搜索</Button>
                    <Button type="default" htmlType="reset" style={{ marginLeft: 12 }}>重置</Button>
                </Form.Item></Col>
            </Row>
        </Form>
        <CommonTable loading={loading} columns={choosePlanList} dataSource={data?.records || []} rowSelection={{
            type: "radio",
            onChange: (_: any, selectedRows: any[]) => {
                setSelectRows(selectedRows)
            }
        }} />
    </>
})

export default forwardRef(function ({ id, type }: EditProps, ref): JSX.Element {
    const choosePlanRef = useRef<{ selectRows: any[] }>({ selectRows: [] })
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseVisible, setChooseVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/comparisonPrice/${id}`)
            form.setFieldsValue(result)
            setMaterialList(result?.comparisonPriceDetailVos || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/comparisonPrice`, { ...data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }))

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseData = await form.validateFields()
            await saveRun({
                ...baseData,
                comparisonPriceDetailDtos: materialList.map((item: any) => {
                    delete item.id
                    return item
                })
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        setMaterialList([])
    }

    const handleAddModalOk = () => {
        const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        setMaterialList([...materialList, ...newMaterialList])
        setVisible(false)
    }

    const handleChoosePlanOk = () => {
        const chooseData = choosePlanRef.current?.selectRows
        setMaterialList([...materialList, ...chooseData[0]?.materials])
        setChooseVisible(false)
    }
    const handleRemove = (id: string) => setMaterialList(materialList.filter((item: any) => item.materialCode !== id))

    return <Spin spinning={loading}>
        <Modal width={addMaterial.width || 520} title={`选择${addMaterial.title}`} destroyOnClose visible={visible} onOk={handleAddModalOk} onCancel={() => setVisible(false)}>
            <PopTableContent data={addMaterial as any} onChange={(fields) => setPopDataList(fields)} />
        </Modal>
        <Modal width={1011} title="选择计划" visible={chooseVisible} onOk={handleChoosePlanOk} onCancel={() => setChooseVisible(false)}>
            <ChoosePlan ref={choosePlanRef} />
        </Modal>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo form={form} col={2} columns={editBaseInfo} dataSource={{}} edit />
        <DetailTitle title="询价原材料" operation={[
            <Button type="primary" ghost key="add" style={{ marginRight: 16 }} onClick={() => setVisible(true)}>添加询价原材料</Button>,
            <Button type="primary" ghost key="choose" onClick={() => setChooseVisible(true)}>选择计划</Button>
        ]} />
        <CommonTable
            columns={[
                ...materialColumns,
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <a onClick={() => handleRemove(records.materialCode)}>移除</a>
                }]}
            dataSource={materialList} />
    </Spin>
})