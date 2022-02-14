import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { paymentListHead } from "./payment.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { costTypeOptions } from "../../../configuration/DictionaryOptions"
export default function Payment() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({})
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

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此付款申请吗？",
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
            ...paymentListHead,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <span style={{ color: "#FF8C00", cursor: "pointer", marginRight: 12 }} onClick={() => history.push(`/project/payment/detail/${record.id}`)}>查看</span>
                        <Button className="btn-operation-link" type="link" size="small" disabled={![4, 6].includes(record.applyStatus)} onClick={() => handleDelete(record.id)}>删除</Button>
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
                children: <Select style={{ width: 100 }}>
                    <Select.Option value="0">待付款</Select.Option>
                    <Select.Option value="1">已付款</Select.Option>
                </Select>
            },
            {
                name: 'applyStatus',
                label: '审批状态',
                children: <Select style={{ width: 100 }}>
                    <Select.Option value="1">审批中</Select.Option>
                    <Select.Option value="2">已通过</Select.Option>
                    <Select.Option value="3">已驳回</Select.Option>
                    <Select.Option value="4">已撤销</Select.Option>
                    <Select.Option value="6">通过后撤销</Select.Option>
                </Select>
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
