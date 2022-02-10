import React, { useState } from "react"
import { Button, Spin, Form, Modal, message } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, EditTable, PopTableContent, formatData, FormItemType } from '../../common'
import { promotionalTourism, contractInformation, contract } from "./collection.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
type ReturnType = 1171 | 1172 | -1 | "-1" | undefined
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [returnType, setReturnType] = useState<ReturnType | string>(-1)
    const [popContent, setPopContent] = useState<{ id: string, value: string, records: any }>({ value: "", id: "", records: {} })
    const [visible, setVisible] = useState<boolean>(false)
    //存取已选中回款计划信息
    const [selectedConstarct, setSelectedConstranct] = useState<string[]>([])
    const [baseForm] = Form.useForm()
    const [contractInfosForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/backMoney/${params.id}`)
            baseForm.setFieldsValue(formatData(promotionalTourism, result))
            contractInfosForm.setFieldsValue(result.backMoneyVOList)
            setReturnType(result.returnType)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/backMoney/ConfirmBackMoney`, { ...data, id: params.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfo = await baseForm.validateFields()
            const confirmBackMoneyInfoDTOList = await contractInfosForm.validateFields()
            if (returnType === 1172) {
                if (confirmBackMoneyInfoDTOList?.submit?.length <= 0) {
                    message.warning("回款类型为合同应收款时，必须选择合同和回款计划")
                    return
                }
                const refundAmountTotol = confirmBackMoneyInfoDTOList.submit.reduce((total: string, item: any) => {
                    return (parseFloat(total) + parseFloat(item.refundAmount)).toFixed(2)
                }, 0)
                if (parseFloat(refundAmountTotol) !== parseFloat(data?.payMoney)) {
                    message.warning("回款金额总和必须等于来款金额")
                    return
                }
            }
            const result = await saveRun({
                ...baseInfo,
                payNum: returnType === 1171 ? baseInfo.payNum?.records?.[0].payNumber || data?.payNum || "" : "",
                confirmBackMoneyInfoDTOList: confirmBackMoneyInfoDTOList?.submit?.map((item: any) => ({
                    ...item,
                    contractId: item.id,
                    paymentPlanId: item.paymentPlanId.id || item.paymentPlanId || ""
                }))
            })
            if (result) {
                message.success("保存成功")
                history.go(-1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.returnType || fields.returnType === 0) {
            setReturnType(fields.returnType)
        }
    }

    const handleOk = async () => {
        const contractInfos = await contractInfosForm.getFieldsValue()
        contractInfosForm.setFieldsValue({
            submit: [
                ...contractInfos.submit,
                {
                    ...popContent.records,
                    key: popContent?.id
                }
            ]
        })
        setVisible(false)
    }

    const handleCancel = () => setVisible(false)

    const handleChange = (event: any) => {
        setPopContent({ id: event[0].id, value: event[0][contract.value || "name" || "id"], records: event[0] })
    }

    const handleContractInfosChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const currentRowData = fields.submit[fields.submit.length - 1]
            if (currentRowData.paymentPlanId) {
                const newFields = allFields.submit.map((item: any, index: number) => index === fields.submit.length - 1 ? ({
                    ...item,
                    returnedAmount: item.paymentPlanId.records[0].returnedAmount || "0",
                    paymentReceived: item.paymentPlanId.records[0].paymentReceived || "0",
                    noPaymentReceived: parseFloat(item.paymentPlanId.records[0].returnedAmount || "0") - parseFloat(item.paymentPlanId.records[0].paymentReceived || "0")
                }) : item)
                contractInfosForm.setFieldsValue({ submit: newFields })
                setSelectedConstranct(allFields.submit.map((item: any) => item.paymentPlanId?.id))
            }
        } else {
            setSelectedConstranct([])
        }
    }

    const getCheckboxProps = (record: any) => {
        return ({
            disabled: selectedConstarct.includes(record.id)
        })
    }

    return <DetailContent operation={[
        <Button key="save" type="primary" loading={saveLoading} style={{ marginRight: 16 }} onClick={handleSubmit}>确认回款信息</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Modal width={1011} title="选择合同" destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <PopTableContent data={contract as any} onChange={handleChange} />
        </Modal>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                onChange={handleBaseInfoChange}
                form={baseForm}
                columns={promotionalTourism.filter((item: any) => returnType === 1171 ? true : item.dataIndex !== "payNum")}
                dataSource={data || {}}
                edit
            />
            {returnType === 1172 && <>
                <DetailTitle title="合同信息" operation={[<Button key="choose" type="primary" ghost onClick={() => setVisible(true)}>选择合同</Button>]} />
                <EditTable
                    form={contractInfosForm}
                    haveNewButton={false}
                    onChange={handleContractInfosChange}
                    columns={contractInformation.map((item: any) => {
                        if (item.dataIndex === "paymentPlanId") {
                            return ({
                                ...item,
                                render: (key: any) => {
                                    return <FormItemType
                                        type={item.type}
                                        data={{
                                            ...item,
                                            path: item.path + contractInfosForm.getFieldsValue().submit[key].id,
                                            getCheckboxProps
                                        }}
                                    />
                                }
                            })
                        }
                        if (item.dataIndex === "refundAmount") {
                            return ({
                                ...item,
                                dependencies: ["paymentPlanId"],
                                rules: [
                                    ...item.rules,
                                    {
                                        validator: (_: any, value: number, fieldKey: number) => new Promise((resove, reject) => {
                                            const records = contractInfosForm.getFieldsValue().submit?.[fieldKey]
                                            if (value > parseFloat(records?.noPaymentReceived)) {
                                                reject("’回款金额‘必须小于或等于’未回款金额‘...")
                                            } else {
                                                resove(value)
                                            }
                                        })
                                    }
                                ]
                            })
                        }
                        return item
                    })}
                    dataSource={[]} />
            </>}
        </Spin>
    </DetailContent>
}