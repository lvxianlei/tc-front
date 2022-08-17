import React from 'react'
import { Button, Spin, TablePaginationConfig, Table } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { DetailContent } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import { useState } from 'react';
import ExportList from '../../../../components/export/list';

const towerColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (
            <span>{index + 1}</span>
        ) 
    },
    { 
        title: '段号', 
        dataIndex: 'segmentName', 
        key: 'segmentName', 
    },
    // { 
    //     title: '模式', 
    //     dataIndex: 'patternName', 
    //     key: 'patternName'
    // },
    { 
        title: '构件编号', 
        dataIndex: 'code', 
        key: 'code' 
    },
    { 
        title: '材料名称', 
        dataIndex: 'materialName', 
        key: 'materialName' 
    },
    { 
        title: '材质', 
        dataIndex: 'structureTexture', 
        key: 'structureTexture' 
    },
    { 
        title: '规格', 
        dataIndex: 'structureSpec', 
        key: 'structureSpec' 
    },
    { 
        title: '长度（mm）', 
        dataIndex: 'length', 
        key: 'length' 
    },
    { 
        title: '宽度（mm）', 
        dataIndex: 'width', 
        key: 'width', 
    },
    { 
        title: '厚度（mm）', 
        dataIndex: 'thickness', 
        key: 'thickness', 
    },
    { 
        title: '大头', 
        dataIndex: 'bigHead', 
        key: 'bigHead', 
    },
    { 
        title: '小头', 
        dataIndex: 'smallHead', 
        key: 'smallHead', 
    },
    { 
        title: '单段件数', 
        dataIndex: 'basicsPartNum', 
        key: 'basicsPartNum' 
    },
    { 
        title: '理算重量（kg）', 
        dataIndex: 'basicsTheoryWeight', 
        key: 'basicsTheoryWeight',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span >{_ === -1 ? 0 : (parseFloat(record?.basicsTheoryWeight)*parseFloat(record?.basicsPartNum)).toFixed(2)}</span>
        )
    },
    { 
        title: '单件重量（kg）', 
        dataIndex: 'basicsWeight', 
        key: 'basicsWeight' 
    },
    { 
        title: '小计重量（kg）',
        dataIndex: 'totalWeight', 
        key: 'totalWeight' 
    },
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    }
]

export default function PickTowerDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{id:string, productSegmentId: string }>();
    const [tableDataSource,setTableDataSource] = useState([]);
    const [tablePagination,setTablePagination] =useState({
        current: 1,
        pageSize: 20,
        total: 0,
        showSizeChanger: false
    });
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/check`,{segmentId:params.productSegmentId ==='all'?'':params.productSegmentId,
        productCategoryId:params.productSegmentId ==='all'?params?.id:'',...tablePagination, size:tablePagination.pageSize})
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
        const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/check`,{segmentId:params.productSegmentId ==='all'?'':params.productSegmentId,
        productCategoryId:params.productSegmentId ==='all'?params?.id:'',...pagination, size:pagination.pageSize})
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
                <Button type='primary' onClick={()=>{setIsExportStoreList(true)}}>导出</Button>
                {isExport?<ExportList
                    history={history}
                    location={location}
                    match={match}
                    columnsKey={() => {
                        let keys = [...towerColumns]
                        keys.pop()
                        return keys
                    }}
                    current={tablePagination.current}
                    size={tablePagination.pageSize}
                    total={tablePagination.total}
                    url={'/tower-science/drawProductStructure/check'}
                    serchObj={{segmentId:params.productSegmentId ==='all'?'':params.productSegmentId,
                    productCategoryId:params.productSegmentId ==='all'?params?.id:''}}
                    closeExportList={() => { setIsExportStoreList(false) }}
                />:null}
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