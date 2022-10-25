import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message, Popconfirm, Spin } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IntgSelect, SearchTable as Page } from '../../common'
import { baseInfo } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Edit from "./Edit"
import Detail from './Detail';
import { settlementModeOptions } from "../../../configuration/DictionaryOptions"

export default function Invoicing() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [visibleSee, setVisibleSee] = useState<boolean>(false);
    const [type, setType] = useState<"new" | "edit">("new")
    const [detailId, setDetailId] = useState<string>("");
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<object>({});
    const editRef = useRef<{ onSubmit: () => Promise<boolean>, resetFields: () => void }>()
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/supplier/list`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

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
        if (value.time) {
            const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCreateTime = formatDate[0] + " 00:00:00"
            value.endCreateTime = formatDate[1] + " 23:59:59"
            delete value.time
        }
        if (value.createUserId) {
            value.createUserId = value.createUserId.value
        }
        setFilterValue(value)
        return value
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        setConfirmLoading(true)
        try {
            const isClose = await editRef.current?.onSubmit()
            if (isClose) {
                message.success("材质配料设定成功...")
                setVisible(false)
                setConfirmLoading(false)
                history.go(0)
            }
        } catch (error) {
            setConfirmLoading(false)
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
        <Modal
            destroyOnClose
            visible={visible}
            width={'90%'}
            confirmLoading={confirmLoading}
            title={type === "new" ? "创建" : "编辑"}
            onOk={handleModalOk}
            onCancel={() => {
                setVisible(false)
                editRef.current?.resetFields()
            }}>
            <Edit ref={editRef} id={detailId} type={type} />
        </Modal>
        {/* 详情 */}
        <Detail
            visible={visibleSee}
            id={detailId}
            onCancel={() => setVisibleSee(false)}
            onOk={() => setVisibleSee(false)}
        />
        <Page
            path="/tower-storage/receiveStock"
            exportPath={"/tower-storage/receiveStock"}
            columns={[{
                title: "序号",
                dataIndex: "index",
                width: 40,
                fixed: "left",
                render: (_: any, _a: any, index: number) => <>{index + 1}</>
            },
            ...baseInfo as any,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 200,
                render: (_: any, record: any) => {
                    return <>
                        <Link className="btn-operation-link" to={`/stock/receiving/detail/${record.id}`}>明细</Link>
                        <Button
                            type="link"
                            className="btn-operation-link"
                            disabled={record.receiveStatus === 1}
                            onClick={() => {
                                setDetailId(record.id)
                                setType("edit")
                                setVisible(true)
                            }}>编辑</Button>
                        <Button type="link" className="btn-operation-link" onClick={() => {
                            setVisibleSee(true);
                            setDetailId(record.id);
                        }}>详情</Button>
                        <Popconfirm
                            title="确定删除此收货单信息吗？"
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
                                disabled={record.receiveStatus === 1 || (record.lists && record.lists.length !== 0)}
                            >删除</Button>
                        </Popconfirm>
                    </>
                }
            }]}
            filterValue={filterValue}
            extraOperation={<>
                {/* <Button type="primary" ghost>导出</Button> */}
                <Button type="primary" ghost onClick={() => {
                    setType("new")
                    setVisible(true)
                }}>创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: "supplierId",
                    label: "供应商",
                    children: <Select style={{ width: 200 }}>
                        {data?.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.supplierName}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'time',
                    label: '创建时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'startReceiveTime',
                    label: '到货时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'receiveStatus',
                    label: '状态',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="0">待完成</Select.Option>
                        <Select.Option value="1">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="供应商/联系人/收货单号/联系电话/纸质单号/车牌号" style={{ width: 300 }} />
                },
                {
                    name: "createUserId",
                    label: "制单人",
                    children: <IntgSelect width={200} placeholder="请输入" />
                },
                {
                    name: 'startStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "settlementMode",
                    label: "结算方式",
                    children: <Select style={{ width: 200 }}>
                        {settlementModeOptions?.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                    </Select>
                }
            ]}
        />
    </>
}
