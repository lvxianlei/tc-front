import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './question.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '操作人', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '操作时间', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '任务状态', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' }
]

const towerColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段名', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '构件编号', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '材质', dataIndex: 'amount', key: 'amount' },
    { title: '规格', dataIndex: 'unit', key: 'unit' },
    { title: '单基件数', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '长度', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '宽度', dataIndex: 'amount', key: 'amount' },
    { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
    { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' }
]

export default function ManagementDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {}}>确认修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {}}>拒绝修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {}}>删除</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="问题信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <CommonTable columns={towerColumns} dataSource={detailData?.attachVos} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}