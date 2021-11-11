import React from "react"
import { Button, Row } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, CommonTable } from '../../common'
import { PurchaseList, PurchaseTypeStatistics } from "./planListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: purchasePlanLoading, data: purchasePlanData } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/total/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent title={[
        <Button key="export" type="primary" ghost>导出</Button>
    ]} operation={[<Button key="" type="primary" ghost onClick={() => history.goBack()}>返回</Button>]}>
        <CommonTable loading={loading} columns={PurchaseList} dataSource={data?.records || []} />
        <span>
            {` 采购类型统计： 圆钢总重（t）：0     角钢总重（t）：66.473         钢板总重（t）：234.000`}
        </span>
        <CommonTable loading={purchasePlanLoading} columns={PurchaseTypeStatistics} dataSource={purchasePlanData || []} />
    </DetailContent>
}