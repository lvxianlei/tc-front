import React from 'react'
import { Button } from "antd"
import { useHistory } from "react-router-dom"
import { DetailContent, BaseInfo, CommonTable, DetailTitle } from "../common"
import { baseInfo } from "./approvalHeadData.json"
export default function ApprovalMngtEdit(): JSX.Element {
    const history = useHistory()
    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: "16px" }}>保存</Button>,
        <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
    ]}>
        <DetailTitle title="基本信息" />
        <BaseInfo edit columns={baseInfo} dataSource={{}} />
        <DetailTitle title="附件" />
        <CommonTable columns={baseInfo} />
    </DetailContent>
}