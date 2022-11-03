/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-资料管理-工程资料管理-上传/编辑
 */

 import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
 import { Button, Descriptions, Form, Input, Select } from 'antd';
 import { Attachment, BaseInfo, CommonTable, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './DataArchiving.module.less';
import { certificateTypeOptions } from "../../../configuration/DictionaryOptions";
import { AttachmentRef, FileProps } from "../../common/Attachment";
 
 interface modalProps {
     readonly record?: any;
     readonly type?: 'new' | 'detail' | 'edit';
 }
 
 export default forwardRef(function DataUpload({ record, type }: modalProps, ref) {
     const [form] = Form.useForm();
     const [towerSelects, setTowerSelects] = useState([]);
     const [planNums,setPlanNums] = useState<any>([]);
     const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(``)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: type === 'new', refreshDeps: [record, type] })
  
     const tableColumns= [
        {
            "key": "repairNumber",
            "title": "文件名",
            "dataIndex": "repairNumber"
        },
        {
            "key": "status",
            "title": "文件类别",
            "dataIndex": "status"
        },
        {
            "key": "repairTime",
            "title": "文件类型",
            "dataIndex": "repairTime"
        },
        {
            "key": "wasteProductReceiptNumber",
            "title": "应用计划",
            "dataIndex": "wasteProductReceiptNumber"
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
 
     const resetFields = () => {
         form.resetFields();
     }
 
     useImperativeHandle(ref, () => ({ onSave, resetFields }), [ref, onSave, resetFields]);
 
 
     return <DetailContent>
        <Attachment multiple ref={attachRef} isTable={false} dataSource={[]} onDoneChange={(dataInfo: FileProps[]) => {
                console.log(dataInfo)
            }}><Button type="primary" ghost>上传</Button></Attachment>
         <CommonTable 
         columns={tableColumns}
         dataSource={[]}
         />
     </DetailContent>
 })
 
 