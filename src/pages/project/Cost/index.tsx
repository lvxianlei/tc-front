import React, { useState } from "react"
import { Result, Button, Spin } from "antd"
import { Link, useHistory, useParams } from "react-router-dom"
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common'
import { consultRecords, costBase, cargoVOListColumns } from '../managementDetailData.json'
import SelectAuditType from "./SelectInquiryType"
import SelectInquiryEdit from "./SelectInquiryEdit"
import SelectInquiryDetail from "./SelectInquiryDetail"
import type { TabTypes } from "../ManagementDetail"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export type SelectType = "selectA" | "selectB" | "selectC"
export default function CostDetail() {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [selectType, setSelectType] = useState<SelectType | "">("")
    const [detailType, setDetailType] = useState<SelectType | "">("")
    const handleNewAudit = () => setVisible(true)
    const handleSelectInquiryTypeOk = (value: SelectType | "") => {
        setSelectType(value)
        setVisible(false)
    }

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const productType: any = await RequestUtil.get(`/tower-market/askInfo?projectId=${params.id}`)
            resole(productType)
        } catch (error) {
            reject(error)
        }
    }))

    return <>
        <SelectInquiryEdit type={selectType} visible={!!selectType} onCancel={() => setSelectType("")} />
        <SelectInquiryDetail type={detailType} visible={!!detailType} onCancel={() => setDetailType("")} />
        <Spin spinning={loading} >
            <SelectAuditType
                visible={visible}
                title="选择询价任务"
                okText="创建"
                onOk={handleSelectInquiryTypeOk}
                onCancel={() => setVisible(false)}
            />
            {!data?.askInfoVo && <Result title="当前项目还未做成本评估" extra={
                <>
                    点击<Link to="/project/management/edit/cost/new">创建</Link>开始成本评估
                </>
            } />}
            {data?.askInfoVo && <DetailContent title={[
                <Button key="push" style={{ marginRight: '16px' }} type="primary" onClick={handleNewAudit}>发起询价任务</Button>,
                <Button key="edit" style={{ marginRight: '16px' }} type="primary" onClick={() => history.push(`/project/management/edit/cost/${params.id}`)}>编辑</Button>,
                <Button key="goback" onClick={() => history.replace("/project/management")}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={costBase.map((item: any) => ["projectLeader", "biddingPerson"].includes(item.dataIndex) ? ({ title: item.title, dataIndex: item.dataIndex }) : item)} dataSource={{}} />
                <DetailTitle title="产品类型成本评估" />
                <DetailTitle title="产品类型:30kv角钢塔" operation={[<Button type="primary" key="delete">删除产品</Button>]} />
                <CommonTable columns={[
                    {
                        title: '序号',
                        dataIndex: 'index',
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...cargoVOListColumns
                ]} dataSource={[]} />
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
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<Button type="link">查看</Button>)
                    }
                ]} dataSource={[]} />
            </DetailContent>}
        </Spin>
    </>
}