import React from 'react'
import { Button, Spin, Image, Descriptions } from 'antd';
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

export default function ManagementDetail(): React.ReactNode {
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
                <Descriptions
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="小样图名称">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="备注">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="校核前图片">
                        <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" height={100}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="校核后图片">
                        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" height={100}/>
                    </Descriptions.Item>
                </Descriptions>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}