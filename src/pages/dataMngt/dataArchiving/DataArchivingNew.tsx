/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-资料管理-资料存档管理-上传/编辑/查看
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Descriptions, Form, Input, Select } from 'antd';
 import { BaseInfo, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './DataArchiving.module.less';
import { certificateTypeOptions } from "../../../configuration/DictionaryOptions";
 
 interface modalProps {
     readonly record?: any;
     readonly type?: 'new' | 'detail' | 'edit';
     getLoading: (loading:boolean) => void
 }
 
 export default forwardRef(function DataArchivingNew({ record, type,getLoading }: modalProps, ref) {
     const [form] = Form.useForm();
     const [towerSelects, setTowerSelects] = useState([]);
     const [planNums,setPlanNums] = useState<any>([]);
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(``)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: type === 'new', refreshDeps: [record, type] })
  
     const columns= [
        {
            "key": "repairNumber",
            "title": "状态",
            "dataIndex": "repairNumber"
        },
        {
            "key": "status",
            "title": "资料室",
            "dataIndex": "status"
        },
        {
            "key": "repairTime",
            "title": "资料类型",
            "dataIndex": "repairTime"
        },
        {
            "key": "wasteProductReceiptNumber",
            "title": "柜号",
            "dataIndex": "wasteProductReceiptNumber"
        },
        {
            "key": "productTypeName",
            "title": "箱号",
            "dataIndex": "productTypeName"
        },
        {
            "key": "repairNumber",
            "title": "工程名称",
            "dataIndex": "repairNumber"
        },
        {
            "key": "status",
            "title": "计划号",
            "dataIndex": "status"
        },
        {
            "key": "repairTime",
            "title": "塔型名称",
            "dataIndex": "repairTime"
        },
        {
            "key": "repairTime",
            "title": "产品类型",
            "dataIndex": "repairTime"
        },
        {
            "key": "wasteProductReceiptNumber",
            "title": "电压等级",
            "dataIndex": "wasteProductReceiptNumber"
        },
        {
            "key": "productTypeName",
            "title": "客户名称",
            "dataIndex": "productTypeName"
        },
        {
            "key": "productTypeName",
            "title": "备注",
            "dataIndex": "productTypeName"
        }
    ]
  
    const { data: ProjectNames } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/productCategory/planNumber/listAll`);
        resole(nums)
    }), {})
 
    const ProjectNameChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingTask/list/${e}`);
        setPlanNums(data || [])
        form.setFieldsValue({
            productCategoryId: ''
        });
    }
     const planNumChange = async (e: any) => {
         const data: any = await RequestUtil.get(`/tower-science/loftingTask/list/${e}`);
         setTowerSelects(data || [])
         form.setFieldsValue({
             productCategoryId: ''
         });
     }
 
     const onSave = () => new Promise(async (resolve, reject) => {
         try {
             const value = await form.validateFields();
             console.log(value)
             getLoading(true)
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
             RequestUtil.post(`/tower-science/trialAssembly/save`, data).then(res => {
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
         form.resetFields();
     }
 
     useImperativeHandle(ref, () => ({ onSave, resetFields }), [ref, onSave, resetFields]);
 
 
     return <DetailContent>
         {
             type === 'detail' ?
             <>
                 <BaseInfo dataSource={data || {}} columns={columns} col={3} />
             </>
                 :
                 <Form form={form}>
                     <Descriptions bordered column={3} size="small" className={styles.description}>
                         <Descriptions.Item label="状态">
                             <Form.Item name="trialAssemble" initialValue={0} rules={[
                                 {
                                     "required": true,
                                     "message": "请选择状态"
                                 }
                             ]}>
                                 <Select placeholder="请选择状态">
                                     <Select.Option value={0} key={0}>正常</Select.Option>
                                     <Select.Option value={1} key={1}>变更</Select.Option>
                                     <Select.Option value={2} key={2}>无效</Select.Option>
                                 </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="资料室">
                             <Form.Item name="trialAssemble" rules={[
                                 {
                                     "required": true,
                                     "message": "请选择资料室"
                                 }
                             ]}>
                                 <Select placeholder="请选择资料室">
                        { certificateTypeOptions && certificateTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        }) }
                    </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="资料类型">
                             <Form.Item name="trialAssemble" rules={[
                                 {
                                     "required": true,
                                     "message": "请选择资料类型"
                                 }
                             ]}>
                                 <Select placeholder="请选择资料类型">
                        { certificateTypeOptions && certificateTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        }) }
                    </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="柜号">
                             <Form.Item name="trialAssemble">
                                 <Input maxLength={10}/>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="箱号">
                             <Form.Item name="trialAssemble">
                                 <Input maxLength={10}/>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item children></Descriptions.Item>
                         <Descriptions.Item label="工程名称">
                             <Form.Item name="planNumber">
                                 <Select
                                     showSearch
                                     placeholder="请选择工程名称"
                                     style={{ width: "150px" }}
                                     filterOption={(input, option) =>
                                         (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                     }
                                     onChange={(e) => ProjectNameChange(e)}>
                                     {ProjectNames && ProjectNames?.map((item: any, index: number) => {
                                         return <Select.Option key={index} value={item}>{item}</Select.Option>
                                     })}
                                 </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="计划号">
                             <Form.Item name="planNumber">
                                 <Select
                                     showSearch
                                     placeholder="请选择计划号"
                                     style={{ width: "150px" }}
                                     filterOption={(input, option) =>
                                         (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                     }
                                     onChange={(e) => planNumChange(e)}>
                                     {planNums && planNums?.map((item: any, index: number) => {
                                         return <Select.Option key={index} value={item}>{item}</Select.Option>
                                     })}
                                 </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="塔型名称">
                             <Form.Item name="productCategoryId">
                                 <Select placeholder="请选择塔型名称" style={{ width: "150px" }} onChange={async (e) => {
                                     console.log(e)
                                     const data: any = await RequestUtil.get(`/tower-science/trialAssembly/${e}`);
                                     form.setFieldsValue({
                                        voltageGradeName: data?.voltageGradeName,
                                        productTypeName: data?.productTypeName,
                                        // 客户名称
                                     })
                                 }}>
                                     {towerSelects && towerSelects?.map((item: any) => {
                                         return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                     })}
                                 </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="电压等级">
                             <Form.Item name="voltageGradeName">
                                 <Select placeholder="请选择电压等级">
                        { certificateTypeOptions && certificateTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        }) }
                    </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="产品类型">
                             <Form.Item name="voltageGradeName">
                                 <Select placeholder="请选择电压等级">
                        { certificateTypeOptions && certificateTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        }) }
                    </Select>
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item label="客户名称">
                             <Form.Item name="segmentName">
                                 <Input maxLength={100} />
                             </Form.Item>
                         </Descriptions.Item>
                         <Descriptions.Item span={3} label="备注">
                             <Form.Item name="description" >
                                 <Input.TextArea maxLength={800} />
                             </Form.Item>
                         </Descriptions.Item>
                     </Descriptions>
                 </Form>
         }
     </DetailContent>
 })
 
 