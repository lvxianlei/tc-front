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
        const data: any = await RequestUtil.get(`/tower-science/towerBoltRecord/getBasicHeightList?productCategoryId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '类型', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '名称', dataIndex: 'type', key: 'type' },
        { title: '等级', dataIndex: 'level', key: 'level' },
        { title: '规格', dataIndex: 'specs', key: 'specs' },
        { title: '无扣长（mm）', dataIndex: 'unbuckleLength', key: 'unbuckleLength' },
        { title: '小计', dataIndex: 'subtotal', key: 'subtotal' },
        { title: '合计', dataIndex: 'total', key: 'total' },
        { title: '单重（kg）', dataIndex: 'singleWeight', key: 'singleWeight' },
        { title: '合计重（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
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