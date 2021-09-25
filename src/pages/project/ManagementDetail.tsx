import React from 'react'
import { Button, Row, Tabs, Radio, Spin, Upload, Modal } from 'antd'
import { useHistory, useParams, Link } from 'react-router-dom'
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common'
import ManagementDetailTabsTitle from './ManagementDetailTabsTitle'
import {
    baseInfoData, productGroupColumns, bidDocColumns, paths,
    frameAgreementColumns, enclosure, cargoVOListColumns, materialListColumns, taskNotice,
    bidInfoColumns
} from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import ManagementContract from './contract/Contract'
import ManagementOrder from './order/SaleOrder'
import ApplicationContext from "../../configuration/ApplicationContext"
export type TabTypes = "base" | "bidDoc" | "bidResult" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | undefined

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const dictionaryOptions: any = ApplicationContext.get().dictionaryOption
    const bidType = dictionaryOptions["124"]
    const frangmentBidType = dictionaryOptions["122"]
    const { loading, error, data, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        if (params.tab === "contract") {
            resole({})
            return;
        }
        if (["productGroup", "salesPlan"].includes(params.tab as string)) {
            const result: { [key: string]: any } = await RequestUtil.get(`${paths[params.tab || 'base']}`, { projectId: params.id, ...postData })
            resole(result)
            return
        }
        const result: { [key: string]: any } = await RequestUtil.get(`${paths[params.tab || 'base']}/${params.id}`)
        resole(result)
    }), { refreshDeps: [params.tab] })

    const { loading: deleteLoading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/productGroup/${id}`)
            resole(result)
            history.go(0)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const deleteProductGroupItem = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteRun(id)
                    resove("")
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    const tabItems: { [key: string]: JSX.Element | React.ReactNode } = {
        tab_base: <DetailContent operation={[
            <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/base/${params.id}`)}>编辑</Button>,
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoData.map((item: any) => ["projectLeader", "biddingPerson"].includes(item.dataIndex) ? ({ title: item.title, dataIndex: item.dataIndex }) : item)} dataSource={data || {}} />
            <DetailTitle title="货物清单" />
            <CommonTable columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...cargoVOListColumns
            ]} dataSource={data?.cargoVOList} />
            <DetailTitle title="附件信息" />
            <CommonTable columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    key: 'index',
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...enclosure
            ]} dataSource={data?.attachVos} />
        </DetailContent>,
        tab_bidDoc: <DetailContent
            operation={[
                <Button key="edit" type="primary" onClick={() => history.push(`/project/management/detail/edit/bidDoc/${params.id}`)} >编辑</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="标书制作记录表" />
            <BaseInfo columns={bidDocColumns.map(item => item.dataIndex === "bidType" ? ({ ...item, type: "select", enum: bidType.map((bid: any) => ({ value: bid.id, label: bid.name })) }) : item)} dataSource={data || {}} col={4} />
            <DetailTitle title="填写记录" />
            <CommonTable columns={[
                { title: '序号', dataIndex: 'index', width: 50, render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { title: '部门', width: 100, dataIndex: 'branch' },
                { title: '填写人', width: 100, dataIndex: 'createUserName' },
                { title: '职位', width: 100, dataIndex: 'position' },
                { title: '填写时间', width: 150, dataIndex: 'createTime' },
                { title: '说明', dataIndex: 'description' }
            ]} dataSource={data?.bidBizRecordVos} />
        </DetailContent>,
        tab_bidResult: <DetailContent operation={[
            <Button key="goEdit" type="primary" onClick={() => history.push(`/project/management/detail/edit/bidResult/${params.id}`)}>编辑</Button>,
            <Button key="goback" onClick={() => history.goBack}>返回</Button>
        ]}>
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={[
                    {
                        title: '年份',
                        dataIndex: 'date',
                        type: "date",
                        format: "YYYY",
                        picker: "year"
                    },
                    {
                        title: '批次',
                        dataIndex: 'batch',
                        type: "number"
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
                    }]} dataSource={data || {}} col={2} />
                <DetailTitle title="开标信息" />
                <Tabs>
                    {data?.bidOpenRecordListVos?.length > 0 ? data?.bidOpenRecordListVos.map((item: any, index: number) => <Tabs.TabPane key={index}
                        tab={item.roundName}>
                        <CommonTable columns={bidInfoColumns} dataSource={item.bidOpenRecordVos || []} />
                    </Tabs.TabPane>)
                        :
                        <Tabs.TabPane tab="第 1 轮">
                            <CommonTable columns={bidInfoColumns} dataSource={[]} />
                        </Tabs.TabPane>
                    }
                </Tabs>
            </Spin>
        </DetailContent>,
        tab_frameAgreement: <DetailContent operation={[
            <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/frameAgreement/${params.id}`)}>编辑</Button>,
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={frameAgreementColumns.map((item: any) => item.dataIndex === "bidType" ? ({
                ...item,
                enum: frangmentBidType.map((fitem: any) => ({
                    value: fitem.id, label: fitem.name
                }))
            }) : item)}
                dataSource={data || {}} />
            <DetailTitle title="合同物资清单" />
            <CommonTable columns={[
                { title: '序号', dataIndex: 'index', width: 50, key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                ...materialListColumns
            ]} dataSource={data?.contractCargoVos} />
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
            <Button key="new" type="primary" onClick={() => history.push(`/project/management/detail/new/productGroup/${params.id}`)}>新增</Button>
        ]}>
            <CommonTable columns={[
                ...productGroupColumns,
                {
                    title: "操作",
                    dataIndex: "opration",
                    ellipsis: false,
                    width: 200,
                    render: (_: any, record: any) => <>
                        <Button type="link" onClick={() => history.push(`/project/management/detail/productGroup/item/${params.id}/${record.id}`)} >查看</Button>
                        <Button type="link" onClick={() => history.push(`/project/management/detail/edit/productGroup/${params.id}/${record.id}`)}>编辑</Button>
                        {`${record.status}` === "0" && <Button type="link" onClick={() => deleteProductGroupItem(record.id)} >删除</Button>}
                    </>
                }]} dataSource={data?.records} />
            <Row><Radio.Group
                options={[
                    { label: '明细', value: 'Apple' },
                    { label: '统计', value: 'Pear' }
                ]}
                optionType="button"
            /></Row>
            <CommonTable columns={cargoVOListColumns} />
        </DetailContent>,
        tab_salesPlan: <DetailContent>
            <Row>
                <Radio.Group defaultValue="" onChange={(event) => run({ taskReviewStatus: event.target.value })} >
                    <Radio.Button value="">全部</Radio.Button>
                    <Radio.Button value="0" >审批中</Radio.Button>
                    <Radio.Button value="2" >已驳回</Radio.Button>
                    <Radio.Button value="1" >已通过</Radio.Button>
                </Radio.Group>
            </Row>
            <Row><Button type="primary" onClick={() => history.push(`/project/management/detail/new/salesPlan/${params.id}`)}>新增</Button></Row>
            <CommonTable columns={[...taskNotice, {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                render: (_: any, record: any) => {
                    return <>
                        <Button type="link" onClick={() => history.push(`/project/management/detail/cat/salesPlan/${params.id}/${record.id}`)}>查看</Button>
                        {[2, -1].includes(record.taskReviewStatus) && <>
                            <Link to={`/project/management/detail/edit/salesPlan/${params.id}/${record.id}`}>编辑</Link>
                            <Button type="link">删除</Button>
                            <Button type="link">提交审批</Button>
                        </>}
                    </>
                }
            }]} dataSource={data?.records} />
        </DetailContent>
    }
    return <>
        <ManagementDetailTabsTitle />
        <Spin spinning={loading}>
            {tabItems['tab_' + (params.tab || 'base')]}
        </Spin>
    </>
}