import React from 'react'
import { Button, Row, Col, Tabs, Radio, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common'
import ManagementDetailTabsTitle from './ManagementDetailTabsTitle'
import { baseInfoData, productGroupColumns, bidDocColumns, paths, frameAgreementColumns } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import ManagementContract from './contract/Contract'
import ManagementOrder from './order/SaleOrder'
import styles from "./ManagementDetail.module.less"
import BidResult from './bidResult'
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

export type TabTypes = "base" | "bidDoc" | "bidResult" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | undefined

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const { loading, error, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`${paths[params.tab || 'base']}/${params.id}`, {})
        resole(result)
    }), { refreshDeps: [params.tab] })
    const tabItems: { [key: string]: JSX.Element | React.ReactNode } = {
        tab_base: <DetailContent operation={[
            <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/base/${params.id}`)}>编辑</Button>,
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoData} dataSource={data || {}} />
            <DetailTitle title="货物清单" />
            <CommonTable columns={tableColumns} dataSource={data?.cargoVOList} />
            <DetailTitle title="附件信息" operation={[<Button type="default">上传附件</Button>]} />
            <CommonTable columns={[
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
            ]} dataSource={data?.attachVos} />
        </DetailContent>,
        tab_bidDoc: <DetailContent
            operation={[
                <Button key="edit" type="primary" onClick={() => history.push(`/project/management/detail/edit/bidDoc/${params.id}`)} >编辑</Button>,
                <Button key="goback">返回</Button>
            ]}>
            <DetailTitle title="标书制作记录表" />
            <BaseInfo columns={bidDocColumns} dataSource={data || {}} col={4} />
            <DetailTitle title="填写记录" />
            <CommonTable columns={[
                { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { title: '部门', dataIndex: 'branch' },
                { title: '填写人', dataIndex: 'createUserName' },
                { title: '职位', dataIndex: 'position' },
                { title: '填写时间', dataIndex: 'createTime' },
                { title: '说明', dataIndex: 'description' }
            ]} dataSource={data?.bidBizRecordVos} />
        </DetailContent>,
        tab_bidResult: <BidResult />,
        tab_frameAgreement: <DetailContent operation={[
            <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/frameAgreement/${params.id}`)}>编辑</Button>,
            <Button key="goback">返回</Button>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={frameAgreementColumns} dataSource={data || {}} />
            <DetailTitle title="合同物资清单" />
            <Row><Button type="primary">新增一行</Button></Row>
            <CommonTable columns={tableColumns} dataSource={data?.contractCargoVos} />
            <DetailTitle title="系统信息" />
            <BaseInfo columns={[
                { title: "最后编辑人", dataIndex: 'updateUserLast' },
                { title: "最后编辑时间", dataIndex: 'updateTimeLast', type: "date" },
                { title: "创建人", dataIndex: 'createUserName' },
                { title: "创建时间", dataIndex: 'createTime', type: "date" }
            ]} dataSource={data || {}} />
        </DetailContent>,
        tab_contract: <>
            <Tabs>
                <Tabs.TabPane tab="合同" key="合同">
                    <ManagementContract />
                </Tabs.TabPane>
                <Tabs.TabPane tab="订单" key="订单">
                    <ManagementOrder />
                </Tabs.TabPane>
            </Tabs></>,
        tab_productGroup: <DetailContent title={[
            <Button type="primary" onClick={() => history.push(`/project/management/detail/edit/productGroup/${params.id}`)}>新增</Button>
        ]}>
            <CommonTable columns={tableColumns} />
            <Row><Radio.Group
                options={[
                    { label: '明细', value: 'Apple' },
                    { label: '统计', value: 'Pear' }
                ]}
                optionType="button"
            /></Row>
            <CommonTable columns={productGroupColumns} />
        </DetailContent>,
        tab_salesPlan: <>
            <Row>
                <Radio.Group defaultValue="all">
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="a" >审批中</Radio.Button>
                    <Radio.Button value="b" >已驳回</Radio.Button>
                    <Radio.Button value="c" >已通过</Radio.Button>
                </Radio.Group>
            </Row>
            <Row><Button type="primary" onClick={() => history.push(`/project/management/detail/edit/salesPlan/${params.id}`)}>新增</Button></Row>
            <CommonTable columns={tableColumns} />
        </>
    }

    return <DetailContent>
        <ManagementDetailTabsTitle />
        <Spin spinning={loading}>
            {tabItems['tab_' + (params.tab || 'base')]}
        </Spin>
    </DetailContent>
}