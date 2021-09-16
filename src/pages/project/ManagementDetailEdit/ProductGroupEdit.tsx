import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { productGroupColumns, newProductGroup } from '../managementDetailData.json'
export default function ProductGroupEdit() {

    return <DetailContent
        title={[<Button key="pro" type="primary">导入确认明细</Button>]}
        operation={[
            <Button key="save" type="primary" style={{ marginRight: "12px" }}>保存</Button>,
            <Button key="goback" type="primary">返回</Button>
        ]}>
        <ManagementDetailTabsTitle />
        <DetailTitle title="基本信息" />
        <BaseInfo columns={newProductGroup} dataSource={{}} />
        <DetailTitle title="明细" />
        <CommonTable columns={productGroupColumns} />
    </DetailContent>
}