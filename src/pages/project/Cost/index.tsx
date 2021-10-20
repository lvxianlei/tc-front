import React, { useState } from "react"
import { Result, Button, Spin } from "antd"
import { Link, useHistory, useParams } from "react-router-dom"
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common'
import { consultRecords, costBase } from '../managementDetailData.json'
import SelectAuditType from "./SelectInquiryType"
import SelectInquiryEdit from "./SelectInquiryEdit"
import SelectInquiryDetail from "./SelectInquiryDetail"
import type { TabTypes } from "../ManagementDetail"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export type SelectType = "selectA" | "selectB" | "selectC"

const auditCode: any = {
    "selectA": 0,
    "selectB": 1,
    "selectC": 2
}

export default function CostDetail() {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [catAskPriceId, setCatAskPriceId] = useState<string>("")
    const [selectType, setSelectType] = useState<SelectType | "">("")
    const [detailType, setDetailType] = useState<SelectType | "">("")

    const handleNewAudit = () => setVisible(true)

    const handleCatAudit = (type: any, catAskPriceId: string) => {
        console.log((Object.keys(auditCode).find((item: string) => auditCode[item] === type) as any), catAskPriceId)
        setDetailType((Object.keys(auditCode).find((item: string) => auditCode[item] === type) as any))
        setCatAskPriceId(catAskPriceId)
    }

    const handleSelectInquiryTypeOk = (value: SelectType | "") => {
        setSelectType(value)
        setVisible(false)
    }

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [askInfo, askPrice] = await Promise.all([
                RequestUtil.get(`/tower-market/askInfo?projectId=${params.id}`),
                RequestUtil.get(`/tower-market/askPrice?projectId=${params.id}`)])
            resole({ askInfo, askPrice })
        } catch (error) {
            reject(error)
        }
    }))

    return <>
        <SelectInquiryEdit type={selectType} visible={!!selectType} onOk={() => setSelectType("")} onCancel={() => setSelectType("")} destroyOnClose />
        <SelectInquiryDetail type={detailType} visible={!!detailType} onOk={() => setDetailType("")} onCancel={() => setDetailType("")} id={catAskPriceId} destroyOnClose />
        <Spin spinning={loading} >
            <SelectAuditType
                visible={visible}
                title="选择询价任务"
                okText="创建"
                onOk={handleSelectInquiryTypeOk}
                onCancel={() => setVisible(false)}
            />
            {!data?.askInfo?.askInfoVo && <Result title="当前项目还未做成本评估" extra={
                <>
                    点击<Link to={`/project/management/new/cost/${params.id}`}>创建</Link>开始成本评估
                </>
            } />}
            {data?.askInfo?.askInfoVo && <DetailContent title={[
                <Button key="push" style={{ marginRight: '16px' }} type="primary" onClick={handleNewAudit}>发起询价任务</Button>,
                <Button key="edit" style={{ marginRight: '16px' }} type="primary" onClick={() => history.push(`/project/management/edit/cost/${params.id}`)}>编辑</Button>,
                <Button key="goback" onClick={() => history.replace("/project/management")}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    columns={costBase.map((item: any) => ["projectLeader", "biddingPerson"].includes(item.dataIndex) ? ({ title: item.title, dataIndex: item.dataIndex }) : item)}
                    dataSource={data?.askInfo?.askInfoVo || {}} />
                <DetailTitle title="产品类型成本评估" />
                {data?.askInfo?.productArr.map((item: any, index: number) => <div key={index}>
                    <DetailTitle title={`${item.voltage}${item.productName}`} />
                    <CommonTable columns={[
                        {
                            title: '序号',
                            dataIndex: 'index',
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...item.head
                    ]} dataSource={[item.data]} />
                </div>)}
                <DetailTitle title="咨询记录" />
                <CommonTable columns={[
                    {
                        title: '序号',
                        dataIndex: 'index',
                        key: 'index',
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...consultRecords,
                    {
                        title: '咨询结果',
                        dataIndex: 'result',
                        key: 'result',
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<Button type="link" onClick={() => handleCatAudit(_b.askType, _b.id)}>查看</Button>)
                    }
                ]} dataSource={data?.askPrice || []} />
            </DetailContent>}
        </Spin>
    </>
}