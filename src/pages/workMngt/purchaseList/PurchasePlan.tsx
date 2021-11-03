import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Spin, Row, Col, InputNumber } from "antd"
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ListIngredients, PlanList } from "./purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface PurchasePlanProps {
    ids: string[]
}
export default forwardRef(function PurchasePlan({ ids = [] }: PurchasePlanProps, ref): JSX.Element {
    const [dataSource, setDataSource] = useState<any[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchase?purchaserTaskTowerIds=${ids.join(",")}&purchaseType=1`)
            setDataSource(result?.list || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(ids)] })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme`, { ...data })
            setDataSource(result?.list || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleInputChange = (event: any, index: number) => {
        setDataSource(dataSource.map((item: any, dataIndex: number) => dataIndex === index ? ({ ...item, purchasePlanNumber: event }) : item))
    }
    const handleSubmit = () => {
        console.log("save", dataSource)
    }
    useImperativeHandle(ref, () => ({ onSubmit: handleSubmit }))

    return <Spin spinning={loading}>
        <Row gutter={10}>
            <Col span={12}>
                <DetailTitle title="配料方案" />
                <CommonTable columns={ListIngredients} dataSource={data?.list || []} pagination={false} />
            </Col>
            <Col span={12}>
                <DetailTitle title="计划列表" />
                <CommonTable columns={PlanList.map((item: any) => {
                    if (item.dataIndex === "purchasePlanNumber") {
                        return ({
                            ...item,
                            render: (_: any, record: any, index: number) => {
                                return <InputNumber key={index} onChange={(value: number) => handleInputChange(value, index)} style={{ height: 27 }} />
                            }
                        })
                    }
                    return item
                })} dataSource={dataSource || []} pagination={false} />
            </Col>
        </Row>
    </Spin>
})