import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

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
            title: '部门',
            width: 100,
            dataIndex: 'departmentName'
        },
        {
            key: 'postName',
            title: '岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'signedCompany',
            title: '合同签署公司',
            width: 100,
            dataIndex: 'signedCompany'
        },
        {
            key: 'contractType',
            title: '合同类型',
            width: 100,
            dataIndex: 'contractType'
        },
        {
            key: 'contractStartDate',
            title: '合同开始日期',
            width: 100,
            dataIndex: 'contractStartDate'
        },
        {
            key: 'contractEndDate',
            title: '合同截止日期',
            width: 100,
            dataIndex: 'contractEndDate'
        },
        {
            key: 'contractStatus',
            title: '合同状态',
            width: 100,
            dataIndex: 'contractStatus',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '有效';
                    case 1:
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
                <Space direction="horizontal" size="small">
                    <Button onClick={()=>{history.push(`/employeeRelation/labour/view/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/labour/edit/${record.id}/edit`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>编辑</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/labour/edit/${record.id}/change`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>变更</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/labour/edit/${record.id}/renewal`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>续签</Button>
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
                path={`/tower-hr/labor/contract`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'keyword',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入合同号/员工姓名/身份证号进行查询" maxLength={200} />
                    },
                    {
                        name: 'contractType',
                        label: '合同类型',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={0} key="0">固定期限劳动合同</Select.Option>
                            <Select.Option value={1} key="1">无固定期限劳动合同</Select.Option>
                            <Select.Option value={2} key="2">超龄返聘合同</Select.Option>
                            <Select.Option value={3} key="3">实习合同</Select.Option>
                            <Select.Option value={4} key="4">其他合同</Select.Option>
                        </Select>
                    },
                    {
                        name: 'status',
                        label: '合同状态',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={0} key="0">有效</Select.Option>
                            <Select.Option value={1} key="1">无效</Select.Option>
                        </Select>
                    },
                ]}
            />
    )
}