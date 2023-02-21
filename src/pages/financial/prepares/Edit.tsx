import React, { useImperativeHandle, forwardRef, useState, useRef } from "react"
import { Spin, Form, Select, TreeSelect } from 'antd'
import { DetailContent, BaseInfo, formatData, Attachment, AttachmentRef } from '../../common'
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
    const paymentMethodEnum = payTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

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
            /**
             * 根据付款类型重置表头，根据不同的付款类型，处理不同回显操作
             */
            handleBaseColumn(result?.paymentReqType, result?.businessType)
            baseForm.setFieldsValue({
                ...result,
                businessId: result.businessId + ',' + result.businessName,
                relatednotes: result?.paymentReqType === 2 ? {
                    value: result.applyPaymentInvoiceVos?.map((item: any) => item.billNumber).join(","),
                    records: result.applyPaymentInvoiceVos?.map((item: any) => ({
                        invoiceId: item.invoiceId,
                        billNumber: item.billNumber
                    })) || []
                } : "",
                receiptNumbers: result?.paymentReqType !== 2 ? {
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
            let postData: any = {};
            // 付款类型为货到票到付款 关联票据
            if (baseData.paymentReqType === 2) { 
                postData = type === "new" ? {
                    ...baseData,
                    pleasePayOrganization: perData?.dept,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id), 
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    applyPaymentInvoiceDtos: baseData.relatednotes.records?.map((item: any) => ({
                        invoiceId: item.id,
                        billNumber: item.billNumber
                    })) || data?.applyPaymentInvoiceVos
                } : {
                    ...baseData,
                    pleasePayOrganization: perData?.dept,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id), 
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
            } else {
                // 其他两种关联票据禁用  关联收货单
                let v: any[] = [];
                baseData.receiptNumbers.records?.map((item: any) => v.push(item.receiveNumber))
                postData = type === "new" ? {
                    ...baseData,
                    pleasePayOrganization: perData?.dept,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id), 
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    receivingNoteList: baseData.receiptNumbers.records?.map((item: any) => ({
                        id: item.id,
                        receiveNumber: item.receiveNumber
                    })),
                    receiptNumbers: v.join(",")
                } : {
                    ...baseData,
                    pleasePayOrganization: perData?.dept,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id), 
                    id: data?.id,
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    receivingNoteList: baseData.receiptNumbers.records?.map((item: any) => ({
                        id: item.id,
                        receiveNumber: item.receiveNumber
                    })),
                    receiptNumbers: v.join(",")
                }
            }
            console.log(postData, "============postData")
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

    const handleBaseInfoChange = (fields: any, allFields: { [key: string]: any }) => {
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

        if (fields.receiptNumbers) {
            baseForm.setFieldsValue({
                receiptNumbers: {
                    value: fields.receiptNumbers.records.map((item: any) => item.receiveNumber).join(","),
                    records: fields.receiptNumbers.records.map((item: any) => ({ ...item, receiveNumber: item.receiveNumber }))
                }
            })
        }

        if (fields.businessType || fields.pleasePayType) {
            if (allFields.paymentReqType !== 2) {
                const result = baseInfoColumn.map(((item: any) => {
                    if (item.dataIndex === "receiptNumbers") {
                        return ({
                            "dataIndex": "receiptNumbers",
                            "title": "关联收货单",
                            "type": "popTable",
                            "path": `/tower-storage/receiveStock?receiveStatus=1&companyRelationStatus=${allFields.businessType || ""}`,
                            "width": 1011,
                            "value": "receiptNumbers",
                            "selectType": "checkbox",
                            "dependencies": true,
                            "readOnly": true,
                            "disabled": false,
                            "search": [
                                {
                                    "title": "月份选择",
                                    "dataIndex": "receiveTime",
                                    "type": "date",
                                    "width": 200
                                },
                                {
                                    "title": "查询",
                                    "dataIndex": "fuzzyQuery",
                                    "width": 200,
                                    "placeholder": "合同编号/收货单号/联系人"
                                }
                            ],
                            "columns": [
                                {
                                    "title": "收货单号",
                                    "dataIndex": "receiveNumber",
                                    "type": "string"
                                },
                                {
                                    "title": "联系人",
                                    "dataIndex": "contactsUser"
                                },
                                {
                                    "title": "合同编号",
                                    "dataIndex": "contractNumber"
                                },
                                {
                                    "title": "完成时间",
                                    "dataIndex": "receiveTime",
                                    "type": "date",
                                    "format": "YYYY-MM-DD"
                                },
                                {
                                    "title": "创建人",
                                    "dataIndex": "createUserName"
                                },
                                {
                                    "title": "重量（吨）合计",
                                    "dataIndex": "weight"
                                },
                                {
                                    "title": "原材料价税合计（元）",
                                    "dataIndex": "price"
                                },
                                {
                                    "title": "运费价税合计（元）",
                                    "dataIndex": "transportPriceCount"
                                },
                                {
                                    "title": "装卸费价税合计（元）",
                                    "dataIndex": "unloadPriceCount"
                                },
                                {
                                    "title": "备注",
                                    "dataIndex": "remark"
                                }
                            ],
                            "rules": [
                                {
                                    "required": true,
                                    "message": "请选择关联收货单"
                                }
                            ]
                        })
                    }
                    return item
                }))
                setBaseInfoColumn(result.slice(0))
                baseForm.setFieldsValue({
                    receiptNumbers: ""
                })
            }
        }

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
                if (item.dataIndex === "relatednotes") {
                    return ({
                        ...item,
                        disabled: false,
                        "rules": [
                            {
                                "required": true,
                                "message": "请选择关联票据..."
                            }
                        ]
                    })
                }
                if (item.dataIndex === "receiptNumbers") {
                    return ({
                        "title": "关联收货单",
                        "dataIndex": "receiptNumbers",
                        "disabled": true,
                    })
                }
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
                if (item.dataIndex === "relatednotes") {
                    return ({
                        ...item,
                        disabled: true,
                        "rules": [
                            {
                                "required": false,
                                "message": "请选择关联票据..."
                            }
                        ]
                    })
                }
                if (item.dataIndex === "receiptNumbers") {
                    return ({
                        "dataIndex": "receiptNumbers",
                        "title": "关联收货单",
                        "type": "popTable",
                        "path": `/tower-storage/receiveStock?receiveStatus=1&companyRelationStatus=${businessType || ""}`,
                        "width": 1011,
                        "value": "receiptNumbers",
                        "selectType": "checkbox",
                        "dependencies": true,
                        "readOnly": true,
                        "disabled": businessType ? false : true,
                        "search": [
                            {
                                "title": "月份选择",
                                "dataIndex": "receiveTime",
                                "type": "date",
                                "width": 200
                            },
                            {
                                "title": "查询",
                                "dataIndex": "fuzzyQuery",
                                "width": 200,
                                "placeholder": "合同编号/收货单号/联系人"
                            }
                        ],
                        "columns": [
                            {
                                "title": "收货单号",
                                "dataIndex": "receiveNumber",
                                "type": "string"
                            },
                            {
                                "title": "联系人",
                                "dataIndex": "contactsUser"
                            },
                            {
                                "title": "合同编号",
                                "dataIndex": "contractNumber"
                            },
                            {
                                "title": "完成时间",
                                "dataIndex": "receiveTime",
                                "type": "date",
                                "format": "YYYY-MM-DD"
                            },
                            {
                                "title": "创建人",
                                "dataIndex": "createUserName"
                            },
                            {
                                "title": "重量（吨）合计",
                                "dataIndex": "weight"
                            },
                            {
                                "title": "原材料价税合计（元）",
                                "dataIndex": "price"
                            },
                            {
                                "title": "运费价税合计（元）",
                                "dataIndex": "transportPriceCount"
                            },
                            {
                                "title": "装卸费价税合计（元）",
                                "dataIndex": "unloadPriceCount"
                            },
                            {
                                "title": "备注",
                                "dataIndex": "remark"
                            }
                        ],
                        "rules": [
                            {
                                "required": true,
                                "message": "请选择关联收货单"
                            }
                        ]
                    })
                }
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
            result = await RequestUtil.get(`/tower-supply/supplier?size=500`);
            list = result?.records?.map((item: { supplierName: string, bankDepositName: string }) => {
                return {
                    ...item,
                    name: item.supplierName,
                    openBank: item.bankDepositName
                }
            })
        } else if (e === 2) {
            result = await RequestUtil.get(`/tower-supply/stevedoreCompany?size=500`);
            list = result?.records?.map((item: { stevedoreCompanyName: string, openBankName: string }) => {
                return {
                    ...item,
                    name: item.stevedoreCompanyName,
                    openBank: item.openBankName
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
            
            <Attachment
                dataSource={ sourceData }
                ref={attachRef}
                edit
            />
        </Spin>
    </DetailContent>
})