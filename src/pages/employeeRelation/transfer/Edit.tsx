import React, { useRef } from "react"
import { Button, Spin, Form, message } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, Attachment, AttachmentRef } from '../../common'
import ChooseDept from "./ChooseDept"
import { setting } from "./transfer.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import AuthUtil from "../../../utils/AuthUtil"
export default function Edit() {
    const history = useHistory()
    const attachRef = useRef<AttachmentRef>()
    const params = useParams<{ transferId: string }>()
    const [form] = Form.useForm()
    const { loading: stationLoading, data: stationEnum } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/station`, { crrent: 1, pageSize: 1000 })
            resove(result?.records.map((item: any) => ({ label: item.stationName, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/employeeTransfer/detail?id=${params.transferId}`)
            resole({
                ...result,
                employeeName: { id: result?.employeeId, value: result?.employeeName },
                newDepartmentName: {
                    id: result?.newTeamId,
                    value: result?.newTeamName,
                    records: [{
                        id: result?.newTeamId,
                        parentId: result?.newDepartmentId
                    }]
                }
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: !params.transferId })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/employeeTransfer/save`, params.transferId ? ({ ...data, id: params.transferId }) : data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async (submitType: "save" | "submit") => {
        try {
            const baseData = await form.validateFields()
            const postData = {
                ...baseData,
                oldDepartmentId: baseData.employeeName.records?.[0]?.departmentId || data?.oldDepartmentId,
                oldPostId: baseData.employeeName.records?.[0]?.postId || data?.oldPostId,
                oldTeamId: baseData.employeeName.records?.[0]?.teamId || data?.oldTeamId,
                transferDate: baseData.transferDate + " 00:00:00",
                employeeName: baseData.employeeName.value,
                employeeId: baseData.employeeName.id,
                newTeamId: baseData.newDepartmentName.records[0].id || data?.newTeamId,
                newDepartmentId: baseData.newDepartmentName.records[0].parentId || data?.newDepartmentId,
                fileIds: attachRef.current?.getDataSource().map(item => item.id),
                submitType
            }
            delete postData.newDepartmentName
            await saveRun(postData)
            message.success(`${submitType === "save" ? "成功保存..." : "成功保存并提交..."}`)
            history.go(-1)
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (changeFields: any) => {
        if (changeFields.employeeName) {
            const changeRecords = changeFields.employeeName.records[0] || {}
            form.setFieldsValue({
                oldCompanyName: changeRecords.companyName,
                oldDepartmentName: `${changeRecords.departmentName}/${changeRecords.teamName}`,
                oldPostName: changeRecords.postName
            })
        }
        if (changeFields.newDepartmentName) {
            console.log()
            form.setFieldsValue({
                newCompanyName: AuthUtil.getTenantName(),
                newDepartmentName: {
                    ...changeFields.newDepartmentName,
                    value: `${changeFields.newDepartmentName.records[0].parentName}/${changeFields.newDepartmentName.value}`
                }
            })
        }
    }
    return <DetailContent operation={[
        <Button key="save" loading={saveLoading} onClick={() => handleSave("save")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
        <Button key="submit" loading={saveLoading} onClick={() => handleSave("submit")} type="primary" style={{ marginRight: 16 }} >保存并提交</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <DetailTitle title="员工调动管理" />
        <Spin spinning={loading || stationLoading}>
            <BaseInfo
                form={form}
                onChange={handleChange}
                columns={setting.map(item => {
                    if (item.dataIndex === "newDepartmentName") {
                        return ({
                            ...item,
                            render: (columnItem: any, props: any) => <ChooseDept
                                data={columnItem}
                                {...props}
                                disabled={data?.status === 4}
                            />
                        })
                    }
                    if (item.dataIndex === "newPostId") {
                        return ({
                            ...item,
                            enum: stationEnum
                        })
                    }
                    return item
                })}
                dataSource={data || {}} edit />
            <Attachment dataSource={data?.fileVos} edit ref={attachRef} />
        </Spin>
    </DetailContent>
}