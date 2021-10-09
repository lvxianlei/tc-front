import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link } from 'react-router-dom'
import { CommonTable, Page } from '../../common'

export default function PickList(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskCode',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskCode'
        },
        {
            key: 'taskNumber',
            title: '任务单编号',
            width: 100,
            dataIndex: 'taskNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'productNum',
            title: '杆塔（基）',
            width: 100,
            dataIndex: 'productNum'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/pickList/pickMessage/${record.id}`}>提料信息</Link>
                    <Link to={`/workMngt/pickList/pickTowerMessage/${record.id}`}>塔型信息</Link>
                    <Link to={`/workMngt/pickList/pickTower/${record.id}`}>杆塔配段</Link>
                    <Button type='link' onClick={() => setVisible(true)}>交付物</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false);
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.plannedDeliveryTimeStart = formatDate[0]+ ' 00:00:00';
            value.plannedDeliveryTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.planTime
        }
        return value
    }
    return (
        <>
            <Modal title='交付物清单'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
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
                        key: 'function', 
                        title: '用途', 
                        dataIndex: 'function',
                        width: 230
                    },
                    { 
                        key: 'operation', 
                        title: '操作', 
                        width: 50, 
                        dataIndex: 'operation', 
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Button type="link">下载</Button>
                    ) }
                ]} dataSource={[{name:'塔型名称构件明细.excel',function:'提料塔型构件明细'},{name:'杆塔构件明细汇总表.excel',function:'提料杆塔构件明细汇总'}]} />
            </Modal>
            <Page
                path="/tower-science/materialTask"
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<Button type="primary">导出</Button>}
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'status',
                        label: '塔型状态',
                        children: <Select style={{width:'100px'}}>
                            <Select.Option value={1} key={1}>待指派</Select.Option>
                            <Select.Option value={2} key={2}>提料中</Select.Option>
                            <Select.Option value={3} key={3}>配段中</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                            <Select.Option value={5} key={5}>已提交</Select.Option>
                        </Select>
                    },
                    {
                        name: 'planTime',
                        label:'计划交付时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'pattern',
                        label: '模式',
                        children: <Select style={{width:'100px'}}>
                            <Select.Option value={1} key={1}>新放</Select.Option>
                            <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            <Select.Option value={3} key={3}>套用</Select.Option>
                        </Select>
                    },
                    {
                        name: 'biddingStatus',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}