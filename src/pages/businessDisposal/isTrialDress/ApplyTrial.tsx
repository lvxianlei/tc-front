/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-试装免试装申请-申请
 */

import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
import { Descriptions, Form, Input, Select } from 'antd';
import { Attachment, AttachmentRef, BaseInfo, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { applyColumns } from "./isTrialDress.json";
import styles from './IsTrialDress.module.less';

interface modalProps {
    readonly id?: any;
    readonly type?: 'new' | 'detail' | 'edit';
}

export default forwardRef(function ApplyTrial({ id, type }: modalProps, ref) {
    const [form] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [towerSelects, setTowerSelects] = useState([]);
    const [productCategoryData, setProductCategoryData] = useState<any>({});
    const attachRef = useRef<AttachmentRef>()

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/trialAssembly/getDetails?id=${id}`)
            if (type === 'edit') {
                planNumChange(result?.planNumber)
                form.setFieldsValue({ ...result });
                setProductCategoryData({ ...result });
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [id, type] })

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/listAll`);
        resole(nums)
    }), {})

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingTask/list/${e}`);
        setTowerSelects(data || [])
    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await saveRun({
                ...value,
                id: data?.id,
                fileIds: attachRef.current?.getDataSource().map(item => item.id)
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-science/trialAssembly/save`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await submitRun({
                ...value,
                id: data?.id,
                fileIds: attachRef.current?.getDataSource().map(item => item.id)
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-science/trialAssembly/saveAndLaunch`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // const onPass = () => new Promise(async (resolve, reject) => {
    //     try {
    //         const value = await form.validateFields();
    //         await passRun({

    //         })
    //         resolve(true);
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    // const { run: passRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
    //     try {
    //         const result: any = await RequestUtil.post(``, data)
    //         resove(result)
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { manual: true })

    // const onReject = () => new Promise(async (resolve, reject) => {
    //     try {
    //         const value = await form.validateFields();
    //         await rejectRun({

    //         })
    //         resolve(true);
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    // const { run: rejectRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
    //     try {
    //         const result: any = await RequestUtil.post(``, data)
    //         resove(result)
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { manual: true })

    const resetFields = () => {
        form.resetFields();
        detailForm.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, onSave, resetFields }), [ref, onSubmit, onSave, resetFields]);


    return <DetailContent>
        {
            type === 'detail' ?
                <BaseInfo dataSource={data || {}} columns={applyColumns} col={3} />
                :
                <Form form={form}>
                    <Descriptions bordered size="small" className={styles.description}>
                        <Descriptions.Item label="申请类型">
                            <Form.Item name="trialAssemble" rules={[
                                {
                                    "required": true,
                                    "message": "请选择申请类型"
                                }
                            ]}>
                                <Select placeholder="请选择申请类型">
                                    <Select.Option value={0} key={0}>免试装</Select.Option>
                                    <Select.Option value={1} key={1}>试组装</Select.Option>
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="计划号">
                            <Form.Item name="planNumber" rules={[
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
                                    onChange={(e) => {
                                        planNumChange(e);
                                        setProductCategoryData({})
                                        form.setFieldsValue({
                                            productCategoryId: ''
                                        });
                                    }}>
                                    {planNums && planNums?.map((item: any, index: number) => {
                                        return <Select.Option key={index} value={item}>{item}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="塔型名称">
                            <Form.Item name="productCategoryId" initialValue={data?.productCategoryId} rules={[
                                {
                                    "required": true,
                                    "message": "请选择塔型名称"
                                }
                            ]}>
                                <Select placeholder="请选择塔型名称" style={{ width: "150px" }} onChange={async (e) => {
                                    const data: any = await RequestUtil.get(`/tower-science/trialAssembly/${e}`);
                                    setProductCategoryData(data);
                                }}>
                                    {towerSelects && towerSelects?.map((item: any) => {
                                        return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="电压等级">
                            {productCategoryData?.voltageGradeName}
                        </Descriptions.Item>
                        <Descriptions.Item label="产品类型">
                            {productCategoryData?.productTypeName}
                        </Descriptions.Item>
                        <Descriptions.Item label="段落">
                            <Form.Item name="segmentName" rules={[
                                {
                                    "required": true,
                                    "message": "请输入段落"
                                }
                            ]}>
                                <Input maxLength={100} />
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="放样人">
                            {productCategoryData?.loftingUserName}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label="工程名称">
                            {productCategoryData?.projectName}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="申请说明">
                            <Form.Item name="description" rules={[
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
        {
            type === 'detail' ?

                <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
                : null
        }
        <Attachment isBatchDel={type !== 'detail'} ref={attachRef} dataSource={data?.fileVOList} edit={type !== 'detail'} />
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

