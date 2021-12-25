import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, message, Modal, Form, DatePicker, Row, Col, Select, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, CommonTable, Attachment, AttachmentRef } from '../../common'
import { CargoDetails } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
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
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                attachTyp: type,
                id,
                receiveDetailAttachInfoDTOS: attachRef.current.getDataSource()
            })
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment title={false} dataSource={data} edit ref={attachRef} />
    </Spin>
})
export default function Edit() {
    const receiveRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [attchType, setAttachType] = useState<1 | 2>(1)
    const [detailId, setDetailId] = useState<string>("")
    const [saveLoding, setSaveLoading] = useState<boolean>(false)
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const v: any = {
                receiveStockId: params.id,
            }
            if (filterValue) {
                const formatDate = filterValue.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
                v.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
                v.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            }
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detail`, v)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(filterValue)] })
    const handleAttachOk = async () => {
        setSaveLoading(true)
        await receiveRef.current.onSubmit()
        setSaveLoading(false)
        message.success("保存成功...")
        setVisible(false)
    }
    return <DetailContent>
        <Modal
            destroyOnClose
            visible={visible}
            title="质保单"
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
        <Form form={form} onFinish={(values) => setFilterValue(values)}>
            <Row>
                <Col><Form.Item label="最新状态变更时间" name="startStatusUpdateTime"><DatePicker.RangePicker format="YYYY-MM-DD" /></Form.Item></Col>
                <Col><Form.Item label="采购状态" name="receiveStatus">
                    <Select defaultValue="全部" style={{ width: 150 }}>
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value={0}>待收货</Select.Option>
                        <Select.Option value={1}>已收货</Select.Option>
                        <Select.Option value={2}>已拒绝</Select.Option>
                    </Select>
                </Form.Item></Col>
                <Col><Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>搜索</Button>
                    <Button type="default" htmlType="reset" style={{ marginLeft: 12 }}>重置</Button>
                </Form.Item></Col>
            </Row>
        </Form>
        <Row>
            <Button type="primary" ghost>导出</Button>
            <Button type="primary" ghost onClick={() => message.warning("功能开发中...")} style={{ marginRight: 16, marginLeft: 16 }}>申请质检</Button>
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </Row>
        <Row style={{ lineHeight: "32px", fontWeight: 600 }} gutter={10}>
            <Col>已收货：重量(支)合计：{data?.receiveStockMessage.receiveWeight === -1 ? 0 : data?.receiveStockMessage.receiveWeight}</Col>
            <Col>价税合计(元)合计：{data?.receiveStockMessage.receivePrice === -1 ? 0 : data?.receiveStockMessage.receivePrice}</Col>
            <Col>待收货：重量(支)合计：{data?.receiveStockMessage.waitWeight === -1 ? 0 : data?.receiveStockMessage.waitWeight}</Col>
            <Col>价税合计(元)合计：{data?.receiveStockMessage.waitPrice === -1 ? 0 : data?.receiveStockMessage.waitPrice}</Col>
        </Row>
        <CommonTable loading={loading} haveIndex columns={[...CargoDetails, {
            title: "操作",
            dataIndex: "opration",
            render: (_: any, records: any) => <>
                <a onClick={() => {
                    setAttachType(1)
                    setDetailId(records.id)
                    setVisible(true)
                }}>质保单</a>
                <Button type="link" onClick={() => message.warning("功能开发中...")}>质检单</Button>
            </>
        }]} dataSource={data?.receiveStockDetailPage?.records || []} />
    </DetailContent>
}