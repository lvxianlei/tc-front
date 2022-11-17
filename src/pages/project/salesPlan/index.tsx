import React, { useState } from "react";
import { Button, DatePicker, Input, message, Modal, Radio } from "antd";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { DetailContent, SearchTable } from "../../common";
import { TabTypes } from "../Detail";
import RequestUtil from "../../../utils/RequestUtil";
import useRequest from "@ahooksjs/use-request";
import { taskNotice } from "../managementDetailData.json"

export default function Index() {
    const history = useHistory()
    const location: any = useLocation()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [filterValue, setFilterValue] = useState<{ [key: string]: string }>({ taskReviewStatus: location.state?.taskReviewStatus || '' });
    const entryPath = params.id ? "management" : "salePlan"

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

    const handleFilterSubmit = (value: any) => {
        if (value.startDeliveryTime) {
            const formatDate = value.startDeliveryTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startDeliveryTime = formatDate[0] + " 00:00:00"
            value.endDeliveryTime = formatDate[1] + " 23:59:59"
        }
        if (value.startPlanDeliveryTime) {
            const formatDate = value.startPlanDeliveryTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPlanDeliveryTime = formatDate[0] + " 00:00:00"
            value.endPlanDeliveryTime = formatDate[1] + " 23:59:59"
        }
        if (value.startApprovalTime) {
            const formatDate = value.startApprovalTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startApprovalTime = formatDate[0] + " 00:00:00"
            value.endApprovalTime = formatDate[1] + " 23:59:59"
        }
        return value
    }

    return <DetailContent style={{ paddingTop: 14 }}>
        <SearchTable
            path={`/tower-market/taskNotice?${params.id && params.id !== "undefined" ? `projectId=${params.id}` : ""}`}
            exportPath={`/tower-market/taskNotice?${params.id && params.id !== "undefined" ? `projectId=${params.id}` : ""}`}
            filterValue={filterValue}
            extraOperation={<>
                <Radio.Group
                    value={filterValue.taskReviewStatus}
                    onChange={(event) => setFilterValue({
                        taskReviewStatus: event.target.value
                    })
                    } >
                    <Radio.Button value="">全部</Radio.Button>
                    <Radio.Button value="0" >审批中</Radio.Button>
                    <Radio.Button value="2" >已驳回</Radio.Button>
                    <Radio.Button value="1" >已通过</Radio.Button>
                </Radio.Group>
                {
                    filterValue.taskReviewStatus === "" && <Button
                        type="primary"
                        onClick={() => history.push(
                            `/project/${entryPath}/new/salesPlan/${params.id}`
                        )
                        }>新增</Button>
                }
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
                            <Button type="link" size="small" className='btn-operation-link' onClick={() => history.push(`/project/${entryPath}/cat/salesPlan/${params.id}/${record.id}`)}>查看</Button>
                            {[2, -1].includes(record.taskReviewStatus) && <>
                                <Button type="link" size="small" className='btn-operation-link'><Link to={`/project/${entryPath}/edit/salesPlan/${params.id}/${record.id}`}>编辑</Link></Button>
                                <Button type="link" size="small" className='btn-operation-link' onClick={() => deleteSaleOrderItem(record.id)}>删除</Button>
                                <Button type="link" size="small" className='btn-operation-link' loading={noticeLoading} onClick={() => handleSubmitAudit(record.id)}>提交审批</Button>
                            </>}
                        </>;
                    }
                }
            ]}
            searchFormItems={[
                {
                    name: 'planNumber',
                    label: '计划号',
                    children: <Input placeholder="计划号" style={{ width: 210 }} />
                },
                {
                    name: 'internalNumber',
                    label: '内部合同编号',
                    children: <Input placeholder="内部合同编号" style={{ width: 210 }} />
                },
                {
                    name: 'orderProjectName',
                    label: '订单工程名称',
                    children: <Input placeholder="订单工程名称" style={{ width: 210 }} />
                },
                {
                    name: 'startDeliveryTime',
                    label: '客户交货日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'startPlanDeliveryTime',
                    label: '计划交货日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'startApprovalTime',
                    label: '审批完成日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
            ]}
            onFilterSubmit={handleFilterSubmit}
        />
    </DetailContent>
}