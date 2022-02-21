import React from "react"
import { Spin, Row, Col } from "antd"
import { Line } from '@ant-design/charts'
import { historyPrice } from "./rawMaterial.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { CommonTable, DetailTitle } from "../../common"
interface HistoryPriceProps {
    id: string
    name: string
}

interface LineItem {
  bidder?: string
  price?: string
  priceSource?: string
  updateTime?: string
}
interface LineChart {
  materialPriceHistoryListVOS?: LineItem[]
  materialPriceHistoryWebListVOS?: LineItem[]
}
/***
 * 折线图的横轴是xField控制，纵轴是yField，区分两条折线是seriesField控制
 */
export default function HistoryPrice({ id, name }: HistoryPriceProps): JSX.Element {
    const { loading, data } = useRequest<LineChart>(() => new Promise(async (resove, reject) => {
        try {
            const result: LineChart[] = await RequestUtil.get(`/tower-supply/materialPrice/history/${id}`)
            // 报价信息
            const materialPriceHistoryListVOS = (result as any)?.materialPriceHistoryListVOS || []
            const materialPriceHistoryWebListVOS = (result as any)?.materialPriceHistoryWebListVOS || []
            const v:any = [];
            for (let i = 0; i < materialPriceHistoryListVOS.length; i += 1) {
              v.push({
                ...materialPriceHistoryListVOS[i],
                name: "报价信息"
              })
            }
            for (let i = 0; i < materialPriceHistoryWebListVOS.length; i += 1) {
              v.push({
                ...materialPriceHistoryWebListVOS[i],
                name: "网站信息"
              })
            }
            resove(v)
        } catch (error) {
            reject(error)
        }
    }))
    const config: any = {
        padding: 'auto',
        hight: 400,
        xField: 'updateTime',
        yField: 'price',
        seriesField: 'name',
        point: {
            size: 5,
            shape: 'diamond',
        },
        // data: data?.map((item: any) => ({ price: item.price, updateTime: item.updateTime, id: item.updateTime + item.price })) || [],
        data: data || []
    }
    return <Spin spinning={loading}>
        <Row gutter={20}>
            <Col span={12}>
                <DetailTitle title={`${name}价格走势`} />
                <Line {...config} />
            </Col>
            <Col span={12}>
                <DetailTitle title="价格信息" />
                <CommonTable columns={historyPrice} dataSource={(data as any) || []} />
            </Col>
        </Row>
    </Spin>
}