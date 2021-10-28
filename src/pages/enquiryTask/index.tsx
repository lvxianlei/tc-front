import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal, Form, Descriptions, Space, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { enquiryTaskList, enquiryTaskAction, CurrentPriceInformation } from "./enquiryTask.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { DetailContent, Page } from '../common';

export default function EnquiryTask(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    const [filterValue, setFilterValue] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
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

    const aa = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const bb = () => {
        setIsModalVisible1(true);
    }

    const handleOk1 = () => {
        setIsModalVisible1(false);
    };

    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };

    return <>
        <Page
            path="/tower-supply/inquiryTask"
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    fixed: "left"
                },
                ...enquiryTaskList,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        console.log(record);
                        return <>
                            {/* <Button type="link" onClick={() => history.push(`/project/invoicing/detail/${record.id}`)}>查看</Button>
                            <Button type="link" onClick={() => history.push(`/project/invoicing/edit/${record.id}`)}>编辑</Button> */}
                            {/* <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button> */}
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
        <Modal width="700px" title="询价任务详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
            <Descriptions title="基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="编号">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="项目名称">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="客户名称">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="投标截止时间">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="项目负责人">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="信息申请人">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="申请时间">Cloud Database</Descriptions.Item>
                <Descriptions.Item label="备注">Cloud Database</Descriptions.Item>
            </Descriptions>
            <Descriptions title="相关附件" bordered column={1} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.pdf">
                    <span style={{color:"#FF8C00"}}>下载</span>
                    &nbsp;
                    <span style={{color:"#FF8C00"}}>预览</span>
                </Descriptions.Item>
                <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.rar">
                    <span style={{color:"#FF8C00"}}>下载</span>
                </Descriptions.Item>
            </Descriptions>
            <Descriptions title="操作信息">
            </Descriptions>
            <Page
                path="/tower-market/inquiryTask"
                columns={[
                    ...enquiryTaskAction,
                ]}
                searchFormItems={[]}
            />
        </Modal>
        <Modal width="700px" title="询价结果" visible={isModalVisible1} onOk={handleOk1} onCancel={handleCancel1}>
            <Descriptions title="当前价格信息">
            </Descriptions>
            <Page
                path="/tower-market/inquiryTask"
                columns={[
                    ...CurrentPriceInformation
                ]}
                searchFormItems={[]}
            />
            <div style={{ width: "500px", height: "100px", background: "#ccc", textAlign: "center", lineHeight: "100px", borderRadius: "5px" }}>
                补充信息补充信息补充信息补充信息补充信息补充信息补充信息
            </div>
            <Descriptions title="相关附件" bordered column={1} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称.rar">
                    <span style={{color:"#FF8C00"}}>下载</span>
                    &nbsp;
                    <span style={{color:"#FF8C00"}}>预览</span>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
        <button onClick={() => {
            aa();
        }}>按钮1</button>
        <button onClick={() => {
            bb();
        }}>按钮2</button>
    </>
}






