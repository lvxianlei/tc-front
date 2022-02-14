import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { frameAgreementColumns, materialListColumns } from './frame.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../Detail"
import { changeTwoDecimal_f } from '../../../utils/KeepDecimals';
import { winBidTypeOptions } from "../../../configuration/DictionaryOptions"
export default function FrameAgreementEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const bidType = winBidTypeOptions
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/frameAgreement/${params.id}`)
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
            const result = await run({
                ...data,
                ...baseInfoData,
                projectId: params.id,
                ownerCompany: baseInfoData.ownerCompany.records ? baseInfoData.ownerCompany.records[0].name : baseInfoData.ownerCompany,
                signCompany: baseInfoData.signCompany.records ? baseInfoData.signCompany.records[0].name : baseInfoData.signCompany,
                contractCargoDtos: contractCargoDtosData.submit
            })
            if (result) {
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
                        enum: bidType?.map((bid: any) => ({ value: bid.id, label: bid.name }))
                    }) : item)}
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