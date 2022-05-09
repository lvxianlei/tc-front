import { Button, Space } from 'antd';
import React from 'react';
import { useHistory, useParams, } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';

export default function BoltCheck(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const history = useHistory()
    const columns: any = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (text: any, item: any, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '塔位号',
            width: 150,
            dataIndex: 'productNames'
        },
        {
            title: '呼高m',
            width: 150,
            dataIndex: 'basicHeight',
        },
        {
            title: '基数',
            width: 150,
            dataIndex: 'num',
        },
        {
            title: '总重',
            width: 150,
            dataIndex: 'totalWeight',
        },
        {
            title: '说明',
            dataIndex: 'description',
            width: 120,
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (text: any, item: any) => {
                return (
                    <div className='operation'>
                        <span
                            style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer' }}
                            onClick={() => {
                                history.push(`/workMngt/boltList/boltCheck/${params.id}/${item.id}`)
                            }}
                        >螺栓明细</span>
                    </div>
                )
            }
        },
    ]
    /**
     * 完成校验
     */
    const successCheck = async () => {
        await RequestUtil.put('/tower-science/boltRecord/completeCheck', {
            productCategoryId: params.id,
        })
        history.go(-1)
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${params.id}`}
                exportPath={`/tower-science/boltRecord/basicHeight/${params.id}`}
                columns={columns}
                extraOperation={
                    <Space size="small">
                        <Button type="primary" ghost onClick={() => { successCheck() }}>完成核验</Button>
                        <Button type="ghost" onClick={() => { history.go(-1) }}>返回</Button>
                    </Space>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
        </div>
    )
}