import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, Form } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { IntgSelect, Page } from '../common'
import styles from './question.module.less';

export default function QuestionMngt(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, type?: string, userId?: string, createUserId?: string }>();
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'issueNumber',
            title: '问题单编号',
            width: 100,
            dataIndex: 'issueNumber'
        },
        {
            key: 'statusName',
            title: '问题单状态',
            width: 100,
            dataIndex: 'statusName'
        },
        // {
        //     key: 'status',
        //     title: '问题单状态',
        //     width: 100,
        //     dataIndex: 'status',
        //     render: (value: number, record: object): React.ReactNode => {
        //         const renderEnum: any = [
        //             {
        //                 value: 0,
        //                 label: "已拒绝"
        //             },
        //             {
        //                 value: 1,
        //                 label: "待修改"
        //             },
        //             {
        //                 value: 2,
        //                 label: "已修改"
        //             },
        //             {
        //                 value: 3,
        //                 label: "已删除"
        //             },
        //         ]
        //         return <>{renderEnum.find((item: any) => item.value === value).label}</>
        //     }
        // },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'updateTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'typeName',
            title: '问题单类型',
            width: 200,
            dataIndex: 'typeName'
        },
        // {
        //     key: 'type',
        //     title: '问题单类型',
        //     width: 200,
        //     dataIndex: 'type',
        //     render: (value: string, record: object): React.ReactNode => {
        //         const renderEnum: any = [
        //             {
        //                 value: 'WTD-TL',
        //                 label: "提料"
        //             },
        //             {
        //                 value: 'WTD-FY',
        //                 label: "放样"
        //             },
        //             {
        //                 value: 'WTD-LS',
        //                 label: "螺栓"
        //             },
        //             {
        //                 value: 'WTD-ZH',
        //                 label: "组焊"
        //             },
        //             {
        //                 value: 'WTD-YT',
        //                 label: "小样图"
        //             },
        //           ]
        //         return <>{value&&(renderEnum.find((item: any) => item.value === value).label)}</>
        //     }
        // },
        {
            key: 'recipientName',
            title: '接收人',
            width: 100,
            dataIndex: 'recipientName'
        },
        {
            key: 'createUserName',
            title: '创建人',
            width: 100,
            dataIndex: 'createUserName'
        },
        {
            key: 'operation',
            title: '操作',
            // fixed: 'right' as FixedType,
            width: 80,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type='link' onClick={() => history.push({ pathname: `/question/questionMngt/otherDetail/${record.id}/${record.type}/${record.status}`, state: { recipient: record.recipient, createUser: record.createUser } })}>查看详情</Button>
                    {/* {
                        record.type==='WTD-TL'||record.type==='WTD-FY'||record.type==='WTD-LS'? <Button type='link' onClick={()=>history.push({pathname:`/question/questionMngt/otherDetail/${record.id}/${record.type}/${record.status}`,state: record.recipient})}>查看详情</Button>:
                        record.type==='WTD-ZH'? <Button  type='link' onClick={()=>history.push({pathname:`/question/questionMngt/assemblyWeldDetail/${record.id}/${record.status}`,state: record.recipient})}>查看详情</Button>:
                        <Button type='link' onClick={()=>history.push({pathname:`/question/questionMngt/sampleDrawDetail/${record.id}/${record.status}`,state: record.recipient})}>查看详情</Button>
                    } */}
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        if (value.updateTime) {
            const formatDate = value.updateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateTimeStart = formatDate[0] + ' 00:00:00';
            value.updateTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.updateTime
        }
        setFilterValue(value)
        return value
    }
    return <>
        <Page
            path="/tower-science/issue"
            columns={columns}
            exportPath="/tower-science/issue"
            // extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            requestData={{ status: location.state?.state, type: location.state?.type, recipient: location.state?.userId, createUser: location.state?.createUserId }}
            searchFormItems={[
                {
                    name: 'updateTime',
                    label: '状态时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '问题单状态',
                    children: <Form.Item name="status" initialValue={location.state?.state || ''}>
                        <Select style={{ width: '100px' }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>待修改</Select.Option>
                            <Select.Option value={2} key={2}>已修改</Select.Option>
                            <Select.Option value={0} key={0}>已拒绝</Select.Option>
                            <Select.Option value={3} key={3}>已删除</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'type',
                    label: '问题单类型',
                    children: <Form.Item name="type" initialValue={location.state?.type || ''}>
                        <Select style={{ width: '100px' }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={'WTD-TL'} key={'WTD-TL'}>提料</Select.Option>
                            <Select.Option value={'WTD-FY'} key={'WTD-FY'}>放样</Select.Option>
                            <Select.Option value={'WTD-LS'} key={'WTD-LS'}>螺栓</Select.Option>
                            {/* <Select.Option value={'WTD-ZH'} key={'WTD-ZH'}>组焊</Select.Option>
                            <Select.Option value={'WTD-YT'} key={'WTD-YT'}>小样图</Select.Option> */}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'recipient',
                    label: '接收人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'createUser',
                    label: '创建人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入问题单编号/塔型进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}