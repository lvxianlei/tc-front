//询价任务
import React, { useState, useRef, useEffect, Fragment } from 'react'
import { useHistory } from "react-router-dom"
import { Input, DatePicker, Select, Button, Modal, Form, Descriptions, Space, message } from 'antd'
import { enquiryTaskList } from "./enquiryTask.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { Page } from '../common';
import Overview from './Overview'
import TaskAssign from './TaskAssign'
import TaskResult from './TaskResult'
interface OverviewRef {
    onReceive: () => void,
    onRejection: () => void,
    footer: JSX.Element[]
}
interface TaskRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function EnquiryTask(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const [detailId, setDetailId] = useState<string>("")
    const [currentData, setCurrentData] = useState<any>({})
    const overviewRef = useRef<OverviewRef>({ onReceive: () => { }, onRejection: () => { }, footer: [] })
    const taskRef = useRef<TaskRef>({ onSubmit: () => { }, resetFields: () => { } })
    const [overviewVisible, setOverviewVisible] = useState<boolean>(false)
    const [taskVisible, setTaskVisible] = useState<boolean>(false)
    const [taskResultVisible, setTaskResultVisible] = useState<boolean>(false)

    const { run: finishTaskRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/finish/${id}`)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    const handleTaskModalOk = () => new Promise(async (resove, reject) => {
        try {
            await taskRef.current.onSubmit()
            message.success("已成功指派...")
            setTaskVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleRejection = async () => {
        const result = await overviewRef.current.onRejection()
        message.success("拒绝成功...")
        setOverviewVisible(false)
        history.go(0)
    }

    const handleReceive = async () => {
        const result = await overviewRef.current.onReceive()
        message.success("已成功接收...")
        setOverviewVisible(false)
        history.go(0)
    }

    const handleFinishTask = async (id: string) => {
        Modal.confirm({
            title: "提交/完成",
            content: "确认提交/完成？",
            onOk: async () => {
                await finishTaskRun(id)
                message.success("提交成功...")
                history.go(0)
            }
        })
    }

    return <>
        <Modal
            width={1011}
            title="询价任务详情"
            visible={overviewVisible}
            footer={[
                <Button type="primary" key="cancel" onClick={() => {
                    setDetailId("")
                    setOverviewVisible(false)
                }}>关闭</Button>,
                <Fragment key="if">
                    {currentData?.inquiryStatus === 1 && <Button type="primary" onClick={handleRejection}>拒绝</Button>}
                    {currentData?.inquiryStatus === 1 && <Button type="primary" onClick={handleReceive}>接收</Button>}
                </Fragment>
            ]}
            onCancel={() => setOverviewVisible(false)} >
            <Overview id={detailId} ref={overviewRef} />
        </Modal>
        <Modal title="指派" width={1011} visible={taskVisible} okText="提交" onOk={handleTaskModalOk} onCancel={() => {
            taskRef.current.resetFields()
            setTaskVisible(false)
        }}>
            <TaskAssign id={detailId} ref={taskRef} />
        </Modal>
        <Modal title="询价结果" width={1011} visible={taskResultVisible} footer={[<Button type="primary" key="confirm" onClick={() => {
            setTaskResultVisible(false)
        }}>确定</Button>]} onCancel={() => setTaskResultVisible(false)}>
            <TaskResult id={detailId} />
        </Modal>
        <Page
            path="/tower-supply/inquiryTask"
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    fixed: "left",
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...enquiryTaskList,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <a onClick={() => {
                                setDetailId(record.id)
                                setCurrentData(record)
                                setOverviewVisible(true)
                            }}>任务详情</a>
                            {record.inquiryStatus === 3 && <Button type="link" onClick={() => {
                                setDetailId(record.id)
                                setTaskVisible(true)
                            }}>指派</Button>}
                            {record.inquiryStatus === 2 && <Button type="link" onClick={() => {
                                setDetailId(record.id)
                                setTaskResultVisible(true)
                            }}>询价结果</Button>}
                            {record.inquiryStatus === 2 && <Button type="link" onClick={() => handleFinishTask(record.id)}>提交任务</Button>}
                        </>
                    }
                }]}
            extraOperation={<Button type="primary" ghost>导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'inquiryStatus',
                    label: '任务状态',
                    children: <Select style={{ width: "100px" }}>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>已完成</Select.Option>
                        <Select.Option value={3} key={3}>待指派</Select.Option>
                        <Select.Option value={4} key={4}>待完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={6} key={6}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'confirmId',
                    label: '询价人',
                    children: <div>

                    </div>
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input maxLength={200} />
                },
            ]}
        />
    </>
}