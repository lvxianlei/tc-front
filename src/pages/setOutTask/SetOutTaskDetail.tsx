import React, { useState } from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './SetOutTask.module.less';
import { baseColumns, specialColums, productColumns } from './SetOutTaskDetail.json'

const tableColumns = [
    { 
        key: 'index', 
        title: '序号', 
        dataIndex: 'index', 
        width: 50, 
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
    {
        key: 'partBidNumber',
        title: '操作部门',
        dataIndex: 'partBidNumber', 
    },
    {  
        key: 'goodsType', 
        title: '操作人', 
        dataIndex: 'goodsType' 
    },
    { 
        key: 'goodsType', 
        title: '操作时间', 
        dataIndex: 'packageNumber' 
    },
    {
        key: 'goodsType', 
        title: '任务状态', 
        dataIndex: 'amount' 
    },
    { 
        key: 'goodsType', 
        title: '备注', 
        dataIndex: 'unit' 
    }
]

export default function SetOutTaskDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data = await RequestUtil.get(`/tower-market/bidInfo/${ params.id }`)
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent operation={ [
        <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
            <Button type="primary">接收</Button>
            <Button type="ghost">拒绝</Button>
            <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
        </Space>
    ] }>
        <DetailTitle title="基础信息" />
        <BaseInfo columns={ baseColumns } dataSource={ {} } />
        <DetailTitle title="特殊要求" />
        <BaseInfo columns={ specialColums } dataSource={ {} } />
        <DetailTitle title="产品信息" />
        <BaseInfo columns={ productColumns } dataSource={ {} } />
        <DetailTitle title="相关附件" />
        <CommonTable columns={[
            { 
                key: 'name', 
                title: '附件名称', 
                dataIndex: 'name',
                width: 250
            },
            { 
                key: 'operation', 
                title: '操作', 
                dataIndex: 'operation', 
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        <Button type="link">下载</Button>
                        <Button type="link">预览</Button>
                    </Space>
            ) }
        ]}
            dataSource={ [] }
        />
        <DetailTitle title="操作信息"/>
        <CommonTable columns={ tableColumns } dataSource={ [] } />
    </DetailContent>
}