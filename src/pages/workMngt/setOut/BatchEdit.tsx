/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-工作目录-批量编辑
*/

import React, { useImperativeHandle, forwardRef } from "react";
import { Spin, Form, Descriptions, InputNumber, Select, Input } from 'antd';
import { BaseInfo, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import { patternTypeOptions, towerStructureOptions } from "../../../configuration/DictionaryOptions";

interface BatchEditProps {
    datas: any[];
    optionalList: any;
    productType: string;
}

export default forwardRef(function BatchEdit({ datas, optionalList, productType }: BatchEditProps, ref) {
    const [form] = Form.useForm();

    const { loading, data: loftingQuota } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list?current=1&size=1000&category=1&productType=${productType}`);
        resole(result?.records || [])
    }), { refreshDeps: [datas, optionalList, productType] })

    const columns = [
        {
            "key": "segmentName",
            "title": "段信息",
            "dataIndex": "segmentName",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"segmentName"} initialValue={datas?.map(res => res?.segmentName)?.join(',')}>
                    <Input disabled />
                </Form.Item>
            )
        },
        {
            "key": "structureId",
            "title": "结构",
            "dataIndex": "structureId",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"structureId"}>
                    <Select style={{ width: '100%' }} placeholder="请选择结构" allowClear>
                        {
                            towerStructureOptions?.map((item: any, index: number) =>
                                <Select.Option value={item.id} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "pattern",
            "title": "段模式",
            "dataIndex": "pattern",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"pattern"}>
                    <Select style={{ width: '100%' }} placeholder="请选择段模式" allowClear>
                        {
                            patternTypeOptions?.map((item: any, index: number) =>
                                <Select.Option value={item.id} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "trialAssemble",
            "title": "试装",
            "dataIndex": "trialAssemble",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"trialAssemble"}>
                    <Select style={{ width: '100%' }} placeholder="请选择试装" allowClear>
                        <Select.Option value={1} key={1}>是</Select.Option>
                        <Select.Option value={0} key={0}>否</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "loftingUser",
            "title": "放样人",
            "dataIndex": "loftingUser",
            "rules": [{
                required: true,
                message: '请选择放样人'
            }],
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"loftingUser"}>
                    <Select style={{ width: '100%' }} placeholder="请选择放样人" mode='multiple'>
                        {
                            optionalList?.loftingUserList?.map((item: any, index: number) =>
                                <Select.Option value={item.userId} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "loftingMutualReview",
            "title": "放样互审",
            "dataIndex": "loftingMutualReview",
            "rules": [{
                required: true,
                message: '请选择放样互审'
            }],
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"loftingMutualReview"}>
                    <Select style={{ width: '100%' }} placeholder="请选择放样互审" mode='multiple'>
                        {
                            optionalList?.loftingMutualReviewList?.map((item: any, index: number) =>
                                <Select.Option value={item.userId} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "checkUser",
            "title": "校核人",
            "dataIndex": "checkUser",
            "rules": [{
                required: true,
                message: '请选择校核人'
            }],
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"checkUser"} >
                    <Select style={{ width: '100%' }} placeholder="请选择校核人" mode='multiple'>
                        {
                            optionalList?.programmingLeaderList?.map((item: any, index: number) =>
                                <Select.Option value={item.userId} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "isExternalModel",
            "title": "外来模型",
            "dataIndex": "isExternalModel",
            "rules": [{
                required: true,
                message: '请选择外来模型'
            }],
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"isExternalModel"} >
                    <Select style={{ width: '100%' }} placeholder="请选择外来模型">
                        <Select.Option value={'是'} key="1">是</Select.Option>
                        <Select.Option value={'否'} key="0">否</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "projectEntries",
            "title": "定额条目",
            "dataIndex": "projectEntries",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"projectEntries"} >
                    <Select style={{ width: '100%' }} placeholder="请选择定额条目">
                        {loftingQuota && loftingQuota?.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id}>{item.projectEntries}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "cadDrawingType",
            "title": "辅助设计出图类型",
            "dataIndex": "cadDrawingType",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"cadDrawingType"} >
                    <Select style={{ width: '100%' }} placeholder="请选择辅助设计出图类型" allowClear>
                        <Select.Option value="普通图纸" key="1">普通图纸</Select.Option>
                        <Select.Option value="核算重量图纸" key="0">核算重量图纸</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            "key": "drawPageNum",
            "title": "图纸页数",
            "dataIndex": "drawPageNum",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={"drawPageNum"}>
                    <InputNumber style={{ width: '100%' }} min={1} max={9999} />
                </Form.Item>
            )
        }
    ]


    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/productSegment/batch/submit`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form?.validateFields().then(async res => {
                const data = await form.getFieldsValue(true);
                console.log(data)
                await saveRun({
                    ...data,
                    segmentIds: datas?.map(res => res?.id),
                    checkUser: data?.checkUser?.join(','),
                    loftingMutualReview: data?.loftingMutualReview?.join(','),
                    loftingUser: data?.loftingUser?.join(',')
                })
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <BaseInfo columns={columns} form={form} col={4} edit dataSource={{}} />
    </Spin>
})

