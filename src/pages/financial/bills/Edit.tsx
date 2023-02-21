import React, { useImperativeHandle, forwardRef, useRef, useState } from "react"
import { Spin, Form, Select } from 'antd'
import { DetailTitle, BaseInfo, Attachment, AttachmentRef } from '../../common'
import { bilinformation } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { invoiceTypeOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    id: string
}
interface IResponse {
    readonly records?: [];
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [companyList, setCompanyList] = useState([]);
    const attchsRef = useRef<AttachmentRef>()
    const [baseForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            baseForm.setFieldsValue({
                ...result,
                businessId: result.businessId + ',' + result.businessName,
                receiptVos: {
                    value: result.receiptVos.map((item: any) => item.receiptNumber).join(","),
                    records: result.receiptVos.map((item: any) => ({ ...item, id: item.receiptId, receiveNumber: item.receiptNumber }))
                }
            })
            businessTypeChange(result.businessType);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/invoice`, { ...postData, id: data?.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({
                ...baseData,
                businessId: baseData.businessId?.split(',')[0],
                businessName: baseData.businessId?.split(',')[1],
                receiptDtos: baseData.receiptVos.records?.map((item: any) => ({
                    receiptId: item.id,
                    receiptNumber: item.receiveNumber
                })) || data?.receiptVos.map((item: any) => ({
                    receiptId: item.receiptId,
                    receiptNumber: item.receiptNumber,
                })),
                fileIds: attchsRef.current?.getDataSource().map(item => item.id),
                invoiceRelationType: 1, // 新加票据是否关联 写死传1
            })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    const resetFields = () => {
        baseForm.resetFields()
        attchsRef.current?.resetFields()
    }

    const businessTypeChange = async (e: number) => {
        let result: IResponse = {};
        let list: any = {};
        if (e === 1) {
            result = await RequestUtil.get(`/tower-supply/supplier?size=500`);
            list = result?.records?.map((item: { supplierName: string }) => {
                return {
                    ...item,
                    name: item.supplierName
                }
            })
        } else if (e === 2) {
            result = await RequestUtil.get(`/tower-supply/stevedoreCompany?size=500`);
            list = result?.records?.map((item: { stevedoreCompanyName: string }) => {
                return {
                    ...item,
                    name: item.stevedoreCompanyName
                }
            })
        } else {
            result = await RequestUtil.get(`/tower-logistic/carrier?size=500`);
            list = result?.records?.map((item: { companyName: string }) => {
                return {
                    ...item,
                    name: item.companyName
                }
            })
        }
        setCompanyList(list || []);
    }
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields])
    return <Spin spinning={loading}>
        <DetailTitle title="票据信息" />
        <BaseInfo form={baseForm} columns={bilinformation.map((item: any) => {
            if (item.dataIndex === "invoiceType") {
                return ({ ...item, type: "select", enum: invoiceTypeEnum })
            }
            if (item.dataIndex === 'receiptVos') {
                return ({
                    ...item,
                    disabled: !baseForm.getFieldValue("businessType"),
                    path: `${item.path}&companyRelationStatus=${baseForm.getFieldValue("businessType")}`
                })
            }
            if (item.dataIndex === 'businessType') {
                return ({
                    ...item, render: (data: any, props: any) => {
                        return <Form.Item name="businessType" style={{ width: "100%" }}>
                            <Select disabled={type === 'edit'} onChange={(e: number) => { businessTypeChange(e); baseForm.setFieldsValue({ businessId: '' }); }}>
                                <Select.Option value={1} key="1">供应商</Select.Option>
                                <Select.Option value={2} key="2">装卸公司</Select.Option>
                                <Select.Option value={3} key="3">运输公司</Select.Option>
                            </Select>
                        </Form.Item>
                    }
                })
            }
            if (item.dataIndex === 'businessId') {
                return ({
                    ...item, render: (data: any, props: any) => {
                        return <Form.Item name="businessId" style={{ width: "100%" }}>
                            <Select disabled={type === 'edit'} onChange={(e: any) => {
                                console.log(e, "======")
                                baseForm.setFieldsValue({ invoiceUnit: e.split(",")[1] })
                            }}>
                                {companyList && companyList.map((item: any) => {
                                    return <Select.Option key={item.id + ',' + item.name} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    }
                })
            }
            return item
        })} col={2} dataSource={{}} edit />
        <Attachment ref={attchsRef} dataSource={baseForm.getFieldsValue(true)?.invoiceAttachInfoVos} edit />
    </Spin>
})