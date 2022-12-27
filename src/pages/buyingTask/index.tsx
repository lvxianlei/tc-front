import React, { useState, useRef } from 'react';
import { Modal, Button, DatePicker, Select, Input, message } from 'antd';
import { Attachment, BaseInfo, DetailTitle, OperationRecord, SearchTable as Page } from '../common'
import { buyingTask, setting, spec, productInfo } from "./buyingTask.json"
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import TaskAssign from './TaskAssign';
import useRequest from '@ahooksjs/use-request';
interface TaskAssignRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function RawMaterial() {
    const history = useHistory();
    const [detailId, setDetailId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        inquirer: history.location.state ? sessionStorage.getItem('USER_ID') : "",
    })
    const tarkRef = useRef<TaskAssignRef>({ onSubmit: () => { }, resetFields: () => { } })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [id, setId] = useState<string>("");//采购任务id
    const [obj, setObj] = useState<any>({});
    const [rejectionDescription, setRejectionDescription] = useState("");
    const { run: generaterRun } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const data = await RequestUtil.get(`/tower-supply/initData/materialPurchaseTask`);
            resole(data)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleCancel3 = () => {
        setIsModalVisible3(false);
    };
    const detail = async (purchaseId: any) => {
        setIsModalVisible(true);
        setId(purchaseId)
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchaseTask/${purchaseId}`)
        setObj(result);
    }
    const receive = async (purchaseId: string) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskReceive/${purchaseId}`, {}, { "Content-Type": "application/json" })
        setIsModalVisible(false);
        history.go(0);
    }
    const submit = async (rejectionDescription: string, id: string) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskRejection`, { rejectionDescription, id }, { "Content-Type": "application/json" })
        message.success("拒绝成功！");
        setIsModalVisible3(false);
        setIsModalVisible(false);
        history.go(0);
    }
    // 关闭
    const handleClose = () => {
        setIsModalVisible(false);
        history.go(0);
    }
    // 三个按钮
    const buttons: {} | null | undefined = [
        <Button onClick={() => handleClose()}>关闭</Button>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button
                key="close"
                onClick={() => {
                    tarkRef.current?.resetFields()
                    setIsModalVisible1(false)
                }}>关闭</Button>
            <Button
                key="save"
                onClick={async () => {
                    const result = await tarkRef.current?.onSubmit();
                    setIsModalVisible1(false);
                    message.success("保存并提交成功...")
                    history.go(0)
                }}>保存并提交</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible2(false)}>关闭</Button>
            <Button type="primary">提交/完成</Button>
        </div>
    ]
    const buttons3: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible3(false)}>关闭</Button>
            <Button type="primary" onClick={() => { submit(rejectionDescription, id) }}>提交</Button>
        </div>
    ]

    const onFilterSubmit = (value: any) => {
        if (value.startPlanDeliveryTime) {
            const formatDate = value.startPlanDeliveryTime.map((item: any) => item.format("YYYY-MM-DD"))
            delete value.startPlanDeliveryTime
            value.startPlanDeliveryTime = formatDate[0] + ' 00:00:00';
            value.endPlanDeliveryTime = formatDate[1] + ' 23:59:59';
        }
        if (value.batcherId) {
            value.batcherId = value.batcherId.value
        }
        if (value.purchaserId) {
            value.purchaserId = value.purchaserId.value
        }
        setFilterValue(value)
        return value
    }

    return (
        <>
            <Page
                path="/tower-supply/materialPurchaseTask"
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...buyingTask.map((item: any) => {
                        if (item.dataIndex === "completionProgres") {
                            return ({ ...item, render: (_: any, records: any) => <>{records.completionProgres}/{records.demand}</> })
                        }
                        return item
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 160,
                        render: (_: any, records: any) => <>
                            <Button type="link" className="btn-operation-link" onClick={() => { detail(records.id) }}>任务详情</Button>
                            <Button type="link" className="btn-operation-link"  onClick={() => history.push(`/buyingTask/index/demand/${records.id}/${records.materialSummaryStatus}/${records.planNumber}/${records.orderProjectName}`)}>用料需求</Button>

                            {/* <Button type="link" className="btn-operation-link" disabled={records.taskStatus !== 3} onClick={() => { setDetailId(records.id); setIsModalVisible1(true) }}>指派</Button>
                            <Button type="link" className="btn-operation-link" disabled={records.taskStatus !== 2} onClick={() => history.push(`/buyingTask/detail/${records.planNumber}`)}>用料清单</Button>
                            <Button type="link" className="btn-operation-link" disabled={records.taskStatus !== 2} onClick={() => setIsModalVisible2(true)}>提交任务</Button> */}
                        </>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'startPlanDeliveryTime',
                        label: '客户交货日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'taskStatus',
                        label: '任务状态',
                        children: <Select style={{ width: 100 }} defaultValue="">
                            <Select.Option value="" key={0}>全部</Select.Option>
                            <Select.Option value={1} key={1}>待完成</Select.Option>
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                        </Select>
                    },
                    {
                        name: 'materialSummaryStatus',
                        label: '物料汇总状态',
                        children: <Select style={{ width: 100 }} defaultValue="">
                            <Select.Option value="" key={''}>全部</Select.Option>
                            <Select.Option value={0} key={0}>待完成</Select.Option>
                            <Select.Option value={1} key={2}>已完成</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '查询',
                        children: <Input placeholder="任务编号/计划号/订单编号/内部合同编号" style={{ width: 260 }} maxLength={200} />
                    }
                ]}
            />
            <Modal width={1011} title="原材料采购任务详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={setting} dataSource={obj || {}} col={2} />
                <DetailTitle title="特殊要求" />
                <BaseInfo columns={spec} dataSource={obj || {}} col={2} />
                <DetailTitle title="产品信息" />
                <BaseInfo columns={productInfo} dataSource={obj || {}} col={2} />
                <Attachment dataSource={obj.taskNoticeAttachList} />
                <OperationRecord title="操作信息" serviceId={id as string} serviceName="tower-supply" />
            </Modal>
            <Modal width={1011} title="指派信息" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
                <TaskAssign id={detailId} ref={tarkRef} />
            </Modal>
            <Modal width={1011} title="提交/完成" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2} >
                <div style={{ width: "100%", height: "100%", textAlign: "center" }}>确认提交/完成？</div>
            </Modal>
            <Modal width={1011} title="拒绝原因" visible={isModalVisible3} footer={buttons3} onCancel={handleCancel3}>
                <Input placeholder="请输入" value={rejectionDescription} onChange={(e) => { setRejectionDescription(e.target.value) }} />
            </Modal>
        </>
    )
}