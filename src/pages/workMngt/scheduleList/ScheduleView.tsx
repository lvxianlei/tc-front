import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
interface ManagementState {
    selectedKeys: React.Key[]
    selected: object[]
}
export default function Information(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
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
            title: '塔型',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '模式',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '优先级',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'bidBuyEndTime',
            title: '提料负责人',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '提料计划交付时间',
            width: 200,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '提料配段计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '放样负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '放样计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '组焊清单负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '组焊计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '放样配段计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '小样图计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '螺栓计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAddress',
            title: '备注',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 100,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/confirmList/confirmMessage/${record.id}`}>指派</Link>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false)
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        setSelectKeys({
            selectedKeys: selectedRowKeys,
            selected: selectedRows
        });
    }
    const [selectKeys, setSelectKeys] = useState<ManagementState>({
        selectedKeys: [],
        selected: []
    })
    return (
        <Page
            path="/tower-market/bidInfo"
            columns={columns}
            extraOperation={
                <Space>
                    <Button type="primary">导出</Button>
                    <Button type="primary">指派</Button>
                    <Button type="primary" onClick={() => history.goBack()}>返回上一级</Button>
                </Space>
            }
            tableProps={{
            rowSelection: {
                selectedRowKeys: selectKeys.selectedKeys,
                onChange: SelectChange
            }
            }}
            searchFormItems={[
                {
                    name: 'startBidBuyEndTime',
                    label: '最新状态变更时间',
                    children: <DatePicker />
                },
                {
                    name: 'fuzzyQuery',
                    label:'任务状态',
                    children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                },
                {
                    name: 'startReleaseDate',
                    label: '计划交付时间',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入放样任务编号/任务单编号、订单编号/内部合同编号进行查询" maxLength={200} />
                },
            ]}
        />
    )
}