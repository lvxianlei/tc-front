/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-明细变更申请-详情
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Input} from 'antd';
 import { BaseInfo, DetailContent, DetailTitle, OperationRecord } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './RequestForChange.module.less';
 
 interface modalProps {
     readonly id?: any;
     readonly type?: 'new' | 'edit';
 }
 
 export default forwardRef(function ApplyOrDetail({ id, type }: modalProps, ref) {
     const [msg,setMsg]=  useState('')
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(`/tower-science/trialAssembly/getDetails?id=${id}`)
             console.log(result)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: type === 'new', refreshDeps: [id, type] })

     const detailColumns = [
        {
            key: 'taskNum',
            title: '申请类型',
            width: 50,
            dataIndex: 'taskNum'
        },
        {
            key: 'partNum',
            title: '计划号',
            width: 80,
            dataIndex: 'partNum'
        },
        {
            key: 'mistakenPartNum',
            title: '塔型名称',
            width: 80,
            dataIndex: 'mistakenPartNum'
        },
        {
            key: 'loftingUserName',
            title: '电压等级',
            width: 80,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'loftingPrice',
            title: '产品类型',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPunishmentAmount',
            title: '段落',
            width: 80,
            dataIndex: 'loftingPunishmentAmount'
        },
        {
            key: 'leaderPunishmentAmount',
            title: '放样人',
            width: 80,
            dataIndex: 'leaderPunishmentAmount'
        },
        {
            key: 'loftingPerformanceAmount',
            title: '工程名称',
            width: 80,
            dataIndex: 'loftingPerformanceAmount'
        },
        {
            key: 'checkUserName',
            title: '申请原因',
            width: 80,
            dataIndex: 'checkUserName'
        }
    ]

     const onReject = () => new Promise(async (resolve, reject) => {
         try {
             console.log(msg)
             await rejectRun({
                msg
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: rejectRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             const result: any = await RequestUtil.post(`/tower-science/trialAssembly/save`, data)
             resove(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onPass = () => new Promise(async (resolve, reject) => {
         try {
             await passRun({
                msg
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: passRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             const result: any = await RequestUtil.post(`/tower-science/trialAssembly/saveAndLaunch`, data)
             resove(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const resetFields = () => {
         setMsg('')
     }
 
     useImperativeHandle(ref, () => ({ onPass, onReject, resetFields }), [ref, onPass, onReject, resetFields]);
 
     return <DetailContent className={styles.changeForm}>
                 <BaseInfo dataSource={data || {}} columns={detailColumns} col={3} />
                 <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
                 <DetailTitle title="回复信息"/>
                 <Input.TextArea onChange={(e) => {
                    setMsg(e.target.value)
                 }} maxLength={800}/>
     </DetailContent>
 })
 
 