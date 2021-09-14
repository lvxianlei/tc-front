import React from 'react'
import { Row, Button, Table } from 'antd'
import { useHistory } from 'react-router-dom'
import { Detail, DetailContent, BaseInfo, CommonTable } from '../common'
import { enclosure, baseInfo } from './approvalHeadData.json'
export default function ApprovalMngtDetail(): React.ReactNode {
    const history = useHistory()
    console.log(enclosure)
    return <DetailContent
        operation={[<Button key="new" onClick={() => history.goBack()}>返回</Button>]}
    >
        <Row>基本信息</Row>
        <BaseInfo columns={baseInfo} dataSource={[]} />
        <Row>附件信息</Row>
        <CommonTable columns={enclosure} />
        <Row>审批记录</Row>
        <CommonTable columns={enclosure} />
    </DetailContent>
}