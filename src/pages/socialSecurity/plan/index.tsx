import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function PlanList(): React.ReactNode {
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
            title: '方案名称',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '缴纳地区',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '缴纳公司',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '人数',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '状态',
            width: 100,
            dataIndex: 'productCategoryName'
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
                        title="确定启用？"
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-science/drawProductSegment/${record.id}`).then(()=>{
                            message.success('启用成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >启用</Button> 
                    </Popconfirm>
                    <Popconfirm
                        title="确认禁用？"
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-science/drawProductSegment/${record.id}`).then(()=>{
                            message.success('禁用成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >禁用</Button> 
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
                extraOperation={
                    <Button type="primary" onClick={()=>history.push('/workMngt/pickList')} ghost>新增方案</Button>
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