import React, { useState } from "react"
import { Button, Spin, Row } from 'antd'
import { CurrentPriceInformation } from "./enquiryTask.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { CommonTable, DetailTitle } from "../common"
interface OverviewProps {
    id: string
}
export default function ({ id }: OverviewProps) {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/taskResult/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <DetailTitle title="当前价格信息" />
        <CommonTable columns={CurrentPriceInformation} dataSource={data?.materialDetails || []} />
        <Row style={{ backgroundColor: "#f1f1f1", minHeight: 40, padding: 10 }}>{data?.inquirerDescription}</Row>
        <DetailTitle title="附件" />
        <CommonTable columns={[
            {
                title: "文件名称",
                dataIndex: "name"
            },
            {
                title: "操作", dataIndex: "opration", render: (_: any, records: any) => <>
                    <Button type="link">下载</Button>
                </>
            }
        ]} dataSource={data?.inquirerAttachList || []} />
    </Spin>
}