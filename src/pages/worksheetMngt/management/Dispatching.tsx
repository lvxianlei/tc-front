/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-派工/批量派工
 */

import React, { useImperativeHandle, forwardRef, useState, useEffect } from "react";
import { Col, DatePicker, Form, Input, message, Row } from 'antd';
import { DetailContent } from '../../common';
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
        let result: any = await RequestUtil.get<any>(`/tower-work/workOrder/workOrderNode/${rowId}`);
        result = result.map((res: any) => {
            return {
                ...res,
                planStartTime: res?.planStartTime && moment(res?.planStartTime),
                planEndTime: res?.planEndTime && moment(res?.planEndTime),
                recipientUser: res?.recipientUser && res?.recipientUser?.split(','),
            }
        })
        console.log(result)
        setNodeData(result || [])
        form.setFieldsValue({
            data: [...result || []]
        })
        resole(result);
    }), { refreshDeps: [rowId] })


    useEffect(() => {
        if (isOk) {
            setIsOk(isOk)
        }
    }, [isOk])

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-work/workOrder/saveWorkOrderNode`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                const value = form.getFieldsValue(true);
                checkModel(value?.data?.filter((res: any) => res.upstreamNode === '任务开始')).then(async (data) => {
                    console.log(isOk)
                    if (isOk) {
                        console.log(value)
                        await saveRun([
                            ...value?.data.map((res: any) => {
                                return {
                                    ...res,
                                    recipientUser: res?.recipientUser?.join(','),
                                    planEndTime: res?.planEndTime.format('YYYY-MM-DD HH:mm:ss'),
                                    planStartTime: res?.planStartTime.format('YYYY-MM-DD HH:mm:ss'),
                                    workOrderId: rowId
                                }
                            })
                        ])
                        resolve(true)
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
        let tip: boolean = true
        nodes?.map((item: any) => {
            if (lastData?.pattern === 'FS') {
                if (item.planStartTime < lastData?.planEndTime) {
                    tip = false
                    message.warning(`${item?.name}开始时间不符合上游模式设定`)
                    setIsOk(false)
                }
            } else if (lastData?.pattern === 'FF') {
                if (item.planEndTime < lastData?.planEndTime) {
                    tip = false
                    message.warning(`${item?.name}结束时间不符合上游模式设定`)
                    setIsOk(false)
                }
            } else if (lastData?.pattern === 'SF') {
                if (item.planEndTime < lastData?.planStartTime) {
                    tip = false
                    message.warning(`${item?.name}结束时间不符合上游模式设定`)
                    setIsOk(false)
                }
            } else {
                if (item.planStartTime < lastData?.planStartTime) {
                    tip = false
                    message.warning(`${item?.name}开始时间不符合上游模式设定`)
                    setIsOk(false)
                }
            }
            const nextList = nodeData?.map((res: any) => {
                if (item.node === res.upstreamNode) {
                    return res
                } else {
                    return undefined
                }
            })?.filter(Boolean)
            if (tip) {
                if (nextList.length > 0) {
                    checkModel(nextList, item)
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

    const timeIncrease = (nowTime: any, time: any) => {
        const date = new Date(nowTime).valueOf();
        const stamp = Number(time) * 3600000;
        const actual = Number(date) + Number(stamp);
        return moment(actual).format('YYYY-MM-DD HH:mm:ss');
    }

    const naturalDayIncrease = (nowTime: any, time: any) => {
        const date = new Date(nowTime).valueOf();
        const stamp = Number(time) * 86400000;
        const actual = Number(date) + Number(stamp);
        return moment(actual).format('YYYY-MM-DD HH:mm:ss');
    }

    const weekIncrease = (nowTime: any, time: any) => {
        const date = new Date(nowTime).valueOf();
        const stamp = Number(time) * 86400000 * 7;
        const actual = Number(date) + Number(stamp);
        return moment(actual).format('YYYY-MM-DD HH:mm:ss');
    }

    const workDayIncrease = (nowTime: any, time: any) => {
        const date = new Date(nowTime).valueOf();
        let actual = Number(date)
        do {
            if (new Date(moment(actual).format('YYYY-MM-DD HH:mm:ss')).getDay() === 6 || new Date(moment(actual).format('YYYY-MM-DD HH:mm:ss')).getDay() === 0) {
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
    const timeCalculate = (nowNode: Record<string, any>, planStartTime: any) => {
        nowNode.map((item: any) => {
            const nextList = nodeData?.map((res: any) => {
                if (item.node === res.upstreamNode) {
                    return res
                } else {
                    return undefined
                }
            })?.filter(Boolean)
            const index = nodeData?.findIndex((res: any) => res.node === item?.node)
            const time = item.agingType === '小时' ?
                timeIncrease(planStartTime, item?.agingSize)
                : item.agingType === '自然日' ?
                    naturalDayIncrease(planStartTime, item?.agingSize)
                    : item.agingType === '周' ?
                        weekIncrease(planStartTime, item?.agingSize)
                        : workDayIncrease(planStartTime, item?.agingSize)
            console.log(time, '---------当前节点结束时间及下一节点开始时间有------')
            const values = form.getFieldsValue(true).data;
            values[index] = {
                ...values[index],
                planEndTime: moment(time),
                planStartTime: planStartTime
            }
            setNodeData([...values])
            form.setFieldsValue({
                data: values
            })
            if (nextList.length > 0) {
                timeCalculate(nextList, item?.pattern === 'FS' ? moment(time) : planStartTime)
            }
        })

    }

    const startTimeChange = (e: any, res: Record<string, any>) => {
        timeCalculate([res], e)
    }

    const endTimeChange = (e: any, res: Record<string, any>) => {
        if (res?.pattern === 'FS') {
            const nextList = nodeData?.map((item: any) => {
                if (res.node === item.upstreamNode) {
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
                nodeData && nodeData?.map((res: any, index: number) => {
                    return <Row gutter={12}>
                        <Col span={2}>
                            {res?.node}
                        </Col>
                        <Col span={6}>
                            <Form.Item name={['data', index, 'recipientUserName']} initialValue={res?.recipientUserName}>
                                <Input disabled suffix={
                                    <SelectUserByStations disabled={res?.status === 3} key={index} selectedKey={res?.recipientUser} selectType="checkbox" station={res?.post} onSelect={(selectedRows: Record<string, any>) => {
                                        console.log(selectedRows)
                                        const value = form.getFieldsValue(true)?.data;
                                        value[index] = {
                                            ...value[index] || [],
                                            recipientUser: selectedRows.map((res: { userId: any; }) => {
                                                return res?.userId
                                            }),
                                            recipientUserName: selectedRows.map((res: any) => {
                                                return res?.name
                                            })?.join(',')
                                        }
                                        form.setFieldsValue({
                                            data: [...value]
                                        })
                                        setNodeData([
                                            ...value
                                        ])
                                        console.log(form.getFieldsValue(true)?.data)
                                    }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="预计开始时间" name={['data', index, 'planStartTime']} initialValue={res?.planStartTime}>
                                <DatePicker
                                    disabled={res?.status === 3}
                                    onChange={(e) => startTimeChange(e, res)}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="预计结束时间" name={['data', index, 'planEndTime']} initialValue={res?.planEndTime}>
                                <DatePicker
                                    disabled={res?.status === 3}
                                    disabledDate={(current: any) => {
                                        return current && current < form.getFieldsValue(true).data[index]?.planStartTime
                                    }}
                                    disabledTime={(current: any) => {
                                        return {
                                            disabledHours: () => Array.from({ length: 24 }, (_, i) => 0 + (i)).splice(0, new Date(form.getFieldsValue(true).data[index]?.planStartTime).getHours()),
                                            disabledMinutes: () => Array.from({ length: 60 }, (_, i) => 0 + (i)).splice(0, new Date(form.getFieldsValue(true).data[index]?.planStartTime).getMinutes()),
                                            disabledSeconds: () => Array.from({ length: 60 }, (_, i) => 0 + (i)).splice(0, new Date(form.getFieldsValue(true).data[index]?.planStartTime).getSeconds()),
                                        }
                                    }}
                                    onChange={(e) => endTimeChange(e, res)}
                                    style={{ width: '100%' }}
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

