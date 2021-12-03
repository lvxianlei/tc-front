import React, { useRef, useState } from "react"
import { Button, Spin, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment, AttachmentRef } from '../../common'
import { baseInfo, workExperience, family, relatives } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
type SaveTypes = "baseInfo" | "family" | "employee" | "work"
const saveUrlObj: { [key in SaveTypes]: string } = {
    baseInfo: "/tower-hr/insuranceArchives/save",
    family: "/tower-hr/employee/archives/family",
    employee: "/tower-hr/employee/archives/relatives",
    work: "/tower-hr/employee/archives/work/experience"
}
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ archiveId: string, type: "new" | "edit" }>()
    const attchRef = useRef<AttachmentRef>()
    const [currentType, setCurrentType] = useState<SaveTypes>("baseInfo")
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insuranceArchives/detail?id=${params.archiveId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveLoading } = useRequest<{ [key: string]: any }>((type: SaveTypes, data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(saveUrlObj[type], data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = (type: SaveTypes) => {

    }

    return <Tabs type="card">
        <Tabs.TabPane tab="基本信息" key="1">
            <DetailContent operation={[
                <Button key="save" loading={saveLoading} onClick={() => handleSave("baseInfo")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="基本信息" />
                    <BaseInfo columns={baseInfo} dataSource={data || {}} edit />
                    <Attachment ref={attchRef} edit />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="工作经历" key="2">
            <DetailContent operation={[
                <Button key="save" loading={saveLoading} onClick={() => handleSave("work")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
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
                <Button key="save" loading={saveLoading} onClick={() => handleSave("family")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
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
                <Button key="save" loading={saveLoading} onClick={() => handleSave("employee")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
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