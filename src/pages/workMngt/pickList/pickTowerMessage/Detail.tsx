import React from 'react'
import { Button, Spin, Space, TablePaginationConfig, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import { useState } from 'react';

const towerColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段名', dataIndex: 'segmentName', key: 'segmentName', },
    // { title: '段重复数', dataIndex: 'amount', key: 'amount' },
    { title: '构件编号', dataIndex: 'code', key: 'code' },
    { title: '材料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
    { title: '宽度（mm）', dataIndex: 'width', key: 'width' },
    { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness' },
    { title: '长度（mm）', dataIndex: 'length', key: 'length' },
    { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum' },
    { title: '理算重量（kg）', dataIndex: 'basicsTheoryWeight', key: 'basicsTheoryWeight' },
    { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight' },
    { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
    // { title: '总计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
    { title: '备注', dataIndex: 'description', key: 'description' }
]

export default function PickTowerDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ productSegmentId: string }>();
    const [tableDataSource,setTableDataSource] = useState([]);
    const [tablePagination,setTablePagination] =useState({
        current: 1,
        pageSize: 20,
        total: 0,
        showSizeChanger: false
    });
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/check`,{productSegmentId:params.productSegmentId,...tablePagination, size:tablePagination.pageSize})
        setTableDataSource(data.records);
        setTablePagination({
            ...tablePagination,
            current: data.current,
            pageSize: data.size,
            total: data.total
        })
        resole(data)
    }), {});
    
    const onTableChange=async (pagination: TablePaginationConfig)=> {
        const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/check`,{productSegmentId:params.productSegmentId,...pagination, size:pagination.pageSize})
        setTableDataSource(data.records);
        setTablePagination({
            ...tablePagination,
            current: data.current,
            pageSize: data.size,
            total: data.total
        })
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                {/* <Button type='primary' onClick={()=>{window.open()}}>导出</Button> */}
                <Table 
                    dataSource={tableDataSource} 
                    columns={towerColumns}
                    
                    pagination={{
                        ...tablePagination,
                        showSizeChanger: true,
                        showTotal: (total: any) => `共${total} 条记录`,
                    }}
                    onChange={onTableChange}
                />
            </DetailContent>
        </Spin>
    </>
}