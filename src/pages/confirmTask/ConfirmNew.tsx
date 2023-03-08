/**
 * @author zyc
 * @copyright © 2023
 * @description 任务管理-确认任务-编辑/创建
 */

import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, Input, DatePicker } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, DetailTitle, Attachment, AttachmentRef } from '../common';
import { EditInfoData, AssignInfoData } from './confirmTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import SelectUser from '../common/SelectUser';
import moment from 'moment';

export default function ConfirmNew(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const [userForm] = Form.useForm();
    const params = useParams<{ id: string }>();
    const attachRef = useRef<AttachmentRef>()
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getDrawTaskById?drawTaskId=${params.id}`)
        form?.setFieldsValue({ ...data });
        userForm?.setFieldsValue({
            assignorId: data?.assignorId,
            assignorName: data?.assignorName,
            plannedDeliveryTime: data?.plannedDeliveryTime && moment(data?.plannedDeliveryTime)
        })
        resole(data)
    }), { manual: !(params?.id) })


    const { data: contractNums } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-market/contract?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const detailData: any = data;

    const save = () => {
        setConfirmLoading(true)
        form?.validateFields().then(res => {
            userForm?.validateFields().then(item => {
                const baseData = form?.getFieldsValue(true)
                const formData = userForm?.getFieldsValue(true)
                RequestUtil.post<any>(`/tower-science/drawTask/saveAndSubmit`, {
                    ...baseData,
                    ...formData,
                    plannedDeliveryTime: formData?.plannedDeliveryTime?.format('YYYY-MM-DD HH:mm:ss'),
                    fileIds: attachRef.current?.getDataSource().map(item => item.id),
                    fileVOList: attachRef.current?.getDataSource()
                }).then(res => {
                    setConfirmLoading(false)
                    history?.goBack();
                }).catch(e => {
                    setConfirmLoading(false)
                })
            })
        }).catch(e => {
            setConfirmLoading(false)
        })
    }

    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    <Button type='primary' loading={confirmLoading} onClick={save} ghost>保存并创建</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={EditInfoData?.map(res => {
                    if (res.dataIndex === "contractId") {
                        return {
                            ...res,
                            type: 'select',
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Form.Item name="contractId">
                                    <Select
                                        filterOption={(input, option) =>
                                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                                        }
                                        allowClear
                                        onChange={(value: string, option: any) => {
                                            const data = JSON.parse(option?.key)
                                            form?.setFieldsValue({
                                                contractId: data?.id,
                                                contractName: data?.contractName,
                                                contractNum: data?.internalNumber,
                                                businessOwner: data?.customerCompany
                                            })
                                        }}>
                                        {contractNums?.map((item: any) => {
                                            return <Select.Option key={JSON.stringify(item)} value={item.id}>{item.contractNumber}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            )
                        }
                    }
                    if (res.dataIndex === "contractName") {
                        return {
                            ...res,
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Form.Item name="contractName">
                                    <Input disabled />
                                </Form.Item>
                            )
                        }
                    }
                    if (res.dataIndex === "businessOwner") {
                        return {
                            ...res,
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Form.Item name="businessOwner">
                                    <Input disabled />
                                </Form.Item>
                            )
                        }
                    }
                    if (res.dataIndex === "aeName") {
                        return {
                            ...res,
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Form.Item name="aeName">
                                    <Input size="small" disabled suffix={
                                        <SelectUser
                                            key={'aeName'}
                                            selectedKey={[form?.getFieldsValue(true)?.aeId]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    aeId: selectedRows[0]?.userId,
                                                    aeName: selectedRows[0]?.name,
                                                    aePhone: selectedRows[0]?.phone
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            )
                        }
                    }
                    return res
                })} form={form} col={2} edit dataSource={{}} />
                <DetailTitle title="指派信息" />
                <BaseInfo columns={AssignInfoData?.map(res => {
                    if (res.dataIndex === "assignorId") {
                        return {
                            ...res,
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Form.Item name="assignorName">
                                    <Input size="small" disabled suffix={
                                        <SelectUser
                                            key={'assignorId'}
                                            selectedKey={[form?.getFieldsValue(true)?.assignorId]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                userForm.setFieldsValue({
                                                    assignorId: selectedRows[0]?.userId,
                                                    assignorName: selectedRows[0]?.name
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            )
                        }
                    }
                    if (res.dataIndex === "plannedDeliveryTime") {
                        return {
                            ...res,
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Form.Item name="plannedDeliveryTime">
                                    <DatePicker showTime style={{ width: '100%' }} />
                                </Form.Item>
                            )
                        }
                    }
                    return res
                })} form={userForm} col={2} edit dataSource={{}} />
                <Attachment
                    ref={attachRef}
                    dataSource={detailData?.fileVOList || []}
                    edit
                    multiple
                    maxCount={5}
                />
            </DetailContent>
        </Spin>
    </>
}