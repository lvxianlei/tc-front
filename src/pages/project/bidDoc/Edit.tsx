import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Spin, Button, Form, message } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidDocColumns } from './bidDoc.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../Detail"
import { bidTypeOptions, tenderDeliveryMethodOptions } from "../../../configuration/DictionaryOptions"
export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [when, setWhen] = useState<boolean>(true)
    const [baseInfoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidDoc/${params.id}`, { type: 1 })
            if (result.bidType === -1) {
                result.bidType = null
            }
            baseInfoForm.setFieldsValue(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: saveStatus, run: saveRun } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/bidDoc`, { ...postData, type: 1 })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const result = await saveRun({
                ...data,
                ...baseInfoData,
                mackUser: baseInfoData.mackUser?.value,
                mackUserId: baseInfoData.mackUser?.id,
                checkUser: baseInfoData.checkUser?.value,
                checkUserId: baseInfoData.checkUser?.id,
                warrantUser: baseInfoData.warrantUser?.value,
                warrantUserId: baseInfoData.warrantUser?.id,
                projectId: params.id
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
    return <>
        <ManagementDetailTabsTitle />
        <DetailContent
            when={when}
            operation={[
                <Button key="edit" type="primary" onClick={handleSubmit} loading={saveStatus} style={{ marginRight: 16 }}>保存</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <Spin spinning={loading}>
                <DetailTitle title="标书制作记录表" />
                <BaseInfo
                    form={baseInfoForm}
                    columns={bidDocColumns.map((item: any) => {
                        if (item.dataIndex === "bidType") {
                            return ({
                                ...item,
                                type: "select",
                                enum: bidTypeOptions?.map((bid: any) => ({ value: bid.id, label: bid.name }))
                            })
                        }
                        if (item.dataIndex === "deliverId") {
                            // 标书投递方式 需后台提供字典值
                            return ({
                                ...item,
                                type: "select",
                                enum: tenderDeliveryMethodOptions?.map((bid: any) => ({ value: bid.id, label: bid.name }))
                            })
                        }
                        return item
                    })}
                    dataSource={data || {}} edit col={4}
                />
                <DetailTitle title="填写记录" />
                <CommonTable rowKey="createTime" columns={[
                    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                    { title: '部门', dataIndex: 'branch' },
                    { title: '填写人', dataIndex: 'createUserName' },
                    { title: '职位', dataIndex: 'position' },
                    { title: '填写时间', dataIndex: 'createTime' },
                    { title: '说明', dataIndex: 'description' }
                ]} dataSource={data?.bidBizRecordVos} />
            </Spin>
        </DetailContent>
    </>
}