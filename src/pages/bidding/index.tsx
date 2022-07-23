import React from 'react'
import { Space, Input, DatePicker, Select, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { SearchTable as Page } from '../common'
import { base } from "./bidding.json"
import { sourceOptions } from '../../configuration/DictionaryOptions'
const { Paragraph } = Typography
export default function Information(): React.ReactNode {
    const dictionaryOptions: any = sourceOptions
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

    const handleAddress = (record: any) => {
        if (record.sourceWebsite) {
            window.open(record.sourceWebsite);
        }
    }

    return <Page
        path="/tower-market/bidInfo"
        columns={[
            {
                title: '序号',
                dataIndex: 'index',
                fixed: "left",
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...base.map((item: any) => {
                switch (item.dataIndex) {
                    case "projectName":
                        return ({
                            ...item,
                            render: (_: undefined, record: any): React.ReactNode => {
                                return <Link to={`/bidding/information/detail/${record.id}`}>
                                    <Paragraph style={
                                        {
                                            color: "#FF8C00",
                                            cursor: "pointer"
                                        }
                                    } ellipsis={{ rows: 1 }}>{record.projectName}</Paragraph>
                                </Link>
                            }
                        })
                    case "sourceWebsite":
                        return ({
                            ...item,
                            render: (_: any, record: any) => {
                                return <span onClick={() => handleAddress(record)
                                }> <Paragraph style={
                                    {
                                        color: "#FF8C00",
                                        cursor: "pointer"
                                    }
                                } ellipsis={{ rows: 1 }}>{record.sourceWebsite || ""}</Paragraph></span>
                            }
                        })
                    default:
                        return item
                }
            }),
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 40,
                render: (_: undefined, record: any): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        <Link to={`/bidding/information/detail/${record.id}`}>查看</Link>
                    </Space>
                )
            }
        ]}
        headTabs={[]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'startBidBuyEndTime',
                label: '购买截至日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 150 }} />
            },
            {
                name: 'startReleaseDate',
                label: '发布日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 150 }} />
            },
            {
                name: 'startBiddingEndTime',
                label: '投标截至日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 150 }} />
            },
            {
                name: 'biddingStatus',
                label: '是否应标',
                children: <Select style={{ width: 100 }}>
                    <Select.Option value="0">未决定</Select.Option>
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="2">否</Select.Option>
                </Select>
            },
            {
                name: 'source',
                label: '来源',
                children: <Select mode="multiple" style={{ minWidth: 100 }}>
                    {dictionaryOptions?.map((item: any, index: number) => <Select.Option key={index} value={item.name}>{item.name}</Select.Option>)}
                </Select>
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input placeholder="项目名称/项目编码/审批编号/关联合同/制单人" style={{ width: 280 }} />
            }
        ]}
    />
}