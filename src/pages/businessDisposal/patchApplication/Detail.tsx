/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-详情
 */

import React from 'react';
import { Attachment, BaseInfo, CommonTable, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './PatchApplication.module.less';
import { detailColumns, detailTableColumns } from "./patchApplication.json"
import { useHistory, useParams } from 'react-router-dom';
import { Button, Space, Spin, Tooltip } from 'antd';


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
                    <Button onClick={() => history.goBack()}>关闭</Button>
                </Space>
            ]}>
                <BaseInfo columns={detailColumns.map(res => {
                    if (res.dataIndex === 'description') {
                        return {
                            ...res,
                            render: (_: any): React.ReactNode => (
                                <Tooltip placement="topLeft" title={_?.description}>
                                    {_ && _.description ? _?.description?.substring(0, 49) + '...' : '-'}
                                </Tooltip>
                            ),
                        }
                    }
                    return res
                })} dataSource={data || {}} col={4} />
                <CommonTable columns={detailTableColumns} dataSource={data?.supplyStructureVOList || []} />
                <OperationRecord title="操作信息" serviceId={params.id} serviceName="tower-science" />
                <Attachment dataSource={data?.fileVOList || []} />
            </DetailContent>
        </Spin>
    )
}