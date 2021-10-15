import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form, Row, Col, TreeSelect } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../common';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { FixedType } from 'rc-table/lib/interface';
import AssessmentInformation from './AssessmentInformation';
import styles from './AssessmentTask.module.less';
import Assign from './Assign';
import RequestUtil from '../../utils/RequestUtil';
import { TreeNode } from 'rc-tree-select';
import useRequest from '@ahooksjs/use-request';
import { useForm } from 'antd/es/form/Form';


export default function AssessmentTaskList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskCode',
            title: '评估任务编号',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'status',
            title: '任务状态',
            dataIndex: 'status',
            width: 120,
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '已拒绝';
                    case 1:
                        return '待确认';
                    case 2:
                        return '待指派';
                    case 3:
                        return '待完成';
                    case 4:
                        return '已完成';
                    case 5:
                        return '已提交';
                }
            }
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
            width: 200
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 230,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/assessmentTask/assessmentTaskDetail/${ record.id }` }>任务详情</Link>
                    {
                        record.status === 2 ? 
                        <Assign id={ record.id } updataList={ () => { setRefresh(!refresh); } } />
                        : <Button type="link" disabled>指派</Button>
                    }
                    {
                        record.status === 4 ? 
                        <AssessmentInformation id={ record.id } />
                        : <Button type="link" disabled>评估信息</Button>
                    }
                    <Popconfirm
                        title="确认提交?"
                        onConfirm={ () => {
                            RequestUtil.put(`/tower-science/assessTask/submit?id=${ record.id }`, { id: record.id }).then(res => {
                                setRefresh(!refresh); 
                            });
                        } }
                        okText="提交"
                        cancelText="取消"
                        disabled={ record.status !== 4 }
                    >
                        <Button type="link" disabled={ record.status !== 4 }>提交任务</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];

    const [ startRelease, setStartRelease ] = useState([]);
    const [ programLeader,setProgramLeader ] = useState([]);

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

    const renderTreeNodes = (data:any) => data.map((item:any) => {
        if (item.children) {
            item.disabled = true;
            return (<TreeNode key={ item.id } title={ item.title } value={ item.id } disabled={ item.disabled } className={ styles.node } >
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
    });

    const onDepartmentChange = async (value: Record<string, any>, title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${ value }&size=1000`);
        switch (title) {
            case "startReleaseDepartment":
                return setStartRelease(userData.records);
            case "programLeader":
                return setProgramLeader(userData.records);
        };
    }

    return <Page
        path="/tower-science/assessTask"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'a',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '任务状态',
                children: <Select placeholder="请选择" style={{ width: "150px" }}>
                    <Select.Option value="" key="6">全部</Select.Option>
                    <Select.Option value="0" key="0">已拒绝</Select.Option>
                    <Select.Option value="1" key="1">待确认</Select.Option>
                    <Select.Option value="2" key="2">待指派</Select.Option>
                    <Select.Option value="3" key="3">待完成</Select.Option>
                    <Select.Option value="4" key="4">已完成</Select.Option>
                    <Select.Option value="5" key="5">已提交</Select.Option>
                </Select>
            },
            {
                name: 'programLeader',
                label: '项目负责人',
                children: <Row>
                    <Col>
                        <Form.Item name="programLeaderDept">
                            <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'programLeader') } } style={{ width: "150px" }}>
                                { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="programLeader">
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                { programLeader && programLeader.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            },
            {
                name: 'startReleaseDate',
                label: '评估人',
                children: <Row>
                    <Col>
                        <Form.Item name="assessUserDept">
                            <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'startReleaseDepartment') } } style={{ width: "150px" }}>
                                { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="assessUser">
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                { startRelease && startRelease.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            },
            {
                name: 'bidEndTime',
                label: '投标截止时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称/客户名称"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.a) {
                const formatDate = values.a.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            if(values.bidEndTime) {
                const formatDate = values.bidEndTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.bidEndTimeStart = formatDate[0] + ' 00:00:00';
                values.bidEndTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        } }
    />
}