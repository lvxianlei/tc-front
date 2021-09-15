import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Col, Button, Tabs, Table } from "antd"
import { DetailContent, BaseInfo, DetailTitle } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidInfoColumns } from '../managementDetailData.json'
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ id: string, tab: string }>()
    return (<DetailContent >
        <ManagementDetailTabsTitle />
        <DetailTitle title="基本信息" />
        <BaseInfo edit columns={[
            {
                title: '年份',
                dataIndex: 'date'
            },
            {
                title: '批次',
                dataIndex: 'batch'
            }, {
                title: '备注',
                dataIndex: 'description'
            },
            {
                title: '是否中标',
                dataIndex: "isBid",
                type: "select",
                enum: [
                    {
                        value: 0,
                        label: "未公布"
                    },
                    {
                        value: 1,
                        label: "是"
                    },
                    {
                        value: 2,
                        label: "否"
                    }
                ]
            }]} dataSource={{}} />
        <DetailTitle title="开标信息" />
        <Row gutter={[10, 0]}>
            <Col><Button>新增一轮报价</Button></Col>
        </Row>
        <Tabs type="editable-card" style={{ marginTop: '10px' }}>
            <Tabs.TabPane tab="第二轮" key="b">
                <Row><Button>新增一行</Button><Button>导入文件</Button></Row>
                <Table columns={bidInfoColumns} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="第一轮" key="a">
                <Row><Button>新增一行</Button><Button>导入文件</Button></Row>
                <Table columns={bidInfoColumns} />
            </Tabs.TabPane>
        </Tabs>
    </DetailContent>)
}