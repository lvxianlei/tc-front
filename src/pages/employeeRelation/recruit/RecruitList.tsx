import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function RecruitList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string, materialLeader: string }>();
    const [filterValue, setFilterValue] = useState({});
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
            title: '应聘人姓名',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '性别',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '民族',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '入职公司',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '入职部门/班组',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '入职岗位',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '员工分组',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '籍贯',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '年龄',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '身份证号',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'name',
            title: '学历',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '毕业院校',
            width: 100,
            dataIndex: 'pattern'
        },
        {
            key: 'name',
            title: '专业',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '联系电话',
            width: 100,
            dataIndex: 'pattern',
        },
        {
            key: 'plannedDeliveryTime',
            title: '预计到岗时间',
            width: 100,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'materialLeaderName',
            title: '银行卡号',
            width: 150,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialCheckLeaderName',
            title: '开户行',
            width: 100,
            dataIndex: 'materialCheckLeaderName'
        },
        {
            key: 'status',
            title: '试用期',
            width: 100,
            dataIndex: 'status',
        },
        {
            key: 'updateStatusTime',
            title: '审批状态',
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
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>查看</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/check/${record.id}/${record.materialLeader}`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>编辑</Button>
                    <Popconfirm
                        title="确认入职后，员工将信息将更新到员工档案中？"
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-science/drawProductSegment/${record.id}`).then(()=>{
                            message.success('删除成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >确认入职</Button> 
                    </Popconfirm>
                    <Popconfirm
                        title="确认删除？"
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-science/drawProductSegment/${record.id}`).then(()=>{
                            message.success('删除成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >删除</Button> 
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
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
                    <Button type="primary" onClick={()=>history.push('/workMngt/pickList')} ghost>新增入职</Button>
                }
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入应聘者姓名/联系电话/身份证号进行查询" maxLength={200} />
                    },
                ]}
            />
    )
}