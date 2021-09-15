import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Col, Button, Table, Radio } from "antd"
import { DetailContent, BaseInfo, EditTable } from "../../common"
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

    return <DetailContent>
        <ManagementDetailTabsTitle />
        <Row>
            <Radio.Group defaultValue="all">
                <Radio.Button value="all">全部</Radio.Button>
                <Radio.Button value="a" >审批中</Radio.Button>
                <Radio.Button value="b" >已驳回</Radio.Button>
                <Radio.Button value="c" >已通过</Radio.Button>
            </Radio.Group>
        </Row>
        <EditTable columns={tableColumns} dataSource={[]} />
    </DetailContent>
}