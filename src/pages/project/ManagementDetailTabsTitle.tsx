import React from "react"
import { Row } from 'antd'
import { useParams, useHistory, useRouteMatch, useLocation } from 'react-router-dom'
import styles from './ManagementDetail.module.less'
type TabTypes = "base" | "bidDoc" | "bidBase" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | undefined
export default function ManagementDetailTabsTitle(): JSX.Element {
    const location = useLocation()
    const history = useHistory()
    const editParams = useRouteMatch<{ id: string, tab?: TabTypes }>("/project/management/edit/:tab/:id")?.params
    const detailParams = useParams<{ id: string, tab?: TabTypes }>()
    let params: { id: string, tab?: TabTypes } = { id: "", tab: "base" }
    if (location.pathname.includes("/project/management/edit")) {
        params = editParams || { id: "" }
    } else {
        params = detailParams
    }
    return <Row className={styles.operation}>
        <span className={(!params.tab || params.tab === 'base') ? styles.default : ""} key="base" onClick={() => history.push(`/project/management/detail/base/${params.id}`)}>基础信息</span>
        <span className={(params.tab && params.tab === 'bidDoc') ? styles.default : ""} key="bidDoc" onClick={() => history.push(`/project/management/detail/bidDoc/${params.id}`)}>标书制作</span>
        <span className={(params.tab && params.tab === 'bidBase') ? styles.default : ""} key='bidBase' onClick={() => history.push(`/project/management/detail/bidBase/${params.id}`)}>招标结果</span>
        <span className={(params.tab && params.tab === 'frameAgreement') ? styles.default : ""} key="frameAgreement" onClick={() => history.push(`/project/management/detail/frameAgreement/${params.id}`)}>框架协议</span>
        <span className={(params.tab && params.tab === 'contract') ? styles.default : ""} key="contract" onClick={() => history.push(`/project/management/detail/contract/${params.id}`)}>合同及订单</span>
        <span className={(params.tab && params.tab === 'productGroup') ? styles.default : ""} key='productGroup' onClick={() => history.push(`/project/management/detail/productGroup/${params.id}`)}>杆塔明细</span>
        <span className={(params.tab && params.tab === 'salesPlan') ? styles.default : ""} key='salesPlan' onClick={() => history.push(`/project/management/detail/salesPlan/${params.id}`)}>销售计划</span>
    </Row>
}