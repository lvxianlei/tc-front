/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-杂项绩效管理-新增/编辑/详情
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Descriptions, Form, Input, Select } from 'antd';
import { BaseInfo, DetailContent, DetailTitle, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './GenerationOfMaterial.module.less';

interface modalProps {
    readonly id?: any;
    readonly type?: 'new' | 'detail' | 'edit';
}

export default forwardRef(function GenerationOfMaterialApply({ id, type }: modalProps, ref) {
    const [form] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [towerSelects, setTowerSelects] = useState([]);
    const [productCategoryData, setProductCategoryData] = useState<any>({});
    const [description, setDescription] = useState<string>('');

    const newColumns= [
       {
           "key": "loftingTaskNumber",
           "title": "放样环节",
           "width": 120,
           "dataIndex": "loftingTaskNumber"
       },
       {
           "key": "productCategoryName",
           "title": "杂项类别",
           "dataIndex": "productCategoryName"
       },
       {
           "key": "productTypeName",
           "title": "杂项类型",
           "dataIndex": "productTypeName"
       },
       {
           "key": "wasteStructureNum",
           "title": "杂项条目",
           "dataIndex": "wasteStructureNum"
       },
       {
           "key": "wasteNum",
           "title": "计划号",
           "dataIndex": "wasteNum"
       },
       {
           "key": "wasteNum",
           "title": "塔型",
           "dataIndex": "wasteNum"
       },
       {
           "key": "penaltyAmount",
           "title": "工时",
           "dataIndex": "penaltyAmount",
           "type": "number"
       },
       {
           "key": "rejectWeight",
           "title": "单价",
           "dataIndex": "rejectWeight",
           "type": "number"
       },
       {
           "key": "rejectWeight",
           "title": "总金额",
           "dataIndex": "rejectWeight",
           "type": "number"
       }
   ]

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/trialAssembly/getDetails?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [id, type] })

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/listAll`);
        resole(nums)
    }), {})

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingTask/list/${e}`);
        setTowerSelects(data || [])
        setProductCategoryData({})
        form.setFieldsValue({
            productCategoryId: ''
        });
    }

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
        {
            type === 'detail' ? 
            <BaseInfo 
       dataSource={data || {}} 
       columns={newColumns}
       col={3}
       />
            :
       <BaseInfo 
       dataSource={data || {}} 
       columns={newColumns.map((item: any) => {
           switch (item.dataIndex) {
               case "loftingTaskNumber":
                   return ({
                       ...item,
                       render: () => {
                           return <Select
                           showSearch
                           placeholder="请选择计划号"
                           style={{ width: "100%" }}
                           filterOption={(input, option) =>
                               (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                           }
                           onChange={(e) => planNumChange(e)}>
                           {planNums && planNums?.map((item: any, index: number) => {
                               return <Select.Option key={index} value={item}>{item}</Select.Option>
                           })}
                       </Select> 
                       }
                   })
                   case "supplierType":
                       return ({
                           ...item,
                           render: () => {
                               return <Select 
                               placeholder="请选择塔型名称" 
                               style={{ width: "100%" }}
                               showSearch
                           filterOption={(input, option) =>
                               (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                           } 
                               onChange={async (e) => {
                                   console.log(e)
                                   const data: any = await RequestUtil.get(`/tower-science/trialAssembly/${e}`);
                                   setProductCategoryData(data);
                               }}>
                                   {towerSelects && towerSelects?.map((item: any) => {
                                       return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                   })}
                               </Select>
                           }
                       })
               default:
                   return item
           }
       })} 
       edit
       col={3} />
    }
        {
            type === 'detail' ?
                <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
                : null
        }

        {
            type === 'detail' ?
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