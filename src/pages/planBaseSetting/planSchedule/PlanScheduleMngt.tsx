/**
 * @author zyc
 * @copyright © 2022 
 * @description 计划排产
 */

import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Select, DatePicker, Tooltip, Space } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { IPlanSchedule } from './IPlanSchedule';
import { gantt } from 'dhtmlx-gantt';
import { Link } from 'react-router-dom';


export interface TechnicalIssuePropsRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function PlanScheduleMngt(): React.ReactNode {
    const columns = [
        {
            key: 'productionBatchNo',
            title: '批次号',
            width: 150,
            dataIndex: 'productionBatchNo',
            fixed: 'left' as FixedType
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber',
            fixed: 'left' as FixedType
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 120,
            fixed: 'left' as FixedType
        },
        {
            key: 'loftingStatus',
            title: '状态',
            dataIndex: 'loftingStatus',
            width: 120,
            type: 'select',
            enum: [
                {
                    "value": 0,
                    "label": "未下发"
                },
                {
                    "value": 1,
                    "label": "放样已下发"
                },
                {
                    "value": 2,
                    "label": "放样已确认"
                },
                {
                    "value": 3,
                    "label": "放样已完成"
                }
            ]
        },
        {
            key: 'productTypeName',
            title: '产品类型',
            dataIndex: 'productTypeName',
            width: 120
        },
        {
            key: 'customerCompany',
            title: '客户',
            dataIndex: 'customerCompany',
            width: 120
        },
        {
            key: 'lineName',
            title: '线路名称',
            dataIndex: 'lineName',
            width: 120
        },
        {
            key: 'productNum',
            title: '基数',
            dataIndex: 'productNum',
            width: 50
        },
        {
            key: 'businessManagerName',
            title: '业务经理',
            dataIndex: 'businessManagerName',
            width: 120
        },
        {
            key: 'deliveryTime',
            title: '客户交货日期',
            dataIndex: 'deliveryTime',
            width: 120
        },
        {
            key: 'weight',
            title: '合同重量（t）',
            dataIndex: 'weight',
            width: 120
        },
        {
            key: 'planDeliveryTime',
            title: '计划交货日期',
            dataIndex: 'planDeliveryTime',
            width: 120,
            format: 'YYYY-MM-DD'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级（kv）',
            dataIndex: 'voltageGradeName',
            width: 120
        },
        {
            key: 'approvalTime',
            title: '审批日期',
            dataIndex: 'approvalTime',
            width: 120
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 200,
            render: (_: any) => (
                <Tooltip placement="topLeft" title={_}>
                    {_ ? _?.length > 15 ? _?.slice(0, 15) + '...' : _ : '-'}
                </Tooltip>
            )
        },
        {
            key: 'loftingIssueTime',
            title: '放样下发时间',
            dataIndex: 'loftingIssueTime',
            width: 120
        },
        {
            key: 'loftingIssueUserName',
            title: '放样下发人',
            dataIndex: 'loftingIssueUserName',
            width: 120
        },
        {
            key: 'loftingCompleteTime',
            title: '放样计划完成时间',
            dataIndex: 'loftingCompleteTime',
            width: 120
        },
        {
            key: 'loftingCompleteRealTime',
            title: '放样实际完成时间',
            dataIndex: 'loftingCompleteRealTime',
            width: 120
        }
    ]

    useEffect(() => {
        gantt.clearAll();
    })

    // const handleModalOk = () => new Promise(async (resove, reject) => {
    //     try {
    //         await editRef.current?.onSubmit();
    //         message.success(`下达成功`);
    //         setSelectedKeys([]);
    //         setSelectedRows([]);
    //         setVisible(false);
    //         resove(true);
    //         setRefresh(!refresh);
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    // const issued = () => {
    //     if (selectedKeys && selectedKeys.length > 0) {
    //         setVisible(true);
    //     } else {
    //         message.warning('请选择要下达的塔型');
    //     }
    // }

    const [refresh, setRefresh] = useState(false);
    const [filterValue, setFilterValue] = useState({});
    const editRef = useRef<TechnicalIssuePropsRefProps>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    return (
        <>
            {/* <Modal
                destroyOnClose
                visible={visible}
                width="40%"
                title="技术下达"
                onOk={handleModalOk}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setVisible(false);
                    setSelectedKeys([]);
                    setSelectedRows([]);
                    setRefresh(!refresh);
                }}>
                <TechnicalIssue record={selectedRows} ref={editRef} />
            </Modal> */}
            <Page
                path="/tower-aps/productionPlan"
                columns={columns}
                headTabs={[]}
                extraOperation={<Space>
                    <Link to={`/planSchedule/planScheduleMngt/planDeliveryTime`}><Button type="primary" disabled={selectedKeys.length <= 0}>计划交货期</Button></Link>
                    <Link to={`/planSchedule/planScheduleMngt/SplitBatch/${selectedKeys[0]}`}><Button type="primary" disabled={selectedKeys.length!==1}>拆分批次</Button></Link>
                    <Link to={`/planSchedule/planScheduleMngt/distributedTech`}><Button type="primary" disabled={selectedKeys.length <= 0}>下发技术</Button></Link>
                </Space>}
                refresh={refresh}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                        getCheckboxProps: (record: Record<string, any>) => ({
                            disabled: record.loftingStatus !== 0
                        })
                    }
                }}
                searchFormItems={[
                    {
                        name: 'productType',
                        label: '产品类型',
                        children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'status',
                        label: '状态',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={0} key="0">未下发</Select.Option>
                            <Select.Option value={1} key="1">放样已下发</Select.Option>
                            <Select.Option value={2} key="2">放样已确认</Select.Option>
                            <Select.Option value={3} key="3">放样已完成</Select.Option>
                        </Select>
                    },
                    {
                        name: 'time',
                        label: '客户交货日期',
                        children: <DatePicker.RangePicker />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input style={{ width: "200px" }} placeholder="计划号/塔型/业务经理/客户" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    if (values.time) {
                        const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                        values.startTime = formatDate[0] + ' 00:00:00';
                        values.endTime = formatDate[1] + ' 23:59:59';
                    }
                    setFilterValue(values);
                    return values;
                }}
            />
        </>
    )
}