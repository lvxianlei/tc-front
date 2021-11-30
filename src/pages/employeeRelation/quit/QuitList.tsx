import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select, DatePicker } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function QuitList(): React.ReactNode {
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
            title: '公司',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '部门',
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
            title: '班组',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '员工类型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '入职时间',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '离职类型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '离职时间',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '离职原因',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'name',
            title: '审批状态',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button onClick={()=>{history.push(`/employeeRelation/quit/view/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/quit/${record.id}`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>编辑</Button>
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
                    <Button type="primary" onClick={()=>history.push('/employeeRelation/quit/0')} ghost>新增员工离职</Button>
                }
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工姓名进行查询" maxLength={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '离职类型',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={0} key="0">主动离职</Select.Option>
                            <Select.Option value={1} key="1">辞退</Select.Option>
                            <Select.Option value={2} key="2">退休</Select.Option>
                            <Select.Option value={3} key="3">死亡</Select.Option>
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