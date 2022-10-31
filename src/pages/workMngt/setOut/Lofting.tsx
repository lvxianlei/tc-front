/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-放样
*/

import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, Input, Form, Upload, message, Modal, Dropdown, Menu, InputNumber, Select } from 'antd';
import { DetailContent, Page } from '../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './TowerLoftingAssign.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from './downloadTemplate';
import { ILofting, modalProps } from './ISetOut';
import { DownOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import StructureTextureAbbreviations from './StructureTextureAbbreviations';
import StructureTextureEdit from './StructureTextureEdit';
import MissCheck from './MissCheck';
import AddLofting from './AddLofting';
import useRequest from '@ahooksjs/use-request';
import PeriodCopy from './PeriodCopy';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function Lofting(): React.ReactNode {
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => setVisible(true)}>
                修改零件材质缩写
            </Menu.Item>
            <Menu.Item key="2" onClick={() => setEditVisible(true)}>
                修改材质
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{index + 1}</span><Form.Item name={['data', index, "id"]} initialValue={_} style={{ display: "none" }}>
                <Input size="small" onChange={() => rowChange(index)} />
            </Form.Item></>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 120,
            editable: true,
            dataIndex: 'segmentName',
            fixed: 'left' as FixedType,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "segmentName"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} disabled />
            //     </Form.Item>
            // )
        },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120,
            fixed: 'left' as FixedType,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "code"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "structureTexture"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 150,
            dataIndex: 'materialName',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "materialName"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 150,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "structureSpec"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'length',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "length"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 150,
            dataIndex: 'width',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "width"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'thickness',
            title: '厚度（mm）',
            width: 150,
            dataIndex: 'thickness',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "thickness"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 150,
            dataIndex: 'basicsPartNum',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "basicsPartNum"]} initialValue={_}>
            //         <InputNumber min={0} max={999} size="small" onChange={(e) => {
            //             const data = form.getFieldsValue(true).data;
            //             data[index] = {
            //                 ...data[index],
            //                 totalWeight: Number(e) * Number(data[index].basicsWeight)
            //             }
            //             form.setFieldsValue({ data: [...data] })
            //             rowChange(index);
            //         }} />
            //     </Form.Item>
            // )
        },
        {
            key: 'apertureNumber',
            title: '各孔径孔数',
            width: 80,
            dataIndex: 'apertureNumber',
            sorter: (a: any, b: any) => a.apertureNumber.substring(0, 1) - b.apertureNumber.substring(0, 1),
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "apertureNumber"]} initialValue={_} rules={[{
            //         pattern: /^[0-9,*]*$/,
            //         message: '仅可输入数字/*/,',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'holesNum',
            title: '单件孔数',
            width: 80,
            dataIndex: 'holesNum',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "holesNum"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'electricWelding',
            title: '电焊',
            width: 80,
            dataIndex: 'electricWelding',
            sorter: (a: any, b: any) => a.electricWelding - b.electricWelding,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "electricWelding"]} initialValue={_} rules={[{
            //         pattern: /^\+?[1-9][0-9]*$/,
            //         message: '仅可输入非负数',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'groove',
            title: '坡口',
            width: 80,
            dataIndex: 'groove',
            sorter: (a: any, b: any) => a.groove - b.groove,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "groove"]} initialValue={_}>
            //         <InputNumber min={0} max={999999} size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'chamfer',
            title: '切角',
            width: 80,
            dataIndex: 'chamfer',
            sorter: (a: any, b: any) => a.chamfer - b.chamfer,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "chamfer"]} initialValue={_} rules={[{
            //         pattern: /^\+?[1-9][0-9]*$/,
            //         message: '仅可输入非负数',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'openCloseAngle',
            title: '开合角',
            width: 80,
            dataIndex: 'openCloseAngle',
            sorter: (a: any, b: any) => a.openCloseAngle - b.openCloseAngle,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "openCloseAngle"]} initialValue={_} rules={[{
            //         pattern: /^\+?[1-9][0-9]*$/,
            //         message: '仅可输入非负数',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'bend',
            title: '火曲',
            width: 80,
            dataIndex: 'bend',
            sorter: (a: any, b: any) => a.bend - b.bend,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "bend"]} initialValue={_} rules={[{
            //         pattern: /^\+?[1-9][0-9]*$/,
            //         message: '仅可输入非负数',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'shovelBack',
            title: '铲背',
            width: 80,
            dataIndex: 'shovelBack',
            sorter: (a: any, b: any) => a.shovelBack - b.shovelBack,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "shovelBack"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'rootClear',
            title: '清根',
            width: 80,
            dataIndex: 'rootClear',
            sorter: (a: any, b: any) => a.rootClear - b.rootClear,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "rootClear"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'squash',
            title: '打扁',
            width: 80,
            dataIndex: 'squash',
            sorter: (a: any, b: any) => a.squash - b.squash,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "squash"]} initialValue={_} rules={[{
            //         pattern: /^\+?[1-9][0-9]*$/,
            //         message: '仅可输入非负数',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'specialCode',
            title: '特殊件号',
            width: 80,
            dataIndex: 'specialCode',
            sorter: (a: any, b: any) => a.specialCode - b.specialCode,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "specialCode"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'suppress',
            title: '压制',
            width: 80,
            dataIndex: 'suppress',
            sorter: (a: any, b: any) => a.suppress - b.suppress,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "suppress"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'grooveMeters',
            title: '坡口米数（米）',
            width: 120,
            dataIndex: 'grooveMeters',
            sorter: (a: any, b: any) => a.grooveMeters - b.grooveMeters,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "grooveMeters"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'spellNumber',
            title: '拼数',
            width: 80,
            dataIndex: 'spellNumber',
            sorter: (a: any, b: any) => a.spellNumber - b.spellNumber,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "spellNumber"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'slottedForm',
            title: '开槽形式',
            width: 80,
            dataIndex: 'slottedForm',
            sorter: (a: any, b: any) => a.slottedForm - b.slottedForm,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "slottedForm"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'intersectingLine',
            title: '割相贯线',
            width: 80,
            dataIndex: 'intersectingLine',
            sorter: (a: any, b: any) => a.intersectingLine - b.intersectingLine,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "intersectingLine"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'type',
            title: '零件类型',
            width: 80,
            dataIndex: 'type',
            sorter: (a: any, b: any) => Number(a.typeDictId) - Number(b.typeDictId),
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "type"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "description"]} initialValue={_}>
            //         <Input size="small" maxLength={50} onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'arcContaining',
            title: '含弧',
            width: 80,
            dataIndex: 'arcContaining',
            sorter: (a: any, b: any) => a.arcContaining - b.arcContaining,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "arcContaining"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" maxLength={50} onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'perforate',
            title: '钻孔',
            width: 80,
            dataIndex: 'perforate',
            sorter: (a: any, b: any) => a.perforate - b.perforate,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "perforate"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'perforateNumber',
            title: '钻孔孔径孔数',
            width: 120,
            dataIndex: 'perforateNumber',
            sorter: (a: any, b: any) => a.perforateNumber - b.perforateNumber,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "perforateNumber"]} initialValue={_}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'withReaming',
            title: '扩孔',
            width: 80,
            dataIndex: 'withReaming',
            sorter: (a: any, b: any) => a.withReaming - b.withReaming,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "withReaming"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'reamingNumber',
            title: '扩孔孔径孔数',
            width: 120,
            dataIndex: 'reamingNumber',
            sorter: (a: any, b: any) => a.reamingNumber - b.reamingNumber,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "reamingNumber"]} initialValue={_} rules={[{
            //         pattern: /^[0-9,*]*$/,
            //         message: '仅可输入数字/*/,',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'gasCutting',
            title: '气割孔（0/1）',
            width: 120,
            dataIndex: 'gasCutting',
            sorter: (a: any, b: any) => a.gasCutting - b.gasCutting,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "gasCutting"]} initialValue={_} rules={[{
            //         pattern: /^[1]*$/,
            //         message: '仅可输入1',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} maxLength={1} />
            //     </Form.Item>
            // )
        },
        {
            key: 'gasCuttingNumber',
            title: '气割孔孔径孔数',
            width: 120,
            dataIndex: 'gasCuttingNumber',
            sorter: (a: any, b: any) => a.gasCuttingNumber - b.gasCuttingNumber,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "gasCuttingNumber"]} initialValue={_} rules={[{
            //         pattern: /^[0-9,*]*$/,
            //         message: '仅可输入数字/*/,',
            //     }]}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 120,
            dataIndex: 'basicsWeight',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "basicsWeight"]} initialValue={_}>
            //         <Input type="number" min={0} size="small" onChange={(e) => {
            //             const data = form.getFieldsValue(true).data;
            //             data[index] = {
            //                 ...data[index],
            //                 totalWeight: Number(e.target.value) * Number(data[index].basicsPartNum)
            //             }
            //             form.setFieldsValue({ data: [...data] })
            //             rowChange(index);
            //         }} />
            //     </Form.Item>
            // )
        },
        {
            key: 'totalWeight',
            title: '总重（kg）',
            width: 80,
            dataIndex: 'totalWeight',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "totalWeight"]} initialValue={_}>
            //         <Input size="small" disabled />
            //     </Form.Item>
            // )
        },
        {
            key: 'craftName',
            title: '工艺列（核对）',
            width: 120,
            dataIndex: 'craftName',
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "craftName"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'sides',
            title: '边数',
            width: 80,
            dataIndex: 'sides',
            sorter: (a: any, b: any) => a.sides - b.sides,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "sides"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'perimeter',
            title: '周长',
            width: 80,
            dataIndex: 'perimeter',
            sorter: (a: any, b: any) => a.perimeter - b.perimeter,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "perimeter"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'surfaceArea',
            title: '表面积（m2）',
            width: 120,
            dataIndex: 'surfaceArea',
            sorter: (a: any, b: any) => a.surfaceArea - b.surfaceArea,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "surfaceArea"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'weldingEdge',
            title: '焊接边（mm）',
            width: 120,
            dataIndex: 'weldingEdge',
            sorter: (a: any, b: any) => a.weldingEdge - b.weldingEdge,
            // editable: true,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={['data', index, "weldingEdge"]} initialValue={_ === -1 ? undefined : _}>
            //         <Input size="small" onChange={() => rowChange(index)} />
            //     </Form.Item>
            // )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type='link' onClick={() => { setAddVisible(true); setType('edit'); setRowData([record]); }} disabled={!isShow}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => RequestUtil.post(`/tower-science/productStructure`, {
                            productStructureIdList: [record.id]
                        }).then(res => {
                            message.success('删除成功');
                            history.go(0);
                        })}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={!isShow}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    // const columnsSetting: Column[] = columns.map((col: Column) => {
    //     if (!col.editable) {
    //         return col;
    //     }
    //     return {
    //         ...col,
    //         render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
    //             <span>{_ === -1 ? undefined : _}</span>
    //         )
    //     }
    // })

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: ILofting[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('修改零件材质缩写成功');
            setVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const handleEditModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editModalRef.current?.onSubmit();
            message.success('修改材质成功');
            setEditVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const handleAddModalOk = () => new Promise(async (resove, reject) => {
        try {
            await addModalRef.current?.onSubmit();
            message.success('保存成功！');
            setAddVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const uploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.response && !info.file.response?.success) {
            message.warning(info.file.response?.msg)
        }
        if (info.file.response && info.file.response?.success) {
            if (Object.keys(info.file.response?.data).length > 0) {
                setUrl(info.file.response?.data);
                setUrlVisible(true);
            } else {
                message.success('导入成功！');
                setRefresh(!refresh);
            }
        }
    }

    // const closeOrEdit = () => {
    //     if (editorLock === '编辑') {
    //         setColumns(columns);
    //         setEditorLock('锁定');
    //     } else {
    //         const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
    //         let values = form.getFieldsValue(true).data;
    //         if (values) {
    //             let changeValues = values.filter((item: any, index: number) => {
    //                 return newRowChangeList.indexOf(index) !== -1;
    //             })
    //             if (changeValues && changeValues.length > 0) {
    //                 RequestUtil.post(`/tower-science/productStructure/save`, changeValues.map((res: any) => {
    //                     return {
    //                         ...res, productCategoryId: params.id
    //                     }
    //                 })).then(res => {
    //                     setColumns(columnsSetting);
    //                     setEditorLock('编辑');
    //                     setRowChangeList([]);
    //                     form.resetFields();
    //                     setRefresh(!refresh);
    //                 });
    //             } else {
    //                 setColumns(columnsSetting);
    //                 setEditorLock('编辑');
    //                 setRowChangeList([]);
    //                 form.resetFields();
    //             }
    //         } else {
    //             setColumns(columnsSetting);
    //             setEditorLock('编辑');
    //             setRowChangeList([]);
    //             form.resetFields();
    //         }
    //     }
    // }

    const del = () => {
        if (selectedKeys.length > 0) {
            RequestUtil.post(`/tower-science/productStructure`, {
                productStructureIdList: selectedKeys
            }).then(res => {
                message.success('删除成功');
                history.go(0);
            })
        } else {
            message.warning('请选择要删除的数据')
        }
    }

    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    // const [editorLock, setEditorLock] = useState('编辑');
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    // const [tableColumns, setColumns] = useState(columnsSetting);
    const [form] = Form.useForm();
    const [refresh, setRefresh] = useState(false);
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [filterValue, setFilterValue] = useState({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<ILofting[]>([]);
    const editRef = useRef<modalProps>();
    const editModalRef = useRef<modalProps>();
    const addModalRef = useRef<modalProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [missVisible, setMissVisible] = useState<boolean>(false);
    const [addVisible, setAddVisible] = useState<boolean>(false);
    const [type, setType] = useState<'new' | 'edit'>('new');
    const [rowData, setRowData] = useState<any>([]);
    const [copyVisible, setCopyVisible] = useState<boolean>(false);
    const userId = AuthUtil.getUserInfo().user_id;

    const { data: segmentNames } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/productSegment/list/${params.id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: isShow } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productCategory/assign/user/list/${params.id}`);
            result.indexOf(userId) === -1 ? resole(false) : resole(true)
        } catch (error) {
            reject(error)
        }
    }), {})

    const handleCopyModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('段明细复制成功！');
            setCopyVisible(false);
            history.go(0);
            resove(true);
            editRef.current?.resetFields();
        } catch (error) {
            reject(false)
        }
    })

    return <DetailContent>
        <Modal
            destroyOnClose
            visible={copyVisible}
            title="段明细复制"
            onOk={handleCopyModalOk}
            className={styles.tryAssemble}
            onCancel={() => {
                setCopyVisible(false);
                editRef.current?.resetFields();
            }}>
            <PeriodCopy id={params.id} segmentId={params.productSegmentId === 'all' ? '' : params.productSegmentId} ref={editRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='StructureTextureAbbreviations'
            visible={visible}
            width="30%"
            title="修改零件材质缩写"
            onOk={handleModalOk}
            onCancel={() => {
                setVisible(false);
            }}>
            <StructureTextureAbbreviations id={params.id} ref={editRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='StructureTextureEdit'
            visible={editVisible}
            width="30%"
            title="修改材质"
            onOk={handleEditModalOk}
            onCancel={() => {
                setEditVisible(false);
            }}>
            <StructureTextureEdit id={params.id} ref={editModalRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='MissCheck'
            visible={missVisible}
            width="30%"
            title="漏件检查"
            footer={<Button onClick={() => setMissVisible(false)} >关闭</Button>}
            onCancel={() => {
                setMissVisible(false);
            }}>
            <MissCheck id={params.id} />
        </Modal>
        <Modal
            destroyOnClose
            visible={addVisible}
            width="80%"
            title={type === 'new' ? "添加" : "编辑"}
            onOk={handleAddModalOk}
            key='add'
            onCancel={() => {
                setAddVisible(false);
            }}>
            <AddLofting id={params.id} type={type} rowData={rowData || []} productSegmentId={params.productSegmentId} ref={addModalRef} />
        </Modal>
        {/* <Form layout="inline" style={{ margin: '20px' }} onFinish={(value: Record<string, any>) => {
            setFilterValue(value)
            setRefresh(!refresh);
        }}>
            <Form.Item label='材料名称' name='materialName'>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label='材质' name='structureTexture'>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label='段名' name='segmentName'>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label='查询' name='code'>
                <Input placeholder="请输入构件编号查询" maxLength={50} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset">重置</Button>
            </Form.Item>
        </Form> */}
        {/* <Form form={form} className={styles.descripForm}> */}
        <Page
            path="/tower-science/productStructure/list"
            exportPath={`/tower-science/productStructure/list`}
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            tableProps={{
                pagination: false,
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            requestData={{ segmentId: params.productSegmentId === 'all' ? '' : params.productSegmentId, ...filterValue, productCategoryId: params.id }}
            extraOperation={<Space direction="horizontal" size="small">
                <Button type="primary" key='1' onClick={() => downloadTemplate('/tower-science/productStructure/exportTemplate', '模板')} ghost>模板下载</Button>
                <Popconfirm
                    title="确认删除?"
                    onConfirm={del}
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="primary" ghost disabled={!isShow}>删除</Button>
                </Popconfirm>
                <Button type="primary" ghost
                    onClick={() => {
                        setCopyVisible(true)
                    }}
                >段明细复制</Button>
                <Upload
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-science/productStructure/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    data={{ productCategoryId: params.id }}
                    showUploadList={false}
                    onChange={(info) => uploadChange(info)}
                >
                    <Button type="primary" ghost disabled={!isShow}>导入</Button>
                </Upload>
                <Button type="primary" key='2' onClick={async () => { setMissVisible(true) }} disabled={!isShow} ghost>漏件检查</Button>
                <Dropdown overlay={menu} trigger={['click']} disabled={!isShow}>
                    <Button type="primary" ghost>
                        批量修改<DownOutlined />
                    </Button>
                </Dropdown>
                <Button type="primary" onClick={() => { setAddVisible(true); setType('new'); }} disabled={!isShow} ghost>添加构件</Button>
                {/* <Popconfirm
                        title="确认完成放样?"
                        onConfirm={() => {
                            setLoading1(true);
                            RequestUtil.post(`/tower-science/productSegment/complete?productSegmentGroupId=${params.productSegmentId}`).then(res => {
                                history.goBack();
                            }).catch(error => {
                                setLoading1(false);
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={editorLock === '锁定'}
                    >
                        <Button type="primary" loading={loading1} disabled={editorLock === '锁定'} ghost>完成放样</Button>
                    </Popconfirm> */}
                <Link to={`/workMngt/setOutList/towerInformation/${params.id}/lofting/${params.productSegmentId}/loftingTowerApplication`}><Button type="primary" disabled={!isShow} ghost>放样塔型套用</Button></Link>
                {/* <Button type="primary" onClick={closeOrEdit} ghost>{editorLock}</Button> */}
                {/* <Button type="primary" loading={loading2} onClick={() => {
                        setLoading2(true);
                        RequestUtil.post(`/tower-science/productStructure/pdmSynchronous/${params.productSegmentId}`).then(res => {
                            setLoading2(false);
                            message.success('PDM同步成功');
                            history.go(0);
                        }).catch(error => {
                            setLoading2(false);
                        })
                    }} disabled={editorLock === '锁定'} ghost>PDM同步</Button> */}

                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
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
                        children: <Form.Item name="segmentId" initialValue={params.productSegmentId === 'all' ? '' : params.productSegmentId}>
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
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
        {/* </Form> */}
        <Modal
            visible={urlVisible}
            onOk={() => {
                window.open(url);
                setUrlVisible(false);
            }}
            onCancel={() => { setUrlVisible(false); setUrl('') }}
            title='提示'
            okText='下载'
        >
            当前存在错误数据，请重新下载上传！
        </Modal>
    </DetailContent>
}