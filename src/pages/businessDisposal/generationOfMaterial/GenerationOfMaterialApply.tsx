/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-代料-申请
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, Select } from 'antd';
import { BaseInfo, DetailContent, DetailTitle, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { applyColumns } from "./generationOfMaterial.json";
import styles from './GenerationOfMaterial.module.less';
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions";

interface modalProps {
    readonly id?: any;
    readonly type?: 'new' | 'detail' | 'edit';
}

export default forwardRef(function GenerationOfMaterialApply({ id, type }: modalProps, ref) {
    const [form] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [towerSelects, setTowerSelects] = useState([]);
    const [description, setDescription] = useState<string>('');
    const [detailData, setDetailData] = useState<any>()

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/substitute/material/${id}`)
            form.setFieldsValue({
                productCategoryId: '5555'
            })
            setDetailData(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [id, type] })

    const { data: types } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-system/materialCategory`)
            const newResult = result?.filter((res: any) => res?.name === '原材料')[0];
            resole(newResult?.children)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: goodsName } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-system/material/getAllMaterialName?materialTypeName=原材料`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: specifications } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-system/material/getAllStructureSpec?materialTypeName=原材料`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/listAll`);
        resole(nums)
    }), {})

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/productCategory/product/category/list?planNumber=${e}`);
        setTowerSelects(data || [])
    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            console.log(value)
            await saveRun({
                ...value
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-science/substitute/material`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await submitRun({
                ...value
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-science/substitute/material/submit`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields();
        detailForm.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, onSave, resetFields }), [ref, onSubmit, onSave, resetFields]);


    return <DetailContent>
        <BaseInfo
            dataSource={detailData || {}}
            form={form}
            columns={applyColumns.map((item: any) => {
                switch (item.dataIndex) {
                    case "planNumber":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'productCategoryId'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择计划号"
                                    }
                                ]}>
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
                                                productCategoryId: '',
                                                materialStandard: '',
                                                materialStandardName: ''
                                            })
                                            setDetailData({
                                                ...detailData,
                                                productCategoryId: '',
                                                materialStandard: '',
                                                materialStandardName: ''
                                            })
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
                                return <Form.Item name={'productCategoryId'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择塔型名称"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择塔型名称"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                        onChange={async (e, options: any) => {
                                            const materialStandard = options?.key?.split(',')[1] || '';
                                            const materialStandardName = options?.key?.split(',')[2] || '';
                                            form.setFieldsValue({
                                                materialStandard: materialStandard,
                                                materialStandardName: materialStandardName
                                            })
                                            setDetailData({
                                                ...form?.getFieldsValue(true),
                                                materialStandard: materialStandard,
                                                materialStandardName: materialStandardName
                                            })
                                        }}>
                                        {towerSelects && towerSelects?.map((item: any) => {
                                            return <Select.Option key={item.productCategoryId + ',' + item.materialStandard + ',' + item.materialStandardName} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "materialCategory":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'materialCategory'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择原材料类型"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择原材料类型"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                    >
                                        {types && types?.map((item: any) => {
                                            return <Select.Option key={item?.id} value={item?.name}>{item?.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "materialName":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'materialName'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择原材料品名"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择原材料品名"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                    >
                                        {goodsName && goodsName?.map((item: any) => {
                                            return <Select.Option key={item} value={item}>{item}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "materialStandard":
                        return ({
                            ...item,
                            render: () => {
                                return <span>{detailData?.materialStandardName || '-'}</span>
                            }
                        })
                    case "changeMaterialStandard":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'materialName'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择原材料品名"
                                    }
                                ]}>
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder="请选择代料后标准"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }>
                                        {
                                            materialStandardOptions?.map((item: { id: string, name: string }) =>
                                                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "structureSpec":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'structureSpec'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择代料前规格"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择代料前规格"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                    >
                                        {specifications && specifications?.map((item: any) => {
                                            return <Select.Option key={item} value={item}>{item}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "changeStructureSpec":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'changeStructureSpec'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择代料后规格"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择代料后规格"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                    >
                                        {specifications && specifications?.map((item: any) => {
                                            return <Select.Option key={item} value={item}>{item}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "structureTexture":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'structureTexture'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择代料前材质"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择代料前材质"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            materialTextureOptions && materialTextureOptions?.map((item: { id: string, name: string }) =>
                                                <Select.Option value={item.name} key={item.id}>
                                                    {item.name}
                                                </Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            }
                        })
                    case "changeStructureTexture":
                        return ({
                            ...item,
                            render: () => {
                                return <Form.Item name={'changeStructureTexture'} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择代料后材质"
                                    }
                                ]}>
                                    <Select
                                        placeholder="请选择代料后材质"
                                        style={{ width: "100%" }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            materialTextureOptions && materialTextureOptions?.map((item: { id: string, name: string }) =>
                                                <Select.Option value={item.name} key={item.id}>
                                                    {item.name}
                                                </Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            }
                        })
                    default:
                        return item
                }
            })}
            col={2}
            edit={type !== 'detail'} />
        {
            type === 'detail' ?
                <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
                : null
        }

        {
            type === 'detail' ?
                <>
                    <DetailTitle title="回复信息" />
                    <Input.TextArea maxLength={400} onChange={(e) => {
                        setDescription(e.target.value)
                    }} />
                </>

                : null
        }
    </DetailContent>
})