import React, { Key, ReactElement, useState, useCallback } from "react"
import { welding, structure } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { useHistory, useParams } from "react-router"
import { Button, Col, Form, Input, message, Modal, Pagination, Radio, Row, Select, Space } from "antd"
import { CommonAliTable } from "../../common"
import styles from "../../common/CommonTable.module.less"
interface CountProps {
    totalNumber: number
    totalGroupNum: number
    totalWeight_s: string
    totalWeight_w: string
    totalHolesNum: number
}

export default function ManualDistribute(): ReactElement {
    const history = useHistory()
    const params = useParams<{ id: string, issuedNumber: string, productCategory: string }>()
    const [pagenation, setPagenation] = useState<any>({ current: 1, pageSize: 10 })
    const [form] = Form.useForm()
    const [workshopForm] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
    const [counts, setCounts] = useState<CountProps>({
        totalNumber: 0,
        totalGroupNum: 0,
        totalWeight_s: "0",
        totalWeight_w: "0",
        totalHolesNum: 0
    })
    const [status, setStatus] = useState<number>(1)

    const { data: listData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/productionUnit?size=10000`);
            resole(result.records || [])
        } catch (error) {
            reject(error)
        }
    }))
    const { data: weldinglistData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/welding/config/weldingList?size=10000`);
            resole(result.records || [])
        } catch (error) {
            reject(error)
        }
    }))
    const { run: weldingRun } = useRequest<any>((params) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.put(`/tower-aps/workshopOrder/manualDistribute`, params);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const formValue = await form.getFieldsValue()
            const result: any = await RequestUtil.get(`/tower-aps/workshopOrder/${status === 1 ? "structure" : "weldingStat"}`, {
                issueOrderId: params.id,
                ...formValue,
                current: pagenation.current,
                size: pagenation.pageSize
            })
            counts.totalNumber = result.totalNumber;
            counts.totalHolesNum = result.totalHolesNum;
            counts.totalWeight_s = result.totalWeight;
            if (status === 2) {
                counts.totalGroupNum = result.totalGroupNum;
                counts.totalWeight_w = result.totalWeight;
                const records = result.recordDate.records.reduce((count: any[], item: any) => {
                    const components = item.weldingStructureVOList.reduce((cCount: any[], cItem: any[]) => {
                        delete item.weldingStructureVOList
                        return cCount.concat({ ...cItem, ...item })
                    }, [])
                    return count.concat(components)
                }, [])
                resole({
                    ...result,
                    recordDate: {
                        ...result.recordDate,
                        records: records.map((item: any, index: number) => ({ ...item, index }))
                    }
                })
                return
            }
            resole({
                ...result,
                recordDate: {
                    ...result.recordDate,
                    records: result.recordDate.records.map((item: any, index: number) => ({ ...item, index }))
                }
            })
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [pagenation.current, pagenation.pageSize, status] })

    const onSelectChange = (_: Key, selectedRowKeys: any[]) => {
        if (status === 1) {
            setSelectedRowKeys(selectedRowKeys)
            return
        } else {
            setSelectedRowKeys(selectedRowKeys)
            return
        }
    }

    const handleClick = () => {
        Modal.confirm({
            title: "手动分配生产单元",
            icon: null,
            content: <Form form={workshopForm}>
                <Form.Item name="workshopId" label="生产单元" rules={[{ required: true, message: "请选择生产单元..." }]}>
                    <Select>
                        {status === 1 && listData.map((item: any) => <Select.Option
                            key={item.id}
                            value={item.id}>{item.name}</Select.Option>)}
                        {status === 2 && weldinglistData.map((item: any) => <Select.Option
                            key={item.unitId}
                            value={item.unitId}>{item.unitName}</Select.Option>)}

                    </Select>
                </Form.Item>
            </Form>,
            onOk: async () => new Promise(async (resove, reject) => {
                const value = workshopForm.getFieldsValue(true)
                if (JSON.stringify(value) == "{}") {
                    reject(false)
                }
                const workshop = await workshopForm.validateFields()
                try {
                    await weldingRun(selectedRowKeys.map((item: any) => ({
                        id: item.id,
                        ids: item.ids,
                        workshopId: workshop.workshopId,
                        weldingId: item.weldingId,
                        componentId: item.componentId,
                        issueOrderId: params.id,
                        workshopName: listData.find((item: any) => item.id === workshop.workshopId).name,
                        type: status
                    })))
                    resove(true)
                    await message.success("手动分配生产单元完成...")
                    setSelectedRowKeys([])
                    workshopForm.resetFields()
                    history.go(0)
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            }),
            onCancel: () => workshopForm.resetFields()
        })
    }

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
                    <Form.Item name="processWorkshop" label="生产单元">
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
        <Row style={{ paddingLeft: 20 }}>
            <Space>
                <span><label>下达单号：</label>{params.issuedNumber}</span>
                <span><label>塔型：</label>{params.productCategory}</span>
            </Space>
        </Row>
        <Space style={{
            marginBottom: 12,
            paddingLeft: 12
        }} size={12}>
            <Radio.Group
                value={status}
                onChange={(event) => {
                    setStatus(event.target.value)
                    setPagenation({ ...pagenation, current: 1 })
                }}
            >
                <Radio.Button value={1}>构件明细</Radio.Button>
                <Radio.Button value={2}>组焊明细</Radio.Button>
            </Radio.Group>
            <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={handleClick}>手动分配单元</Button>
        </Space>
        <Row style={{ paddingLeft: 20 }}>
            <Space>
                <span style={{ fontWeight: 600 }}>合计：</span>
                {status === 1 && <span><label>总件数：</label>{counts.totalNumber}</span>}
                {status === 2 && <span><label>总组数：</label>{counts.totalGroupNum}</span>}
                {status === 1 && <span><label>总重量(t)：</label>{counts.totalWeight_s}</span>}
                {status === 2 && <span><label>总重量(t)：</label>{counts.totalWeight_w}</span>}
                {status === 1 && <span><label>总孔数：</label>{counts.totalHolesNum}</span>}
            </Space>
        </Row>
        <CommonAliTable
            columns={status === 1 ? structure.map((item: any) => {
                if (item.dataIndex === "processWorkshop") {
                    return ({
                        ...item,
                        getCellProps: (value: any, record: any) => record.processWorkshop ? ({}) : ({ style: { backgroundColor: "red" } })
                    })
                }
                return item
            }) : welding.map((item: any) => {
                if (item.dataIndex === "totalProcessNum") {
                    return ({
                        ...item,
                        features: {
                            ...item.features,
                            autoRowSpan: (v1: any, v2: any, row1: any, row2: any) => row1.id + row1.componentId === row2.id + row2.componentId
                        }
                    })
                }
                if (item.dataIndex === "segmentName") {
                    return ({
                        ...item,
                        features: {
                            ...item.features,
                            autoRowSpan: (v1: any, v2: any, row1: any, row2: any) => row1.id + row1.segmentName === row2.id + row2.segmentName
                        }
                    })
                }
                return item
            })}
            size="small"
            className={status === 1 ? "" : "bordered"}
            isLoading={loading}
            rowKey={(records: any) => `${records.id}-${records.index}`}
            rowSelection={{
                selectedRowKeys: selectedRowKeys.map((item: any) => `${item.id}-${item.index}`),
                onChange: onSelectChange,
                checkboxColumn: status === 2 ? {
                    features: {
                        autoRowSpan: (v1: any, v2: any, row1: any, row2: any) => row1.id === row2.id,
                        sortable: true
                    }
                } : {}
            }}
            dataSource={data?.recordDate.records || []}
        />
        <footer className={styles.pagenationWarp}>
            <Pagination
                total={data?.recordDate.total}
                current={pagenation.current}
                showTotal={(total: number) => `共${total}条记录`}
                showSizeChanger
                onChange={paginationChange}
            />
        </footer>
    </>
}
