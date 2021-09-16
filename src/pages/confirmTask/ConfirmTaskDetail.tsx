import React from 'react'
import { Button, Row, Col, Tabs, Radio, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './confirmTaskData.json';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import styles from "./ManagementDetail.module.less"
const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '操作人', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '操作时间', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '任务状态', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' }
]

export type TabTypes = "base" | "bidDoc" | "bidResult" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | undefined

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/base/${params.id}`)}>接收</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => history.push(`/project/management/detail/edit/base/${params.id}`)}>拒绝</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} />
                <DetailTitle title="相关附件"/>
                <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link'>下载</Button>
                                <Button type='link'>预览</Button>
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachVos} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}