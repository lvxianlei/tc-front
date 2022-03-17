/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-杆塔放样明细
*/

import React from 'react';
import { Space, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom';

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'segmentName',
        title: '段名',
        width: 150,
        dataIndex: 'segmentName'
    },
    {
        key: 'repeatNum',
        title: '段重复数',
        width: 150,
        dataIndex: 'repeatNum'
    },
    {
        key: 'code',
        title: '构件编号',
        dataIndex: 'code',
        width: 120
    },
    {
        key: 'materialName',
        title: '材料名称',
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
        key: 'basicsPartNum',
        title: '单段件数',
        width: 200,
        dataIndex: 'basicsPartNum'
    },
    {
        key: 'basicsWeight',
        title: '单件重量（kg）',
        width: 200,
        dataIndex: 'basicsWeight'
    },
    {
        key: 'totalWeight',
        title: '小计重量（kg）',
        width: 200,
        dataIndex: 'totalWeight'
    },
    {
        key: 'description',
        title: '备注',
        width: 200,
        dataIndex: 'description'
    },
    {
        key: 'specialCode',
        title: '特殊件号',
        width: 200,
        dataIndex: 'specialCode'
    },
    {
        key: 'electricWelding',
        title: '电焊',
        width: 200,
        dataIndex: 'electricWelding'
    },
    {
        key: 'bend',
        title: '火曲',
        width: 200,
        dataIndex: 'bend'
    },
    {
        key: 'chamfer',
        title: '切角',
        width: 200,
        dataIndex: 'chamfer'
    },
    {
        key: 'shovelBack',
        title: '铲背',
        width: 200,
        dataIndex: 'shovelBack'
    },
    {
        key: 'rootClear',
        title: '清根',
        width: 200,
        dataIndex: 'rootClear'
    },
    {
        key: 'squash',
        title: '打扁',
        width: 200,
        dataIndex: 'squash'
    },
    {
        key: 'openCloseAngle',
        title: '开合角',
        width: 200,
        dataIndex: 'openCloseAngle'
    },
    {
        key: 'perforate',
        title: '钻孔',
        width: 200,
        dataIndex: 'perforate'
    },
    {
        key: 'groove',
        title: '坡口',
        width: 200,
        dataIndex: 'groove'
    },
    {
        key: 'intersectingLine',
        title: '割相贯线',
        width: 200,
        dataIndex: 'intersectingLine'
    },
    {
        key: 'slottedForm',
        title: '开槽形式',
        width: 200,
        dataIndex: 'slottedForm'
    },
    {
        key: 'sides',
        title: '边数',
        width: 200,
        dataIndex: 'sides',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'perimeter',
        title: '周长',
        width: 200,
        dataIndex: 'perimeter',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'surfaceArea',
        title: '表面积',
        width: 200,
        dataIndex: 'surfaceArea',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    },
    {
        key: 'apertureNumber',
        title: '各孔径孔数',
        width: 200,
        dataIndex: 'apertureNumber'
    },
    {
        key: 'weldingEdge',
        title: '焊接边（mm）',
        width: 200,
        dataIndex: 'weldingEdge',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    }
]

export default function PoleLoftingDetails(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productId: string }>();

    return <Page
        path="/tower-science/productStructure/listByProduct"
        exportPath={`/tower-science/productStructure/listByProduct`}
        columns={columns}
        requestData={{ productId: params.productId }}
        headTabs={[]}
        extraOperation={<Space direction="horizontal" size="small">
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
        </Space>}
        tableProps={{
            pagination: false
        }}
        searchFormItems={[]}
    />
}