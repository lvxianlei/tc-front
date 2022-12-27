import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Spin, Row, Col, InputNumber, message, Input } from "antd"
import { DetailTitle, CommonTable } from '../../common'
import { ListIngredients, PlanList } from "../purchaseList/purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { upNumber } from "../../../utils/KeepDecimals"
interface PurchasePlanProps {
    ids: string[]
}

export default forwardRef(function PurchasePlan({ ids = [] }: PurchasePlanProps, ref): JSX.Element {
    const [dataSource, setDataSource] = useState<any[]>([])
    const [count, setCout] = useState<number>(1);
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/purchase`, {
                purchaserTaskTowerIds: ids.join(","),
                materialShortageIds: ids.join(","),
                purchaseType: 3
            })
            //TODO 临时初始数据
            setDataSource(result?.lists.map((item: any) => ({
                ...item,
                planPurchaseNum: item?.planPurchaseNum || (upNumber(item.num - (item.warehouseOccupy || (item.availableStock > item.num ? item.num : item.availableStock)) + "")),
                warehouseOccupy: item.warehouseOccupy || (item.availableStock > item.num ? item.num : item.availableStock)
            })) || [])
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
    // 判断标红
    const handleData = () => {
        const result = dataSource;
        let flag = false;
        for (let i = 0; i < result.length; i += 1) {
            if (((result[i].planPurchaseNum || 0) + (result[i].warehouseOccupy || (result[i].availableStock > result[i].num ? result[i].num : result[i].availableStock))) >= result[i].num) {
                result[i]["isRed"] = false;
            } else {
                result[i]["isRed"] = true;
                flag = true;
            }
        }
        setDataSource(result.slice(0))
        return flag;
    }

    const handleSubmit = () => new Promise(async (resole, reject) => {
        try {
            const result = handleData();
            if (!result) {
                await saveRun({
                    purchaseType: 3,
                    purchaserTaskTowerIds: ids.join(","),
                    materialShortageIds: ids.join(","),
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

    useImperativeHandle(ref, () => ({ onSubmit: handleSubmit }))


    return <Spin spinning={loading}>
        <Row style={{marginBottom: 8}}>
            合并批次： {data?.mergeBatch}
        </Row>
        <div style={{
            width: "100%",
            display: "flex",
            flexWrap: "nowrap"
        }}>
            <DetailTitle title="配料方案" style={{width: 854}}/>
            <DetailTitle title="计划列表" style={{width: 200}}/>
        </div>
        <div>
            <CommonTable
                rowKey={(record: any) => `${record.materialName}${record.materialTexture}${record.structureSpec}${record.length}`}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 40,
                        render: (_a: any, _b: any, index: number): React.ReactNode => {
                            return (
                                <span>
                                    {index + 1}
                                </span>
                            )
                        }
                    },
                    ...ListIngredients.map((item: any) => {
                        if (item.dataIndex === "planPurchaseNum") {
                            return ({
                                ...item,
                                render: (_: any, record: any, index: number) => {
                                    return <InputNumber
                                        value={record.planPurchaseNum || 0}
                                        key={index}
                                        max={999}
                                        min={0}
                                        onChange={(e: any) => {
                                            const result = dataSource;
                                            result[index].planPurchaseNum = e
                                            result[index].warehouseOccupy = result[index].num>e?result[index].num-e:0
                                            setDataSource(result.slice(0));
                                            setCout(count + 1);
                                        }}
                                        style={{ width: 80, height: 27, border: record?.isRed ? "1px solid red" : "" }}
                                    />
                                }
                            })
                        }
                        // if (item.dataIndex === "warehouseOccupy") {
                        //     return ({
                        //         ...item,
                        //         render: (_: any, record: any, index: number) => {
                        //             return <Input
                        //                 value={record.warehouseOccupy || 0}
                        //                 key={index}
                        //                 // max={999}
                        //                 // min={0}
                        //                 onChange={(e: any) => {
                        //                     const result = dataSource;
                        //                     let arg = e.target.value.replace(/[^\d]/g, ""); // 清除"数字"
                        //                     if ((arg || 0) > (record.availableStock || 0)) {
                        //                         message.error("本次占用数量过多，请修改！");
                        //                         result[index].warehouseOccupy = ""
                        //                         setDataSource(result.slice(0));
                        //                     } else {
                        //                         result[index].warehouseOccupy = arg
                        //                         setDataSource(result.slice(0));
                        //                     }
                        //                     setCout(count + 1);
                        //                 }}
                        //                 style={{ width: 80, height: 27 }}
                        //             />
                        //         }
                        //     })
                        // }
                        return item;
                    })
                ]}
                dataSource={dataSource || []}
                pagination={false}
                scroll={{ y: document.documentElement.clientHeight - 320 }}
            />
        </div>
    </Spin>
})
