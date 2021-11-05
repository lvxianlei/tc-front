import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailTitle, CommonTable, BaseInfo } from '../../common'
import { billinformation, operation } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const history = useHistory()
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1210"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <Spin spinning={loading}>
        <DetailTitle title="票据信息" />
        <BaseInfo columns={billinformation.map((item: any) => {
            if (item.dataIndex === "invoiceType") {
                return ({ ...item, type: "select", enum: invoiceTypeEnum })
            }
            return item
        })} dataSource={data || {}} />
        <DetailTitle title="相关附件" />
        <CommonTable
            columns={[{
                title: "名称",
                dataIndex: "name",
                width: 300
            },
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link">查看</Button>
                </>
            }]}
            dataSource={data?.invoiceAttachInfoVos}
            showHeader={false}
        />
        <DetailTitle title="操作信息" />
        <CommonTable columns={operation} dataSource={data?.operationRecordInfoVos} />
    </Spin>
}