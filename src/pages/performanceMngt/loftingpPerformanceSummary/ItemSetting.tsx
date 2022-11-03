/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-放样塔型绩效汇总-绩效条目设置
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Button, Form, Select } from 'antd';
 import { CommonTable, DetailContent, DetailTitle } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { setColumns } from "./loftingpPerformanceSummary.json"
 
 interface modalProps {
 
 }
 
 export default forwardRef(function CoefficientPerformance({ }: modalProps, ref) {
    const [itemData, setItemData] = useState<any[]>();

     const { loading, data } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-science/performance/config`, data)
        const items = [
            {
                name: '项目对接',
                value: 1
            },
            {
                name: '放样工作',
                value: 1
            },
            {
                name: '放样互审',
                value: 1
            },
            {
                name: '放样高低腿配置编制',
                value: 1
            },
            {
                name: '放样校核',
                value: 1
            },
            {
                name: '放样高低腿配置校核',
                value: 1
            },
            {
                name: '放样挂线板校核',
                value: 1
            },
            {
                name: '辅助出图设计',
                value: 1
            },
            {
                name: '提料工作',
                value: 1
            },
            {
                name: '提料工作校核',
                value: 1
            },
            {
                name: '编程高低腿',
                value: 1
            },
            {
                name: '螺栓工作',
                value: 1
            },
            {
                name: '螺栓工作校核',
                value: 1
            },
            {
                name: '螺栓计划',
                value: 1
            },
            {
                name: '螺栓计划校核',
                value: 1
            },
            {
                name: '小样图上传',
                value: 1
            },
            {
                name: '样板室图纸打印',
                value: 1
            },
            {
                name: '样板室样板打印',
                value: 1
            },
            {
                name: '杂项绩效',
                value: 1
            }
        ]
        setItemData(items)
         resole([]);
     }), {})
 
 
     const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
         try {
             const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/performance/config`, data)
             resove(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             const value = await form.validateFields();
             await saveRun(value)
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const resetFields = () => {
         form.resetFields()
     }
 
     useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);
 
     const [form] = Form.useForm();
 
     return <DetailContent key='CoefficientPerformance'>
         <CommonTable dataSource={itemData || []} pagination={false} columns={[
            ...setColumns,
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: "right",
                render: (_: undefined, record: any, index: number): React.ReactNode => (
                    <Button type="link" onChange={(e) => {
                        const newData = itemData?.map((res: any, ind: number) => {
                            if(ind === index) {
                                return {
                                    ...res,
                                    state: e
                                }
                            }else {
                                return res
                            }
                        })
                        console.log(newData)
                        setItemData(newData)
                    }}>{record?.state}</Button>
                )
            }
            ]}/>
     </DetailContent>
 })
 
 