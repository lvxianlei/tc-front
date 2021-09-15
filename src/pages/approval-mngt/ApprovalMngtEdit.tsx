import React from 'react'
import { Row } from "antd"
import { DetailContent, BaseInfo, CommonTable } from "../common"
import { baseInfo } from "./approvalHeadData.json"
export default function ApprovalMngtEdit(): JSX.Element {

    return <DetailContent>
        <BaseInfo columns={baseInfo} dataSource={[]} />
        <Row>附件</Row>
        <CommonTable columns={baseInfo} />
    </DetailContent>
}