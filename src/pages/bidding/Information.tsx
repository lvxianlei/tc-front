import React from 'react'
import { Space, Button, Input, DatePicker, Select } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../common'
import RequestUtil from '../../utils/RequestUtil'
const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'projectName',
        title: '项目名称',
        width: 100,
        dataIndex: 'projectName',
        render: (_: undefined, record: any): React.ReactNode => {
            return <Link to={`/bidding/information/detail/${record.id}`}>{record.projectName}</Link>
        }
    },
    {
        key: 'projectNumber',
        title: '项目编码',
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
        dataIndex: 'biddingAgency'
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
        key: 'explain',
        title: '说明',
        dataIndex: 'explain'
    },
    {
        key: 'biddingStatus',
        title: '是否应标',
        dataIndex: 'biddingStatus'
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
        render: (_: undefined, record: any): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <Link to={`/bidding/information/detail/${record.id}`}>查看</Link>
            </Space>
        )
    }
]
export default function Information(): React.ReactNode {

    return <Page
        path="/tower-market/tower-market/bidInfo"
        columns={columns}
        headTabs={[]}
        searchFormItems={[
            {
                name: 'name',
                children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
            },
            {
                name: 'name1',
                label: '购买截至日期',
                children: <DatePicker />
            },
            {
                name: 'name2',
                label: '发布日期',
                children: <DatePicker />
            },
            {
                name: 'name3',
                label: '是否应标',
                children: <Select style={{ width: '100px' }}>
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="0">否</Select.Option>
                </Select>
            },
            {
                name: 'name4',
                label: '来源',
                children: <Select style={{ width: '100px' }}>
                    <Select.Option value="1">aaaaaaaaaa</Select.Option>
                    <Select.Option value="0">bbbbbbbbbb</Select.Option>
                </Select>
            }
        ]}
    />
}