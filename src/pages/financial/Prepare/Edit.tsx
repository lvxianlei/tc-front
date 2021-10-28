import React, { useState } from "react"
import { Button, Upload, Form, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, EditTable, formatData } from '../../common'
import { } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
export default function Edit() {
    const params = useParams<{ id: string }>()
    const history = useHistory()

    // const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    //     try {
    //         const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
    //         baseInfo.setFieldsValue({ ...formatData(baseInfoHead, result) })
    //         invoicForm.setFieldsValue({ ...result.invoicingInfoVo })
    //         billingForm.setFieldsValue({ submit: result.invoicingDetailVos.map((item: any) => formatData(billingHead, item)) })
    //         setAttachVosData(result.attachInfoVos)
    //         resole(result)
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { manual: params.id === "new" })

    return <DetailContent operation={[
        // <Button
        //     type="primary" key="save"
        //     style={{ marginRight: 16 }}
        //     loading={saveLoading}
        //     onClick={handleSave}>保存</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        {/* <Spin spinning={loading}> */}
            <DetailTitle title="基本信息" />
           
        {/* </Spin> */}
    </DetailContent>
}