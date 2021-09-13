import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Col, Button, Tabs, Table } from "antd"
import { DetailContent, BaseInfo } from "../../common"
import { bidInfoColumns } from '../managementDetailData.json'
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ id: string, tab: string }>()
    return (<DetailContent operation={[
        <Button style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/bidDoc/${params.id}`)}>编辑</Button>,
        <Button>返回</Button>
    ]} >
        <Row>基础信息</Row>
        <BaseInfo columns={[{
            title: '年份',
            dataIndex: 'baseInfo?.contractNumber'
        },
        {
            title: '批次',
            dataIndex: 'baseInfo?.internalNumber'
        }, {
            title: '备注',
            dataIndex: 'baseInfo?.projectName'
        },
        {
            title: '是否中标',
            dataIndex: 'baseInfo?.simpleProjectName'
        }]} dataSource={{}} />
        <Row>开标信息</Row>
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