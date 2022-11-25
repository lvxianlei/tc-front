import React from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, Space, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable, OperationRecord } from "../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
import { taskNoticeEditBaseInfo, taskNoticeDetailSpec, salesAssist } from "./managementDetailData.json"
export default function SalesPlanEdit() {
    const history = useHistory()
    const match: any = useRouteMatch<{ type: "new" | "edit", id: string }>("/project/:entry/:type/salesPlan/:projectId/:id")
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
        <Button key="cacel"
            onClick={() => history.goBack()}
        >返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                columns={taskNoticeEditBaseInfo}
                dataSource={data || {}} />
            <DetailTitle title="特殊要求" />
            <BaseInfo
                columns={taskNoticeDetailSpec}
                dataSource={data || {}} />
            <DetailTitle title="产品信息" />
            <CommonTable
                columns={[
                    {
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    , ...salesAssist as any]}
                scroll={{ x: true }}
                dataSource={data?.productInfos} />
            <DetailTitle title={<nav>
                统计信息
                <span style={{ fontWeight: "normal", fontSize: 14, marginLeft: 16 }}>
                    <span>总基数: <i style={{ color: "#FF8C00", fontStyle: "normal", marginLeft: 6 }}>{data?.totalNumber || 0}</i></span>
                    <span style={{ marginLeft: 18 }}>总重量: <i style={{ color: "#FF8C00", fontStyle: "normal", marginLeft: 6 }}>{data?.totalWeight || 0}</i></span>
                </span>
            </nav>} />
            <CommonTable
                rowKey={(record: any) => record.productCategoryName.toString()}
                columns={[
                    {
                        "title": "产品类型",
                        "dataIndex": "productTypeName"
                    },
                    {
                        "title": "塔型",
                        "dataIndex": "productCategoryName"
                    },
                    {
                        "title": "基数",
                        "dataIndex": "number"
                    },
                    {
                        "title": "重量（吨）",
                        "dataIndex": "totalWeight"
                    }]}
                scroll={{ x: true }}
                dataSource={data?.productCategories} />
            <OperationRecord
                title="审批记录"
                serviceId={match.params.id}
                serviceName="tower-market"
                operateTypeEnum="APPROVAL" />
        </Spin>
    </DetailContent >
}