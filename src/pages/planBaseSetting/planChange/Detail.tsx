import React, { useState } from 'react';
import { Button, Space, Spin, TablePaginationConfig } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, BaseInfo } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { baseDataColumns } from './data.json'

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}

const tableColumns = [
    {
        key: 'segmentName',
        title: '杆塔号',
        dataIndex: 'segmentName',
    },
    {
        key: 'code',
        title: '是否技术派工',
        dataIndex: 'code',
        width: 120
    },
    {
        key: 'materialName',
        title: '是否生产下达',
        width: 200,
        dataIndex: 'materialName'
    },
    {
        key: 'structureTexture',
        title: '是否全部报工',
        width: 150,
        dataIndex: 'structureTexture',
    },
    {
        key: 'structureSpec',
        title: '执行状态',
        dataIndex: 'structureSpec',
        width: 200,
    }
]

export default function PlanChangeDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, status: string }>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [detailData, setDetailData] = useState<IResponseData | undefined>(undefined);
    const page = {
        current: 1,
        pageSize: 10
    };
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: []): void => {
        setSelectedKeys(selectedRowKeys);
    }

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
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            {/* {params.status&&<Button type="ghost" onClick={() => history.goBack()} disabled={!(selectedKeys.length>0)}>暂停</Button>}
            {params.status&&<Button type="ghost" onClick={() => history.goBack()} disabled={!(selectedKeys.length>0)}>取消</Button>}
            {params.status&&<Button type="ghost" onClick={() => history.goBack()} disabled={!(selectedKeys.length>0)}>恢复</Button>} */}
        </Space>
    ]}>
        <DetailTitle title='基本信息'/>
        <BaseInfo
            dataSource={{}}
            col={3}
            columns={baseDataColumns}
        />
        <DetailTitle title='杆塔信息'/>
        <CommonTable
            columns={tableColumns}
            dataSource={detailData?.records}
            onChange={(pagination: TablePaginationConfig) => {
                getTableDataSource(pagination);
            }}
            rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: SelectChange,
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