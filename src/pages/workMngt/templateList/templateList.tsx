import React, { useState, } from "react"
import { Input, DatePicker, Select, Form, Spin, } from 'antd'
import { Page } from '../../common'
import { Link, useLocation } from "react-router-dom"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
export default function TemplateList() {
    const [filterValue, setFilterValue] = useState<any>({})
    const location = useLocation<{ state?: number, userId?: string }>();
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'index',
            fixed: true,
            render: (text: any, item: any, index: number) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '放样任务编号',
            dataIndex: 'taskNum',
        },
        {
            title: '上传图纸类型',
            dataIndex: 'uploadDrawTypeName',
        },
        {
            title: '内部合同编号',
            dataIndex: 'internalNumber',
        },
        {
            title: '计划号',
            dataIndex: 'planNumber',
        },
        {
            title: '塔型',
            dataIndex: 'productCategoryName',
        },
        {
            title: '计划交付时间',
            dataIndex: 'deliverTime',
        },
        {
            title: '图纸负责人',
            dataIndex: 'drawLeaderName',
        },
        {
            title: '上传状态',
            dataIndex: 'uploadStatusName',
        },
        {
            title: '最新状态变更时间',
            dataIndex: 'updateStatusTime',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text: string, record: Record<string, any>): React.ReactNode => {
                return (
                    <Link to={`/workMngt/templateList/${record.id}/${record.productCategoryId}`}>查看</Link>
                )
            }
        },
    ]
    const onFilterSubmit = (value: any) => {
        if (value.updateStatusTimeStart) {
            const formatDate = value.updateStatusTimeStart.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = `${formatDate[0]} 00:00:00`
            value.updateStatusTimeEnd = `${formatDate[1]} 23:59:59`
        }
        setFilterValue(value)
        return value
    }

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/sinzetech-user/user?size=1000`);
        resole(data?.records);
    }), {})
    const checkUser: any = data || [];

    return (
        <Spin spinning={ loading }>
            <Page
                path="/tower-science/loftingTemplate"
                filterValue={filterValue}
                columns={columns}
                exportPath={`/tower-science/loftingTemplate`}
                onFilterSubmit={onFilterSubmit}
                requestData={{ status: location.state?.state, drawLeader: location.state?.userId }}
                searchFormItems={[
                    {
                        name: 'drawType',
                        label: '图纸类型',
                        children: (
                            <Select style={{ width: 200 }} placeholder="请选择">
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">组装图纸</Select.Option>
                                <Select.Option value="2">发货图纸</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'updateStatusTimeStart',
                        label: '日期选择',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'status',
                        label: '上传状态',
                        children: (<Form.Item name="status" initialValue={location.state?.state || ""}>
                            <Select style={{ width: 200 }} placeholder="请选择">
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={1}>待上传</Select.Option>
                                <Select.Option value={2}>已上传</Select.Option>
                            </Select>
                        </Form.Item>
                        )
                    },
                    {
                        name: 'drawLeader',
                        label: '图纸负责人',
                        children: <Form.Item name="drawLeader" initialValue={location.state?.userId || ""}>
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                <Select.Option value="" key="6">全部</Select.Option>
                                {checkUser && checkUser.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '查询',
                        children: <Input placeholder="放样任务编号/内部合同编号/计划号/塔型" style={{ width: 300 }} />
                    }
                ]}
            />
        </Spin>
    )
}
