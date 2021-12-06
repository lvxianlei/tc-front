import React, { useState } from "react"
import { Button, Spin, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { baseInfo, workExperience, family, relatives } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
type TabTypes = "baseInfo" | "family" | "employee" | "work"
const tabPaths: { [key in TabTypes]: string } = {
    baseInfo: "/tower-hr/employee/archives/detail",
    family: "/tower-hr/employee/archives/family",
    employee: "/tower-hr/employee/archives/relatives",
    work: "/tower-hr/employee/archives/work/experience"
}
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ archiveId: string }>()
    const [activeTab, setActiveTab] = useState<TabTypes>("baseInfo")
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`${tabPaths[activeTab]}?employeeId=${params.archiveId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [activeTab] })
    return <Tabs type="card" onChange={(activeKey: string) => setActiveTab(activeKey as TabTypes)}>
        <Tabs.TabPane tab="基本信息" key="baseInfo">
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
        <Tabs.TabPane tab="工作经历" key="work">
            <DetailContent operation={[

                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="工作经历" />
                    <CommonTable columns={workExperience} dataSource={[]} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="家庭情况" key="family">
            <DetailContent operation={[

                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="家庭情况" />
                    <CommonTable columns={family} dataSource={[]} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="公司亲属" key="employee">
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