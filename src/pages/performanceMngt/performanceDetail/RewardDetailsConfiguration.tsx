/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-绩效奖励明细-奖励明细配置
 */

import React, { forwardRef, useState } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './GenerationOfMaterial.module.less';
import { FixedType } from 'rc-table/lib/interface';
import { itemColumns, otherColumns } from './performanceDetail.json'
import SelectUser from "../../common/SelectUser";

export default forwardRef(function RewardDetailsConfiguration({ }, ref) {
    const [form] = Form.useForm();
    const [otherForm] = Form.useForm();
    const [detailData, setDetailData] = useState<any>([])
    const [otherData, setOtherData] = useState<any>([])
    const [visible, setVisible] = useState<boolean>(false)

    const { loading, data, run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/performance/reward/config`);
            setDetailData(result?.rewardConfigVOList || [])
            setOtherData(result?.otherConfigVOList || [])
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: types } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let resData: any[] = await RequestUtil.get(`/tower-science/config/fixItem`);
            const list: any[] = [];
            resData.forEach(res => {
                list.push(...res?.fixItemConfigList || [])
            })
            resole(list)
        } catch (error) {
            reject(error)
        }
    }), {})

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async res => {
                const values = await form.getFieldsValue(true);
                await saveRun({
                    id: values?.id,
                    amount: values?.amount
                })
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-science/performance/reward/config`, data).then(res => {
                message.success('编辑成功！');
                run();
                resove(true)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            otherForm.validateFields().then(async res => {
                const value = await otherForm.getFieldsValue(true);
                await submitRun({
                    id: value?.id,
                    parameter1: value?.parameter1
                })
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-science/performance/reward/config`, data).then(res => {
                message.success('编辑成功！');
                run();
                setVisible(false)
                resove(true)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return <DetailContent>
        <Modal visible={visible} onOk={onSubmit} title="编辑" onCancel={() => {
            otherForm?.resetFields();
            setVisible(false)
        }}>
            <Form form={otherForm}>
                {
                    otherForm?.getFieldsValue(true)?.entry === '返修单' ?
                        <Form.Item label="参数1" name="parameter1" rules={[{
                            required: true,
                            message: '请输入参数1！'
                        }]}>
                            <Select placeholder="请选择返修类型">
                                {
                                    types && types?.map((item: any, index: number) =>
                                        <Select.Option value={item.id} key={index}>
                                            {item.fixType}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                        :
                        <Form.Item label="参数1" name="parameterName1" rules={[{
                            required: true,
                            message: '请输入参数1！'
                        }]}>
                            <Input size="small" disabled suffix={
                                <SelectUser
                                    key={'parameter1'}
                                    selectType="checkbox"
                                    selectedKey={otherForm?.getFieldsValue(true)?.parameter1?.split(',')}
                                    onSelect={(selectedRows: Record<string, any>) => {
                                        const list = selectedRows.map((res: any) => { return res?.userId })
                                        const nameList = selectedRows.map((res: any) => { return res?.name })
                                        otherForm.setFieldsValue({
                                            parameter1: list?.join(","),
                                            parameterName1: nameList?.join(","),
                                        })
                                    }} />
                            } />
                        </Form.Item>
                }
            </Form>
        </Modal>
        <CommonTable
            haveIndex
            dataSource={detailData}
            columns={[
                ...itemColumns,
                {
                    "key": "status",
                    "title": "状态",
                    "dataIndex": "status",
                    "width": 120,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type="link" onClick={() => {
                            RequestUtil.post(`/tower-science/performance/reward/config`, {
                                id: record?.id,
                                status: record?.status === 1 ? 0 : 1
                            }).then(res => {
                                message.success('状态变更成功！');
                                run();
                            })
                        }}>{record?.status === 1 ? '启用' : '停用'}</Button>
                    )
                },
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 80,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type="link" onClick={() => {
                            form.setFieldsValue({
                                ...record
                            })
                            Modal.confirm({
                                title: '编辑',
                                content: <Form form={form}>
                                    <Form.Item label="奖励金额" name="amount" rules={[{
                                        required: true,
                                        message: '请输入奖励金额！'
                                    }]}>
                                        <InputNumber style={{ width: '100%' }} max={9999.99} />
                                    </Form.Item>
                                </Form>,
                                onOk: onSave,
                                onCancel: () => {
                                    form.resetFields();
                                }
                            })
                        }}>编辑</Button>
                    )
                }
            ]}
            pagination={false}
        />
        <DetailTitle title={"其他配置"} />
        <CommonTable
            haveIndex
            dataSource={otherData}
            columns={[
                ...otherColumns,
                {
                    "key": "status",
                    "title": "状态",
                    "dataIndex": "status",
                    "width": 120,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type="link" onClick={() => {
                            RequestUtil.post(`/tower-science/performance/reward/config`, {
                                id: record?.id,
                                status: record?.status === 1 ? 0 : 1
                            }).then(res => {
                                message.success('状态变更成功！');
                                run();
                            })
                        }}>{record?.status === 1 ? '启用' : '停用'}</Button>
                    )
                },
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 80,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type="link" onClick={() => {
                            otherForm.setFieldsValue({
                                ...record
                            })
                            setVisible(true)
                        }}>编辑</Button>
                    )
                }
            ]} />
    </DetailContent>
})