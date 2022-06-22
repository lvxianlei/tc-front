import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Spin, Row, Col, InputNumber } from "antd"
import { DetailTitle, CommonTable } from '../../common'
import { ListIngredients, PlanList } from "../purchaseList/purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface PurchasePlanProps {
    ids: string[]
}

export default forwardRef(function PurchasePlan({ ids = [] }: PurchasePlanProps, ref): JSX.Element {
    const [dataSource, setDataSource] = useState<any[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchase`, {
                purchaserTaskTowerIds: ids.join(","),
                materialShortageIds: ids.join(","),
                purchaseType: 3
            })
            //TODO 临时初始数据
            setDataSource(result?.lists.map((item: any, index: number) => ({ ...item, planPurchaseNum: 0, key: `${item.structureSpec}-${index}` })) || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(ids)] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan`, { ...data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleInputChange = (event: any, fields: string, index: number) => {
        setDataSource(dataSource.map((item: any, dataIndex: number) => dataIndex === index ? ({
            ...item,
            [fields]: event
        }) : item))
    }

    const handleSubmit = () => new Promise(async (resole, reject) => {
        try {
            await saveRun({
                purchaseType: 3,
                purchaserTaskTowerIds: ids.join(","),
                materialShortageIds: ids.join(","),
                purchasePlanDetailDTOS: dataSource
            })
            resole(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit: handleSubmit }))

    return <Spin spinning={loading}>
        <Row gutter={10}>
            <Col span={12}>
                <DetailTitle title="配料列表" />
                <CommonTable haveIndex columns={ListIngredients} dataSource={data?.lists || []} pagination={false} />
            </Col>
            <Col span={12}>
                <DetailTitle title="计划列表" />
                <CommonTable columns={PlanList.map((item: any) => {
                    if (item.dataIndex === "warehouseOccupy") {
                        return ({
                            ...item,
                            render: (_: any, record: any, index: number) => {
                                return <InputNumber value={record.warehouseOccupy} key={index}
                                    onChange={(value: number) => handleInputChange(value, "warehouseOccupy", index)}
                                    style={{ height: 27 }} />
                            }
                        })
                    }
                    if (item.dataIndex === "planPurchaseNum") {
                        return ({
                            ...item,
                            render: (_: any, record: any, index: number) => {
                                return <InputNumber value={record.planPurchaseNum} key={index}
                                    onChange={(value: number) => handleInputChange(value, "planPurchaseNum", index)}
                                    style={{ height: 27 }} />
                            }
                        })
                    }
                    return item
                })} dataSource={dataSource || []} pagination={false} />
            </Col>
        </Row>
    </Spin>
})