/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-提料指派
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react"
 import { Spin, Form, Select, InputNumber, Table, message, DatePicker, Input } from 'antd'
 import { CommonTable, DetailTitle } from '../common'
 import RequestUtil from '../../utils/RequestUtil'
 import useRequest from '@ahooksjs/use-request'
 import styles from './MaterialTaskList.module.less';
 import { FixedType } from 'rc-table/lib/interface';
 import { materialTextureOptions } from "../../configuration/DictionaryOptions";
 import moment from "moment"
 
export interface EditProps {
    type: "new" | "edit",
     id: string
 }

 export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}
 
 export default forwardRef(function Edit({ type, id }: EditProps, ref) {
 
     const [baseForm] = Form.useForm();
     const [form] = Form.useForm();
     const [allMaterialList, setAllMaterialList] = useState<any>([]);
     const [specifications, setSpecifications] = useState<any>({});
 
     const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/work/center/info/${id}`)
             baseForm.setFieldsValue({
                 ...result,
                 time: [moment(result.workStartTime, 'HH:mm'), moment(result.workEndTime, 'HH:mm')],
                 equipmentId: result?.equipmentId && result?.equipmentId.split(',')
             })
             form.setFieldsValue({ workCenterRelations: [...result?.workCenterRelations] });
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: type === "new", refreshDeps: [id] })
 
     const { data: materialList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/material?size=1000`);
             setAllMaterialList(result?.records);
             var newArr = result?.records.filter((item: any, index: any, self: any) => {
                 return self.findIndex((el: any) => el.materialName === item.materialName) === index
             })
             resole(newArr)
         } catch (error) {
             reject(error)
         }
     }))
 
     const { data: processList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/product/process?size=100`);
             resole(result?.records)
         } catch (error) {
             reject(error)
         }
     }))
 
     const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.post(`/tower-aps/work/center/info`, { ...postData, id: data?.id })
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             const baseData = await baseForm.validateFields();
             console.log(baseData)
            //  if (form.getFieldsValue(true).workCenterRelations && form.getFieldsValue(true).workCenterRelations.length > 0) {
            //      const data = await form.validateFields();
            //      await saveRun({
            //          ...baseData,
            //          workStartTime: baseData.time[0].format('HH:mm'),
            //          workEndTime: baseData.time[1].format('HH:mm'),
            //          workCenterRelations: [...data?.workCenterRelations],
            //          equipmentId: baseData.equipmentId.join(',')
            //      })
            //      resolve(true);
            //  } else {
            //      message.warning("请添加产能矩阵");
            //      reject(false);
            //  }
         } catch (error) {
             reject(false)
         }
     })
 
     const resetFields = () => {
         baseForm.resetFields();
     }
 
 
     const tableColumns = [
        {
            key: 'name',
            title: '塔型',
            dataIndex: 'name',
            width: 120,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Form.Item name={["workCenterRelations", index, "processId"]} initialValue={_} rules={[{
            //         "required": true,
            //         "message": "请选择工序"
            //     },
            //     {
            //         "pattern": /^[^\s]*$/,
            //         "message": '禁止输入空格',
            //     }]}>
            //         <Select placeholder="请选择" style={{ width: '200px' }} size="small">
            //             {processList?.map((item: any) => {
            //                 return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
            //             })}
            //         </Select>
            //     </Form.Item>
            // )
        },
         {
             key: 'processId',
             title: <span>模式<span style={{ color: 'red' }}>*</span></span>,
             dataIndex: 'processId',
             width: 100
         },
         {
             key: 'materialName',
             title: <span>提料负责人<span style={{ color: 'red' }}>*</span></span>,
             dataIndex: 'materialName',
             width: 180,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                 <Form.Item name={["workCenterRelations", index, "materialName"]} initialValue={_} rules={[{
                     "required": true,
                     "message": "请选择提料负责人"
                 }]}>
                     <Select placeholder="请选择" size="small" style={{ width: '200px' }}>
                         {materialList?.map((item: any) => {
                             return <Select.Option key={item.id} value={item.materialName}>{item.materialName}</Select.Option>
                         })}
                     </Select>
                 </Form.Item>
             )
         },
         {
             key: 'specificationName',
             title: <span>优先级<span style={{ color: 'red' }}>*</span></span>,
             dataIndex: 'specificationName',
             width: 120,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                 <Form.Item name={["workCenterRelations", index, "specificationName"]} initialValue={_} rules={[{
                     "required": true,
                     "message": "请选择优先级"
                 }]}>
                     <Select style={{width:'100px'}} placeholder="请选择" size="small">
                                <Select.Option value={0} key={0}>紧急</Select.Option>
                                <Select.Option value={1} key={1}>高</Select.Option>
                                <Select.Option value={2} key={2}>中</Select.Option>
                                <Select.Option value={3} key={3}>低</Select.Option>
                            </Select>
                 </Form.Item>
             )
         },
         {
             key: 'materialTextureName',
             title: <span>计划交付时间<span style={{ color: 'red' }}>*</span></span>,
             dataIndex: 'materialTextureName',
             width: 150,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                 <Form.Item name={["workCenterRelations", index, "materialTextureName"]} initialValue={_} rules={[{
                     "required": true,
                     "message": "请选择计划交付时间"
                 }]}>
                     <DatePicker size="small" />
                 </Form.Item>
             )
         },
         {
             key: 'workHour',
             title: '备注',
             dataIndex: 'workHour',
             width: 180,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                 <Form.Item name={["workCenterRelations", index, "workHour"]} initialValue={_}>
                     <Input maxLength={40} size="small" key={index} />
                 </Form.Item>
             )
         }
     ]
 
     useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);
 
 
     return <Spin spinning={loading}>
         <DetailTitle title="指派信息" style={{ padding: '0 0 8px' }} />
         <Form form={form} className={styles.BatchAssigned}>
             <CommonTable
                 scroll={{ x: 500 }}
                 rowKey="id"
                 dataSource={[{name: '塔型A', id: '123456'}, {name: '塔型B', id: '12348452'}, {name: '塔型C', id: '789546'}]}
                 pagination={false}
                 columns={tableColumns}
                 className={styles.addModal} />
         </Form>
     </Spin>
 })