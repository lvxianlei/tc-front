import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Page, SearchTable } from '../../common';

export default function Notice(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});

    const columns = [
        {
            title: '标题',
            width: 150,
            dataIndex: 'title',
            render: (_: string, record: Record<string, any>): React.ReactNode => (
                <Link to={`/homePage/notice/detail/${record.id}`}>{_}</Link>
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
        },
        {
            title: "操作",
            dataIndex: "opration",
            width: 50,
            render: (_: any, records: any) => <>
                <Button type="link" size="small" >查看</Button>
                <Button
                    type="link"
                    size="small"
                    disabled={records?.signState === 2}
                >签收</Button>
            </>
        }
    ]

    return <SearchTable
        path="/tower-system/notice/staff/list"
        columns={columns as any[]}
        searchFormItems={[
            {
                name: 'msg',
                label: '模糊查询项',
                children: <Input maxLength={50} placeholder="请输入标题/内容查询" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            setFilterValue(values);
            return values;
        }}
    />
}