/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-放样-批量修改材质
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Spin, Form, Select, Input } from 'antd';
 import { DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './TowerLoftingAssign.module.less';
 import CommonTable from "../../common/CommonTable";
 
 interface modalProps {
     id: string;
 }
 
 export default forwardRef(function StructureTextureEdit({ id }: modalProps, ref) {
     const [form] = Form.useForm();
     const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
     const [selectedRows, setSelectedRows] = useState<any[]>([]);
 
     const list = [
         {
             index: 0,
             structureTexture: 'Q235'
         },
         {
             index: 1,
             structureTexture: 'Q345'
         },
         {
             index: 2,
             structureTexture: 'Q420'
         },
         {
             index: 3,
             structureTexture: 'Q460'
         },
         {
             index: 4,
             structureTexture: 'Q355'
         }
     ]
 
     const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
         try {
             //  const result: [] = await RequestUtil.get(``);
             resole([])
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [id] })
 
 
     const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.post(``);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             await saveRun({
 
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const resetFields = () => {
         form.resetFields();
     }
 
     const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
         setSelectedRowKeys(selectedRowKeys);
         console.log(selectRows)
         setSelectedRows(selectRows);
     }
 
     useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);
 
     return <Spin spinning={loading}>
         <DetailContent>
             <Form form={form} className={styles.descripForm}>
                 <Form.Item name="status" label="范围选择" initialValue={''} style={{ paddingBottom: '16px' }}>
                     <Select style={{ width: '120px' }} placeholder="请选择">
                         <Select.Option value="" key="0">全部</Select.Option>
                         <Select.Option value={1} key="1">待指派</Select.Option>
                         <Select.Option value={2} key="2">放样中</Select.Option>
                         <Select.Option value={3} key="3">组焊中</Select.Option>
                         <Select.Option value={4} key="4">配段中</Select.Option>
                         <Select.Option value={5} key="5">已完成</Select.Option>
                     </Select>
                 </Form.Item>
                 <CommonTable
                     haveIndex
                     pagination={false}
                     dataSource={list}
                     rowKey="index"
                     rowSelection={{
                         selectedRowKeys: selectedRowKeys,
                         onChange: onSelectChange,
                         type: "checkbox",
                     }}
                     columns={[
                         {
                             key: 'structureTexture',
                             title: '修改项',
                             dataIndex: 'structureTexture',
                             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                 <span>材质{_}后加</span>
                             )
                         },
                         {
                             key: 'suffix',
                             title: '修改项',
                             dataIndex: 'suffix',
                             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                 <Form.Item name={['data', index, 'suffix']} rules={
                                     [{
                                         pattern: new RegExp(/[BC]{1}$/),
                                         message: '请输入字母/-'
                                     }]}
                                 >
                                     <Input placeholder="请输入" maxLength={50} size="small" />
                                 </Form.Item>
                             )
                         },
                     ]} />
             </Form>
         </DetailContent>
     </Spin>
 })
 
 