/**
 * 填写保函信息
 */
 import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
 import { Form, Spin } from 'antd';
 import { BaseInfo,  Attachment, AttachmentRef } from '../common';
 import useRequest from '@ahooksjs/use-request'
 import RequestUtil from '../../utils/RequestUtil';
 import { baseColums } from './applicationColunm.json';
 import { FileProps } from '../common/Attachment';
 import { EditProps } from './application';
 
 export default forwardRef(function FillGuaranteeInformation({id}: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const fillGuarantee = useRef<AttachmentRef>();
    
    // 关闭
    const resetFields = () => {
        addCollectionForm.resetFields();
        setAttachVosData([]);
    }

    // 提交
    const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.put(postData.path, postData.data)
            resolve(result);
            addCollectionForm.resetFields();
            setAttachVosData([]);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            const fileIds = [];
            if (attachVosData.length > 0) {
                for (let i = 0; i < attachVosData.length; i += 1) {
                    fileIds.push(attachVosData[i].id);
                }
            }
            await run({path: "/tower-finance/guarantee", data: {...baseData, fileIds, id}})
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])

    return (
        <Spin spinning={loading}>
            <BaseInfo
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 2 }
                edit
                columns={ baseColums}
             />
            <Attachment
                dataSource={ attachVosData }
                onDoneChange={
                    (attachs: FileProps[]) => {
                        setAttachVosData([
                            ...attachVosData,
                            ...attachs
                        ]);
                    }
                }
                ref={fillGuarantee}
                edit
            />
        </Spin>
    )
 })