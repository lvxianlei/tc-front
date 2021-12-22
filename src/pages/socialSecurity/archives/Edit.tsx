import React, { useState } from "react"
import { Button, Spin, Form, Input, InputNumber, Select, message, DatePicker } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, FormItemType } from '../../common'
import { setting, insurance, business } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import moment from "moment"
import { RuleObject } from "antd/es/form"
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
            const businessList = Object.keys(postBusiness).map((item: any) => ({
                ...businessData[item],
                ...postBusiness[item],
                startMonth: (postBusiness[item].startMonth) && (postBusiness[item].startMonth),
                endMonth: postBusiness[item].endMonth && (postBusiness[item].endMonth)
            }))
            await saveRun({
                ...postBaseInfoData,
                ...postInsuranceData,
                insurancePlanId: postInsuranceData.insurancePlanName.id,
                insurancePlanName: postInsuranceData.insurancePlanName.value,
                ssStartMonth: postInsuranceData.ssStartMonth && (postInsuranceData.ssStartMonth),
                ssEndMonth: postInsuranceData.ssEndMonth && (postInsuranceData.ssEndMonth),
                pfaStartMonth: postInsuranceData.pfaStartMonth && (postInsuranceData.pfaStartMonth),
                pfaEndMonth: postInsuranceData.pfaEndMonth && (postInsuranceData.pfaEndMonth),
                businesss: businessList
            })
            message.success("保存成功...")
            history.go(-1)
        } catch (error) {
            console.log(error)
        }
    }

    const handleInsuranceChange = (fields: any, allFields: any) => {
        if (fields.insurancePlanName) {
            insuranceForm.setFieldsValue({ paymentCompany: fields.insurancePlanName.records[0].companyName })
            getBusinessRun(fields.insurancePlanName.id)
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
            <BaseInfo
                form={insuranceForm}
                onChange={handleInsuranceChange}
                columns={insurance.map(item => {
                    switch (item.dataIndex) {
                        case "ssEndMonth":
                            return ({
                                ...item,
                                rules: [{
                                    validator: (rule: RuleObject, value: string) => new Promise((resove, reject) => {
                                        const allFields = insuranceForm.getFieldsValue()
                                        if (value && allFields.ssStartMonth) {
                                            if (moment(value).isBefore(moment(allFields.ssStartMonth))) {
                                                reject('社保结束缴纳月必须在社保开始缴纳月之后...')
                                            } else {
                                                resove(value)
                                            }
                                        } else {
                                            resove(value)
                                        }
                                    })
                                }]
                            })
                        case "pfaEndMonth":
                            return ({
                                ...item,
                                rules: [{
                                    validator: (rule: RuleObject, value: string) => new Promise((resove, reject) => {
                                        const allFields = insuranceForm.getFieldsValue()
                                        if (value && allFields.ssStartMonth) {
                                            if (moment(value).isBefore(moment(allFields.pfaStartMonth))) {
                                                reject('公积金结束缴纳月必须在公积金开始缴纳月之后...')
                                            } else {
                                                resove(value)
                                            }
                                        } else {
                                            resove(value)
                                        }
                                    })
                                }]
                            })
                        default:
                            return item
                    }
                })} dataSource={data || {}} edit />
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
                                    render: (value: any, record: any, index: number) => <Form.Item rules={item.rules} name={[index, item.dataIndex]}>
                                        <Input.TextArea autoSize={{ maxRows: 1 }} value={value} />
                                    </Form.Item>
                                })
                            case "insuranceAmount":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item rules={item.rules} name={[index, item.dataIndex]}>
                                        <InputNumber value={value} precision={2} />
                                    </Form.Item>
                                })
                            case "commercialInsuranceType":
                                return item
                            case "commercialInsuranceName":
                                return item
                            case "startMonth":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item rules={item.rules} name={[index, item.dataIndex]}>
                                        <FormItemType data={item} type="date" />
                                    </Form.Item>
                                })
                            case "endMonth":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item rules={[{
                                        validator: (rule: RuleObject, value: string) => new Promise((resove, reject) => {
                                            const allFields = businessForm.getFieldsValue()[index]
                                            if (value && allFields.startMonth) {
                                                if (moment(value).isBefore(moment(allFields.startMonth))) {
                                                    reject('结束缴纳月必须在开始缴纳月之后...')
                                                } else {
                                                    resove(value)
                                                }
                                            } else {
                                                resove(value)
                                            }
                                        })
                                    }]} name={[index, item.dataIndex]}>
                                        <FormItemType data={item} type="date" />
                                    </Form.Item>
                                })
                            default:
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item rules={item.rules} name={[index, item.dataIndex]}>
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