import React, { useState } from 'react'
import { Space, Input, DatePicker,  Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { CommonTable, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';

export default function SetOutTowerMngt(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
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
            key: 'projectNumber',
            title: '塔型',
            width: 100,
            dataIndex: 'projectNumber'
        },
        {
            key: 'bidBuyEndTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '问题单类型',
            width: 200,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '接收人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '创建人',
            width: 100,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/setOutTower/setOutTowerMngt/towerDetail/${record.id}`}>塔型信息</Link>
                    <Link to={`/setOutTower/setOutTowerMngt/towerMember/${record.id}`}>塔型构件</Link>
                    <Link to={`/setOutTower/setOutTowerMngt/assemblyWeld/${record.id}`}>组焊清单</Link>
                    <Link to={`/setOutTower/setOutTowerMngt/bolt/${record.id}`}>螺栓清单</Link>
                    <Button type='link' onClick={()=>{setVisible(true)}}>附件</Button>
                </Space>
            )
        }
    ]
    const handleModalCancel = () => setVisible(false)
    return <>
        <Modal title='附件'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
            <CommonTable columns={[
                { 
                    key: 'index',
                    title: '序号', 
                    dataIndex: 'index',
                    width: 50, 
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { 
                    key: 'name', 
                    title: '交付物名称', 
                    dataIndex: 'name',
                    width: 150 
                },
                { 
                    key: 'name', 
                    title: '用途', 
                    dataIndex: 'name',
                    width: 230
                },
                { 
                    key: 'operation', 
                    title: '操作', 
                    dataIndex: 'operation', 
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type="link">下载</Button>
                ) }
            ]} dataSource={[]} />
        </Modal>
        <Page
            path="/tower-market/bidInfo"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'startBidBuyEndTime',
                    label: '类型',
                    children: <DatePicker />
                },
                {
                    name: 'startReleaseDate',
                    label: '创建时间',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入塔型/塔型钢印号/任务单编号/订单编号/内部合同编号进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}