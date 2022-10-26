/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-字段同步-新建任务/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './FieldSynchronous.module.less';

interface modalProps {
    type: 'new' | 'edit';
    rowId: string;
}

export default forwardRef(function FieldSynchronousNew({ type, rowId }: modalProps, ref) {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any[]>([]);
    const [checkFields, setCheckFields] = useState<any[]>([]);

    const { data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${rowId}`);
        templateChange(result)
        form.setFieldsValue({
            ...result
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


    const templateChange = async (e: any) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${e}`);
        setFields(result?.templateCustomVOList);
        setCheckFields(result?.templateCustomVOList?.map((res: any) => {
            return {
                ...res,
                checked: false
            }
        }))
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-work/template`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                const value = form.getFieldsValue(true);
                const checkedData = checkFields?.filter(res=> res?.checked)
                console.log(checkedData)
                await saveRun({
                    id: data?.id,
                    ...value
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

    return <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} labelAlign="right">
            <Form.Item
                name={'templateName'}
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
                name={'templateTypeId'}
                label={'工单模板'}
                rules={[
                    {
                        required: true,
                        message: `请选择工单模板`
                    }
                ]}>

                <Select placeholder={'请选择工单模板'} onChange={(e: any) => templateChange(e)}>
                    {
                        templateList?.map((res: any, ind: number) => {
                            return <Select.Option value={res?.id} key={ind}>{res?.templateName}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name={'templateTypeId'}
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
                name={'templateTypeId'}
                label={'同步字段'}
                rules={[
                    {
                        required: true,
                        message: `请选择同步字段`
                    }
                ]}>
                <Card>
                    <Row gutter={12}>
                    {
                        checkFields?.map((res: any, ind: number) => {
                            return <Col style={{marginBottom: '6px'}} span={8}><Button key={ind} type={res?.checked ? "primary" : undefined} onClick={() => {
                                checkFields[ind] = {
                                    ...fields[ind],
                                    checked: fields[ind]?.checked ? false : true
                                }
                                console.log(checkFields)
                                setCheckFields([...checkFields])
                            }} ghost={res?.checked ? true : false}>{res?.fieldKey}</Button></Col>
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
                name={'description'}
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
})

