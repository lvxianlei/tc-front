/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔信息
*/

import React, { useState } from 'react';
import { Space, DatePicker, Select, Button, Row, Col, Form, TreeSelect, Spin, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import WithSectionModal from './WithSectionModal';
import { TreeNode } from 'antd/lib/tree-select';
import RequestUtil from '../../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';

export default function PoleInformation(): React.ReactNode {
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
            key: 'productNumber',
            title: '杆塔号',
            width: 150,
            dataIndex: 'productNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 120
        },
        {
            key: 'loftingDeliverTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'loftingDeliverTime'
        },
        {
            key: 'loftingUserName',
            title: '配段人',
            width: 150,
            dataIndex: 'loftingUserName',
        },
        {
            key: 'loftingStatus',
            title: '杆塔放样状态',
            dataIndex: 'loftingStatus',
            width: 200,
            render: (loftingStatus: number): React.ReactNode => {
                switch (loftingStatus) {
                    case 1:
                        return '待开始';
                    case 2:
                        return '配段中';
                    case 3:
                        return '出单中';
                    case 4:
                        return '已完成';
                    case 5:
                        return '已提交';
                }
            }
        },
        {
            key: 'loftingDeliverTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'loftingDeliverTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    {   userId === record.loftingUser ?
                        <>{  
                            record.loftingStatus === 2 ? <WithSectionModal id={ record.id } updateList={ () => setRefresh(!refresh) }/> : <Button type="link" disabled>配段</Button> 
                        }</>
                        : null
                    }
                    <Link to={ `/workMngt/setOutList/poleInformation/${ params.id }/poleLoftingDetails/${ record.id }` }>杆塔放样明细</Link>
                    {   userId === record.loftingUser ?
                        <>{  
                            record.loftingStatus === 3 ? <Link to={ `/workMngt/setOutList/poleInformation/${ params.id }/packingList/${ record.id }` }>包装清单</Link> : <Button type="link" disabled>包装清单</Button> 
                        }</>
                        : null
                    }
                </Space>
            )
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ refresh, setRefresh ] = useState(false);
    
    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    const [ materialUser,setMaterialUser ] = useState([]);
    const location = useLocation<{ state: string }>();
    const userId = AuthUtil.getUserId();

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
            case "materialUser":
                return setMaterialUser(userData.records);
        };
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    
    return <Page
        path="/tower-science/product/lofting"
        columns={ columns }
        headTabs={ [] }
        requestData={{ productCategoryId: params.id }}
        refresh={ refresh }
        extraOperation={ <Space direction="horizontal" size="small">
            {/* <Button type="primary" ghost>导出</Button> */}
            {
                userId === location.state ? 
                <Button type="primary" onClick={ () => RequestUtil.post(`/tower-science/product/submit`, { productCategoryId: params.id }).then(res => {
                    message.success('包装清单保存成功');
                    history.goBack();
                }) } ghost>完成汇总</Button>
                : null
            }
            <Button type="primary" onClick={ () => history.goBack() } ghost>返回上一级</Button>
        </Space>}
        searchFormItems={ [
            {
                name: 'newStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'loftingStatus',
                label: '杆塔放样状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="5">全部</Select.Option>
                    <Select.Option value={ 1 } key="1">待开始</Select.Option>
                    <Select.Option value={ 2 } key="2">配段中</Select.Option>
                    <Select.Option value={ 3 } key="3">出单中</Select.Option>
                    <Select.Option value={ 4 } key="4">已完成 </Select.Option>
                    <Select.Option value={ 5 } key="5">已提交</Select.Option>
                </Select>
            },
            {
                name: 'productCategory',
                label: '配段人',
                children: <Row>
                    <Col>
                        <Form.Item name="materialUserDepartment">
                            <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'materialUser') } } style={{ width: "150px" }}>
                                { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="materialUser">
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                { materialUser && materialUser.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.newStatusTime) {
                const formatDate = values.newStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        } }
    />
}