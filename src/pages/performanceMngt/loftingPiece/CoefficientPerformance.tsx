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
        <DetailTitle title="奖惩系数" key={0} />
                                    <Form.Item
                                        name={'rate'}
                                        label={'放样员扣惩系数'}
                                        initialValue={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请选择放样员扣惩系数`
                                            }
                                        ]}>

                                        <Select placeholder="请选择" style={{ width: "150px" }}>
                                            <Select.Option value={0} key="0">0</Select.Option>
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
                                    <Form.Item
                                        name={'rate'}
                                        label={'负责人扣惩系数'}
                                        initialValue={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请选择负责人扣惩系数`
                                            }
                                        ]}>

                                        <Select placeholder="请选择" style={{ width: "150px" }}>
                                            <Select.Option value={0} key="0">0</Select.Option>
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
                                    <Form.Item
                                        name={'rate'}
                                        label={'校核员扣惩系数'}
                                        initialValue={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请选择校核员扣惩系数`
                                            }
                                        ]}>

                                        <Select placeholder="请选择" style={{ width: "150px" }}>
                                            <Select.Option value={0} key="0">0</Select.Option>
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
        <DetailTitle title="严重等级系数" key={1} />
                                    <Form.Item
                                        name={'rate'}
                                        label={'严重'}
                                        initialValue={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请选择严重`
                                            }
                                        ]}>

                                        <Select placeholder="请选择" style={{ width: "150px" }}>
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
                                    <Form.Item
                                        name={'rate'}
                                        label={'一般'}
                                        initialValue={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请选择一般`
                                            }
                                        ]}>

                                        <Select placeholder="请选择" style={{ width: "150px" }}>
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
        </Form>
    </DetailContent>
})

