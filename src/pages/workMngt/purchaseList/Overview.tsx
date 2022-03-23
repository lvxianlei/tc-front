import React, { useState } from "react"
import { Button, Spin } from "antd"
import { CommonTable } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { baseInfo } from './TaskTower.json';
import ExportList from "../../../components/export/list"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    const history = useHistory()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/statistics/${id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <Button ghost type="primary" style={{marginBottom: 12}} onClick={() => { setIsExportStoreList(true) }}>导出</Button>
        <CommonTable haveIndex columns={baseInfo} dataSource={(data as any) || []} />
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => {
                let keys = [...baseInfo]
                return keys
            }}
            current={1}
            size={(data as any).length}
            total={(data as any).length}
            url={`/tower-supply/purchaseBatchingScheme/batcher/statistics/${id}`}
            serchObj={{}}
            closeExportList={() => { setIsExportStoreList(false) }}
        /> : null}
    </Spin>
}