/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-螺栓列表-指派
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Form, Input } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import SelectUser from "../../common/SelectUser";

export interface EditProps {
    onSubmit: () => void
}

interface QuotaEntriesProps {
    readonly id: string;
    readonly type: 'single' | 'batch';
}

export default forwardRef(function Assigned({ id, type }: QuotaEntriesProps, ref) {
    const [form] = Form.useForm();

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            await RequestUtil.post(`/tower-science/boltRecord/assign/list`, postData).then(res => {
                resole(true)
            }).catch(e => {
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const data = form.getFieldsValue(true);
            form.validateFields().then(async res => {
                await saveRun({
                    ...data,
                    ids: type === 'single' ? [id] : id.split(',')
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

    return <>
        <Form form={form}>
            <Form.Item name="boltOperatorName" label="作业员：" rules={[{ required: true, message: "请选择人员" }]}>
                <Input size='small' disabled suffix={
                    <SelectUser selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                        const list = selectedRows.map((res: any) => { return res?.userId })
                        const nameList = selectedRows.map((res: any) => { return res?.name })
                        form.setFieldsValue({
                            boltOperator: list?.join(","),
                            boltOperatorName: nameList?.join(",")
                        })
                    }} />
                } />
            </Form.Item>
            <Form.Item name="boltCheckerName" label="螺栓校核" rules={[{ required: true, message: "请选择人员" }]}>
                <Input size='small' disabled suffix={
                    <SelectUser selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                        const list = selectedRows.map((res: any) => { return res?.userId })
                        const nameList = selectedRows.map((res: any) => { return res?.name })
                        form.setFieldsValue({
                            boltChecker: list?.join(","),
                            boltCheckerName: nameList?.join(",")
                        })
                    }} />
                } />
            </Form.Item>
        </Form>
    </>
})