import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Col, Button, Table, Radio } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '分标编号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '货物类别', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '数量', dataIndex: 'amount', key: 'amount' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace', key: 'deliveryPlace' }
]
export default function SalesPlanEdit() {

    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: "12px" }}>保存</Button>,
        <Button key="saveOr" type="primary" style={{ marginRight: "12px" }}>保存并提交审核</Button>,
        <Button key="cacel" >取消</Button>
    ]}>
        <ManagementDetailTabsTitle />
        <DetailTitle title="基本信息" />
        <BaseInfo columns={tableColumns} dataSource={{}} edit />
        <DetailTitle title="特殊要求" />
        <BaseInfo columns={tableColumns} dataSource={{}} edit />
        <DetailTitle title="特殊要求" operation={[<Button key="select">选择杆塔明细</Button>]} />
        <CommonTable columns={tableColumns} />
    </DetailContent>
}