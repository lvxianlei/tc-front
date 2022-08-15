import React, { useState } from "react";
import { Button, message, Modal, Radio, Row } from "antd";
import { Link, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { DetailContent, SearchTable } from "../../common";
import { TabTypes } from "../Detail";
import ExportList from '../../../components/export/list';
import RequestUtil from "../../../utils/RequestUtil";
import useRequest from "@ahooksjs/use-request";
import { taskNotice } from "../managementDetailData.json"
export default function Index() {
    const history = useHistory()
    const location = useLocation()
    const match = useRouteMatch()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [salesPlanStatus, setSalesPlanStatus] = useState<string>("");
    const [isExport, setIsExportStoreList] = useState(false)
    const entryPath = params.id ? "management" : "salesPlan"
    const { loading, data, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice`, {
            projectId: params.id, ...postData
        })
        resole(result)
    }), { refreshDeps: [params.tab] })

    const { loading: noticeLoading, run: noticeRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/taskNotice?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: deleteNoticeRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/taskNotice?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

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

    const handleSubmitAudit = async (saleOrderId: string) => {
        const result = await noticeRun(saleOrderId)
        if (result) {
            message.success("成功提交审核...")
            history.go(0)
        }
    }

    return <><DetailContent style={{ paddingTop: 14 }}>
        <SearchTable
            path={`/tower-market/taskNotice?${params.id && params.id !== "undefined" ? `projectId=${params.id}` : undefined}`}
            extraOperation={<>
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
                {
                    salesPlanStatus === "" && <Button
                        type="primary"
                        onClick={() => history.push(
                            `/project/management/new/salesPlan/${params.id}`
                        )
                        }>新增</Button>
                }
                <Button
                    type="primary"
                    ghost
                    onClick={() => setIsExportStoreList(true)}>导出</Button>
            </>}
            columns={[
                ...taskNotice.map((item: any) => {
                    if (item.dataIndex === "taskReviewStatus") {
                        return ({
                            ...item,
                            render: (_: any, record: any) => {
                                return <span>
                                    {record.taskReviewStatus === 0 ?
                                        "审批中" :
                                        record.taskReviewStatus === 1 ?
                                            "审批通过" :
                                            record.taskReviewStatus === 2 ?
                                                "审批驳回" : "-"}
                                </span>;
                            }
                        });
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
                            {[2, -1].includes(record.taskReviewStatus) && <>
                                <Button type="link" size="small" className='btn-operation-link'><Link to={`/project/management/edit/salesPlan/${params.id}/${record.id}`}>编辑</Link></Button>
                                <Button type="link" size="small" className='btn-operation-link' onClick={() => deleteSaleOrderItem(record.id)}>删除</Button>
                                <Button type="link" size="small" className='btn-operation-link' loading={noticeLoading} onClick={() => handleSubmitAudit(record.id)}>提交审批</Button>
                            </>}
                        </>;
                    }
                }
            ]} searchFormItems={[]} />
    </DetailContent>
        {isExport && <ExportList
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
        />}
    </>
}