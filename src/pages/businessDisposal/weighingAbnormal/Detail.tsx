/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-过磅异常-详情
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Descriptions, Form, Input, Select, Spin } from 'antd';
 import { BaseInfo, CommonAliTable, DetailContent, DetailTitle, OperationRecord } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { baseColumns, towerColumns } from "./weighingAbnormal.json"
 import styles from './WeighingAbnormal.module.less';
 
 interface modalProps {
     readonly id?: any;
     readonly type?: 'review' | 'detail';
     getLoading: (loading: boolean) => void
 }
 
 export default forwardRef(function GenerationOfMaterialApply({ id, type, getLoading }: modalProps, ref) {
     const [description, setDescription] = useState<string>('');
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(`/tower-science/trialAssembly/getDetails?id=${id}`)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id, type] })
 
     const onPass = () => new Promise(async (resolve, reject) => {
         try {
            getLoading(true)
             await passRun({
 
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: passRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             await RequestUtil.post(``, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onReject = () => new Promise(async (resolve, reject) => {
         try {
            getLoading(true)
             await rejectRun({
 
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: rejectRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             await RequestUtil.post(``, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const resetFields = () => {
        setDescription('')
     }
 
     useImperativeHandle(ref, () => ({ onPass,onReject, resetFields }), [ref, onPass,onReject, resetFields]);
 
 
     return <Spin spinning={loading}>
        <DetailContent>
     <DetailTitle title="基础信息"/>
        <BaseInfo 
        dataSource={data || {}} 
        columns={baseColumns} 
        col={5}/>
        <DetailTitle title="杆塔信息"/>
        <CommonAliTable dataSource={[]} className={styles.table} columns={towerColumns}/>
        <OperationRecord title="审批信息" serviceId={id} serviceName="tower-science" />
         {
             type === 'review' ?
             <Input.TextArea maxLength={400} onChange={(e)=> {
                            setDescription(e.target.value)
                         }}/>
                 : null
         }
     </DetailContent>
     </Spin>
 })
 
 