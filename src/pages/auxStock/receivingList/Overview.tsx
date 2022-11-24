import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, message, Modal, Spin, Form } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, BaseInfo } from '../../common'
import { CargoDetails } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import { SearchTable as Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil'

interface ReceiveStrokAttachProps {
    type: 1 | 2
    ids: string[]
    receiveStockId: string
}

const ReceiveStrokAttach = forwardRef(({ type, ids, receiveStockId }: ReceiveStrokAttachProps, ref): JSX.Element => {
    const [form] = Form.useForm()
    const [reservoirId, setReservoirId] = useState<string>()
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/auxiliaryReceiveStock/detail/${receiveStockId}`)
            const warehouseData: any[] = type === 1 ? await RequestUtil.get(`/tower-storage/warehouse/tree`, { id: result.warehouseId, type: 1 }) : []
            resole({
                warehouseName: result.warehouseName,
                warehouseId: result.warehouseId,
                warehouseData: warehouseData.map((item: any) => ({ label: item.name, value: item.id }))
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [receiveStockId] })

    //库位
    const { data: locatorData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const warehouseId = await form.getFieldValue("reservoirId")
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree`, { id: warehouseId, type: 2 })
            resole(result.map((item: any) => ({ label: item.name, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }), { ready: !!reservoirId, refreshDeps: [reservoirId] })

    // 批量收货 / 收货
    const { run } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            const params = await form.validateFields()
            const result: { [key: string]: any } = await RequestUtil.put(
                `/tower-storage/auxiliaryReceiveStock/receive`,
                {
                    ...params,
                    warehouseId: data?.warehouseId,
                    receiveStockId,
                    receiveDetailIds: ids
                }
            )
            resole(true)
        } catch (error) {
            reject(false)
            // reject(error)
        }
    }), { manual: true })

    // 拒绝收货
    const { run: refuseRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const params = await form.validateFields()
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-storage/auxiliaryReceiveStock/rejection`, {
                id: ids[0],
                receiveStockId,
                ...params
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: type === 1 ? run : refuseRun }), [run, refuseRun, type])

    const handleBaseInfoChange = (values: any) => {
        if (values.reservoirId) {
            setReservoirId(values.reservoirId)
        }
    }

    return <Spin spinning={loading}>
        <BaseInfo
            edit 
            col={1}
            form={form}
            onChange={handleBaseInfoChange}
            columns={type === 1 ? [
                {
                    title: "仓库",
                    dataIndex: "warehouseName",
                    disabled: true
                },
                {
                    title: "库区",
                    dataIndex: "reservoirId",
                    type: "select",
                    enum: data?.warehouseData || []
                },
                {
                    title: "库位",
                    dataIndex: "locatorId",
                    type: "select",
                    enum: locatorData || []
                }
            ] : [{
                title: "拒收原因",
                dataIndex: "remark",
                type: "textarea"
            }]}
            dataSource={{ warehouseName: data?.warehouseName }} />
    </Spin>

})

export default function Overview() {
    const receiveRef = useRef<{ onSubmit: () => Promise<boolean> }>()
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({ receiveStockId: params.id })
    const [attchType, setAttachType] = useState<1 | 2>(1)
    const [detailId, setDetailId] = useState<string[]>([])
    const [receiveStockId, setReceiveStockId] = useState<string>("")
    const [saveLoding, setSaveLoading] = useState<boolean>(false)

    // 统计数量
    const { data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/auxiliaryReceiveStock/detailList/summary`, {
                receiveStockId: params.id
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

    const handleAttachOk = async () => {
        setSaveLoading(true)
        try {
            const result = await receiveRef.current?.onSubmit()
            setSaveLoading(false)
            message.success(`${attchType === 1 ? "收货" : "拒收"}成功...`)
            setVisible(false)
            history.go(0)
        } catch (error) {
            setSaveLoading(false)
        }
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

    const handleSelectChange = (ids: any, selectRows: any[]) => {
        setSelectedRows(ids)
        setReceiveStockId(selectRows[0]?.receiveStockId)
    }

    return <DetailContent>
        <Modal
            destroyOnClose
            visible={visible}
            // title={attchType === 1 ? "质保单" : "质检单"}
            width={attchType === 1 ? "30%" : '60%'}
            title={attchType === 1 ? "收货" : "拒绝收货"}
            confirmLoading={saveLoding}
            onOk={handleAttachOk}
            okText="保存"
            onCancel={() => {
                setAttachType(1)
                setDetailId([])
                setReceiveStockId("")
                setVisible(false)
            }}>
            <ReceiveStrokAttach
                type={attchType}
                ids={detailId}
                receiveStockId={receiveStockId || params.id}
                ref={receiveRef} />
        </Modal>
        <Page
            path="/tower-storage/auxiliaryReceiveStock/detailList"
            exportPath={"/tower-storage/auxiliaryReceiveStock/detailList"}
            exportObject={{ receiveStockId: params.id }}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            searchFormItems={[]}
            extraOperation={<>
                <Button type="primary"
                    ghost
                    disabled={!(selectedRows.length > 0)}
                    onClick={() => {
                        setAttachType(1)
                        setDetailId(selectedRows)
                        setVisible(true)
                    }}
                >批量收货</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                <span style={{ marginLeft: "20px" }}>
                    已收货：数量合计：<span
                        style={{
                            color: "#FF8C00",
                            marginRight: 12
                        }}>
                        {userData?.receiveNum === -1 ? 0 : userData?.receiveNum}</span>
                    含税金额(元)合计：<span
                        style={{
                            color: "#FF8C00",
                            marginRight: 12
                        }}>{userData?.receiveTotalTaxAmount === -1 ? 0 : userData?.receiveTotalTaxAmount}</span>
                    待收货：数量合计：<span
                        style={{
                            color: "#FF8C00",
                            marginRight: 12
                        }}> {userData?.waitReceiveNum === -1 ? 0 : userData?.waitReceiveNum}</span>
                    含税金额(元)合计：<span
                        style={{
                            color: "#FF8C00",
                            marginRight: 12
                        }}>{userData?.waitReceiveTotalTaxAmount === -1 ? 0 : userData?.waitReceiveTotalTaxAmount}</span>
                </span>
            </>}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedRows,
                    onChange: handleSelectChange,
                    getCheckboxProps: (records: any) => [1, 2].includes(records.receiveDetailStatus)
                }
            }}
            columns={[
                ...CargoDetails as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_: any, records: any) => <>
                        <Button
                            type="link"
                            disabled={records.receiveDetailStatus !== 0}
                            onClick={() => {
                                setAttachType(1)
                                setDetailId([records.id])
                                setReceiveStockId(records.receiveStockId)
                                setVisible(true)
                            }}>收货</Button>
                        <Button
                            type="link"
                            disabled={records.receiveDetailStatus !== 0}
                            onClick={() => {
                                setAttachType(2)
                                setDetailId([records.id])
                                setReceiveStockId(records.receiveStockId)
                                setVisible(true)
                            }}
                        >拒收</Button>
                    </>
                }
            ]}
        />
    </DetailContent>
}