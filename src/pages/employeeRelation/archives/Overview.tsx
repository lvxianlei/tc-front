import React, { useState } from "react"
import { Button, Modal, Spin, Tabs, Image } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { baseInfo, overviewWorkExperience, family, companyInfo, other, relatives } from "./archives.json"
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
                    <BaseInfo columns={baseInfo.map((item: any) => {
                        if (item.dataIndex === "image") {
                            return ({
                                ...item,
                                render: (dataSource: any) => {
                                    return <Image width={48} src={dataSource.image} alt="" />
                                }
                            })
                        }
                        if (item.dataIndex === "bankNameId") {
                            return ({ ...item, type: "string", dataIndex: "bankName" })
                        }
                        return item
                    })} dataSource={data || {}} />
                    <DetailTitle title="公司信息" />
                    <BaseInfo columns={companyInfo.map((item: any) => {
                        if (item.dataIndex === "postType") {
                            return ({
                                ...item, dataIndex: "postTypeName"
                            })
                        }
                        return item
                    })} dataSource={data || {}} />
                    <DetailTitle title="其他信息" />
                    <BaseInfo columns={other} dataSource={data || {}} />
                    <Attachment dataSource={data?.fileVos} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="工作经历" key="work">
            <DetailContent operation={[
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="工作经历" />
                    <CommonTable columns={overviewWorkExperience} dataSource={data instanceof Array ? data : []} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="家庭情况" key="family">
            <DetailContent operation={[
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="家庭情况" />
                    <CommonTable columns={family} dataSource={data instanceof Array ? data : []} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="公司亲属" key="employee">
            <DetailContent operation={[
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="公司亲属" />
                    <CommonTable columns={relatives} dataSource={data instanceof Array ? data : []} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
    </Tabs>
}