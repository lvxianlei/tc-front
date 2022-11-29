import React, { Key, ReactElement, useState, useCallback } from "react"
import {welding, structure, componentdetails} from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { useHistory, useParams } from "react-router"
import { Button, Col, Form, Input, message, Modal, Pagination, Radio, Row, Select, Space } from "antd"
import {CommonAliTable, CommonTable, DetailTitle} from "../../common"
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
    const params = useParams<{ id: string, issuedNumber: string, productCategory: string,status:string }>()
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
    const  componentdetails = [
        {
            "title": "下达单",
            "dataIndex": "issuedNumber"
        },
        {
            "title": "零件号",
            "dataIndex": "code"
        },
        {
            "title": "材料",
            "dataIndex": "materialName"
        },
        {
            "title": "工艺",
            "dataIndex": "craft"
        },
        {
            "title": "规格",
            "dataIndex": "structureSpec"
        }
    ]
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

    const { data:autoDistributeData,run:autoDistributeDataRun } = useRequest<any>((params: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/workshopOrder/autoDistribute`, params);
            form.setFieldsValue({
                dataList: result?.needUpdateList||[]
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


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

    const handleAutoClick = () => {
        Modal.confirm({
            title: "自动分配生产单元",
            icon: null,
            content: "确定重新自动分配生产单元？",
            onOk: async () => new Promise(async (resove, reject) => {
                const result =    await  autoDistributeDataRun([params.id])
                if((result&&result?.needUpdateList&&result?.needUpdateList.length>0)||(result&&result?.notMatchList&&result?.notMatchList.length>0)){

                    Modal.warn({
                        title: "分配生产单元提示",
                        icon: null,
                        okText: "确定",
                        width:'80%',
                        content: <>
                            {result&&result?.notMatchList&&result?.notMatchList.length>0&&<>
                                <DetailTitle  title='构件未匹配到生产单元，请配置分配规则'/>
                                <CommonTable columns={componentdetails} dataSource={result?.notMatchList|| []} pagination={false}/>
                            </>}
                        </>,
                        onOk: async () => {
                            history.go(0)
                        }
                    })
                }else{
                    await message.success("快速分配单元完成")
                    history.go(0)
                }
            }),
            onCancel: () => {

            }
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
            <Button type="primary" disabled={params.status=="3"||params.status==="4"}  onClick={handleAutoClick}>自动分配单元</Button>
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
