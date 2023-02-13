import React, { useRef, useState } from "react"
import { Button, Form, message, Spin, Input, Radio, Modal, Table } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, EditableTable, formatData, Attachment, AttachmentRef } from '../../common'
import { baseInfoHead, invoiceHead, billingHead, saleInvoice, transferHead, revisePlanHead } from "./InvoicingData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import {
    productTypeOptions,
    voltageGradeOptions,
    saleTypeOptions,
    contractPlanStatusOptions,
    currencyTypeOptions
} from "../../../configuration/DictionaryOptions"

export default function Edit() {
    const params = useParams<{ id: string }>()
    const history = useHistory()
    const attchRef = useRef<AttachmentRef>()
    const [when, setWhen] = useState<boolean>(true)
    const [revisePlanModal, setRevisePlanModal] = useState<boolean>(false)

    const [baseInfo] = Form.useForm()
    const [invoiceForm] = Form.useForm()
    const [transferForm] = Form.useForm()

    const [billingForm] = Form.useForm()
    const [saleInvoiceForm] = Form.useForm()
    const [tab, setTab] = useState<string>("a")

    // tab 数据
    const [invoicingDetailDtos, setInvoicingDetailDtos] = useState<any[]>([])
    const [saleInvoiceDtos, setSaleInvoiceDtos] = useState<any[]>([])
    // 计划弹窗数据源
    const [planCodeData, setPlanCodeData] = useState<any[]>([])
    const [planSelectedData, setPlanSelectedData] = useState<any[]>([])

    // 保存销售发票
    const handleRadioChange = async (e: any) => {
        if (tab === 'a') {
            try {
                const billingData = await billingForm.validateFields()
                setTab(e.target.value)
                setInvoicingDetailDtos(billingData?.submit?.map((item: any) => ({
                    ...item,
                    id: item.savedId ? item.savedId : null,
                })))
            } catch (error) {
                console.log(error)
                setTab('a')
            }
            return
        }
        if (tab === 'c') {
            try {
                const saleInvoiceData = await saleInvoiceForm.validateFields();
                setTab(e.target.value)
                setSaleInvoiceDtos(saleInvoiceData?.submit)
            } catch (error) {
                console.log(error)
                setTab('c')
            }
            return
        }
    }

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo?id=${params.id}`)
            billingForm.setFieldsValue({ submit: result.invoicingDetailVos.map((item: any) => formatData(billingHead, item)) })
            resole({
                ...result,
                invoicingInfoVo: {
                    ...result.invoicingInfoVo,
                    name: {
                        value: result.invoicingInfoVo.name,
                        id: result.invoicingInfoVo.customerId,
                    }
                }

            })
        } catch (error) {
            reject(error)
        }
    }), {
        manual: params.id === "new",
        onSuccess: (data) => {
            let invoicingSaleVOS = data?.invoicingSaleVOS || []
            invoicingSaleVOS = invoicingSaleVOS.map((item: any) => ({
                ...item,
                savedId: item.id,
                ticketType: data?.ticketType
            }))
            setSaleInvoiceDtos(invoicingSaleVOS)
            let invoicingDetailVos = data?.invoicingDetailVos || []
            invoicingDetailVos = invoicingDetailVos.map((item: any) => ({ ...item, savedId: item.id }))
            setInvoicingDetailDtos(invoicingDetailVos)
            setPlanSelectedData(data?.planCode?.split(','))
        }
    })

    const { run: logicWeightRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/getLogicWeightByContractId?contractId=
            ${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true, })

    const {
        run: getPlanList
    } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            let internalNumber = baseInfo.getFieldValue("contractCode")?.value ? baseInfo.getFieldValue("contractCode")?.value : baseInfo.getFieldValue("contractCode")
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice`, {
                internalNumber
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {
        manual: true,
        onSuccess: (data) => {
            setPlanCodeData(data?.records || [])
        }
    })

    const {
        loading: creteLoading,
        run: createRun
    } = useRequest<{ [key: string]: any }>((saveData) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/invoicing`, saveData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const {
        loading: saveLoading,
        run: saveRun
    } = useRequest<{ [key: string]: any }>((saveData) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/invoicing/updateInvoicing`, saveData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async (saveType: 1 | 2) => {
        try {
            const baseInfoData = await baseInfo.validateFields()
            const invoicData = await invoiceForm.validateFields()
            const transferData = await transferForm.validateFields()
            const billingFormData = await billingForm.validateFields()
            const saleInvoiceFormData = await saleInvoiceForm.validateFields()
            if (billingFormData?.submit?.length <= 0) {
                message.warning("至少有一条开票明细...")
                return
            }
            let saveData = {
                ...baseInfoData,
                ...transferData,
                contractId: baseInfoData?.contractCode?.id ? baseInfoData?.contractCode?.id : baseInfoData?.contractId || data?.contractId,
                contractCode: baseInfoData?.contractCode?.value ? baseInfoData?.contractCode?.value : baseInfoData?.contractCode || data?.contractCode,
                fileIds: attchRef.current?.getDataSource().map(item => item.id),
                saveType,
                invoicingInfoDto: {
                    ...invoicData,
                    id: data?.invoicingInfoVo.id || "",
                    name: invoicData.name?.value,
                    customerId: invoicData.name?.id,
                    invoicingId: data?.invoicingInfoVo.invoicingId || ""
                },
            }
            if (tab === "a") {
                saveData = {
                    ...saveData,
                    invoicingDetailDtos: [...billingFormData?.submit?.map((item: any) => ({ ...item, id: item.savedId }))],
                    invoicingSaleDTOS: [...saleInvoiceDtos?.map(item => ({ ...item, id: item.savedId }))],
                }
            }
            if (tab === "c") {
                saveData = {
                    ...saveData,
                    invoicingDetailDtos: [...invoicingDetailDtos.map((item: any) => ({
                        ...item,
                        id: item.savedId
                    }))],
                    invoicingSaleDTOS: [...saleInvoiceFormData?.submit?.map((item: any) => ({
                        ...item,
                        id: item.savedId
                    }))],
                }
            }
            const result = params.id === "new" ? await createRun(saveData) : await saveRun({ ...saveData, id: data?.id })
            if (result) {
                setWhen(false)
                message.success("数据保存成功...")
                history.go(-1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = async (fields: any) => {
        // 选择内部合同号赋值
        if (fields.contractCode) {
            const contractValue = fields.contractCode.records[0]
            const logicWeight = await logicWeightRun(contractValue.id)
            baseInfo.setFieldsValue({
                contractCompany: contractValue.signCustomerName,
                contractSignTime: contractValue.signContractTime,
                reasonWeight: logicWeight.logicWeight,
                planCode: logicWeight.planNumbers,
                planWeight: logicWeight.logicWeight,
                weigh: logicWeight.weigh,
                contractDevTime: contractValue.deliveryTime,
                business: contractValue.salesman,
                projectCode: contractValue.projectNumber, // 项目编码
                contractCode: contractValue.internalNumber,
                contractType: contractValue.contractPlanStatus,
                contractName: contractValue.contractName,
                contractId: contractValue.id
            })
        }
        // 回款占比计算
        if (fields.backProportion) {
            const ticketMoney = baseInfo.getFieldValue("ticketMoney")
            baseInfo.setFieldsValue({
                backMoney: (parseFloat(fields.backProportion || "0") * parseFloat(ticketMoney || "0") * 0.01).toFixed(2)
            })
        }

        // 汇率变化计算人民币金额
        if (fields.exchangeRate) {
            const ticketMoney = baseInfo.getFieldValue("ticketMoney")
            baseInfo.setFieldsValue({
                rmb: (parseFloat(fields.exchangeRate || "0") * parseFloat(ticketMoney || "0") * 0.01).toFixed(2)
            })
        }
    }

    const handleEditTableChange = async (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const currentRowData = fields.submit[fields.submit.length - 1]
            //承诺回款比例
            const backProportion = baseInfo.getFieldValue("backProportion") || "0"
            if (currentRowData.weight || currentRowData.moneyCount) {
                const {
                    weight,
                    moneyCount
                } = allFields.submit.reduce((result: { weight: string, moneyCount: string }, item: any) => ({
                    weight: parseFloat(result.weight || "0") + parseFloat(item.weight || "0"),
                    moneyCount: parseFloat(result.moneyCount || "0") + parseFloat(item.moneyCount || "0")
                }), { weight: "0", moneyCount: "0" })
                const newFields = allFields.submit.map((item: any, index: number) => index === fields.submit.length - 1 ? ({
                    ...item,
                    money: ["0", 0].includes(item.weight) || !item.weight ? "0" : (item.moneyCount / item.weight).toFixed(2)
                }) : item)
                billingForm.setFieldsValue({ submit: newFields })
                baseInfo.setFieldsValue({
                    ticketWeight: weight,
                    ticketMoney: moneyCount,
                    backMoney: (parseFloat(backProportion || "0") * parseFloat(moneyCount || "0") * 0.01).toFixed(2)
                })
            }
        } else {
            baseInfo.setFieldsValue({
                ticketWeight: 0,
                ticketMoney: 0,
                backMoney: 0
            })
        }
    }

    const invoiceTableChange = async (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const ticketType = baseInfo.getFieldValue("ticketType")
            saleInvoiceForm.setFieldsValue({
                submit: allFields.submit?.map((el: any) => ({
                    ...el,
                    ticketType,
                    taxAmount: (parseFloat(el.moneyCount || "0") * parseFloat(el.taxRate || "0") * 0.01).toFixed(2)
                }))
            })
        }
    }

    const handleInvoiceChange = (fields: any) => {
        if (fields.name && (fields.name.value === fields.name.records?.[0].name)) {
            invoiceForm.setFieldsValue({
                address: fields.name.records?.[0].address,
                phone: fields.name.records?.[0].phone
            })
        }
    }

    const revisePlan = async () => {
        if (!baseInfo.getFieldValue('contractCode')) {
            return message.warn("请先选择内部合同...")
        }
        // 根据合同号获取 任务通知单
        await getPlanList()
        let planCode = baseInfo.getFieldValue("planCode")?.split(',')
        setPlanSelectedData(planCode)
        setRevisePlanModal(true)
    }

    const handleModalOk = () => {
        baseInfo.setFieldsValue({
            planCode: planSelectedData.join(","),
        })
        // 重新计划计划重量/过磅重量
        setPlanSelectedData([])
        setRevisePlanModal(false)
    }

    return <DetailContent
        when={when}
        operation={[
            <Button
                type="primary" key="save"
                style={{ marginRight: 16 }}
                loading={saveLoading || creteLoading}
                onClick={() => handleSave(1)}>保存</Button>,
            <Button
                type="primary" key="saveOrSubmit"
                style={{ marginRight: 16 }}
                loading={saveLoading || creteLoading}
                onClick={() => handleSave(2)}>保存并发起审批</Button>,
            <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
        ]}>
        <Spin spinning={loading}>
            <Modal
                width={1011}
                visible={revisePlanModal}
                title="选择项目"
                onCancel={() => {
                    // 重置表单输入
                    // modalRef.current?.resetFields()
                    // 关闭模态框
                    setRevisePlanModal(false)
                }}
                onOk={handleModalOk}>
                <Table
                    size="small"
                    rowKey="planNumber"
                    columns={revisePlanHead}
                    rowSelection={{
                        selectedRowKeys: planSelectedData || [],
                        type: "checkbox",
                        onChange: ids => setPlanSelectedData(ids),
                    }}
                    dataSource={planCodeData}
                />
            </Modal>
            <DetailTitle title="基本信息" />
            <BaseInfo
                onChange={handleBaseInfoChange}
                form={baseInfo}
                columns={baseInfoHead.map((item: any) => {
                    switch (item.dataIndex) {
                        case "productTypeId":
                            return ({
                                ...item,
                                dataIndex: "productTypeId",
                                enum: productTypeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        case "contractCode":
                            return ({
                                ...item,
                                columns: item.columns.map(((coItem: any) => coItem.dataIndex === "saleType" ? ({
                                    ...coItem,
                                    type: "select",
                                    enum: saleTypeOptions?.map(item => ({
                                        value: item.id,
                                        lable: item.name
                                    }))
                                }) : coItem))
                            })
                        case "contractType":
                            return ({
                                ...item,
                                enum: contractPlanStatusOptions?.map(item => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            })
                        case "voltage":
                            return ({
                                ...item,
                                dataIndex: "voltageId",
                                enum: voltageGradeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        case "currencyType":
                            return ({
                                ...item,
                                dataIndex: "currencyType",
                                enum: currencyTypeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        case "planCode":
                            return ({
                                ...item,
                                dataIndex: "planCode",
                                render: (value: string, records: any) => {
                                    return <Form
                                        name="planForm"
                                        form={baseInfo}
                                        onValuesChange={handleBaseInfoChange}
                                    >
                                        <Form.Item
                                            name="planCode"
                                            style={{ width: "100%" }}
                                        >
                                            <Input
                                                defaultValue={records.value}
                                                placeholder="请选择计划号"
                                                style={{ width: "100%" }}
                                                readOnly={true}
                                                addonAfter={
                                                    <Button type='link' key='add'
                                                        onClick={revisePlan}
                                                    >
                                                        调整计划
                                                    </Button>
                                                } />
                                        </Form.Item>
                                    </Form>
                                }
                            })
                        default:
                            return item
                    }
                })}
                dataSource={data || {
                    ticketWeight: '0.0000',
                    ticketMoney: '0.00',
                    ticketType: 2,
                    openTicketType: 1,
                    ticketBasis: 1
                }} edit />

            <DetailTitle title="发票信息" />
            <BaseInfo
                form={invoiceForm}
                columns={invoiceHead}
                onChange={handleInvoiceChange}
                dataSource={data?.invoicingInfoVo || {}} edit />
            <DetailTitle title="移交信息" />
            <BaseInfo
                form={transferForm}
                columns={transferHead}
                dataSource={data || {}} edit />
            <Radio.Group value={tab} onChange={handleRadioChange} style={{ margin: "12px 0" }}>
                <Radio.Button value="a">开票明细</Radio.Button>
                <Radio.Button value="c">销售发票</Radio.Button>
            </Radio.Group>
            {
                tab === "a" && <EditableTable
                    onChange={handleEditTableChange}
                    form={billingForm}
                    haveOpration={true}
                    columns={billingHead.map((item: any) => {
                        if (item.dataIndex === "devName") {
                            return ({
                                ...item,
                                type: "select",
                                enum: productTypeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        }
                        if (item.dataIndex === "currencyType") {
                            return ({
                                ...item,
                                type: "select",
                                enum: currencyTypeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        }
                        return item
                    })}
                    dataSource={invoicingDetailDtos || []} />
            }
            {
                tab === "c" && <EditableTable
                    onChange={invoiceTableChange}
                    form={saleInvoiceForm}
                    haveOpration={true}
                    columns={saleInvoice.map((item: any) => {
                        if (item.dataIndex === "currencyType") {
                            return ({
                                ...item,
                                type: "select",
                                enum: currencyTypeOptions?.map((product: any) => ({
                                    value: product.id,
                                    label: product.name
                                }))
                            })
                        }
                        return item
                    })}
                    dataSource={saleInvoiceDtos || []} />
            }
            <Attachment title="附件" ref={attchRef} edit dataSource={data?.attachInfoVos} />
        </Spin>
    </DetailContent>
}