import React from "react"
import { Button, Spin, Form } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, insurance, business } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ archiveId: string, type: "new" | "edit" }>()
    const [baseForm] = Form.useForm()
    const [insuranceForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insuranceArchives/detail?id=${params.archiveId}`)
            baseForm.setFieldsValue(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveLoading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/insuranceArchives/save`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = () => {

    }

    const handleInsuranceChange = (fields: any) => {
        if (fields.insurancePlanName) {
            console.log(fields.insurancePlanName)
            insuranceForm.setFieldsValue({ paymentCompany: fields.insurancePlanName.records[0].companyName })
        }
    }

    return <DetailContent operation={[
        <Button key="save" loading={saveLoading} onClick={handleSave} type="primary" style={{ marginRight: 16 }}>保存</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="员工保险档案" />
            <BaseInfo columns={setting} form={baseForm} dataSource={data || {}} edit />
            <DetailTitle title="社保公积金" />
            <BaseInfo form={insuranceForm} onChange={handleInsuranceChange} columns={insurance} dataSource={data || {}} edit />
            <DetailTitle title="商业保险方案" />
            <CommonTable columns={business} dataSource={[]} />
        </Spin>
    </DetailContent>
}