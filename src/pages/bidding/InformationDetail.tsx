import React from 'react'
import { Button, Popconfirm, Row, Table, TableColumnProps } from 'antd'
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
                                label: '项目名称',
                                value: 'baseInfo?.contractNumber'
                            }, {
                                label: '项目单位',
                                value: 'baseInfo?.internalNumber'
                            }], [{
                                label: '项目编号',
                                value: 'baseInfo?.projectName'
                            }, {
                                label: '数量',
                                value: 'baseInfo?.simpleProjectName'
                            }], [{
                                label: '单位',
                                value: 'baseInfo?.winBidTypeName'
                            }, {
                                label: '货物类别',
                                value: 'baseInfo?.saleTypeName'
                            }], [{
                                label: '招标文件传递方式',
                                value: 'baseInfo?.customerInfoVo?.customerCompany'
                            }, {
                                label: '价格范围（元/吨）',
                                value: 'baseInfo?.customerInfoVo?.customerLinkman'
                            }], [{
                                label: '验收执行标准及验收方法',
                                value: 'baseInfo?.customerInfoVo?.customerPhone'
                            }, {
                                label: '原材料执行标准',
                                value: 'baseInfo?.signCustomerName'
                            }], [{
                                label: '包装要求',
                                value: 'baseInfo?.signContractTime'
                            }, {
                                label: '是否有合同版本',
                                value: 'baseInfo?.signUserName'
                            }], [{
                                label: '货款结算条件及方式',
                                value: 'baseInfo?.deliveryTime'
                            }, {
                                label: '特殊材质',
                                value: 'baseInfo?.reviewTime'
                            }], [{
                                label: '其他',
                                value: 'baseInfo?.countryCode'
                            }, {
                                label: '审批状态',
                                value: 'baseInfo?.regionName'
                            }], [{
                                label: '备注',
                                value: 'baseInfo?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT'
                            }]
                        ]
                    })
                },
                {
                    title: '',
                    render: () => <Table columns={tableColumns} />
                },
                {
                    title: '附件', render: () => (<>
                        <Row><Button>上传附件</Button></Row>
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