import React from 'react'
import { Button, Space, Input, Form, Select } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { Page } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import { useState } from 'react';

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
            <span >{_ === -1 && _ === null ? 0 : _ ? (parseFloat(record?.basicsTheoryWeight) * parseFloat(record?.basicsPartNum)).toFixed(2) : '-'}</span>
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
    const params = useParams<{ id: string, productSegmentId: string }>();
    const [filterValue, setFilterValue] = useState({});

    // const { data: segmentNames } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
    //     try {
    //         const result = await RequestUtil.get<any>(`/tower-science/productSegment/list/${params.id}`);
    //         resole(result)
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), {})

    return <>
        <Page
            path="/tower-science/drawProductStructure/check"
            exportPath={`/tower-science/drawProductStructure/check`}
            columns={towerColumns}
            headTabs={[]}
            requestData={{
                segmentId: params.productSegmentId === 'all' ? '' : params.productSegmentId,
                productCategoryId: params.productSegmentId === 'all' ? params?.id : '',
                ...filterValue
            }}
            extraOperation={
                <Space direction="horizontal" size="small">
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
            }
            searchFormItems={
                [
                    {
                        name: 'materialName',
                        label: '材料名称',
                        children: <Input maxLength={50} />
                    },
                    {
                        name: 'structureTexture',
                        label: '材质',
                        children: <Input maxLength={50} />
                    },
                    {
                        name: 'segmentName',
                        label: '段名',
                        children: <Input maxLength={50} />
                        // <Form.Item name="segmentId" initialValue={params.productSegmentId}>
                        //     <Select placeholder="请选择" style={{ width: '100%' }}>
                        //         <Select.Option key={0} value={''}>全部</Select.Option>
                        //         {segmentNames && segmentNames.map((item: any) => {
                        //             return <Select.Option key={item.id} value={item.id}>{item.segmentName}</Select.Option>
                        //         })}
                        //     </Select>
                        // </Form.Item>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '查询',
                        children: <Input placeholder="请输入构件编号查询" maxLength={50} />
                    },
                ]
            }
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
    </>
}