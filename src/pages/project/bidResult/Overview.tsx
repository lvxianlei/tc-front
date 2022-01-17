import React from "react"
import { Button, Spin, Tabs } from 'antd'
import { useHistory, } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { bidInfoColumns, billingInformationStatistics, overview } from "./bidResult.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface OverviewProps {
    id: string
}

export default function Overview({ id }: OverviewProps) {
    const history = useHistory()
    const { loading, data } = useRequest<{ result: any, statistics: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${id}`)
            const statistics: any = await RequestUtil.get(`/tower-market/bidBase/statistics/${id}`)
            resole({ result, statistics })
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="goEdit" type="primary" style={{ marginRight: 16 }}
            onClick={() => history.push(`/project/management/edit/bidResult/${id}`)}>编辑</Button>,
        <Button key="goback" onClick={() => history.replace("/project/management")}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" style={{ padding: "0 0 8px 0", }} />
            <BaseInfo columns={overview} dataSource={data?.result || {}} col={2} />
            <DetailTitle title="开标信息" />
            <Tabs>
                {data?.result?.bidOpenRecordListVos?.length > 0 && data?.result?.bidOpenRecordListVos.map((item: any, index: number) => <Tabs.TabPane key={index}
                    tab={item.roundName}>
                    <CommonTable columns={bidInfoColumns} dataSource={item.bidOpenRecordVos || []} />
                </Tabs.TabPane>)
                }
                {(!(data?.result?.bidOpenRecordListVos?.length > 0) || (data?.result?.bidOpenRecordListVos?.length > 0 && data?.result?.bidOpenRecordListVos[data?.result?.bidOpenRecordListVos.length - 1].round !== 1)) && <Tabs.TabPane tab="第 1 轮">
                    <CommonTable columns={bidInfoColumns} dataSource={[]} />
                </Tabs.TabPane>}
            </Tabs>
            <DetailTitle title="开标信息统计" operation={[
                <Button type="primary" ghost>导出</Button>
            ]} />
            <CommonTable columns={billingInformationStatistics} dataSource={data?.statistics || []} />
        </Spin>
    </DetailContent>
}