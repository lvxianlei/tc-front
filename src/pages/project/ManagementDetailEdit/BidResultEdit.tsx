import React, { useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Button, Tabs, Table, Form, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidInfoColumns } from '../managementDetailData.json'
import { TabsCanEdit } from "../bidResult"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
const postBaseData = {
    batch: 0,
    bidOpenRecordDtos: [],
    date: 2019,
    delBidOpenByIds: [],
    delRound: [],
    description: "",
    id: -1,
    isBid: 10,
    projectId: 111,
    roundCount: 10
}
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const ref = useRef()
    const params = useParams<{ id: string, tab: string }>()
    const [baseInfoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${params.id}`)
        baseInfoForm.setFieldsValue(result)
        resole(result)
    }))
    const { loading: saveStatus, data: saveResult, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/bidBase`, postData)
        resole(result)
    }), { manual: true })

    const handleSubmit = async () => {
        const tabsData = (ref.current as any).getData()
        const baseInfoData = await baseInfoForm.getFieldsValue()
        console.log(tabsData)
        await run({ ...postBaseData, ...baseInfoData, projectId: params.id, date: baseInfoData.date.year && baseInfoData.date.year(), id: data?.id })
    }

    return (<DetailContent operation={[<Button key="save" type="primary" onClick={handleSubmit}>保存</Button>]}>
        <ManagementDetailTabsTitle />
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseInfoForm} edit columns={[
                {
                    title: '年份',
                    dataIndex: 'date',
                    type: "date",
                    format: "YYYY",
                    picker: "year"
                },
                {
                    title: '批次',
                    dataIndex: 'batch',
                    type: "number"
                }, {
                    title: '备注',
                    dataIndex: 'description'
                },
                {
                    title: '是否中标',
                    dataIndex: "isBid",
                    type: "select",
                    enum: [
                        {
                            value: 0,
                            label: "未公布"
                        },
                        {
                            value: 1,
                            label: "是"
                        },
                        {
                            value: 2,
                            label: "否"
                        }
                    ]
                }]} dataSource={data || {}} />
            <DetailTitle title="开标信息" operation={[<Button key="new" type="primary">新增一轮报价</Button>]} />
            <TabsCanEdit ref={ref} data={[
                {
                    title: "第一轮",
                    content: <>abc</>,
                    key: "第一轮",
                },
                {
                    title: "第二轮",
                    content: "",

                    key: "第二轮",
                },
            ]} />
        </Spin>
    </DetailContent>)
}