//询价任务
import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal, Form, Descriptions, Space, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { enquiryTaskList, enquiryTaskAction, CurrentPriceInformation } from "./enquiryTask.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { CommonTable, DetailContent, DetailTitle, Page } from '../common';

export default function EnquiryTask(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    const [filterValue, setFilterValue] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [obj, setObj] = useState<any>({});
    const [arr, setArr] = useState<any>([])
    const [id, setId] = useState(0);
    // console.log(id,"--------");
    const [inquiryId, setInquiryId] = useState(0);
    const [deptId, setDeptId] = useState("");
    const [inquirerId, setInquirerId] = useState("");
    const [plannedDeliveryTime, setPlannedDeliveryTime] = useState("");
    const [val, setVal] = useState("");
    const [columnsData, setColumnsData] = useState([]);
    var moment = require('moment');
    moment().format();
    const [form] = Form.useForm();
    const history = useHistory();

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }

    const taskDetail = async (inquiryId: number) => {
        setIsModalVisible(true);
        setId(inquiryId);
        setInquiryId(inquiryId);
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/${inquiryId}`)
        console.log(result);
        // setColumnsData(result)
        setObj(result);
        console.log(obj, "-------");

    }
    const assign = async (deptId: string, id: number, inquirerId: string, plannedDeliveryTime: string) => {
        ///tower-supply/inquiryTask/taskAssignments
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/taskAssignments`, { deptId, id, inquirerId, plannedDeliveryTime }, { "Content-Type": "application/json" })
        console.log(result);
    }
    // console.log(obj);

    const inquiryResults = async (inquiryId: number) => {
        setIsModalVisible1(true);
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/taskResult/${inquiryId}`)
        console.log(result);
    }

    const submitTask = async (inquiryId: number) => {
        // console.log(inquiryId);
        // const abc:any = new FormData()
        // abc.append("inquiryId",122)
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/finish/${inquiryId}`, {}, { "Content-Type": "application/json" })
        console.log(result);
    }

    const refuse = async () => {
        setIsModalVisible3(true);
    }

    const receive = async (inquiryId: number) => {
        ///tower-supply/inquiryTask/taskReceive
        console.log(id);
        console.log(inquiryId);
        setInquiryId(id);
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/taskReceive/${inquiryId}`, {}, { "Content-Type": "application/json" })
        console.log(result);
    }

    const designate = (id1: number) => {
        setIsModalVisible2(true)
        setId(id1);
        // console.log(id1,id);     
    }

    const aa = async (description: string, id: number) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/taskRejection`, { description, id }, { "Content-Type": "application/json" })
        console.log(result);
    }

    const handleChange = async (value: any) => {
        console.log(`selected ${value}`);
        setDeptId(value);
        // sinzetech-user/department/tree
        const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/department/tree`);
        console.log(result);
        setArr(result);
        setId(result[0].id);
    }

    const handleChange1 = async (departmentId: any) => {
        console.log(departmentId);
        // setInquirerId(value);
        const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/user?departmentId=${departmentId}&size=1000`);
        console.log(result);
    }

    const onChange = (date: any, dateString: any) => {
        console.log(date, dateString);
        const a = moment(dateString).format("YYYY-MM-DD HH:mm:ss");
        setPlannedDeliveryTime(a);
    }

    const value = (e: any) => {
        // console.log(e.target.value,"assadndsv");
        setVal(e.target.value)
    }

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

    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
            <Button onClick={() => { refuse() }}>拒绝</Button>
            <Button onClick={() => { receive(id) }}>接收</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => handleCancel1()}>关闭</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => handleCancel2()}>关闭</Button>
            <Button onClick={() => { assign(deptId, id, inquirerId, plannedDeliveryTime) }}>提交</Button>
        </div>
    ]
    const buttons3: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible3(false)}>关闭</Button>
            <Button onClick={() => { aa(val, id) }}>提交</Button>
        </div>
    ]
    //添加10条数据
    const cc = async () => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/initTask`)
        console.log(result);
    }
    console.log(inquiryId);

    return <>
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
                        // console.log(record);
                        return <>
                            <Button type="link" onClick={() => { taskDetail(record.id) }}>任务详情</Button>
                            <Button type="link" onClick={() => { designate(record.id) }}>指派</Button>
                            <Button type="link" onClick={() => { inquiryResults(record.id) }}>询价结果</Button>
                            <Button type="link" onClick={() => { submitTask(record.id) }}>提交任务</Button>
                        </>
                    }
                }]}
            refresh={refresh}
            extraOperation={<Button type="primary">导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
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
        <Modal width="700px" title="询价任务详情" visible={isModalVisible} footer={buttons} onCancel={handleCancel} >
            <Descriptions title="基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="编号">{obj.inquiryNumber}</Descriptions.Item>
                <Descriptions.Item label="项目名称">{obj.projectName}</Descriptions.Item>
                <Descriptions.Item label="客户名称">{obj.biddingPerson}</Descriptions.Item>
                <Descriptions.Item label="投标截止时间">{obj.biddingEndTime}</Descriptions.Item>
                <Descriptions.Item label="项目负责人">{obj.projectLeader}</Descriptions.Item>
                <Descriptions.Item label="信息申请人">{obj.createUserName}</Descriptions.Item>
                <Descriptions.Item label="申请时间">{obj.createTime}</Descriptions.Item>
                <Descriptions.Item label="备注">{obj.taskDescription}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="相关附件" bordered column={1} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.pdf">
                    <span style={{ color: "#FF8C00" }}>下载</span>
                    &nbsp;
                    <span style={{ color: "#FF8C00" }}>预览</span>
                </Descriptions.Item>
                <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.rar">
                    <span style={{ color: "#FF8C00" }}>下载</span>
                </Descriptions.Item>
            </Descriptions>
            <DetailContent>
                <DetailTitle title="操作信息" />
                <CommonTable
                    columns={[
                        ...enquiryTaskAction,
                    ]}
                    dataSource={columnsData}
                />
            </DetailContent>
        </Modal>
        <Modal width="700px" title="询价结果" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
            <DetailContent>
                <DetailTitle title="当前价格信息" />
                <CommonTable
                    columns={[
                        ...CurrentPriceInformation,
                    ]}
                    dataSource={columnsData}
                />
            </DetailContent>
            <div style={{ width: "500px", height: "100px", background: "# inquiry results", textAlign: "center", lineHeight: "100px", borderRadius: "5px" }}>
                补充信息补充信息补充信息补充信息补充信息补充信息补充信息
            </div>
            <Descriptions title="相关附件" bordered column={1} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.rar">
                    <span style={{ color: "#FF8C00" }}>下载</span>
                    &nbsp;
                    <span style={{ color: "#FF8C00" }}>预览</span>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
        <Modal width="700px" title="指派" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2}>
            部门 *<Select defaultValue="测试" style={{ width: 120 }} onChange={handleChange}>
                {
                    arr.map((item: any, index: any) => {
                        return <Select.Option value={index}>{item.title}</Select.Option>
                    })
                }
                <Select.Option value="1">测试</Select.Option>
            </Select>
            人员 *<Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange1}>
                {
                    arr.map((item: any, index: any) => {
                        return <Select.Option value={index}>{item.title}</Select.Option>
                    })
                }
                <Select.Option value="1">测试</Select.Option>
            </Select>
            <div>
                计划交付时间 *<DatePicker onChange={onChange} />
            </div>
        </Modal>
        <Modal width="700px" title="拒绝" visible={isModalVisible3} footer={buttons3} onCancel={handleCancel3}>
            拒绝原因 *<Input placeholder="请输入" value={val} onChange={(e) => { value(e) }} />
        </Modal>
        <Button onClick={() => {
            cc();
        }}>aa</Button>
    </>
}






