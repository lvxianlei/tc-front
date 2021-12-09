import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, insurance, business } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ archiveId: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insuranceArchives/detail?id=${params.archiveId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    return <DetailContent operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
        <Spin spinning={loading}>
            <DetailTitle title="员工保险档案" />
            <BaseInfo columns={setting} dataSource={data || {}} />
            <DetailTitle title="社保公积金" />
            <BaseInfo columns={insurance} dataSource={data || {}} />
            <DetailTitle title="商业保险方案" />
            <CommonTable columns={business} dataSource={data?.businesss || []} />
        </Spin>
    </DetailContent>
}