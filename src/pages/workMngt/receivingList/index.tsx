import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IntgSelect, Page } from '../../common'
import { baseInfo } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Edit from "./Edit"
export default function Invoicing() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [type, setType] = useState<"new" | "edit">("new")
    const [detailId, setDetailId] = useState<string>("")
    const editRef = useRef<{ onSubmit: () => Promise<boolean>, resetFields: () => void }>()
    const [materialData, setMaterialData] = useState<{ [key: string]: any }>({});
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/receiveStock?receiveStockById=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.startReceiveTime) {
            const formatDate = value.startReceiveTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startReceiveTime = formatDate[0] + " 00:00:00"
            value.endReceiveTime = formatDate[1] + " 23:59:59"
        }
        if (value.startCompleteTime) {
            const formatDate = value.startCompleteTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCompleteTime = formatDate[0] + " 00:00:00"
            value.endCompleteTime = formatDate[1] + " 23:59:59"
        }
        if (value.createUserDeptId) {
            value.createUserDeptId = value.createUserDeptId.first
            value.createUserId = value.createUserDeptId.second
        }
        return value
    }
    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            const isClose = await editRef.current?.onSubmit()
            if (isClose) {
                message.success("材质配料设定成功...")
                setVisible(false)
                resove(true)
                history.go(0)
            }
        } catch (error) {
            reject(false)
        }
    })
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此收货单信息吗？",
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
        <Modal destroyOnClose visible={visible} width={1011} title={type === "new" ? "创建" : "编辑"} onOk={handleModalOk} onCancel={() => {
            setVisible(false)
            editRef.current?.resetFields()
            setMaterialData({})
        }}>
            <Edit ref={editRef} id={detailId} type={type} />
        </Modal>
        <Page
            path="/tower-storage/receiveStock"
            columns={[{
                title: "序号",
                dataIndex: "index",
                width: 40,
                render: (_: any, _a: any, index: number) => <>{index + 1}</>
            },
            ...baseInfo,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <Link to={`/workMngt/receiving/detail/${record.id}`}>详情</Link>
                        <Button
                            type="link"
                            disabled={record.receiveStatus === 1}
                            onClick={() => {
                                setDetailId(record.id)
                                setType("edit")
                                setVisible(true)
                            }}>编辑</Button>
                        <a onClick={() => handleDelete(record.id)}>删除</a>
                    </>
                }
            }]}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost onClick={() => {
                    setType("new")
                    setVisible(true)
                }}>创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[

                {
                    name: 'startStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'receiveStatus',
                    label: '收货单状态',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="0">待完成</Select.Option>
                        <Select.Option value="1">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'startReceiveTime',
                    label: '约定到货时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'startCompleteTime',
                    label: '完成时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "createUserDeptId",
                    label: "创建人",
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="供应商/联系人/收货单号/联系电话" style={{ width: 300 }} />
                },
            ]}
        />
    </>
}
