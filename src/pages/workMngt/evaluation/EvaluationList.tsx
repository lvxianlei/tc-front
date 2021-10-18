import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Row, Col, Form, TreeSelect, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Evaluation.module.less';
import EvaluationInformation from './EvaluationInformation';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../../utils/AuthUtil';

export default function EvaluationList(): React.ReactNode {

    const [ refresh, setRefresh ] = useState(false);

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
            key: 'programName',
            title: '项目名称',
            dataIndex: 'programName',
            width: 120
        },
        {
            key: 'expectDeliverTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'expectDeliverTime'
        },
        {
            key: 'assessUserName',
            title: '评估人',
            width: 150,
            dataIndex: 'assessUserName'
        },
        {
            key: 'status',
            title: '状态',
            dataIndex: 'status',
            width: 200,
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '已拒绝';
                    case 1:
                        return '待接收';
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
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    {
                        AuthUtil.getUserId().userId !== record.assessUser ? <Button type="link" disabled>评估信息</Button>
                        : <EvaluationInformation id={ record.id } updateList={ () => setRefresh(!refresh) }/>
                    }
                </Space>
            )
        }
    ]

    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    const [ programLeader,setProgramLeader ] = useState([]);
    const [ filterValue, setFilterValue ] = useState({});

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
            case "programLeader":
                return setProgramLeader(userData.records);
        };
    }
    
    return <Page
        path="/tower-science/assessTask/assessList"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'status',
                label: '任务状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="2">全部</Select.Option>
                    <Select.Option value="3" key="3">待完成</Select.Option>
                    <Select.Option value="4" key="4">已完成</Select.Option>
                </Select>
            },
            {
                name: 'expectDeliverTimeAll',
                label: '计划交付时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'assess',
                label: '评估人',
                children: <Row>
                    <Col>
                        <Form.Item name="assessUserDept">
                            <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'programLeader') } } style={{ width: "150px" }}>
                                { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="assessUser">
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
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.expectDeliverTimeAll) {
                const formatDate = values.expectDeliverTimeAll.map((item: any) => item.format("YYYY-MM-DD"));
                values.expectDeliverTimeStart = formatDate[0] + ' 00:00:00';
                values.expectDeliverTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        } }
    />
}