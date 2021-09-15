import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Col, Button, Tabs, Table } from "antd"
import { DetailContent, BaseInfo } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { baseInfoData } from '../managementDetailData.json'
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
export default function FrameAgreementEdit(): JSX.Element {

    return <DetailContent >
        <ManagementDetailTabsTitle />
        <Row>基本信息</Row>
        <BaseInfo columns={baseInfoData} dataSource={{}} edit />
        <Row style={{ height: '50px', paddingLeft: '10px', lineHeight: '50px' }}>合同物资清单</Row>
        <Row><Button type="primary">新增一行</Button></Row>
        <Table size="small" columns={tableColumns} />
        <Row style={{ height: '50px', paddingLeft: '10px', lineHeight: '50px' }}>系统信息</Row>
        <BaseInfo columns={[
            { title: "最后编辑人", dataIndex: 'index' },
            { title: "最后编辑时间", dataIndex: 'index' },
            { title: "创建人", dataIndex: 'index' },
            { title: "创建时间", dataIndex: 'index' }
        ]} dataSource={{}} />
    </DetailContent>
}