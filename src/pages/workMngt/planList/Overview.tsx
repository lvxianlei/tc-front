import React, { useState } from "react"
import { Button, Row } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, CommonTable, Page } from '../../common'
import { PurchaseList, PurchaseTypeStatistics } from "./planListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [filterValue, setFilterValue] = useState()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: purchasePlanLoading, data: purchasePlanData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/total/${params.id}`)
            const total: { [key: string]: any } = await RequestUtil.get(`tower-supply/materialPurchasePlan/list/mesg/${params.id}`)
            resole({ data: result, total })
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent title={[
        <Button key="export" type="primary" ghost>导出</Button>
    ]} operation={[<Button key="" type="primary" ghost onClick={() => history.goBack()}>返回</Button>]}>
        <Page
            path={`/tower-supply/materialPurchasePlan/list/${params.id}`}
            columns={PurchaseList}
            filterValue={filterValue}
            searchFormItems={[]}
        />
        <span>
            {` 采购类型统计： 圆钢总重（t）：${purchasePlanData?.total?.roundSteelTotal === -1 ? "0" : purchasePlanData?.total?.roundSteelTotal}    角钢总重（t）：${purchasePlanData?.total?.angleSteelTotal === -1 ? "0" : purchasePlanData?.total?.angleSteelTotal}        钢板总重（t）：${purchasePlanData?.total?.steelPlateTotal === -1 ? "0" : purchasePlanData?.total?.steelPlateTotal}`}
        </span>
        <CommonTable loading={purchasePlanLoading} columns={PurchaseTypeStatistics} dataSource={purchasePlanData?.data || []} />
    </DetailContent>
}