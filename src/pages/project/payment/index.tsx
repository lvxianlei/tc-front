import React, { useState } from "react"
import { Button, Input, DatePicker, Select, message, Popconfirm, Form } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { SearchTable as Page } from '../../common'
import { paymentListHead } from "./payment.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { costTypeOptions } from "../../../configuration/DictionaryOptions"
export default function Payment() {
    const history = useHistory()
    const location = useLocation<{ payStatus?: string, applyStatus?:string }> ();
    const [filterValue, setFilterValue] = useState({
        ...history.location.state as object
    })
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/payApply?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startApplicantTime) {
            const formatDate = value.startApplicantTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startApplicantTime = formatDate[0]
            value.endApplicantTime = formatDate[1]
        }
        setFilterValue(value)
        return value
    }

    return <Page
        path="/tower-market/payApply"
        columns={[
            ...(paymentListHead as any),
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <span style={{ color: "#FF8C00", cursor: "pointer", marginRight: 12 }} onClick={() => history.push(`/project/payment/detail/${record.id}`)}>查看</span>
                        <Popconfirm
                            title="确定删除此请款申请吗？"
                            disabled={![4, 6].includes(record.applyStatus)}
                            onConfirm={async () => {
                                await deleteRun(record?.id)
                                message.success("删除成功...")
                                history.go(0)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                type="link"
                                size="small"
                                className="btn-operation-link"
                                disabled={![4, 6].includes(record.applyStatus)}
                            >删除</Button>
                        </Popconfirm>
                    </>
                }
            }]}
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        searchFormItems={[
            {
                name: 'costType',
                label: '请款类型',
                children: <Select style={{ width: 100 }}>
                    {costTypeOptions?.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
                </Select>
            },
            {
                name: 'payStatus',
                label: '请款状态',
                children: <Form.Item name='payStatus' initialValue={location.state?.payStatus||''}>
                    <Select style={{ width: 100 }} >
                        <Select.Option value="0">待付款</Select.Option>
                        <Select.Option value="1">已付款</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'applyStatus',
                label: '审批状态',
                children: <Form.Item name='applyStatus' initialValue={location.state?.applyStatus||''}>
                    <Select style={{ width: 100 }}>
                        <Select.Option value="1">审批中</Select.Option>
                        <Select.Option value="2">已通过</Select.Option>
                        <Select.Option value="3">已驳回</Select.Option>
                        <Select.Option value="4">已撤销</Select.Option>
                        <Select.Option value="6">通过后撤销</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'startApplicantTime',
                label: '申请时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input placeholder="请款单号/项目编号/项目名称/票面单位/业务经理" style={{ width: 300 }} />
            }
        ]}
    />
}
