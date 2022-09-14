/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-试装免试装申请-申请
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Descriptions, Form, Input, Select } from 'antd';
import { BaseInfo, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { applyColumns } from "./isTrialDress.json";
import styles from './IsTrialDress.module.less';

interface modalProps {
    readonly id?: any;
    readonly type?: 'new' | 'detail';
}

export default forwardRef(function ApplyTrial({ id, type }: modalProps, ref) {
    const [form] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [towerSelects, setTowerSelects] = useState([]);

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(``)

            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id, type] })

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/list`);
        resole(nums)
    }), {})

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/productCategory/list/${e}`);
        setTowerSelects(data || [])
        form.setFieldsValue({
            productCategoryIds: []
        });
    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            console.log(value)
            await saveRun({

            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await submitRun({

            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    const onPass = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await passRun({

            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })
    
    const { run: passRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onReject = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await rejectRun({

            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: rejectRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields();
        detailForm.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, onSave, onPass, onReject, resetFields }), [ref, onSubmit, onSave, onPass, onReject, resetFields]);


    return <DetailContent>
        {
            type === 'detail' ?
                <BaseInfo dataSource={data} columns={applyColumns} col={3} />
                :
                <Form form={form}>
                    <Descriptions bordered column={3} size="small" className={styles.description}>
                        <Descriptions.Item label="申请类型">
                            <Form.Item name="supplyType" rules={[
                                {
                                    "required": true,
                                    "message": "请选择申请类型"
                                }
                            ]}>
                                <Select placeholder="请选择申请类型">
                                    <Select.Option value={1} key={1}>免试装</Select.Option>
                                    <Select.Option value={2} key={2}>试组装</Select.Option>
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="计划号">
                            <Form.Item name="priority" rules={[
                                {
                                    "required": true,
                                    "message": "请选择计划号"
                                }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="请选择计划号"
                                    style={{ width: "150px" }}
                                    filterOption={(input, option) =>
                                        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(e) => planNumChange(e)}>
                                    {planNums && planNums?.map((item: any, index: number) => {
                                        return <Select.Option key={index} value={item}>{item}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="塔型名称">
                            <Form.Item name="productCategoryIds" rules={[
                                {
                                    "required": true,
                                    "message": "请选择塔型名称"
                                }
                            ]}>
                                <Select placeholder="请选择塔型名称" style={{ width: "150px" }} mode="multiple">
                                    {towerSelects && towerSelects?.map((item: any) => {
                                        return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="电压等级">
                            { }
                        </Descriptions.Item>
                        <Descriptions.Item label="产品类型">
                            { }
                        </Descriptions.Item>
                        <Descriptions.Item label="段落">
                            <Form.Item name="supplyType" rules={[
                                {
                                    "required": true,
                                    "message": "请输入段落"
                                }
                            ]}>
                                <Input maxLength={100} />
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="放样人">
                            { }
                        </Descriptions.Item>
                        <Descriptions.Item label="工程名称">
                            { }
                        </Descriptions.Item>
                        <Descriptions.Item label="申请说明">
                            <Form.Item name="supplyType" rules={[
                                {
                                    "required": true,
                                    "message": "请输入申请说明"
                                }
                            ]}>
                                <Input.TextArea maxLength={400} />
                            </Form.Item>
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
        }
        <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
        {/* {
            type === 'detail' ?

                <Form form={detailForm}>
                    <Form.Item name="description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
                : null
        } */}
    </DetailContent>
})

