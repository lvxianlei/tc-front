import React, { useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
import { taskNoticeEditBaseInfo, taskNoticeEditSpec, salesAssist } from "./managementDetailData.json"
import ApplicationContext from "../../configuration/ApplicationContext"
export default function SalesPlanEdit() {
    const history = useHistory()
    const materialStandardEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const match: any = useRouteMatch<{ type: "new" | "edit", id: string }>("/project/management/:type/salesPlan/:projectId/:id")
    // const [productDetails, setProductDetails] = useState<any[]>([])
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/${match.params.id}`)
            baseInfoForm.setFieldsValue(result)
            cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
            // setProductDetails(result.productDetails || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="cacel" onClick={() => history.goBack()} >返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={taskNoticeEditBaseInfo} dataSource={data || {}} />
            <DetailTitle title="特殊要求" />
            <BaseInfo columns={taskNoticeEditSpec.map(item => item.dataIndex === "materialStandard" ? ({ ...item, enum: materialStandardEnum }) : item)} dataSource={data || {}} />
            <DetailTitle title="产品信息" />
            <CommonTable columns={salesAssist} scroll={{ x: true }} dataSource={data?.productInfos} />
        </Spin>
    </DetailContent>
}