import React, { useState } from "react"
import { Button, Spin, Form, DatePicker, InputNumber, Row, TreeSelect, Input, Select, Switch, message } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, insurance, business, insuranceData } from "./plan.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import moment from "moment"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ planId: string }>()
    const [baseForm] = Form.useForm()
    const [insuranceForm] = Form.useForm()
    const [businessForm] = Form.useForm()
    const [businessData, setBusinessData] = useState<any[]>([])
    const [isSocialSecurity, setIsSocialSecurity] = useState<boolean>(true)
    const { loading: companyLoading, data: companyEnum } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/department/company`)
            resole(result.map((item: any) => {
                const children = item.children?.map((item: any) => ({ title: item.name, value: item.id })) || []
                return ({ title: item.name, value: item.id, children })
            }))
        } catch (error) {
            reject(error)
        }
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insurancePlan/detail?id=${params.planId}`)
            const insuranceFormData: any = {}
            const businessFormData: any = {}
            setIsSocialSecurity(result.isSocialSecurity)
            setBusinessData(result.businessList)
            result.socialSecurityList.forEach((item: any, index: number) => {
                insuranceFormData[index] = ({
                    ...item,
                    effectiveMonth: [
                        moment(item.effectiveMonth, "YYYY-MM"),
                        moment(item.expirationMonth, "YYYY-MM")
                    ]
                })
            })
            result.businessList.forEach((item: any, index: number) => {
                businessFormData[index] = item
            })
            insuranceForm.setFieldsValue(insuranceFormData)
            businessForm.setFieldsValue(businessFormData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: !params.planId })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/insurancePlan/${params.planId ? "edit" : "add"}`, params.planId ? {
                ...data,
                id: params.planId
            } : data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async () => {
        try {
            const baseData = await baseForm.validateFields()
            const insuranceFormData = isSocialSecurity ? await insuranceForm.validateFields() : {}
            const businessData = await businessForm.validateFields()
            const postInsuranceData = Object.keys(insuranceFormData).map((item: any, index: number) => {
                const rowSpanData = index % 2 === 1 ? insuranceFormData[item - 1] : insuranceFormData[item]
                const formatDate = rowSpanData.effectiveMonth.map((item: any) => item.format("YYYY-MM"))
                return ({
                    ...insuranceFormData[item],
                    insuranceType: insuranceData[index].insuranceType,
                    paymentType: insuranceData[index].paymentType,
                    effectiveMonth: formatDate?.[0],
                    expirationMonth: formatDate?.[1],
                })
            })
            const postBusinessData = Object.keys(businessData).map((item: any) => businessData[item])
            await saveRun({
                ...baseData,
                isSocialSecurity,
                businessList: postBusinessData,
                socialSecurityList: postInsuranceData
            })
            message.success("保存成功...")
            history.go(-1)
        } catch (error) {
            console.log(error)
        }
    }
    const handleAdd = () => {
        const businessFormData = businessForm.getFieldsValue()
        setBusinessData([...businessData, { id: `${Math.random() + new Date().getDate()}` }])
        businessForm.resetFields()
        businessForm.setFieldsValue({ ...businessFormData, [businessData.length + 1]: {} })
    }
    const handleDelete = (id: string) => {
        const businessFormData = businessForm.getFieldsValue()
        setBusinessData(businessData.filter((item: any, index: number) => {
            (item.id === id) && delete businessFormData[index]
            return item.id !== id
        }))
        Object.keys(businessFormData).forEach((item: string, index: number) => {
            businessFormData[index] = businessFormData[item]
        })
        businessForm.setFieldsValue(businessFormData)
    }
    return <DetailContent operation={[
        <Button key="save" loading={saveLoading} onClick={handleSave} type="primary" style={{ marginRight: 16 }}>保存</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <Spin spinning={loading || companyLoading}>
            <DetailTitle title="基本信息" />
            <BaseInfo col={3} form={baseForm} columns={setting.map((item: any) => {
                if (item.dataIndex === "companyId") {
                    return ({
                        ...item,
                        render: (data: any, props: any) => <TreeSelect treeData={companyEnum} data={data} {...props} />
                    })
                }
                return item
            })} dataSource={data || {}} edit />
            <DetailTitle title="社保公积金" />
            <Row style={{ padding: "8px 16px" }}>
                <span style={{ fontSize: 14 }}>是否启用：</span><Switch checked={isSocialSecurity} onChange={(checked: boolean) => {
                    setIsSocialSecurity(checked)
                    insuranceForm.resetFields()
                }} />
            </Row>
            <Form form={insuranceForm}>
                <CommonTable
                    rowKey={(_: any, index: number) => index}
                    pagination={false}
                    columns={isSocialSecurity ? insurance.map((item: any) => {
                        if (["insuranceType", "effectiveMonth"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                render: (value: any, row: any, index: number) => {
                                    const obj: { children: any, props: { rowSpan: number, style: any } } = {
                                        children: <Form.Item
                                            style={{ height: 28 }}
                                            rules={[
                                                {
                                                    "required": true,
                                                    "message": "请选择生效/失效日期..."
                                                }
                                            ]}
                                            name={[index, item.dataIndex]}>
                                            <DatePicker.RangePicker value={value} picker="month" format="YYYY-MM" />
                                        </Form.Item>,
                                        props: {
                                            rowSpan: 0,
                                            style: { height: 28 }
                                        }
                                    }
                                    if (index % 2 === 0) {
                                        obj.props.rowSpan = 2
                                        obj.props.style = index % 4 === 2 && { backgroundColor: "#F8F8F8" }
                                    }
                                    if (item.dataIndex === "insuranceType") {
                                        obj.children = ((value || value === 0) && item.enum) ? item.enum.find((item: { value: string, label: string }) => item.value === value)?.label : value
                                    }
                                    return obj
                                }
                            })
                        }
                        switch (item.dataIndex) {
                            case "cardinalityUpperLimit":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item
                                        style={{ height: 28 }}
                                        rules={[
                                            {
                                                "required": true,
                                                "message": "请输入基数上限..."
                                            }
                                        ]}
                                        name={[index, item.dataIndex]}>
                                        <InputNumber value={value} style={{ width: "100%", height: 28 }} precision={2} />
                                    </Form.Item>
                                })
                            case "cardinalityLowerBound":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item
                                        style={{ height: 28 }}
                                        rules={[
                                            {
                                                "required": true,
                                                "message": "请输入基数下限..."
                                            }
                                        ]}
                                        name={[index, item.dataIndex]}>
                                        <InputNumber value={value} style={{ width: "100%", height: 28 }} precision={2} />
                                    </Form.Item>
                                })
                            case "fixedCost":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item style={{ height: 28 }} name={[index, item.dataIndex]}>
                                        <InputNumber value={value} style={{ width: "100%", height: 28 }} precision={2} />
                                    </Form.Item>
                                })
                            case "paymentProportion":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item
                                        style={{ height: 28 }}
                                        rules={[
                                            {
                                                "required": true,
                                                "message": "请输入缴纳比例..."
                                            }
                                        ]}
                                        name={[index, item.dataIndex]}>
                                        <InputNumber value={value} style={{ width: "100%", height: 28 }} precision={2} />
                                    </Form.Item>
                                })
                            default:
                                return item
                        }
                    }) : insurance}
                    dataSource={insuranceData} />
            </Form>
            <DetailTitle title="商业保险" />
            <Row style={{ marginBottom: 16 }}><Button type="primary" onClick={handleAdd}>新增</Button></Row>
            <Form form={businessForm}>
                <CommonTable
                    rowKey="id"
                    pagination={false}
                    columns={[{
                        title: "操作",
                        dataIndex: "opration",
                        width: 30,
                        render: (_: any, record: any) => <Button type="link" size="small" onClick={() => handleDelete(record.id)}>删除</Button>
                    },
                    ...business.map((item: any) => {
                        switch (item.dataIndex) {
                            case "description":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item
                                        name={[index, item.dataIndex]}>
                                        <Input.TextArea maxLength={300} autoSize={{ maxRows: 1 }} value={value} />
                                    </Form.Item>
                                })
                            case "insuranceAmount":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item
                                        rules={[
                                            {
                                                "required": true,
                                                "message": "请填写保险金额..."
                                            }
                                        ]}
                                        name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} value={value} precision={2} />
                                    </Form.Item>
                                })
                            case "commercialInsuranceType":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item
                                        rules={[
                                            {
                                                "required": true,
                                                "message": "请选择保险类型..."
                                            }
                                        ]}
                                        name={[index, item.dataIndex]}>
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
                                    render: (value: any, record: any, index: number) => <Form.Item rules={item.rules} name={[index, item.dataIndex]}>
                                        <Input value={value} />
                                    </Form.Item>
                                })
                        }
                    })]}
                    dataSource={businessData} />
            </Form>
        </Spin>
    </DetailContent>
}