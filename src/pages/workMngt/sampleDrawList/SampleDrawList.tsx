import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, message } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import { Popconfirm } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';

export default function SampleDrawList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state: {} }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/sinzetech-user/user?size=1000`);
        resole(data?.records);
    }), {})
    const user:any = data||[];
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'priorityName',
            title: '优先级',
            width: 100,
            dataIndex: 'priorityName'
        },
        // {
        //     key: 'priority',
        //     title: '优先级',
        //     width: 100,
        //     dataIndex: 'priority',
        //     render: (value: number, record: object): React.ReactNode => {
        //         const renderEnum: any = [
        //             {
        //                 value: 0,
        //                 label: "紧急"
        //             },
        //             {
        //                 value: 1,
        //                 label: "高"
        //             },
        //             {
        //                 value: 2,
        //                 label: "中"
        //             },
        //             {
        //                 value: 3,
        //                 label: "低"
        //             },
        //         ]
        //         return <>{value&&renderEnum.find((item: any) => item.value === value).label}</>
        //     }
        // },
        {
            key: 'externalTaskNum',
            title: '任务单编号',
            width: 100,
            dataIndex: 'externalTaskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'smallSampleDeliverTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'smallSampleDeliverTime'
        },
        {
            key: 'smallSampleLeaderName',
            title: '样图负责人',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        { 
            key: 'smallSampleStatusName',
            title: '小样图状态',
            width: 100,
            dataIndex: 'smallSampleStatusName'
        },
        // {
        //     key: 'smallSampleStatus',
        //     title: '小样图状态',
        //     width: 100,
        //     dataIndex: 'smallSampleStatus',
        //     render: (value: number, record: object): React.ReactNode => {
        //         const renderEnum: any = [
        //             {
        //                 value: -1,
        //                 label: ""
        //             },
        //             {
        //                 value: 1,
        //                 label: "待开始"
        //             },
        //             {
        //                 value: 2,
        //                 label: "进行中"
        //             },
        //             {
        //                 value: 3,
        //                 label: "已完成"
        //             },
        //         ]
        //         return <>{value && renderEnum.find((item: any) => item.value === value).label}</>
        //     }
        // },
        {
            key: 'smallSampleUpdateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'smallSampleUpdateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 230,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {/* <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDrawMessage/${record.loftingTask}`)}}>小样图信息</Button> */}
                    <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDraw/${record.id}/${record.smallSampleStatus}`)}} disabled={AuthUtil.getUserId()!==record.smallSampleLeader}>小样图</Button>
                    {/* <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDrawCheck/${record.id}/${record.smallSampleStatus}`)}}  disabled={record.smallSampleStatus!==3||AuthUtil.getUserId()!==record.loftingLeader}>校核</Button>
                    <Popconfirm
                        title="确认提交?"
                        onConfirm={ async () => {
                            await RequestUtil.put(`/tower-science/smallSample/submit?productCategoryId=${record.id}`).then(()=>{
                                message.success('提交成功！')
                            }).then(()=>{
                                setRefresh(!refresh)
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                        disabled={record.smallSampleStatus!==4||AuthUtil.getUserId()!==record.loftingLeader}
                    >   
                        <Button type="link" disabled={record.smallSampleStatus!==4||AuthUtil.getUserId()!==record.loftingLeader}>提交</Button>
                    </Popconfirm> */}
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
            // value.plannedDeliveryTimeStart = formatDate[0]+ ' 00:00:00';
            // value.plannedDeliveryTimeEnd = formatDate[1]+ ' 23:59:59';
            value.smallSampleDeliverTimeStart = formatDate[0]+ ' 00:00:00';
            value.smallSampleDeliverTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.planTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path="/tower-science/smallSample"
            columns={columns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={ { smallSampleStatus: location.state } }
            exportPath="/tower-science/smallSample"
            // extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'smallSampleStatus',
                    label:'小样图状态',
                    children:  <Form.Item name="smallSampleStatus" initialValue={ location.state }>
                        <Select style={{width:"100px"}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>待开始</Select.Option>
                            <Select.Option value={2} key={2}>进行中</Select.Option>
                            <Select.Option value={3} key={3}>已完成</Select.Option>
                            {/* <Select.Option value={0} key={0}>已拒绝</Select.Option> */}
                        </Select>
                    </Form.Item> 
                },
                {
                    name: 'planTime',
                    label: '计划交付时间',
                    children:  <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'priority',
                    label:'优先级',
                    children:   <Select style={{width:"100px"}}>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                    <Select.Option value={0} key={0}>紧急</Select.Option>
                                    <Select.Option value={1} key={1}>高</Select.Option>
                                    <Select.Option value={2} key={2}>中</Select.Option>
                                    <Select.Option value={3} key={3}>低</Select.Option>
                                </Select>
                },
                {
                    name: 'smallSampleLeader',
                    label:'小样图负责人',
                    children:   <Form.Item name="materialLeader" initialValue={ '' }>
                                <Select style={{width:'100px'}}>
                                    <Select.Option key={''} value={''}>全部</Select.Option>
                                    {user && user.map((item: any) => {
                                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    })}
                                </Select>
                                </Form.Item>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号进行查询" maxLength={200} />
                },
            ]}
        />
    )
}