import React from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

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
        key: 'basicsTheoryWeight',
        title: '单件理算重量（kg）',
        width: 200,
        dataIndex: 'basicsTheoryWeight'
    },
    {
        key: 'drawWeight',
        title: '单件图纸重量（kg）',
        width: 200,
        dataIndex: 'drawWeight'
    },
    {
        key: 'basicsPartNum',
        title: '单段数量',
        width: 200,
        editable: false,
        dataIndex: 'basicsPartNum'
    },
    {
        key: 'partTheoryWeight',
        title: '单段理算重量（kg）',
        width: 200,
        editable: false,
        dataIndex: 'partTheoryWeight'
    },
    {
        key: 'partDrawWeight',
        title: '单段图纸重量（kg）',
        width: 200,
        dataIndex: 'partDrawWeight'
    },
    {
        key: 'description',
        title: '备注',
        width: 200,
        dataIndex: 'description'
    }
]

export default function ComponentDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, segmentId: string, data: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/drawProductStructure/list/${params.segmentId}`)
        resole(data)
    }), {})
    const detailData: any = data;


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
        <p>
            <span>单段件号数：
                <span style={{ color: '#FF8C00', paddingRight: '12px' }}>{params.data.split(',')[0]}</span>
            </span>
            <span>单段件数：
                <span style={{ color: '#FF8C00', paddingRight: '12px' }}>{params.data.split(',')[1]}</span>
            </span>
            <span>单段重量：
                <span style={{ color: '#FF8C00', paddingRight: '12px' }}>{params.data.split(',')[2]}</span>
            </span>
        </p>
        <CommonTable columns={tableColumns} dataSource={detailData} pagination={false} />
    </DetailContent>
}