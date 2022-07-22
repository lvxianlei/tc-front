/**
 * @author zyc
 * @copyright © 2021 
 * @description 业务处置管理-取消暂停恢复-已加工明细
 */

import React from 'react';
import { Input } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import { useParams } from 'react-router-dom';

export default function SetOutList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'issuedNumber',
            title: '下达单号',
            width: 80,
            dataIndex: 'issuedNumber'
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 50,
            dataIndex: 'segmentName'
        },
        {
            key: 'productCode',
            title: '构件编号',
            dataIndex: 'productCode',
            width: 80
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 80,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 80,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 80,
            dataIndex: 'structureSpec',
        },
        {
            key: 'standard',
            title: '标准',
            dataIndex: 'standard',
            width: 50,
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 80,
            dataIndex: 'width'
        },
        {
            key: 'thick',
            title: '厚度（mm）',
            width: 80,
            dataIndex: 'thick'
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 80,
            dataIndex: 'length'
        },
        {
            key: 'processNum',
            title: '加工数',
            width: 50,
            dataIndex: 'processNum'
        },
        {
            key: 'reportWorkNum',
            title: '报工数',
            width: 50,
            dataIndex: 'reportWorkNum'
        },
        {
            key: 'stopNum',
            title: '暂停数',
            width: 50,
            dataIndex: 'stopNum'
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 80,
            dataIndex: 'basicsWeight'
        }
    ]

    const params = useParams<{ id: string }>();

    return <Page
        path={`/tower-science/planChange/record/${params.id}`}
        columns={columns}
        headTabs={[]}
        searchFormItems={[
            {
                name: 'productCode',
                label: '模糊查询项',
                children: <Input placeholder="构件编号" />
            }
        ]}
        onFilterSubmit={(values: Record<string, any>) => {
            return values;
        }}
    />
}