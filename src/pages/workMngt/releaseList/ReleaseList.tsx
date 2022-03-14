import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, Popconfirm, message, Modal, Row, Col } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailTitle, Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
// import styles from './sample.module.less';

export default function ReleaseList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [detailrefresh, setDetailRefresh] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
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
            key: 'taskNum',
            title: '塔型',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'priorityName',
            title: '钢印号',
            width: 100,
            dataIndex: 'priorityName'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '下达状态',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '最新状态变更时间',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'productCategoryName',
            title: '试装',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'smallSampleDeliverTime',
            title: '电压等级',
            width: 200,
            dataIndex: 'smallSampleDeliverTime'
        },
        {
            key: 'smallSampleLeaderName',
            title: '材料标准',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        { 
            key: 'smallSampleStatusName',
            title: '产品类型',
            width: 100,
            dataIndex: 'smallSampleStatusName'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总基数',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总杆塔号',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总件数',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总重量（kg）',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
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
            key: 'taskNum',
            title: '下达单号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'priorityName',
            title: '塔型',
            width: 100,
            dataIndex: 'priorityName'
        },
        {
            key: 'planNumber',
            title: '钢印号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '下达段号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'productCategoryName',
            title: '下达时间',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'smallSampleDeliverTime',
            title: '下达人',
            width: 200,
            dataIndex: 'smallSampleDeliverTime'
        },
        {
            key: 'smallSampleLeaderName',
            title: '试装类型',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        { 
            key: 'smallSampleStatusName',
            title: '试装段',
            width: 100,
            dataIndex: 'smallSampleStatusName'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总件号数',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总件数',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '总重量（kg）',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '角钢总重量（kg）',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '加工说明',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '电焊说明',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '试装说明',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '镀锌要求',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '配料状态',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
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
                            await RequestUtil.put(`/tower-science/smallSample/submit?productCategoryId=${record.id}`).then(()=>{
                                message.success('删除成功！')
                            }).then(()=>{
                                setRefresh(!refresh)
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                        disabled={record.smallSampleStatus!==4}
                    >   
                        <Button type="link" disabled={record.smallSampleStatus!==4}>删除</Button>
                    </Popconfirm> 
                    <Button type="link" onClick={()=>{history.push(`/workMngt/releaseList/detail/${record.id}/${record.smallSampleStatus}`)}}>下达明细</Button>
                    <Button type="link" onClick={()=>{history.push(`/workMngt/releaseList/assemblyWelding/${record.id}/${record.smallSampleStatus}`)}}>组焊明细</Button>

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
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.smallSampleDeliverTimeStart = formatDate[0]+ ' 00:00:00';
            value.smallSampleDeliverTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.planTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <>
        <Page
            path="/tower-science/materialTask"
            columns={releaseColumns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={ {  size: 10  } }
            exportPath="/tower-science/smallSample"
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'smallSampleStatus',
                    label:'下达状态',
                    children:  <Form.Item name="smallSampleStatus" initialValue={ location.state?.state }>
                        <Select style={{width:"100px"}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>已下达</Select.Option>
                            <Select.Option value={2} key={2}>部分下达</Select.Option>
                            <Select.Option value={3} key={3}>未下达</Select.Option>
                        </Select>
                    </Form.Item> 
                },
                {
                    name: 'planTime',
                    label: '产品类型',
                    children:  <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'planTime',
                    label: '电压等级',
                    children:  <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'priority',
                    label:'材料标准',
                    children:   <Select style={{width:"100px"}}>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                    <Select.Option value={0} key={0}>紧急</Select.Option>
                                    <Select.Option value={1} key={1}>高</Select.Option>
                                    <Select.Option value={2} key={2}>中</Select.Option>
                                    <Select.Option value={3} key={3}>低</Select.Option>
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
            path="/tower-science/smallSample"
            columns={detailColumns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={detailrefresh}
            requestData={ {  size: 10  } }
            exportPath="/tower-science/smallSample"
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