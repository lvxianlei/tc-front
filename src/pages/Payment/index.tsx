import React from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common'
import { PaymentListHead } from "./PaymentData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
export default function Payment() {
    const history = useHistory()

    const { loading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/Payment?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此开票申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await deleteRun(id))
                    message.success("删除成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    return <Page
        path="/tower-market/payApply"
        columns={[
            ...PaymentListHead,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <Button type="link" onClick={() => history.push(`/project/payment/detail/${record.id}`)}>查看</Button>
                        <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                    </>
                }
            }]}
        extraOperation={<Link to="/project/payment/edit/new"><Button type="primary">新增开票申请</Button></Link>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="请款单号/项目编号/项目名称/票面单位/业务经理" style={{ width: 300 }} />
            },
            {
                name: 'isOpen',
                label: '付款类型',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="a">请款</Select.Option>
                    <Select.Option value="b">报销</Select.Option>
                </Select>
            },
            {
                name: 'contractType',
                label: '付款状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="e">待付款</Select.Option>
                    <Select.Option value="f">已付款</Select.Option>
                </Select>
            },
            {
                name: 'bbbb',
                label: '审批状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="e">待审批</Select.Option>
                    <Select.Option value="f">被驳回</Select.Option>
                    <Select.Option value="2">已通过</Select.Option>
                </Select>
            },
            {
                name: 'startLaunchTime',
                label: '申请时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            }
        ]}
    />
}
