import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

export default function LabourList(): React.ReactNode {
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
            key: 'contractNumber',
            title: '合同号',
            width: 100,
            dataIndex: 'contractNumber'
        },
        {
            key: 'employeeName',
            title: '员工姓名',
            width: 100,
            dataIndex: 'employeeName'
        },
        {
            key: 'employeeStatus',
            title: '在职状态',
            width: 100,
            dataIndex: 'employeeStatus',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '在职';
                    case 2:
                        return '离职';
                }
            } 
        },
        {
            key: 'idNumber',
            title: '身份证号',
            width: 100,
            dataIndex: 'idNumber'
        },
        {
            key: 'companyName',
            title: '公司',
            width: 100,
            dataIndex: 'companyName'
        },
        {
            key: 'departmentName',
            title: '部门/班组',
            width: 100,
            dataIndex: 'departmentName',
            render:(_:any,record:any)=>{
                return record.departmentId!=='0'?record.departmentName+'/'+record.teamName:record.teamName
            }
        },
        {
            key: 'postName',
            title: '岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'signedCompanyName',
            title: '合同签署公司',
            width: 100,
            dataIndex: 'signedCompanyName'
        },
        {
            key: 'contractType',
            title: '合同类型',
            width: 100,
            dataIndex: 'contractType',
            render: (contractType: number): React.ReactNode => {
                switch (contractType) {
                    case 1:
                        return '固定期限劳动合同';
                    case 2:
                        return '无固定期限劳动合同';
                    case 3:
                        return '超龄返聘合同';
                    case 4:
                        return '实习合同';
                    case 5:
                        return '其他合同';
                }
            } 
        },
        {
            key: 'contractStartDate',
            title: '合同开始日期',
            width: 100,
            dataIndex: 'contractStartDate',
            render:(contractStartDate: string)=>{
                return contractStartDate?moment(contractStartDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'contractEndDate',
            title: '合同截止日期',
            width: 100,
            dataIndex: 'contractEndDate',
            render:(contractEndDate: string)=>{
                return contractEndDate?moment(contractEndDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'status',
            title: '合同状态',
            width: 100,
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '有效';
                    case 2:
                        return '无效';
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
                    <Button className='btn-operation-link' onClick={()=>{history.push(`/employeeRelation/labour/view/${record.id}`)}} type='link' >查看</Button>
                    <Button className='btn-operation-link' onClick={()=>{history.push(`/employeeRelation/labour/edit/${record.id}/edit`)}} type='link' disabled={record.employeeStatus===2 || record.status}>编辑</Button>
                    <Button className='btn-operation-link' onClick={()=>{history.push(`/employeeRelation/labour/edit/${record.id}/change`)}} type='link' disabled={record.employeeStatus===2 || record.status===2 || !record.status}>变更</Button>
                    <Button className='btn-operation-link' onClick={()=>{history.push(`/employeeRelation/labour/edit/${record.id}/renewal`)}} type='link' disabled={record.employeeStatus===2 || !(record.status=== 2 && record.employeeStatus===1) ||!record.status}>续签</Button>
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
                path={`/tower-hr/labor/contract`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'contractType',
                        label: '合同类型',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={1} key="1">固定期限劳动合同</Select.Option>
                            <Select.Option value={2} key="2">无固定期限劳动合同</Select.Option>
                            <Select.Option value={3} key="3">超龄返聘合同</Select.Option>
                            <Select.Option value={4} key="4">实习合同</Select.Option>
                            <Select.Option value={5} key="5">其他合同</Select.Option>
                        </Select>
                    },
                    {
                        name: 'status',
                        label: '合同状态',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={1} key="1">有效</Select.Option>
                            <Select.Option value={2} key="2">无效</Select.Option>
                        </Select>
                    },
                    {
                        name: 'keyword',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入合同号/员工姓名/身份证号进行查询" maxLength={200} style={{width:'300px'}}/>
                    },
                ]}
            />
    )
}