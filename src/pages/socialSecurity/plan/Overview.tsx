import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, insurance, business } from "./plan.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import moment from "moment"
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ planId: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insurancePlan/detail?id=${params.planId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    return <DetailContent operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={setting} dataSource={data || {}} />
            <DetailTitle title="社保公积金" />
            <CommonTable columns={insurance.map((item: any) => {
                if (item.dataIndex === "effectiveMonth") {
                    return ({
                        ...item,
                        render: (value: any, records: any) => <>{`${moment(value).format("YYYY-MM-DD")}~${moment(records.expirationMonth).format("YYYY-MM-DD")}`}</>
                    })
                }
                return item
            })} dataSource={data?.socialSecurityList || []} />
            <DetailTitle title="商业保险" />
            <CommonTable columns={business} dataSource={data?.businessList || []} />
        </Spin>
    </DetailContent>
}