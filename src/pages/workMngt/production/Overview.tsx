import React, { useState } from "react"
import { Button, message, Spin, Modal, Row, Col } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ConstructionDetails, ProductionIngredients, ComponentDetail } from "./productionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Overview() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const params = useParams<{ id: string }>()

    const { loading, data } = useRequest<{ detail: any[], programme: any[] }>(() => new Promise(async (resole, reject) => {
        try {
            const detail: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/detail/${params.id}`)
            const programme: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/programme/${params.id}`)
            resole({ detail, programme })
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: getIngredients, run: getIngredientsRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/detail/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseTaskTower/component?purchaseTaskTowerId=${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleModelOk = () => {
        setVisible(false)
    }

    return <>
        <Modal title="配料" width={1011} visible={visible} onCancel={() => setVisible(false)} onOk={handleModelOk}>
            <Row gutter={10}>
                <Col span={12}>生产构件明细</Col>
                <Col span={12}>采购配料方案剩余原材料</Col>
            </Row>
            <Row gutter={10}>
                <Col span={12}>
                    <CommonTable columns={ConstructionDetails} dataSource={data?.detail || []} pagination={false} />
                </Col>
                <Col span={12}>
                    <CommonTable columns={ComponentDetail} dataSource={data?.detail || []} pagination={false} />
                </Col>
            </Row>
            <DetailTitle title="生产配料方案" />
            <CommonTable columns={ProductionIngredients} dataSource={[]} />
        </Modal>
        <DetailContent title={[
            <Button key="export" type="primary" style={{ marginRight: 16 }}>导出</Button>,
            <Button key="peiliao" type="primary" ghost onClick={() => setVisible(true)} style={{ marginRight: 16 }}>配料</Button>
        ]} operation={[
            <Button type="primary" ghost key="cancel" onClick={() => history.go(-1)}>返回</Button>
        ]}>
            <Spin spinning={loading}>
                <CommonTable columns={ConstructionDetails.map((item: any) => {
                    if (item.dataIndex === "alreadyIngredients") {
                        return ({
                            ...item,
                            render: (text: any, records: any) => {
                                const formatText = [-1, "-1", 0, "0"].includes(text) ? "0" : text
                                const formatNoIngredients = [-1, "-1", 0, "0"].includes(records.noIngredients) ? "0" : records.noIngredients
                                return <>{formatText} / {formatNoIngredients}</>
                            }
                        })
                    }
                    return item
                })} dataSource={data?.detail || []} />
                <DetailTitle title="生产配料方案" />
                <CommonTable columns={ProductionIngredients} dataSource={data?.programme || []} />
            </Spin>
        </DetailContent>
    </>
}