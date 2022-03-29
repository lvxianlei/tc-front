import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal, Form, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IntgSelect, SearchTable as Page } from '../../common'
import { baseInfo } from "./productionData.json"
import Overview from "./Edit"
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
import AuthUtil from "../../../utils/AuthUtil"
// 引入明细
import DetailOverView from './DetailOverView';
export default function Invoicing() {
    const [form] = Form.useForm()
    const history = useHistory()
    const userId = AuthUtil.getUserId()
    const [visible, setVisible] = useState<boolean>(false)
    const [generaterVisible, setGenerteVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [ingredientsvisible, setIngredientsvisible] = useState<boolean>(false);
    const [detailOver, setDetailOver] = useState<boolean>(false);
    const [loftingState, setLoftingState] = useState<number>(0);
    const [filterValue, setFilterValue] = useState<object>(history.location.state as object);
    const { loading, run: saveRun } = useRequest<any[]>((id: string, productCategoryName: string) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/initData/ingredients?materialTaskCode=${id}&productCategoryName=${productCategoryName}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: getLoftingRun } = useRequest<any[]>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/initData/ingredientsComponent?productionBatch=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: loftingRun } = useRequest<any[]>((productCategoryName: string, purchaseTaskId: string, productionBatch: string) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply//initData/lofting?productCategoryName=${productCategoryName}&purchaseTaskId=${purchaseTaskId}&productionBatch=${productionBatch}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.orderTimeUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLoftingBatchTime = formatDate[0] + " 00:00:00"
            value.endLoftingBatchTime = formatDate[1] + " 23:59:59"
        }
        if (value.loftingId) {
            value.loftingDeptId = value.loftingId.first
            value.loftingId = value.loftingId.second
        }
        setFilterValue(value)
        return value
    }
    const handleGenerateOk = async () => {
        const formData = await form.validateFields()
        await saveRun(formData.materialTaskCode, formData.productCategoryName)
        message.success("成功生成配料方案...")
        history.go(0)
    }
    return <>
        <Modal
            title="配料方案"
            visible={visible}
            width={1011}
            onOk={() => setVisible(false)}
            destroyOnClose
            onCancel={() => setVisible(false)}>
            <Overview id={detailId} />
        </Modal>
        <Modal title="生成数据" visible={generaterVisible} onCancel={() => {
            form.resetFields()
            setGenerteVisible((false))
        }}
            onOk={handleGenerateOk}>
            <Form form={form}>
                <Form.Item rules={[
                    { required: true, message: "请输入原材料编号..." }
                ]} name="materialTaskCode" label="原材料任务编号">
                    <Input />
                </Form.Item>
                <Form.Item rules={[
                    { required: true, message: "请输入塔形..." }
                ]} name="productCategoryName" label="塔形">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        {/* 新增明细 */}
        <DetailOverView
            visible={detailOver}
            onOk={() => {
                history.go(0);
                setDetailOver(false)
            }}
            loftingState={loftingState}
            id={detailId}
            onCancel={() => setDetailOver(false)}
        />
        <Page
            path="/tower-supply/produceIngredients"
            exportPath={"/tower-supply/produceIngredients"}
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 40,
                    render: (_: any, _a: any, index: number) => <>{index + 1}</>
                },
                ...baseInfo as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 160,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" className="btn-operation-link" disabled={userId !== record.batcherId} onClick={() => {
                                setDetailId(record.id)
                                setDetailOver(true)
                                setLoftingState(record.loftingState)
                            }}>详情</Button>
                            <Button
                                type="link"
                                className="btn-operation-link" 
                                disabled={userId !== record.batcherId || record.loftingState === 3}
                            >
                                <Link to={`/ingredients/production/detailed/${record.id}/${record.materialTaskCode}/${record.productCategoryName}/${record.loftingState}`}>明细</Link>
                            </Button>
                            <Button type="link" className="btn-operation-link" disabled={userId !== record.batcherId || record.loftingState !== 2}
                                onClick={() => {
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>配料单</Button>
                            {/* <Button type="link" disabled={userId !== record.batcherId}
                                onClick={async () => {
                                    await getLoftingRun(record.productionBatch)
                                    message.success("成功生成放样构件...")
                                }}>生成放样构件</Button>
                            <Button type="link" disabled={userId !== record.batcherId}
                                onClick={async () => {
                                    await loftingRun(record.productCategoryName, record.materialTaskId, record.productionBatch)
                                    message.warning("成功生成差异列表...")
                                }}>生成差异列表</Button> */}
                        </>
                    }
                }]}
            // extraOperation={<>
            //     <Button type="primary" ghost>导出</Button>
            //     {/* <Button type="primary" loading={loading} ghost onClick={() => setGenerteVisible(true)}>临时生成生产数据</Button> */}
            // </>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'orderTimeUpdateTime',
                    label: '下达时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'loftingState',
                    label: '状态',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="2">已完成</Select.Option>
                        <Select.Option value="3">待确认</Select.Option>
                    </Select>
                },
                {
                    name: 'loftingId',
                    label: '配料负责人',
                    children: <IntgSelect width={400} />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="方案编号/生产批次/塔型" style={{ width: 300 }} />
                }
            ]}
        />
    </>
}
