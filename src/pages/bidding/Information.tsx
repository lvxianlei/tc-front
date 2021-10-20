import React from 'react'
import { Space, Input, DatePicker, Select } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../common'
import ApplicationContext from "../../configuration/ApplicationContext"
const biddingStatusEnum = [
    {
        value: 0,
        label: "未决定"
    },
    {
        value: 1,
        label: "是"
    },
    {
        value: 2,
        label: "否"
    }
]
const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'projectName',
        title: '项目名称',
        width: 120,
        dataIndex: 'projectName',
        render: (_: undefined, record: any): React.ReactNode => {
            return <Link to={`/bidding/information/detail/${record.id}`}>{record.projectName}</Link>
        }
    },
    {
        key: 'projectNumber',
        title: '项目编码',
        width: 120,
        dataIndex: 'projectNumber'
    },
    {
        key: 'bidBuyEndTime',
        title: '标书购买截至日期',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '投标截至日期',
        width: 200,
        dataIndex: 'biddingEndTime'
    },
    {
        key: 'biddingPerson',
        title: '招标人',
        dataIndex: 'biddingPerson'
    },
    {
        key: 'biddingAgency',
        title: '招标代理机构',
        dataIndex: 'biddingAgency',
        width: 120
    },
    {
        key: 'biddingAddress',
        title: '招标地点',
        dataIndex: 'biddingAddress'
    },
    {
        key: 'releaseDate',
        title: '发布日期',
        dataIndex: 'releaseDate'
    },
    {
        key: 'source',
        title: '来源',
        dataIndex: 'source'
    },
    {
        key: 'sourceWebsite',
        title: '原始地址',
        dataIndex: 'sourceWebsite'
    },
    {
        key: 'bidExplain',
        title: '说明',
        dataIndex: 'bidExplain'
    },
    {
        title: '是否应标',
        dataIndex: 'biddingStatus',
        render: (_: any, record: any) => <>{biddingStatusEnum.find(item => item.value === record.biddingStatus)?.label}</>
    },
    {
        key: 'reason',
        title: '不应标原因',
        dataIndex: 'reason'
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
        render: (_: undefined, record: any): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <Link to={`/bidding/information/detail/${record.id}`}>查看</Link>
            </Space>
        )
    }
]
export default function Information(): React.ReactNode {
    const dictionaryOptions: any = (ApplicationContext.get().dictionaryOption as any)["125"]
    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }
        if (value.startReleaseDate) {
            const formatDate = value.startReleaseDate.map((item: any) => item.format("YYYY-MM-DD"))
            value.startReleaseDate = formatDate[0]
            value.endReleaseDate = formatDate[1]
        }
        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        if (value.source) {
            value.source = value.source.join(",")
        }
        return value
    }

    return <Page
        path="/tower-market/bidInfo"
        columns={columns as any}
        headTabs={[]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="项目名称/项目编码/审批编号/关联合同/制单人" style={{ width: 280 }} />
            },
            {
                name: 'startBidBuyEndTime',
                label: '购买截至日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'startReleaseDate',
                label: '发布日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'startBiddingEndTime',
                label: '投标截至日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'biddingStatus',
                label: '是否应标',
                children: <Select style={{ width: 150 }}>
                    <Select.Option value="0">未决定</Select.Option>
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="2">否</Select.Option>
                </Select>
            },
            {
                name: 'source',
                label: '来源',
                children: <Select mode="multiple" style={{ minWidth: 150 }}>
                    {dictionaryOptions.map((item: any, index: number) => <Select.Option key={index} value={item.name}>{item.name}</Select.Option>)}
                </Select>
            }
        ]}
    />
}