import React, { useState } from "react"
import { DatePicker, Input, Select } from "antd"
import { SearchTable as Page } from "../../common"
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
export default () => {
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        status: 1
    });
    const [dept, setDept] = useState<any[]>([]);
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-as/dept`)
        setDept(data)
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
        }, {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber"
        }, {
            title: "工程名称",
            width: 150,
            dataIndex: "projectName"
        }, {
            title: "问题分类",
            width: 150,
            dataIndex: "issueName"
        }, {
            title: "塔型",
            width: 150,
            dataIndex: "productCategory"
        }, {
            title: "杆塔号",
            width: 150,
            dataIndex: "productNumber"
        }, {
            title: "件号",
            width: 150,
            dataIndex: "pieceCode"
        }, {
            title: "件数",
            width: 150,
            dataIndex: "pieceCodeNum"
        }, {
            title: "问题描述",
            width: 150,
            dataIndex: "des"
        }, {
            title: "解决方案",
            width: 150,
            dataIndex: "plan"
        }, {
            title: "图片/视频",
            width: 150,
            dataIndex: "picNumber"
        }, {
            title: "状态",
            width: 150,
            dataIndex: "status",
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '未解决';
                    case 2:
                        return '已解决';
                }
            }
        },
        {
            title: "责任部门",
            width: 150,
            dataIndex: "deptName"
        },
        {
            title: "责任人",
            width: 100,
            dataIndex: "userName"
        },
        {
            title: "考核方式",
            dataIndex: "type",
            width: 80,
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '扣款';
                }
            }
        },
        {
            title: "考核金额",
            dataIndex: "money",
            width: 200,
        },
        {
            title: "备注",
            dataIndex: "description",
            width: 150,
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
    return <>
        <Page
            path="/tower-as/workAssess"
            filterValue={filterValue}
            columns={[
                ...columns as any
            ]}
            searchFormItems={[
                {
                    name: "fuzzyQuery",
                    label: '模糊查询',
                    children: <Input placeholder="请输入工单编号/计划号/工程名进行查询" style={{ width: 150 }} />
                },
                {
                    name: "issueName",
                    label: '问题分类',
                    children: <Input placeholder="请输入" />
                },
                {
                    name: "deptId",
                    label: "责任部门",
                    children: <Select placeholder="请选择" style={{ width: "150px" }}>
                        {dept && dept.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        })}
                    </Select>
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
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                setFilterValue(values)
                return values;
            }}
        />
    </>


}