/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-放样-添加构件
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, InputNumber, Input, Button, Select, Divider, Checkbox } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import CommonTable from "../../common/CommonTable";
import { FixedType } from 'rc-table/lib/interface';
import { componentTypeOptions } from "../../../configuration/DictionaryOptions";
import { materialShortcutKeys, quickConversion, structureTextureShortcutKeys } from "@utils/quickConversion";

interface modalProps {
    id: string;
    productSegmentId: string;
    type: 'new' | 'edit';
    rowData?: any[];
}

export default forwardRef(function AddLofting({ id, productSegmentId, type, rowData }: modalProps, ref) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<any>([])
    const [isQuick, setIsQuick] = useState<boolean>(true);
    const [algorithm, setAlgorithm] = useState<number>(); //算法
    const [proportion, setProportion] = useState<number>(); // 比重

    /**
     * weightAlgorithm 
     * 3 比重（法兰类）
     * 2 比重*面积（钢板类）
     * 1 比重*长度（角钢类）
    */
    const weightCalculation = async (e: string, dataIndex: string, index: number) => {
        const data = await RequestUtil.get<any>(`/tower-system/material?current=1&size=10000&fuzzyQuery=${e}`);
        let values = form.getFieldsValue(true)?.data;
        if (dataIndex === 'materialName') {
            // structureSpec
            const list = data?.records?.filter((res: any) => res?.materialName === e);
            const newData = list?.filter((res: any) => res?.structureSpec === values[index]?.structureSpec)[0];
            setAlgorithm(newData?.weightAlgorithm)
            setProportion(Number(newData?.proportion))
            const weight = newData?.weightAlgorithm === 3 ?
                Number(newData?.proportion) :
                newData?.weightAlgorithm === 2 ?
                    Number(newData?.proportion) * Number(values[index]?.width || 0) / 1000 * Number(values[index]?.length || 0) / 1000 :
                    Number(newData?.proportion) * Number(values[index]?.length || 0) / 1000
            values[index] = {
                ...values[index],
                basicsWeight: weight.toFixed(4)
            }
            form.setFieldsValue({
                data: [...values]
            })
            setTableData([...values])
            calculateTotalWeight(weight, index)
        } else {
            // materialName
            const list = data?.records?.filter((res: any) => res?.structureSpec === e);
            const newData = list?.filter((res: any) => res?.materialName === values[index]?.materialName)[0];
            setAlgorithm(newData?.weightAlgorithm)
            setProportion(Number(newData?.proportion))
            const weight = newData?.weightAlgorithm === 3 ?
                Number(newData?.proportion) :
                newData?.weightAlgorithm === 2 ?
                    Number(newData?.proportion) * Number(values[index]?.width || 0) / 1000 * Number(values[index]?.length || 0) / 1000 :
                    Number(newData?.proportion) * Number(values[index]?.length || 0) / 1000
            values[index] = {
                ...values[index],
                basicsWeight: weight.toFixed(4)
            }
            form.setFieldsValue({
                data: [...values]
            })
            setTableData([...values])
            calculateTotalWeight(weight, index)
        }
    }

    const getProportion = async (materialName: string, structureSpec: string) => {
        const data = await RequestUtil.get<any>(`/tower-system/material?current=1&size=10000&fuzzyQuery=${materialName}`);
        const list = data?.records?.filter((res: any) => res?.materialName === materialName);
        const newData = list?.filter((res: any) => res?.structureSpec === structureSpec)[0];
        setAlgorithm(newData?.weightAlgorithm)
        setProportion(Number(newData?.proportion))
        return {
            algorithm: newData?.weightAlgorithm,
            proportion: Number(newData?.proportion)
        }
    }

    const calculateTotalWeight = (e: number, index: number) => {
        const data = form.getFieldsValue(true).data;
        data[index] = {
            ...data[index],
            totalWeight: (Number(e || 0) * Number(data[index].basicsPartNum || 0)).toFixed(4)
        }
        setTableData([...data])
        form.setFieldsValue({ data: [...data] })
    }

    const colunm = [
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "segmentName"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入段名'
                }, {
                    pattern: /^[0-9a-zA-Z-.\u4e00-\u9fa5]*$/,
                    message: '仅可输入数字/字母/-/汉字/.',
                }]}>
                    <Input size="small" maxLength={10} />
                </Form.Item>
            )
        },
        {
            key: 'code',
            title: '构件编号',
            width: 150,
            editable: true,
            dataIndex: 'code',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "code"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入构件编号'
                }, {
                    pattern: /^[0-9a-zA-Z-]*$/,
                    message: '仅可输入数字/字母/-',
                }]}>
                    <Input size="small" maxLength={50} />
                </Form.Item>
            )
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            editable: true,
            dataIndex: 'structureTexture',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureTexture"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入材质'
                }]}>
                    <Input size="small" maxLength={20} onBlur={async (e) => {
                        const values = form.getFieldsValue(true)?.data || [];
                        if (isQuick) {
                            const newValue = await quickConversion(e.target.value, structureTextureShortcutKeys);
                            values[index] = {
                                ...values[index],
                                structureTexture: newValue
                            }
                            setTableData([...values])
                            form.setFieldsValue({ data: values })
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 150,
            editable: true,
            dataIndex: 'materialName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "materialName"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入材料名称'
                }, {
                    pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]*$/,
                    message: '仅可输入数字/字母/汉字',
                }]}>
                    <Input size="small" maxLength={20} onBlur={async (e) => {
                        const values = form.getFieldsValue(true)?.data || [];
                        if (isQuick) {
                            const newValue = await quickConversion(e.target.value, materialShortcutKeys);
                            values[index] = {
                                ...values[index],
                                materialName: newValue
                            }
                            setTableData([...values])
                            form.setFieldsValue({ data: values })
                            weightCalculation(newValue, 'materialName', index)
                        }
                        weightCalculation(e.target.value, 'materialName', index)
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 150,
            editable: true,
            dataIndex: 'structureSpec',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureSpec"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入规格'
                }]}>
                    <Input size="small" maxLength={20} onBlur={(e) => weightCalculation(e.target.value, 'structureSpec', index)} />
                </Form.Item>
            )
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 150,
            editable: true,
            dataIndex: 'length',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "length"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入长度'
                }]}>
                    <InputNumber size="small" max={999999} onBlur={async (e) => {
                        const values = form.getFieldsValue(true)?.data;
                        if (!proportion && values[index]?.materialName && values[index]?.structureSpec) {
                            const getData: any = await getProportion(values[index]?.materialName, values[index]?.structureSpec)
                            const weight = getData?.algorithm === 3 ?
                                getData?.proportion || 0 :
                                getData?.algorithm === 2 ?
                                    Number(getData?.proportion) * Number(values[index]?.width || 0) / 1000 * Number(e.target?.value || 0) / 1000 :
                                    Number(getData?.proportion) * Number(e.target?.value || 0) / 1000
                            values[index] = {
                                ...values[index],
                                basicsWeight: weight.toFixed(4)
                            }
                            form.setFieldsValue({
                                data: [...values]
                            })
                            setTableData([...values])
                            calculateTotalWeight(weight, index)
                        } else {
                            const weight = algorithm === 3 ?
                                proportion || 0 :
                                algorithm === 2 ?
                                    Number(proportion) * Number(values[index]?.width || 0) / 1000 * Number(e.target?.value || 0) / 1000 :
                                    Number(proportion) * Number(e.target?.value || 0) / 1000
                            values[index] = {
                                ...values[index],
                                basicsWeight: weight.toFixed(4)
                            }
                            form.setFieldsValue({
                                data: [...values]
                            })
                            setTableData([...values])
                            calculateTotalWeight(weight, index)
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 150,
            editable: true,
            dataIndex: 'width',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "width"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入宽度'
                }]}>
                    <InputNumber size="small" max={999999} onBlur={async (e) => {
                        const values = form.getFieldsValue(true)?.data;
                        if (!proportion && values[index]?.materialName && values[index]?.structureSpec) {
                            const getData: any = await getProportion(values[index]?.materialName, values[index]?.structureSpec)
                            if (getData?.algorithm == 2) {
                                const weight = Number(getData?.proportion) * Number(values[index]?.length || 0) / 1000 * Number(e.target?.value || 0) / 1000
                                values[index] = {
                                    ...values[index],
                                    basicsWeight: weight.toFixed(4)
                                }
                                form.setFieldsValue({
                                    data: [...values]
                                })
                                setTableData([...values])
                                calculateTotalWeight(weight, index)
                            }
                        } else {
                            if (algorithm == 2) {
                                const weight = Number(proportion) * Number(values[index]?.length || 0) / 1000 * Number(e.target?.value || 0) / 1000
                                values[index] = {
                                    ...values[index],
                                    basicsWeight: weight.toFixed(4)
                                }
                                form.setFieldsValue({
                                    data: [...values]
                                })
                                setTableData([...values])
                                calculateTotalWeight(weight, index)
                            }
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'thickness',
            title: '厚度（mm）',
            width: 150,
            editable: true,
            dataIndex: 'thickness',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "thickness"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入厚度'
                }]}>
                    <InputNumber size="small" max={999999} />
                </Form.Item>
            )
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 150,
            editable: true,
            dataIndex: 'basicsPartNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "basicsPartNum"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入单段件数'
                }]}>
                    <InputNumber min={0} max={9999} size="small" onChange={(e) => {
                        const data = form.getFieldsValue(true).data;
                        data[index] = {
                            ...data[index],
                            totalWeight: Number(e) * Number(data[index].basicsWeight || 0)
                        }
                        setTableData([...data])
                        form.setFieldsValue({ data: [...data] })
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'apertureNumber',
            title: '各孔径孔数',
            width: 150,
            editable: true,
            dataIndex: 'apertureNumber',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "apertureNumber"]} initialValue={_} rules={[{
                    pattern: /^[0-9*,.]*$/,
                    message: '仅可输入数字/,/*/.',
                }]}>
                    <Input size="small" maxLength={50} onBlur={(e) => {
                        let list = e.target.value.split(',');
                        let num: number = 0;
                        list.forEach(res => {
                            const newNums = res?.split('*')
                            num += newNums[0] ? Number(newNums[newNums?.length - 1] || 1) : 0
                        })
                        const data = form.getFieldsValue(true).data;
                        data[index] = {
                            ...data[index],
                            holesNum: num
                        }
                        setTableData([...data])
                        form.setFieldsValue({ data: [...data] })
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'holesNum',
            title: '单件孔数',
            width: 150,
            editable: true,
            dataIndex: 'holesNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "holesNum"]} initialValue={_}>
                    <Input size="small" maxLength={10} disabled />
                </Form.Item>
            )
        },
        {
            key: 'electricWelding',
            title: '电焊',
            width: 150,
            editable: true,
            dataIndex: 'electricWelding',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "electricWelding"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'groove',
            title: '坡口',
            width: 150,
            editable: true,
            dataIndex: 'groove',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "groove"]} initialValue={_}>
                    <InputNumber min={0} max={999999} size="small" />
                </Form.Item>
            )
        },
        {
            key: 'chamfer',
            title: '切角',
            width: 150,
            editable: true,
            dataIndex: 'chamfer',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "chamfer"]} initialValue={_}>
                    <InputNumber size="small" min={0} max={99} />
                </Form.Item>
            )
        },
        {
            key: 'openCloseAngle',
            title: '开合角',
            width: 150,
            editable: true,
            dataIndex: 'openCloseAngle',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "openCloseAngle"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={2} />
                </Form.Item>
            )
        },
        {
            key: 'bend',
            title: '火曲',
            width: 150,
            editable: true,
            dataIndex: 'bend',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "bend"]} initialValue={_}>
                    <InputNumber size="small" min={0} max={999999} />
                </Form.Item>
            )
        },
        {
            key: 'shovelBack',
            title: '铲背',
            width: 150,
            editable: true,
            dataIndex: 'shovelBack',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "shovelBack"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'rootClear',
            title: '清根',
            width: 150,
            editable: true,
            dataIndex: 'rootClear',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "rootClear"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'squash',
            title: '打扁',
            width: 150,
            editable: true,
            dataIndex: 'squash',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "squash"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'specialCode',
            title: '特殊件号',
            width: 150,
            editable: true,
            dataIndex: 'specialCode',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "specialCode"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'suppress',
            title: '压制',
            width: 150,
            editable: true,
            dataIndex: 'suppress',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "suppress"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'grooveMeters',
            title: '坡口米数（米）',
            width: 150,
            editable: true,
            dataIndex: 'grooveMeters',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "grooveMeters"]} initialValue={_}>
                    <InputNumber size="small" min={0} />
                </Form.Item>
            )
        },
        {
            key: 'spellNumber',
            title: '拼数',
            width: 150,
            editable: true,
            dataIndex: 'spellNumber',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "spellNumber"]} initialValue={_}>
                    <InputNumber size="small" min={0} />
                </Form.Item>
            )
        },
        {
            key: 'slottedForm',
            title: '开槽形式',
            width: 150,
            editable: true,
            dataIndex: 'slottedForm',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "slottedForm"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'intersectingLine',
            title: '割相贯线',
            width: 150,
            editable: true,
            dataIndex: 'intersectingLine',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "intersectingLine"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'type',
            title: '零件类型',
            width: 150,
            editable: true,
            dataIndex: 'type',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "type"]} initialValue={_}>
                    <Select placeholder="请选择" size="small">
                        {componentTypeOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            editable: true,
            dataIndex: 'description',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "description"]} initialValue={_}>
                    <Input.TextArea size="small" maxLength={200} />
                </Form.Item>
            )
        },
        {
            key: 'arcContaining',
            title: '含弧',
            width: 150,
            editable: true,
            dataIndex: 'arcContaining',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "arcContaining"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'perforate',
            title: '钻孔',
            width: 150,
            editable: true,
            dataIndex: 'perforate',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "perforate"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'perforateNumber',
            title: '钻孔孔径孔数',
            width: 150,
            editable: true,
            dataIndex: 'perforateNumber',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "perforateNumber"]} initialValue={_}>
                    <Input size="small" min={0} />
                </Form.Item>
            )
        },
        {
            key: 'withReaming',
            title: '扩孔',
            width: 150,
            editable: true,
            dataIndex: 'withReaming',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "withReaming"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'reamingNumber',
            title: '扩孔孔径孔数',
            width: 150,
            editable: true,
            dataIndex: 'reamingNumber',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "reamingNumber"]} initialValue={_} rules={[{
                    pattern: /^[0-9*,]*$/,
                    message: '仅可输入数字/,/*',
                }]}>
                    <Input size="small" />
                </Form.Item>
            )
        },
        {
            key: 'gasCutting',
            title: '气割孔（0/1）',
            width: 150,
            editable: true,
            dataIndex: 'gasCutting',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "gasCutting"]} initialValue={_}>
                    <InputNumber size="small" min={1} max={1} />
                </Form.Item>
            )
        },
        {
            key: 'gasCuttingNumber',
            title: '气割孔孔径孔数',
            width: 150,
            editable: true,
            dataIndex: 'gasCuttingNumber',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "gasCuttingNumber"]} initialValue={_} rules={[{
                    pattern: /^[0-9*,]*$/,
                    message: '仅可输入数字/,/*',
                }]}>
                    <Input size="small" />
                </Form.Item>
            )
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 150,
            editable: true,
            dataIndex: 'basicsWeight',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "basicsWeight"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入单件重量'
                }]}>
                    <Input type="number" min={0} size="small" onChange={(e) => calculateTotalWeight(Number(e.target.value), index)} />
                </Form.Item>
            )
        },
        {
            key: 'totalWeight',
            title: '总重（kg）',
            width: 150,
            editable: true,
            dataIndex: 'totalWeight',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "totalWeight"]} initialValue={_}>
                    <Input size="small" maxLength={10} disabled />
                </Form.Item>
            )
        },
        {
            key: 'craftName',
            title: '工艺列（核对）',
            width: 150,
            editable: true,
            dataIndex: 'craftName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "craftName"]} initialValue={_}>
                    <Input size="small" maxLength={50} placeholder='自动获取' disabled />
                </Form.Item>
            )
        },
        {
            key: 'sides',
            title: '边数',
            width: 150,
            editable: true,
            dataIndex: 'sides',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "sides"]} initialValue={_}>
                    <InputNumber size="small" min={0} max={9999.99} />
                </Form.Item>
            )
        },
        {
            key: 'perimeter',
            title: '周长',
            width: 150,
            editable: true,
            dataIndex: 'perimeter',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "perimeter"]} initialValue={_}>
                    <InputNumber size="small" min={0} max={999999.99} />
                </Form.Item>
            )
        },
        {
            key: 'surfaceArea',
            title: '表面积（m2）',
            width: 150,
            editable: true,
            dataIndex: 'surfaceArea',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "surfaceArea"]} initialValue={_}>
                    <InputNumber size="small" min={0} max={9999.99} />
                </Form.Item>
            )
        },
        {
            key: 'weldingEdge',
            title: '焊接边（mm）',
            width: 150,
            editable: true,
            dataIndex: 'weldingEdge',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "weldingEdge"]} initialValue={_}>
                    <InputNumber size="small" maxLength={50} />
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button onClick={() => delRow(index)} disabled={type === 'edit'} type="link">删除</Button>
            )
        }
    ]

    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
        try {
            const newData = rowData?.map(res => {
                let list = res?.apertureNumber?.split(',');
                let num: number = 0;
                list?.forEach((item: any) => {
                    num += item.split('*')[0] ? Number(item.split('*')[1] || 1) : 0
                })
                return {
                    ...res,
                    holesNum: num
                }
            })
            setTableData([...newData || []])
            form.setFieldsValue({ data: [...newData || []] })
            resole([])
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [id, productSegmentId, type, rowData] })


    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/productStructure/save`, [...postData]);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise((resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                const values = form.getFieldsValue(true).data || [];
                await saveRun(values?.map((res: any) => {
                    return {
                        ...res,
                        productCategoryId: id,
                        segmentId: productSegmentId === 'all' ? '' : productSegmentId,
                        type: res?.type?.split(',')[1],
                        typeDictId: res?.type?.split(',')[0]
                    }
                }))
                resolve(true);
            })

        } catch (error) {
            reject(false)
        }
    })

    const addRow = () => {
        const values = form.getFieldsValue(true).data || [];
        values.push({})
        form.setFieldsValue({ data: [...values] });
        setTableData([...values])
    }

    const delRow = (index: number) => {
        const values = form.getFieldsValue(true).data || [];
        values.splice(index, 1);
        form.setFieldsValue({ data: [...values] });
        setTableData([...values])
    }

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <DetailContent key='AddLofting'>
        {type === 'new' ? <Button type="primary" onClick={addRow} style={{ marginRight: '16px' }} ghost>添加一行</Button> : null}
        <Checkbox onChange={(e) => { setIsQuick(e.target.checked) }} checked={isQuick}>是否快捷输入</Checkbox>
        <Divider orientation="left" plain>材质快捷键：{
            structureTextureShortcutKeys?.map(res => {
                return <span className={styles.key}>{res?.label}({res?.value})</span>
            })
        }</Divider>
        <Divider orientation="left" plain>材料快捷键：{
            materialShortcutKeys?.map(res => {
                return <span className={styles.key}>{res?.label}({res?.value})</span>
            })
        }</Divider>
        <Form form={form} className={styles.descripForm}>
            <CommonTable
                haveIndex
                pagination={false}
                dataSource={tableData}
                rowKey="index"
                columns={colunm} />
        </Form>
    </DetailContent>
})

