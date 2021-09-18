import React, { useState } from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './setOut.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import Modal from 'antd/lib/modal/Modal';

const componentColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '构件编号', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '材料', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '材质', dataIndex: 'amount', key: 'amount' },
    { title: '规格', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '宽度（mm）', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '厚度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '长度（mm）', dataIndex: 'amount', key: 'amount' },
    { title: '单件理算重量（kg）', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '单件图纸重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '单段数量', dataIndex: 'amount', key: 'amount' },
    { title: '单段理算重量（kg）', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '单段图纸重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '备注', dataIndex: 'unit', key: 'unit' },
]
export default function TowerDetail(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '单段件号数', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '单段件数', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '单段重量', dataIndex: 'amount', key: 'amount' },
        { title: '备注', dataIndex: 'unit', key: 'unit' },
        { 
            key: 'operation', 
            title: '操作', 
            dataIndex: 'operation', 
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={()=>{setVisible(true)}}>构件详情</Button>
                </Space>
            ) 
        }
    ]
    const handleModalCancel = () => setVisible(false)
    return <>
        <Modal title='构件详情'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
            <Space>
                <span>单段件号数：50</span>
                <span>单段件数：130</span>
                <span>单段重量：130.00kg</span>
            </Space>
            <CommonTable columns={componentColumns} dataSource={detailData?.cargoVOList} />
        </Modal>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="塔型信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <DetailTitle title="段落信息" />
                <CommonTable columns={columns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}