import React, { useState } from "react"
import { Button, Upload, Form, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, EditTable, formatData } from '../common'
import {PaymentListHead ,paymentinfo,paymentdetail} from "./PaymentData.json"
import { enclosure } from '../project/managementDetailData.json'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from "../../utils/AuthUtil"
import { downLoadFile } from "../../utils"
import ApplicationContext from "../../configuration/ApplicationContext"
export default function Edit() {
    const params = useParams<{ id: string }>()
    const history = useHistory()
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const [baseInfo] = Form.useForm()
    const [invoicForm] = Form.useForm()
    const [billingForm] = Form.useForm()
    const productType: any = (ApplicationContext.get().dictionaryOption as any)["101"]
    const saleTypeEnum: any = (ApplicationContext.get().dictionaryOption as any)["123"].map((item: any) => ({ value: item.code, label: item.name }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
      
    }), { manual: params.id === "new" })

 
    const { loading: creteLoading, run: createRun } = useRequest<{ [key: string]: any }>((saveData) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/Payment`, saveData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((saveData) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/Payment/updatePayment`, saveData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    

  
    return <DetailContent operation={[
      
    ]}>
       
    </DetailContent>
}