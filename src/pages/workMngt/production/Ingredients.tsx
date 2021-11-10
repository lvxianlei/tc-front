import React, { useState } from "react"
import { Button, message, Spin, Modal, Row, Col } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ConstructionDetails, ProductionIngredients, ComponentDetail } from "./productionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface IngredientsProps {
    id: string
}
export default function Ingredients({ id }: IngredientsProps) {

    const { loading: getIngredients, data } = useRequest<{ [key: string]: any }>((productionBatch: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/ingredients/1446312736416825345`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseTaskTower/component?purchaseTaskTowerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return <>
        <Row gutter={10}>
            <Col span={12}>生产构件明细</Col>
            <Col span={12}>采购配料方案剩余原材料</Col>
        </Row>
        <Row gutter={10}>
            <Col span={12}>
                <CommonTable haveIndex columns={ConstructionDetails} dataSource={[]} pagination={false} />
            </Col>
            <Col span={12}>
                <CommonTable columns={ComponentDetail} dataSource={[]} pagination={false} />
            </Col>
        </Row>
        <DetailTitle title="生产配料方案" />
        <CommonTable columns={ProductionIngredients} dataSource={[]} />
    </>
}