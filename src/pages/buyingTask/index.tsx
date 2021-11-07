/* eslint-disable react-hooks/rules-of-hooks */
//采购任务下的原材料
import React, { useState, useRef } from 'react';
import { Modal, Descriptions, Button, DatePicker, Select, Input } from 'antd';
import { CommonTable, DetailContent, DetailTitle, Page } from '../common'
import { buyingTask, operatingInformation } from "./buyingTask.json"
import { useHistory } from 'react-router';
import RequestUtil from '../../utils/RequestUtil';
import TaskAssign from './TaskAssign';
interface TaskAssignRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function rawMaterial() {
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [detailId, setDetailId] = useState<string>("")
    const tarkRef = useRef<TaskAssignRef>({ onSubmit: () => { }, resetFields: () => { } })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [columnsData, setColumnsData] = useState([]);
    const [id, setId] = useState(0);//采购任务id
    const [obj, setObj] = useState<any>({});
    const [rejectionDescription, setRejectionDescription] = useState("");
    const history = useHistory();
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
    //点击生成10条数据
    const aa = async () => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/initData/materialPurchaseTask`)
        console.log(result);
    }
    const detail = async (purchaseId: any) => {
        setIsModalVisible(true);
        setId(purchaseId);
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchaseTask/${purchaseId}`)
        console.log(result);
        setObj(result);
    }
    const receive = async (purchaseId: number) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskReceive/${purchaseId}`, {}, { "Content-Type": "application/json" })
        console.log(result);
        setIsModalVisible(false);
    }
    const submit = async (rejectionDescription: string, id: number) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskRejection`, { rejectionDescription, id }, { "Content-Type": "application/json" })
        console.log(result);
    }
    // 三个按钮
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible(false)}>关闭</Button>&emsp; &emsp; &emsp; &emsp; &emsp;
            <Button onClick={() => setIsModalVisible3(true)}>拒绝</Button>
            <Button onClick={() => { receive(id) }}>接受</Button>
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
                    // message.success("保存并提交成功...")
                    // history.go(0)
                }}>保存并提交</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible2(false)}>关闭</Button>
            {/* 调接口 */}<Button >提交/完成</Button>
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
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    return (
        <div>
            <Page
                path="/tower-supply/materialPurchaseTask"
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...buyingTask,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { detail(records.id) }}>任务详情</Button>
                            <Button type="link" onClick={() => {
                                setDetailId(records.id)
                                setIsModalVisible1(true)
                            }}>指派</Button>
                            <Button type="link" onClick={() => { history.push(`/buyingTask/materialList`) }}>用料清单</Button>
                            <Button type="link" onClick={() => { setIsModalVisible2(true) }}>提交任务</Button>
                        </>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'startStatusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'taskStatus',
                        label: '任务状态',
                        children: <Select style={{ width: "100px" }}>
                            <Select.Option value={1} key={1}>待确认</Select.Option>
                            <Select.Option value={2} key={2}>已拒绝</Select.Option>
                            <Select.Option value={3} key={3}>待指派</Select.Option>
                            <Select.Option value={4} key={4}>待接收</Select.Option>
                            <Select.Option value={5} key={5}>待完成</Select.Option>
                            <Select.Option value={0} key={6}>已完成</Select.Option>
                            <Select.Option value={0} key={7}>已提交</Select.Option>
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
            <Modal width={1011} title="原材料采购任务详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
                {/* 基本信息 */}
                <Descriptions title="基本信息" column={2} bordered>
                    <Descriptions.Item label="任务单编号">{obj.taskNoticeNumber}</Descriptions.Item>
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
                <Descriptions title="相关附件" column={1} bordered>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.pdf">下载 预览</Descriptions.Item>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.rar">下载</Descriptions.Item>
                </Descriptions>
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
                        dataSource={columnsData}
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
        </div>
    )
}