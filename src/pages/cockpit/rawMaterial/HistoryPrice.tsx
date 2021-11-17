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
        xField: 'updateTime',
        yField: 'price',
        point: {
            size: 5,
            shape: 'diamond',
        },
        data: data?.map((item: any) => ({ price: item.price, updateTime: item.updateTime, id: item.updateTime + item.price })) || [],
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