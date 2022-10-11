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

}

interface ICoefficient {
    readonly id?: string;
    readonly rate?: string;
    readonly rateName?: string;
    readonly rateType?: string;
}

export default forwardRef(function CoefficientPerformance({ }: modalProps, ref) {


    const { loading, data } = useRequest<ICoefficient>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: ICoefficient = await RequestUtil.get<ICoefficient>(`/tower-science/performance/config`);
        form.setFieldsValue({ ...result });
        resole(result);
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
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }}>
            <DetailTitle title="奖惩系数" key={0} />
            <Form.Item
                name={'userPenaltyRatio'}
                label={'放样员扣惩系数'}
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
                name={'leaderPenaltyRatio'}
                label={'负责人扣惩系数'}
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
                name={'checkPenaltyRatio'}
                label={'校核员扣惩系数'}
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
                name={'serious'}
                label={'严重'}
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
                name={'commonly'}
                label={'一般'}
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

