import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "./shortageListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Overview from "./Overview"
export default function Invoicing() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
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
            title: "取消",
            content: "确定取消此缺料列表吗？",
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

    return <>
        <Modal title="操作信息" visible={visible} width={1011} onCancel={() => setVisible(false)}>
            <Overview />
        </Modal>
        <Page
            path="/tower-supply/materialShortage"
            columns={[
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <a onClick={() => setVisible(true)}>查看</a>
                            <Button type="link" onClick={() => handleDelete(record.id)}>取消</Button>
                        </>
                    }
                }]}
            extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            tableProps={{
                rowSelection: {
                    type: "checkbox"
                }
            }}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    children: <Input placeholder="编号/内部合同编号/工程名称/票面单位/业务经理" style={{ width: 300 }} />
                },
                {
                    name: 'startPurchaseStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'isOpen',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">待审批</Select.Option>
                        <Select.Option value="2">已拒绝</Select.Option>
                        <Select.Option value="3">已撤回</Select.Option>
                        <Select.Option value="4">已通过</Select.Option>
                    </Select>
                }
            ]}
        />
    </>
}
