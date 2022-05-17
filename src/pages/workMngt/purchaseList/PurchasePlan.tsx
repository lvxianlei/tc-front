import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Spin, Row, Col, InputNumber } from "antd"
import { DetailTitle, CommonTable } from '../../common'
import { ListIngredients, PlanList } from "./purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface PurchasePlanProps {
    ids: string[]
}
interface Values {
    index?: number;
    value?: number;
}
export default forwardRef(function PurchasePlan({ ids = [] }: PurchasePlanProps, ref): JSX.Element {
    const [dataSource, setDataSource] = useState<any[]>([])
    let [number, setNumber] = useState<number>(1);
    let [values, setValues] = useState<Values>({});
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchase?purchaserTaskTowerIds=${ids.join(",")}&purchaseType=1`)
            resole(result)
            //TODO 临时初始数据
            setDataSource(result?.lists.map((item: any) => ({ ...item, planPurchaseNum: 0 })) || [])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [JSON.stringify(ids)] })

    const { loading: confirmLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan`, { ...data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        if (JSON.stringify(values) !== "{}") {
            let result = dataSource;
            result[(values["index"] as any)].planPurchaseNum = values.value;
            setDataSource(result.slice(0));
        }
    }, [number])

    const handleSubmit = () => new Promise(async (resole, reject) => {
        try {
            await saveRun({
                purchaseType: 2,
                purchaserTaskTowerIds: ids.join(","),
                lists: dataSource
            })
            resole(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit: handleSubmit, confirmLoading }), [handleSubmit, confirmLoading])

    return <Spin spinning={loading}>
        <Row gutter={10}>
            <Col span={12}>
                <DetailTitle title="配料方案" />
                <CommonTable haveIndex
                    rowKey={(record: any) => `${record.materialName}${record.materialTexture}${record.structureSpec}${record.length}`}
                    columns={ListIngredients} dataSource={data?.lists || []} pagination={false} />
            </Col>
            <Col span={12}>
                <DetailTitle title="计划列表" />
                <CommonTable
                    rowKey={(record: any) => `${record.materialName}${record.materialTexture}${record.structureSpec}${record.length}`}
                    columns={PlanList.map((item: any) => {
                        if (item.dataIndex === "purchasePlanNumber") {
                            return ({
                                ...item,
                                render: (_: any, record: any, index: number) => {
                                    return <InputNumber
                                        value={record.purchasePlanNumber}
                                        key={index}
                                        max={999}
                                        min={0}
                                        onChange={(value: number) => {
                                            setNumber(++number)
                                            setValues({
                                                index,
                                                value: value ? value : 0
                                            })
                                        }} style={{ height: 27 }} />
                                }
                            })
                        }
                        return item
                    })}
                    dataSource={dataSource || []}
                    pagination={false} />
            </Col>
        </Row>
    </Spin>
})