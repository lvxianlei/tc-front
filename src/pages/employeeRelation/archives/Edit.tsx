import React, { useRef, useState } from "react"
import { Button, Form, Spin, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment, AttachmentRef } from '../../common'
import { baseInfo, companyInfo, other, workExperience, family, relatives } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
type TabTypes = "baseInfo" | "family" | "employee" | "work"
const tabPaths: { [key in TabTypes]: string } = {
    baseInfo: "/tower-hr/employee/archives/detail",
    family: "/tower-hr/employee/archives/family",
    employee: "/tower-hr/employee/archives/relatives",
    work: "/tower-hr/employee/archives/work/experience"
}
const saveUrlObj: { [key in TabTypes]: string } = {
    baseInfo: "/tower-hr/insuranceArchives/save",
    family: "/tower-hr/employee/archives/family",
    employee: "/tower-hr/employee/archives/relatives",
    work: "/tower-hr/employee/archives/work/experience"
}
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ archiveId: string, type: "new" | "edit" }>()
    const attchRef = useRef<AttachmentRef>()
    const [baseForm] = Form.useForm()
    const [companyForm] = Form.useForm()
    const [otherForm] = Form.useForm()
    const [currentType, setCurrentType] = useState<TabTypes>("baseInfo")

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`${tabPaths[currentType]}?employeeId=${params.archiveId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [currentType] })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((type: TabTypes, data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(saveUrlObj[type], { ...data, id: params.archiveId })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async (type: TabTypes) => {
        try {
            const postData = await baseForm.validateFields()
            await saveRun(type, {
                ...postData,
                birthday: postData.birthday + " 00:00:00",
                graduationDate: postData.graduationDate + " 00:00:00",
                cardValidityDate: postData.cardValidityDate + " 00:00:00",
            })
        } catch (error) {
            console.log(error)
        }
    }

    return <Tabs type="card" activeKey={currentType} onChange={(tabKey: string) => setCurrentType(tabKey as TabTypes)}>
        <Tabs.TabPane tab="基本信息" key="baseInfo">
            <DetailContent operation={[
                <Button key="save" loading={saveLoading} onClick={() => handleSave("baseInfo")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="基本信息" />
                    <BaseInfo form={baseForm} columns={baseInfo} dataSource={data || {}} edit />
                    <DetailTitle title="公司信息" />
                    <BaseInfo form={companyForm} columns={companyInfo} dataSource={data || {}} edit />
                    <DetailTitle title="其他信息" />
                    <BaseInfo form={otherForm} columns={other} dataSource={data || {}} edit />
                    <Attachment ref={attchRef} edit />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
        <Tabs.TabPane tab="工作经历" key="work">
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
        <Tabs.TabPane tab="家庭情况" key="family">
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
        <Tabs.TabPane tab="公司亲属" key="employee">
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