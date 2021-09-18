import React, { useState } from 'react'
import { Button, Spin, Space, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import Modal from 'antd/lib/modal/Modal';

export default function TowerMemberInfo(): React.ReactNode {
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
        { title: '小样图名称', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '上传时间', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '备注', dataIndex: 'unit', key: 'unit' },
        { 
            key: 'operation', 
            title: '操作', 
            dataIndex: 'operation', 
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={()=>{setVisible(true)}}>查看</Button>
                </Space>
            ) 
        }
    ]
    const handleModalCancel = () => setVisible(false)
    return <>
        <Modal title='查看图片'  width={800} visible={visible} onCancel={handleModalCancel} footer={false}>
            <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"/>
        </Modal>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="构件信息" />
                <span>件号数：50  </span>
                <CommonTable columns={columns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}