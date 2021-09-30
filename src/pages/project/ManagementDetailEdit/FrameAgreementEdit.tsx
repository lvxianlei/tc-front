import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { frameAgreementColumns, materialListColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"
import ApplicationContext from "../../../configuration/ApplicationContext"
export default function FrameAgreementEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const dictionaryOptions: any = ApplicationContext.get().dictionaryOption
    const bidType = dictionaryOptions["122"]
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/frameAgreement/${params.id}`)
            baseInfoForm.setFieldsValue({
                ...result,
                bidType: result.bidType === -1 ? null : result.bidType,
                saleType: result.saleType === -1 ? null : result.saleType
            })
            cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/frameAgreement`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const contractCargoDtosData = await cargoDtoForm.validateFields()
            delete data?.contractCargoVos
            const result = await run({ ...data, ...baseInfoData, projectId: params.id, contractCargoDtos: contractCargoDtosData.submit })
            if (result) {
                message.success("保存成功...")
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <ManagementDetailTabsTitle />
        <DetailContent operation={[
            <Button key="edit" style={{ marginRight: '16px' }} type="primary" onClick={handleSubmit} loading={saveStatus}>保存</Button>,
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo form={baseInfoForm}
                    columns={frameAgreementColumns.map((item) => item.dataIndex === "bidType" ? ({
                        ...item,
                        type: "select",
                        enum: bidType.map((bid: any) => ({ value: bid.id, label: bid.name }))
                    }) : item)}
                    dataSource={data || {}} edit />
                <DetailTitle title="合同物资清单" />
                <EditTable form={cargoDtoForm} columns={materialListColumns} dataSource={data?.contractCargoVos} />
                <DetailTitle title="系统信息" />
                <BaseInfo columns={[
                    { title: "最后编辑人", dataIndex: 'updateUserLast' },
                    { title: "最后编辑时间", dataIndex: 'updateTimeLast', type: "date" },
                    { title: "创建人", dataIndex: 'createUserName' },
                    { title: "创建时间", dataIndex: 'createTime', type: "date" }
                ]} dataSource={data || {}} />
            </Spin>
        </DetailContent>
    </>
}