import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Input, message, Popconfirm, Space } from "antd"
import { SearchTable as Page } from "../../common"
import RequestUtil from "../../../utils/RequestUtil"
import AfterSalesUser from "./AfterSalesUser"
export default () => {
    const history = useHistory()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        ...history.location.state as object
    });
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            fixed: "left",
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: "账号",
            width: 150,
            dataIndex: "account"
        },
        {
            title: "姓名",
            width: 150,
            dataIndex: "name"
        },
        {
            title: "手机号码",
            width: 150,
            dataIndex: "phone"
        },
        // {
        //     title: "员工类型",
        //     width: 150,
        //     dataIndex: "categoryName"
        // },
        // {
        //     title: "工号",
        //     width: 150,
        //     dataIndex: "number"
        // },
        {
            title: "部门",
            width: 200,
            dataIndex: "deptName"
        },
        // {
        //     title: "岗位",
        //     dataIndex: "stationName",
        //     width: 100,
        // },
        // {
        //     title: "角色",
        //     dataIndex: "roleName",
        //     width: 200,
        // },
        // {
        //     title: "企业微信用户",
        //     dataIndex: "businessWxUserId",
        //     width: 150,
        // },
        // {
        //     title: "邮箱",
        //     dataIndex: "email",
        //     width: 150,
        // },
        // {
        //     title: "备注",
        //     width: 150,
        //     dataIndex: "description"
        // },
        // {
        //     title: "状态",
        //     width: 150,
        //     dataIndex: "statusName"
        // }
    ]
    return <Page
        path="/tower-as/employee"
        exportPath="/tower-as/employee"
        filterValue={filterValue}
        extraOperation={<><AfterSalesUser onSelect={async (selectRows: any[]) => {
            await RequestUtil.post(`/tower-as/employee`, selectRows)
            message.success("添加成功！")
            history.go(0)
        }} />
            <Popconfirm
                title="删除后不可恢复，确认删除?"
                onConfirm={async () => {
                    await RequestUtil.delete(`/tower-as/employee/${selectedKeys.join(',')}`)
                    message.success("删除成功！")
                    history.go(0)
                    setRefresh(!refresh)
                }}
                okText="确认"
                cancelText="取消"
                disabled={!(selectedKeys.length > 0)}
            >
                <Button type="primary" disabled={!(selectedKeys.length > 0)}>删除</Button>
            </Popconfirm></>
        }
        tableProps={{
            rowKey: 'id',
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }
        }}
        columns={[
            ...columns as any,
            {
                title: "操作",
                dataIndex: "operation",
                fixed: "right",
                width: 50,
                render: (_: any, record: any) => <Space>

                    {
                        <Popconfirm
                            title="删除后不可恢复，确认删除?"
                            onConfirm={async () => {
                                await RequestUtil.delete(`/tower-as/employee/${record?.id}`)
                                message.success("删除成功！")
                                history.go(0)
                                setRefresh(!refresh)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link" >删除</Button>
                        </Popconfirm>
                    }


                </Space>
            }
        ]}
        searchFormItems={[
            {
                name: "fuzzyQuery",
                label: '模糊查询',
                children: <Input placeholder="请输入账号/手机号/姓名/工号/邮箱进行查询" style={{ width: 150 }} />
            }
        ]}
        refresh={refresh}
        onFilterSubmit={(values: any) => {
            setFilterValue(values)
            return values;
        }}
    />
}