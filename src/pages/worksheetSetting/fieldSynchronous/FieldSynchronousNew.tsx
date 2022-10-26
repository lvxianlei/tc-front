/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-字段同步-新建任务/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './FieldSynchronous.module.less';
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";

interface modalProps {
    type: 'new' | 'edit';
    rowId: string;
}

export default forwardRef(function FieldSynchronousNew({ type, rowId }: modalProps, ref) {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any[]>([]);
    const [checkFields, setCheckFields] = useState<any[]>([]);

    const { data, loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/fieldSynchro/${rowId}`);
        templateChange(result?.templateId, 'automatic')
        setCheckFields(result?.syncWorkFieldDetailVOList || [])
        form.setFieldsValue({
            ...result,
            templateId: result?.templateId + ',' + result?.templateName
        });

        resole(result);
    }), { manual: type === 'new', refreshDeps: [rowId, type] })

    const { data: templateList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-work/template?size=1000`);
            const newData = result?.records?.filter((res: any) => res?.status === 1)
            resole(newData)
        } catch (error) {
            reject(error)
        }
    }))

    const templateChange = async (e: any, type: 'manual' | 'automatic') => {
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${e}`);
        setFields(result?.templateCustomVOList);
        if (type === 'manual') {
            setCheckFields(result?.templateCustomVOList?.map((res: any) => {
                return {
                    ...res,
                    status: 0
                }
            }))
        }
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-work/fieldSynchro`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                const value = form.getFieldsValue(true);
                await saveRun({
                    id: data?.id,
                    ...value,
                    syncWorkFieldDetailDTOList: checkFields,
                    templateId: value?.templateId && value?.templateId.split(',')[0],
                    templateName: value?.templateId && value?.templateId.split(',')[1]
                })
                resolve(true);

            })
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
            <Form form={form} layout="horizontal" labelCol={{ span: 4 }} labelAlign="right">
                <Form.Item
                    name={'name'}
                    label={'任务名称'}
                    rules={[
                        {
                            required: true,
                            message: `请输入任务名称`
                        }
                    ]}>
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    name={'templateId'}
                    label={'工单模板'}
                    rules={[
                        {
                            required: true,
                            message: `请选择工单模板`
                        }
                    ]}>
                    <Select placeholder={'请选择工单模板'} onChange={(e: any) => templateChange(e?.split(',')[0], 'manual')}>
                        {
                            templateList?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.id + ',' + res?.templateName} key={ind}>{res?.templateName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name={'triggerField'}
                    label={'触发字段'}
                    rules={[
                        {
                            required: true,
                            message: `请选择触发字段`
                        }
                    ]}>
                    <Select placeholder={'请选择触发字段'}>
                        {
                            fields?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.id} key={ind}>{res?.fieldKey}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name={'checkFields'}
                    label={'同步字段'}
                    rules={[
                        {
                            required: true,
                            validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                if (checkFields.filter(res => res?.status === 1).length > 0) {
                                    callback()
                                } else {
                                    callback('请选择同步字段')
                                }
                            }
                        }
                    ]}>
                    <Card>
                        <Row gutter={12}>
                            {
                                checkFields && checkFields?.map((res: any, ind: number) => {
                                    return <Col style={{ marginBottom: '6px' }} span={8}><Button key={ind} type={res?.status === 1 ? "primary" : undefined} onClick={() => {
                                        checkFields[ind] = {
                                            ...res,
                                            status: res?.status === 1 ? 0 : 1
                                        }
                                        setCheckFields([...checkFields])
                                    }} ghost={res?.status === 1 ? true : false}>{res?.fieldKey}</Button></Col>
                                })
                            }
                        </Row>
                    </Card>
                </Form.Item>
                <Form.Item
                    name={'description'}
                    label={'备注'}>
                    <Input.TextArea maxLength={800} />
                </Form.Item>
                <Form.Item
                    name={'apiUrl'}
                    label={'拉取API'}
                    rules={[
                        {
                            required: true,
                            message: `请输入拉取API`
                        }
                    ]}>
                    <Input.TextArea maxLength={800} />
                </Form.Item>
            </Form>
        </DetailContent>
    </Spin>
})

