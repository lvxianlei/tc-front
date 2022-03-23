import React, { useImperativeHandle, forwardRef } from "react"
import { Spin, Form, Select, Input } from 'antd'
import { BaseInfo } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { IShipping } from "./ShippingDepartmentConfig"

interface EditProps {
    type: "new" | "edit",
    detailedData: IShipping
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ type, detailedData }: EditProps, ref) {

    const [baseForm] = Form.useForm();

    const { data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            baseForm.setFieldsValue({
                ...detailedData,
                leaderId: detailedData.leaderId + ',' + detailedData.leaderName
            })
            resole(detailedData)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [detailedData] })

    const { loading, data: userList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === 'new' ? 'post' : 'put'](`/tower-production/packageStorage`, { ...postData, id: detailedData.id })

            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields();
            await saveRun({
                ...baseData,
                leaderId: baseData.leaderId.split(',')[0],
                leaderName: baseData.leaderId.split(',')[1]
            })
            resolve(true);
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
            "dataIndex": "name",
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
            "dataIndex": "leaderId",
            "type": "select"
        },
        {
            "title": "备注",
            "dataIndex": "description",
            "type": "string"
        }
    ]

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <BaseInfo form={baseForm} columns={baseColumns.map((item: any) => {
            if (item.dataIndex === "leaderId") {
                return ({
                    ...item, type: 'select',
                    render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name="leaderId" style={{ width: '100%' }}>
                            <Select
                                placeholder="请选择"
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch>
                                {userList?.map((item: any) => {
                                    return <Select.Option key={item.name} value={item.userId + ',' + item.name}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    )
                })
            }
            if (item.dataIndex === "description") {
                return ({
                    ...item, type: 'string',
                    render: (_: any): React.ReactNode => (
                        <Form.Item name="description" style={{ width: '100%' }}>
                            <Input.TextArea maxLength={300} placeholder="请输入备注" showCount />
                        </Form.Item>
                    )
                })
            }
            return item
        })} col={1} dataSource={{}} edit />
    </Spin>
})