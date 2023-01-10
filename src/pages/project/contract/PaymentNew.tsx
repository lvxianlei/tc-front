import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Form, message } from "antd";
import { BaseInfo, DetailContent, DetailTitle } from "../../common";
import {
    refundModeOptions, // 来款方式
    currencyTypeOptions, // 币种
} from "../../../configuration/DictionaryOptions";
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
import { paymentRecord, paymentInfo } from "./contract.json"
const currencyTypeEnum = currencyTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const refundModeEnum = refundModeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
interface paramsProps {
    id: string
    contractName: string
    signCustomerId: string
    signCustomerName: string
    contractNumber: string
    projectId: string
}
export default function PaymentNew() {
    const history = useHistory()
    const [form] = Form.useForm()
    const [paymentInfoForm] = Form.useForm()
    const {
        id,
        contractName,
        signCustomerId,
        signCustomerName,
        contractNumber,
        projectId
    } = useParams<paramsProps>()

    const { loading, run: save } = useRequest<{ [key: string]: any }>((confirmValues: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post('/tower-market/paymentRecord', confirmValues)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleBaseInfoChange = (field: any) => {
        if (field.period) {
            const records = field.period.records?.[0]
            form.setFieldsValue({
                returnedTime: records?.returnedTime,
                returnedRate: records?.returnedRate,
                returnedAmount: records?.returnedAmount
            })
        }
    }
    const handleSave = async () => {
        const baseData = await form.validateFields()
        const paymentInfo = await paymentInfoForm.validateFields()
        console.log(baseData, paymentInfo)
        const result = await save({
            ...baseData,
            ...paymentInfo,
            customerName: baseData.customerName.value,
            customerId: baseData.customerName.id,
            name: baseData.period.value,
            // period: baseData.period.id,
            // paymentPlanId: baseData.paymentPlan?.records?.[0]?.paymentPlanId,
            paymentPlanId: baseData.period.id,
            period: baseData.period?.records?.[0]?.period,
            contractId: id
        })
        if (result) {
            message.success("保存成功...")
            history.goBack()
            return
        } else {
            message.error("保存失败")
        }
    }

    return <DetailContent operation={[
        <Button
            key="setting"
            type="primary"
            style={{ marginRight: 16 }}
            onClick={handleSave}
            loading={loading}
        >保存</Button>,
        <Button key="default" onClick={() => history.goBack()}>取消</Button>
    ]}>
        <DetailTitle title="回款计划" />
        <BaseInfo
            form={form}
            columns={paymentRecord.map((item: any) => {
                switch (item.dataIndex) {
                    case "period":
                        return ({
                            ...item,
                            path: `${item.path}/${id}`,
                            transformData: (data: any) => data.paymentPlanVos
                        })
                    default:
                        return item
                }
            })}
            dataSource={{
                contractName,
                customerName: {
                    value: signCustomerName,
                    id: signCustomerId
                },
                contractNumber,
                projectId
            }}
            onChange={handleBaseInfoChange}
            edit />
        <DetailTitle title="回款信息" />
        <BaseInfo
            form={paymentInfoForm}
            columns={paymentInfo.map((item: any) => {
                switch (item.dataIndex) {
                    case "refundMode":
                        return ({
                            ...item,
                            enum: refundModeEnum
                        })
                    case "currencyType":
                        return ({
                            ...item,
                            enum: currencyTypeEnum
                        })
                    default:
                        return item
                }
            })} dataSource={{}} edit />
    </DetailContent>
}