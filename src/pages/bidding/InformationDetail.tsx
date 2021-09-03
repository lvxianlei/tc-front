import React from 'react'
import { Button, Popconfirm, Table, TableColumnProps } from 'antd'
import { useHistory } from 'react-router-dom'
import { Detail } from '../common'
import SummaryRenderUtil from '../../utils/SummaryRenderUtil'

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

export default function InformationDetail(): React.ReactNode {
    const history = useHistory()
    const tabItems = [
        {
            label: '概况信息',
            key: 1,
            content: SummaryRenderUtil.renderSections([
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
        }]

    return <Detail
        operation={[
            <Button key="setting" onClick={() => history.push('/bidding/information/new/2')}>编辑</Button>,
            <Button key="delete" type="default">删除</Button>,
            <Popconfirm
                key="bidding"
                title="要删除该合同吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={async () => {
                    // const resData: IResponseData = await RequestUtil.delete(`/tower-market/contract?id=${this.props.match.params.id}`);
                    // if (resData) {
                    //     this.props.history.push(`/prom/contract`);
                    // }
                }}
            // disabled={this.state.detail.contractStatus === 1}
            >
                <Button>是否应标</Button>
            </Popconfirm>,
            <Button key="new" onClick={() => history.goBack()}>返回</Button>
        ]}
        tabItems={tabItems} />
}