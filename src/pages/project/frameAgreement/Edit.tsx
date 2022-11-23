import React, { useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { frameAgreementColumns, materialListColumns } from './frame.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { changeTwoDecimal_f } from '../../../utils/KeepDecimals';
import { deliverywayOptions, winBidTypeOptions } from "../../../configuration/DictionaryOptions"
const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))
const winBidTypeEnum = winBidTypeOptions?.map((item: { id: string, name: string | number }) => ({
    value: item.id,
    label: item.name
}))

export default function FrameAgreementEdit(): JSX.Element {
    const history = useHistory()
    const match: any = useRouteMatch<{
        type: "new" | "edit",
        projectId: string
    }>("/project/management/:type/frameAgreement/:projectId")
    const [when, setWhen] = useState<boolean>(true)
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/frameAgreement/${match.params.projectId}`)
            baseInfoForm.setFieldsValue({
                ...result,
                bidType: result.bidType === -1 ? null : result.bidType,
                saleType: result.saleType === -1 ? null : result.saleType,
                isIta: result.isIta === -1 ? null : result.isIta,
                isReceivedContract: result.isReceivedContract === -1 ? null : result.isReceivedContract,
            })
            cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: match.params.type === "new" })

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
            const postData = {
                ...data,
                ...baseInfoData,
                projectId: match.params.type === "new" ? match.params.projectId : data?.projectId,
                ownerCompany: baseInfoData.ownerCompany.records ? baseInfoData.ownerCompany.records[0].name : baseInfoData.ownerCompany,
                signCompany: baseInfoData.signCompany.records ? baseInfoData.signCompany.records[0].name : baseInfoData.signCompany,
                contractCargoDtos: contractCargoDtosData.submit
            }
            const result = await run(match.params.type === "new" ? postData : {
                ...postData,
                id: match.params.projectId
            })
            if (result) {
                setWhen(false)
                message.success("保存成功...")
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 基本信息修改触发
    const handleBaseInfoChange = (fields: any) => {
        // 预估总重存在
        if (fields.contractWeight) {
            // 执行重量百分比 = 执行重量 / 预估重量 * 100%   保留两位小数
            const result = ((baseInfoForm.getFieldValue("implementWeight") * 1 || 0) / fields.contractWeight) * 100;
            baseInfoForm.setFieldsValue({
                implementWeightPro: changeTwoDecimal_f(result + "")
            })
        }
        // 预估总价存在
        if (fields.contractMoneyCount) {
            // 执行金额百分比 = 执行金额 / 预估总价 * 100%   保留两位小数
            const result = ((baseInfoForm.getFieldValue("implementMoney") * 1 || 0) / fields.contractMoneyCount) * 100;
            baseInfoForm.setFieldsValue({
                implementMoneyPro: changeTwoDecimal_f(result + "")
            })
        }
    }

    return <>
        <ManagementDetailTabsTitle />
        <DetailContent
            when={when}
            operation={[
                <Button key="edit" style={{ marginRight: '16px' }} type="primary" onClick={handleSubmit} loading={saveStatus}>保存</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo form={baseInfoForm}
                    columns={frameAgreementColumns.map((item) => {
                        if (item.dataIndex === "bidType") {
                            return ({
                                ...item,
                                type: "select",
                                enum: winBidTypeEnum
                            })
                        }
                        if (item.dataIndex === "deliveryWay") {
                            return ({
                                ...item,
                                type: "select",
                                enum: deliveryMethodEnum
                            })
                        }
                        return item
                    })}
                    dataSource={
                        {
                            ...data,
                            implementWeight: data?.implementWeight ? changeTwoDecimal_f(data?.implementWeight) : "0.00000000",
                            implementMoney: data?.implementMoney ? changeTwoDecimal_f(data?.implementMoney) : "0.00",
                            implementWeightPro: data?.implementWeightPro ? data?.implementWeightPro : "0.00",
                            implementMoneyPro: data?.implementMoneyPro ? data?.implementMoneyPro : "0.00",
                        }
                        || {
                            implementWeight: "0.00000000",
                            implementMoney: "0.00",
                            implementWeightPro: "0.00",
                            implementMoneyPro: "0.00"
                        }
                    } edit
                    onChange={handleBaseInfoChange}
                />
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