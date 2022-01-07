import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, DatePicker, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

export default function QuitProceduresList(): React.ReactNode {
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
            title: '员工姓名',
            width: 100,
            dataIndex: 'employeeName'
        },
        {
            key: 'isTransactProcedure',
            title: '是否办理离职手续',
            width: 100,
            dataIndex: 'isTransactProcedure',
            render:(isTransactProcedure:boolean)=>{
                return isTransactProcedure?'是':'否'
            }
        },
        {
            key: 'isRemoveContract',
            title: '是否领取解除劳动合同书',
            width: 100,
            dataIndex: 'isRemoveContract',
            render:(isRemoveContract:boolean)=>{
                return isRemoveContract?'是':'否'
            }
        },
        {
            key: 'transactDate',
            title: '办理日期',
            width: 100,
            dataIndex: 'transactDate',
            render:(transactDate: string)=>{
                return transactDate?moment(transactDate).format('YYYY-MM-DD'):'-'
            }
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
                return <span>{ record.departmentId!=='0'?record.departmentName + '/' + record.teamName: record.teamName }</span>
            }
        },
        {
            key: 'postName',
            title: '岗位',
            width: 100,
            dataIndex: 'postName'
        },
        {
            key: 'employeeNature',
            title: '员工类型',
            width: 100,
            dataIndex: 'employeeNature',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '正式员工';
                    case 2:
                        return '超龄员工';
                    case 3:
                        return '实习员工';
                }
            } 
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
            key: 'departureDate',
            title: '离职时间',
            width: 100,
            dataIndex: 'departureDate',
            render:(departureDate: string)=>{
                return departureDate?moment(departureDate).format('YYYY-MM-DD'):'-'
            }
        },
        {
            key: 'departureReason',
            title: '离职原因',
            width: 100,
            dataIndex: 'departureReason'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    <Button onClick={()=>{history.push(`/employeeRelation/quitProcedures/view/${record.id}`)}} type='link' className='btn-operation-link'>查看</Button>
                    <Button onClick={()=>{history.push(`/employeeRelation/quitProcedures/operation/${record.id}`)}} type='link' className='btn-operation-link' disabled={record.isProcessingCompleted}>办理离职</Button>
                </>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.departureDateStart = formatDate[0]+ ' 00:00:00';
            value.departureDateEnd = formatDate[1]+ ' 23:59:59';
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
                path={`/tower-hr/employeeDeparture/handlePage`}
                columns={columns}
                refresh={refresh}
                requestData={{ isTransactProcedure: 'false' }}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'isTransactProcedure',
                        label: '是否办理离职手续',
                        children: <Select placeholder="请选择" style={{ width: "150px" }} defaultValue={'false'}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={'true'} key="0">是</Select.Option>
                            <Select.Option value={'false'} key="1">否</Select.Option>
                        </Select>
                    },
                    {
                        name: 'statusUpdateTime',
                        label: '离职日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'employeeName',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工姓名进行查询" maxLength={200} style={{width:'200px'}}/>
                    },
                ]}
            />
    )
}