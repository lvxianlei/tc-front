import React, { useState } from 'react';
import { Spin, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { BaseInfo, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TaskDetail.module.less';
import AuthUtil from '../../utils/AuthUtil';
import { ITenant } from '../system-mngt/ITenant';

const tableColumns = [
    {
        key: 'recordType', 
        title: '所在班组', 
        dataIndex: 'recordType'
    },
    {
        key: 'stateFront', 
        title: '计划号', 
        dataIndex: 'stateFront'
    },
    {
        key: 'stateAfter', 
        title: '塔型', 
        dataIndex: 'stateAfter'
    },
    {  
        key: 'createUserName', 
        title: '条码', 
        dataIndex: 'createUserName' 
    },
    { 
        key: 'createTime', 
        title: '件号', 
        dataIndex: 'createTime' 
    },
    { 
        key: 'createTime', 
        title: '材料', 
        dataIndex: 'createTime' 
    },
    { 
        key: 'createTime', 
        title: '总重（kg）', 
        dataIndex: 'createTime' 
    },
    { 
        key: 'createTime', 
        title: '所在车间', 
        dataIndex: 'createTime' 
    },
    { 
        key: 'createTime', 
        title: '所在工序', 
        dataIndex: 'createTime' 
    },
    { 
        key: 'createTime', 
        title: '所在产线', 
        dataIndex: 'createTime' 
    }
]

const baseColums = [
    {
        "dataIndex": "title",
        "title": "任务编号"
    },
    {
        "dataIndex": "content",
        "title": "加工车间"
    },
    {
        "dataIndex": "userNames",
        "title": "转运车间"
    },
    {
        "dataIndex": "stateName",
        "title": "转运日期"
    }
]

export default function TaskDetail(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const [ accessToken, setAccessToken ] = useState('');
    const [ tenantId, setTenantId ] = useState('');

    const simulatioOn = async () => {
        const tenant = await RequestUtil.get<ITenant>(`/sinzetech-system/tenantClient/info?domain=${window.location.protocol}//${window.location.host}`);
        const { access_token, refresh_token, user_id, tenant_id, ...result } = await RequestUtil.post('/sinzetech-auth/oauth/token', {
            username: 'admin',
            password: '123456',
            grant_type: 'password',
            scope: 'all',
            tenantId: tenant.tenantId
        }, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
        if (result.error) {
            notification.error({
                message: result.error_description
            })
        } else {
            setAccessToken(access_token);
            setTenantId(tenant.tenantId);
        }
    }
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        simulatioOn();
        const data = await RequestUtil.get(`/tower-science/loftingList/detail?id=${ params.id }`, {}, {
            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
            'Tenant-Id': tenantId,
            'Sinzetech-Auth': accessToken
        })
        resole(data)
    }), {})
    const detailData: any = data;


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <div className={ styles.detailContent }>
        <p>基本信息</p>
        <BaseInfo columns={ baseColums } dataSource={ detailData } col={ 2 } />
        <p className={ styles.detailTitle }>构件明细</p>
        <CommonTable columns={ tableColumns } dataSource={ detailData.stateRecordVOS } pagination={ false }/>
    </div>
}