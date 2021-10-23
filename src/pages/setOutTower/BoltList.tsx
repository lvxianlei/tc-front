import React, { useState } from 'react'
import { Button, Spin, Tabs } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

export default function BoltInfo(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '类型', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '名称', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '等级', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '规格', dataIndex: 'amount', key: 'amount' },
        { title: '无扣长（mm）', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '小计', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '合计', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '单重（kg）', dataIndex: 'unit', key: 'unit' },
        { title: '合计重（kg）', dataIndex: 'goodsType', key: 'goodsType' },
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="螺栓清单" />
                <CommonTable columns={columns} dataSource={detailData?.cargoVOList} />
                {/* <Tabs onChange={ tabChange } type="card">
                {
                    detailData.map((item: ITab) => {
                        return <Tabs.TabPane tab={ item.basicHeight } key={ item.id }>
                            <Form form={ form } className={ styles.descripForm }>
                                <CommonTable columns={ columnsSetting } dataSource={ dataSource } pagination={ false } />
                            </Form>
                        </Tabs.TabPane>
                    })
                }
                </Tabs> */}
            </DetailContent>
        </Spin>
    </>
}