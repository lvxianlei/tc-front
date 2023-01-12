import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from "react"
import { Spin, Form, Select, Modal, InputNumber, Button, message } from 'antd'
import { DetailTitle, BaseInfo, Attachment, AttachmentRef, CommonTable, PopTableContent } from '../../common'
import { bilinformation, material } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { invoiceSourceOptions, invoiceTypeOptions } from "../../../configuration/DictionaryOptions"
import moment from "moment"
import AuthUtil from "@utils/AuthUtil"
interface EditProps {
    type: "new" | "edit",
    id: string,
    visibleP: boolean
}
interface IResponse {
    readonly records?: [];
}

export default forwardRef(function Edit({ type, id, visibleP }: EditProps, ref) {
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const invoiceSourceEnum = invoiceSourceOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [companyList, setCompanyList] = useState([]);
    const attchsRef = useRef<AttachmentRef>()
    const [baseForm] = Form.useForm()
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [numData, setNumData] = useState<any>({});
    const [detail, setDetail] = useState<any>({})
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            setDetail(result)
            baseForm.setFieldsValue({
                ...result,
                businessId: result.businessId + ',' + result.businessName,
                operator: { id: result.operator, value: result.operatorName },
                invoiceDate: moment(result.invoiceDate),
                receiptVos: {
                    value: result?.receiptNumbers,
                    records: result?.receiptIds?result?.receiptIds.split(',').map((item:any)=>{
                        return {
                            id: item
                        }
                    }):[]
                }
            })
            setPopDataList(result?.receiptVos)
            const totalNum = result?.receiptVos.reduce((pre: any,cur: { num: any; })=>{
                return parseFloat(pre!==null?pre:0) + parseFloat(cur.num!==null?cur.num:0) 
            },0)
            const totalWeight = result?.receiptVos.reduce((pre: any,cur: { totalWeight: any; })=>{
                return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)).toFixed(5) 
            },0)
            const taxPrice = result?.receiptVos.reduce((pre: any,cur: { taxPrice: any; })=>{
                return (parseFloat(pre!==null?pre:0 )+ parseFloat(cur.taxPrice!==null?cur.taxPrice:0 )).toFixed(2)
            },0)
            const unTaxPrice = result?.receiptVos.reduce((pre: any,cur: { totalPrice: any; })=>{
                return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalPrice!==null?cur.totalPrice:0)).toFixed(2)
            },0) 
            setNumData({
                totalNum,
                totalWeight,
                taxPrice,
                unTaxPrice
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
            if([undefined, 0,'0',3,'3',4,'4'].includes(detail?.approval)){
                const baseData = await baseForm.validateFields()
                await saveRun({
                    ...baseData,
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    operator: baseData?.operator.id,
                    approval: false,
                    receiptDtos: popDataList,
                    receiptNumbers: baseData.receiptVos.records?.map((item: any) => {
                        return item.warehousingEntryNumber
                    }).join(',') || data?.receiptNumbers,
                    fileIds: attchsRef.current?.getDataSource().map(item => item.id),
                    invoiceRelationType: 1, // 新加票据是否关联 写死传1
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
                    businessId: baseData.businessId?.split(',')[0],
                    businessName: baseData.businessId?.split(',')[1],
                    operator: baseData?.operator.id,
                    approval: true,
                    receiptDtos: popDataList,
                    receiptNumbers: baseData.receiptVos.records?.map((item: any) => {
                        return item.warehousingEntryNumber
                    }).join(',') || data?.receiptNumbers,
                    fileIds: attchsRef.current?.getDataSource().map(item => item.id),
                    invoiceRelationType: 1, // 新加票据是否关联 写死传1
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
    const resetFields = () => {
        baseForm.resetFields()
        attchsRef.current?.resetFields()
    }

    const handleBaseInfoChange = async (fields: any, allFields: { [key: string]: any }) => {
        if (fields.invoiceSource) {
            console.log(fields.invoiceSource)
            if(['1191','1193'].includes(fields.invoiceSource)){
                baseForm.setFieldsValue({
                    businessType: 3,
                    receiptVos:''
                })
                businessTypeChange(3)
                setPopDataList([])
            }else if(['1192','1194'].includes(fields.invoiceSource)){
                baseForm.setFieldsValue({
                    businessType: 2,
                    receiptVos:''
                })
                businessTypeChange(2)
                setPopDataList([])
            }else {
                baseForm.setFieldsValue({
                    businessType: 1,
                    receiptVos:''
                })
                businessTypeChange(1)
                setPopDataList([])
            }
        }
        if (fields.receiptVos) {
            console.log(fields.receiptVos)
            if(fields.receiptVos&&fields.receiptVos?.records.length>0){
                console.log(allFields?.invoiceSource)
                let list:any[] = await RequestUtil.get(`/tower-storage/warehousingEntry/invoice/detail/list?entryStockIds=${fields.receiptVos?.records.map((item:any)=>{return item?.id}).join(',')}`)
                const totalNum = list.reduce((pre: any,cur: { num: any; })=>{
                    return parseFloat(pre!==null?pre:0) + parseFloat(cur.num!==null?cur.num:0) 
                },0)
                const totalWeight = list.reduce((pre: any,cur: { totalWeight: any; })=>{
                    return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)).toFixed(5) 
                },0)
                const taxPrice = list.reduce((pre: any,cur: { taxPrice: any; })=>{
                    return (parseFloat(pre!==null?pre:0 )+ parseFloat(cur.taxPrice!==null?cur.taxPrice:0 )).toFixed(2)
                },0)
                const unTaxPrice = list.reduce((pre: any,cur: { totalPrice: any; })=>{
                    return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalPrice!==null?cur.totalPrice:0)).toFixed(2)
                },0) 
                setNumData({
                    totalNum,
                    totalWeight,
                    taxPrice,
                    unTaxPrice
                })
                let newList :any[] = []
                if(['1191','1193'].includes(allFields.invoiceSource)){
                    newList = list.map((item:any)=>{
                        return{
                            ...item,
                            invoicePrice: item.transportTaxPrice,
                            totalInvoicePrice: item.totalTransportTaxPrice
                        }
                    })
                }else if(['1192','1194'].includes(allFields.invoiceSource)){
                    newList = list.map((item:any)=>{
                        return{
                            ...item,
                            invoicePrice: item.unloadTaxPrice,
                            totalInvoicePrice: item.totalUnloadTaxPrice
                        }
                    })
                }else {
                    newList = list.map((item:any)=>{
                        return{
                            ...item,
                            invoicePrice: item.taxPrice,
                            totalInvoicePrice: item.totalTaxPrice
                        }
                    })
                }
                setPopDataList(newList)
                const totalInvoicePrice = newList.reduce((pre: any,cur: { totalInvoicePrice: any; })=>{
                    return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalInvoicePrice!==null?cur.totalInvoicePrice:0)).toFixed(2)
                },0) 
                baseForm.setFieldsValue({
                    invoiceAmount: totalInvoicePrice
                })
            }
        }
    }
    const businessTypeChange = async (e: number) => {
        let result: IResponse = {};
        let list: any = {};
        if (e === 1) {
            result = await RequestUtil.get(`/tower-supply/supplier?size=100`);
            list = result?.records?.map((item: { supplierName: string }) => {
                return {
                    ...item,
                    name: item.supplierName
                }
            })
        } else if (e === 2) {
            result = await RequestUtil.get(`/tower-supply/stevedoreCompany?size=100`);
            list = result?.records?.map((item: { stevedoreCompanyName: string }) => {
                return {
                    ...item,
                    name: item.stevedoreCompanyName
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
    useImperativeHandle(ref, () => ({ onSubmit, onSubmitCancel, onSubmitApproval, resetFields }), [ref, onSubmit, onSubmitCancel, onSubmitApproval, resetFields])
    useEffect(() => {
        if (visibleP) {
            baseForm.setFieldsValue({
                operator: {
                    id: AuthUtil.getUserInfo().user_id,
                    value: AuthUtil.getRealName(),
                },
                invoiceDate: moment().format('YYYY-MM-DD')
            })
        }
    }, [visibleP])
    const handleBanlanceChange = (value: number, id: string) => {
        const isMaterial: boolean = baseForm.getFieldValue("invoiceSource")&&['1193','1194','1195'].includes(baseForm.getFieldValue("invoiceSource"))
        const list = popDataList.map((item: any) => {
            if (item.entryStockDetailId === id) {
                return ({
                    ...item,
                    balanceTotalWeight: value,
                    totalInvoicePrice: isMaterial ? item.num*item.invoicePrice : value * item.invoicePrice,
                    priceDifference: 0,
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
        const totalInvoicePrice = list.reduce((pre: any,cur: { totalInvoicePrice: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalInvoicePrice!==null?cur.totalInvoicePrice:0)).toFixed(2)
        },0) 
        baseForm.setFieldsValue({
            invoiceAmount: totalInvoicePrice
        })
        
        
    }
    const handleInvoiceChange = (value: number, id: string) => {
        const isMaterial: boolean = baseForm.getFieldValue("invoiceSource")&&['1193','1194','1195'].includes(baseForm.getFieldValue("invoiceSource"))
        const list = popDataList.map((item: any) => {
            if (item.entryStockDetailId === id) {
                return ({
                    ...item,
                    invoicePrice: value,
                    totalInvoicePrice: isMaterial ? item.num*value : value * item.balanceTotalWeight,
                    priceDifference: 0, 
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
        const totalInvoicePrice = list.reduce((pre: any,cur: { totalInvoicePrice: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalInvoicePrice!==null?cur.totalInvoicePrice:0)).toFixed(2)
        },0) 
        baseForm.setFieldsValue({
            invoiceAmount: totalInvoicePrice
        })
    }
    const handleTotalInvoiceChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.entryStockDetailId === id) {
                return ({
                    ...item,
                    totalInvoicePrice: value,
                    priceDifference: value - item?.invoicePrice*item.balanceTotalWeight ,
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
        const totalInvoicePrice = list.reduce((pre: any,cur: { totalInvoicePrice: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalInvoicePrice!==null?cur.totalInvoicePrice:0)).toFixed(2)
        },0) 
        baseForm.setFieldsValue({
            invoiceAmount: totalInvoicePrice
        })
    }
    return <Spin spinning={loading}>
        <DetailTitle title="票据信息" />
        <BaseInfo form={baseForm}  onChange={handleBaseInfoChange} columns={bilinformation.map((item: any) => {
            if (item.dataIndex === "invoiceType") {
                return ({ ...item, type: "select", enum: invoiceTypeEnum })
            }
            if (item.dataIndex === "invoiceSource") {
                return ({ ...item, type: "select", enum: invoiceSourceEnum, disabled: type==='edit' })
            }
            if (item.dataIndex === 'receiptVos') {
                return ({
                    ...item,
                    // disabled: !baseForm.getFieldValue("businessType"),
                    path: `${item.path}?materialType=${baseForm.getFieldValue("invoiceSource")&&['1193','1194','1195'].includes(baseForm.getFieldValue("invoiceSource"))?2:1}&invoiceEntryIds=${detail?.receiptIds?detail?.receiptIds:''}`
                })
            }
            if (item.dataIndex === "invoiceAmount") {
                return ({ ...item, disabled: baseForm.getFieldValue("receiptVos"), })
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
        <DetailTitle title="材料明细" />
        <span>
            数量合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.totalNum||0}</span>
            重量合计(吨)：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.totalWeight||0}</span>
            含税金额合计(元)：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.taxPrice||0}</span>
            不含税金额合计（元）：<span style={{ color: "#FF8C00", marginRight: 12 }}>{ numData?.unTaxPrice ||0}</span>
        </span>
        <CommonTable
            style={{ padding: "0" }}
            rowKey='entryStockDetailId'
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => {
                        return (
                            <span>
                                {index + 1}
                            </span>
                        )
                    }
                },
                ...material.map((item: any) => {
                    if (["balanceTotalWeight"].includes(item.dataIndex)) {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleBanlanceChange(value, records.entryStockDetailId)} key={key} />
                        })
                    }
                    if (["invoicePrice"].includes(item.dataIndex)) {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleInvoiceChange(value, records.entryStockDetailId)} key={key} />
                        })
                    }
                    // if (["totalInvoicePrice"].includes(item.dataIndex)) {
                    //     return ({
                    //         ...item,
                    //         render: (value: number, records: any, key: number) => <InputNumber min={0} value={value || undefined} onChange={(value: number) => handleTotalInvoiceChange(value, records.entryStockDetailId)} key={key} />
                    //     })
                    // }
                    return item;
                })]}
            pagination={false}
            dataSource={[...popDataList]} />
        <Attachment ref={attchsRef} dataSource={baseForm.getFieldsValue(true)?.invoiceAttachInfoVos} edit />
    </Spin>
})