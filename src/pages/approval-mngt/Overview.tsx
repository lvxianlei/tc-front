import React from 'react'
import { Row, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailContent, BaseInfo, CommonTable } from '../common'
import { auditHead, baseInfo } from './approval.json'
export default function ApprovalMngtDetail(): React.ReactNode {
    const history = useHistory()
    return <DetailContent
        operation={[<Button key="new" onClick={() => history.goBack()}>返回</Button>]}
    >
        <Row>基本信息</Row>
        <BaseInfo columns={baseInfo} dataSource={[]} />
        <Row>附件信息</Row>
        <CommonTable columns={auditHead} />
        <Row>审批记录</Row>
        <CommonTable columns={auditHead} />
    </DetailContent>
}