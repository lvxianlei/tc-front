import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

export default function FullList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string, materialLeader: string }>();
    const [filterValue, setFilterValue] = useState({
        positiveStatus: 1
    });
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'employeeName',
            title: '员工姓名',
            width: 100,
            dataIndex: 'employeeName'
        },
        {
            key: 'postName',
            title: '岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'inductionDate',
            title: '入职时间',
            width: 100,
            dataIndex: 'inductionDate',
            render:(inductionDate: string)=>{
                return inductionDate?moment(inductionDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'probationPeriod',
            title: '试用期',
            width: 100,
            dataIndex: 'probationPeriod',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '无试用期';
                    case 1:
                        return '一个月';
                    case 2:
                        return '二个月';
                    case 3:
                        return '三个月';
                    case 4:
                        return '四个月';
                    case 5:
                        return '五个月';
                    case 6:
                        return '六个月';
                }
            } 
        },
        {
            key: 'positiveDate',
            title: '转正日期',
            width: 100,
            dataIndex: 'positiveDate',
            render:(positiveDate: string)=>{
                return positiveDate?moment(positiveDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'checkResult',
            title: '考核结果',
            width: 150,
            dataIndex: 'checkResult',
            // render: (status: number): React.ReactNode => {
            //     switch (status) {
            //         case 1:
            //             return '提前转正';
            //         case 2:
            //             return '正常转正';
            //         case 3:
            //             return '延期转正';
            //     }
            // } 
        },
        {
            key: 'positiveComments',
            title: '转正评语',
            width: 100,
            dataIndex: 'positiveComments'
        },
        {
            key: 'positiveStatus',
            title: '转正状态',
            width: 100,
            dataIndex: 'positiveStatus',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '待转正';
                    case 2:
                        return '已转正';
                }
            } 
        },
        {
            key: 'status',
            title: '审批状态',
            width: 200,
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '待提交';
                    case 2:
                        return '审批中';
                    case 3:
                        return '审批通过';
                    case 4:
                        return '审批不通过';
                }
            } 
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button onClick={()=>{history.push(`/employeeRelation/full/view/${record.id}`)}} type='link' >查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/full/sure/${record.id}`)}} type='link' disabled={record.status===2||record.status===3||record.positiveStatus===2}>转正</Button>
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
                path={`/tower-hr/positive/check`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'employeeName',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工名称进行查询" maxLength={200} style={{width:'200px'}}/>
                    },
                    {
                        name: 'checkResult',
                        label: '考核结果',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={'提前转正'} key="1">提前转正</Select.Option>
                            <Select.Option value={'正常转正'} key="2">正常转正</Select.Option>
                            <Select.Option value={'延期转正'} key="3">延期转正</Select.Option>
                        </Select>
                    },
                    {
                        name: 'positiveStatus',
                        label: '转正状态',
                        children: <Select placeholder="请选择" style={{ width: "150px" }} defaultValue={1}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={1} key="1">待转正</Select.Option>
                            <Select.Option value={2} key="2">已转正</Select.Option>
                        </Select>
                    },
                ]}
            />
    )
}