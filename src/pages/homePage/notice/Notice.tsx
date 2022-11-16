import React, { useState } from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';

export default function Notice(): React.ReactNode {
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            title: '标题',
            width: 150,
            dataIndex: 'title',
            render: (_: string, record: Record<string, any>): React.ReactNode => (
                <Link to={`/homePage/notice/detail/${ record.id }`}>{_}</Link>
            )
        },
        {
            title: '发送人',
            width: 150,
            dataIndex: 'createUserName'
        },
        // {
        //     key: 'content',
        //     title: '内容',
        //     width: 150,
        //     dataIndex: 'content',
        //     render: (_: string, record: Record<string, any>): React.ReactNode => (
        //         <Link to={`/homePage/notice/detail/${ record.id }`}>{_}</Link>
        //     )
        // },
        {
            key: 'releaseTime',
            title: '发布时间',
            width: 200,
            dataIndex: 'releaseTime'
        }
    ]

    return <Page
        path="/tower-system/notice/staff/list"
        columns={ columns }
        headTabs={ [] }
        searchFormItems={ [
            {
                name: 'msg',
                label: '模糊查询项',
                children: <Input maxLength={50} placeholder="请输入标题/内容查询"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        } }
    />
}