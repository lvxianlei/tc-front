import React, { useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import { Button, DatePicker, Form, Input, message, Popconfirm, Select, Space } from "antd"
import { SearchTable as Page } from "../../common"
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
export default () => {
    const history = useHistory()
    const [refresh, setRefresh] = useState<boolean>(false)
    const location = useLocation<{ status?: string }>();
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        ...history.location.state as object
    });
    const [cyclePlanType, setCyclePlanType] = useState<any[]>([]);
    const { } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?current=1&size=1000`)
        setCyclePlanType(data?.records)
        resole(data)
    }), {})

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            fixed: "left",
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: "工单编号",
            width: 150,
            dataIndex: "workOrderNumber"
        },
        {
            title: "订单编号",
            width: 150,
            dataIndex: "saleOrderNumber"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber"
        },
        {
            title: "工程名称",
            width: 150,
            dataIndex: "projectName"
        },
        {
            title: "工程地址",
            width: 150,
            dataIndex: "deliveryAddress"
        },
        {
            title: "业务经理",
            width: 150,
            dataIndex: "serviceManager"
        },
        {
            title: "售后人员",
            width: 200,
            dataIndex: "afterSaleUser"
        },
        {
            title: "备注",
            width: 200,
            dataIndex: "description"
        },
        {
            title: "联系人",
            dataIndex: "linkman",
            width: 100,
        },
        {
            title: "联系方式",
            dataIndex: "phone",
            width: 200,
        },
        {
            title: "工单状态",
            dataIndex: "status",
            width: 150,
            type: "select",
            enum: [
                {
                    "value": 1,
                    "label": "未派工"
                },
                {
                    "value": 2,
                    "label": "待处理"
                },
                {
                    "value": 3,
                    "label": "处理中"
                },
                {
                    "value": 4,
                    "label": "已完成"
                },
                {
                    "value": 5,
                    "label": "已关闭"
                }
            ]
        },
        {
            title: "创建人",
            dataIndex: "createUserName",
            width: 150,
        },
        {
            title: "创建时间",
            width: 150,
            dataIndex: "createTime"
        }
    ]
    return <Page
        path="/tower-as/workOrder"
        filterValue={filterValue}
        extraOperation={<Button
            type="primary"
            onClick={() => {
                history.push(`/afterSales/afterSale/add`)
            }}
        >添加工单</Button>}
        columns={[
            ...columns as any,
            {
                title: "操作",
                dataIndex: "operation",
                fixed: "right",
                render: (_: any, record: any) => <Space>
                    <Link
                        to={`/afterSales/afterSale/detail/${record?.id}`}
                    >
                        <Button type="link" size="small" >详情</Button>
                    </Link>
                    <Link
                        to={`/afterSales/afterSale/edit/${record?.id}`}
                    >
                        <Button type="link" size="small" disabled={record?.status > 2}>编辑</Button>
                    </Link>
                    {
                        record?.status < 3 ? <Popconfirm
                            title="删除后不可恢复，确认删除?"
                            onConfirm={async () => {
                                await RequestUtil.delete(`/tower-as/workOrder?id=${record?.id}`, { id: record?.id })
                                message.success("删除成功！")
                                history.go(0)
                                setRefresh(!refresh)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link" >删除</Button>
                        </Popconfirm> :
                            <Button type="link" disabled>删除</Button>
                    }


                </Space>
            }
        ]}
        searchFormItems={[
            {
                name: "fuzzyQuery",
                label: '模糊查询',
                children: <Input placeholder="请输入工单编号/订单编号/计划号/工程名进行查询" style={{ width: 150 }} />
            },
            {
                name: "afterSaleUser",
                label: '售后人员',
                children: <Select placeholder="请选择" style={{ width: "150px" }} showSearch>
                    {/* <Select.Option value='' key="">全部</Select.Option> */}
                    {cyclePlanType && cyclePlanType.map(({ userId, name }, index) => {
                        return <Select.Option key={index} value={name}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            },
            {
                name: "status",
                label: "工作状态",
                children: <Form.Item name='status' initialValue={location.state?.status || ''}>
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        {/* <Select.Option value='' key="">全部</Select.Option> */}
                        <Select.Option value={1}>未派工</Select.Option>
                        <Select.Option value={2}>待处理</Select.Option>
                        <Select.Option value={3}>处理中</Select.Option>
                        <Select.Option value={4}>已完成</Select.Option>
                        <Select.Option value={5}>已关闭</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: "date",
                label: "创建日期",
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            }
        ]}
        refresh={refresh}
        onFilterSubmit={(values: any) => {
            if (values.date) {
                const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                values.createTimeStart = formatDate[0] + ' 00:00:00';
                values.createTimeEnd = formatDate[1] + ' 23:59:59';
                delete values.date
            }
            setFilterValue(values)
            return values;
        }}
    />
}