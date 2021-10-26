import React, { useState } from "react"
import { Result, Button, Spin } from "antd"
import { Link, useHistory, useParams } from "react-router-dom"
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common'
import { consultRecords, costBase } from '../managementDetailData.json'
import type { TabTypes } from "../ManagementDetail"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function PayInfo() {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    // const [visible, setVisible] = useState<boolean>(false)
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [askInfo, askPrice] = await Promise.all([
                RequestUtil.get(`/tower-market/askInfo?projectId=${params.id}`),
                RequestUtil.get(`/tower-market/askPrice?projectId=${params.id}`)])
            resole({ askInfo, askPrice })
        } catch (error) {
            reject(error)
        }
    }))

    return <>
        <Spin spinning={loading} >
            {!data?.askInfo?.askInfoVo && <Result style={{ paddingTop: 200 }} title="当前项目还未做成本评估" extra={
                <nav style={{ fontSize: 20 }}>
                    点击<Link to={`/project/management/new/cost/${params.id}`}>创建</Link>开始成本评估
                </nav>
            } />}
            {data?.askInfo?.askInfoVo && <DetailContent>
                <CommonTable columns={[
                    ...consultRecords
                ]} dataSource={data?.askPrice || []} />
            </DetailContent>}
        </Spin>
    </>
}