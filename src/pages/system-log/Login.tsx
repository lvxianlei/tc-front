import React from 'react'
import AuthUtil from '../../utils/AuthUtil';
import { Page } from '../common';

export default function Login(): React.ReactNode {

    const columns = [
        {
            key: 'loginTime',
            title: '登录时间',
            dataIndex: 'loginTime',
            width: 100
        },
        {
            key: 'userName',
            title: '登录人员',
            width: 100,
            dataIndex: 'userName'
        },
        {
            key: 'terminalType',
            title: '终端类型',
            width: 100,
            dataIndex: 'terminalType',
            render: (terminalType: number): React.ReactNode => {
                switch (terminalType) {
                    case 1:
                        return 'web';
                    case 2:
                        return '移动端';
                    default:
                        return '其他';
                }
            }  
        },
        {
            key: 'terminalVersion',
            title: '浏览器/终端版本',
            width: 200,
            dataIndex: 'terminalVersion'
        },
        {
            key: 'operatingSystem',
            title: '操作系统',
            width: 200,
            dataIndex: 'operatingSystem'
        },
        {
            key: 'deviceName',
            title: '设备名称',
            width: 100,
            dataIndex: 'deviceName'
        },
        {
            key: 'mac',
            title: 'MAC地址',
            width: 100,
            dataIndex: 'mac'
        },
        {
            key: 'ip',
            title: '登录IP',
            width: 100,
            dataIndex: 'ip'
        },
        {
            key: 'address',
            title: '地址',
            width: 200,
            dataIndex: 'address'
        }
    ]
    
    return <Page
            path="/sinzetech-log/login"
            columns={ columns }
            searchFormItems={[]}
            requestData={{tenantId: AuthUtil.getTenantId()}}
        />
}