/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-提料列表-塔型信息-提料-添加构件
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, InputNumber, Input, Button, Select, Checkbox, Divider } from 'antd';
import { DetailContent } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Pick.module.less';
import CommonTable from "../../../common/CommonTable";
import { FixedType } from 'rc-table/lib/interface';
import TextArea from "antd/lib/input/TextArea";
import { materialShortcutKeys, quickConversion, structureTextureShortcutKeys } from "@utils/quickConversion";

interface modalProps {
    id: string;
    type: 'new' | 'edit';
    rowData?: any[];
}

export default forwardRef(function AddPick({ id, type, rowData }: modalProps, ref) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<any>([])
    const [isBig, setIsBig] = useState<boolean>(true);
    const [isAuto, setIsAuto] = useState<boolean>(false);
    const [isQuick, setIsQuick] = useState<boolean>(true);

    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
        try {
            setTableData([...rowData || []])
            form.setFieldsValue({ data: [...rowData || []] })
            resole([])
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [id, type, rowData] })


    const column = [
        {
            title: '段号',
            dataIndex: 'segmentName',
            key: 'segmentName',
            width: 120,
            render: (_a: any, _b: any, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "segmentName"]} initialValue={_a} rules={[{ required: true, message: '请填写段号' }, {
                    pattern: /^[0-9a-zA-Z-]*$/,
                    message: '仅可输入数字/字母/-',
                }]}>
                    {/* <Select>
                    { paragraphList.map((item: any) => {
                        return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                    }) }
                </Select> */}
                    <Input size="small" maxLength={10} onBlur={() => {
                        if (isBig) {
                            const value = form.getFieldsValue(true)?.data.map((item: any) => {
                                return {
                                    ...item,
                                    segmentName: item?.segmentName?.toUpperCase()
                                }
                            })
                            setTableData([...value])
                            form.setFieldsValue({ data: value })
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            title: '构件编号',
            dataIndex: 'code',
            width: 120,
            key: 'code',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "code"]} initialValue={_} rules={[{ required: true, message: '请填写构件编号' }, {
                    pattern: /^[0-9a-zA-Z-]*$/,
                    message: '仅可输入数字/字母/-',
                }]}>
                    <Input size="small" maxLength={50} onBlur={() => {
                        if (isBig) {
                            const value = form.getFieldsValue(true).data.map((item: any) => {
                                console.log(item?.code?.toUpperCase())
                                return {
                                    ...item,
                                    code: item?.code?.toUpperCase()
                                }
                            })
                            setTableData([...value])
                            form.setFieldsValue({ data: value })
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            title: '材料名称',
            dataIndex: 'materialName',
            width: 120,
            key: 'materialName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "materialName"]} initialValue={_} rules={[{ required: true, message: '请输入材料名称' }, {
                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,
                    message: '仅可输入汉字/数字/字母',
                }]}>
                    <Input size="small" maxLength={10} onBlur={async (e) => {
                        const values = form.getFieldsValue(true)?.data || [];
                        if (isQuick) {
                            const newValue = await quickConversion(e.target.value, materialShortcutKeys);
                            values[index] = {
                                ...values[index],
                                materialName: newValue
                            }
                            setTableData([...values])
                            form.setFieldsValue({ data: values })
                        }
                    }}/>
                </Form.Item>
            )
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureTexture"]} initialValue={_} rules={[{ required: true, message: '请输入材质' }, {
                    pattern: /^[0-9a-zA-Z-]*$/,
                    message: '仅可输入数字/字母/-',
                }]}>
                    <Input size="small" maxLength={10} onBlur={async (e) => {
                        const values = form.getFieldsValue(true)?.data || [];
                        if (isBig) {
                            const value = values.map((item: any) => {
                                return {
                                    ...item,
                                    structureTexture: item?.structureTexture?.toUpperCase()
                                }
                            })
                            setTableData([...value])
                            form.setFieldsValue({ data: value })
                        }
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
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureSpec"]} initialValue={_} rules={[{ required: true, message: '请输入规格' }, {

                    pattern: /^[0-9-∠L*φ\/]*$/,
                    message: '仅可输入数字/-/*/L/∠/φ',

                }]}>
                    <Input size="small" maxLength={10} />
                </Form.Item>
            )
        },
        {
            title: '长度（mm）',
            dataIndex: 'length',
            key: 'length',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "length"]} rules={[{ required: true, message: '请输入长度' }]}>
                    <InputNumber size="small" min={1} precision={0} max={999999} />
                </Form.Item>
            )
        },
        {
            title: '宽度（mm）',
            dataIndex: 'width',
            key: 'width',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "width"]}>
                    <InputNumber size="small" min={1} precision={0} max={999999} />
                </Form.Item>
            )
        },
        {
            title: '厚度（mm）',
            dataIndex: 'thickness',
            key: 'thickness',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "thickness"]}>
                    <InputNumber size="small" min={1} precision={0} max={999999} />
                </Form.Item>
            )
        },
        {
            title: '大头',
            dataIndex: 'bigHead',
            key: 'bigHead',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "bigHead"]}>
                    <InputNumber size="small" min={1} precision={0} max={999999} />
                </Form.Item>
            )
        },
        {
            title: '小头',
            dataIndex: 'smallHead',
            key: 'smallHead',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "smallHead"]}>
                    <InputNumber size="small" min={1} precision={0} max={999999} />
                </Form.Item>
            )
        },
        {
            title: '单段件数',
            dataIndex: 'basicsPartNum',
            key: 'basicsPartNum',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "basicsPartNum"]} initialValue={_} rules={[{ required: true, message: '请输入单段件数' }]}>
                    <InputNumber size="small" min={1} precision={0} max={9999} onChange={(e: any) => {
                        const data = form.getFieldsValue(true).data;
                        if (data[index].basicsWeight) {
                            data[index] = {
                                ...data[index],
                                totalWeight: e * data[index].basicsWeight
                            }
                            form?.setFieldsValue({ data: data })
                            setTableData(data)
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            title: '单件重量（kg）',
            dataIndex: 'basicsWeight',
            key: 'basicsWeight',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "basicsWeight"]} initialValue={_} rules={[{ required: !isAuto, message: '请输入单件重量' }]}>
                    <InputNumber size="small" min={0} precision={2} max={9999.99} onChange={(e: any) => {
                        const data = form.getFieldsValue(true).data;
                        if (data[index].basicsPartNum) {
                            data[index] = {
                                ...data[index],
                                totalWeight: e * data[index].basicsPartNum
                            }
                            form?.setFieldsValue({ data: data })
                            setTableData(data)
                        }
                    }} disabled={isAuto} />
                </Form.Item>
            )
        },
        {
            title: '小计重量（kg）',
            dataIndex: 'totalWeight',
            key: 'totalWeight',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "totalWeight"]}>
                    <InputNumber size="small" min={0} precision={2} max={9999.99} disabled />
                </Form.Item>
            )
        },
        {
            title: '备注',
            dataIndex: 'description',
            width: 200,
            key: 'description',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "description"]} initialValue={_}>
                    <TextArea showCount rows={1} maxLength={50} />
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_a: any, _b: any, index: number): React.ReactNode => (
                <Button type='link' disabled={type === 'edit'} onClick={() => delRow(index)}>删除</Button>
            )
        }
    ]

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            RequestUtil.post(`/tower-science/drawProductStructure/submit`, postData).then(res => {
                resole(true)
            }).catch(e => {
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise((resolve, reject) => {
        try {
            form.validateFields().then(async () => {
                const values = form.getFieldsValue(true).data.map((item: any) => {
                    return {
                        ...item,
                        productCategory: id,
                    }
                })
                const submitData = {
                    productCategoryId: id,
                    drawProductStructureSaveDTOS: [...values]
                }
                await saveRun(submitData);
                resolve(true)
            })
        } catch (error) {
            reject(false)
        }
    })

    const addRow = () => {
        const values = form.getFieldsValue(true).data || [];
        values.push({})
        setTableData([...values])
        form.setFieldsValue({ data: [...values] })
    }

    const delRow = (index: number) => {
        const values = form.getFieldsValue(true).data || [];
        values.splice(index, 1);
        form.setFieldsValue({ data: [...values] });
        setTableData([...values])
    }

    const resetFields = () => {
        form.resetFields();
        setIsAuto(false)
        setIsBig(true)
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <DetailContent key='AddPick'>
        {type === 'new' ? <Button type="primary" onClick={addRow} style={{ marginRight: '16px' }} ghost>添加一行</Button> : null}
        <Checkbox onChange={(e) => {
            setIsBig(e.target.checked)
            if (e.target.checked) {
                const value = form.getFieldsValue(true).data.map((item: any) => {
                    return {
                        ...item,
                        structureTexture: item?.structureTexture?.toUpperCase(),
                        segmentName: item?.segmentName?.toUpperCase(),
                        code: item?.code?.toUpperCase(),
                    }
                })
                setTableData([...value])
                form.setFieldsValue({ data: value })
            }
        }} checked={isBig}>件号字母自动转换成大写</Checkbox>
        <Checkbox onChange={(e) => {
            setIsAuto(e.target.checked)
            const value = form.getFieldsValue(true).data.map((item: any) => {
                return {
                    ...item,
                    basicsWeight: '',
                    totalWeight: ''
                }
            })
            setTableData([...value])
            form.setFieldsValue({ data: value })
        }} checked={isAuto}>保存时自动计算重量</Checkbox>
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
                scroll={{ x: 1200 }}
                columns={column}
                pagination={false}
                dataSource={[...tableData]}
            />
        </Form>
    </DetailContent>
})

