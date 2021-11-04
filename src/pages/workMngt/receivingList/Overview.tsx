import React, { useState } from "react"
import { Button, message, Spin, Form, DatePicker, Row, Col } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Page } from '../../common'
import { CargoDetails } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
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
        <CommonTable columns={CargoDetails} dataSource={data?.ReceiveStockDetailPage.records || []} />
    </DetailContent>
}