import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, Spin } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { baseInfoData, enclosure, paths, cargoVOListColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"
export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [baseInfoForm] = Form.useForm()
    const [cargoVOListForm] = Form.useForm()
    const [attachVosForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${params.id}`)
        baseInfoForm.setFieldsValue(result)
        cargoVOListForm.setFieldsValue(result.cargoVOList)
        attachVosForm.setFieldsValue(result.attachVos)
        resole(result)
    }))
    const handleSubmit = async () => {
        const baseInfoData = await baseInfoForm.getFieldsValue()
        const cargoVOListData = await cargoVOListForm.getFieldsValue()
        const attachVos = await attachVosForm.getFieldsValue()
        console.log(baseInfoData, cargoVOListData, attachVos)
    }

    return <DetailContent operation={[<Button key="save" type="primary" onClick={handleSubmit}>保存</Button>, <Button key="cacel" onClick={() => history.goBack()}>取消</Button>]}>
        <ManagementDetailTabsTitle />
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseInfoForm} columns={baseInfoData} dataSource={data || {}} edit />
            <DetailTitle title="货物清单" />
            <EditTable form={cargoVOListForm} columns={cargoVOListColumns} dataSource={data?.cargoVOList} />
            <DetailTitle title="附件信息" operation={[<Button key="enclosure" type="default">上传附件</Button>]} />
            <CommonTable columns={enclosure} dataSource={data?.attachVos} />
        </Spin>
    </DetailContent>
}