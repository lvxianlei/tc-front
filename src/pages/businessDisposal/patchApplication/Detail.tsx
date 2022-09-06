/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-详情
 */

import React from 'react';
import { BaseInfo, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './PatchApplication.module.less';
import { detailColumns } from "./patchApplication.json"
import { useHistory, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';


export default function Detail(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`${params.id}`)
        resole({
            ...data
        })
    }), {})

    return (
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button onClick={() => history.push(`/businessDisposal/patchApplication`)}>关闭</Button>
            </Space>
        ]}>
            <BaseInfo dataSource={data} columns={detailColumns} />
            <OperationRecord title="操作信息" serviceId={params.id} serviceName="tower-science" />
        </DetailContent>
    )
}