/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-塔型放样明细
*/

import React, { useState } from 'react';
import { Space, Button, Input, Select, Form } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import result from 'antd/lib/result';
import RequestUtil from '../../../utils/RequestUtil';
import { SearchTable } from '../../common';

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
    {
        key: 'holesNum',
        title: '单件孔数',
        width: 200,
        dataIndex: 'holesNum'
    },
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
    {
        key: 'suppress',
        title: '压制',
        width: 200,
        dataIndex: 'suppress'
    },
    {
        key: 'grooveMeters',
        title: '坡口米数（米）',
        width: 200,
        dataIndex: 'grooveMeters'
    },
    {
        key: 'spellNumber',
        title: '拼数',
        width: 200,
        dataIndex: 'spellNumber'
    },
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
    {
        key: 'arcContaining',
        title: '含弧',
        width: 200,
        dataIndex: 'arcContaining'
    },
    {
        key: 'perforate',
        title: '钻孔',
        width: 200,
        dataIndex: 'perforate'
    },
    {
        key: 'perforateNumber',
        title: '钻孔孔径孔数',
        width: 200,
        dataIndex: 'perforateNumber'
    },
    {
        key: 'withReaming',
        title: '扩孔',
        width: 200,
        dataIndex: 'withReaming'
    },
    {
        key: 'reamingNumber',
        title: '扩孔孔径孔数',
        width: 200,
        dataIndex: 'reamingNumber'
    },
    {
        key: 'gasCutting',
        title: '气割孔（0/1）',
        width: 200,
        dataIndex: 'gasCutting'
    },
    {
        key: 'gasCuttingNumber',
        title: '气割孔径孔数',
        width: 200,
        dataIndex: 'gasCuttingNumber'
    },
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
        key: 'craftName',
        title: '工艺列（核对）',
        width: 200,
        dataIndex: 'craftName'
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
    const [filterValue, setFilterValue] = useState({});

    const { data: segmentNames } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/productSegment/list/${params.id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    return <SearchTable
        path="/tower-science/productStructure/list"
        exportPath={`/tower-science/productStructure/list`}
        columns={columns}
        headTabs={[]}
        requestData={{ productCategoryId: params.id, segmentId: params.productSegmentId, ...filterValue }}
        extraOperation={
            <Space direction="horizontal" size="small" className={styles.bottomBtn}>
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
                    name: 'segmentId',
                    label: '段名',
                    children: <Form.Item name="segmentId" initialValue={params.productSegmentId}>
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Select.Option key={0} value={''}>全部</Select.Option>
                            {segmentNames && segmentNames.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.segmentName}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'code',
                    label: '查询',
                    children: <Input placeholder="请输入构件编号查询" maxLength={50} />
                },
            ]
        }
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            setFilterValue(values);
            return values;
        }}
    />
}