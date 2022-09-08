import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Row, Col, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable, Attachment } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { baseColumns } from './index.json';
import styles from './SetOutTask.module.less';

export default function AppSettingDetail(): React.ReactNode {
    const history = useHistory();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/sinzetech-system/socialDetail/clientInfo`)
        resole(data)
    }), {})
    const detailData: any = data;

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent operation={[
            // <Space direction="horizontal" size="small" >
            //     <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            // </Space>
        ]}>
            <DetailTitle title="应用基础信息" />
            <BaseInfo columns={baseColumns} dataSource={detailData} col={2} />
        </DetailContent>
    </>
}