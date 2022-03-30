import React from 'react'
import { Page } from '../common';

export default function OperationLog(): React.ReactNode {
    const columns = [
        {
            key: 'optName',
            title: '操作名称',
            dataIndex: 'optName',
            width: 100
        },
        {
            key: 'description',
            title: '操作描述',
            width: 300,
            dataIndex: 'description'
        },
        {
            key: 'deptName',
            title: '操作人部门',
            width: 100,
            dataIndex: 'deptName'
        },
        {
            key: 'optUserName',
            title: '操作人',
            width: 200,
            dataIndex: 'optUserName'
        },
        {
            key: 'optTime',
            title: '操作时间',
            width: 200,
            dataIndex: 'optTime'
        }
    ]

    return <Page
        path="/tower-system/log"
        columns={columns}
        searchFormItems={[]}
        requestData={{ operateTypeEnum: 'OPERATE_RECORD' }}
    />
}