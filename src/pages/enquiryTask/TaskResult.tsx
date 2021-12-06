import React from "react"
import { Button, Spin, Row } from 'antd'
import { CurrentPriceInformation } from "./enquiryTask.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { CommonTable, DetailTitle, Attachment } from "../common"
import { downLoadFile } from "../../utils"
interface OverviewProps {
    id: string
}
/**
 * 添加 （需后台提供字段）
 * 
    {
        "title": "材质",
        "dataIndex": "materialSpec"
    },
 */
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
        <CommonTable columns={[
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...CurrentPriceInformation
        ]} dataSource={data?.materialDetails || []} />
        <Row style={{ backgroundColor: "#f1f1f1", minHeight: 40, padding: 10 }}>{data?.inquirerDescription}</Row>
        <DetailTitle title="附件" />
        <Attachment dataSource={data?.inquirerAttachList || []} />
    </Spin>
}