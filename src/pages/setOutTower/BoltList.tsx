import React, { useState } from 'react'
import { Button, Spin, Tabs } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
interface ITab {
    readonly basicHeight?: string;
    readonly id?: string;
    readonly productCategoryId?: string;
}
export default function BoltInfo(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
    const [ dataSource, setDataSource ] = useState<[]>([]);
    const [ activeKey, setActiveKey ] = useState<string>('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/boltRecord/getBasicHeightList?productCategoryId=${params.id}`);
        if(data[0]) {
            getDataSource(data[0].id);
            setActiveKey(data[0].id || '');
        }
        resole(data)
    }), {})
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '类型', dataIndex: 'typeName', key: 'typeName'},
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '等级', dataIndex: 'level', key: 'level' },
        { title: '规格', dataIndex: 'specs', key: 'specs' },
        { title: '无扣长（mm）', dataIndex: 'unbuckleLength', key: 'unbuckleLength' },
        { title: '小计', dataIndex: 'subtotal', key: 'subtotal' },
        { title: '合计', dataIndex: 'total', key: 'total' },
        { title: '单重（kg）', dataIndex: 'singleWeight', key: 'singleWeight' },
        { title: '合计重（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
    ]
    const getDataSource = async (basicHeightId?: string) => {
        const data: [] = await RequestUtil.get(`/tower-science/boltRecord/checkList`, {
            basicHeightId: basicHeightId,
            productCategoryId: params.id
        })
        setDataSource(data);
    }

    const detailData: any = data || [];

    if (loading) {
        return <Spin spinning={ loading }>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const tabChange = (activeKey: string) => {
        getDataSource(activeKey);
        setActiveKey(activeKey);
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="螺栓清单" />
                <Tabs onChange={tabChange} type="card">
                    {
                        detailData.map((item: ITab) => {
                            return <Tabs.TabPane tab={ `${item.basicHeight}米呼高` } key={ item.id }>
                                    <CommonTable columns={ columns } dataSource={ dataSource } pagination={ false } />
                            </Tabs.TabPane>
                        })
                    }
                </Tabs>
            </DetailContent>
        </Spin>
    </>
}