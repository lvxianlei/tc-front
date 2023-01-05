/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-杂项绩效管理-新增/编辑/详情
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, InputNumber, Select } from 'antd';
import { BaseInfo, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './GenerationOfMaterial.module.less';
import { newColumns, detailColumns } from './miscellaneousPerformance.json'
import SelectUser from "../../common/SelectUser";

interface modalProps {
    readonly id?: any;
    readonly type?: 'new' | 'detail' | 'edit';
}

export default forwardRef(function GenerationOfMaterialApply({ id, type }: modalProps, ref) {
    const [form] = Form.useForm();
    const [towerSelects, setTowerSelects] = useState([]);
    const [types, setTypes] = useState<any>([]);
    const [entrys, setEntrys] = useState<any>([]);

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/sundryConfig/getDetail?id=${id}`)
            planNumChange(result?.planNumber);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [id, type] })

    const { data: loftingLink } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get(`/tower-science/performance/enable`);
        resole(result)
    }), {})

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/listAll`);
        resole(nums)
    }), {})

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingTask/list/${e}`);
        setTowerSelects(data || [])
    }

    const { data: items } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/sundryConfig`);
        resole(data)
    }), {})

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            form?.validateFields().then(async res => {
                const value = await form.getFieldsValue(true);
                await saveRun({
                    ...value,
                    id: id
                })
                resolve(true);
            })

        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-science/sundryConfig/saveSundryMerits`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form?.validateFields().then(async res => {
                const value = await form.getFieldsValue(true);
                await submitRun({
                    ...value,
                    id: id
                })
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-science/sundryConfig/saveAndLaunchSundryMerits`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, onSave, resetFields }), [ref, onSubmit, onSave, resetFields]);

    return <DetailContent>
        {
            type === 'detail' ?
                <BaseInfo
                    dataSource={data || {}}
                    columns={detailColumns}
                    col={3}
                />
                :
                <BaseInfo
                    dataSource={data || {}}
                    form={form}
                    columns={newColumns.map((item: any) => {
                        switch (item.dataIndex) {
                            case "loftingLink":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'loftingLink'} rules={[{
                                            required: true,
                                            message: '请选择放样环节'
                                        }]}>
                                            <Select
                                                placeholder="请选择放样环节"
                                                style={{ width: "100%" }}>
                                                {loftingLink && loftingLink?.map((item: any, index: number) => {
                                                    return <Select.Option key={index} value={item?.id}>{item?.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }
                                })
                            case "category":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'category'} rules={[{
                                            required: true,
                                            message: '请选择杂项类别'
                                        }]}>
                                            <Select
                                                placeholder="请选择杂项类别"
                                                style={{ width: "100%" }}
                                                onChange={(e) => {
                                                    const data = items?.filter((res: any) => res?.name === e);
                                                    setTypes(data[0]?.sundryConfigVOList || [])
                                                    form.setFieldsValue({
                                                        type: '',
                                                        entry: ''
                                                    })
                                                }}>
                                                {items && items?.map((item: any, index: number) => {
                                                    return <Select.Option key={index} value={item?.name}>{item?.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }
                                })
                            case "type":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'type'} rules={[{
                                            required: true,
                                            message: '请选择杂项类型'
                                        }]}>
                                            <Select
                                                placeholder="请选择杂项类型"
                                                style={{ width: "100%" }}
                                                onChange={(e) => {
                                                    const data = types?.filter((res: any) => res?.name === e);
                                                    setEntrys(data[0]?.sundryConfigVOS || [])
                                                    form.setFieldsValue({
                                                        entry: ''
                                                    })
                                                }}
                                                onDropdownVisibleChange={(open) => {
                                                    if (open) {
                                                        const data = items?.filter((res: any) => res?.name === form?.getFieldsValue(true)?.category);
                                                        setTypes(data[0]?.sundryConfigVOList || [])
                                                    }
                                                }}
                                            >
                                                {types && types?.map((item: any, index: number) => {
                                                    return <Select.Option key={index} value={item?.name}>{item?.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }
                                })
                            case "entry":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'entry'} rules={[{
                                            required: true,
                                            message: '请选择杂项类型'
                                        }]}>
                                            <Select
                                                placeholder="请选择杂项类型"
                                                style={{ width: "100%" }}
                                                onDropdownVisibleChange={(open) => {
                                                    if (open) {
                                                        const typeList = items?.filter((res: any) => res?.name === form?.getFieldsValue(true)?.category);
                                                        const data = typeList[0]?.sundryConfigVOList?.filter((res: any) => res?.name === form?.getFieldsValue(true)?.type);
                                                        setEntrys(data[0]?.sundryConfigVOS || [])
                                                    }
                                                }}>
                                                {entrys && entrys?.map((item: any, index: number) => {
                                                    return <Select.Option key={index} value={item?.name}>{item?.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }
                                })
                            case "planNumber":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'planNumber'}>
                                            <Select
                                                showSearch
                                                placeholder="请选择计划号"
                                                style={{ width: "100%" }}
                                                filterOption={(input, option) =>
                                                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                                }
                                                onChange={(e) => {
                                                    planNumChange(e);
                                                    form.setFieldsValue({
                                                        productCategoryId: ''
                                                    });
                                                }}>
                                                {planNums && planNums?.map((item: any, index: number) => {
                                                    return <Select.Option key={index} value={item}>{item}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }
                                })
                            case "productCategoryId":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'productCategoryId'}>
                                            <Select
                                                placeholder="请选择塔型名称"
                                                style={{ width: "100%" }}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {towerSelects && towerSelects?.map((item: any) => {
                                                    return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }
                                })
                            case "workHour":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'workHour'} rules={[{
                                            required: true,
                                            message: '请输入工时'
                                        }]}>
                                            <InputNumber style={{ width: '100%' }} min={0} max={999999} onChange={(e) => {
                                                const price = form.getFieldsValue(true)?.price || 0;
                                                form.setFieldsValue({
                                                    totalAmount: Number(price) * Number(e)
                                                })
                                            }} />
                                        </Form.Item>
                                    }
                                })
                            case "price":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'price'} rules={[{
                                            required: true,
                                            message: '请输入单价'
                                        }]}>
                                            <InputNumber style={{ width: '100%' }} min={0} max={999999} onChange={(e) => {
                                                const workHour = form.getFieldsValue(true)?.workHour || 0;
                                                form.setFieldsValue({
                                                    totalAmount: Number(workHour) * Number(e)
                                                })
                                            }} />
                                        </Form.Item>
                                    }
                                })
                            case "totalAmount":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'totalAmount'}>
                                            <Input disabled />
                                        </Form.Item>
                                    }
                                })
                            case "userName":
                                return ({
                                    ...item,
                                    render: () => {
                                        return <Form.Item name={'userName'}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser
                                                    key={'userId'}
                                                    selectedKey={[form?.getFieldsValue(true)?.userId]}
                                                    onSelect={(selectedRows: Record<string, any>) => {
                                                        form.setFieldsValue({
                                                            userId: selectedRows[0]?.userId,
                                                            userName: selectedRows[0]?.name
                                                        })
                                                    }} />
                                            } />
                                        </Form.Item>
                                    }
                                })
                            default:
                                return item
                        }
                    })}
                    edit
                    col={3} />
        }
        {
            type === 'detail' ?
                <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
                : null
        }
    </DetailContent>
})