/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-处理
 */

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import { DetailContent, DetailTitle, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Management.module.less'

interface modalProps {
    rowId: string;
    workTemplateTypeId: string;
}

export default forwardRef(function EngineeringInformation({ rowId, workTemplateTypeId }: modalProps, ref) {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any[]>([]);

    const { data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.post<any>(`/tower-work/workOrder/getWorkOrderNode/${rowId}/${workTemplateTypeId}`);
        setFields(result?.workOrderCustomVOList)
        resole(result);
    }), { refreshDeps: [rowId, workTemplateTypeId] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-work/workOrder/completeWorkOrderNode`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: backRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-work/workOrder/returnWorkOrderNode`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                let value = form.getFieldsValue(true)
                value = value?.data?.map((res: any) => {
                    const newRes = Object.entries(res)
                    return newRes.map((item: any) => {
                        return {
                            fieldKey: item[0],
                            fieldValue: item[1]
                        }
                    })
                })
                console.log(value)
                await saveRun({
                    workOrderId: data?.workOrderCustomVOList[0]?.workOrderId,
                    description: value?.description,
                    workOrderNode: data?.workOrderCustomVOList[0]?.workOrderNode,
                    workOrderNodeUserCustomDTOList: [
                        ...value
                    ]
                })

            })
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const onBack = () => new Promise(async (resolve, reject) => {
        try {
            let value = form.getFieldsValue(true)
            if (value.description) {
                form.validateFields().then(async res => {
                    value = value?.data?.map((res: any) => {
                        const newRes = Object.entries(res)
                        return newRes.map((item: any) => {
                            return {
                                fieldKey: item[0],
                                fieldValue: item[1]
                            }
                        })
                    })
                    console.log(value)
                    await backRun({
                        workOrderId: data?.workOrderCustomVOList[0]?.workOrderId,
                        description: value?.description,
                        workOrderNode: data?.workOrderCustomVOList[0]?.workOrderNode,
                        workOrderNodeUserCustomDTOList: [
                            ...value
                        ]
                    })
    
                })
            } else {
                message.warning("请输入退回说明");
                reject(false)
            }

        } catch (error) {
            reject(false)
        }
    })

    const getValueByApi = async (api: string, index: number) => {
        if (api) {
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
            const newData = data?.map((res: { key: never, value: never }) => {
                let arr = []
                arr = [res?.key, res?.value]
                return arr
            })
            const entriesData: any = Object.fromEntries(newData)
            const values = form.getFieldsValue(true);
            form.setFieldsValue({
                ...entriesData
            })
            let newFields: any[] = []
            data.forEach((element: any) => {
                newFields = fields?.map((res: any) => {
                    if (element?.key === res?.key) {
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

    useImperativeHandle(ref, () => ({ onSubmit, onBack, resetFields }), [ref, onSubmit, onBack, resetFields]);

    return <DetailContent key='WorkOrderDetail' className={styles.WorkOrderDetail}>
        <Row gutter={12}>
            <Col span={19}>
                <Form form={form} labelCol={{ span: 8 }}>
                    <Row gutter={24}>
                        {
                            [...fields]?.map((res: any, index: number) => {
                                return res?.api ?
                                    <Col span={8} key={index}>
                                        <Card bordered={false}>
                                            <Form.Item label={res?.key} >
                                                <Row gutter={12}>
                                                    <Col span={18}>
                                                        <Form.Item name={res?.key} initialValue={res?.value}>
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Button type="primary" onClick={() => getValueByApi(res?.api, index)} ghost>获取</Button>
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                        </Card>
                                    </Col>
                                    :
                                    <Form.Item label={res?.key} key={index} name={res?.key} initialValue={res?.value}>
                                        <Input />
                                    </Form.Item>
                            })
                        }
                    </Row>
                    <Form.Item label="完成/退回说明" name="description" labelCol={{ span: 3 }}>
                        <Input.TextArea maxLength={800} />
                    </Form.Item>
                </Form>
                <OperationRecord title="操作信息" serviceId={rowId} serviceName="tower-wo" />
            </Col>
            <Col span={5}>
                <DetailTitle title="工单信息" key={0} />
                {
                    data?.workOrderNodeVOList?.map((res: any, index: number) => {
                        return <Card title={res?.node} key={index}>
                            {
                                res?.workOrderNodeUserVOList?.map((item: any, ind: number) => {
                                    return <Card title={item?.recipientUserName} key={ind}>
                                        {
                                            item?.workOrderCustomDetailsVOList?.map((field: any, i: number) => {
                                                return <Row gutter={12} key={i} justify="space-around">
                                                    <Col span={8}>
                                                        {field?.fieldKey}
                                                    </Col>
                                                    <Col span={16}>
                                                        {field?.fieldValue}
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

