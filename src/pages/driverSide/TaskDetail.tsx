import React from 'react';
import { Spin, notification } from 'antd';
import { BaseInfo, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TaskDetail.module.less';
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
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const tenant = await RequestUtil.get<ITenant>(`/sinzetech-system/tenantClient/info?domain=${window.location.protocol}//${window.location.host}`);
        const { access_token, refresh_token, user_id, tenant_id, ...result } = await RequestUtil.post('/sinzetech-auth/oauth/token', {
            username: 'admin',
            password: '123456',
            grant_type: 'password',
            scope: 'all',
            tenantId: tenant.tenantId
        }, {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Tenant-Id': tenant.tenantId
        })
        if (result.error) {
            notification.error({
                message: result.error_description
            })
        } else {
            // const data = await RequestUtil.get(``, {}, {
            //     'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
            //     'Tenant-Id': tenant.tenantId,
            //     'Sinzetech-Auth': access_token
            // })
            const data = {
                recordType: '1'
            }
            resole(data)
        }

    }), {})
    const detailData: any = data;


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <div className={styles.detailContent}>
        <p>基本信息</p>
        <BaseInfo columns={baseColums} dataSource={detailData} col={2} />
        <p className={styles.detailTitle}>构件明细</p>
        <CommonTable columns={tableColumns} dataSource={detailData.stateRecordVOS} pagination={false} />
    </div>
}