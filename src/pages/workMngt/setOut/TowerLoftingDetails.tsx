/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-塔型放样明细
*/

import React from 'react';
import { Space, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
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
        key: 'code',
        title: '构件编号',
        dataIndex: 'code',
        width: 120
    },
    {
        key: 'structureTexture',
        title: '材质',
        width: 150,
        dataIndex: 'structureTexture',
    },
    {
        key: 'materialName',
        title: '材料名称',
        width: 200,
        dataIndex: 'materialName'
    },
    {
        key: 'structureSpec',
        title: '规格',
        dataIndex: 'structureSpec',
        width: 200,
    },
    {
        key: 'length',
        title: '长度（mm）',
        width: 200,
        dataIndex: 'length'
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
        key: 'basicsPartNum',
        title: '单段件数',
        width: 200,
        dataIndex: 'basicsPartNum'
    },
    {
        key: 'apertureNumber',
        title: '各孔径孔数',
        width: 200,
        dataIndex: 'apertureNumber'
    },
    // {
    //     key: 'apertureNumber',
    //     title: '单件孔数',
    //     width: 200,
    //     dataIndex: 'apertureNumber'
    // },
    {
        key: 'electricWelding',
        title: '电焊',
        width: 200,
        dataIndex: 'electricWelding'
    },
    {
        key: 'groove',
        title: '坡口',
        width: 200,
        dataIndex: 'groove'
    },
    {
        key: 'chamfer',
        title: '切角',
        width: 200,
        dataIndex: 'chamfer'
    },
    {
        key: 'openCloseAngle',
        title: '开合角',
        width: 200,
        dataIndex: 'openCloseAngle'
    },
    {
        key: 'bend',
        title: '火曲',
        width: 200,
        dataIndex: 'bend'
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
        key: 'specialCode',
        title: '特殊件号',
        width: 200,
        dataIndex: 'specialCode'
    },
    // {
    //     key: 'specialCode',
    //     title: '压制',
    //     width: 200,
    //     dataIndex: 'specialCode'
    // },
    // {
    //     key: 'specialCode',
    //     title: '坡口米数（米）',
    //     width: 200,
    //     dataIndex: 'specialCode'
    // },
    // {
    //     key: 'specialCode',
    //     title: '拼数',
    //     width: 200,
    //     dataIndex: 'specialCode'
    // },
    {
        key: 'slottedForm',
        title: '开槽形式',
        width: 200,
        dataIndex: 'slottedForm'
    },
    {
        key: 'intersectingLine',
        title: '割相贯线',
        width: 200,
        dataIndex: 'intersectingLine'
    },
    {
        key: 'type',
        title: '零件类型',
        width: 200,
        dataIndex: 'type'
    },
    {
        key: 'description',
        title: '备注',
        width: 200,
        dataIndex: 'description'
    },
    // {
    //     key: 'type',
    //     title: '含弧',
    //     width: 200,
    //     dataIndex: 'type'
    // },
    {
        key: 'perforate',
        title: '钻孔',
        width: 200,
        dataIndex: 'perforate'
    },
    // {
    //     key: 'perforate',
    //     title: '钻孔孔径孔数',
    //     width: 200,
    //     dataIndex: 'perforate'
    // },
    // {
    //     key: 'perforate',
    //     title: '有扩孔',
    //     width: 200,
    //     dataIndex: 'perforate'
    // },
    // {
    //     key: 'perforate',
    //     title: '扩孔孔径孔数',
    //     width: 200,
    //     dataIndex: 'perforate'
    // },
    // {
    //     key: 'perforate',
    //     title: '气割孔（0/1）',
    //     width: 200,
    //     dataIndex: 'perforate'
    // },
    // {
    //     key: 'perforate',
    //     title: '气割孔径孔数',
    //     width: 200,
    //     dataIndex: 'perforate'
    // },
    {
        key: 'basicsWeight',
        title: '单件重量（kg）',
        width: 200,
        dataIndex: 'basicsWeight'
    },
    {
        key: 'totalWeight',
        title: '总重（kg）',
        width: 200,
        dataIndex: 'totalWeight'
    },
    {
        key: 'totalWeight',
        title: '工艺列（核对）',
        width: 200,
        dataIndex: 'totalWeight'
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
        key: 'weldingEdge',
        title: '焊接边（mm）',
        width: 200,
        dataIndex: 'weldingEdge',
        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
            <span>{_ === -1 ? undefined : _}</span>
        )
    }
]

export default function TowerLoftingDetails(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();

    return <Page
        path="/tower-science/productStructure/list"
        exportPath={`/tower-science/productStructure/list`}
        columns={columns}
        headTabs={[]}
        requestData={{ productSegmentGroupId: params.productSegmentId }}
        extraOperation={
            <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>
        }
        searchFormItems={[]}
    />
}