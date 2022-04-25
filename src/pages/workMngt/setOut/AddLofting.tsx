/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-放样-添加构件
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, InputNumber, Input, Button, Select } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import CommonTable from "../../common/CommonTable";
import { FixedType } from 'rc-table/lib/interface';
import { componentTypeOptions } from "../../../configuration/DictionaryOptions";

interface modalProps {
    id: string;
    productSegmentId: string;
}

export default forwardRef(function AddLofting({ id, productSegmentId }: modalProps, ref) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<any>([])

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
                    pattern: /^[0-9a-zA-Z-\u4e00-\u9fa5]*$/,
                    message: '仅可输入数字/字母/-/汉字',
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
                    <Input size="small" maxLength={20} />
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
                    <Input size="small" maxLength={20} />
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
                    message: '请输入构件编号'
                }, {
                    pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]*$/,
                    message: '仅可输入数字/字母/汉字',
                }]}>
                    <Input size="small" maxLength={20} />
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
                    <Input size="small" maxLength={20} />
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
                    <InputNumber size="small" max={999999} />
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
                    <InputNumber size="small" max={999999} />
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
                    <InputNumber min={0} max={99} size="small" onChange={(e) => {
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
                    pattern: /^[0-9*,]*$/,
                    message: '仅可输入数字/,/*',
                }]}>
                    <Input size="small" maxLength={50} />
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
                    <InputNumber size="small" min={0} />
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
                    <InputNumber size="small" min={0} />
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
                    <InputNumber size="small" min={0} />
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
                    <InputNumber size="small" min={0} />
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
                    <InputNumber size="small" min={0} />
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
                    <InputNumber size="small" min={0} />
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
                        {componentTypeOptions?.map((item: any, index: number) => <Select.Option value={item.id +','+item.name} key={index}>{item.name}</Select.Option>)}
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
                    <Input.TextArea size="small" maxLength={50} />
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
                    <InputNumber size="small" min={0} />
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
                <Form.Item name={['data', index, "basicsWeight"]} initialValue={_}>
                    <Input type="number" min={0} size="small" onChange={(e) => {
                        const data = form.getFieldsValue(true).data;
                        data[index] = {
                            ...data[index],
                            totalWeight: Number(e.target.value) * Number(data[index].basicsPartNum || 0)
                        }
                        console.log(data)
                        setTableData([...data])
                        form.setFieldsValue({ data: [...data] })
                    }} />
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
                    <Input size="small" maxLength={50} placeholder='自动获取' disabled/>
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
                    <InputNumber size="small" min={0} max={9999.99} />
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
                <Button onClick={() => delRow(index)} type="link">删除</Button>
            )
        }
    ]

    // const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
    //     try {
    //         //  const result: [] = await RequestUtil.get(``);
    //         resole([])
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { refreshDeps: [id, productSegmentId] })


    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/productStructure/save`, [...postData]);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const values = form.getFieldsValue(true).data || [];
            await saveRun(values?.map((res: any) => {
                return {
                    ...res,
                    productCategoryId: id,
                    segmentGroupId: productSegmentId,
                    type: res?.type?.split(',')[1],
                    typeDictId: res?.type?.split(',')[0]
                }
            }))
            resolve(true);
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
        <Button type="primary" onClick={addRow} ghost>添加一行</Button>
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

