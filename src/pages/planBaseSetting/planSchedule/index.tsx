import React, { useState } from 'react';
import { Input, Button, Select, DatePicker, Space, message } from 'antd';
import { SearchTable as Page } from '../../common';
import { planSchedule } from "./data.json"
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { IPlanSchedule } from './IPlanSchedule';
import { Link, useHistory } from 'react-router-dom';
export interface TechnicalIssuePropsRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function PlanScheduleMngt(): React.ReactNode {
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }
    const [filterValue, setFilterValue] = useState({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    const history = useHistory();
    return (<Page
        path="/tower-aps/productionPlan"
        columns={planSchedule as any}
        headTabs={[]}
        extraOperation={<Space>
            <Link to={`/planProd/planScheduleMngt/planDeliveryTime/${selectedKeys.join(',')}`}><Button type="primary" disabled={selectedKeys.length <= 0}>设置/变更计划交货期</Button></Link>
            <Link to={`/planProd/planScheduleMngt/SplitBatch/${selectedKeys[0]}`}><Button type="primary" disabled={selectedKeys.length !== 1}>拆分批次</Button></Link>
            <Button type="primary" disabled={selectedKeys.length <= 0} onClick={() => {
                let tip: boolean[] = [];
                selectedRows.forEach(res => {
                    if (res.planDeliveryTime && res.productionBatchNo) {
                        tip.push(true)
                    } else {
                        tip.push(false)
                    }
                })
                if (tip.findIndex(res => res === false) === -1) {
                    history.push(`/planProd/planScheduleMngt/distributedTech/${selectedKeys.join(',')}`);
                    tip = []
                } else {
                    message.warning('下发技术前，请先设置计划交货期和拆分批次')
                    tip = []
                }

            }}>下发技术</Button>
        </Space>}
        tableProps={{
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
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
                label: '计划交货日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: "200px" }} placeholder="计划号/塔型/业务经理/客户" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />)
}