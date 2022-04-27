import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form, Row, Col } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { Page } from '../common';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { FixedType } from 'rc-table/lib/interface';
import AssessmentInformation from './AssessmentInformation';
import styles from './AssessmentTask.module.less';
import Assign from './Assign';
import RequestUtil from '../../utils/RequestUtil';
import { TreeNode } from 'rc-tree-select';
import useRequest from '@ahooksjs/use-request';


export default function AssessmentTaskList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, userId?: string }>();

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
                            ? <Assign id={record.id} updataList={() => { setRefresh(!refresh); }} />
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

    // const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
    // const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data);
    }), {})
    const startRelease: any = data?.records || [];
    // const departmentData: any = data || [];

    // const [startRelease, setStartRelease] = useState([]);

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    const renderTreeNodes = (data: any) => data.map((item: any) => {
        if (item.children) {
            item.disabled = true;
            return (<TreeNode key={item.id} title={item.title} value={item.id} disabled={item.disabled} className={styles.node} >
                {renderTreeNodes(item.children)}
            </TreeNode>);
        }
        return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });

    const onDepartmentChange = async (value: Record<string, any>, title?: string) => {
        const userData: any = await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch (title) {
            case "startReleaseDepartment":
            // return setStartRelease(userData.records);
        };
    }

    return (
        <div className={styles.list}>
            <Page
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
                        // name: 'startReleaseDate',
                        name: 'assessUser',
                        label: '评估人',
                        children: <Row>
                            {/* <Col>
                                <Form.Item name="assessUserDept">
                                    <TreeSelect placeholder="请选择" onChange={(value: any) => { onDepartmentChange(value, 'startReleaseDepartment') }} style={{ width: "150px" }}>
                                        {renderTreeNodes(wrapRole2DataNode(departmentData))}
                                    </TreeSelect>
                                </Form.Item>
                            </Col> */}
                            <Col>
                                <Form.Item name="assessUser" initialValue={location.state?.userId || ''}>
                                    <Select placeholder="请选择" style={{ width: "150px" }}>
                                        {startRelease && startRelease.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="任务编号/项目名称/客户名称/项目负责人" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
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
                    setFilterValue(values);
                    return values;
                }}
            />
        </div>
    )
}