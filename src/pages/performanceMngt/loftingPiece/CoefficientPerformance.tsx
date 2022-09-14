/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-放样计件-绩效配置
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Form, Select } from 'antd';
import { DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

interface modalProps {
    data?: ICoefficient[]
}

interface ICoefficient {
    readonly id?: string;
    readonly rate?: string;
    readonly rateName?: string;
    readonly rateType?: string;
}

export default forwardRef(function CoefficientPerformance({ data }: modalProps, ref) {
    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-tdm/performance/uploadPerformanceConfig`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await saveRun([
                ...value[0],
                ...value[1],
            ])
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    const [form] = Form.useForm();

    return <DetailContent key='CoefficientPerformance'>
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }}>
            {
                data?.map((items: any, index: number) => {
                    return <>
                        <DetailTitle title={items?.rateType} key={index} />
                        {
                            items?.performanceConfigDetailVOList?.map((res: ICoefficient, ind: number) => (
                                <>
                                    <Form.Item name={[index, ind, 'id']} style={{ display: 'none' }} initialValue={res?.id}></Form.Item>
                                    <Form.Item name={[index, ind, 'rateName']} style={{ display: 'none' }} initialValue={res?.rateName}></Form.Item>
                                    <Form.Item name={[index, ind, 'rateType']} style={{ display: 'none' }} initialValue={res?.rateType}></Form.Item>
                                    <Form.Item
                                        name={[index, ind, 'rate']}
                                        key={res.id}
                                        label={res.rateName}
                                        initialValue={res.rate}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请输入${res.rateName}`
                                            }
                                            // {
                                            //     required: true,
                                            //     validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                            //         if (res.rateType === '奖惩系数') {
                                            //             if (/^[0-9]{1}?(\.[0-9]{1,2})?$/.test(value)) {
                                            //                 callback()
                                            //             } else {
                                            //                 callback('仅可输入0-9')
                                            //             }
                                            //         } else {
                                            //             if (/^[1-9]{1}?(\.[0-9]{1,2})?$/.test(value)) {
                                            //                 callback()
                                            //             } else {
                                            //                 callback('仅可输入1-9')
                                            //             }
                                            //         }
                                            //     }
                                            // }
                                        ]}>

                                        <Select placeholder="请选择" style={{ width: "150px" }}>
                                            {
                                                res.rateType === '奖惩系数' ? <Select.Option value={0} key="0">0</Select.Option> : null
                                            }
                                            <Select.Option value={1} key="1">1</Select.Option>
                                            <Select.Option value={2} key="2">2</Select.Option>
                                            <Select.Option value={3} key="3">3</Select.Option>
                                            <Select.Option value={4} key="4">4</Select.Option>
                                            <Select.Option value={5} key="5">5</Select.Option>
                                            <Select.Option value={6} key="6">6</Select.Option>
                                            <Select.Option value={7} key="7">7</Select.Option>
                                            <Select.Option value={8} key="8">8</Select.Option>
                                            <Select.Option value={9} key="9">9</Select.Option>

                                        </Select>

                                    </Form.Item>
                                </>
                            ))
                        }
                    </>
                })
            }
        </Form>
    </DetailContent>
})

