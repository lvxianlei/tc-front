import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Col, Button, Tabs, Table, Radio } from "antd"
import { DetailContent, BaseInfo } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { productGroupColumns } from '../managementDetailData.json'
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
export default function ProductGroupEdit() {

    return <DetailContent>
        <ManagementDetailTabsTitle />
        <section>
            <Row><Button type="primary">新增</Button></Row>
            <Table columns={tableColumns} />
        </section>
        <section>
            <Row><Radio.Group
                options={[
                    { label: '明细', value: 'Apple' },
                    { label: '统计', value: 'Pear' },]}
                optionType="button"
            /></Row>
            <Table columns={productGroupColumns} />
        </section>
    </DetailContent>
}