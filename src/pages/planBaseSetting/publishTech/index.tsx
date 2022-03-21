import React, { useState, Key } from "react"
import { useHistory } from "react-router";
import { Button, DatePicker, Input, message, Select } from "antd"
import { Page } from "../../common"
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { pageTable } from "./data.json"

export default () => {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)

    return <Page
        path="/tower-aps/productionLink"
        columns={pageTable}
        extraOperation={[
            <Button
                type="primary"
                onClick={() => {
                    if (selectedRowKeys.length <= 0) {
                        message.warning("请勾选下达单号")
                        return
                    }
                    history.push({ pathname: "/planSchedule/publishTech/settingPlanTime", state: [] })
                }}>设置/变更计划交货期</Button>,
            <Button
                type="primary"
                onClick={() => {
                    if (selectedRowKeys.length <= 0) {
                        message.warning("请勾选下达单号")
                        return
                    }
                    history.push({ pathname: "/planSchedule/publishTech/splitBatch", state: [] })
                }}>拆分批次</Button>,
            <Button
                type="primary"
                onClick={() => {
                    if (selectedRowKeys.length <= 0) {
                        message.warning("请勾选下达单号")
                        return
                    }
                    history.push({ pathname: "/planSchedule/publishTech/distributedTech", state: [] })
                }}>下发技术</Button>
        ]}
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
                children: <Input placeholder="计划号/塔型/业务经理/客户" style={{ width: 300 }} />
            }
        ]}
        tableProps={{
            rowSelection: {
                selectedRowKeys,
                onChange: onSelectChange,
            }
        }}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
                delete values.time
            }
            setFilterValue(values);
            return values;
        }}
    />
}