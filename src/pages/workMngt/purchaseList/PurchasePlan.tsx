import React from "react"
import { Spin, Row, Col } from "antd"
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ListIngredients, PlanList } from "./purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface PurchasePlanProps {
    ids: string[]
}
export default function PurchasePlan({ ids = [] }: PurchasePlanProps): JSX.Element {
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher?purchaserTaskTowerIds=${ids.join(",")}&purchaseType=1`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(ids)] })

    return <Spin spinning={loading}>
        <DetailContent>
            <Row>
                <Col span={12}>
                    <DetailTitle title="配料方案" />
                    <CommonTable columns={ListIngredients} dataSource={data || []} />
                </Col>
                <Col span={12}>
                    <DetailTitle title="计划列表" />
                    <CommonTable columns={PlanList} dataSource={data || []} />
                </Col>
            </Row>
        </DetailContent>
    </Spin>
}