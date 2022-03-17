import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, Popconfirm, message, Modal, Row, Col } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailTitle, Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
import { materialStandardOptions, productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
// import styles from './sample.module.less';

export default function ReleaseList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [detailrefresh, setDetailRefresh] = useState<boolean>(false);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, userId?: string }>();
    const [ form ] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})
    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }
    const releaseColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'batchStatus',
            title: '下达状态',
            width: 100,
            dataIndex: 'batchStatus',
            render:(text:number)=>{
                return text===1?'待下达':text===2?'部分下达':text===3?'已下达':'-'
            }
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 100,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'trialAssemble',
            title: '试装',
            width: 100,
            dataIndex: 'trialAssemble',
            render:(text:string)=>{
                return text==='1'?'是':text==='0'?'否':'-'
            }
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 200,
            dataIndex: 'voltageGradeName'
        },
        {
            key: 'materialStandardName',
            title: '材料标准',
            width: 100,
            dataIndex: 'materialStandardName'
        },
        { 
            key: 'productType',
            title: '产品类型',
            width: 100,
            dataIndex: 'productType'
        },
        {
            key: 'num',
            title: '总基数',
            width: 200,
            dataIndex: 'num'
        },
        {
            key: 'allProductNumber',
            title: '总杆塔号',
            width: 200,
            dataIndex: 'allProductNumber'
        },
        {
            key: 'totalPieceNumber',
            title: '总件号数',
            width: 200,
            dataIndex: 'totalPieceNumber'
        },
        {
            key: 'totalNumber',
            title: '总件数',
            width: 200,
            dataIndex: 'totalNumber'
        },
        {
            key: 'totalWeight',
            title: '总重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 70,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small"  >
                    <Button type="link" onClick={()=>{history.push(`/workMngt/releaseList/release/${record.id}`)}}>生产下达</Button>
                </Space>
            )
        }
    ]
    const detailColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'issuedNumber',
            title: '下达单号',
            width: 100,
            dataIndex: 'issuedNumber'
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategory'
        },
        {
            key: 'steelProductShape',
            title: '钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'planNum',
            title: '计划号',
            width: 100,
            dataIndex: 'planNum'
        },
        {
            key: 'allSegmentName',
            title: '下达段号',
            width: 100,
            dataIndex: 'allSegmentName'
        },
        {
            key: 'loftingBatchTime',
            title: '下达时间',
            width: 100,
            dataIndex: 'loftingBatchTime'
        },
        {
            key: 'createUserName',
            title: '下达人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'trialAssemble',
            title: '试装类型',
            width: 100,
            dataIndex: 'trialAssemble',
            render:(text:string)=>{
                return text==='1'?'是':text==='0'?'否':'-'
            }
        },
        { 
            key: 'trialAssembleSegment',
            title: '试装段',
            width: 100,
            dataIndex: 'trialAssembleSegment'
        },
        {
            key: 'totalPieceNumber',
            title: '总件号数',
            width: 200,
            dataIndex: 'totalPieceNumber'
        },
        {
            key: 'totalNumber',
            title: '总件数',
            width: 200,
            dataIndex: 'totalNumber'
        },
        {
            key: 'totalWeight',
            title: '总重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'angleTotalWeight',
            title: '角钢总重量（kg）',
            width: 200,
            dataIndex: 'angleTotalWeight'
        },
        {
            key: 'machiningDemand',
            title: '加工说明',
            width: 200,
            dataIndex: 'machiningDemand'
        },
        {
            key: 'weldingDemand',
            title: '电焊说明',
            width: 200,
            dataIndex: 'weldingDemand'
        },
        {
            key: 'trialAssembleDemand',
            title: '试装说明',
            width: 200,
            dataIndex: 'trialAssembleDemand'
        },
        {
            key: 'galvanizeDemand',
            title: '镀锌要求',
            width: 200,
            dataIndex: 'galvanizeDemand'
        },
        {
            key: 'distributionStatus',
            title: '配料状态',
            width: 150,
            dataIndex: 'distributionStatus',
            render:(text:number)=>{
                return text===1?'未配料':text===2?'已配料':'-'
            }
        },
        {
            key: 'status',
            title: '分配状态',
            width: 150,
            dataIndex: 'status',
            render:(text:number)=>{
                return text===1?'未分配':text===2?'已分配':'-'
            }
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 70,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small"  >
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ async () => {
                            await RequestUtil.delete(`/tower-science/loftingBatch/${record.id}`).then(()=>{
                                message.success('删除成功！')
                            }).then(()=>{
                                setDetailRefresh(!detailrefresh)
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status===2||record.distributionStatus===2}
                    >   
                        <Button type="link" 
                            disabled={record.status===2||record.distributionStatus===2}
                        >删除</Button>
                    </Popconfirm> 
                    <Button type="link" onClick={()=>{history.push(`/workMngt/releaseList/detail/${record.id}/${record.productCategoryId}`)}}>下达明细</Button>
                    <Button type="link" onClick={()=>{history.push(`/workMngt/releaseList/assemblyWelding/${record.productCategoryId}`)}}>组焊明细</Button>

                </Space>
            )
        }
    ]

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
    return (
        <>
        <Page
            path="/tower-science/loftingList"
            columns={releaseColumns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={ {  size: 10, whether: 1  } }
            // exportPath="/tower-science/loftingList"
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'batchStatus',
                    label:'下达状态',
                    children:  
                        <Select style={{width:"100px"}} defaultValue={''}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>已下达</Select.Option>
                            <Select.Option value={2} key={2}>部分下达</Select.Option>
                            <Select.Option value={3} key={3}>未下达</Select.Option>
                        </Select>
                },
                {
                    name: 'productType',
                    label: '产品类型',
                    children:  <Select style={{width:"100px"}} defaultValue={''}>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                },
                {
                    name: 'voltageGrade',
                    label: '电压等级',
                    children:  <Select style={{width:"100px"}} defaultValue={''}>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                    {voltageGradeOptions &&voltageGradeOptions.map(({ id, name }, index) => {
                                        return (
                                            <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                },
                {
                    name: 'materialStandard',
                    label:'材料标准',
                    children:   <Select style={{width:"100px"}} defaultValue={''}>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                   { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                                        <Select.Option value={''} key ={''}>全部</Select.Option>
                                        return <Select.Option key={ index } value={ id }>
                                            { name }
                                        </Select.Option>
                                    }) }
                                </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="" maxLength={200} />
                },
            ]}
        />
        <Page
            path="/tower-science/loftingBatch/batchResult"
            columns={detailColumns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={detailrefresh}
            requestData={ {  size: 10  } }
            exportPath="/tower-science/loftingBatch/batchResult"
            sourceKey='loftingBatchResultVOS.records'
            extraOperation={(data: any) => 
                <Space>总件号数：<span style={{color:'#FF8C00'}}>{data?.totalPieceNumber}</span>总件数：<span style={{color:'#FF8C00'}}>{data?.totalNumber}</span>总重量（kg）：<span style={{color:'#FF8C00'}}>{data?.totalWeight}</span>角钢总重量（kg）：<span style={{color:'#FF8C00'}}>{data?.angleTotalWeight}</span></Space>
            }
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="" maxLength={200} />
                },
            ]}
        />
        </>
    )
}