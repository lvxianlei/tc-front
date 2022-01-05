import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

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
            key: 'employeeName',
            title: '应聘人姓名',
            width: 100,
            dataIndex: 'employeeName'
        },
        {
            key: 'gender',
            title: '性别',
            width: 100,
            dataIndex: 'gender'
        },
        {
            key: 'national',
            title: '民族',
            width: 100,
            dataIndex: 'national'
        },
        {
            key: 'companyName',
            title: '入职公司',
            width: 100,
            dataIndex: 'companyName'
        },
        {
            key: 'departmentName',
            title: '入职部门/班组',
            width: 100,
            dataIndex: 'departmentName',
            render:(_:any,record:any)=>{
                return <span>{ record.departmentId!=='0'?record.departmentName&&record.teamName?record.departmentName + '/' + record.teamName:'-':record.teamName }</span>
            }
        },
        {
            key: 'postName',
            title: '入职岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'postTypeName',
            title: '员工分组',
            width: 100,
            dataIndex: 'postTypeName'
        },
        {
            key: 'nativePlace',
            title: '籍贯',
            width: 100,
            dataIndex: 'nativePlace'
        },
        {
            key: 'age',
            title: '年龄',
            width: 100,
            dataIndex: 'age'
        },
        {
            key: 'idNumber',
            title: '身份证号',
            width: 100,
            dataIndex: 'idNumber'
        },
        {
            key: 'education',
            title: '学历',
            width: 100,
            dataIndex: 'education',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '博士';
                    case 2:
                        return '硕士';
                    case 3:
                        return '本科';
                    case 4:
                        return '大专';
                    case 5:
                        return '高中';
                    case 6:
                        return '中专';
                    case 7:
                        return '中学';
                    case 8:
                        return '小学';
                    case 9:
                        return '其他';
                }
            } 
        },
        {
            key: 'graduateSchool',
            title: '毕业院校',
            width: 100,
            dataIndex: 'graduateSchool'
        },
        {
            key: 'professional',
            title: '专业',
            width: 100,
            dataIndex: 'professional'
        },
        {
            key: 'phoneNumber',
            title: '联系电话',
            width: 100,
            dataIndex: 'phoneNumber',
        },
        {
            key: 'workTime',
            title: '预计到岗时间',
            width: 100,
            dataIndex: 'workTime',
            render:(workTime:string)=>{
                return workTime?moment(workTime).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'bankCardNumber',
            title: '银行卡号',
            width: 150,
            dataIndex: 'bankCardNumber'
        },
        {
            key: 'bankName',
            title: '开户银行',
            width: 100,
            dataIndex: 'bankName'
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
                <>
                    <Button onClick={()=>{history.push(`/employeeRelation/recruit/view/${record.id}`)}} className='btn-operation-link' type='link'>查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/recruit/edit/${record.id}/${record.status}`)}} type='link' className='btn-operation-link' disabled={ record.status === 2||record.status === 3 }>编辑</Button>
                    <Popconfirm
                        title="确认入职后，员工将信息将更新到员工档案中？"
                        className='btn-operation-link'
                        onConfirm={ ()=>{RequestUtil.get(`/tower-hr/employee/information/confirm`,{archivesId: record.id}).then(()=>{
                            message.success('入职成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status!==3}
                    >
                        <Button type="link" className='btn-operation-link' style={{padding: "0"}} disabled={record.status!==3}>确认入职</Button> 
                    </Popconfirm>
                    <Popconfirm
                        title="确认删除？"
                        className='btn-operation-link'
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-hr/employee/information?archivesId=${record.id}`).then(()=>{
                            message.success('删除成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status!==1}
                    >
                        <Button type="link" className='btn-operation-link' style={{padding: "0"}} disabled={record.status!==1}>删除</Button> 
                    </Popconfirm>
                </>
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
                path={`/tower-hr/employee/information`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                extraOperation={
                    <Button type="primary" onClick={()=>history.push('/employeeRelation/recruit/new')} ghost>新增入职</Button>
                }
                searchFormItems={[
                    {
                        name: 'keyword',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入应聘者姓名/联系电话/身份证号进行查询" maxLength={200} style={{width:'300px'}}/>
                    },
                ]}
            />
    )
}