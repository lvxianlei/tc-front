/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-详情
 */

import React from 'react';
import { BaseInfo, CommonTable, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './PatchApplication.module.less';
import { detailColumns, detailTableColumns } from "./patchApplication.json"
import { useHistory, useParams } from 'react-router-dom';
import { Button, Space, Spin } from 'antd';


export default function Detail(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`/tower-science/supplyEntry/${params.id}`);
        resole(data)
    }), {})

    return (
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space direction="horizontal" size="small" >
                    <Button onClick={() => history.push(`/businessDisposal/patchApplication`)}>关闭</Button>
                </Space>
            ]}>
                <BaseInfo columns={detailColumns} dataSource={data || {}} col={4} />
                <CommonTable columns={detailTableColumns} dataSource={data?.supplyStructureVOList || []} />
                <OperationRecord title="操作信息" serviceId={params.id} serviceName="tower-science" />
            </DetailContent>
        </Spin>
    )
}