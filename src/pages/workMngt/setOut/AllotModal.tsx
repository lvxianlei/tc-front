/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 调拨
 */

 import React, { useImperativeHandle, forwardRef } from "react";
 import { Spin, Form, Descriptions, InputNumber, Input } from 'antd';
 import { CommonTable, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './TowerLoftingAssign.module.less';
import { IAllot, ILoftingProductStructureVOS } from "./ISetOut";
import { RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
 
 interface AllotModalProps {
     id: string;
 }
 
 export default forwardRef(function AllotModal({ id }: AllotModalProps, ref) {
     const [form] = Form.useForm();
 
     const { loading, data } = useRequest<IAllot>(() => new Promise(async (resole, reject) => {
         try {
              let result: IAllot = await RequestUtil.get(`/tower-science/productStructure/getAllocation/${id}`);
            result={
                ...result,
                loftingProductStructureVOS: result?.loftingProductStructureVOS?.map((res: ILoftingProductStructureVOS) => {
                    let BasicsPartTotalNum = 0;
                    result?.loftingProductStructureVOS?.filter(item => {return res.codeRelation === item.codeRelation}).forEach((items: ILoftingProductStructureVOS) => { BasicsPartTotalNum += Number(items?.basicsPartNum)});
                    return {
                        ...res,
                        basicsPartNum: '0',
                        BasicsPartTotalNum: BasicsPartTotalNum
                    }
                })
            }
            form.setFieldsValue({...result, loftingProductStructure: result?.loftingProductStructureVOS})
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id] })
 
 
     const { run: submitRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.post(`/tower-science/productStructure/getAllocation/submit`);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })

     const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/productStructure/getAllocation/save`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
            const baseData = await form.validateFields()
             await submitRun({
                productId: id,
                productStructureSaveDTOList: baseData
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
     const onSave = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await form.validateFields()
             console.log(baseData)
            await saveRun({
                productId: id,
                productStructureSaveDTOList: baseData
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })
 
     const resetFields = () => {
         form.resetFields();
     }

     const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件号',
            width: 120,
            dataIndex: 'code'
        },
        {
            key: 'basicsPartNum',
            title: '数量',
            width: 120,
            dataIndex: 'basicsPartNum',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['loftingProductStructure', index, 'basicsPartNum']} rules={[{ 
                    "required": true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if(value !== '') {
                            const data = form.getFieldsValue(true).loftingProductStructure;
                        let BasicsPartTotalNum = 0;
                        data?.filter((item: ILoftingProductStructureVOS) => {return record.codeRelation === item.codeRelation}).forEach((items: ILoftingProductStructureVOS) => { BasicsPartTotalNum += Number(items?.basicsPartNum)});
                        if(BasicsPartTotalNum > record.BasicsPartTotalNum) {
                            callback('关联段号数量和等于单段件数')
                        } else {
                            callback()
                        }
                        } else {
                            callback('请输入数量')
                        }}}
                ]}>
                    <InputNumber min={0} max={record.BasicsPartTotalNum} size="small"/>
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['loftingProductStructure', index, 'description']}>
                    <Input size="small"/>
                </Form.Item>
            )
        },
        {
            key: 'BasicsPartTotalNum',
            title: '单段件数',
            width: 120,
            dataIndex: 'BasicsPartTotalNum'
        }
    ]
 
     useImperativeHandle(ref, () => ({ onSave,onSubmit, resetFields }), [ref,onSave, onSubmit, resetFields]);
 
     return <Spin spinning={loading}>
         <DetailContent>
             <Form form={form} className={styles.descripForm}>
             <p style={{ paddingBottom: "12px", fontWeight: "bold", fontSize: '14PX' }}>基础信息</p>
                 <Descriptions title="" bordered size="small" colon={false} column={3}>
                     <Descriptions.Item key={1} label="杆塔号">
                         {data?.productNumber}
                     </Descriptions.Item>
                     <Descriptions.Item key={2} label="呼高">
                        {data?.productHeight || '-'}
                     </Descriptions.Item>
                     <Descriptions.Item key={3} label="配段信息">
                        {data?.segmentInformation}
                     </Descriptions.Item>
                 </Descriptions>
                 <p style={{ padding: "12px 0px", fontWeight: "bold", fontSize: '14PX' }}>特殊件号信息</p>
                 <CommonTable 
                    columns={ columns } 
                    pagination={ false } 
                    dataSource={ data?.loftingProductStructureVOS } />
             </Form>
         </DetailContent>
     </Spin>
 })
 
 