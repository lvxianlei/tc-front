import React, { useState } from "react"
import { Button, Spin, Form, DatePicker, InputNumber, Row, TreeSelect, Input, Select } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, insurance, business, insuranceData } from "./plan.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ planId: string }>()
    const [baseForm] = Form.useForm()
    const [insuranceForm] = Form.useForm()
    const [businessForm] = Form.useForm()
    const [businessData, setBusinessData] = useState<any[]>([])

    const { loading: companyLoading, data: companyEnum } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/department/company`)
            resole(result.map((item: any) => {
                const children = item.children.map((item: any) => ({ title: item.name, value: item.id }))
                return ({ title: item.name, value: item.id, children })
            }))
        } catch (error) {
            reject(error)
        }
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/insurancePlan/detail?id=${params.planId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: !params.planId })

    const { loading: saveLoading } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/insurancePlan/${params.planId ? "add" : "edit"}`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async () => {
        const baseData = await baseForm.validateFields()
        const insuranceData = await insuranceForm.validateFields()
        const businessData = await businessForm.validateFields()
        const postInsuranceData = Object.keys(insuranceData).map((item: any) => insuranceData[item])

    }
    const handleAdd = () => {
        setBusinessData([
            ...businessData,
            { id: Math.random() + new Date().getDate() }
        ])
    }
    const handleDelete = (id: string) => {
        setBusinessData(businessData.filter(item => item.id !== id))
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
                        render: () => <TreeSelect treeData={companyEnum} />
                    })
                }
                return item
            })} dataSource={data || {}} edit />
            <DetailTitle title="社保公积金" />
            <Form form={insuranceForm}>
                <CommonTable
                    rowKey={(_: any, index: number) => index}
                    pagination={false}
                    columns={insurance.map((item: any) => {
                        if (["insuranceType", "effectiveMonth", "expirationMonth"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                render: (value: string | number, row: any, index: number) => {
                                    const obj: { children: any, props: { rowSpan: number, style: any } } = {
                                        children: <Form.Item name={[index, item.dataIndex]}><DatePicker.RangePicker format="YYYY-MM-DD" /></Form.Item>,
                                        props: {
                                            rowSpan: 0,
                                            style: {}
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
                                    render: (value: string, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} precision={2} />
                                    </Form.Item>
                                })
                            case "cardinalityLowerBound":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} precision={2} />
                                    </Form.Item>
                                })
                            case "fixedCost":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} precision={2} />
                                    </Form.Item>
                                })
                            case "paymentProportion":
                                return ({
                                    ...item,
                                    render: (value: string, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} precision={2} />
                                    </Form.Item>
                                })
                            default:
                                return item
                        }
                    })}
                    dataSource={insuranceData} />
            </Form>
            <DetailTitle title="商业保险" />
            <Row><Button type="primary" onClick={handleAdd}>新增</Button></Row>
            <Form form={businessForm}>
                <CommonTable
                    rowKey="id"
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
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <Input.TextArea autoSize={{ maxRows: 1 }} value={value} />
                                    </Form.Item>
                                })
                            case "insuranceAmount":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <InputNumber style={{ width: "100%" }} value={value}/>
                                    </Form.Item>
                                })
                            case "commercialInsuranceType":
                                return ({
                                    ...item,
                                    render: (value: any, record: any, index: number) => <Form.Item name={[index, item.dataIndex]}>
                                        <Select style={{ width: "100%" }}>
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
                                        <Input />
                                    </Form.Item>
                                })
                        }
                    })
                    ]}
                    dataSource={businessData} />
            </Form>
        </Spin>
    </DetailContent>
}