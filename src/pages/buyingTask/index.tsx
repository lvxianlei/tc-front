import React, { useState, useRef } from 'react';
import { Modal, Descriptions, Button, DatePicker, Select, Input, message } from 'antd';
import { CommonTable, DetailContent, DetailTitle, IntgSelect, Page } from '../common'
import { buyingTask, operatingInformation } from "./buyingTask.json"
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import TaskAssign from './TaskAssign';
import useRequest from '@ahooksjs/use-request';
import { downLoadFile } from '../../utils';
interface TaskAssignRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function RawMaterial() {
    const history = useHistory();
    const [detailId, setDetailId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>(history.location.state as object)
    const tarkRef = useRef<TaskAssignRef>({ onSubmit: () => { }, resetFields: () => { } })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [id, setId] = useState(0);//采购任务id
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
    const receive = async (purchaseId: number) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskReceive/${purchaseId}`, {}, { "Content-Type": "application/json" })
        setIsModalVisible(false);
        history.go(0);
    }
    const submit = async (rejectionDescription: string, id: number) => {
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
        <div>
            <Button onClick={() => handleClose()}>关闭</Button>&emsp; &emsp; &emsp; &emsp; &emsp;
            {
                obj.taskStatus === 1 ? <span>
                    <Button onClick={() => setIsModalVisible3(true)}>拒绝</Button>
                    <Button onClick={() => { receive(id) }}>接受</Button>
                </span> : null
            }
        </div>
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
            <Button >提交/完成</Button>
        </div>
    ]
    const buttons3: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible3(false)}>关闭</Button>
            <Button onClick={() => { submit(rejectionDescription, id) }}>提交</Button>
        </div>
    ]

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        if (value.batcherId) {
            value.batcherDeptId = value.batcherId.first
            value.batcherId = value.batcherId.second
        }
        if (value.purchaserId) {
            value.purchaserDeptId = value.purchaserId.first
            value.purchaserId = value.purchaserId.second
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
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { detail(records.id) }}>任务详情</Button>
                            <Button type="link" disabled={records.taskStatus !== 3} onClick={() => { setDetailId(records.id); setIsModalVisible1(true) }}>指派</Button>
                            <Button type="link" disabled={records.taskStatus !== 2} onClick={() => history.push(`/buyingTask/materialList`)}>用料清单</Button>
                            <Button type="link" disabled={records.taskStatus !== 2} onClick={() => setIsModalVisible2(true)}>提交任务</Button>
                        </>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                //     extraOperation={
                //     <Button type="primary" ghost onClick={async () => {
                //         await generaterRun()
                //         await message.success("成功生成采购任务...")
                //         history.go(0)
                //     }}>临时生成采购任务</Button>
                // }
                searchFormItems={[
                    {
                        name: 'startStatusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'taskStatus',
                        label: '任务状态',
                        children: <Select style={{ width: 100 }}>
                            <Select.Option value={1} key={1}>待确认</Select.Option>
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                            <Select.Option value={3} key={3}>待指派</Select.Option>
                            <Select.Option value={4} key={4}>待接收</Select.Option>
                            <Select.Option value={5} key={5}>待完成</Select.Option>
                            <Select.Option value={6} key={6}>已提交</Select.Option>
                            <Select.Option value={7} key={7}>已拒绝</Select.Option>
                        </Select>
                    },
                    {
                        name: 'batcherId',
                        label: '配料人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'purchaserId',
                        label: '采购人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '查询',
                        children: <Input placeholder="任务编号/计划号/订单编号/内部合同编号" style={{ width: 260 }} maxLength={200} />
                    }
                ]}
            />
            <Modal width={1011} title="原材料采购任务详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
                {/* 基本信息 */}
                <Descriptions title="基本信息" column={2} bordered>
                    <Descriptions.Item label="计划号">{obj.taskNoticeNumber}</Descriptions.Item>
                    <Descriptions.Item label="订单编号">{obj.saleOrderNumber}</Descriptions.Item>
                    <Descriptions.Item label="内部合同编号">{obj.internalNumber}</Descriptions.Item>
                    <Descriptions.Item label="订单工程名称">{obj.orderProjectName}</Descriptions.Item>
                    <Descriptions.Item label="业主单位">{obj.customerCompany}</Descriptions.Item>
                    <Descriptions.Item label="合同签订单位">{obj.signCustomerName}</Descriptions.Item>
                    <Descriptions.Item label="订单交货日期">{obj.orderDeliveryTime}</Descriptions.Item>
                    <Descriptions.Item label="客户交货日期">{obj.deliveryTime}</Descriptions.Item>
                    <Descriptions.Item label="计划交货日期">{obj.planDeliveryTime}</Descriptions.Item>
                    <Descriptions.Item label="备注">{obj.description}</Descriptions.Item>
                </Descriptions>
                {/* 特殊要求 */}
                <Descriptions title="特殊要求" column={2} bordered>
                    <Descriptions.Item label="原材料标准">{obj.materialStandardName}</Descriptions.Item>
                    <Descriptions.Item label="原材料要求">{obj.materialDemand}</Descriptions.Item>
                    <Descriptions.Item label="焊接要求">{obj.weldingDemand}</Descriptions.Item>
                    <Descriptions.Item label="包装要求">{obj.packDemand}</Descriptions.Item>
                    <Descriptions.Item label="镀锌要求">{obj.galvanizeDemand}</Descriptions.Item>
                    <Descriptions.Item label="备注">{obj.peculiarDescription}</Descriptions.Item>
                </Descriptions>
                {/* 产品信息 */}
                <Descriptions title="产品信息" column={2} bordered>
                    <Descriptions.Item label="塔型（个）">{obj.productCategoryNum}</Descriptions.Item>
                    <Descriptions.Item label="杆塔（基）">{obj.productNum}</Descriptions.Item>
                    <Descriptions.Item label="产品类型">{obj.productTypeName}</Descriptions.Item>
                    <Descriptions.Item label="总重量（吨）">{obj.totalWeight}</Descriptions.Item>
                </Descriptions>
                {/* 相关附件 */}
                <DetailTitle title="相关附件" />
                <CommonTable columns={[{
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <>
                        <Button type="link" >预览</Button>
                        <Button type="link" onClick={() => downLoadFile(records.link || records.filePath)}>下载</Button>
                    </>
                }]} dataSource={obj.taskNoticeAttachList || []} />
                {/* 表格 */}
                <DetailContent>
                    <DetailTitle title="操作信息" />
                    <CommonTable
                        columns={[
                            {
                                "title": "序号",
                                "dataIndex": "index",
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...operatingInformation,
                        ]}
                        dataSource={obj.optRecordList || []}
                    />
                </DetailContent>
            </Modal>
            <Modal width={1011} title="指派信息" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
                <TaskAssign id={detailId} ref={tarkRef} />
            </Modal>
            <Modal width={1011} title="提交/完成" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2} >
                <div style={{ width: "100%", height: "100%", textAlign: "center" }}>确认提交/完成？</div>
            </Modal>
            <Modal width={1011} title="拒绝" visible={isModalVisible3} footer={buttons3} onCancel={handleCancel3}>
                拒绝原因 *<Input placeholder="请输入" value={rejectionDescription} onChange={(e) => { setRejectionDescription(e.target.value) }} />
            </Modal>
        </>
    )
}