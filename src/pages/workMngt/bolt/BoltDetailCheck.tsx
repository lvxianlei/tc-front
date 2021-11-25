import { Button, } from 'antd';
import React, { useState } from 'react';
import { useHistory, useParams, } from 'react-router-dom';
import { Page } from '../../common';
import './BoltDetailList.less';
import BoltDetailProblem from './problemModal';

export default function BoltCheck(): React.ReactNode {
    const params = useParams<{ id: string, boltId: string }>();
    const history = useHistory()
    const columns: any = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_text: any, _item: any, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '螺栓类型',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '名称',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '等级',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '规格',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '小计',
            width: 150,
            dataIndex: 'subtotal',
        },
        {
            title: '合计',
            width: 150,
            dataIndex: 'total',
        },
        {
            title: '单重（kg）',
            width: 150,
            dataIndex: 'singleWeight',
        },
        {
            title: '合计重（kg）',
            width: 150,
            dataIndex: 'totalWeight',
        },
        {
            title: '备注',
            width: 150,
            dataIndex: 'description',
        },
    ]
    const [isProblemModal, setIsProblemModal] = useState<boolean>(false);//提交问题弹框显示
    const [refresh, setRefresh] = useState(false);
    const [id, setId] = useState<string | null>(null)
    /**
     * 
     * @param refresh 是否刷新列表
     */
    const onCancel = (refresh?: boolean) => {
        if (refresh) {
            setRefresh(!refresh)
        }
        setIsProblemModal(false)
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/checkList`}
                requestData={{ productCategoryId: params.boltId, basicHeightId: params.id }}
                columns={columns}
                refresh={refresh}
                extraOperation={
                    <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
            {
                isProblemModal ?
                    <BoltDetailProblem
                        cancelModal={onCancel}
                        id={id}
                    /> : null
            }
        </div>
    )
}