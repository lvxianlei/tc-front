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
const dataww = [
    {
      "name": "China",
      "year": "2000",
      "gdp": 1211346869605.24
    },
    {
      "name": "China",
      "year": "2001",
      "gdp": 1339395718865.3
    },
    {
      "name": "China",
      "year": "2002",
      "gdp": 1470550015081.55
    },
    {
      "name": "Russian",
      "year": "2004",
      "gdp": 591016690742.8
    },
    {
      "name": "Russian",
      "year": "2005",
      "gdp": 764017107992.39
    },
    {
      "name": "Russian",
      "year": "2006",
      "gdp": 989930542278.7
    },
    {
      "name": "Russian",
      "year": "2007",
      "gdp": 1299705764823.62
    },
    {
      "name": "Russian",
      "year": "2008",
      "gdp": 1660846387624.78
    },
]
/***
 * 折线图的横轴是xField控制，纵轴是yField，区分两条折线是seriesField控制（需配合后台完成）
 */
export default function HistoryPrice({ id, name }: HistoryPriceProps): JSX.Element {
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/materialPrice/history/${id}`)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }))
    const config: any = {
        padding: 'auto',
        hight: 400,
        xField: 'year',
        yField: 'gdp',
        seriesField: 'name',
        point: {
            size: 5,
            shape: 'diamond',
        },
        // data: data?.map((item: any) => ({ price: item.price, updateTime: item.updateTime, id: item.updateTime + item.price })) || [],
        data: dataww
    }
    return <Spin spinning={loading}>
        <Row gutter={20}>
            <Col span={12}>
                <DetailTitle title={`${name}价格走势`} />
                <Line {...config} />
            </Col>
            <Col span={12}>
                <DetailTitle title="价格信息" />
                <CommonTable columns={historyPrice} dataSource={data || []} />
            </Col>
        </Row>
    </Spin>
}