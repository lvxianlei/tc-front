/**
 * 新增纸质单号
 */
 import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
 import { Form, Spin } from 'antd';
 import { BaseInfo,  Attachment, AttachmentRef } from '../../common';
 import useRequest from '@ahooksjs/use-request'
 import RequestUtil from '../../../utils/RequestUtil';

 interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    requiredReturnTime?: string
}
 
 export default forwardRef(function PaperOrderModal({id}: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();

    // 表单
    const colunm = [
        {
            title: "纸质单号",
            dataIndex: "paperNumber",
            type: "text",
            rules: [{
                required: true,
                message: "请输入纸质单号"
            }]
        }
    ]
    const resetFields = () => {
        addCollectionForm.resetFields();
    }

    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.put(postData.path, postData.data)
            resolve(result);
            addCollectionForm.resetFields();
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            await run({path: "/tower-storage/receiveStock/updatePaperNumber", data: { ...baseData, id}})
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])
    return (
        <Spin spinning={loading}>
            <BaseInfo
                classStyle={"overall-form-class-padding0 height34"}
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 1 }
                edit
                columns={ colunm}
             />
        </Spin>
    )
 })