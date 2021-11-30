import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, DatePicker } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function ArchivesList(): React.ReactNode {
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
            title: '在职状态',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '员工姓名',
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
            title: '公司',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '部门/班组',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '岗位',
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
            title: '出生日期',
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
            title: '联系电话',
            width: 100,
            dataIndex: 'pattern'
        },
        {
            key: 'name',
            title: '入职时间',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '员工性质',
            width: 100,
            dataIndex: 'pattern',
        },
        {
            key: 'plannedDeliveryTime',
            title: '转正日期',
            width: 100,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'plannedDeliveryTime',
            title: '工龄',
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
            title: '紧急联系人',
            width: 100,
            dataIndex: 'status',
        },
        {
            key: 'updateStatusTime',
            title: '紧急联系电话',
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
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工姓名/电话/身份证号进行查询" maxLength={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '员工性质',
                        children: <Input placeholder="请输入员工姓名/电话/身份证号进行查询" maxLength={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '岗位类别',
                        children: <Input placeholder="请输入员工姓名/电话/身份证号进行查询" maxLength={200} />
                    },
                    {
                        name: 'statusUpdateTime',
                        label: '入职日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                ]}
            />
    )
}