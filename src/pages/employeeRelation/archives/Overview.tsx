import React from "react"
import { Button, Spin, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { baseInfo, workExperience, family, relatives } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ invoicingId: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/invoicing/getInvoicingInfo/${params.invoicingId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    return <Tabs type="card">
        <Tabs.TabPane tab="基本信息" key="1">
            <DetailContent operation={[
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="基本信息" />
                    <BaseInfo columns={baseInfo} dataSource={data || {}} />
                    <Attachment />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="工作经历" key="2">
            <DetailContent operation={[

                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="工作经历" />
                    <CommonTable columns={workExperience} dataSource={[]} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="家庭情况" key="3">
            <DetailContent operation={[

                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="家庭情况" />
                    <CommonTable columns={family} dataSource={[]} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="公司亲属" key="4">
            <DetailContent operation={[

                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="公司亲属" />
                    <CommonTable columns={relatives} dataSource={[]} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
    </Tabs>
}