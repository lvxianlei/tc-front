import React from "react"
import { Button, Input, DatePicker, Select, Modal, message, Radio } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common'
import { collectionListHead } from "./CollectionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
export default function Collection() {
    const history = useHistory()

    const { loading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/Collection?id=${id}`)
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

    const operationChange = (event: any) => {
        console.log("----", event.target.value)
    }

    return <Page
        path="/tower-market/backMoney"
        columns={[
            ...collectionListHead,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => <Button type="link" onClick={() => history.push(`/project/collection/detail/${record.id}`)}>确认信息</Button>
            }]}
        extraOperation={<>
            <Radio.Group defaultValue={1} onChange={operationChange}>
                <Radio.Button value={1}>待确认</Radio.Button>
                <Radio.Button value={2}>已确认</Radio.Button>
            </Radio.Group>
        </>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="编号/客户名称/来款银行" style={{ width: 300 }} />
            },
            {
                name: 'startLaunchTime',
                label: '来款时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            }
        ]}
    />
}
