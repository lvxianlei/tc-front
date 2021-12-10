import React, { useRef, useState } from "react"
import { Button, Form, message, Spin, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, EditTable, Attachment, AttachmentRef } from '../../common'
import { baseInfo, companyInfo, other, workExperience, family, relatives, disabilityCols } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { bankTypeOptions, employeeTypeOptions } from "../../../configuration/DictionaryOptions"
import Photo from "./Photo"
import { RuleObject } from "antd/es/form"
import { fromIdNumberGetBirthday } from "../../../utils"
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
const verifyIdNumber = (idcode: string) => {
    const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    const code = idcode + ""
    const last = idcode[17]
    const seventeen = code.substring(0, 17)
    const arr = seventeen.split("")
    let num = 0
    arr.forEach((item: string, index: number) => {
        num = num + Number(arr[index]) * weight_factor[index]
    })
    const resisue = num % 11
    const last_no = check_code[resisue]
    const idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
    const format = idcard_patter.test(idcode)
    return last === last_no && format ? true : false
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
    const [baseInfoColumns, setBaseInfoColumns] = useState<Object[]>(baseInfo)
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`${tabPaths[currentType]}?employeeId=${params.archiveId}`)
            resole(currentType === "baseInfo" ? {
                ...result,
                postType: result?.postType?.split(",")
            } : result)
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
                            fileIds: attchRef.current?.getDataSource().map(item => item.id),
                            postType: postCompanyData.postType.join(","),
                            birthday: postBaseData.birthday && (postBaseData.birthday + " 00:00:00"),
                            graduationDate: postBaseData.graduationDate && (postBaseData.graduationDate + " 00:00:00"),
                            cardValidityDate: postBaseData.cardValidityDate && (postBaseData.cardValidityDate + " 00:00:00"),
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
                        const postData = await employeeForm.validateFields()
                        await saveRun("employee", postData?.submit.map((item: any) => {
                            const postItem: any = { ...item }
                            delete postItem.id
                            delete postItem.uid
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

    const handleBaseFormChange = (fields: any) => {
        if (fields.idNumber && verifyIdNumber(fields.idNumber)) {
            const { birthday, age }: { birthday: string, age: number } = fromIdNumberGetBirthday(fields.idNumber)
            baseForm.setFieldsValue({
                birthday,
                age,
            })
        }
        if (fields.isDisability === true) {
            setBaseInfoColumns([...baseInfo, ...disabilityCols])
        }
        if (fields.isDisability === false) {
            setBaseInfoColumns(baseInfo)
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
                    <BaseInfo form={baseForm} onChange={handleBaseFormChange} columns={baseInfoColumns.map((item: any) => {
                        if (item.dataIndex === "bankNameId") {
                            return ({
                                ...item, enum: bankTypeOptions?.map(item => ({
                                    label: item.name,
                                    value: item.id
                                }))
                            })
                        }
                        if (item.dataIndex === "emergencyContactPhone") {
                            return ({
                                ...item, rules: [...item.rules, {
                                    pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                                    message: "紧急联系电话不合法"
                                }]
                            })
                        }
                        if (item.dataIndex === "image") {
                            return ({
                                ...item,
                                render: () => {
                                    return <Photo id={params.archiveId} url={data?.image} />
                                }
                            })
                        }
                        if (item.dataIndex === "idNumber") {
                            return ({
                                ...item,
                                rules: [
                                    {
                                        required: true,
                                        validator: (rule: RuleObject, value: string) => new Promise((resove, reject) => {
                                            if (value && value !== '') {
                                                if (!verifyIdNumber(value)) {
                                                    reject('请核对身份证号信息...')
                                                } else {
                                                    resove(value)
                                                }
                                            } else {
                                                reject('请输入身份证号...')
                                            }
                                        })
                                    }
                                ]
                            })
                        }
                        return item
                    })} dataSource={data || {}} edit />
                    <DetailTitle title="公司信息" />
                    <BaseInfo form={companyForm} columns={companyInfo.map((item: any) => {
                        if (item.dataIndex === "postType") {
                            return ({
                                ...item,
                                type: "select",
                                mode: "multiple",
                                enum: employeeTypeOptions?.map(item => ({
                                    label: item.name,
                                    value: item.id
                                }))
                            })
                        }
                        return item
                    })} dataSource={data || {}} edit />
                    <DetailTitle title="其他信息" />
                    <BaseInfo form={otherForm} columns={other} dataSource={data || {}} edit />
                    <Attachment ref={attchRef} edit dataSource={data?.fileVos} />
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