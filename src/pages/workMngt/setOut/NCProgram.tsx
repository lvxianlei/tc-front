/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-NC程序
*/


import React from 'react';
import { Space, Input, DatePicker, Button, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory } from 'react-router-dom';

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
    },
    {
        key: 'projectName',
        title: '段名',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectNumber',
        title: '构件编号',
        dataIndex: 'projectNumber',
        width: 120
    },
    {
        key: 'bidBuyEndTime',
        title: 'NC程序名称',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '上传时间',
        width: 150,
        dataIndex: 'biddingEndTime',
    },
    {
        key: 'biddingPerson',
        title: '上传人',
        dataIndex: 'biddingPerson',
        width: 200,
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 100,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Button type="link">下载</Button>
                <Popconfirm
                    title="确认删除?"
                    onConfirm={ () => {} }
                    okText="提交"
                    cancelText="取消"
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </Space>
        )
    }
]

export default function NCProgram(): React.ReactNode {
    const history = useHistory();
    
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Space direction="horizontal" size="small">
            <Button type="primary" ghost>下载</Button>
            <p>NC程序数 100/256</p>
            <Button type="primary" ghost>上传</Button>
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </Space>}
        searchFormItems={ [
            {
                name: 'startReleaseDate',
                label: '模糊查询项',
                children: <Input placeholder="段号/构件编号"/>
            },
            {
                name: 'startReleaseDate',
                label: '上传时间',
                children: <DatePicker />
            },
        ] }
    />
}