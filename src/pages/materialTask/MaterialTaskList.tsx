/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-列表
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Modal, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './MaterialTaskList.module.less';
import { Link, useLocation } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import BatchAssigned, { EditRefProps } from './BatchAssigned';

export interface IMaterialTask {

}

export default function MaterialTaskList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number }>();
    const [ selectedKeys, setSelectedKeys ]= useState<React.Key[]>([]);
    const [selectedRows,setSelectedRows]= useState<IMaterialTask[]>([]);
    const [visible, setVisible] =useState<boolean>(false);
    const editRef = useRef<EditRefProps>();

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '提料任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'statusName',
            title: '任务状态',
            dataIndex: 'statusName',
            width: 120
        },
        {
            key: 'updateStatusTime',
            title: '塔型名称',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'productCategoryProportion',
            title: '最新状态变更时间',
            width: 150,
            dataIndex: 'productCategoryProportion'
        },
        {
            key: 'productProportion',
            title: '计划号',
            dataIndex: 'productProportion',
            width: 200
        },
        {
            key: 'weight',
            title: '订单编号',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'planNumber',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button>指派信息</Button>
                </Space>
            )
        }
    ]

    const selectChange = (selectedRowKeys: React.Key[], selectedRows: IMaterialTask[]) => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('提交成功');
            setVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    return <>
    <Modal
    title="提料指派"
    destroyOnClose
    visible={visible}
    width="60%"
    onOk={handleModalOk}
    okText="保存并提交"
    onCancel={() => {
        editRef.current?.resetFields();
        setVisible(false);
    }}
    >
        <BatchAssigned id='' type="new"/>
    </Modal>
    <Page
        path=""
        columns={columns}
        headTabs={[]}
        exportPath={``}
        refresh={refresh}
        extraOperation={<Button type='primary' onClick={() => {
            setVisible(true)
        }} ghost>批量指派</Button>}
        searchFormItems={[
            {
                name: 'updateStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '任务状态',
                children: <Form.Item name="status" initialValue={location.state?.state}>
                    <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value={""} key="4">全部</Select.Option>
                        <Select.Option value={0} key="0">待指派</Select.Option>
                        <Select.Option value={1} key="1">待完成</Select.Option>
                        <Select.Option value={2} key="2">已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: '400px' }} placeholder="提料任务编号/放样任务编号/计划号/订单编号/内部合同号" />
            }
        ]}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: selectChange
                }
            }}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    /></>
}