/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 试组装信息
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Spin, Form, Select, Descriptions, Input, InputNumber } from 'antd';
 import { BaseInfo, CommonTable, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { MenuOutlined } from '@ant-design/icons';
 import styles from './TowerLoftingAssign.module.less';
 
 interface TryAssembleProps {
     id: string;
 }
 
 
 
 export default forwardRef(function TryAssemble({ id }: TryAssembleProps, ref) {
     const [form] = Form.useForm();
 
     const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
         try {
             const result: [] = await RequestUtil.get(`/tower-aps/productionUnit/list`);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id] })
 
 
     const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.post(`/tower-aps/planUnitLink/lofting/issue?unitId=${postData.unitId}&ids=${postData.ids}&linkId=${postData.linkId}`);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             const data = await form.validateFields();
             await saveRun({
                 unitId: data?.unitId,
                 linkId: data?.linkId
             })
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
         <DetailContent>
                    <p style={{ paddingBottom: "12px", fontWeight: "bold", fontSize: '14PX' }}>配段信息</p>
                    <Form form={ form } className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 2 }>
                            {
                                [...data || []]?.map((items: any, index: number) => {
                                    return <>
                                        <Descriptions.Item key={ index+'_'+id } label="段号">    
                                            <Form.Item name={ ["list", index, "segmentName"] }>
                                                <span>{ items.segmentName }</span>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item key={ index } label="试装段数">    
                                            <Form.Item key={ index+'_'+id } name={ ["list", index, "count"] }>
                                                <InputNumber style={{ width: "100%" }} min={ 0 } max={ 99 } placeholder="请输入"/>
                                            </Form.Item>
                                        </Descriptions.Item>
                                    </>
                                })
                            }   
                        </Descriptions>
                    </Form>
                </DetailContent>
     </Spin>
 })
 
 