import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, Select, Space } from "antd"
import { Page } from "../../common"
import { productTypeOptions } from "../../../configuration/DictionaryOptions"
export default () => {
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        changeType: 1
    });
    const columns = [
        {
            title: "塔型",
            width: 150,
            dataIndex: "productCategoryName"
        },
        {
            title: "计划号",
            width: 200,
            dataIndex: "planNumber"
        },
        {
            title: "产品类型",
            dataIndex: "productTypeName",
            width: 200,
        },
        {
            title: "客户",
            dataIndex: "customer",
            width: 150,
        },
        {
            title: "基数",
            width: 150,
            dataIndex: "number"
        },
        {
            title: "总重量（t）",
            width: 150,
            dataIndex: "totalWeight"
        },
        {
            title: "变更类型",
            width: 150,
            dataIndex: "changeType",
            type: "select",
            enum: [
                {
                    "value": 1,
                    "label": "恢复加工"
                },
                {
                    "value": 2,
                    "label": "暂停加工"
                },
                {
                    "value": 3,
                    "label": "取消加工"
                }
            ]
        },
        {
            title: "业务经理",
            width: 150,
            dataIndex: "businessManagerName"
        },
        {
            title: "变更日期",
            width: 150,
            dataIndex: "changeDate"
        }
    ] 
    return <Page
            path="/tower-aps/change/page"
            filterValue={filterValue}
            columns={[
                ...columns as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_:any,record: any) => <Space>
                        <Link
                            to={`/planProd/planChange/${record?.changeId}/${record?.changeType}`}
                        >
                            <Button type="link" size="small">明细</Button>
                        </Link>
                    </Space>
                }
            ]}
            searchFormItems={[
                {
                    name: "fuzzyMsg",
                    label: '模糊查询项',
                    children: <Input placeholder="计划号/塔型/业务经理/客户" style={{ width: 150 }} />
                },
                {
                    name: "productTypeName",
                    label: '产品类型',
                    children: <Select placeholder="请选择"  style={{ width: "150px" }}>
                        {/* <Select.Option key={''} value={''}>
                            全部
                        </Select.Option> */}
                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={name}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "changeType",
                    label: "变更类型",
                    children: <Form.Item name='changeType' initialValue={1}>
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            {/* <Select.Option key={''} value={''}>
                                全部
                            </Select.Option> */}
                            <Select.Option value={1} key={1}>恢复加工</Select.Option>
                            <Select.Option value={2} key={2}>暂停加工</Select.Option>
                            <Select.Option value={3} key={3}>取消加工</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: "time",
                    label: "变更日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.time
                }
                setFilterValue(values)
                return values;
            }}
        />


}