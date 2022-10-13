/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-螺栓列表-定额条目
 */

 import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
 import { Spin, Form, Input, Descriptions, Radio, RadioChangeEvent, Select, Divider, Space, Button } from 'antd';
 import { CommonTable, DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './BoltList.module.less';
 import { FixedType } from 'rc-table/lib/interface';
import { patternTypeOptions } from "../../../configuration/DictionaryOptions";
 
 export interface EditProps {
     onSubmit: () => void
 }

 interface QuotaEntriesProps {
    readonly id: string;
 }
 
 export default forwardRef(function QuotaEntries({ id }: QuotaEntriesProps, ref) {
     const [form] = Form.useForm();


     const { data: userDatas } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
           const result: any = await RequestUtil.get(`/tower-science/productCategory/${id}`);
            resole({
                user: [
                    {
                        name: result.boltUserName,
                        id: result.boltUser
                    }
                ],
                check: [
                    {
                        name: result.boltCheckUserName,
                        id: result.boltCheckUser
                    }
                ]
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

     const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'index',
            title: '段信息',
            dataIndex: 'index'
        },
        {
            key: 'index',
            title: '螺栓定额条目',
            dataIndex: 'index',
            
            render: (_: string , record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["data", index,""]}>
                    <Select size="small">
{/* <Select.Option value={1} key={1}>套用</Select.Option>
<Select.Option value={2} key={2}>新放</Select.Option> */}
{
                                patternTypeOptions?.map((item: any, index: number) =>
                                    <Select.Option value={item.id} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'index',
            title: '单价',
            dataIndex: 'index'
        },
        {
            key: 'index',
            title: '件号数',
            dataIndex: 'index'
        },
        {
            key: 'index',
            title: '螺栓清单',
            dataIndex: 'index',
            render: (_: string , record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["data", index,""]}>
                    <Select size="small">
{
    userDatas?.user.map((res: any) => {
        return <Select.Option value={res.id} key={res.id}>{res.name}</Select.Option>
    })
}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'index',
            title: '清单校核',
            dataIndex: 'index',
            render: (_: string , record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["data", index,""]}>
                    <Select size="small">
{
    userDatas?.check.map((res: any) => {
        return <Select.Option value={res.id} key={res.id}>{res.name}</Select.Option>
    })
}
                    </Select>
                </Form.Item>
            )
        }
    ]
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
            const result: any = await RequestUtil.get(``);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { refreshDeps: [] })
 
     const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
         try {
             const result = await RequestUtil.post(`/tower-science/packageStructure/copy`, postData);
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             const data = form.getFieldsValue(true);
             await saveRun(data)
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
         <DetailContent className={styles.quotaEntries}>
             <Form form={form} >
                 <CommonTable
                 isPage={false} 
                 columns={columns}
                 dataSource={[{id: 1}]}/>
             </Form>
          </DetailContent>
     </Spin >
 })
 
 