import React, { useState } from "react"
import { Button } from 'antd'
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom'
import { DetailContent, CommonTable, Page } from '../../common'
import { PurchaseList, PurchaseTypeStatistics } from "./planListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ExportList from '../../../components/export/list';
interface PagenationProps {
    current: number
    pageSize: number
}
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [filterValue, setFilterValue] = useState()
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
    const paginationChange = (page: number, pageSize: number) => {
        run(page, pageSize)
    }
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

    const { loading: loadingTable, data: dataTable, run } = useRequest<{ [key: string]: any }>((current = 1, size = 10) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/${params.id}`, {
                current: current,
                size: size
            })
            resole(result)
            setPagenation({ ...pagenation, current: result.page, pageSize: result.size })
        } catch (error) {
            reject(error)
        }
    }))
    return (
        <>
            <DetailContent title={[
                <Button key="export" type="primary" ghost onClick={() => { setIsExportStoreList(true) }} style={{ marginBottom: 16 }}>导出</Button>
            ]} operation={[<Button key="" type="ghost" onClick={() => history.goBack()}>返回</Button>]}>
                {/* <Page
                    path={`/tower-supply/materialPurchasePlan/list/${params.id}`}
                    columns={PurchaseList}
                    filterValue={filterValue}
                    searchFormItems={[]}
                /> */}
                <CommonTable
                    loading={purchasePlanLoading}
                    columns={PurchaseList}
                    dataSource={dataTable?.records || []}
                    pagination={{
                        size: "small",
                        pageSize: pagenation.pageSize,
                        onChange: paginationChange,
                        current: pagenation.current,
                        total: dataTable?.total
                    }}
                />
                <div style={{ marginBottom: 12 }}>
                    采购类型统计： 圆钢总重（t）：<span style={{ color: "#FF8C00" }}>{purchasePlanData?.total?.roundSteelTotal === -1 ? "0" : purchasePlanData?.total?.roundSteelTotal}</span>
                    <span style={{ margin: "0px 12px" }}>角钢总重（t）：<span style={{ color: "#FF8C00" }}>{purchasePlanData?.total?.angleSteelTotal === -1 ? "0" : purchasePlanData?.total?.angleSteelTotal}</span></span>
                    钢板总重（t）：<span style={{ color: "#FF8C00" }}>{purchasePlanData?.total?.steelPlateTotal === -1 ? "0" : purchasePlanData?.total?.steelPlateTotal}</span>
                </div>
                <CommonTable loading={purchasePlanLoading} columns={PurchaseTypeStatistics} dataSource={purchasePlanData?.data || []} />
            </DetailContent>
            {isExport ? <ExportList
                history={history}
                location={location}
                match={match}
                columnsKey={() => {
                    let keys = [...PurchaseList]
                    return keys
                }}
                current={purchasePlanData?.current || 1}
                size={dataTable?.records.length || 10}
                total={dataTable?.records.length || 0}
                url={`/tower-supply/materialPurchasePlan/list/${params.id}`}
                serchObj={{}}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </>
    )
}