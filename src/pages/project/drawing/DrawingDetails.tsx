import React, { useState } from 'react'
import { Spin, Form } from 'antd'
import { useHistory, useParams, Link } from 'react-router-dom'
import { Attachment, BaseInfo, DetailTitle } from '../../common'
import {drawingConfiremationitem} from './Drawingdata.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'



export default function ManagementDetail(): React.ReactNode {

    const [baseInfoForm] = Form.useForm()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
          const addressList: any[] = await RequestUtil.get(`/tower-system/region/00`)
          resole({ addressList: [...addressList.map(item => ({ value: item.name, label: item.name })), { value: "其他-国外", label: "其他-国外" }] })
          baseInfoForm.setFieldsValue({})
        } catch (error) {
          reject(error)
        }
      }),{})

    return <>
         <Spin spinning={loading}>
        <DetailTitle title="图纸确认任务" />
        <BaseInfo
          columns={ 
            drawingConfiremationitem
          } 
          dataSource={ data || {}} edit />
        <Attachment edit  />
      </Spin>    
    </>  
}

