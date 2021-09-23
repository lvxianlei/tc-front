import React from 'react'
import { Button, Spin, Space, TableColumnGroupType } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import { useState } from 'react';

const towerColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '塔型', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '塔型钢印号', dataIndex: 'amount', key: 'amount' },
    { title: '任务单号', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '呼高', dataIndex: 'unit', key: 'unit' },
]

const paragraphColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '单段件号数', dataIndex: 'amount', key: 'amount' },
    { title: '单段件数', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '单段重量', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '备注', dataIndex: 'amount', key: 'amount' },
    { title: '操作', dataIndex: 'operation', key:'operation', render: (_a: any, _b: any, index: number): React.ReactNode => (<Button type='link'>选择套用</Button>)}
]

export default function DrawApply(): React.ReactNode {
    const history = useHistory();
    const [paragraphData, setParagraphData] = useState([] as undefined | any);
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="套用" />
                <CommonTable 
                    dataSource={[{partBidNumber:2}]} 
                    columns={towerColumns}
                    onRow={
                        (record:any,index:number)=>({
                            onClick:()=>{setParagraphData([{},{}])}
                        })
                    }
                />
                <CommonTable dataSource={paragraphData} columns={paragraphColumns}/>
            </DetailContent>
        </Spin>
    </>
}