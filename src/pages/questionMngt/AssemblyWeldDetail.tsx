import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '操作人', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '操作时间', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '任务状态', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' }
]

const towerColumns = [
    { title: '零件号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '材料', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '材质', dataIndex: 'amount', key: 'amount' },
    { title: '规格', dataIndex: 'unit', key: 'unit' },
    { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '单组件数', dataIndex: 'amount', key: 'amount' },
    { title: '电焊长度（mm）', dataIndex: 'unit', key: 'unit' }
]

export default function AssemblyWeldDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
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
                <span>校核前</span>
                <CommonTable columns={towerColumns} dataSource={detailData?.attachVos} title={()=>{
                    return <Space >
                        <span>段号：1</span>
                        <span>组件号：101</span>
                        <span>主见号：101</span>
                        <span>电焊米数（mm）：5</span>
                    </Space>
                }}/>
                <span>校核后</span>
                <CommonTable columns={towerColumns} dataSource={detailData?.attachVos} title={()=>{
                    return <Space>
                        <span>段号：1</span>
                        <span>组件号：101</span>
                        <span>主见号：101</span>
                        <span>电焊米数（mm）：5</span>
                    </Space>
                }}/>
                <DetailTitle title="备注" />
                <TextArea disabled rows={5}></TextArea>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}