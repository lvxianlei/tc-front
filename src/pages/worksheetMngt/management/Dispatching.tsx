/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-派工/批量派工
 */

 import React, { useImperativeHandle, forwardRef, useState, useEffect } from "react";
 import { Col, DatePicker, Form, Input, message, Row } from 'antd';
 import {  DetailContent } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './Management.module.less'
import moment from "moment";
import SelectUserByStations from "./SelectUserByStations";
 
 interface modalProps {
     rowId: string;
 }
 
 export default forwardRef(function Dispatching({ rowId }: modalProps, ref) {
     const [form] = Form.useForm();
     const [nodeData, setNodeData] = useState<any>([]);
     const [isOk, setIsOk] = useState<boolean>(true);

     const { data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
         const list = {
            vo: [
                {
                    name: '一级处理',
                    aging: '4',
                    agingType: '小时',
                    upstreamNode: '任务开始',
                    model: 'FS'
                },
                {
                    name: '二级处理',
                    aging: '4',
                    agingType: '自然日',
                    upstreamNode: '一级处理',
                    model: 'FS'
                },
                {
                    name: '三级处理',
                    aging: '4',
                    agingType: '小时',
                    upstreamNode: '一级处理',
                    model: 'FS'
                },
                {
                    name: '四级处理',
                    aging: '2',
                    agingType: '自然日',
                    upstreamNode: '二级处理',
                    model: 'FS'
                }
            ],
         }
         setNodeData(list?.vo || [])
         form.setFieldsValue({
            data: [...list?.vo || []]
         })
         resole(list);
     }), { refreshDeps: [rowId] })
 
     
     useEffect(() => {
        if(isOk) {
             setIsOk(isOk)
        }
      }, [isOk])
      
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
             form.validateFields().then(async res => {
                     const value = form.getFieldsValue(true);
                     checkModel(value?.data?.filter((res: any)=>res.upstreamNode === '任务开始')).then((data)=>{
                        console.log(isOk)
                        if(isOk) {
                            console.log(value)
                        } else {
                            reject(false)
                        }
                    })
                     
             })
         } catch (error) {
             reject(false)
         }
     })
 
     const checkModel = (nodes: Record<string, any>, lastData?: Record<string, any>) => new Promise(async (resole, reject) => {
            let tip: boolean= true
        nodes?.map((item: any) => {
                    if(lastData?.model === 'FS') {
                        if(item.startTime<lastData?.endTime) {
                            tip=false
                            message.warning(`${item?.name}开始时间不符合上游模式设定`)
                            setIsOk(false)
                        }
                    } else if(lastData?.model === 'FF') {
                        if(item.endTime<lastData?.endTime) {
                            tip=false
                            message.warning(`${item?.name}结束时间不符合上游模式设定`)
                            setIsOk(false)
                        }
                    }else if(lastData?.model === 'SF') {
                        if(item.endTime<lastData?.startTime) {
                            tip=false
                            message.warning(`${item?.name}结束时间不符合上游模式设定`)
                            setIsOk(false)
                        }
                    }else {
                        if(item.startTime<lastData?.startTime) {
                            tip=false
                            message.warning(`${item?.name}开始时间不符合上游模式设定`)
                            setIsOk(false)
                        }
                    }
            const nextList = nodeData?.map((res:any) => {
                    if(item.name === res.upstreamNode) {
                        return res
                    } else {
                        return undefined
                    }
                })?.filter(Boolean)
                if(tip) {
 if(nextList.length > 0) {
                    checkModel(nextList,item)
                    resole(true)
                        
                    } 
                } else {
                    reject(tip)
                }
                   
                })
     })


     const resetFields = () => {
         form.resetFields()
     }

     const timeIncrease = (nowTime: any,time: any) => {
        const date = new Date(nowTime).valueOf();
        const stamp = Number(time) * 3600000;
        const actual = Number(date) + Number(stamp);
        return moment(actual).format('YYYY-MM-DD HH:mm:ss');
     }

     const naturalDayIncrease = (nowTime: any,time: any) => {
        const date = new Date(nowTime).valueOf();
        const stamp = Number(time) * 86400000;
        const actual = Number(date) + Number(stamp);
        return moment(actual).format('YYYY-MM-DD HH:mm:ss');
     }

     const weekIncrease = (nowTime: any,time: any) => {
        const date = new Date(nowTime).valueOf();
        const stamp = Number(time) * 86400000 * 7;
        const actual = Number(date) + Number(stamp);
        return moment(actual).format('YYYY-MM-DD HH:mm:ss');
     }

     const workDayIncrease =(nowTime: any,time: any) => {
        const date = new Date(nowTime).valueOf();
        let actual = Number(date)
        do {
            if(new Date(moment(actual).format('YYYY-MM-DD HH:mm:ss')).getDay()===6 || new Date(moment(actual).format('YYYY-MM-DD HH:mm:ss')).getDay()===0) {
            actual = actual + 86400000;
            } else { 
            actual = actual + 86400000;
            time--;
            }
        }
        while (time > 0)
        return moment(actual).format('YYYY-MM-DD HH:mm:ss')
     }

     /**
 * FS: 当前环节结束后，下游环节开始(结束时间等于下一节点开始时间)
 * FF:当前环节结束后，下游环节结束(开始时间等于下一节点开始时间)
 * SF:当前环节开始后，下游环节结束(开始时间等于下一节点开始时间)
 * SS:当前环节开始后，下游环节开始(开始时间等于下一节点开始时间)
 * 小时，工作日，自然日，周
 * */  
     const timeCalculate = (nowNode: Record<string, any>, startTime: any) => {
        nowNode.map((item: any) => {
const nextList = nodeData?.map((res:any) => {
            if(item.name === res.upstreamNode) {
                return res
            } else {
                return undefined
            }
        })?.filter(Boolean)
        const index = nodeData?.findIndex((res: any) => res.name === item?.name)
            const time = item.agingType === '小时'?
            timeIncrease(startTime, item?.aging)
            :item.agingType === '自然日'?
            naturalDayIncrease(startTime, item?.aging)
            :item.agingType === '周'?
            weekIncrease(startTime, item?.aging)
            :workDayIncrease(startTime, item?.aging)
            console.log(time,'---------当前节点结束时间及下一节点开始时间有------')
            const values = form.getFieldsValue(true).data;
            values[index] = {
                ...values[index],
                endTime: moment(time),
                startTime: startTime
            }
            setNodeData([...values])
            form.setFieldsValue({
                data : values
            })
            if(nextList.length > 0) {
                timeCalculate(nextList,item?.model === 'FS' ? moment(time) : startTime)
            }
        })
        
     }

     const startTimeChange= (e: any, res: Record<string, any>) => {
            timeCalculate([res], e)
     }
 
     const endTimeChange= (e: any, res: Record<string, any>) => {
        if(res?.model === 'FS') {
            const nextList = nodeData?.map((item:any) => {
            if(res.name === item.upstreamNode) {
                return item
            } else {
                return undefined
            }
        })?.filter(Boolean)
            timeCalculate(nextList, e)
        }
 }

     useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);
 
     return <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
         <Form form={form} layout="horizontal" labelCol={{ span: 6 }} labelAlign="right">
            {
                data?.vo?.map((res: any, index: number) => {
                    return <Row gutter={12}>
                        <Col span={2}>
                         {res?.name}
                        </Col>
                        <Col span={6}>
                        <Form.Item name={['data', index, 'person']}>
                        <Input disabled suffix={
                                        <SelectUserByStations key={index} selectType="checkbox" station={res?.post} onSelect={(selectedRows: Record<string, any>) => {
                                            console.log(selectedRows)
                                        }} />
                                    } />
                        </Form.Item>
                        </Col>
                        <Col span={8}>
                        <Form.Item label="预计开始时间" name={['data', index, 'startTime']} initialValue={res?.startTime}>
    <DatePicker 
    onChange={(e) => startTimeChange(e, res)}
        style={{width: '100%'}}
      format="YYYY-MM-DD HH:mm:ss"
      showTime
    />
                        </Form.Item>
                        </Col>
                        <Col span={8}>
                        <Form.Item label="预计结束时间" name={['data', index, 'endTime']} initialValue={res?.endTime}>
    <DatePicker
    disabledDate={(current:any)=>{
        return current && current< form.getFieldsValue(true).data[index]?.startTime
    }}
    disabledTime={(current:any)=>{
        return {
            disabledHours: () => Array.from({length:24},(_, i)=>0+(i)).splice(0, new Date(form.getFieldsValue(true).data[index]?.startTime).getHours()),
    disabledMinutes: () => Array.from({length:60},(_, i)=>0+(i)).splice(0, new Date(form.getFieldsValue(true).data[index]?.startTime).getMinutes()),
    disabledSeconds: () => Array.from({length:60},(_, i)=>0+(i)).splice(0, new Date(form.getFieldsValue(true).data[index]?.startTime).getSeconds()),
        }
    }}
    onChange={(e) => endTimeChange(e, res)}
        style={{width: '100%'}}
      format="YYYY-MM-DD HH:mm:ss"
      showTime
    />
                        </Form.Item>
                        </Col>
                    </Row>
                })
            }
            </Form>
     </DetailContent>
 })
 
 