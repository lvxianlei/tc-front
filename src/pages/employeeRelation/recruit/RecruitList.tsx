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
            key: 'applicantName',
            title: '应聘人姓名',
            width: 100,
            dataIndex: 'applicantName'
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
            dataIndex: 'departmentName'
        },
        {
            key: 'postName',
            title: '入职岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'postType',
            title: '员工分组',
            width: 100,
            dataIndex: 'postType'
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
            dataIndex: 'education'
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
            dataIndex: 'workTime'
        },
        {
            key: 'bankCardNumber',
            title: '银行卡号',
            width: 150,
            dataIndex: 'bankCardNumber'
        },
        {
            key: 'bankName',
            title: '开户行',
            width: 100,
            dataIndex: 'bankName'
        },
        {
            key: 'probationPeriod',
            title: '试用期',
            width: 100,
            dataIndex: 'probationPeriod',
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
                    <Button onClick={()=>{history.push(`/employeeRelation/recruit/view/${record.id}`)}} type='link'>查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/recruit/edit/${record.id}/${record.status}`)}} type='link' >编辑</Button>
                    <Popconfirm
                        title="确认入职后，员工将信息将更新到员工档案中？"
                        onConfirm={ ()=>{RequestUtil.get(`/tower-hr/employee/information/confirm`,{employeeId: record.id}).then(()=>{
                            message.success('入职成功！')
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
                        onConfirm={ ()=>{RequestUtil.delete(`/tower-hr/employee/information`,{employeeId: record.id}).then(()=>{
                            message.success('删除成功！')
                        }).then(()=>{
                            setRefresh(!refresh)
                        }) }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status!==1}
                    >
                        <Button type="link"  disabled={record.status!==1}>删除</Button> 
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
                        children: <Input placeholder="请输入应聘者姓名/联系电话/身份证号进行查询" maxLength={200} />
                    },
                ]}
            />
    )
}