import React, { Key, ReactElement, useState, useCallback } from "react"
import { welding, structure } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { useParams } from "react-router"
import { Button, Col, Form, Input, message, Modal, Pagination, Radio, Row, Select, Space } from "antd"
import { CommonAliTable } from "../../common"
import styles from "../../common/CommonTable.module.less"
export default function ManualDistribute(): ReactElement {
    const params = useParams<{ id: string }>()
    const [pagenation, setPagenation] = useState<any>({ current: 1, pageSize: 10 })
    const [form] = Form.useForm()
    const [workshopForm] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    const [status, setStatus] = useState<number>(1)

    const { data: listData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
            resole(result.records || [])
        } catch (error) {
            reject(error)
        }
    }))

    const { data: weldingData, run: weldingRun } = useRequest<any>((params) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.put(`/tower-aps/workshopOrder/manualDistribute`, params);
            message.success("手动分配车间完成...")
            setSelectedRowKeys([])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleClick = () => {
        Modal.confirm({
            title: "手动分配车间",
            icon: null,
            content: <Form form={workshopForm}>
                <Form.Item name="workshopId" label="生产/组焊车间" rules={[{ required: true, message: "请选择生产/组焊车间..." }]}>
                    <Select>
                        {listData.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>,
            onOk: async () => {
                const workshop = await workshopForm.validateFields()
                return weldingRun(selectedRowKeys.map((item: Key) => ({
                    id: item,
                    workshopId: workshop.workshopId,
                    workshopName: listData.find((item: any) => item.id === workshop.workshopId).name,
                    type: status
                })))
            }
        })
    }

    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const formValue = await form.getFieldsValue()
            const result: any = await RequestUtil.get(`/tower-aps/workshopOrder/${status === 1 ? "structure" : "welding"}`, {
                issueOrderId: params.id,
                ...formValue,
                current: pagenation.current,
                size: pagenation.pageSize
            })
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [pagenation.current, pagenation.pageSize, status] })

    const paginationChange = useCallback((page: number, pageSize?: number) => {
        setPagenation({
            ...pagenation,
            current: page,
            pageSize: pageSize || pagenation.pageSize
        })
    }, [setPagenation, JSON.stringify(pagenation)])

    return <>
        <Form style={{ marginBottom: 16 }} form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={[8, 8]}>
                <Col>
                    <Form.Item name="materialName" label="材料">
                        <Input />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="structureTexture" label="材质">
                        <Input />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="processWorkshop" label="加工车间">
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{ height: 32 }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                        <Button type="default" onClick={() => form.resetFields()} style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <Space style={{
            marginBottom: 12,
            paddingLeft: 12
        }} size={12}>
            <Radio.Group
                value={status}
                onChange={(event) => setStatus(event.target.value)}
            >
                <Radio.Button value={1}>构建明细</Radio.Button>
                <Radio.Button value={2}>组焊明细</Radio.Button>
            </Radio.Group>
            <Button type="primary" onClick={handleClick}>手动分配车间</Button>
        </Space>
        <CommonAliTable
            columns={status === 1 ? welding : structure}
            size="small"
            className={status === 1 ? "" : "bordered"}
            isLoading={loading}
            rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }}
            dataSource={data?.recordDate.records || []}
        />
        <footer className={styles.pagenationWarp}>
            <Pagination
                total={data?.total}
                current={pagenation.current}
                showTotal={(total: number) => `共${total}条记录`}
                showSizeChanger
                onChange={paginationChange}
            />
        </footer>
    </>
}