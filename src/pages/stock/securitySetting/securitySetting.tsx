import React, { useState } from 'react'
import { Space, Button, TableColumnProps, Select, } from 'antd'
import { Link, } from 'react-router-dom'
import { Page } from '../../common'
import { IClient } from '../../IClient'
const projectType = [
    {
        value: 0,
        label: "公开招标"
    },
    {
        value: 1,
        label: "用户工程"
    }
]

const currentProjectStage = [
    {
        value: 0,
        label: "准备投标"
    },
    {
        value: 1,
        label: "投标"
    },
    {
        value: 2,
        label: "合同签订"
    },
    {
        value: 3,
        label: "合同执行"
    },
    {
        value: 4,
        label: "项目结束"
    }
]

export default function RawMaterialStock(): React.ReactNode {
    // const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'projectName',
            title: '品名',
            dataIndex: 'projectName',
            render: (_a: any, _b: any) => <Link to={`/project/management/detail/base/${_b.id}`}>{_b.projectName}</Link>
        },
        {
            key: 'projectNumber',
            title: '标准',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '规格',
            dataIndex: 'projectType',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{projectType.find(item => item.value === Number(_a))?.label}</span>)
        },
        {
            key: 'bidBuyEndTime',
            title: '材质',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '安全库存（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '告警库存（吨）',
            dataIndex: 'currentProjectStage',
            render: (_a: number) => <span>{currentProjectStage.find(item => item.value === _a)?.label}</span>
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (text, item: any, index: number): React.ReactNode => (
                <span>编辑</span>
            )
        }]


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
                    name: 'currentProjectStage',
                    label: '仓库',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'currentProjectStage',
                    label: '材质',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'currentProjectStage',
                    label: '品名',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'currentProjectStage',
                    label: '标准',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'currentProjectStage',
                    label: '分类',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'currentProjectStage',
                    label: '长度',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'currentProjectStage',
                    label: '规格',
                    children: <Select style={{ width: "100px" }}>
                        {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
            ]}
        />
    )
}