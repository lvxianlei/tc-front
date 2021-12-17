import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, overviewInsurance as insurance, business } from "./plan.json"
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
            <BaseInfo columns={setting.map((item: any) => {
                if (item.dataIndex === "companyId") {
                    return ({
                        ...item,
                        dataIndex: "companyName"
                    })
                }
                return item
            })} dataSource={data || {}} />
            <DetailTitle title="社保公积金" />
            <CommonTable columns={insurance.map((item: any) => {
                if (["insuranceType", "effectiveMonth", "expirationMonth"].includes(item.dataIndex)) {
                    return ({
                        ...item,
                        render: (value: any, records: any, index: number) => {
                            const obj: { children: any, props: { rowSpan: number, style: any } } = {
                                children: <>{`${moment(value).format("YYYY-MM")}`}</>,
                                props: {
                                    rowSpan: 0,
                                    style: {}
                                }
                            }
                            if (index % 2 === 0) {
                                obj.props.rowSpan = 2
                                obj.props.style = index % 4 === 2 && { backgroundColor: "#F8F8F8" }
                            }
                            if (item.dataIndex === "insuranceType") {
                                obj.children = ((value || value === 0) && item.enum) ? item.enum.find((item: { value: string, label: string }) => item.value === value)?.label : value
                            }
                            return obj
                        }
                    })
                }
                return item
            })} dataSource={data?.socialSecurityList || []} />
            <DetailTitle title="商业保险" />
            <CommonTable columns={business} dataSource={data?.businessList || []} />
        </Spin>
    </DetailContent>
}