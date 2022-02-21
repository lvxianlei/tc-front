import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select } from 'antd'
import { DetailContent, BaseInfo, formatData } from '../../common'
import { ApplicationList } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { costTypeOptions, invoiceTypeOptions, payTypeOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    id: string
}

interface IResponse {
    readonly records?: [];
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [baseForm] = Form.useForm()
    const [companyList, setCompanyList] = useState([]);
    const [pleasePayType, setPleasePayType] = useState('');
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const paymentMethodEnum = payTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/department`)
            resole(result.map((item: any) => ({ label: item.name, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            baseForm.setFieldsValue(formatData(ApplicationList, {
                ...result,
                businessId: result.businessId + ',' + result.businessName,
                relatednotes: {
                    value: result.applyPaymentInvoiceVos?.map((item: any) => item.billNumber).join(","),
                    records: result.applyPaymentInvoiceVos?.map((item: any) => ({
                        invoiceId: item.invoiceId,
                        billNumber: item.billNumber
                    })) || []
                }
            }))
            businessTypeChange(result.businessType);
            setPleasePayType(result.pleasePayType);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any, saveType?: "save" | "saveAndApply") => new Promise(async (resole, reject) => {
        try {
            if (saveType === "saveAndApply") {
                const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment/saveAndStartApplyPayment`, data)
                resole(result)
                return
            } else {
                const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment`, data)
                resole(result)
                return
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = (saveType?: "save" | "saveAndApply") => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            const postData = type === "new" ? {
                ...baseData,
                businessId: baseData.businessId?.split(',')[0],
                businessName: baseData.businessId?.split(',')[1],
                applyPaymentInvoiceDtos: baseData.relatednotes.records?.map((item: any) => ({
                    invoiceId: item.id,
                    billNumber: item.billNumber
                })) || data?.applyPaymentInvoiceVos
            } : {
                ...baseData,
                id: data?.id,
                businessId: baseData.businessId?.split(',')[0],
                businessName: baseData.businessId?.split(',')[1],
                applyPaymentInvoiceDtos: baseData.relatednotes.records?.map((item: any) => ({
                    invoiceId: item.id,
                    billNumber: item.billNumber
                })) || data?.applyPaymentInvoiceVos.map((item: any) => ({
                    invoiceId: item.invoiceId,
                    billNumber: item.billNumber
                }))
            }
            await saveRun(postData, saveType)
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])

    const resetFields = () => {
        baseForm.resetFields()
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.relatednotes) {
            let pleasePayAmount = "0.00"
            fields.relatednotes.records.forEach((item: any) => {
                pleasePayAmount = (parseFloat(pleasePayAmount) + parseFloat(item.invoiceAmount || "0")).toFixed(2)
            })
            baseForm.setFieldsValue({
                pleasePayAmount,
                receiptNumbers: fields.relatednotes.records.map((item: any) => item.receiptNumbers).join(","),
            })
        }
        if (fields.supplierName) {
            baseForm.setFieldsValue({
                openBank: fields.supplierName.records[0]?.bankDeposit,
                openBankNumber: fields.supplierName.records[0]?.bankAccount
            })
        }
    }

    const businessTypeChange = async (e: number) => {
        let result: IResponse = {};
        let list: any = {};
        if (e === 1) {
            result = await RequestUtil.get(`/tower-supply/supplier?size=100`);
            list = result?.records?.map((item: { supplierName: string, bankDepositName: string }) => {
                return {
                    ...item,
                    name: item.supplierName,
                    openBank: item.bankDepositName
                }
            })
        } else if (e === 2) {
            result = await RequestUtil.get(`/tower-supply/stevedoreCompany?size=100`);
            list = result?.records?.map((item: { stevedoreCompanyName: string, openBankName: string }) => {
                return {
                    ...item,
                    name: item.stevedoreCompanyName,
                    openBank: item.openBankName
                }
            })
        } else {
            result = await RequestUtil.get(`/tower-logistic/carrier?size=100`);
            list = result?.records?.map((item: { companyName: string }) => {
                return {
                    ...item,
                    name: item.companyName
                }
            })
        }
        setCompanyList(list || []);
    }

    const businessIdChange = (e: string) => {
        const businessId: string = e.split(',')[0];
        const item: any = companyList.filter((res: any) => res.id === businessId)[0];
        baseForm.setFieldsValue({
            openBank: item.openBank,
            openBankNumber: item.bankAccount
        })
    }

    return <DetailContent>
        <Spin spinning={loading}>
            <BaseInfo form={baseForm} onChange={handleBaseInfoChange} columns={ApplicationList.map((item: any) => {
                switch (item.dataIndex) {
                    case "relatednotes":
                        return ({
                            ...item,
                            columns: item.columns.map((item: any) => item.dataIndex === "invoiceType" ? ({
                                ...item,
                                type: "select",
                                enum: invoiceTypeEnum
                            }) : item)
                        })
                    case "pleasePayType":
                        return ({
                            ...item, render: (data: any, props: any) => {
                                return <Form.Item name="pleasePayType" style={{ width: '100%' }}>
                                    <Select disabled={type === 'edit'} onChange={(e: string) => {
                                        setPleasePayType(e);
                                        baseForm.setFieldsValue({ businessType: e === '1156' ? 1 : e === '1157' ? 3 : e === '1158' ? 2 : '' })
                                        if (e === '1156') {
                                            businessTypeChange(1);
                                        } else if (e === '1157') {
                                            businessTypeChange(3)
                                        } else if (e === '1158') {
                                            businessTypeChange(2)
                                        }
                                    }}>
                                        {costTypeOptions && costTypeOptions.map((item: any) => {
                                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "paymentMethod":
                        return ({ ...item, type: "select", enum: paymentMethodEnum })
                    case "pleasePayOrganization":
                        return ({ ...item, enum: deptData })
                    case 'businessType':
                        return ({
                            ...item, render: (data: any, props: any) => {
                                return <Form.Item name="businessType" style={{ width: '100%' }}>
                                    <Select disabled={pleasePayType === '1156' || pleasePayType === '1157' || pleasePayType === '1158'} onChange={(e: number) => businessTypeChange(e)}>
                                        <Select.Option value={1} key="1">供应商</Select.Option>
                                        <Select.Option value={2} key="2">装卸公司</Select.Option>
                                        <Select.Option value={3} key="3">运输公司</Select.Option>
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case 'businessId':
                        return ({
                            ...item, render: (data: any, props: any) => {
                                return <Form.Item name="businessId" style={{ width: '100%' }}>
                                    <Select disabled={type === 'edit'} onChange={(e: string) => businessIdChange(e)}>
                                        {companyList && companyList.map((item: any) => {
                                            return <Select.Option key={item.id + ',' + item.name} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    default:
                        return item
                }
            })} col={2} dataSource={{}} edit />
        </Spin>
    </DetailContent>
})