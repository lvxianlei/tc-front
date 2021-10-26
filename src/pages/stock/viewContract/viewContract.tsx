import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input } from 'antd'
import { Link, } from 'react-router-dom'
import { Page } from '../../common'
//状态
const projectType = [
    {
        value: 0,
        label: "待收票"
    },
    {
        value: 1,
        label: "已收票"
    },
    {
        value: 2,
        label: "待付款"
    },
    {
        value: 3,
        label: "已付款"
    }
]

export default function ViewContract(): React.ReactNode {
    // const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            // render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'supplier',
            title: '供应商',
            dataIndex: 'supplier',
            // render: (_a: any, _b: any) => <Link to={`/project/management/detail/base/${_b.id}`}>{_b.projectName}</Link>
        },
        {
            key: 'contractNumber',
            title: '合同编号',
            dataIndex: 'contractNumber'
        },
        {
            key: 'contractState',
            title: '合同状态',
            dataIndex: 'contractState',
            // render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{projectType.find(item => item.value === Number(_a))?.label}</span>)
        },
        {
            key: 'TimeOfLastStateChange',
            title: '最新状态变更时间',
            dataIndex: 'TimeOfLastStateChange'
        },
        {
            key: 'operator',
            title: '经办人',
            dataIndex: 'operator'
        },
        {
            key: 'finish/sum',
            title: '完成/总数',
            dataIndex: 'finish/sum'
        },
        {
            key: 'signTime',
            title: '签订时间',
            dataIndex: 'signTime',
        },
        {
            key: 'contractActualAmount',
            title: '合同实际金额',
            dataIndex: 'contractActualAmount'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation'
        },]


    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }

        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        setFilterValue(value)
        return value
    }

    return (
        <Page
            path="/tower-market/projectInfo"
            columns={columns}
            filterValue={filterValue}
            extraOperation={<Link to="/project/management/new"><Button type="primary">导出</Button></Link>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'updateTime',
                    label: '最新状态变更时间',
                    children: <RangePicker />
                },
                {
                    name: 'rawMaterialType',
                    label: '状态',
                    children: <Select style={{ width: "150px" }}>
                        {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'inquire',
                    label: '查询',
                    children: <Input style={{ width: "113px" }} placeholder="供应商/收货单编号/关联申请编号/关联票据编号" />
                },
            ]}
        />
    )
}