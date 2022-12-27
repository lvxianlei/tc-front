import React from "react"
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { Button, Spin, Tabs } from "antd";
import { Attachment, BaseInfo, CommonAliTable, DetailContent, DetailTitle } from "../../common"
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
import { contractDetail, orderDetail } from "./contract.json"
import "./Detail.less"
import ManagementContractRefundRecord from "./ContractRefundRecord";
export default function Detail() {
    // const { id: contractId, projectId } = useParams<{ id: string, projectId: string }>()
    const routerMatch = useRouteMatch("/project/:entryPath/detail/contract/:projectId/:id")
    const { id: contractId, projectId, entryPath } = routerMatch?.params as any
    const history = useHistory()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/contract/${contractId}`)
            const orderResult: { [key: string]: any } = await RequestUtil.get("/tower-market/saleOrder", { contractId })
            resole({
                ...result,
                ...result.customerInfoVo,
                payType: result.payType?.split(",") || [],
                orderInfo: orderResult?.records || []
            })
        } catch (error) {
            reject(error)
        }
    }))

    const handleNewRecord = () => history.push(
        `/project/management/pamentRecord/contract/${contractId}/${data?.contractName}/${data?.signCustomerId}/${data?.signCustomerName}/${data?.contractNumber}/${projectId}`
    )

    return <Spin spinning={loading}>
        <DetailContent
            title={<Button type="primary" onClick={handleNewRecord}>添加回款记录</Button>}
            operation={[
                <Button key="setting" type="primary" style={{ marginRight: 16 }}
                onClick={() => history.push(`/project/${entryPath}/edit/contract/${projectId}/${contractId}/${data?.contractType}`)}
                >编辑</Button>,
                <Button key="default" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <Tabs>
                <Tabs.TabPane tab="概况信息" key="1">
                    <DetailTitle title="基本信息" />
                    <BaseInfo columns={contractDetail.filter((item: any) => {
                        if (item.dataIndex === "country") {
                            return data?.region === "其他-国外"
                        }
                        return true
                    })} dataSource={data || {}} />
                    <DetailTitle title="订单信息" />
                    <CommonAliTable columns={orderDetail} dataSource={data?.orderInfo || []} />
                    <DetailTitle title="系统信息" />
                    <BaseInfo col={2} columns={[
                        { title: "最后编辑人", dataIndex: 'updateUserName' },
                        { title: "最后编辑时间", dataIndex: 'updateTime', type: "date" },
                        { title: "创建人", dataIndex: 'createUserName' },
                        { title: "创建时间", dataIndex: 'createTime', type: "date" }
                    ]} dataSource={data || {}} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="回款记录" key="2">
                    <ManagementContractRefundRecord
                        paymentPlanVos={data?.paymentPlanVos}
                        contractStatus={data?.contractStatus}
                    />
                    {/* {data?.paymentPlanVos?.map((item: any) => (<Fragment key={item.id}>
                        <div className="title-description">
                            <span>
                                <label>{`第${item.period}期${item.name || "-"}计划:`}</label>
                                <span>{item?.returnedTime}</span>
                            </span>
                            <span>
                                <label>计划回款占比:</label>
                                <span>{`${item.returnedRate}%`}</span>
                            </span>
                            <span>
                                <label>计划回款金额:</label>
                                <span>{currency(item.returnedAmount)}</span>
                            </span>
                            <span>
                                <label>已回款金额:</label>
                                <span>{currency(item.paymentReceived)}</span>
                            </span>
                            <span>
                                <label>未回款金额:</label>
                                <span>{currency(item.uncollectedPayment)}</span>
                            </span>
                        </div>
                        <CommonAliTable edit columns={paymentDetail} dataSource={item?.paymentRecordVos || []} />
                    </Fragment>))} */}
                </Tabs.TabPane>
                <Tabs.TabPane tab="相关附件" key="3">
                    <Attachment title={false} dataSource={data?.attachVos || []} />
                </Tabs.TabPane>
            </Tabs>
        </DetailContent>
    </Spin>
}