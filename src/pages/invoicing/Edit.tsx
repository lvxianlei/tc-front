import React, { useState, useRef } from "react"
import { Button, Form, message, Spin, Input, InputNumber } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, formatData, Attachment, AttachmentRef } from '../common'
import { invoicingInfoHead, editInvoicingHead } from "./InvoicingData.json"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../configuration/ApplicationContext"
export default function Edit() {
    const params = useParams<{ invoicingId: string }>()
    const history = useHistory()
    const [invoicingDetailVos, setInvoicingDetailVos] = useState<any[]>([])
    const attachRef = useRef<AttachmentRef>()
    const [baseInfo] = Form.useForm()
    const productType: any = (ApplicationContext.get().dictionaryOption as any)["101"]
    const saleTypeEnum: any = (ApplicationContext.get().dictionaryOption as any)["123"].map((item: any) => ({ value: item.code, label: item.name }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/invoicing/getInvoicingInfo/${params.invoicingId}`)
            baseInfo.setFieldsValue({ ...formatData(invoicingInfoHead, result) })
            setInvoicingDetailVos(result?.invoicingDetailVos)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((saveData) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-finance/invoicing`, saveData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async (saveType: 1 | 2) => {
        try {
            await saveRun({
                id: params.invoicingId,
                invoicingDetailFillDtos: invoicingDetailVos,
                fileIds: attachRef.current?.getDataSource().map(item => item.id),
                saveType
            })
            message.success(`${saveType === 1 ? "保存" : "保存并提交"}成功...`)
            history.goBack()
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditTableChange = (changeKey: "ticketNumber" | "taxRate", value: any, changeIndex: number) => {
        setInvoicingDetailVos(invoicingDetailVos.map((item: any, index: number) => {
            if (index === changeIndex) {
                if (changeKey === "taxRate") {
                    return ({ ...item, [changeKey]: value, taxMoney: (((item.moneyCount || 0) * value) * 0.01).toFixed(2) })
                }
                return ({ ...item, [changeKey]: value })
            }
            return item
        }))
    }

    return <DetailContent operation={[
        <Button
            type="primary" key="save"
            style={{ marginRight: 16 }}
            loading={saveLoading}
            onClick={() => handleSave(1)}>保存</Button>,
        <Button
            type="primary" key="saveAndSubmit"
            style={{ marginRight: 16 }}
            loading={saveLoading}
            onClick={() => handleSave(2)}>保存并提交</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="开票信息" />
            <BaseInfo
                form={baseInfo}
                columns={invoicingInfoHead.map((item: any) => {
                    if (item.dataIndex === "productTypeId") {
                        return ({
                            ...item,
                            enum: productType.map((product: any) => ({
                                value: product.id,
                                label: product.name
                            }))
                        })
                    }
                    if (item.dataIndex === "contractCode") {
                        return ({
                            ...item, columns: item.columns.map(((coItem: any) => coItem.dataIndex === "saleType" ? ({
                                ...coItem,
                                type: "select",
                                enum: saleTypeEnum
                            }) : coItem))
                        })
                    }
                    return item
                })}
                dataSource={{}} edit />
            <DetailTitle title="开票明细" />
            <CommonTable haveIndex columns={editInvoicingHead.map((item: any) => {
                switch (item.dataIndex) {
                    case "ticketNumber":
                        return ({
                            ...item,
                            width: 150,
                            title: `* ${item.title}`,
                            render: (value: string, _: any, index) => <Input
                                value={value}
                                maxLength={12}
                                onChange={(event) => handleEditTableChange("ticketNumber", event?.target.value, index)}
                                style={{ width: "100%" }} />
                        })
                    case "taxRate":
                        return ({
                            ...item,
                            title: `* ${item.title}`,
                            render: (value: number, _: any, index) => <InputNumber
                                value={([-1, "-1"].includes(value) || !value) ? 0 : value}
                                step={1}
                                min={0}
                                max={100}
                                formatter={(value: any) => parseFloat(value).toFixed(2)}
                                onChange={(value: number) => handleEditTableChange("taxRate", value, index)}
                            />
                        })
                    default:
                        return item
                }
            })} dataSource={invoicingDetailVos} />
            <Attachment edit dataSource={data?.attachInfoVos} ref={attachRef} />
        </Spin>
    </DetailContent>
}