import React, { useState } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { IClient } from '../../IClient'

export default function RawMaterialWarehousing(): React.ReactNode {

    const [refresh, setRefresh] = useState(false);
    const [filterValue, setFilterValue] = useState({});
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
            title: '所在仓库',
            dataIndex: 'projectName',
            render: (_a: any, _b: any) => <Link to={`/project/management/detail/base/${_b.id}`}>{_b.projectName}</Link>
        },
        {
            key: 'projectNumber',
            title: '收货批次',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '库位',
            dataIndex: 'projectType',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{projectType.find(item => item.value === Number(_a))?.label}</span>)
        },
        {
            key: 'bidBuyEndTime',
            title: '区位',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '物料编码',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '分类',
            dataIndex: 'currentProjectStage',
            render: (_a: number) => <span>{currentProjectStage.find(item => item.value === _a)?.label}</span>
        },
        {
            key: 'projectLeader',
            title: '标准',
            dataIndex: 'projectLeader'
        },
        {
            key: 'createTime',
            title: '品名',
            dataIndex: 'createTime'
        },
        {
            key: 'releaseDate',
            title: '材质',
            dataIndex: 'releaseDate'
        },
        {
            key: 'bidExplain',
            title: '规格',
            dataIndex: 'bidExplain'
        },
        {
            key: 'bidExplain',
            title: '长度',
            dataIndex: 'bidExplain'
        },
        {
            key: 'bidExplain',
            title: '宽度',
            dataIndex: 'bidExplain'
        },
        {
            key: 'bidExplain',
            title: '数量',
            dataIndex: 'bidExplain'
        },
        {
            key: 'bidExplain',
            title: '重量',
            dataIndex: 'bidExplain'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/project/management/detail/base/${(record as IClient).id}`}>质保单</Link>
                    <Link to={`/project/management/edit/base/${(record as IClient).id}`}>质检单</Link>
                </Space>
            )
        }]
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
            path="/tower-science/productCategory/lofting/page"
            columns={columns}
            filterValue={filterValue}
            extraOperation={<Link to="/project/management/new"><Button type="primary">导出</Button></Link>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'currentProjectStage',
                    label: '最新状态变更时间',
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