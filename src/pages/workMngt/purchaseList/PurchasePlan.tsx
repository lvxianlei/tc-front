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
    let [count, setCout] = useState<number>(1);
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchase?purchaserTaskTowerIds=${ids.join(",")}&purchaseType=1`)
            resole(result)
            //TODO 临时初始数据
            setDataSource(result?.lists.map((item: any) => ({
                ...item,
                planPurchaseNum: item?.planPurchaseNum || 1,
                warehouseOccupy: item?.warehouseOccupy || 1
            })) || [])
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

    const handleSubmit = () => new Promise(async (resole, reject) => {
        try {
            const result = handleData();
            if (!result) {
                // 可以保存
                await saveRun({
                    purchaseType: 1,
                    purchaserTaskTowerIds: ids.join(","),
                    purchasePlanDetailDTOS: dataSource
                })
                resole(true)
            }
        } catch (error) {
            reject(false)
        }
    })

    useEffect(() => {
        if (count !== 1) {
            handleData();
        }
    }, [JSON.stringify(dataSource)])

    // 判断标红
    const handleData = () => {
        const result = dataSource;
        let flag = false;
        for (let i = 0; i < result.length; i += 1) {
            if (((result[i].planPurchaseNum || 0) + (result[i].warehouseOccupy || 0)) >= result[i].num) {
                result[i]["isRed"] = false;
            } else {
                result[i]["isRed"] = true;
                flag = true;
            }
        }
        setDataSource(result.slice(0))
        return flag;
    }

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
                        if (item.dataIndex === "planPurchaseNum") {
                            return ({
                                ...item,
                                render: (_: any, record: any, index: number) => {
                                    return <InputNumber
                                        value={record.planPurchaseNum}
                                        key={index}
                                        max={999}
                                        min={0}
                                        onChange={(e: any) => {
                                            const result = dataSource;
                                            result[index].planPurchaseNum = e
                                            setDataSource(result.slice(0));
                                            setCout(count + 1);
                                        }}
                                        style={{ height: 27, border: record?.isRed ? "1px solid red" : ""  }}
                                    />
                                }
                            })
                        }
                        if (item.dataIndex === "warehouseOccupy") {
                            return ({
                                ...item,
                                render: (_: any, record: any, index: number) => {
                                    return <InputNumber
                                        value={record.warehouseOccupy}
                                        key={index}
                                        max={999}
                                        min={0}
                                        onChange={(e: any) => {
                                            const result = dataSource;
                                            result[index].warehouseOccupy = e
                                            setDataSource(result.slice(0));
                                            setCout(count + 1);
                                        }}
                                        style={{ height: 27}}
                                    />
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