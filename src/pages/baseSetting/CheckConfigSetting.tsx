/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-审核配置 - 编辑
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { DetailContent } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import SelectUser from "../common/SelectUser";

interface modalProps {
    readonly record?: any;
}

export default forwardRef(function CheckConfigSetting({ record }: modalProps, ref) {
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            form.setFieldsValue({
                ...record,
                towerStructureIds: record?.towerStructureIds ? record?.towerStructureIds.split('、') : [],
                voltageGradeIds: record?.voltageGradeIds ? record?.voltageGradeIds.split('、') : [],
                areaNames: record?.areaNames === '不限' ? [] : record?.areaNames.split('、'),
                segmentModeIds: record?.segmentModeIds ? record?.segmentModeIds.split('、') : [],
                weldingTypes: record?.weldingTypes ? record?.weldingTypes.split('、') : [],
                number: record?.number === '不限' ? '' : record?.number
            })
            resole(true);
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [record] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/trial/save`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await saveRun({
                ...value,
                id: record?.id || '',
                towerStructureIds: value?.towerStructureIds && value?.towerStructureIds.join('、'),
                voltageGradeIds: value?.voltageGradeIds && value?.voltageGradeIds.join('、'),
                areaNames: value?.areaNames && value?.areaNames.join('、'),
                segmentModeIds: value?.segmentModeIds && value?.segmentModeIds.join('、'),
                weldingTypes: value?.weldingTypes && value?.weldingTypes.join('、')
            })
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

    return <DetailContent key='CheckConfigSetting'>
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }}>
            <Form.Item name={'country'} label="审批类型" rules={[{ required: true, message: '请选择审批类型' }]}>
                <Select style={{ width: '100%' }} >
                    <Select.Option key={1} value="会签">会签</Select.Option>
                    <Select.Option key={2} value="一次审批">一次审批</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name={'country'} label="审批人1" rules={[{ required: true, message: '请选择审批人1' }]}>
                <Input value={1} suffix={
                    <SelectUser key={1} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人2" rules={[{ required: true, message: '请选择审批人2' }]}>
                <Input value={2} suffix={
                    <SelectUser key={2} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人3" rules={[{ required: true, message: '请选择审批人3' }]}>
                <Input value={3} suffix={
                    <SelectUser key={3} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人4" rules={[{ required: true, message: '请选择审批人4' }]}>
                <Input value={4} suffix={
                    <SelectUser key={4} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人5" rules={[{ required: true, message: '请选择审批人5' }]}>
                <Input value={5} suffix={
                    <SelectUser key={5} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人6" rules={[{ required: true, message: '请选择审批人6' }]}>
                <Input value={6} suffix={
                    <SelectUser key={6} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人7" rules={[{ required: true, message: '请选择审批人7' }]}>
                <Input value={7} suffix={
                    <SelectUser key={7} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人8" rules={[{ required: true, message: '请选择审批人8' }]}>
                <Input value={8} suffix={
                    <SelectUser key={8} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
            <Form.Item name={'country'} label="审批人9" rules={[{ required: true, message: '请选择审批人9' }]}>
                <Input value={9} suffix={
                    <SelectUser key={9} onSelect={(selectedRows: Record<string, any>) => {
                        console.log(selectedRows)
                        // const list = form.getFieldsValue(true).list;
                        // list[index] = {
                        //     ...list[index],
                        //     a: selectedRows[0]?.userId
                        // }
                        // form.setFieldsValue({
                        //     list: [...list]
                        // })
                    }} />
                } />
            </Form.Item>
        </Form>
    </DetailContent>
})

