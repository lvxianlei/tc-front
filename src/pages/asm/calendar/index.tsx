import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, message, Popconfirm, Select } from "antd"
import { Page } from "../../common"
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
export default () => {
    const history = useHistory()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [cyclePlanType, setCyclePlanType] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/department?current=1&size=10000`)
        setCyclePlanType(data?.records)
        resole(data)
    }), {})
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render: (_a: any, _b: any, index: number): React.ReactNode => {
                return (
                    <span>
                        {index + 1}
                    </span>
                )
            }
        },
        {
            title: "日期",
            width: 150,
            dataIndex: "calendar"
        }, {
            title: "星期",
            width: 150,
            dataIndex: "week"
        }, {
            title: "班次",
            width: 150,
            dataIndex: "shift"
        }, {
            title: "工作段",
            width: 150,
            dataIndex: "workTime"
        }, {
            title: "状态",
            width: 150,
            dataIndex: "status",
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '工作';
                    case 2:
                        return '休息';
                }
            }
        }, {
            title: "公司",
            width: 150,
            dataIndex: "companyName"
        }, {
            title: "部门",
            width: 150,
            dataIndex: "deptName"
        }, {
            title: "创建人",
            width: 150,
            dataIndex: "createUserName"
        }, {
            title: "创建时间",
            width: 150,
            dataIndex: "createTime"
        }
    ]
    return <>
        <Page
            path="/tower-as/calendar"
            filterValue={filterValue}
            columns={[
                ...columns as any
            ]}
            tableProps={{
                rowSelection: {
                    type: 'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            extraOperation={[
                <Button type='primary' key="new" onClick={() => {
                    history.push(`/calendar/calendar/add`)
                }}>新增</Button>,
                <Button type='primary' key="second" onClick={async () => {
                    await RequestUtil.put(`/tower-as/calendar`, {
                        id: selectedKeys[0],
                        status: selectedRows[0].status === 1 ? 2 : 1
                    })
                    message.success("调整成功！")
                    history.go(0)
                }} disabled={!(selectedKeys.length > 0)}>调整工作状态</Button>,
                <Popconfirm
                    key="delete"
                    title="确认删除?"
                    onConfirm={async () => {
                        await RequestUtil.delete(`/tower-as/calendar/${selectedKeys[0]}`).then(res => {
                            message.success('删除成功！');
                            history.go(0)
                        });
                    }}
                    okText="确认"
                    cancelText="取消"
                    disabled={!(selectedKeys.length > 0)}
                >
                    <Button type="primary" disabled={!(selectedKeys.length > 0)}>删除</Button>
                </Popconfirm>
            ]}
            searchFormItems={[
                {
                    name: "companyName",
                    label: '公司',
                    children: <Input placeholder="请输入公司进行查询" style={{ width: 150 }} />
                },
                {
                    name: "deptName",
                    label: '部门',
                    children: <Input placeholder="请输入部门名称进行查询" style={{ width: 150 }} />
                },
                {
                    name: "status",
                    label: "状态",
                    children: <Form.Item name='status' >
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            {/* <Select.Option value='' key="">全部</Select.Option> */}
                            <Select.Option value={1}>工作</Select.Option>
                            <Select.Option value={2}>休息</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: "date",
                    label: "起止日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.date) {
                    const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startCalendar = formatDate[0] + ' 00:00:00';
                    values.endCalendar = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                setFilterValue(values)
                return values;
            }}
        />
    </>


}