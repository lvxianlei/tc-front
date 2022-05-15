import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, message, Modal, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, Attachment, AttachmentRef } from '../../common'
import { CargoDetails } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import { Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil'

interface ReceiveStrokAttachProps {
    type: 1 | 2
    id: string
}

const ReceiveStrokAttach = forwardRef(({ type, id }: ReceiveStrokAttachProps, ref): JSX.Element => {
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/attach?attachType=${type}&id=${id}`)
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            // 对上传数据进行处理
            const fieldIds: any = [],
                source = attachRef.current.getDataSource();
            if (source.length < 1) {
                message.error("请您先上传附件！");
                return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                attachType: type,
                id,
                fieldIds
            })
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment title={false} dataSource={data} edit ref={attachRef} style={{ margin: "0px" }} marginTop={false} />
    </Spin>
})

export default function Overview() {
    const receiveRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({ receiveStockId: params.id })
    const [attchType, setAttachType] = useState<1 | 2>(1)
    const [detailId, setDetailId] = useState<string>("")
    const [saveLoding, setSaveLoading] = useState<boolean>(false)

    // 批量收货
    const { loading, run } = useRequest<{ [key: string]: any }>((params: any[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/batchSaveReceiveStock`, params)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 收货
    const { loading: receiveLoading, run: receiveRun } = useRequest<{ [key: string]: any }>((params: any[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/batchSaveReceiveStock`, params)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    // 拒绝收货
    const { loading: refuseLoading, run: refuseRun } = useRequest<{ [key: string]: any }>((params: any[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/refuse`, params)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 统计数量
    const { data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detailStatistics`, {
                receiveStockId: params.id,
                startStatusUpdateTime: filterValue["startStatusUpdateTime"] || "",
                endStatusUpdateTime: filterValue["endStatusUpdateTime"] || "",
                receiveDetailStatus: filterValue["receiveDetailStatus"] || ""
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

    const handleAttachOk = async () => {
        setSaveLoading(true)
        await receiveRef.current.onSubmit()
        setSaveLoading(false)
        message.success("保存成功...")
        setVisible(false)
    }

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
            value.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        value["receiveStockId"] = params.id;
        setFilterValue({ ...value, receiveStockId: params.id })
        return value
    }

    const handleSelectChange = (_ids: any, selectedRows: any[]) => setSelectedRows(selectedRows)

    const handleRecive = async () => {
        await run(selectedRows.map((item: any) => ({
            id: item.id,
            locatorId: item.locatorId,
            reservoirId: item.reservoirId,
            warehouseId: item.warehouseId
        })))
    }

    return <DetailContent>
        <Modal
            destroyOnClose
            visible={visible}
            title={attchType === 1 ? "质保单" : "质检单"}
            confirmLoading={saveLoding}
            onOk={handleAttachOk}
            okText="保存"
            onCancel={() => {
                setAttachType(1)
                setDetailId("")
                setVisible(false)
            }}>
            <ReceiveStrokAttach type={attchType} id={detailId} ref={receiveRef} />

        </Modal>
        <Page
            path="/tower-storage/receiveStock/detail"
            exportPath={"/tower-storage/receiveStock/detail"}
            exportObject={{ receiveStockId: params.id }}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            searchFormItems={[
                // {
                //     name: 'startStatusUpdateTime',
                //     label: "最新状态变更时间",
                //     children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                // },
                // {
                //     name: 'receiveDetailStatus',
                //     label: '采购状态',
                //     children: <Form.Item name="receiveDetailStatus">
                //         <Select defaultValue="全部" style={{ width: 150 }}>
                //             <Select.Option value="">全部</Select.Option>
                //             <Select.Option value={0}>待收货</Select.Option>
                //             <Select.Option value={1}>已收货</Select.Option>
                //             <Select.Option value={2}>已拒绝</Select.Option>
                //         </Select>
                //     </Form.Item>
                // }
            ]}
            extraOperation={<>
                <Button type="primary"
                    ghost
                    disabled={!(selectedRows.length > 0)}
                    loading={loading}
                    onClick={handleRecive}
                >批量收货</Button>
                <Button type="primary" ghost onClick={() => message.warning("功能开发中...")} >申请质检</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                <span style={{ marginLeft: "20px" }}>
                    已收货：重量(支)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{userData?.receiveWeight === -1 ? 0 : userData?.receiveWeight}</span>
                    价税合计(元)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{userData?.receivePrice === -1 ? 0 : userData?.receivePrice}</span>
                    待收货：重量(支)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}> {userData?.waitWeight === -1 ? 0 : userData?.waitWeight}</span>
                    价税合计(元)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{userData?.waitPrice === -1 ? 0 : userData?.waitPrice}</span>
                </span>
            </>}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedRows.map((item: any) => item.id),
                    onChange: handleSelectChange
                }
            }}
            columns={[
                ...CargoDetails,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, records: any) => <>
                        <a
                            style={{ marginRight: 12 }}
                            onClick={() => {
                                setAttachType(1)
                                setDetailId(records.id)
                                setVisible(true)
                            }}>收货</a>
                        <a
                            style={{ marginRight: 12 }}
                            onClick={() => { }}
                        >拒收</a>
                    </>
                }
            ]}
        />
        {/* {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, records: any) => <>
                        <a style={{ marginRight: 12 }} onClick={() => {
                            setAttachType(1)
                            setDetailId(records.id)
                            setVisible(true)
                        }}>质保单</a>
                        <a style={{ marginRight: 12 }} onClick={() => {
                            setAttachType(2)
                            setDetailId(records.id)
                            setVisible(true)
                        }}>质检单</a>
                    </>
                } */}
    </DetailContent>
}