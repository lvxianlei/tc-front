import React, { useEffect, useState } from 'react'
import { Button, Row, Radio, Spin, Modal, message } from 'antd'
import { useHistory, useParams, Link, useRouteMatch, useLocation } from 'react-router-dom'
import { DetailContent, CommonTable } from '../common'
import CostDetail from './cost'
import PayInfo from './payInfo'
import ManagementDetailTabsTitle from './ManagementDetailTabsTitle'
import {
    productGroupColumns, paths, taskNotice,
    productAssist,
} from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import Base from "./baseInfo/Overview"
import BidDoc from "./bidDoc/Overview"
import QualificationReview from "./qualificationReview/Overview"
import BidResult from "./bidResult/Overview"
import FrameAgreement from './frameAgreement/Overview'
// 合同列表
import ContractList from "./contract/ContractList";
import SaleOrder from './order'

import ExportList from '../../components/export/list';
export type TabTypes = "base" | "bidDoc" | "bidResult" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | "payInfo" | undefined
const productAssistStatistics = [
    {
        "title": "塔型",
        "dataIndex": "productCategoryName"
    },
    {
        "title": "基数",
        "dataIndex": "number"
    },
    {
        "title": "重量（吨）",
        "dataIndex": "weight"
    }
]
export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [productGroupFlag, setProductGroupFlag] = useState<"productAssistDetailVos" | "productAssistStatisticsVos">("productAssistDetailVos")
    const [isExport, setIsExportStoreList] = useState(false)
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [contractStatus, setContractStatus] = useState<string>("contract");
    const [contractLoading, setContractLoaing] = useState<boolean>(false);
    const [productGroupData, setProductGroupData] = useState<{ productAssistDetailVos: any[], productAssistStatisticsVos: any[] }>({
        productAssistDetailVos: [],
        productAssistStatisticsVos: []
    })
    const [salesPlanStatus, setSalesPlanStatus] = useState<string>("");
    // 招标结果的开标信息统计数据

    const { loading, data, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        if (params.tab === "contract") {
            resole({})
            return;
        }
        if (["productGroup", "salesPlan"].includes(params.tab as string)) {
            const result: { [key: string]: any } = await RequestUtil.get(`${paths[params.tab || 'base']}`, { projectId: params.id, ...postData })
            if (result && result.records && result.records.length > 0) {
                handleProductGroupClick(result?.records[0].id)
            }
            resole(result)
            return
        }
        if (["base", "bidDoc", "bidResult", "cost", "payInfo", "frameAgreement","qualificationReview"].includes(params.tab as string)) {
            resole({})
            return
        }
        const result: { [key: string]: any } = await RequestUtil.get(`${paths[params.tab || 'base']}/${params.id}`)
        resole(result)

    }), { refreshDeps: [params.tab] })
    const { loading: projectGroupLoading, data: projectGroupData, run: projectGroupRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductAssist?productGroupId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/productGroup/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: noticeLoading, run: noticeRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/taskNotice?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: deleteNoticeLoading, run: deleteNoticeRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/taskNotice?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: noticeAdoptLoading, run: noticeAdoptRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/taskNotice/adopt?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: noticeRejectLoading, run: noticeRejectRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/taskNotice/reject?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const deleteProductGroupItem = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteRun(id)
                    resove("")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    useEffect(() => {
        setSalesPlanStatus("")
    }, [params.tab])

    const deleteSaleOrderItem = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteNoticeRun(id)
                    resove("")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleProductGroupClick = async (id: string) => {
        const result: any = await projectGroupRun(id)
        setProductGroupData(result)
    }

    const handleSubmitAudit = async (saleOrderId: string) => {
        const result = await noticeRun(saleOrderId)
        if (result) {
            message.success("成功提交审核...")
            history.go(0)
        }
    }

    // 点击合同以及订单
    const operationChange = (event: any) => {
        setContractStatus(event.target.value);
        setContractLoaing(true);
        setTimeout(() => {
            setContractLoaing(false);
        }, 500);
    }

    const tabItems: { [key: string]: JSX.Element | React.ReactNode } = {
        tab_base: <Base id={params.id} />,
        tab_cost: <CostDetail />,
        tab_bidDoc: <BidDoc id={params.id} />,
        tab_qualificationReview: <QualificationReview id={params.id} />,
        tab_bidResult: <BidResult id={params.id} />,
        tab_frameAgreement: <FrameAgreement id={params.id} />,
        tab_contract: <>
            <div style={{ padding: "24px 0 10px 24px", boxSizing: "border-box" }}>
                <Radio.Group defaultValue={"contract"} onChange={operationChange}>
                    <Radio.Button value={"contract"} key={`contract`}>合同</Radio.Button>
                    <Radio.Button value={"order"} key={"order"}>订单</Radio.Button>
                </Radio.Group>
            </div>
            <Spin spinning={contractLoading}>
                {
                    contractStatus === "contract" ?
                        <ContractList />
                        :
                        <SaleOrder />
                }
            </Spin>
        </>,
        tab_productGroup: <DetailContent title={[
            <Button key="new" type="primary" onClick={() => history.push(`/project/management/new/productGroup/${params.id}`)} style={{ marginBottom: 16 }}>新增</Button>
        ]}>
            <CommonTable
                columns={[
                    ...productGroupColumns,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        ellipsis: false,
                        width: 250,
                        render: (_: any, record: any) => <>
                            <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => handleProductGroupClick(record.id)}>详情</Button>
                            <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => history.push(`/project/management/productGroup/item/${params.id}/${record.id}`)} >查看</Button>
                            <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => history.push(`/project/management/edit/productGroup/${params.id}/${record.id}`)}>编辑</Button>
                            <Button type="link" size="small" disabled={`${record.status}` !== "0"} onClick={() => deleteProductGroupItem(record.id)} >删除</Button>
                        </>
                    }]}
                dataSource={data?.records}
            />
            <Row style={{ marginBottom: 16 }}><Radio.Group
                value={productGroupFlag}
                onChange={(event: any) => setProductGroupFlag(event.target.value)}
                options={[
                    { label: '明细', value: 'productAssistDetailVos' },
                    { label: '统计', value: 'productAssistStatisticsVos' }
                ]}
                optionType="button"
            /></Row>
            <CommonTable
                // rowKey="productCategoryName"
                columns={productGroupFlag === "productAssistStatisticsVos" ? productAssistStatistics : productAssist}
                dataSource={productGroupData[productGroupFlag]}
            />
        </DetailContent>,
        tab_salesPlan: <DetailContent style={{ paddingTop: 14 }}>
            <Row>
                <Radio.Group
                    defaultValue=""
                    onChange={(event) => {
                        setSalesPlanStatus(event.target.value)
                        run({ taskReviewStatus: event.target.value })
                    }} >
                    <Radio.Button value="">全部</Radio.Button>
                    <Radio.Button value="0" >审批中</Radio.Button>
                    <Radio.Button value="2" >已驳回</Radio.Button>
                    <Radio.Button value="1" >已通过</Radio.Button>
                </Radio.Group>
            </Row>
            <div style={{ width: "100%", display: "flex", flexWrap: "nowrap", justifyContent: "space-between", marginTop: 10, marginBottom: 10 }}>
                {
                    salesPlanStatus === "" && <Button type="primary" onClick={() => history.push(`/project/management/new/salesPlan/${params.id}`)}>新增</Button>
                }
                <Button type="primary" ghost onClick={() => {
                    setIsExportStoreList(true)
                }}>导出</Button>
            </div>
            <CommonTable columns={[
                ...taskNotice.map((item: any) => {
                    if (item.dataIndex === "taskReviewStatus") {
                        return ({
                            ...item,
                            render: (_: any, record: any) => {
                                return <span>
                                    {
                                        record.taskReviewStatus === 0 ?
                                            "审批中" :
                                            record.taskReviewStatus === 1 ?
                                                "审批通过" :
                                                record.taskReviewStatus === 2 ?
                                                    "审批驳回" : "-"
                                    }
                                </span>
                            }
                        })
                    }
                    return item;
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" size="small" className='btn-operation-link' onClick={() => history.push(`/project/management/cat/salesPlan/${params.id}/${record.id}`)}>查看</Button>
                            {/* {record.taskReviewStatus === 0 && <>
                                <Button type="link" size="small" className='btn-operation-link' onClick={async () => {
                                    const result = await noticeAdoptRun(record.id)
                                    result && message.success("审批通过成功...")
                                    history.go(0)
                                }}>审批通过</Button>
                                <Button type="link" size="small" className='btn-operation-link' onClick={async () => {
                                    const result = await noticeRejectRun(record.id)
                                    result && message.success("审批已驳回...")
                                    history.go(0)
                                }}>驳回</Button>
                            </>} */}
                            {[2, -1].includes(record.taskReviewStatus) && <>
                                <Button type="link" size="small" className='btn-operation-link'><Link to={`/project/management/edit/salesPlan/${params.id}/${record.id}`}>编辑</Link></Button>
                                <Button type="link" size="small" className='btn-operation-link' onClick={() => deleteSaleOrderItem(record.id)}>删除</Button>
                                <Button type="link" size="small" className='btn-operation-link' loading={noticeLoading} onClick={() => handleSubmitAudit(record.id)}>提交审批</Button>
                            </>}
                        </>
                    }
                }]} dataSource={data?.records} />
        </DetailContent>,
        tab_payInfo: <PayInfo />
    }
    return <>
        <ManagementDetailTabsTitle />
        <Spin spinning={loading}>
            {tabItems['tab_' + (params.tab || 'base')]}
        </Spin>
        {/* 销售计划导出 (待放开) */}
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => taskNotice as any[]}
            current={data?.current || 1}
            size={data?.size || 10}
            total={data?.total || 0}
            url={`/tower-market/taskNotice`}
            serchObj={{ projectId: params.id }}
            closeExportList={() => { setIsExportStoreList(false) }}
        /> : null}
    </>
}