import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Button, Form } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidDocColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"
export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [baseInfoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidDoc/${params.id}`)
        console.log(result)
        baseInfoForm.setFieldsValue(result)
        resole(result)
    }))
    const handleSubmit = async () => {
        const baseInfoData = await baseInfoForm.getFieldsValue()
        console.log({ ...data, ...baseInfoData })
    }
    return <DetailContent
        operation={[
            <Button key="edit" type="primary" onClick={handleSubmit}>保存</Button>,
            <Button key="goback">返回</Button>
        ]}>
        <ManagementDetailTabsTitle />
        <DetailTitle title="标书制作记录表" />
        <BaseInfo form={baseInfoForm} columns={bidDocColumns} dataSource={data || {}} col={4} edit />
        <DetailTitle title="填写记录" />
        <CommonTable columns={[
            { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
            { title: '部门', dataIndex: 'branch' },
            { title: '填写人', dataIndex: 'createUserName' },
            { title: '职位', dataIndex: 'position' },
            { title: '填写时间', dataIndex: 'createTime' },
            { title: '说明', dataIndex: 'description' }
        ]} dataSource={data?.bidBizRecordVos} />
    </DetailContent>
}