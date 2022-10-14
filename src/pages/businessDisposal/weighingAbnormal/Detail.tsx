/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-过磅异常-详情
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Descriptions, Form, Input, Select } from 'antd';
 import { BaseInfo, CommonTable, DetailContent, DetailTitle, OperationRecord } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { baseColumns, towerColumns } from "./weighingAbnormal.json";
 import styles from './GenerationOfMaterial.module.less';
 
 interface modalProps {
     readonly id?: any;
     readonly type?: 'approval' | 'detail';
 }
 
 export default forwardRef(function Detail({ id, type }: modalProps, ref) {
     const [form] = Form.useForm();
     const [detailForm] = Form.useForm();
     const [description, setDescription] = useState<string>('');
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(`/tower-science/trialAssembly/getDetails?id=${id}`)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), {refreshDeps: [id, type] })
 
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
                 ...value
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
 
     useImperativeHandle(ref, () => ({ onSubmit, onSave,onPass,onReject, resetFields }), [ref, onSubmit, onSave,onPass,onReject, resetFields]);
 
 
     return <DetailContent>
     <DetailTitle title="基础信息"/>
        <BaseInfo 
        dataSource={data || {}} 
        columns={baseColumns}
        col={5} 
        />
        <DetailTitle title="杆塔信息"/>
        <CommonTable 
        dataSource={[]}
        columns={towerColumns}/>
                 <OperationRecord title="审批信息" serviceId={id} serviceName="tower-science" />

         {
             type === 'approval' ?
             <>
             <DetailTitle title="回复信息"/>
             <Input.TextArea maxLength={400} onChange={(e)=> {
                            setDescription(e.target.value)
                         }}/>
             </>
                         
                 : null
         }
     </DetailContent>
 })
 
 