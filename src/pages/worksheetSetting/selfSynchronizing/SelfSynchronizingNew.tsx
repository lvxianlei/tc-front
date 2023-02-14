/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-自动同步-新建任务/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './SelfSynchronizing.module.less';
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";

interface modalProps {
    type: 'new' | 'edit';
    rowId: string;
    getLoading: (loading: boolean) => void
}

export default forwardRef(function SelfSynchronizingNew({ type, rowId, getLoading }: modalProps, ref) {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any[]>([]);
    const [checkFields, setCheckFields] = useState<any[]>([]);
    const [nodeList, setNodeList] = useState<any[]>([]);

    const { data, loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/fieldSynchroAutomatic/${rowId}`);
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
        setNodeList(result?.templateNodeVOList || [])
    }

    const { run: saveRun } = useRequest((data: any) => new Promise(async (resove, reject) => {
        try {
            RequestUtil.post(`/tower-work/fieldSynchroAutomatic`, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                getLoading(true)
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
                    <Select placeholder={'请选择工单模板'} onChange={(e: any) => {
                        templateChange(e?.split(',')[0], 'manual')
                        form?.setFieldsValue({
                            triggerField: ''
                        })
                    }}>
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
                                return <Select.Option value={res?.fieldKey} key={ind}>{res?.fieldKey}</Select.Option>
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
                                    return <Col style={{ marginBottom: '6px' }} span={8}>
                                        <div key={ind} className={styles.clickBtn} style={res?.status === 1 ? { borderColor: '#FF8C00', color: '#FF8C00' } : {}} onClick={() => {
                                            checkFields[ind] = {
                                                ...res,
                                                status: res?.status === 1 ? 0 : 1
                                            }
                                            setCheckFields([...checkFields])
                                        }} >
                                            {res?.fieldKey}
                                        </div>
                                    </Col>
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
                    name={'node'}
                    label={'环节名称'}
                    rules={[
                        {
                            required: true,
                            message: `请输入环节名称`
                        }
                    ]}>
                        <Select placeholder={'请选择触发字段'}>
                        {
                            nodeList?.map((res: any, ind: number) => {
                                return <Select.Option value={res?.node} key={ind}>{res?.node}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        </DetailContent>
    </Spin>
})

