import React, { useState } from 'react';
import { Button, Spin, Space, TablePaginationConfig } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}



export default function AssemblyWeldInfo(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>()
    const [ detailData, setDetailData ] = useState<IResponseData | undefined>(undefined);
    const page = {
        current: 1,
        pageSize: 10
    };
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段号', dataIndex: 'segmentName', key: 'segmentName', },
        { title: '组件号', dataIndex: 'componentId', key: 'componentId' },
        { title: '主件号', dataIndex: 'mainPartId', key: 'mainPartId' },
        { title: '单段组数', dataIndex: 'singleNum', key: 'singleNum' },
        { title: '单组重量（kg）', dataIndex: 'singleGroupWeight', key: 'singleGroupWeight' },
        { title: '电焊米数（mm）', dataIndex: 'electricWeldingMeters', key: 'electricWeldingMeters' },
        { title: '件号信息', dataIndex: 'numInformation', key: 'numInformation' },
        { title: '备注', dataIndex: 'description', key: 'description' },
    ]
    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/welding/getWeldingByProductSegmentId`, { ...pagination, productSegmentId:params.id });
        setDetailData(data);
        resole(data);
    });

    const { loading } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    return <DetailContent operation={ [
        <Space direction="horizontal" size="small" >
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
        </Space>
    ] }>
        <DetailTitle title="组焊清单" />
        <CommonTable 
            columns={ columns } 
            dataSource={ detailData?.records } 
            onChange={ (pagination: TablePaginationConfig) => { 
                getTableDataSource(pagination);
            } }
            pagination={{
                current: detailData?.current || 0,
                pageSize: detailData?.size || 0,
                total: detailData?.total || 0,
                showSizeChanger: true,
                showTotal: (total: number) => `共${total} 条记录`,
            }}
        />
    </DetailContent>
}