import React, { useState } from "react"
import { Button, Spin, Form, Input, InputNumber, Select, message } from 'antd'
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
    const [businessForm] = Form.useForm()
    const [businessData, setBusinessData] = useState<any[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insuranceArchives/detail?id=${params.archiveId}`)
            const businessFormData: any = {}
            result?.businesss.forEach((item: any, index: number) => businessFormData[index] = item)
            setBusinessData(result?.businesss)
            businessForm.setFieldsValue(businessFormData)
            resole({
                ...result,
                insurancePlanName: {
                    id: result?.insurancePlanId,
                    value: result?.insurancePlanName
                }
            })
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: businessLoding, run: getBusinessRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insurancePlan/detail?id=${id}`)
            const businessData: any = {}
            result.businessList.forEach((item: any, index: number) => {
                businessData[index] = item
            })
            setBusinessData(result?.businessList)
            businessForm.setFieldsValue(businessData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/insuranceArchives/save`, { ...data, id: params.archiveId })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async () => {
        try {
            const postBaseInfoData = await baseForm.validateFields()
            const postInsuranceData = await insuranceForm.validateFields()
            const postBusiness = await businessForm.validateFields()
            const businessList = Object.keys(postBusiness).map(item => postBusiness[item])
            await saveRun({
                ...postBaseInfoData,
                ...postInsuranceData,
                insurancePlanId: postInsuranceData.insurancePlanName.id,
                insurancePlanName: postInsuranceData.insurancePlanName.value,
                ssStartMonth: postInsuranceData.ssStartMonth + " 00:00:00",
                ssEndMonth: postInsuranceData.ssEndMonth + " 23:59:59",
                pfaStartMonth: postInsuranceData.pfaStartMonth + " 00:00:00",
                pfaEndMonth: postInsuranceData.pfaEndMonth + " 23:59:59",
                businesss: businessList
            })
            message.success("保存成功...")
            history.go(-1)
        } catch (error) {
            console.log(error)
        }
    }

    const handleInsuranceChange = (fields: any) => {
        if (fields.insurancePlanName) {
            insuranceForm.setFieldsValue({ paymentCompany: fields.insurancePlanName.records[0].companyName })
            getBusinessRun(fields.insurancePlanName.id)
        }
        if (fields.ssEndMonth) {
            // moment(fields.ssEndMonth).
            console.log(fields.ssEndMonth)
        }
    }
    console.log(businessData)
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
            <Form form={businessForm}>
                <CommonTable
                    rowKey="id"
                    loading={businessLoding}
                    columns={business.map((item: any) => {
                        switch (item.dataIndex) {
                            case "description":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <Input.TextArea autoSize={{ maxRows: 1 }} value={value} />
                                    </Form.Item>
                                })
                            case "insuranceAmount":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} value={value} />
                                    </Form.Item>
                                })
                            case "commercialInsuranceType":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <Select style={{ width: "100%" }} value={value}>
                                            <Select.Option value={1}>补充医疗保险</Select.Option>
                                            <Select.Option value={2}>雇主责任险</Select.Option>
                                            <Select.Option value={3}>意外伤害险</Select.Option>
                                            <Select.Option value={4}>团体责任险</Select.Option>
                                            <Select.Option value={5}>重大疾病险</Select.Option>
                                            <Select.Option value={6}>其他</Select.Option>
                                        </Select>
                                    </Form.Item>
                                })
                            default:
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <Input value={value} />
                                    </Form.Item>
                                })
                        }
                    })}
                    dataSource={businessData} />
            </Form>
        </Spin>
    </DetailContent>
}