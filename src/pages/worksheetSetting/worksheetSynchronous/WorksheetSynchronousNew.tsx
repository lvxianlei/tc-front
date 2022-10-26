/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-工单同步-新建任务/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, Select, Spin } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './WorksheetSynchronous.module.less'

interface modalProps {
    type: 'new' | 'edit';
    rowId: string;
}

export default forwardRef(function WorksheetSynchronousNew({ type, rowId }: modalProps, ref) {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any[]>([]);

    const { data, loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/workOrderSync/${rowId}`);
        templateChange(result?.templateId)
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
        console.log(e)
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${e}`);
        setFields(result?.templateCustomVOList);
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-work/workOrderSync/submitSyncWorkOrder`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                const value = form.getFieldsValue(true);
                console.log(value)
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

    return <Spin spinning={loading}>
        <DetailContent key='WorksheetSynchronousNew' className={styles.WorksheetSynchronousNew}>
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

                <Select placeholder={'请选择工单模板'} onChange={(e: any) => templateChange(e)}>
                    {
                        templateList?.map((res: any, ind: number) => {
                            return <Select.Option value={res?.id} key={ind}>{res?.templateName}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            {/* <Form.Item
                         name={'triggerField'}
                         label={'触发字段'}
                         rules={[
                             {
                                 required: true,
                                 message: `请选择触发字段`
                             }
                         ]}>
                            
                <Select placeholder={'请选择触发字段'} onChange={(e: any) => templateChange(e)}>
                    {
                        fields?.map((res: any, ind: number) => {
                            return <Select.Option value={res?.id} key={ind}>{res?.fieldKey}</Select.Option>
                        })
                    }
                </Select>
                     </Form.Item> */}

            <Form.Item
                name={'description'}
                label={'备注'}>
                <Input.TextArea maxLength={800} />
            </Form.Item>
            {/* <Form.Item
                         name={'apiUrl'}
                         label={'推送API'}
                         rules={[
                             {
                                 required: true,
                                 message: `请输入推送API`
                             }
                         ]}>
                         <Input.TextArea maxLength={800} />
                     </Form.Item> */}

        </Form>
    </DetailContent>
        </Spin>
})

