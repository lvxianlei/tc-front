import React from 'react'
import { Button, Table, TableColumnProps, Row, Col, Tabs, Radio } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { BaseInfo, DetailContent } from '../common'
import ManagementDetailTabsTitle from './ManagementDetailTabsTitle'
import SummaryRenderUtil from '../../utils/SummaryRenderUtil'
import { baseInfoData, productGroupColumns, bidInfoColumns, paths } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import ManagementContract from './ManagementContract'
import ManagementOrder from './ManagementOrder'
import styles from "./ManagementDetail.module.less"
const tableColumns: TableColumnProps<Object>[] = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '分标编号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '货物类别', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '数量', dataIndex: 'amount', key: 'amount' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace', key: 'deliveryPlace' }
]

type TabTypes = "base" | "bidDoc" | "bidBase" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | undefined

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const { loading, error, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get(`${paths[params.tab || 'base']}`, {})
        resole(result)
    }), {})
    const tabItems: { [key: string]: JSX.Element | React.ReactNode } = {
        tab_base: <DetailContent>
            <Row>
                <Button style={{ marginRight: '10px' }} onClick={() => history.push(`/project/management/detail/edit/base/${params.id}`)}>编辑</Button>
                <Button onClick={() => history.goBack()}>返回</Button>
            </Row>
            <BaseInfo columns={baseInfoData} dataSource={{}} />
            <Row style={{ height: '50px', paddingLeft: '10px', lineHeight: '50px' }}>货物清单</Row>
            <Table size="small" columns={tableColumns} />
            <Row style={{ height: '50px', paddingLeft: '10px', lineHeight: '50px' }}><span>附件信息</span><Button type="default">上传附件</Button></Row>
            <Table size="small" columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    key: 'index',
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                {
                    title: '文件名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '大小',
                    dataIndex: 'fileSize',
                    key: 'fileSize',
                },
                {
                    title: '上传人',
                    dataIndex: 'userName',
                    key: 'userName',
                },
                {
                    title: '上传时间',
                    dataIndex: 'fileUploadTime',
                    key: 'fileUploadTime',
                }
            ]} />
        </DetailContent>,
        tab_bidDoc: <DetailContent>
            <Row>标书制作记录表</Row>
            <BaseInfo columns={baseInfoData} dataSource={{}} col={4} />
            <Row><Button onClick={() => history.push(`/project/management/detail/edit/bidDoc/${params.id}`)} >编辑</Button><Button>返回</Button></Row>
            <Row>填写记录</Row>
            <Table size="small" columns={[
                { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { title: '部门', dataIndex: 'branch' },
                { title: '填写人', dataIndex: 'createUserName' },
                { title: '职位', dataIndex: 'position' },
                { title: '填写时间', dataIndex: 'createTime' },
                { title: '说明', dataIndex: 'description' }
            ]} dataSource={[]} />
        </DetailContent>,
        tab_bidBase: SummaryRenderUtil.renderSections([
            {
                title: '',
                render: () => (<>
                    <Button style={{ marginRight: '10px' }} onClick={() => history.push(`/project/management/detail/edit/bidDoc/${params.id}`)}>编辑</Button>
                    <Button>返回</Button>
                </>)
            },
            {
                title: '基础信息',
                render: () => <BaseInfo columns={[{
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

            },
            {
                title: '开标信息',
                render: () => (<>
                    <Row gutter={[10, 0]}>
                        <Col><Button>新增一行</Button></Col>
                        <Col><Button>导入文件</Button></Col>
                        <Col><Button>新增一轮报价</Button></Col>
                    </Row>
                    <Tabs type="editable-card" style={{ marginTop: '10px' }}>
                        <Tabs.TabPane tab="第二轮" key="b">
                            <Table columns={bidInfoColumns} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="第一轮" key="a">
                            <Table columns={bidInfoColumns} />
                        </Tabs.TabPane>
                    </Tabs>
                </>)
            }
        ]),
        tab_frameAgreement: <>
            <Row>
                <Button style={{ marginRight: '10px' }}>编辑</Button>
                <Button>返回</Button>
            </Row>
            <Row>基本信息</Row>
            <BaseInfo columns={baseInfoData} dataSource={{}} />
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
        </>,
        tab_contract: <>
            <Tabs>
                <Tabs.TabPane tab="合同" key="合同">
                    <ManagementContract />
                </Tabs.TabPane>
                <Tabs.TabPane tab="订单" key="订单">
                    <ManagementOrder />
                </Tabs.TabPane>
                <Tabs.TabPane></Tabs.TabPane>
            </Tabs></>,
        tab_productGroup: <>
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
        </>,
        tab_salesPlan: <>
            <Row>
                <Button type="link">全部</Button>
                <Button type="link">审批中</Button>
                <Button type="link">已驳回</Button>
                <Button type="link">已通过</Button>
            </Row>
            <Row><Button type="primary">新增</Button></Row>
            <Table columns={tableColumns} />
        </>
    }

    return <DetailContent>
        <ManagementDetailTabsTitle />
        {tabItems['tab_' + (params.tab || 'base')]}
    </DetailContent>
}