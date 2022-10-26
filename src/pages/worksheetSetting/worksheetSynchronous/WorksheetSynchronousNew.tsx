/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-工单同步-新建任务/编辑
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Button, Col, Form, Input, InputNumber, message, Row, Select, Space, TreeSelect } from 'antd';
 import { CommonTable, DetailContent, DetailTitle } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { FixedType } from 'rc-table/lib/interface';
 import styles from './WorksheetSynchronous.module.less'
 import SelectColor from "../../common/SelectColor";
 import { RuleObject } from "antd/lib/form";
 import { StoreValue } from "antd/lib/form/interface";
 
 interface modalProps {
     type: 'new' | 'edit';
     rowId: string;
 }
 
 export default forwardRef(function WorksheetSynchronousNew({ type, rowId }: modalProps, ref) {
     const [form] = Form.useForm();
     const [fields, setFields] = useState<any[]>([]);
 
 
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
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

     const treeNode = (nodes: any) => {
         nodes?.forEach((res: any) => {
             res.title = res?.name;
             res.value = res?.id;
             res.children = res?.children;
             if (res?.children?.length > 0) {
                 treeNode(res?.children)
             }
         })
         return nodes
     }
 
     const templateChange = async (e: any) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/template/${e?.split(',')[1]}`);
        setFields(result?.templateCustomVOList);
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
                     {/* <Form.Item
                         name={'templateTypeId'}
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
                         name={'description'}
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
 })
 
 