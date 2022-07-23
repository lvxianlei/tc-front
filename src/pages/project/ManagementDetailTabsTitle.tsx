import React from "react"
import { Row } from 'antd'
import { useParams, useHistory, useRouteMatch, useLocation } from 'react-router-dom'
import styles from './ManagementDetail.module.less'
type TabTypes = "base" | "cost" | "bidDoc" | "bidResult" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | "payInfo" | "qualificationReview" | undefined
export default function ManagementDetailTabsTitle(): JSX.Element {
    const location = useLocation()
    const history = useHistory()
    const editParams = useRouteMatch<{ id: string, type: "edit" | "new", tab?: TabTypes }>("/project/management/:type/:tab/:id")?.params
    const detailParams = useParams<{ id: string, tab?: TabTypes }>()
    let params: { id: string, tab?: TabTypes } = { id: "", tab: "base" }
    if (location.pathname.includes("/project/management/edit") || location.pathname.includes("/project/management/new")) {
        params = editParams || { id: "" }
    } else {
        params = detailParams
    }
    return <Row className={styles.operation}>
        <span className={(!params.tab || params.tab === 'base') ? styles.default : ""} key="base" onClick={() => history.push(`/project/management/detail/base/${params.id}`)}>基础信息</span>
        <span className={(params.tab && params.tab === 'cost') ? styles.default : ""} key="cost" onClick={() => history.push(`/project/management/detail/cost/${params.id}`)}>成本评估</span>
        <span className={(params.tab && params.tab === 'qualificationReview') ? styles.default : ""} key="qualificationReview" onClick={() => history.push(`/project/management/detail/qualificationReview/${params.id}`)}>资审文件</span>
        <span className={(params.tab && params.tab === 'bidDoc') ? styles.default : ""} key="bidDoc" onClick={() => history.push(`/project/management/detail/bidDoc/${params.id}`)}>标书制作</span>
        <span className={(params.tab && params.tab === 'bidResult') ? styles.default : ""} key='bidResult' onClick={() => history.push(`/project/management/detail/bidResult/${params.id}`)}>招标结果</span>
        <span className={(params.tab && params.tab === 'frameAgreement') ? styles.default : ""} key="frameAgreement" onClick={() => history.push(`/project/management/detail/frameAgreement/${params.id}`)}>框架协议</span>
        <span className={(params.tab && params.tab === 'contract') ? styles.default : ""} key="contract" onClick={() => history.push(`/project/management/detail/contract/${params.id}`)}>合同及订单</span>
        <span className={(params.tab && params.tab === 'productGroup') ? styles.default : ""} key='productGroup' onClick={() => history.push(`/project/management/detail/productGroup/${params.id}`)}>杆塔明细</span>
        <span className={(params.tab && params.tab === 'salesPlan') ? styles.default : ""} key='salesPlan' onClick={() => history.push(`/project/management/detail/salesPlan/${params.id}`)}>销售计划</span>
        <span className={(params.tab && params.tab === 'payInfo') ? styles.default : ""} key='payInfo' onClick={() => history.push(`/project/management/detail/payInfo/${params.id}`)}>相关费用</span>
    </Row>
}