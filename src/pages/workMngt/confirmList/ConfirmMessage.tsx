import React from 'react'
import { Button, Row, Col, Tabs, Radio, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './confirm.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

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
                {/* <DetailTitle title="完成信息" />
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
                                <Button type='link'>删除</Button>
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.cargoVOList} /> */}
            </DetailContent>
        </Spin>
    </>
}