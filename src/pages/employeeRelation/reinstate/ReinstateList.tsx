import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select, DatePicker } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

export default function ReinstateList(): React.ReactNode {
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
            key: 'employeeName',
            title: '姓名',
            width: 100,
            dataIndex: 'employeeName'
        },
        {
            key: 'inductionDate',
            title: '入职日期',
            width: 100,
            dataIndex: 'inductionDate',
            render:(inductionDate:string)=>{
                return inductionDate?moment(inductionDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'departureDate',
            title: '离职日期',
            width: 100,
            dataIndex: 'departureDate',
            render:(departureDate:string)=>{
                return departureDate?moment(departureDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'departureType',
            title: '离职类型',
            width: 100,
            dataIndex: 'departureType',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '主动离职';
                    case 2:
                        return '辞退';
                    case 3:
                        return '退休';
                    case 4:
                        return '死亡';
                }
            } 
        },
        {
            key: 'departureReason',
            title: '离职原因',
            width: 200,
            dataIndex: 'departureReason',
        },
        {
            key: 'reinstatementDate',
            title: '复职日期',
            width: 100,
            dataIndex: 'reinstatementDate',
            render:(reinstatementDate:string)=>{
                return reinstatementDate?moment(reinstatementDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'companyName',
            title: '复职公司',
            width: 100,
            dataIndex: 'companyName'
        },
        {
            key: 'productCategoryName',
            title: '复职部门/班组',
            width: 100,
            dataIndex: 'productCategoryName',
            render:(_:any,record:any)=>{
                return <span>{ record.departmentName&&record.teamName?record.departmentName + '/' + record.teamName:'-' }</span>
            }
        },
        {
            key: 'postName',
            title: '复职岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'reinstatementNature',
            title: '复职性质',
            width: 100,
            dataIndex: 'reinstatementNature',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '一次复职';
                    case 2:
                        return '二次复职';
                    case 3:
                        return '三次复职';
                    case 4:
                        return '四次复职';
                    case 5:
                        return '五次复职';
                    case 6:
                        return '六次及以上';
                }
            } 
        },
        {
            key: 'probationPeriod',
            title: '试用期',
            width: 100,
            dataIndex: 'probationPeriod',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '无试用期';
                    case 2:
                        return '一个月';
                    case 3:
                        return '二个月';
                    case 4:
                        return '三个月';
                    case 5:
                        return '四个月';
                    case 6:
                        return '五个月';
                    case 7:
                        return '六个月';
                }
            } 
        },
        {
            key: 'status',
            title: '审批状态',
            width: 100,
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
                    <Button onClick={()=>{history.push(`/employeeRelation/reinstate/View/${record.id}`)}} type='link' >查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/reinstate/Edit/${record.id}/${record.status}`)}} type='link' disabled={record.status===2}>编辑</Button>
                    <Popconfirm
                        title="确认复职后，员工将信息将更新到员工档案中？"
                        onConfirm={ ()=>{RequestUtil.get(`/tower-hr/employeeReinstatement/confirm`,{id: record.id}).then(()=>{
                            message.success('复职成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status!==3}
                    >
                        <Button type="link"  disabled={record.status!==3}>确认复职</Button> 
                    </Popconfirm>
                    <Popconfirm
                        title="确认删除？"
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-hr/employeeReinstatement?id=${record.id}`).then(()=>{
                            message.success('删除成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status!==1}
                    >
                        <Button type="link" disabled={record.status!==1}>删除</Button> 
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.reinstatementDateStart = formatDate[0]+ ' 00:00:00';
            value.reinstatementDateEnd = formatDate[1]+ ' 23:59:59';
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
                path={`/tower-hr/employeeReinstatement`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                requestData={{ productCategory: params.id }}
                extraOperation={
                    <Button type="primary" onClick={()=>history.push('/employeeRelation/reinstate/Edit/0/0')} ghost>新增员工复职</Button>
                }
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工姓名/电话/身份证号进行查询" maxLength={200} />
                    },
                    {
                        name: 'reinstatementNature',
                        label: '离职类型',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                                <Select.Option value={1} key="1">一次复职</Select.Option>
                                <Select.Option value={2} key="2">二次复职</Select.Option>
                                <Select.Option value={3} key="3">三次复职</Select.Option>
                                <Select.Option value={4} key="4">四次复职</Select.Option>
                                <Select.Option value={5} key="5">五次复职</Select.Option>
                                <Select.Option value={6} key="6">六次及以上</Select.Option>
                        </Select>
                    },
                    {
                        name: 'statusUpdateTime',
                        label: '复职日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                ]}
            />
    )
}