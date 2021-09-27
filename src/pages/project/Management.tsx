import React from 'react'
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import ConfirmableButton from '../../components/ConfirmableButton'
import { Page } from '../common'
import { IClient } from '../IClient'
import RequestUtil from '../../utils/RequestUtil'
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

export default function Management(): React.ReactNode {
    const history = useHistory()
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
            title: '项目名称',
            dataIndex: 'projectName',
            render: (_a: any, _b: any) => <Link to={`/project/management/detail/${_b.id}`}>{_b.projectName}</Link>
        },
        {
            key: 'projectNumber',
            title: '项目编码',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '项目类型',
            dataIndex: 'projectType',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{projectType.find(item => item.value === Number(_a))?.label}</span>)
        },
        {
            key: 'bidBuyEndTime',
            title: '标书购买截至日期',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '投标截至日期',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '项目阶段',
            dataIndex: 'currentProjectStage',
            render: (_a: number) => <span>{currentProjectStage.find(item => item.value === _a)?.label}</span>
        },
        {
            key: 'projectLeader',
            title: '项目负责人',
            dataIndex: 'projectLeader'
        },
        {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            key: 'releaseDate',
            title: '发布时间',
            dataIndex: 'releaseDate'
        },
        {
            key: 'bidExplain',
            title: '说明',
            dataIndex: 'bidExplain'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/project/management/detail/${(record as IClient).id}`}>查看</Link>
                    <Link to={`/project/management/detail/edit/base/${(record as IClient).id}`}>编辑</Link>
                    <ConfirmableButton
                        confirmTitle="是否确定删除对应项目信息？"
                        type="link"
                        placement="topRight"
                        onConfirm={async () => {
                            const result = await RequestUtil.delete(`/tower-market/projectInfo?id=${(record as IClient).id}`)
                            if (result) {
                                message.success("项目成功删除...")
                                history.go(0)
                            }
                        }}>
                        删除
                    </ConfirmableButton>
                </Space>
            )
        }]

    const handleConfirmDelete = () => {
        Modal.confirm({
            title: '确认提示',
            content: '确定删除对应项目信息？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {

            },
            onCancel: () => {

            }
        })
    }

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
        return value
    }

    return <Page
        path="/tower-market/projectInfo"
        columns={columns}
        extraOperation={<>
            <Link to="/project/management/edit/new"><Button type="primary">新建项目</Button></Link>
            {/* <Button type="primary" onClick={handleConfirmDelete}>删除</Button> */}
        </>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
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
                label: '项目状态',
                children: <Select style={{ width: "100px" }}>
                    {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                </Select>
            },
        ]}
    />
}