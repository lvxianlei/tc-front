import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select, DatePicker } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function TransferList(): React.ReactNode {
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
            title: '员工姓名',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '原公司',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '原部门/班组',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '原岗位',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '调入公司',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '调入部门/班组',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '现岗位',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '调动日期',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '调派类型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '审批状态',
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
                extraOperation={
                    <Button type="primary" onClick={()=>history.push('/workMngt/pickList')} ghost>新增员工调动</Button>
                }
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工姓名进行查询" maxLength={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '调派类型',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={0} key="0">晋升</Select.Option>
                            <Select.Option value={1} key="1">调动</Select.Option>
                            <Select.Option value={2} key="2">借调</Select.Option>
                            <Select.Option value={3} key="3">外派</Select.Option>
                            <Select.Option value={4} key="4">工商调动</Select.Option>
                        </Select>
                    },
                    {
                        name: 'statusUpdateTime',
                        label: '调动日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                ]}
            />
    )
}