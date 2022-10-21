/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-派工/批量派工
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from 'antd';
 import { CommonTable, DetailContent, DetailTitle } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './Management.module.less'
import moment from "moment";
import { start } from "nprogress";
 
 interface modalProps {
     rowId: string;
 }
 
 export default forwardRef(function Dispatching({ rowId }: modalProps, ref) {
     const [form] = Form.useForm();
     const [nodeData, setNodeData] = useState<any>([])
/**
 * FS: 当前环节结束后，下游环节开始(结束时间等于下一节点开始时间)
 * FF:当前环节结束后，下游环节结束(开始时间等于下一节点开始时间)
 * SF:当前环节开始后，下游环节结束(开始时间等于下一节点开始时间)
 * SS:当前环节开始后，下游环节开始(开始时间等于下一节点开始时间)
 * 小时，工作日，自然日，周
 * */  
     const { data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
         const list = {
            vo: [
                {
                    name: '一级处理',
                    aging: '4',
                    agingType: '小时',
                    upstreamNode: '',
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
                    aging: '4',
                    agingType: '小时',
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
             form.validateFields().then(res => {
                     const value = form.getFieldsValue(true);
                     console.log(value)
             })
         } catch (error) {
             reject(false)
         }
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

     const timeCalculate = (nowNode: Record<string, any>, startTime: any ) => {
        nowNode.map((item: any) => {
const nextList = nodeData?.map((res:any) => {
            if(item.name === res.upstreamNode) {
                return res
            } else {
                return undefined
            }
        })?.filter(Boolean)
        const index = nodeData?.findIndex((res: any) => res.name === item?.name)
        console.log(index)
        if(item.agingType === '小时') {
            const time = timeIncrease(startTime, item?.aging)
            console.log(time,'---------当前节点结束时间及下一节点开始时间有------')
            const values = form.getFieldsValue(true).data
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
                timeCalculate(nextList,moment(time))
            }
        } else if(item.agingType === '自然日') {
            const time = naturalDayIncrease(startTime, item?.aging)
            console.log(time,'---------当前节点结束时间及下一节点开始时间有------')
            const values = form.getFieldsValue(true).data
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
                timeCalculate(nextList,moment(time))
            }
        } else if(item.agingType === '周') {
            const time = naturalDayIncrease(startTime, item?.aging)
            console.log(time,'---------当前节点结束时间及下一节点开始时间有------')
            const values = form.getFieldsValue(true).data
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
                timeCalculate(nextList,moment(time))
            }
        } else {
            // 工作日
            const time = weekIncrease(startTime, item?.aging)
            console.log(time,'---------当前节点结束时间及下一节点开始时间有------')
            const values = form.getFieldsValue(true).data
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
                timeCalculate(nextList,moment(time))
            }
        }
        console.log(nodeData)
        })
        
     }

     const startTimeChange= (e: any, res: Record<string, any>) => {
            timeCalculate([res], e)
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
                            <Input/>
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
 
 