import React from 'react'
import { Button, Table, TableColumnProps, Row, Col, Tabs } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Detail, } from '../common'
import SummaryRenderUtil from '../../utils/SummaryRenderUtil'
import { ITabItem } from '../../components/ITabableComponent'
const tableColumns: TableColumnProps<Object>[] = [
    { title: '序号', dataIndex: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    {
        title: '状态',
        dataIndex: 'productStatus',
        render: (productStatus: number): React.ReactNode => {
            return productStatus === 1 ? '待下发' : productStatus === 2 ? '审批中' : '已下发'
        }
    },
    { title: '线路名称', dataIndex: 'lineName' },
    { title: '产品类型', dataIndex: 'productTypeName' },
    { title: '塔型', dataIndex: 'productShape' },
    { title: '杆塔号', dataIndex: 'productNumber' },
    { title: '电压等级（KV）', dataIndex: 'voltageGradeName' },
    { title: '呼高（米）', dataIndex: 'productHeight' },
    { title: '单位', dataIndex: 'unit' },
    {
        title: '数量',
        dataIndex: 'num',
        render: (num: number | string): React.ReactNode => {
            return num == -1 ? '' : num;
        }
    },
    { title: '单价', dataIndex: 'price' },
    { title: '金额', dataIndex: 'totalAmount' },
    { title: '标段', dataIndex: 'tender' },
    { title: '备注', dataIndex: 'description' }
]

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params: { id: string, tab?: string } = useParams()
    const tabItems: { [key: string]: ITabItem[] } = {
        tabItems1: [
            {
                label: '概况信息',
                key: 1,
                content: SummaryRenderUtil.renderSections([
                    {
                        title: '',
                        render: () => (<>
                            <Button style={{ marginRight: '10px' }}>编辑</Button>
                            <Button>返回</Button>
                        </>)
                    },
                    {
                        title: '基本信息',
                        render: () => SummaryRenderUtil.renderGrid({
                            labelCol: { span: 4 },
                            valueCol: { span: 8 },
                            rows: [
                                [{
                                    label: '合同编号',
                                    value: 'baseInfo?.contractNumber'
                                }, {
                                    label: '内部合同编号',
                                    value: 'baseInfo?.internalNumber'
                                }], [{
                                    label: '工程名称',
                                    value: 'baseInfo?.projectName'
                                }, {
                                    label: '工程简称',
                                    value: 'baseInfo?.simpleProjectName'
                                }], [{
                                    label: '中标类型',
                                    value: 'baseInfo?.winBidTypeName'
                                }, {
                                    label: '销售类型',
                                    value: 'baseInfo?.saleTypeName'
                                }], [{
                                    label: '业主单位',
                                    value: 'baseInfo?.customerInfoVo?.customerCompany'
                                }, {
                                    label: '业主联系人',
                                    value: 'baseInfo?.customerInfoVo?.customerLinkman'
                                }], [{
                                    label: '业主联系电话',
                                    value: 'baseInfo?.customerInfoVo?.customerPhone'
                                }, {
                                    label: '合同签订单位',
                                    value: 'baseInfo?.signCustomerName'
                                }], [{
                                    label: '合同签订日期',
                                    value: 'baseInfo?.signContractTime'
                                }, {
                                    label: '签订人',
                                    value: 'baseInfo?.signUserName'
                                }], [{
                                    label: '要求交货日期',
                                    value: 'baseInfo?.deliveryTime'
                                }, {
                                    label: '评审时间',
                                    value: 'baseInfo?.reviewTime'
                                }], [{
                                    label: '所属国家',
                                    value: 'baseInfo?.countryCode'
                                }, {
                                    label: '所属区域',
                                    value: 'baseInfo?.regionName'
                                }], [{
                                    label: '计价方式',
                                    value: 'baseInfo?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT'
                                }, {
                                    label: '合同总价',
                                    value: 'baseInfo?.contractAmount'
                                }], [{
                                    label: '币种',
                                    value: 'baseInfo?.currencyTypeName'
                                }], [{
                                    label: '备注',
                                    value: 'baseInfo?.description'
                                }]
                            ]
                        })
                    },
                    { title: '订单信息', render: () => <Table columns={tableColumns} /> },
                    {
                        title: '附件信息',
                        render: () => (<>
                            <Button>上传附件</Button>
                            <Table columns={tableColumns} />
                        </>)
                    }
                ])
            }],
        tabItems2: [
            {
                label: '概况信息',
                key: 1,
                content: SummaryRenderUtil.renderSections([
                    { title: '标书制作记录表', render: () => <Table columns={tableColumns} /> },
                    {
                        title: '',
                        render: () => (<>
                            <Button style={{ marginRight: '10px' }}>编辑</Button>
                            <Button>返回</Button>
                        </>)
                    },
                    {
                        title: '填写记录',
                        render: () => (<>
                            <Table columns={tableColumns} />
                        </>)
                    }
                ])
            }],
        tabItems3: [
            {
                label: '概况信息',
                key: 1,
                content: SummaryRenderUtil.renderSections([
                    {
                        title: '',
                        render: () => (<>
                            <Button style={{ marginRight: '10px' }}>编辑</Button>
                            <Button>返回</Button>
                        </>)
                    },
                    {
                        title: '基础信息',
                        render: () => SummaryRenderUtil.renderGrid({
                            labelCol: { span: 4 },
                            valueCol: { span: 8 },
                            rows: [
                                [{
                                    label: '年份',
                                    value: 'baseInfo?.contractNumber'
                                },
                                {
                                    label: '批次',
                                    value: 'baseInfo?.internalNumber'
                                }],
                                [{
                                    label: '备注',
                                    value: 'baseInfo?.projectName'
                                },
                                {
                                    label: '是否中标',
                                    value: 'baseInfo?.simpleProjectName'
                                }]
                            ]
                        })
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
                                    <Table columns={tableColumns} />
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="第一轮" key="a">
                                    <Table columns={tableColumns} />
                                </Tabs.TabPane>
                            </Tabs>
                        </>)
                    }
                ])
            }],
        tabItems4: [
            {
                label: '概况信息',
                key: 1,
                content: SummaryRenderUtil.renderSections([
                    {
                        title: '',
                        render: () => (<>
                            <Button style={{ marginRight: '10px' }}>编辑</Button>
                            <Button>返回</Button>
                        </>)
                    },
                    {
                        title: '基本信息',
                        render: () => SummaryRenderUtil.renderGrid({
                            labelCol: { span: 4 },
                            valueCol: { span: 8 },
                            rows: [
                                [{
                                    label: '合同编号',
                                    value: 'baseInfo?.contractNumber'
                                }, {
                                    label: '内部合同编号',
                                    value: 'baseInfo?.internalNumber'
                                }], [{
                                    label: '工程名称',
                                    value: 'baseInfo?.projectName'
                                }, {
                                    label: '工程简称',
                                    value: 'baseInfo?.simpleProjectName'
                                }], [{
                                    label: '中标类型',
                                    value: 'baseInfo?.winBidTypeName'
                                }, {
                                    label: '销售类型',
                                    value: 'baseInfo?.saleTypeName'
                                }], [{
                                    label: '业主单位',
                                    value: 'baseInfo?.customerInfoVo?.customerCompany'
                                }, {
                                    label: '业主联系人',
                                    value: 'baseInfo?.customerInfoVo?.customerLinkman'
                                }], [{
                                    label: '业主联系电话',
                                    value: 'baseInfo?.customerInfoVo?.customerPhone'
                                }, {
                                    label: '合同签订单位',
                                    value: 'baseInfo?.signCustomerName'
                                }], [{
                                    label: '合同签订日期',
                                    value: 'baseInfo?.signContractTime'
                                }, {
                                    label: '签订人',
                                    value: 'baseInfo?.signUserName'
                                }], [{
                                    label: '要求交货日期',
                                    value: 'baseInfo?.deliveryTime'
                                }, {
                                    label: '评审时间',
                                    value: 'baseInfo?.reviewTime'
                                }], [{
                                    label: '所属国家',
                                    value: 'baseInfo?.countryCode'
                                }, {
                                    label: '所属区域',
                                    value: 'baseInfo?.regionName'
                                }], [{
                                    label: '计价方式',
                                    value: 'baseInfo?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT'
                                }, {
                                    label: '合同总价',
                                    value: 'baseInfo?.contractAmount'
                                }], [{
                                    label: '币种',
                                    value: 'baseInfo?.currencyTypeName'
                                }], [{
                                    label: '备注',
                                    value: 'baseInfo?.description'
                                }]
                            ]
                        })
                    },
                    { title: '合同物资清单', render: () => <Table columns={tableColumns} /> },
                    {
                        title: '系统信息',
                        render: () => <Table columns={tableColumns} />
                    }
                ])
            }],
        tabItems5: [
            {
                label: '合同',
                key: 1,
                content: <>
                    <Row><Button type="primary">新增订单</Button></Row>
                    <Table columns={tableColumns} />
                </>
            },
            {
                label: '订单',
                key: 2,
                content: <>
                    <Row><Button type="primary">新增订单</Button></Row>
                    <Table columns={tableColumns} />
                </>
            }
        ],
        tabItems6: [
            {
                label: '概况信息',
                key: 1,
                content: <>
                    <section>
                        <Row><Button type="primary">新增</Button></Row>
                        <Table columns={tableColumns} />
                    </section>
                    <section>
                        <Row><Button type="primary">明细</Button><Button>统计</Button></Row>
                        <Table columns={tableColumns} />
                    </section>
                </>
            }],
        tabItems7: [
            {
                label: '概况信息',
                key: 1,
                content: <>
                    <Row>
                        <Button type="link">全部</Button>
                        <Button type="link">审批中</Button>
                        <Button type="link">已驳回</Button>
                        <Button type="link">已通过</Button>
                    </Row>
                    <Row><Button type="primary">新增</Button></Row>
                    <Table columns={tableColumns} />
                </>
            }]
    }
    return <Detail
        operation={[
            <Button type={(!params.tab || params.tab === '1') ? "default" : "primary"} key="1" onClick={() => history.push(`/project/management/detail/${params.id}/1`)}>基础信息</Button>,
            <Button type={(params.tab && params.tab === '2') ? "default" : "primary"} key="2" onClick={() => history.push(`/project/management/detail/${params.id}/2`)}>标书制作</Button>,
            <Button type={(params.tab && params.tab === '3') ? "default" : "primary"} key='3' onClick={() => history.push(`/project/management/detail/${params.id}/3`)}>招标结果</Button>,
            <Button type={(params.tab && params.tab === '4') ? "default" : "primary"} key="4" onClick={() => history.push(`/project/management/detail/${params.id}/4`)}>框架协议</Button>,
            <Button type={(params.tab && params.tab === '5') ? "default" : "primary"} key="5" onClick={() => history.push(`/project/management/detail/${params.id}/5`)}>合同及订单</Button>,
            <Button type={(params.tab && params.tab === '6') ? "default" : "primary"} key='6' onClick={() => history.push(`/project/management/detail/${params.id}/6`)}>杆塔明细</Button>,
            <Button type={(params.tab && params.tab === '7') ? "default" : "primary"} key='7' onClick={() => history.push(`/project/management/detail/${params.id}/7`)}>销售计划</Button>
        ]}
        tabItems={tabItems['tabItems' + (params.tab || '1')]}
    />
}