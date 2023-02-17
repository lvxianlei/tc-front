import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { IntgSelect, Page, SearchTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './sample.module.less';

export default function SampleDrawList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, userId?: string }>();
    const columns = [
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
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
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
            width: 70,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {/* <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDrawMessage/${record.loftingTask}`)}}>小样图信息</Button> */}
                    <Button type="link" onClick={() => { history.push(`/workMngt/sampleDrawList/sampleDraw/${record.id}/${record.smallSampleStatus}`) }}>小样图</Button>
                    {/* {
                        record?.smallSampleStatus !== 1&& <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDraw/${record.id}/${record.smallSampleStatus}`)}}>小样图</Button>
                    }
                    {
                        record?.smallSampleStatus !== 2&& <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDraw/${record.id}/${record.smallSampleStatus}`)}} disabled={AuthUtil.getUserInfo().user_id!==record.loftingLeader}>小样图</Button>
                    } */}
                    {/* <Button type="link" onClick={()=>{history.push(`/workMngt/sampleDrawList/sampleDrawCheck/${record.id}/${record.smallSampleStatus}`)}}  disabled={record.smallSampleStatus!==3||AuthUtil.getUserInfo().user_id!==record.loftingLeader}>校核</Button>
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
                        disabled={record.smallSampleStatus!==4||AuthUtil.getUserInfo().user_id!==record.loftingLeader}
                    >   
                        <Button type="link" disabled={record.smallSampleStatus!==4||AuthUtil.getUserInfo().user_id!==record.loftingLeader}>提交</Button>
                    </Popconfirm> */}
                </Space>
            )
        }
    ]

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.smallSampleDeliverTimeStart = formatDate[0] + ' 00:00:00';
            value.smallSampleDeliverTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.planTime
        }
        if (value.smallSampleLeader) {
            value.smallSampleLeader = value.smallSampleLeader?.value;
        }
        setFilterValue(value)
        return value
    }
    return (
        <SearchTable
            path="/tower-science/smallSample"
            columns={columns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={{ smallSampleStatus: location.state?.state, smallSampleLeader: location.state?.userId }}
            exportPath="/tower-science/smallSample"
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'smallSampleStatus',
                    label: '小样图状态',
                    children: <Form.Item name="smallSampleStatus" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>待完成</Select.Option>
                            {/* <Select.Option value={2} key={2}>进行中</Select.Option> */}
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'planTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'priority',
                    label: '优先级',
                    children: <Select style={{ width: "100px" }}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        <Select.Option value={0} key={0}>紧急</Select.Option>
                        <Select.Option value={1} key={1}>高</Select.Option>
                        <Select.Option value={2} key={2}>中</Select.Option>
                        <Select.Option value={3} key={3}>低</Select.Option>
                    </Select>
                },
                {
                    name: 'smallSampleLeader',
                    label: '小样图负责人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入放样任务编号/计划号/订单编号/内部合同编号/塔型/塔型钢印号进行查询" maxLength={200} />
                },
            ]}
        />
    )
}