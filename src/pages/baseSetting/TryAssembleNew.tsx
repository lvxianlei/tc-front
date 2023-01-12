/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-系统设置-试组装配置-新增试装条件/编辑
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { DetailContent } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { compoundTypeOptions, patternTypeOptions, productTypeOptions, towerStructureOptions, voltageGradeOptions } from "../../configuration/DictionaryOptions";

interface modalProps {
    readonly record?: any;
    readonly type?: 'new' | 'edit';
}

export default forwardRef(function TryAssembleNew({ record, type }: modalProps, ref) {
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
    }), { manual: type === "new", refreshDeps: [record, type] })

    const { data: regionList } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const resData: [] = await RequestUtil.get(`/tower-system/region/${'00'}`);
            resole(resData);
        } catch (error) {
            reject(error)
        }
    }), {})

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

    return <DetailContent key='TryAssembleNew'>
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }}>
            <Row>
                <Col span={7}>
                    <Form.Item name={'productType'} label="产品类型" rules={[{ required: true, message: '请选择产品类型' }]}>
                        <Select style={{ width: '100%' }} >
                            {
                                productTypeOptions?.map((item: any, index: number) =>
                                    <Select.Option value={item.id} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                    <Form.Item name={'areaNames'} label="地区">
                        <Select style={{ width: '100%' }} mode="multiple">
                            {
                                regionList?.map((item: any, index: number) =>
                                    <Select.Option value={item.name} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                    <Form.Item name={'towerStructureIds'} label="铁塔结构">
                        <Select style={{ width: '100%' }} mode="multiple">
                            {
                                towerStructureOptions?.map((item: any, index: number) =>
                                    <Select.Option value={item.id} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item name={'voltageGradeIds'} label="电压等级">
                        <Select style={{ width: '100%' }} mode="multiple" >
                            {
                                voltageGradeOptions?.map((item: any, index: number) =>
                                    <Select.Option value={item.id} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                    <Form.Item name={'number'} label="基数限制">
                        <InputNumber max={999999} min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={7} offset={1}>
                    <Form.Item name={'segmentModeIds'} label="段模式">
                        <Select style={{ width: '100%' }} mode="multiple">
                            {
                                patternTypeOptions?.map((item: any, index: number) =>
                                    <Select.Option value={item.id} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item name={'country'} label="国内国外" rules={[{ required: true, message: '请选择国内国外' }]}>
                        <Select style={{ width: '100%' }} >
                            <Select.Option key={0} value="不限">不限</Select.Option>
                            <Select.Option key={1} value="国内">国内</Select.Option>
                            <Select.Option key={2} value="国外">国外</Select.Option>
                        </Select>
                    </Form.Item></Col>

                <Col span={7} offset={1}>
                    <Form.Item name={'weldingTypes'} label="电焊类型">
                        <Select style={{ width: '100%' }} mode="multiple" >
                            {
                                compoundTypeOptions?.map((item: any, index: number) =>
                                    <Select.Option value={item.id} key={index}>
                                        {item.name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </DetailContent>
})

