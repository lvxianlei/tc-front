import React from "react"
import { Spin, Row, Col, Input } from "antd"
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ListIngredients, PlanList } from "./purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface PurchasePlanProps {
    ids: string[]
}
export default function PurchasePlan({ ids = [] }: PurchasePlanProps): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchase?purchaserTaskTowerIds=${ids.join(",")}&purchaseType=1`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(ids)] })

    return <Spin spinning={loading}>
        <DetailContent>
            <Row gutter={10}>
                <Col span={12}>
                    <DetailTitle title="配料方案" />
                    <CommonTable columns={ListIngredients} dataSource={data?.list || []} />
                </Col>
                <Col span={12}>
                    <DetailTitle title="计划列表" />
                    <CommonTable columns={PlanList.map((item: any) => {
                        if (item.dataIndex === "purchasePlanNumber") {
                            return ({
                                ...item,
                                render: (_: any) => {
                                    return <Input style={{ height: 27 }} />
                                }
                            })
                        }
                        return item
                    })} dataSource={data?.list || []} />
                </Col>
            </Row>
        </DetailContent>
    </Spin>
}