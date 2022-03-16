import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select, InputNumber, Popconfirm, Space, Button, TimePicker, Table, message } from 'antd'
import { DetailTitle, BaseInfo } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './WorkCenterMngt.module.less';
import { FixedType } from 'rc-table/lib/interface';
import { materialTextureOptions } from "../../configuration/DictionaryOptions";
import moment from "moment"

interface EditProps {
    type: "new" | "edit",
    id: string
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {

    const [baseForm] = Form.useForm();
    const [form] = Form.useForm();

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/work/center/info/${id}`)
            baseForm.setFieldsValue({
                ...result,
                time: [moment(result.workStartTime, 'HH:mm'), moment(result.workEndTime, 'HH:mm')],
                equipmentId: result?.equipmentId && result?.equipmentId.split(',')
            })
            form.setFieldsValue({ workCenterRelations: [...result?.workCenterRelations] });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { data: userList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-aps/work/center/info`, { ...postData, id: data?.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields();
            if (form.getFieldsValue(true).workCenterRelations && form.getFieldsValue(true).workCenterRelations.length > 0) {
                const data = await form.validateFields();
                await saveRun({
                    ...baseData,
                    workStartTime: baseData.time[0].format('HH:mm'),
                    workEndTime: baseData.time[1].format('HH:mm'),
                    workCenterRelations: [...data?.workCenterRelations],
                    equipmentId: baseData.equipmentId.join(',')
                })
                resolve(true);
            } else {
                message.warning("请添加产能矩阵");
                reject(false);
            }
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        baseForm.resetFields();
    }

    const baseColumns = [
        {
            "title": "成品库名称",
            "dataIndex": "workCenterName",
            "type": "string",
            "rules": [
                {
                    "required": true,
                    "message": "请输入成品库名称"
                },
                {
                    "pattern": /^[^\s]*$/,
                    "message": '禁止输入空格',
                }
            ]
        },
        {
            "title": "负责人",
            "dataIndex": "userId",
            "type": "select",
            "rules": [
                {
                    "required": true,
                    "message": "请选择关联设备"
                }
            ]
        },
        {
            "title": "备注",
            "dataIndex": "",
            "type": "string"
        }
    ]

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <BaseInfo form={baseForm} columns={baseColumns.map((item: any) => {
            if (item.dataIndex === "userId") {
                return ({
                    ...item, type: 'select',
                    render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name="userId" style={{ width: '100%' }}>
                            <Select mode="multiple"
    showSearch>
                                {userList?.map((item: any) => {
                                    return <Select.Option key={item.name} value={item.id}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    )
                })
            }
            return item
        })} col={2} dataSource={{}} edit />
    </Spin>
})