import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Edit from "./Edit"
export default function Invoicing() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const editRef = useRef<{ onSubmit: () => Promise<boolean>, loading: boolean }>()
    const [materialData, setMaterialData] = useState<{ [key: string]: any }>({});
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
    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("材质配料设定成功...")
            setVisible(false)
            resove(true)
            history.go(0)
        }
    })
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
        <Modal visible={visible} width={1011} title="创建" onOk={handleModalOk} onCancel={() => {
            setVisible(false)
            setMaterialData({})
        }}>
            <Edit />
        </Modal>
        <Page
            path="/tower-storage/receiveStock"
            columns={[
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Link to={`/workMngt/receive/detail/${record.id}`}>详情</Link>
                            <Button type="link" onClick={()=>history.push(`/workMngt/receive/edit/${record.id}`)}>编辑</Button>
                            <a onClick={() => handleDelete(record.id)}>删除</a>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost>创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
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
                    name: 'purchaseTaskStatus',
                    label: '收货单状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="2">待接收</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                }
            ]}
        />
    </>
}
