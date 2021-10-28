import React, { useState } from "react"
import { Button, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page, DetailContent, BaseInfo, DetailTitle, CommonTable } from '../../common'
import { baseinfo, bilinformation, operation } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Invoice() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const { loading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoice?id=${id}`)
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

    return <>
        <Modal visible={visible} width={1011} title="创建" onCancel={() => setVisible(false)}>
            <DetailContent>
                <DetailTitle title="票据信息" />
                <BaseInfo columns={bilinformation} dataSource={{}} edit />
                <DetailTitle title="相关附件" />
                <CommonTable columns={[]} dataSource={[]} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={operation} dataSource={[]} />
            </DetailContent>
        </Modal>
        <Page
            path="/tower-supply/invoice"
            columns={[
                ...baseinfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" onClick={() => setVisible(true)}>查看</Button>
                            <Button type="link" onClick={() => setVisible(true)}>编辑</Button>
                            <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary">导出</Button>
                <Button type="primary" onClick={() => setVisible(true)}>创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startLaunchTime',
                    label: '最近状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'contractType',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">不下计划</Select.Option>
                        <Select.Option value="2">未下计划</Select.Option>
                    </Select>
                },
                {
                    name: 'isOpen',
                    label: '发票类型',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">预开</Select.Option>
                        <Select.Option value="2">发票已开全</Select.Option>
                        <Select.Option value="3">发票未开全</Select.Option>
                    </Select>
                },
                {
                    name: 'b',
                    label: '供应商',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">预开</Select.Option>
                        <Select.Option value="2">发票已开全</Select.Option>
                        <Select.Option value="3">发票未开全</Select.Option>
                    </Select>
                }
            ]}
        />
    </>
}
