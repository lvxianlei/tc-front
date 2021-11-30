import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message } from 'antd'
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
            title: '姓名',
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
            title: '身份证号',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '方案',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '社保开始月',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '社保结束月',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '公积金开始月',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '公积金结束月',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryName',
            title: '公积金申报基数',
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
            title: '专业'
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
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工姓名/身份证号进行查询" maxLength={200} />
                    },
                ]}
            />
    )
}