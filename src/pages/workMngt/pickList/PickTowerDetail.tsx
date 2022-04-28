import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import ExportList from '../../../components/export/list';

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
        title: '段名', 
        dataIndex: 'segmentName', 
        key: 'segmentName', 
    },
    { 
        title: '段重复数', 
        dataIndex: 'repeatNumber', 
        key: 'repeatNumber' 
    },
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
        key: 'basicsTheoryWeight' 
    },
    { 
        title: '单件重量（kg）', 
        dataIndex: 'basicsWeight', 
        key: 'basicsWeight' 
    },
    { 
        title: '小计重量（kg）', 
        dataIndex: 'subtotalWeight', 
        key: 'subtotalWeight' 
    },
    { 
        title: '总计重量（kg）', 
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
    const history = useHistory()
    const params = useParams<{ productId: string }>()
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/material/${params.productId}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <Button type='primary' onClick={()=>{setIsExportStoreList(true)}} style={{marginBottom:'12px'}}>导出</Button>
                {isExport?<ExportList
                    history={history}
                    location={location}
                    match={match}
                    columnsKey={() => {
                        let keys = [...towerColumns]
                        keys.pop()
                        return keys
                    }}
                    current={0}
                    size={0}
                    total={0}
                    url={`/tower-science/drawProductStructure/material/${params.productId}`}
                    serchObj={{}}
                    closeExportList={() => { setIsExportStoreList(false) }}
                />:null}
                <CommonTable dataSource={detailData} columns={towerColumns} pagination={false}/>
            </DetailContent>
        </Spin>
    </>
}