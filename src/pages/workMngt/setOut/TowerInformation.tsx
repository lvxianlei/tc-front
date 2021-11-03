/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息
*/

import React, { useState } from 'react';
import { Space, DatePicker, Select, Button, Popconfirm, message, Row, Col, Form, TreeSelect } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import TowerLoftingAssign from './TowerLoftingAssign';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';


export default function TowerInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ refresh, setRefresh ] = useState(false);
    const [ loftingUser, setLoftingUser ] = useState([]);
    const [ checkUser, setcheckUser ] = useState([]);
    
    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];

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
            case "loftingUserDept":
                return setLoftingUser(userData.records);
            case "checkUserDept":
                return setcheckUser(userData.records);
        };
    }

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'priority',
            title: '优先级',
            dataIndex: 'priority',
            width: 120,
            render: (pattern: number): React.ReactNode => {
                switch (pattern) {
                    case 1:
                        return '高';
                    case 2:
                        return '中';
                    case 3:
                        return '低';
                }
            }
        },
        {
            key: 'name',
            title: '段名',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '模式',
            width: 150,
            dataIndex: 'pattern',
            render: (pattern: number): React.ReactNode => {
                switch (pattern) {
                    case 1:
                        return '新放';
                    case 2:
                        return '重新出卡';
                    case 3:
                        return '套用';
                }
            }
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        },
        {
            key: 'loftingUserName',
            title: '放样人',
            width: 200,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'checkUserName',
            title: '校核人',
            width: 200,
            dataIndex: 'checkUserName'
        },
        {
            key: 'status',
            title: '放样状态',
            width: 200,
            dataIndex: 'status',
            render: (pattern: number): React.ReactNode => {
                switch (pattern) {
                    case 1:
                        return '放样中';
                    case 2:
                        return '校核中';
                    case 3:
                        return '已完成';
                    case 4:
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
            width: 250,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    {
                        record.status === 1 ? 
                        <Link to={ `/workMngt/setOutList/towerInformation/${ params.id }/lofting/${ record.id }` }>放样</Link> : <Button type="link" disabled>放样</Button>
                    }
                    {
                        record.status === 1 ? 
                        <Link to={ `/workMngt/setOutList/towerInformation/${ params.id }/NCProgram/${ record.id }` }>NC程序</Link> : <Button type="link" disabled>NC程序</Button>
                    }
                    {
                        record.status === 2 ? 
                        <Link to={ `/workMngt/setOutList/towerInformation/${ params.id }/towerCheck/${ record.id }` }>校核</Link> : <Button type="link" disabled>校核</Button>
                    }
                    <Link to={ `/workMngt/setOutList/towerInformation/${ params.id }/towerLoftingDetails/${ record.id }` }>塔型放样明细</Link>
                </Space>
            )
        }
    ]

    const onRefresh = () => {
        setRefresh(!refresh);
    }

    return <Page
        path={ `/tower-science/productSegment` }
        columns={ columns }
        headTabs={ [] }
        refresh={ refresh }
        requestData={{ productCategoryId: params.id }}
        extraOperation={ <Space direction="horizontal" size="small">
            {/* <Button type="primary" ghost>导出</Button> */}
            <Popconfirm
                title="确认提交?"
                onConfirm={ () => {
                    RequestUtil.post(`/tower-science/productCategory/submit`, { productCategoryId: params.id }).then(res => {
                        message.success('提交成功');
                        history.goBack();
                    });
                } }
                okText="提交"
                cancelText="取消"
            >
                <Button type="primary" ghost>提交</Button>
            </Popconfirm>
            <TowerLoftingAssign id={ params.id } update={ onRefresh } />
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </Space> }
        searchFormItems={ [
            {
                name: 'updateStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '放样状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="4">全部</Select.Option>
                    <Select.Option value="1" key="1">放样中</Select.Option>
                    <Select.Option value="2" key="2">校核中</Select.Option>
                    <Select.Option value="3" key="3">已完成</Select.Option>
                    <Select.Option value="4" key="4">已提交</Select.Option>
                </Select>
            },
            {
                name: 'loftingUser',
                label: '放样人',
                children: <Row>
                    <Col>
                        <Form.Item name="loftingUserDept">
                            <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'loftingUserDept') } } style={{ width: "150px" }}>
                                { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="loftingUser">
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                { loftingUser && loftingUser.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            },
            {
                name: 'checkUser',
                label: '校核人',
                children: <Row>
                    <Col>
                        <Form.Item name="checkUserDept">
                            <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'checkUserDept') } } style={{ width: "150px" }}>
                                { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="checkUser">
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                { checkUser && checkUser.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        } }
        tableProps={{
            pagination: false
        }}
    />
}