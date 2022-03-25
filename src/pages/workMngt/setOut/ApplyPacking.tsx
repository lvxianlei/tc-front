/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 试组装信息
 */

 import React, { useImperativeHandle, forwardRef } from "react";
 import { Spin, Form, Descriptions, InputNumber, Input, Space, Button } from 'antd';
 import { DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './TowerLoftingAssign.module.less';
 
 interface ApplyPackingProps {
     id: string;
 }

 export interface EditProps {
    onSubmit: () => void
}
 export default forwardRef(function ApplyPacking({ id }: ApplyPackingProps, ref) {
     const [form] = Form.useForm();
 
     const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
         try {

         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id] })
 
 
     const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.post(`/tower-science/productSegmentAssemble`, postData);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             const data = await form.getFieldsValue(true);
             await saveRun(data.list)
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const resetFields = () => {
         form.resetFields();
     }
 
     useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);
 
     return <Spin spinning={loading}>
         <DetailContent style={{padding: '16px'}}>
         <Form form={form} layout="inline" onFinish={(value: Record<string, any>) => {}}>
             <Form.Item name="materialSpec" label="工程名称">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Form.Item name="materialSpec" label="计划号">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Form.Item name="materialSpec" label="塔型">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Form.Item name="materialSpec" label="杆塔号">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                        <Space direction="horizontal">
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button type="ghost" htmlType="reset">重置</Button>
                        </Space>
            </Form>
         </DetailContent>
     </Spin>
 })
 
 