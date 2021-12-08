import React, { useRef, useState } from "react"
import { Button, Form, message, Spin, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, EditTable, Attachment, AttachmentRef } from '../../common'
import { baseInfo, companyInfo, other, workExperience, family, relatives } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { bankTypeOptions } from "../../../configuration/DictionaryOptions"
type TabTypes = "baseInfo" | "family" | "employee" | "work"
const tabPaths: { [key in TabTypes]: string } = {
    baseInfo: "/tower-hr/employee/archives/detail",
    family: "/tower-hr/employee/archives/family",
    employee: "/tower-hr/employee/archives/relatives",
    work: "/tower-hr/employee/archives/work/experience"
}
const saveUrlObj: { [key in TabTypes]: string } = {
    baseInfo: "/tower-hr/employee/archives",
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
    const [workForm] = Form.useForm()
    const [familyForm] = Form.useForm()
    const [employeeForm] = Form.useForm()
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
            const result: { [key: string]: any } = await RequestUtil.post(saveUrlObj[type], data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async (type: TabTypes) => {
        try {
            switch (type) {
                case "baseInfo":
                    {
                        const postBaseData = await baseForm.validateFields()
                        const postCompanyData = await companyForm.validateFields()
                        const postOtherData = await otherForm.validateFields()
                        await saveRun(type, {
                            ...postBaseData,
                            ...postCompanyData,
                            ...postOtherData,
                            id: params.archiveId,
                            birthday: postBaseData.birthday + " 00:00:00",
                            graduationDate: postBaseData.graduationDate + " 00:00:00",
                            cardValidityDate: postBaseData.cardValidityDate + " 00:00:00",
                        })
                        message.success("保存成功...")
                        history.go(-1)
                    }
                    break
                case "work":
                    {
                        const postData = await workForm.validateFields()
                        await saveRun("work", postData?.submit.map((item: any) => {
                            const postItem: any = { ...item }
                            delete postItem.id
                            delete postItem.uid
                            postItem.startWorkDate = postItem.workDate[0] ? postItem.workDate[0] + " 00:00:00" : ""
                            postItem.endWorkDate = postItem.workDate[1] ? postItem.workDate[1] + " 00:00:00" : ""
                            postItem.employeeId = params.archiveId
                            delete postItem.workDate
                            return postItem
                        }))
                        message.success("保存成功...")
                        history.go(-1)
                    }
                    break
                case "family":
                    {
                        const postData = await familyForm.validateFields()
                        await saveRun("family", postData?.submit.map((item: any) => {
                            const postItem: any = { ...item }
                            delete postItem.id
                            delete postItem.uid
                            postItem.startWorkDate = postItem.workDate[0] ? postItem.workDate[0] + " 00:00:00" : ""
                            postItem.endWorkDate = postItem.workDate[1] ? postItem.workDate[1] + " 00:00:00" : ""
                            postItem.employeeId = params.archiveId
                            delete postItem.workDate
                            return postItem
                        }))
                        message.success("保存成功...")
                        history.go(-1)
                    }
                    break
                case "employee":
                    {
                        const postData = await familyForm.validateFields()
                        await saveRun("employee", postData?.submit.map((item: any) => {
                            const postItem: any = { ...item }
                            delete postItem.id
                            delete postItem.uid
                            postItem.startWorkDate = postItem.workDate[0] ? postItem.workDate[0] + " 00:00:00" : ""
                            postItem.endWorkDate = postItem.workDate[1] ? postItem.workDate[1] + " 00:00:00" : ""
                            postItem.employeeId = params.archiveId
                            delete postItem.workDate
                            return postItem
                        }))
                        message.success("保存成功...")
                        history.go(-1)
                    }
                    break
                default:
                    break
            }

        } catch (error) {
            console.log(error)
        }
    }
    console.log(data)
    return <Tabs type="card" activeKey={currentType} onChange={(tabKey: string) => setCurrentType(tabKey as TabTypes)}>
        <Tabs.TabPane tab="基本信息" key="baseInfo">
            <DetailContent operation={[
                <Button key="save" loading={saveLoading} onClick={() => handleSave("baseInfo")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
                <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <Spin spinning={loading}>
                    <DetailTitle title="基本信息" />
                    <BaseInfo form={baseForm} columns={baseInfo.map((item: any) => {
                        if (item.dataIndex === "bankNameId") {
                            return ({
                                ...item, enum: bankTypeOptions?.map(item => ({
                                    label: item.name,
                                    value: item.id
                                }))
                            })
                        }
                        return item
                    })} dataSource={data || {}} edit />
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
                    <EditTable
                        haveIndex={false}
                        form={workForm}
                        newButtonTitle="新增"
                        columns={workExperience}
                        dataSource={data instanceof Array ? data.map((item: any) => ({
                            ...item,
                            workDate: [item.startWorkDate, item.endWorkDate]
                        })) : []} />
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
                    <EditTable form={familyForm} newButtonTitle="新增" columns={family} dataSource={(data as any[]) || []} />
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
                    <EditTable form={employeeForm} newButtonTitle="新增" columns={relatives} dataSource={(data as any[]) || []} />
                </Spin>
            </DetailContent>
        </Tabs.TabPane>
    </Tabs>
}