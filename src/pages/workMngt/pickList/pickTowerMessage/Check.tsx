import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link } from 'react-router-dom'
import { CommonTable, Page } from '../../../common'

export default function PickCheckList(): React.ReactNode {
    const [form] = Form.useForm();
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段名', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '构件编号', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '材质', dataIndex: 'amount', key: 'amount' },
        { title: '规格', dataIndex: 'unit', key: 'unit' },
        { title: '宽度（mm）', dataIndex: 'amount', key: 'amount' },
        { title: '厚度（mm）', dataIndex: 'amount', key: 'amount' },
        { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '单基件数', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
        { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
        { title: '备注', dataIndex: 'unit', key: 'unit' }
    ];
    return (
        <Page
            path="/tower-market/bidInfo"
            columns={columns}
            extraOperation={
                <Space>
                    <Button>导出</Button>
                    <Button>完成校核</Button>
                    <Button>返回上一级</Button>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'startBidBuyEndTime',
                    label: '材料名称',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '材质',
                    children: <Input placeholder="请输入段号/构件编号进行查询" maxLength={200} />
                },
            ]}
        />
    )
}