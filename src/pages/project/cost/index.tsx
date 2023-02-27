import React, { useState } from "react"
import { Result, Button, Spin, Modal, message, Image } from "antd"
import { Link, useHistory, useParams } from "react-router-dom"
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common'
import { consultRecords, costBase } from '../managementDetailData.json'
import SelectAuditType from "./SelectInquiryType"
import SelectInquiryEdit from "./SelectInquiryEdit"
import SelectInquiryDetail from "./SelectInquiryDetail"
import type { TabTypes } from "../Detail"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import quesheng from "../../../../public/quesheng.png"
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
        setDetailType((Object.keys(auditCode).find((item: string) => auditCode[item] === type) as any))
        setCatAskPriceId(catAskPriceId)
    }

    const handleSelectInquiryTypeOk = (value: SelectType | "") => {
        if (!value) {
            message.error("请您先选择任务类型！")
            return;
        }
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

    const { run: deleteRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.delete(`/tower-market/askInfo/delAskInfoByProId/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const hadleDelete = () => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此成本评估吗？",
            onOk: async () => {
                await deleteRun()
                message.success("删除成功...")
                history.go(0)
            }
        })
    }

    return <>
        <SelectInquiryEdit type={selectType} visible={!!selectType} onOk={() => {
            setSelectType("")
            history.go(0)
        }} onCancel={() => setSelectType("")} destroyOnClose />
        <SelectInquiryDetail type={detailType} visible={!!detailType} onOk={() => setDetailType("")} onCancel={() => setDetailType("")} id={catAskPriceId} destroyOnClose />
        <Spin spinning={loading} >
            <SelectAuditType
                visible={visible}
                title="选择询价任务"
                okText="创建"
                onOk={handleSelectInquiryTypeOk}
                onCancel={() => setVisible(false)}
            />
            {!data?.askInfo?.askInfoVo && <Result style={{ paddingTop: 200 }}
                title="去创建成本评估"
                icon={<img src={quesheng} />}
                extra={<Button type="primary" style={{ width: 70 }}><Link to={`/project/management/new/cost/${params.id}`}>创建</Link></Button>} />
            }
            {data?.askInfo?.askInfoVo && <DetailContent operation={[
                <Button key="push" style={{ marginRight: '12px' }} type="primary" onClick={handleNewAudit}>发起询价任务</Button>,
                <Button key="edit" style={{ marginRight: '12px' }} type="primary" onClick={() => history.push(`/project/management/edit/cost/${params.id}`)}>编辑</Button>,
                <Button key="delete" style={{ marginRight: '12px' }} onClick={hadleDelete}>删除</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" style={{ padding: "0 0 8px 0", }} />
                <BaseInfo
                    columns={costBase.map((item: any) => ["projectLeader", "biddingPerson"].includes(item.dataIndex) ? ({ title: item.title, dataIndex: item.dataIndex }) : item)}
                    dataSource={data?.askInfo?.askInfoVo || {}} />
                {/* <DetailTitle title="产品类型成本评估" /> */}
                <div style={{ fontSize: 16, color: "#181818", fontWeight: "bold", marginBottom: 8 }}>产品类型成本评估</div>
                {data?.askInfo?.productArr.map((item: any, index: number) => <div key={index}>
                    {/* <DetailTitle title={`${item.voltage}kv$`} padding={index === 0 ? true : false} /> */}
                    <div style={{ fontSize: 16, color: "#181818", fontWeight: "bold", marginBottom: 8 }}>
                        <span style={{ color: "#FF8C00", fontSize: 18 }}>{item.voltage}kv&nbsp;&nbsp;</span>
                        {item.productName}
                    </div>
                    <CommonTable columns={[
                        {
                            title: '序号',
                            dataIndex: 'index',
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...item.head
                    ]} dataSource={[item.data]} pagination={false} />
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