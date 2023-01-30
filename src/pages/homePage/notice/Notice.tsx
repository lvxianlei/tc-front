import React, { useState } from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';

export default function Notice(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({})

    const { run: signIn } = useRequest<{ [key: string]: any }>((id: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-system/notice/staff/sign`, { id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: read } = useRequest<{ [key: string]: any }>((id: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-system/notice/staff/read`, { id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSignIn = async (id: string) => {
        Modal.confirm({
            title: "签收",
            content: "确定签收吗？",
            onOk: () => new Promise(async (resolve, reject) => {
                try {
                    await signIn(id)
                    resolve(true)
                    await message.success('签收成功...')
                    history.go(0)
                } catch (error) {
                    reject(false)
                    console.log(error)
                }
            })
        })
    }

    const handleRead = async (id: string) => {
        await read(id)
        history.go(0)
    }

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
        },
        {
            title: "操作",
            dataIndex: "opration",
            width: 50,
            render: (_: any, records: any) => <>
                <Button type="link" size="small"
                    onClick={() => history.push(`/attach/data`, {
                        type: "notice",
                        id: records.id
                    })}>查看</Button>
                {records?.signState === 1 && <Button
                    type="link"
                    size="small"
                    disabled={[1, 3].includes(records?.state)}
                    onClick={handleSignIn.bind(null, records.id)}
                >签收</Button>}
                {records?.signState == 2 && <Button
                    type="link"
                    size="small"
                    disabled={[1, 3].includes(records?.state)}
                    onClick={handleRead.bind(null, records.id)}
                >已读</Button>}
            </>
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