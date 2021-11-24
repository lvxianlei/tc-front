import React, { useState, } from "react"
import { Button, Input, DatePicker, Select, } from 'antd'
import { Page } from '../../common'
import { useHistory } from "react-router-dom"
export default function TemplateList() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({})
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'entryNo',
            fixed: true,
            align: 'center',
        },
        {
            title: '放样任务编号',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '上传图纸类型',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '内部合同编号',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '任务单编号',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '塔型',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '计划交付时间',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '图纸负责人',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '上传状态',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '最新状态变更时间',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text: string, item: { id: string },) => {
                return (
                    <div className='operation'>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                history.push(`/workMngt/templateList/${item.id}`)
                            }}
                        >查看</span>
                    </div>
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
        setFilterValue({ ...filterValue, ...value })
        return value
    }
    return (
        <>
            <Page
                path="/tower-science/loftingTemplate"
                filterValue={filterValue}
                columns={columns}
                extraOperation={<Button type="primary" ghost>导出</Button>}
                onFilterSubmit={onFilterSubmit}
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
                        children: (
                            <Select style={{ width: 200 }} placeholder="请选择">
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">待上传</Select.Option>
                                <Select.Option value="2">已上传</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '查询',
                        children: <Input placeholder="放样任务编号/内部合同编号/任务单编号/塔型" style={{ width: 300 }} />
                    }
                ]}
            />
        </>
    )
}
