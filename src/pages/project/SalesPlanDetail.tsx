import React from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable, OperationRecord } from "../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
import { taskNoticeEditBaseInfo, taskNoticeEditSpec, salesAssist } from "./managementDetailData.json"
import { materialStandardOptions } from "../../configuration/DictionaryOptions"
export default function SalesPlanEdit() {
    const history = useHistory()
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const match: any = useRouteMatch<{ type: "new" | "edit", id: string }>("/project/management/:type/salesPlan/:projectId/:id")
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/${match.params.id}`)
            baseInfoForm.setFieldsValue(result)
            cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
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
            <OperationRecord title="审批记录" serviceId={match.params.id} serviceName="tower-market" operateTypeEnum="APPROVAL" />
            {/* <DetailTitle title="审批记录" />
            <CommonTable columns={approvalRecord} scroll={{ x: true }} dataSource={data?.approveRecords} /> */}
        </Spin>
    </DetailContent>
}