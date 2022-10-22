/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-处理
 */

 import React, { forwardRef, useImperativeHandle, useState } from "react";
 import { Button, Card, Col, Form, Input, message, Row } from 'antd';
 import { BaseInfo, CommonTable, DetailContent, DetailTitle, OperationRecord } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './Management.module.less'
import FormItem from "antd/lib/form/FormItem";
import { AnyMxRecord } from "dns";
 
 interface modalProps {
     rowId: string;
 }
 
 export default forwardRef(function EngineeringInformation({ rowId }: modalProps, ref) {
     const [form] = Form.useForm();
     const [fields, setFields] = useState<any[]>([]);

     const baseColumns = [
        {
            key: 'hierarchy',
            title: '工单编号',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '产生途径',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '工单标题',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '工单类型',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '工单状态',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '产生时间',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '预计完成时间',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '实际完成时间 ',
            dataIndex: 'hierarchy',
            width: 100
        },

     ]
 
     const columns = [
         {
             key: 'hierarchy',
             title: '处理环节',
             dataIndex: 'hierarchy',
             width: 100
         },
         {
             key: 'hierarchy',
             title: '处理标题',
             dataIndex: 'hierarchy',
             width: 100
         },
         {
             key: 'model',
             title: '处理模式',
             dataIndex: 'model',
             width: 100
         },
         {
             key: 'upstreamNode',
             title: '处理人',
             dataIndex: 'upstreamNode',
             width: 100
         },
         {
             key: 'agingType',
             title: '部门',
             dataIndex: 'agingType',
             width: 100
         },
         {
             key: 'aging',
             title: '处理状态',
             dataIndex: 'aging',
             width: 100
         },
         {
             key: 'handleName',
             title: '接收时间',
             dataIndex: 'handleName',
             width: 100
         },
         {
             key: 'jobs',
             title: '预计完成时间',
             dataIndex: 'jobs',
             width: 100
         },
         {
             key: 'color',
             title: '实际完成时间',
             dataIndex: 'color',
             width: 100
         }
     ]
 
     const { data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
         const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
        const list = {
            vo: [
                {
                    name: '一级处理',
                    userList: [
                        {
                            name: '张三',
                            fields: [
                                {
                                    key: '创建时间',
                                    value: '2022'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '二级处理',

                }
            ],
            vos: [
                {
                    key: '放样任务编号',
                    value: '1234564',
                    api: '111111',
                },
                {
                    key: '创建时间',
                    value: '2022'
                }, {
                    key: '操作状态变更时间',
                    value: '2022'
                }, {
                    key: '实际完成时间',
                    value: '2022'
                }
            ]
        }
        setFields(list?.vos)
         resole(list);
     }), { refreshDeps: [rowId] })
 
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
            let value = form.getFieldsValue(true)
            value = value?.data?.map((res: any) => {
                const newRes = Object.entries(res)
                return newRes.map((item: any) => {
                    return {
                        key: item[0],
                    value: item[1]
                    }
                })
            })
            console.log(value)
            
            form.validateFields().then(res => {
                
            })
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const onBack = () => new Promise(async (resolve, reject) => {
        try {
            let value = form.getFieldsValue(true)
            if(value.description) {

            } else {
                message.warning("请输入退回说明");
                reject(false)
            }

        } catch (error) {
            reject(false)
        }
    })

    const getValueByApi =async (api: string, index: number) => {
        if(api) {
            // const result: { [key: string]: any } = await RequestUtil.get(api)
            // console.log(api,result)
            const data: any = [
                {
                    key: '放样任务编号',
                    value: '12345'
                },
                {
                    key: '创建时间',
                    value: '7777'
                }
            ]
            const newData = data?.map((res: any) => {
                let arr = []
                arr = [res?.key, res?.value]
                return arr
            })
            const entriesData: any = Object.fromEntries(newData)
            const values  = form.getFieldsValue(true);
        form.setFieldsValue({
            ...entriesData
        })
            let newFields: any[] =[]
            data.forEach((element: any) => {
                newFields = fields?.map((res: any) => {
                    if(element?.key === res?.key) {
                    return {
                        ...res,
                        key: res?.key,
                        value: element?.value
                    }

                    } else {
                        return {
                            ...res,
                            key: res?.key,
                            value: res?.value
                        }

                    }
                })
            });     
            setFields([
                ...newFields || [],
            ])
        } else {
            message.warning('当前无可同步字段')
        }
    }

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit,onBack, resetFields }), [ref, onSubmit,onBack, resetFields]);
    
     return <DetailContent key='WorkOrderDetail' className={styles.WorkOrderDetail}>
        <Row gutter={12}>
            <Col span={19}>
                <Form form={form} labelCol={{span: 8}}>
                    <Row gutter={24}>
                        {
                            [...fields]?.map((res: any, index: number)=> {
                                return res?.api ?
                                <Col span={8} key={index}>
                            <Card bordered={false}>
                                    <Form.Item label={res?.key} >
                                        <Row gutter={12}>
                                            <Col span={ 18}>
                                    <Form.Item name={res?.key} initialValue={res?.value}>
                                        
                                        <Input/>
                                    </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                            
                                <Button type="primary" onClick={() =>getValueByApi(res?.api, index)} ghost>获取</Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                            
                            </Card>
                        </Col>
                                :
                                <Form.Item label={res?.key} key={index} name={res?.key} initialValue={res?.value}>
                                <Input/>
                            </Form.Item>
                            })
                        }                        
                    </Row>
                    <Form.Item label="完成/退回说明" name="description" labelCol={{span: 3}}>
                        <Input.TextArea maxLength={800}/>
                    </Form.Item>
                </Form>

             <OperationRecord title="操作信息" serviceId={rowId} serviceName="tower-wo" />
            </Col>
            <Col span={5}>
         <DetailTitle title="工单信息" key={0} />
         {
            data?.vo?.map((res: any, index: number) => {
return <Card title={res?.name} key={index}>
    {
        res?.userList?.map((item: any, ind: number) => {
            return <Card title={item?.name} key={ind}>
                {
                    item?.fields?.map((field: any, i: number) => {
                        return <Row gutter={12} key={i} justify="space-around">
        <Col span={8}>
     {field?.key}
        </Col>
        <Col span={16}>
     {field?.value}
        </Col>
      </Row>
                    })
                }
      
    </Card>
        })
    }
    
  </Card>
            })
         }
         
            </Col>
        </Row>
     </DetailContent>
 })
 
 