
/**
 * @author zyc
 * @copyright © 2022 
 * @description 计划排产
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Button, Modal, Popconfirm, message, Select, DatePicker } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import TechnicalIssue from './TechnicalIssue';

export interface TechnicalIssuePropsRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function PlanScheduleMngt(): React.ReactNode {
    const columns = [
        {
            key: 'code',
            title: '计划号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'workCenterName',
            title: '塔型',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '产品类型',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '客户',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '线路名称',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '基数',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '业务经理',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '客户交货日期',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '合同重量（t）',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '计划交货日期',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '电压等级（kv）',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '审批日期',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '状态',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '备注',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '放样下发时间',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '放样下发人',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '放样计划完成时间',
            dataIndex: 'workCenterName',
            width: 120
        },
        {
            key: 'workCenterName',
            title: '放样实际完成时间',
            dataIndex: 'workCenterName',
            width: 120
        }
    ]

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success(`下达成功`)
            setVisible(false);
            resove(true);
            setRefresh(!refresh);
        } catch (error) {
            reject(false)
        }
    })

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [filterValue, setFilterValue] = useState({});
    const editRef = useRef<TechnicalIssuePropsRefProps>();
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<[]>([]);
    return (
        <>
            <Modal
                destroyOnClose
                visible={visible}
                width="40%"
                title="技术下达"
                onOk={handleModalOk}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setVisible(false);
                }}>
                <TechnicalIssue record={{}} ref={editRef} />
            </Modal>
            <Page
                path=""
                columns={columns}
                headTabs={[]}
                extraOperation={<Button type="primary" onClick={() => { setVisible(true);  }}>技术下达</Button>}
                refresh={refresh}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                searchFormItems={[
                    {
                        name: 'workCenterName',
                        label: '模糊查询项',
                        children: <Input placeholder="计划号/塔型/业务经理/客户" />
                    },
                    {
                        name: 'workCenterName',
                        label: '产品类型',
                        children: <Input placeholder="计划号/塔型/业务经理/客户" />
                    },
                    {
                        name: 'workCenterName',
                        label: '状态',
                        children: <Select placeholder="请选择" defaultValue={ 1 } style={{ width: "150px" }}>
                            <Select.Option value={ 1 } key="1">未下发</Select.Option>
                            <Select.Option value={ 2 } key="2">放样已下发</Select.Option>
                            <Select.Option value={ 3 } key="3">放样已确认</Select.Option>
                            <Select.Option value={ 4 } key="4">放样已完成</Select.Option>
                        </Select>
                    },
                    {
                        name: 'time',
                        label: '客户交货日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startTime = formatDate[0]+ ' 00:00:00';
                    values.endTime = formatDate[1]+ ' 23:59:59';
                    setFilterValue(values);
                    return values;
                }}
            />
        </>
    )
}