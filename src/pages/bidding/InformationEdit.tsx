import React from "react";
import { useHistory, useParams } from "react-router-dom"
import { Button, Spin, Form, message } from 'antd'
import { EditTable, DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common'
import { baseInfoData } from './biddingHeadData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
const columns = [
    { title: '分标编号', dataIndex: 'partBidNumber' },
    { title: '货物类别', dataIndex: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber' },
    { title: '数量', dataIndex: 'amount' },
    { title: '单位', dataIndex: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace' }
]

export default function InfomationNew(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [baseInfoForm] = Form.useForm()
    const [bidForm] = Form.useForm()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }))
    const { loading: saveStatus, data: saveResult, run } = useRequest((postData: {}) => new Promise(async (resove, reject) => {
        const data = await RequestUtil.put(`/tower-market/bidInfo`, postData)
        resove(data)
    }), { manual: true })
    const detailData: any = data
    const handleSave = async () => {
        const baseInfoResult = await baseInfoForm.getFieldsValue()
        const bidPackageInfoVOS = await bidForm.getFieldsValue()
        await run({ ...detailData, ...baseInfoResult, bidPackageInfoVOS: bidPackageInfoVOS.submit })
        if (saveResult) {
            message.success('保存成功...')
        }
    }
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent
        operation={[
            <Button key="save" type="primary" onClick={handleSave} loading={saveStatus}>保存</Button>,
            <Button key="new" type="primary" onClick={() => history.goBack()}>取消</Button>
        ]}
    >
        <DetailTitle title="基础信息" />
        <BaseInfo form={baseInfoForm} columns={baseInfoData} dataSource={detailData} edit />
        <EditTable form={bidForm} columns={columns} dataSource={detailData.bidPackageInfoDTOList} />
        <DetailTitle title="附件" operation={[<Button key="su" type="primary" >上传附件</Button>]} />
        <CommonTable columns={[
            { title: '文件名', dataIndex: 'name' },
            { title: '大小', dataIndex: 'fileSize' },
            { title: '上传人', dataIndex: 'userName' },
            { title: '上传时间', dataIndex: 'fileUploadTime' }
        ]} dataSource={detailData.attachVos} />
    </DetailContent>
}