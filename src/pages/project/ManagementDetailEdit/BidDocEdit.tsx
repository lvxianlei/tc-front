import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Spin, Button, Form, message } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidDocColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"
import ApplicationContext from "../../../configuration/ApplicationContext"
export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const dictionaryOptions: any = ApplicationContext.get().dictionaryOption
    const bidType = dictionaryOptions["124"]
    const [baseInfoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidDoc/${params.id}`)
            if (result.bidType === -1) {
                result.bidType = null
            }
            baseInfoForm.setFieldsValue(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: saveStatus, data: saveResult, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/bidDoc`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const result = await run({ ...data, ...baseInfoData, projectId: params.id })
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
        <DetailContent
            operation={[
                <Button key="edit" type="primary" onClick={handleSubmit} loading={saveStatus} style={{ marginRight: 16 }}>保存</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>

            <Spin spinning={loading}>
                <DetailTitle title="标书制作记录表" />
                <BaseInfo form={baseInfoForm} columns={bidDocColumns.map(item => item.dataIndex === "bidType" ? ({
                    ...item,
                    type: "select",
                    enum: bidType.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
                }) : ({ ...item }))} dataSource={data || {}} col={4} edit />
                <DetailTitle title="填写记录" />
                <CommonTable columns={[
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