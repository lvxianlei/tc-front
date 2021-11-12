import React, { useState } from "react"
import { Button, message, Modal, Form, DatePicker, Row, Col } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, CommonTable } from '../../common'
import { CargoDetails } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detail`, {
                receiveStockId: params.id,
                ...filterValue
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(filterValue)] })

    return <DetailContent>
        <Modal visible={visible} title="质保单" onCancel={() => setVisible(false)}>

        </Modal>
        <Form form={form} onFinish={(values) => setFilterValue(values)}>
            <Row>
                <Col><Form.Item label="最新状态变更时间" name="startPurchaseStatusUpdateTime"><DatePicker.RangePicker format="YYYY-MM-DD" /></Form.Item></Col>
                <Col><Form.Item label="采购状态" name="startPurchaseStatus"><DatePicker.RangePicker format="YYYY-MM-DD" /></Form.Item></Col>
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
        <Row style={{ lineHeight: "32px", fontWeight: 600 }}>已收货：重量(支)合计：{data?.receiveStockMessage.receiveWeight}     价税合计(元)合计：{data?.receiveStockMessage.receivePrice}   待收货：重量(支)合计：{data?.receiveStockMessage.waitWeight}     价税合计(元)合计：{data?.receiveStockMessage.waitPrice}</Row>
        <CommonTable loading={loading} haveIndex columns={[...CargoDetails, {
            title: "操作",
            dataIndex: "opration",
            render: () => <>
                <a onClick={() => {
                    setVisible(true)
                }}>质保单</a>
                <Button type="link" onClick={() => message.warning("功能开发中...")}>质检单</Button>
            </>
        }]} dataSource={data?.receiveStockDetailPage?.records || []} />
    </DetailContent>
}