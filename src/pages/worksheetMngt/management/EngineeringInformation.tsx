/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-处理
 */

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Card, Col, Form, Input, message, Row, Spin } from 'antd';
import { DetailContent, DetailTitle, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Management.module.less'

interface modalProps {
    rowId: string;
    rowData: Record<string, any>;
    detailData: Record<string, any>;
    getLoading: (loading: boolean) => void
}

export default forwardRef(function EngineeringInformation({ rowId, rowData, detailData, getLoading }: modalProps, ref) {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any[]>([]);

    const { loading, data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        setFields(detailData?.workOrderCustomVOList)
        resole(detailData);
    }), { refreshDeps: [rowId, rowData, detailData] })

    const { run: saveRun } = useRequest((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-work/workOrder/completeWorkOrderNode`, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
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
                let value = form.getFieldsValue(true)?.data
                value = value?.map((res: any) => {
                    const newRes = Object.entries(res)
                    return newRes.map((item: any) => {
                        return {
                            fieldKey: item[0],
                            fieldValue: item[1]
                        }
                    })[0]
                })
                getLoading(true)
                await saveRun({
                    workOrderId: data?.workOrderId,
                    description: form.getFieldsValue(true)?.description,
                    workOrderNode: data?.workOrderNode,
                    workOrderNodeUserCustomDTOList: value
                })
                resolve(true)
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
                getLoading(true)
                await backRun({
                    workOrderId: data?.workOrderId,
                    description: value?.description,
                    workOrderNode: data?.workOrderNode
                })
                resolve(true)
            } else {
                message.warning("请输入退回说明");
                reject(false)
            }

        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const getValueByApi = async (trigger: string, index: number) => {
        const values = form.getFieldsValue(true).data
        const value = Object.entries(values[index])[0]
        if (value[1]) {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-work/workOrder/trigger/${rowId}/${value[0]}/${value[1]}`)
            let newValues: any[] = values
            result.forEach((element: any) => {
                newValues?.forEach((res: any, ind: number) => {
                    if (element?.fieldKey === Object.keys(res)[0]) {
                        newValues[ind] = {
                            [element?.fieldKey]: element?.fieldValue
                        }
                    }
                })
            });
            newValues = newValues.map(res => {
                if (Object.keys(res)[0] === trigger) {
                    return { [trigger]: value[1] }
                } else {
                    return res
                }
            })
            form.setFieldsValue({
                data: [...newValues]
            })
            let newFields: any[] = fields
            result.forEach((element: any) => {
                newFields?.forEach((res: any, i: number) => {
                    if (element?.fieldKey === res?.fieldKey) {
                        newFields[i] = {
                            ...res,
                            fieldKey: res?.fieldKey,
                            fieldValue: element?.fieldValue
                        }
                    }
                })
            });
            newFields = newFields?.map(res => {
                if (res?.fieldKey === trigger) {
                    return {
                        ...res,
                        fieldKey: trigger,
                        fieldValue: value[1]
                    }
                } else {
                    return res
                }
            })
            setFields([
                ...newFields || [],
            ])
        } else {
            message.warning('请输入值！')
        }

    }

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, onBack, resetFields }), [ref, onSubmit, onBack, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent key='WorkOrderDetail' className={styles.WorkOrderDetail}>
            <Row gutter={12}>
                <Col span={19}>
                    <Form form={form} labelCol={{ span: 10 }}>
                        <Row gutter={24}>
                            {
                                [...fields || []]?.map((res: any, index: number) => {
                                    return res?.triggerField === 1 ?
                                        <Col span={8} key={index}>
                                            <Form.Item label={res?.fieldKey} >
                                                <Row gutter={12}>
                                                    <Col span={18}>
                                                        <Form.Item name={['data', index, res?.fieldKey]} rules={res?.required === 1 ? [{
                                                            required: true,
                                                            message: `请输入${res?.fieldKey}`
                                                        }] : []} initialValue={res?.fieldValue}>
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Button type="primary" onClick={() => getValueByApi(res?.fieldKey, index)} ghost>获取</Button>
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Col>
                                        :
                                        <Col span={8} key={index}>
                                            <Form.Item label={res?.fieldKey} key={index} rules={res?.required === 1 ? [{
                                                required: true,
                                                message: `请输入${res?.fieldKey}`
                                            }] : []} name={['data', index, res?.fieldKey]} initialValue={res?.fieldValue}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                })
                            }
                        </Row>
                        <Form.Item label="完成/退回说明" name="description" labelCol={{ span: 3 }}>
                            <Input.TextArea maxLength={800} />
                        </Form.Item>
                    </Form>
                    <OperationRecord title="操作信息" serviceId={rowId} serviceName="tower-work" />
                </Col>
                <Col span={5}>
                    <DetailTitle title="工单信息" key={0} />
                    <div className={styles.scroll}>
                        <Row gutter={12} key={0} style={{ marginBottom: '6px' }} justify="space-around">
                            <Col span={8}>
                                {rowData?.fieldKey}
                            </Col>
                            <Col span={16}>
                                {rowData?.fieldValue}
                            </Col>
                        </Row>
                        {
                            data?.workOrderNodeVOList?.map((res: any, index: number) => {
                                return <Card title={res?.node} extra={<span>处理标题：{res?.processingName}</span>} style={{ marginBottom: '6px' }} key={index}>
                                    {
                                        res?.workOrderNodeUserVOList?.map((item: any, ind: number) => {
                                            return <Card title={item?.recipientUserName} style={{ marginBottom: '6px' }} key={ind}>
                                                {
                                                    item?.workOrderCustomDetailsVOList?.map((field: any, i: number) => {
                                                        return <Row gutter={12} key={i} style={{ marginBottom: '6px' }} justify="space-around">
                                                            <Col span={8}>
                                                                {field?.fieldKey}
                                                            </Col>
                                                            <Col span={16}>
                                                                {field?.fieldValue || '-'}
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

                    </div>
                </Col>
            </Row>
        </DetailContent>
    </Spin>
})

