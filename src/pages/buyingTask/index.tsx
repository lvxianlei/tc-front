/* eslint-disable react-hooks/rules-of-hooks */
//采购任务下的原材料
import React, { useState } from 'react';
import { Modal, Descriptions, Button, DatePicker, Select, Input } from 'antd';
import { CommonTable, DetailContent, DetailTitle, Page } from '../common'
import { buyingTask, operatingInformation } from "./buyingTask.json"
import { useHistory } from 'react-router';
import RequestUtil from '../../utils/RequestUtil';
export default function rawMaterial() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    const [columnsData, setColumnsData] = useState([]);
    const [batcherDeptId, setBatcherDeptId] = useState(0);//配料人部门id
    const [batcherId, setBatcherId] = useState(0);//配料人id
    const [id, setId] = useState(0);//采购任务id
    const [purchaserDeptId, setPurchaserDeptId] = useState(0);//采购人部门id
    const [purchaserId, setPurchaserId] = useState(0);//采购人id
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
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
        setBatcherDeptId(value);
    }
    const handleChange1 = (value: any) => {
        console.log(`selected ${value}`);
        setBatcherId(value);
    }
    const handleChange2 = (value: any) => {
        console.log(`selected ${value}`);
        setPurchaserDeptId(value);
    }
    const handleChange3 = (value: any) => {
        console.log(`selected ${value}`);
        setPurchaserId(value);
    }
    //点击生成10条数据
    const aa = async () => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/initData/materialPurchaseTask`)
        console.log(result);
    }
    const designate = (id: number) => {
        setIsModalVisible1(true)
        // console.log(id);
        setId(id);
    }
    const save = async (batcherDeptId: number, batcherId: number, id: number, purchaserDeptId: number, purchaserId: number) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskAssignments`, { batcherDeptId, batcherId, id, purchaserDeptId, purchaserId }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const detail = async (purchaseId: any) => {
        setIsModalVisible(true)
        // console.log(purchaseId);
        ///tower-supply/materialPurchaseTask/{purchaseId}
        setId(purchaseId);
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchaseTask/${purchaseId}`)
        console.log(result);
        setObj(result);
    }
    const receive = async (purchaseId: number) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskReceive/${purchaseId}`, {}, { "Content-Type": "application/json" })
        console.log(result);
    }
    // console.log(id);
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
            <Button onClick={() => setIsModalVisible1(false)}>关闭</Button>
            <Button onClick={() => { save(batcherDeptId, batcherId, id, purchaserDeptId, purchaserId) }}>保存并提交</Button>
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
    return (
        <div>
            <Page
                path="/tower-supply/materialPurchaseTask"
                // path=""
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    // {buyingTask!.map((item: { title: string; }) => {
                    //     if (item.title === "completionProgresdemand") {
                    //         return ({
                    //             ...item,
                    //             render: (text: string | number, record: { demand: string | number; }) => {
                    //                 const completionProgres = [1, "-1", 0, "0"].includes(text) ? "0" : text
                    //                 const demand = [-1, "-1", 0, "0"].includes(record.demand) ? "0" : record.demand
                    //                 return <div>{completionProgres}/{demand}</div>
                    //             }
                    //         })
                    //     }
                    // })},
                    ...buyingTask,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { detail(records.id) }}>任务详情</Button>
                            <Button type="link" onClick={() => { designate(records.id) }}>指派</Button>
                            <Button type="link" onClick={() => { history.push(`/buyingTask/materialList`) }}>用料清单</Button>
                            <Button type="link" onClick={() => { setIsModalVisible2(true) }}>提交任务</Button>
                        </>
                    }
                ]}
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'status',
                        label: '任务状态',
                        children: <Select style={{ width: "100px" }}>
                            <Select.Option value={1} key={1}>待确认</Select.Option>
                            <Select.Option value={2} key={2}>待指派</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                            <Select.Option value={5} key={5}>已提交</Select.Option>
                            <Select.Option value={0} key={0}>已拒绝</Select.Option>
                        </Select>
                    },
                    {
                        name: 'confirmId',
                        label: '询价人',
                        children: <div>
                            <Select style={{ width: '100px' }} defaultValue="部门">
                                {confirmLeader && confirmLeader.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                })}
                            </Select>
                            <Select style={{ width: '100px' }} defaultValue="人员">
                                {confirmLeader && confirmLeader.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </div>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '查询',
                        children: <Input maxLength={200} />
                    },
                ]}
            />
            <Modal width="700px" title="原材料采购任务详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
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
            <Modal width="700px" title="指派" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
                配料人 *<Select defaultValue="请选择部门" style={{ width: 120 }} onChange={handleChange}>
                    <Select.Option value="1">Jack</Select.Option>
                    <Select.Option value="2">Lucy</Select.Option>
                </Select>
                <Select defaultValue="请选择人员" style={{ width: 120 }} onChange={handleChange1}>
                    <Select.Option value="1">Jack</Select.Option>
                    <Select.Option value="2">Lucy</Select.Option>
                </Select>
                <div>
                    采购人 *<Select defaultValue="请选择部门" style={{ width: 120 }} onChange={handleChange2}>
                        <Select.Option value="1">Jack</Select.Option>
                        <Select.Option value="2">Lucy</Select.Option>
                    </Select>
                    <Select defaultValue="请选择人员" style={{ width: 120 }} onChange={handleChange3}>
                        <Select.Option value="1">Jack</Select.Option>
                        <Select.Option value="2">Lucy</Select.Option>
                    </Select>
                </div>
            </Modal>
            <Modal width="700px" title="提交/完成" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2} >
                <div style={{ width: "100%", height: "100%", textAlign: "center" }}>确认提交/完成？</div>
            </Modal>
            <Modal width="700px" title="拒绝" visible={isModalVisible3} footer={buttons3} onCancel={handleCancel3}>
                拒绝原因 *<Input placeholder="请输入" value={rejectionDescription} onChange={(e) => { setRejectionDescription(e.target.value) }} />
            </Modal>
            <Button onClick={() => { aa() }}>aa</Button>
        </div>
    )
}