import React, { useState } from 'react'
import { Button, Spin, TablePaginationConfig} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

const tableColumns = [
    { title: '条码', dataIndex: 'ptcreateDeName', key: 'createDeptName', },
    { title: '件号', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '材料', dataIndex: 'createTime', key: 'createTime' },
    { title: '材质', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '规格', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '长度（mm）', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '类型', dataIndex: 'description', key: 'description' },
    { title: '单件孔数', dataIndex: 'description', key: 'description' },
    { title: '单段数', dataIndex: 'description', key: 'description' },
    { title: '加工数', dataIndex: 'description', key: 'description' },
    { title: '试装数', dataIndex: 'description', key: 'description' },
    { title: '总重（kg）', dataIndex: 'description', key: 'description' },
    { title: '工艺流程', dataIndex: 'description', key: 'description' }
]

export default function ConfirmTaskDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string ,status: string}>();
    const [ detailData, setDetailData ] = useState<any | undefined>(undefined);
    const page = {
        current: 1,
        pageSize: 20
    };

    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/drawProductStructure/productCategory/${ params.id }`, { ...pagination });
        setDetailData(data);
        resole(data);
    });
    const { loading } = useRequest<any>(() => getTableDataSource(page), {});

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="构件明细列表" />
                <CommonTable 
                    columns={tableColumns} 
                    dataSource={detailData?.statusRecordList} 
                    onChange={ (pagination: TablePaginationConfig) => { 
                        getTableDataSource(pagination);
                    } }
                    pagination={{
                        current: detailData?.current || 0,
                        pageSize: detailData?.size || 0,
                        total: detailData?.total || 0,
                        showSizeChanger: false
                    }}
                />
            </DetailContent>
    </>
}