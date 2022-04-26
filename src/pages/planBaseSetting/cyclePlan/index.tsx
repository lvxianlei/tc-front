import React, { useCallback, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, DatePicker, Input, Select } from "antd"
import { SearchTable as Page } from "../../common"
import { tableHeader } from "./data.json"
import { productTypeOptions } from "../../../configuration/DictionaryOptions"
import NewAdd from "./New"
export default () => {
    const history = useHistory()
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    return <>
        <NewAdd visible={isAdd} />
        <Page
            path="/tower-aps/workshopOrder"
            filterValue={filterValue}
            extraOperation={<Button
                type="primary"
                onClick={useCallback(() => setIsAdd(true), [setIsAdd])}
            >新增周期计划</Button>}
            columns={[
                ...tableHeader as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (record: any) => <>
                        <Link
                            to={`/planProd/publishWorkshop/structure/${record.id}/${record.issuedNumber}/${record.productCategory}`}
                        >
                            <Button type="link" size="small">详情</Button>
                        </Link>
                        <Button type="link" size="small">删除</Button>
                    </>
                }
            ]}
            searchFormItems={[
                {
                    name: "",
                    label: '周期计划号',
                    children: <Input placeholder="周期计划号" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: '周期计划类型',
                    children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "",
                    label: "周期计划状态",
                    children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                        <Select.Option value={0}>未下发</Select.Option>
                        <Select.Option value={0}>已下发</Select.Option>
                    </Select>
                },
                {
                    name: "",
                    label: "计划开始日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "",
                    label: "计划完成日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
            ]}
            onFilterSubmit={(values: any) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.time
                }
                return values;
            }}
        />
    </>


}