import React, {useRef, useState} from "react"
import {Button, Form, message, Spin, Input, Radio, Modal,Table} from 'antd'
import {useHistory, useParams} from 'react-router-dom'
import {DetailContent, DetailTitle, BaseInfo, EditTable, formatData, Attachment, AttachmentRef} from '../../common'
import {baseInfoHead, invoiceHead, billingHead, saleInvoice, transferHead,revisePlanHead} from "./InvoicingData.json"
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

    const [planForm] = Form.useForm()
    const [tab, setTab] = useState<string>("a")

    // tab 数据
    const [invoicingDetailDtos, setInvoicingDetailDtos] = useState<any[]>([])
    const [saleInvoiceDtos, setSaleInvoiceDtos] = useState<any[]>([])
    // 计划弹窗数据源
    const [planCodeData, setPlanCodeData] = useState<any[]>([{id:1}])

    const handleRadioChange = async (e: any) => {
        console.log(e)
        console.log(tab)
        // 数据未保存
        if (tab === 'a') {
            const billingData = await billingForm.validateFields();
            console.log(billingData)
            setInvoicingDetailDtos(billingData?.submit)
        }
        if (tab === 'c') {
            const saleInvoiceData = await saleInvoiceForm.validateFields();
            console.log(saleInvoiceData)
            setSaleInvoiceDtos(saleInvoiceData?.submit)
        }
        setTab(e.target.value)
    }
    const {loading, data} = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
            billingForm.setFieldsValue({submit: result.invoicingDetailVos.map((item: any) => formatData(billingHead, item))})
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
    }), {manual: params.id === "new"})

    const {run: logicWeightRun} = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/getLogicWeightByContractId?contractId=
            ${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

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
    }), {manual: true})

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
    }), {manual: true})

    const handleSave = async (saveType: 1 | 2) => {
        try {
            const baseInfoData = await baseInfo.validateFields()
            const invoicData = await invoiceForm.validateFields()
            const billingData = await billingForm.validateFields()
            console.log(billingData)
            if (billingData.submit.length === 0) {
                message.warning("至少有一条开票明细...")
                return
            }
            const saveData = {
                ...baseInfoData,
                contractCode: baseInfoData.contractCode || data?.contractCode,
                invoicingDetailDtos: billingData.submit,
                fileIds: attchRef.current?.getDataSource().map(item => item.id),
                saveType,
                invoicingInfoDto: {
                    ...invoicData,
                    id: data?.invoicingInfoVo.id || "",
                    name: invoicData.name?.value,
                    customerId: invoicData.name?.id,
                    invoicingId: data?.invoicingInfoVo.invoicingId || ""
                }
            }
            const result = params.id === "new" ? await createRun(saveData) : await saveRun({...saveData, id: data?.id})
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
        if (fields.contractCode) {
            const contractValue = fields.contractCode.records[0]
            const logicWeight = await logicWeightRun(contractValue.id)
            baseInfo.setFieldsValue({
                contractCompany: contractValue.signCustomerName,
                contractSignTime: contractValue.signContractTime,
                reasonWeight: logicWeight.logicWeight,
                planCode: logicWeight.planNumbers,
                planWeight: logicWeight.logicWeight,
                contractDevTime: contractValue.deliveryTime,
                business: contractValue.salesman,
                projectCode: contractValue.projectNumber, // 项目编码
                contractCode: contractValue.internalNumber,
                contractType: contractValue.contractPlanStatus,
                contractName: contractValue.contractName
            })
        }
        if (fields.backProportion) {
            const ticketMoney = baseInfo.getFieldValue("ticketMoney")
            console.log(ticketMoney)
            baseInfo.setFieldsValue({
                backMoney: (parseFloat(fields.backProportion) * parseFloat(ticketMoney || "0") * 0.01).toFixed(2)
            })
        }
    }

    const handleEditTableChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const currentRowData = fields.submit[fields.submit.length - 1]
            console.log(currentRowData)
            //承诺回款比例
            const backProportion = baseInfo.getFieldValue("backProportion") || "0"
            if (currentRowData.weight || currentRowData.moneyCount) {
                const {
                    weight,
                    moneyCount
                } = allFields.submit.reduce((result: { weight: string, moneyCount: string }, item: any) => ({
                    weight: parseFloat(result.weight || "0") + parseFloat(item.weight || "0"),
                    moneyCount: parseFloat(result.moneyCount || "0") + parseFloat(item.moneyCount || "0")
                }), {weight: "0", moneyCount: "0"})
                const newFields = allFields.submit.map((item: any, index: number) => index === fields.submit.length - 1 ? ({
                    ...item,
                    money: ["0", 0].includes(item.weight) || !item.weight ? "0" : (item.moneyCount / item.weight).toFixed(2)
                }) : item)
                billingForm.setFieldsValue({submit: newFields})
                baseInfo.setFieldsValue({
                    ticketWeight: weight,
                    ticketMoney: moneyCount,
                    backMoney: (parseFloat(backProportion) * parseFloat(moneyCount || "0") * 0.01).toFixed(2)
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

    const handleInvoiceChange = (fields: any) => {
        if (fields.name && (fields.name.value === fields.name.records?.[0].name)) {
            invoiceForm.setFieldsValue({
                address: fields.name.records?.[0].address,
                phone: fields.name.records?.[0].phone
            })
        }
    }

    const revisePlan = ()=>{
        setRevisePlanModal(true)
    }
    const planChange = () => {

    }
    const handleModalOk = () => {

    }
    const onPlanChange = ()=>{

    }
    return <DetailContent
        when={when}
        operation={[
            <Button
                type="primary" key="save"
                style={{marginRight: 16}}
                loading={saveLoading || creteLoading}
                onClick={() => handleSave(1)}>保存</Button>,
            <Button
                type="primary" key="saveOrSubmit"
                style={{marginRight: 16}}
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
                    rowKey="id"
                    columns={revisePlanHead}
                    rowSelection={{
                        selectedRowKeys: data?.planCode|| [],
                        type: "checkbox",
                        onChange: onPlanChange,
                    }}
                    dataSource={planCodeData}
                />
            </Modal>
            <DetailTitle title="基本信息"/>
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
                        case "moneyType":
                            return ({
                                ...item,
                                dataIndex: "moneyType",
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
                                        form={planForm}
                                        onValuesChange={planChange}
                                    >
                                        <Form.Item
                                            name="planCode"
                                            style={{width: "100%"}}
                                        >
                                            <Input
                                                defaultValue={records.value}
                                                placeholder="请选择计划号"
                                                style={{width: "100%"}}
                                                onChange={(event) => {
                                                }}
                                                addonAfter={
                                                    <Button type='link' key='add'
                                                        onClick={revisePlan}
                                                    >
                                                        调整计划
                                                    </Button>
                                                }/>
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
                    ticketType: 1,
                    openTicketType: 1,
                    ticketBasis: 1
                }} edit/>

            <DetailTitle title="发票信息"/>
            <BaseInfo
                form={invoiceForm}
                columns={invoiceHead}
                onChange={handleInvoiceChange}
                dataSource={data?.invoicingInfoVo || {}} edit/>

            <DetailTitle title="移交信息"/>
            <BaseInfo
                form={transferForm}
                columns={transferHead}
                // onChange={handleInvoiceChange}
                dataSource={data?.invoicingInfoVo || {}} edit/>

            <Radio.Group defaultValue={tab} onChange={handleRadioChange} style={{margin: "12px 0"}}>
                <Radio.Button value="a">开票明细</Radio.Button>
                <Radio.Button value="c">销售发票</Radio.Button>
            </Radio.Group>
            {
                tab === "a" ? <>
                    <EditTable
                        onChange={handleEditTableChange}
                        form={billingForm}
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
                            if (item.dataIndex === "moneyType") {
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
                        dataSource={invoicingDetailDtos || []}/>
                </> : <></>
            }
            {
                tab === "c" ? <>
                    <EditTable
                        onChange={handleEditTableChange}
                        form={saleInvoiceForm}
                        columns={saleInvoice.map((item: any) => {
                            if (item.dataIndex === "moneyType") {
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
                        dataSource={saleInvoiceDtos || []}/>
                </> : <></>
            }
            <div style={{marginTop: "24px"}}></div>
            <Attachment title="附件" ref={attchRef} edit dataSource={data?.attachInfoVos}/>
        </Spin>
    </DetailContent>
}