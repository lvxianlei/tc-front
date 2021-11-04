import React, { useState } from 'react'
import { Button, Spin, Tabs} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './deliveryTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '产品名称', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '包名称', dataIndex: 'createTime', key: 'createTime' },
    { title: '塔型', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '塔位号', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '呼高', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '基数', dataIndex: 'description', key: 'description' },
    { title: '班组', dataIndex: 'description', key: 'description' },
]


export default function ConfirmTaskDetail(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
    const [ dataSource, setDataSource ] = useState<[]>([]);
    const [ activeKey, setActiveKey ] = useState<string>('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getDrawTaskById?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const getDataSource = async (basicHeightId?: string) => {
        const data: [] = await RequestUtil.get(`/tower-science/boltRecord/checkList`, {
            basicHeightId: basicHeightId,
            productCategoryId: params.id
        })
        setDataSource(data);
    }

    const detailData: any = data || [];

    const tabChange = (activeKey: string) => {
        getDataSource(activeKey);
        setActiveKey(activeKey);
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button type='primary' onClick={() => history.goBack()}>确认出库</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="成品出库"/>
                <Tabs onChange={tabChange} type="card">
                    <Tabs.TabPane tab={ `未出库` } key={ 1 }>
                        <CommonTable columns={ tableColumns } dataSource={ [] } pagination={ false } />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={ `已出库` } key={ 2 }>
                        <CommonTable columns={ [...tableColumns,{ title: '发包人员', dataIndex: 'description', key: 'description' } ]} dataSource={ [] } pagination={ false } />
                    </Tabs.TabPane>
                </Tabs>
            </DetailContent>
        </Spin>
    </>
}