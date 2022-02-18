import React, { useState } from 'react';
import { Button, Space, Spin, TablePaginationConfig } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './DrawTower.module.less';

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}

const tableColumns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'segmentName',
        title: '段号',
        dataIndex: 'segmentName',
    },
    {
        key: 'code',
        title: '构件编号',
        dataIndex: 'code',
        width: 120
    },
    {
        key: 'materialName',
        title: '材料',
        width: 200,
        dataIndex: 'materialName'
    },
    {
        key: 'structureTexture',
        title: '材质',
        width: 150,
        dataIndex: 'structureTexture',
    },
    {
        key: 'structureSpec',
        title: '规格',
        dataIndex: 'structureSpec',
        width: 200,
    },
    {
        key: 'width',
        title: '宽度（mm）',
        width: 200,
        dataIndex: 'width'
    },
    {
        key: 'thickness',
        title: '厚度（mm）',
        width: 200,
        dataIndex: 'thickness'
    },
    {
        key: 'length',
        title: '长度（mm）',
        width: 200,
        dataIndex: 'length'
    },
    {
        key: 'basicsWeight',
        title: '单件理算重量（kg）',
        width: 200,
        dataIndex: 'basicsWeight'
    },
    {
        key: 'drawBasicsWeight',
        title: '单件图纸重量（kg）',
        width: 200,
        dataIndex: 'drawBasicsWeight'
    },
    {
        key: 'basicsPartNum',
        title: '单段数量',
        width: 200,
        editable: false,
        dataIndex: 'basicsPartNum',
        render: (_: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'basicsPartWeight',
        title: '单段理算重量（kg）',
        width: 200,
        editable: false,
        dataIndex: 'basicsPartWeight'
    },
    {
        key: 'drawPartWeight',
        title: '单段图纸重量（kg）',
        width: 200,
        dataIndex: 'drawPartWeight'
    },
    {
        key: 'description',
        title: '备注',
        width: 200,
        dataIndex: 'description'
    }
]

export default function ComponentInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, structureCount: string }>();
    const [detailData, setDetailData] = useState<IResponseData | undefined>(undefined);
    const page = {
        current: 1,
        pageSize: 10
    };

    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/drawProductStructure/productCategory/${params.id}`, { ...pagination });
        setDetailData(data);
        resole(data);
    });

    const { loading } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent operation={[
        <Space direction="horizontal" size="small" >
            <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
        </Space>
    ]}>
        <p>件号数：<span className={styles.count}>{params.structureCount}</span></p>
        <CommonTable
            columns={tableColumns}
            dataSource={detailData?.records}
            onChange={(pagination: TablePaginationConfig) => {
                getTableDataSource(pagination);
            }}
            pagination={{
                current: detailData?.current || 0,
                pageSize: detailData?.size || 0,
                total: detailData?.total || 0,
                showSizeChanger: false
            }}
        />
    </DetailContent>
}