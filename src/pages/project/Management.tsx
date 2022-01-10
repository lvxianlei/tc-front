import React, { useState } from 'react'
import { Space, Button, Input, DatePicker, Select, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import ConfirmableButton from '../../components/ConfirmableButton'
import { Page } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import { baseList } from "./managementDetailData.json"
export default function Management(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
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

    return <Page
        path="/tower-market/projectInfo"
        columns={[
            {
                title: '序号',
                dataIndex: 'index',
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...baseList.map((item: any) => {
                if (item.dataIndex === "projectName") {
                    return ({
                        ...item,
                        render: (_a: any, _b: any) => <Link to={`/project/management/detail/base/${_b.id}`}>{_b.projectName}</Link>
                    })
                }
                return item
            }),
            {
                title: '操作',
                fixed: "right",
                dataIndex: 'operation',
                render: (_: undefined, record: any): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        <Link to={`/project/management/detail/base/${record?.id}`}>查看</Link>
                        <Link to={`/project/management/edit/base/${record?.id}`}>编辑</Link>
                        <ConfirmableButton
                            confirmTitle="是否确定删除对应项目信息？"
                            type="link"
                            placement="topRight"
                            onConfirm={async () => {
                                const result = await RequestUtil.delete(`/tower-market/projectInfo?id=${record?.id}`)
                                if (result) {
                                    message.success("项目成功删除...")
                                    history.go(0)
                                }
                            }}>
                            删除
                        </ConfirmableButton>
                    </Space>
                )
            }]}
        filterValue={filterValue}
        extraOperation={<Button type="primary"><Link to="/project/management/edit/base/new">新建项目</Link></Button>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'contractNumber',
                label: '内部合同编号',
                children: <Input placeholder="内部合同编号" style={{ width: 210 }} />
            },
            {
                name: 'saleOrderNumber',
                label: '订单编号',
                children: <Input placeholder="订单编号" style={{ width: 210 }} />
            },
            {
                name: 'taskNumber',
                label: '计划号',
                children: <Input placeholder="计划号" style={{ width: 210 }} />
            },
            {
                name: 'startBidBuyEndTime',
                label: '购买截至日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'startBiddingEndTime',
                label: '投标截至日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'currentProjectStage',
                label: '项目阶段',
                children: <Select style={{ width: "100px" }}>
                    <Select.Option value={0}>准备投标</Select.Option>
                    <Select.Option value={1}>投标</Select.Option>
                    <Select.Option value={2}>合同签订</Select.Option>
                    <Select.Option value={3}>合同执行</Select.Option>
                    <Select.Option value={4}>项目结束</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="项目名称/项目编码/项目负责人/批次号" style={{ width: 260 }} />
            },
        ]}
    />
}