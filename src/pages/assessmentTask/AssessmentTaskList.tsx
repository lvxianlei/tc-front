import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form, Modal, message } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IntgSelect, SearchTable } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import AssessmentInformation from './AssessmentInformation';
import styles from './AssessmentTask.module.less';
import RequestUtil from '../../utils/RequestUtil';
import SelectUser from '../common/SelectUser';
import moment from 'moment';


export default function AssessmentTaskList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, userId?: string }>();
    const [assignVisible, setAssignVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [taskId, setTaskId] = useState<string>('');
    const history = useHistory();

    const columns = [
        {
            key: 'index',
            title: '序号',
            fixed: "left" as FixedType,
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskCode',
            title: '评估任务编号',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'statusName',
            title: '任务状态',
            dataIndex: 'statusName',
            width: 120
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'assessUserName',
            title: '评估人',
            width: 150,
            dataIndex: 'assessUserName'
        },
        {
            key: 'programName',
            title: '项目名称',
            dataIndex: 'programName',
            width: 200
        },
        {
            key: 'customer',
            title: '客户名称',
            dataIndex: 'customer',
            width: 200
        },
        {
            key: 'programLeaderName',
            title: '项目负责人',
            dataIndex: 'programLeaderName',
            width: 150
        },
        {
            key: 'bidEndTime',
            title: '投标截止时间',
            dataIndex: 'bidEndTime',
            format: 'YYYY-MM-DD',
            width: 200
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 230,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/taskMngt/assessmentTaskList/assessmentTaskDetail/${record.id}`}>任务详情</Link>
                    {
                        record.status === 2
                            ? <Button type='link' onClick={async () => {
                                setTaskId(record.id);
                                form.setFieldsValue({
                                    expectDeliverTime: record.expectDeliverTime ? moment(record.expectDeliverTime) : ''
                                })
                                setAssignVisible(true);
                            }}>指派</Button>
                            : <Button type="link" disabled>指派</Button>
                    }
                    {
                        record.status === 4 || record.status === 5
                            ? <AssessmentInformation id={record.id} />
                            : <Button type="link" disabled>评估信息</Button>
                    }
                    <Popconfirm
                        title="确认提交?"
                        onConfirm={() => {
                            RequestUtil.put(`/tower-science/assessTask/submit?id=${record.id}`).then(res => {
                                setRefresh(!refresh);
                            });
                        }}
                        okText="提交"
                        cancelText="取消"
                        disabled={record.status !== 4}
                    >
                        <Button type="link" disabled={record.status !== 4}>提交任务</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };

    const handleAssignModalOk = async () => {
        try {
            form.validateFields().then(async res => {
                const submitData = await form.getFieldsValue(true);
                submitData.expectDeliverTime = moment(submitData.expectDeliverTime).format("YYYY-MM-DD HH:ss:mm");
                await RequestUtil.put('/tower-science/assessTask/assign', {
                    ...submitData,
                    id: taskId
                }).then(() => {
                    message.success('指派成功！')
                }).then(() => {
                    setAssignVisible(false);
                    form.resetFields();
                }).then(() => {
                    setRefresh(!refresh);
                    history.go(0)
                })
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleAssignModalCancel = () => {
        setAssignVisible(false);
        form.resetFields();
    };


    return (
        <div className={styles.list}>
            <Modal visible={assignVisible} title="指派" okText="提交" onOk={handleAssignModalOk} onCancel={handleAssignModalCancel}>
                <Form form={form} {...formItemLayout} layout="horizontal">
                    <Form.Item name="assessUserName" label="人员" rules={[{ required: true, message: "请选择人员" }]}>
                        <Input size="small" disabled suffix={
                            <SelectUser key={'assessUser'} selectedKey={[form?.getFieldsValue(true)?.assessUserName]} onSelect={(selectedRows: Record<string, any>) => {
                                form.setFieldsValue({
                                    assessUser: selectedRows[0]?.userId,
                                    assessUserName: selectedRows[0]?.name,
                                })
                            }} />
                        } />
                    </Form.Item>
                    <Form.Item name="expectDeliverTime" label="计划交付时间" rules={[{ required: true, message: "请选择计划交付时间" }]}>
                        <DatePicker style={{ width: '100%' }} showTime />
                    </Form.Item>
                </Form>
            </Modal>
            <SearchTable
                path="/tower-science/assessTask"
                columns={columns}
                headTabs={[]}
                exportPath={`/tower-science/assessTask`}
                requestData={{ status: location.state?.state, assessUser: location.state?.userId }}
                refresh={refresh}
                searchFormItems={[
                    {
                        name: 'a',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker />
                    },
                    {
                        name: 'status',
                        label: '任务状态',
                        children: <Form.Item name="status" initialValue={location.state?.state}>
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                <Select.Option value="" key="6">全部</Select.Option>
                                <Select.Option value={0} key="0">已拒绝</Select.Option>
                                <Select.Option value={1} key="1">待确认</Select.Option>
                                <Select.Option value={2} key="2">待指派</Select.Option>
                                <Select.Option value={3} key="3">待完成</Select.Option>
                                <Select.Option value={4} key="4">已完成</Select.Option>
                                <Select.Option value={5} key="5">已提交</Select.Option>
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'assessUser',
                        label: '评估人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="任务编号/项目名称/客户名称/项目负责人" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: any) => {
                    if (values.a) {
                        const formatDate = values.a.map((item: any) => item.format("YYYY-MM-DD"));
                        values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                        values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                    }
                    if (values.bidEndTime) {
                        const formatDate = values.bidEndTime.map((item: any) => item.format("YYYY-MM-DD"));
                        values.bidEndTimeStart = formatDate[0] + ' 00:00:00';
                        values.bidEndTimeEnd = formatDate[1] + ' 23:59:59';
                    }
                    if (values.assessUser) {
                        values.assessUser = values.assessUser?.value;
                    }
                    setFilterValue(values);
                    return values;
                }}
            />
        </div>
    )
}