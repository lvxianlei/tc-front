import React, { useState } from "react"
import { Button, Spin, Tabs } from 'antd'
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { bidInfoColumns, billingInformationStatistics, overview } from "./bidResult.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ExportList from '../../../components/export/list';
import { exportDown } from "../../../utils/Export";
interface OverviewProps {
    id: string
}

export default function Overview({ id }: OverviewProps) {
    const history = useHistory()
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false);
    const [round, setRound] = useState<number>(0); // 轮数
    const { loading, data } = useRequest<{ result: any, statistics: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${id}`)
            const statistics: any = await RequestUtil.get(`/tower-market/bidBase/statistics/${id}`)
            resole({ result, statistics: statistics?.map(((item: any, index: number) => ({ ...item, key: index }))) || [] })
        } catch (error) {
            reject(error)
        }
    }))

    const handleChange = (activeKey: any) => {
        setRound(data?.result?.bidOpenRecordListVos[activeKey].round)
    }
    return <DetailContent operation={[
        <Button key="goEdit" type="primary" style={{ marginRight: 16 }}
            disabled={`${data?.result.isLock}` === "2"}
            onClick={() => history.push(`/project/management/edit/bidResult/${id}`)}>编辑</Button>,
        <Button key="goback" onClick={() => history.goBack()}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" style={{ padding: "0 0 8px 0", }} />
            <BaseInfo columns={overview} dataSource={data?.result || {}} col={2} />
            <DetailTitle title="开标信息" operation={[
                <Button type="primary" key="bidInfo" ghost onClick={() => {
                    exportDown("/tower-market/bidBase/exportBidOpen", "POST", {
                        bidBaseId: data?.result.id,
                        round: round === 0 ? data?.result?.bidOpenRecordListVos[0].round : round
                    }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "开标信息")

                }}>导出</Button>
            ]} />
            <Tabs onChange={handleChange}>
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
                <Button type="primary" key="export" ghost onClick={() => setIsExportStoreList(true)}>导出</Button>
            ]} />
            <CommonTable rowKey="key" columns={billingInformationStatistics} dataSource={data?.statistics || []} />
            {isExport ? <ExportList
                history={history}
                location={location}
                match={match}
                columnsKey={() => {
                    let keys = [...billingInformationStatistics]
                    return keys
                }}
                current={1}
                size={data?.statistics.length}
                total={data?.statistics.length}
                url={`/tower-market/bidBase/statistics/${id}`}
                serchObj={{}}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </Spin>
    </DetailContent>
}