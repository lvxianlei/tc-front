import React, { useImperativeHandle, forwardRef, useState, useRef } from "react"
import { Spin, Form, Select, TreeSelect, message } from 'antd'
import { DetailContent, BaseInfo, formatData, Attachment, AttachmentRef } from '../../common'
import { ApplicationList } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { costTypeOptions, invoiceTypeOptions, invoiceSourceOptions ,paymentMethodOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    id: string
}

interface IResponse {
    readonly records?: [];
}
const wrapRole2DataNode: (data: any) => any[] = (data: any[]) => {
    return data.map((item: any) => ({
        title: item.name,
        value: item.id,
        disabled: item.type === 2 || item.parentId === '0',
        children: item.children ? wrapRole2DataNode(item.children) : []
    }))
}
export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [baseForm] = Form.useForm()
    const [companyList, setCompanyList] = useState([]);
    const attachRef = useRef<AttachmentRef>()
    const [pleasePayType, setPleasePayType] = useState('');
    const [sourceData, setSourceData] = useState<any[]>([]);
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const invoiceSourceEnum = invoiceSourceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const paymentMethodEnum = paymentMethodOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const [detail, setDetail] = useState<any>({});

    // 存储
    const [baseInfoColumn, setBaseInfoColumn] = useState<any[]>(ApplicationList);

    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/department`)
            resole(wrapRole2DataNode(result))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            setDetail(result)
            /**
             * 根据付款类型重置表头，根据不同的付款类型，处理不同回显操作
             */
            handleBaseColumn(result?.paymentReqType, result?.businessType)
            baseForm.setFieldsValue({
                ...result,
                businessId: result.businessId + ',' + result.businessName,
                relatednotes: result.applyPaymentInvoiceVos&&result.applyPaymentInvoiceVos.length>0? {
                    value: result.applyPaymentInvoiceVos?.map((item: any) => item.billNumber).join(","),
                    records: result.applyPaymentInvoiceVos?.map((item: any) => ({
                        invoiceId: item.invoiceId,
                        billNumber: item.billNumber
                    })) || []
                } : "",
                receiptNumbers: result.receiveNumberList&&result.receiveNumberList.length>0? {
                    value: result.receiveNumberList?.map((item: any) => item.receiveNumber).join(","),
                    records: result.receiveNumberList?.map((item: any) => ({
                        id: item.id,
                        receiveNumber: item.receiveNumber
                    })) || []
                } : result?.receiptNumbers
            })
            console.log(result?.paymentReqType !== 2, "编辑")
            businessTypeChange(result.businessType);
            setPleasePayType(result.pleasePayType);
            setSourceData(result?.attachInfoVos || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    // const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any, saveType?: "save" | "saveAndApply") => new Promise(async (resole, reject) => {
    //     try {
    //         if (saveType === "saveAndApply") {
    //             const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment/saveAndStartApplyPayment`, data)
    //             resole(result)
    //             return
    //         } else {
    //             const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment`, data)
    //             resole(result)
    //             return
    //         }
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { manual: true })
    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment`, { ...postData, id: data?.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            if([undefined, 0,'0',3,'3',4,'4'].includes(detail?.approval)){
                const baseData = await baseForm.validateFields()
                await saveRun({
                    ...baseData,
                    pleasePayOrganization: perData?.dept,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id), 
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    receivingNoteList: baseData.receiptNumbers.records&&baseData.receiptNumbers.records.length>0?baseData.receiptNumbers?.records?.map((item: any) => ({
                        id: item.id,
                        receiveNumber: item.receiveNumber
                    })):[],
                    isApproval:0,
                    applyPaymentInvoiceDtos: baseData.relatednotes?.records&&baseData.relatednotes?.records.length>0?baseData.relatednotes?.records?.map((item: any) => ({
                        invoiceId: item.id,
                        billNumber: item.billNumber
                    })) :data?.applyPaymentInvoiceVos?data?.applyPaymentInvoiceVos:[],
                    receiptNumbers: baseData.receiptNumbers.records&&baseData.receiptNumbers.records.length>0?baseData.receiptNumbers?.records?.map((item: any) => {
                        return item.value
                    }).join(',') :data?.receiptNumbers? data?.receiptNumbers:'',
                })
                message.success("保存成功...")
                resolve(true)
            }else if([2,'2'].includes(detail?.approval)){
                message.error("当前数据已审批，修改后请重新发起审批！")
                throw new Error('审批通过数据，修改后只能重新发起审批！！')
            }else{
                message.error("当前正在审批中，请撤销审批后再进行修改！")
                throw new Error('当前正在审批，不可修改！')
            }
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
    const onSubmitApproval = () => new Promise(async (resove, reject) => {
        try {
            if([undefined,0,'0',2,'2',3,'3',4,'4'].includes(detail?.approval)){
                const baseData = await baseForm.validateFields()
                await saveRun({
                    ...baseData,
                    pleasePayOrganization: perData?.dept,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id), 
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    receivingNoteList: baseData.receiptNumbers.records&&baseData.receiptNumbers.records.length>0?baseData.receiptNumbers?.records?.map((item: any) => ({
                        id: item.id,
                        receiveNumber: item.receiveNumber
                    })):[],
                    isApproval:0,
                    applyPaymentInvoiceDtos: baseData.relatednotes?.records&&baseData.relatednotes?.records.length>0?baseData.relatednotes?.records?.map((item: any) => ({
                        invoiceId: item.id,
                        billNumber: item.billNumber
                    })) :data?.applyPaymentInvoiceVos?data?.applyPaymentInvoiceVos:[],
                    receiptNumbers: baseData.receiptNumbers.records&&baseData.receiptNumbers.records.length>0?baseData.receiptNumbers?.records?.map((item: any) => {
                        return item.value
                    }).join(',') :data?.receiptNumbers? data?.receiptNumbers:'',
                })
                message.success("审批发起成功...")
                resove(true)
            }else{
                message.error("当前不可发起审批！")
                throw new Error('当前不可发起审批！')
            }
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
    const onSubmitCancel = () => new Promise(async (resove, reject) => {
        try {
            if([1,'1'].includes(detail?.approval)){
                await RequestUtil.get(`/tower-supply/workflow/invoice/cancel/${id}`)
                message.success("撤销成功...")
                resove(true)
            }
            else{
                await message.error("不可撤销...")
                throw new Error('不可撤销')
            }
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, onSubmitApproval, onSubmitCancel, resetFields }), [ref, onSubmit, onSubmitCancel, onSubmitApproval])

    const resetFields = () => {
        baseForm.resetFields()
    }

    const handleBaseInfoChange = (fields: any, allFields: { [key: string]: any }) => {
        if (fields.relatednotes) {
            let pleasePayAmount = "0.00"
            fields.relatednotes.records.forEach((item: any) => {
                pleasePayAmount = (parseFloat(pleasePayAmount) + parseFloat(item.invoiceAmount || "0")).toFixed(2)
            })
            const result = baseInfoColumn.map(((item: any) => {
                if(item.dataIndex==='receiptNumbers'){
                    return{
                        ...item,
                        disabled:true
                    }
                }
                return item
            }))
            setBaseInfoColumn(result.slice(0))
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

        if (fields.receiptNumbers) {
            baseForm.setFieldsValue({
                receiptNumbers: {
                    value: fields.receiptNumbers.records.map((item: any) => item.warehousingEntryNumber).join(","),
                    records: fields.receiptNumbers.records.map((item: any) => ({ ...item, receiveNumber: item.warehousingEntryNumber }))
                }
            })
        }

        // if (fields.businessType || fields.pleasePayType) {
        //     if (allFields.paymentReqType !== 2) {
        //         const result = baseInfoColumn.map(((item: any) => {
                    
        //             return item
        //         }))
        //         setBaseInfoColumn(result.slice(0))
        //         baseForm.setFieldsValue({
        //             receiptNumbers: ""
        //         })
        //     }
        // }

        // 付款类型变化
        if (fields.paymentReqType) {
            /**
             * 关联票据： 当选择货到票到付款时需选择，当选择预付款或货到付款时无需选择填写
             * 关联收货单：当未关联票据时，手动选择
             * 请款金额：当未关联票据时，手动输入
             */
            handleBaseColumn(fields.paymentReqType, allFields.businessType)
            baseForm.setFieldsValue({
                receiptNumbers: "",
                relatednotes: "",
                pleasePayAmount: ""
            })
        }
    }

    // 根据付款类型不同去处理表头
    const handleBaseColumn = (type: number, businessType: any) => {
        if (type === 2) {
            // 货到票到付款
            const result = baseInfoColumn.map(((item: any) => {
                if (item.dataIndex === "pleasePayAmount") {
                    return ({
                        "title": "请款金额",
                        "dataIndex": "pleasePayAmount",
                        "type": "number",
                        "precision": 2,
                        "disabled": true
                    })
                }
                return item
            }))
            setBaseInfoColumn(result.slice(0))
        } else {
            const result = baseInfoColumn.map(((item: any) => {
                if (item.dataIndex === "pleasePayAmount") {
                    return ({
                        "title": "请款金额",
                        "dataIndex": "pleasePayAmount",
                        "disabled": false,
                        "type": "number",
                        "precision": 2,
                        "rules": [
                            {
                                "required": true,
                                "message": "请输入请款金额"
                            }
                        ]
                    })
                }
                return item
            }))
            setBaseInfoColumn(result.slice(0))
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


    // 获取当前操作人信息
    const { run: getCurrentPersonRun, data: perData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/personalCenter`)
            resole(result)
            if (type === "new") {
                baseForm.setFieldsValue({
                    pleasePayOrganizationName: result?.deptName,
                    pleasePayOrganization: result?.dept
                })
            }
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent>
        <Spin spinning={loading}>
            <BaseInfo form={baseForm} onChange={handleBaseInfoChange} columns={baseInfoColumn.map((item: any) => {
                switch (item.dataIndex) {
                    case "relatednotes":
                        return ({
                            ...item,
                            columns: item.columns.map((item: any) => item.dataIndex === "invoiceType" ? ({
                                ...item,
                                type: "select",
                                enum: invoiceTypeEnum
                            }) :item.dataIndex === "invoiceSource" ? ({
                                ...item,
                                type: "select",
                                enum: invoiceSourceEnum
                            })
                            : item)
                        })
                    case "receiptNumbers":
                        return ({
                            ...item,
                            disabled: baseForm.getFieldsValue(true).relatednotes
                        })
                    case "pleasePayType":
                        return ({
                            ...item, render: (data: any, props: any) => {
                                return <Form.Item name="pleasePayType" style={{ width: '100%' }}>
                                    <Select disabled={type === 'edit'}  onChange={(e: string) => {
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
                    // case "pleasePayOrganization":
                    //     return ({
                    //         ...item,
                    //         // enum: deptData,
                    //         render: (data: any, props: any) => <TreeSelect
                    //             {...props}
                    //             style={{ width: '100%' }}
                    //             treeData={deptData as any}
                    //         />
                    //     })
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
                                    <Select disabled={type === 'edit'} showSearch onChange={(e: string) => businessIdChange(e)}>
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
            
            <Attachment
                dataSource={ sourceData }
                ref={attachRef}
                edit
            />
        </Spin>
    </DetailContent>
})