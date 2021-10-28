import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Popconfirm, Select, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import TowerPickAssign from './TowerPickAssign';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import TreeSelect, { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './pick.module.less';
import useRequest from '@ahooksjs/use-request';

export default function PickTowerMessage(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string }>();
    const [filterValue, setFilterValue] = useState({});
    const [pickLeader, setPickLeader] = useState<any|undefined>([]);
    const [checkLeader, setCheckLeader] = useState<any|undefined>([]);
    const [department, setDepartment] = useState<any|undefined>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'name',
            title: '段名',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '模式',
            width: 100,
            dataIndex: 'pattern',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "新放"
                  },
                  {
                    value: 2,
                    label: "重新出卡"
                  },
                  {
                    value: 3,
                    label: "套用"
                  },
                ]
                return <>{value&&value!==-1?renderEnum.find((item: any) => item.value === value).label:null}</>
            }
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'materialLeaderName',
            title: '提料人',
            width: 100,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialCheckLeaderName',
            title: '校对人',
            width: 100,
            dataIndex: 'materialCheckLeaderName'
        },
        {
            key: 'status',
            title: '提料状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 1,
                        label: "提料中"
                    },
                    {
                        value: 2,
                        label: "校核中"
                    },
                    {
                        value: 3,
                        label: "已完成"
                    },
                    {
                        value: 4,
                        label: "已提交"
                    }
                ]
                     return <>{value&&renderEnum.find((item: any) => item.value === value).label}</>
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
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/pick/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>提料</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/check/${record.id}/${record.materialLeader}`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>校核</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/detail/${record.id}`)}} type='link' disabled={record.status<3}>明细</Button>
                </Space>
            )
        }
    ];
    const onDepartmentChange = async (value: Record<string, any>, name: string) => {
        if(value){
            const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
            if(name==='提料'){
                setPickLeader(userData.records);
            }
            else{
                setCheckLeader(userData.records);
            }
        }else{
            setPickLeader([]);
            setCheckLeader([]);
        }
       
    }
    const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
        if (item.children) {
            item.disabled = true;
            return (
            <TreeNode key={item.id} title={item.title} value={item.id} disabled={item.disabled} className={styles.node}>
                {renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    const onRefresh=()=>{
        setRefresh(!refresh);
    }
    return (
        <Page
            path={`/tower-science/drawProductSegment`}
            columns={columns}
            refresh={refresh}
            onFilterSubmit={onFilterSubmit}
            filterValue={ filterValue }
            requestData={{ productCategory: params.id }}
            extraOperation={
                <Space>
                <Button type="primary" ghost>导出</Button>
                <Popconfirm
                    title="确认提交?"
                    onConfirm={ async () => {
                        await RequestUtil.post(`/tower-science/drawProductSegment/${params.id}/submit`).then(()=>{
                            message.success('提交成功')
                        })
                    } }
                    okText="确认"
                    cancelText="取消"
                >   
                    <Button type="primary" ghost>提交</Button>
                </Popconfirm>
                { params.status==='1' ? <TowerPickAssign id={ params.id } onRefresh={onRefresh}/> : null }
                <Button type="primary" onClick={()=>history.push('/workMngt/pickList')} ghost>返回上一级</Button>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '提料状态',
                    children: <Select style={{width:'100px'}}>
                        <Select.Option value={''} key ={''}>全部</Select.Option>
                        <Select.Option value={1} key={1}>提料中</Select.Option>
                        <Select.Option value={2} key={2}>校核中</Select.Option>
                        <Select.Option value={3} key={3}>已完成</Select.Option>
                        <Select.Option value={4} key={4}>已提交</Select.Option>
                    </Select>
                },
                {
                    name: 'materialLeaderDepartment',
                    label: '提料人',
                    children:  <TreeSelect style={{width:'200px'}}
                                    allowClear
                                    onChange={ (value: any) => { onDepartmentChange(value, '提料') }  }
                                >
                                    {renderTreeNodes(wrapRole2DataNode( department ))}
                                </TreeSelect>
                },
                {
                    name: 'materialLeader',
                    label:'',
                    children:   <Select style={{width:'100px'}} allowClear>
                                    { pickLeader && pickLeader.map((item:any)=>{
                                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    }) }
                                </Select>
                },
                {
                    name: 'materialCheckLeaderDepartment',
                    label: '校核人',
                    children:  <TreeSelect style={{width:'200px'}}
                                    allowClear
                                    onChange={ (value: any) => { onDepartmentChange(value, '校核') }  }
                                >
                                    {renderTreeNodes(wrapRole2DataNode( department ))}
                                </TreeSelect>
                },
                {
                    name: 'materialCheckLeader',
                    label:'',
                    children:   <Select style={{width:'100px'}} allowClear>
                                    { checkLeader && checkLeader.map((item:any)=>{
                                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    }) }
                                </Select>
                }
            ]}
        />
    )
}