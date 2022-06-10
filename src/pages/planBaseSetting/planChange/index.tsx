import React, { useCallback, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space } from "antd"
import { Page } from "../../common"
import { productTypeOptions } from "../../../configuration/DictionaryOptions"
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
export default () => {
    const history = useHistory()
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        status:1
    });
    const [form] = Form.useForm();
    const [cyclePlanType,setCyclePlanType] = useState<any[]>([]);
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/workshop/config/cycleConfig?current=1&size=10000`)
        setCyclePlanType(data?.records)
        resole(data)
    }), {})
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    const columns = [
        {
            title: "塔型",
            width: 150,
            dataIndex: "productCategory"
        },
        {
            title: "计划号",
            width: 200,
            dataIndex: "planNumber"
        },
        {
            title: "产品类型",
            dataIndex: "productType",
            width: 200,
        },
        {
            title: "客户",
            dataIndex: "customerCompany",
            width: 150,
        },
        {
            title: "基数",
            width: 150,
            dataIndex: "num"
        },
        {
            title: "总重量（t）",
            width: 150,
            dataIndex: "num"
        },
        {
            title: "变更类型",
            width: 150,
            dataIndex: "num",
            type: "select",
            enum: [
                {
                    "value": 1,
                    "label": "暂停加工"
                },
                {
                    "value": 2,
                    "label": "取消加工"
                },
                {
                    "value": 3,
                    "label": "恢复加工"
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
            dataIndex: "num"
        }
    ] 
    return <Page
            path="/tower-aps/cyclePlan"
            filterValue={filterValue}
            columns={[
                ...columns as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_:any,record: any) => <Space>
                        <Link
                            to={`/planProd/planChange/${record?.id}/${record?.status}`}
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
                    name: "configId",
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
                    name: "status",
                    label: "变更类型",
                    children: <Form.Item name='status' initialValue={1}>
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={1} key={1}>暂停加工</Select.Option>
                            <Select.Option value={2} key={2}> 取消加工</Select.Option>
                            <Select.Option value={3} key={3}>恢复加工</Select.Option>
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
                    values.planStartTime = formatDate[0] + ' 00:00:00';
                    values.planEndTime = formatDate[1] + ' 23:59:59';
                    delete values.time
                }
                setFilterValue(values)
                return values;
            }}
        />


}