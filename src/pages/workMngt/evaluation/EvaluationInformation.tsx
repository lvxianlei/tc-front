/**
 * @author zyc
 * @copyright © 2023
 * @description 放样过程管理-评估列表-评估信息
 * */

import React, { useImperativeHandle, forwardRef, useRef } from "react";
import { Spin, Form, Input } from 'antd';
import { Attachment, AttachmentRef } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Evaluation.module.less';

interface AllocationProps {
    getLoading: (loading: boolean) => void;
    id: string;
}

export default forwardRef(function EvaluationInformation({ getLoading, id }: AllocationProps, ref) {
    const [form] = Form.useForm();
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/assessTask/infoDetail/${id}`);
            form?.setFieldsValue({
                description: result?.assessInfo
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [getLoading] })

    const { run: submitRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            RequestUtil.post(`/tower-science/assessTask/infoSubmit`, postData).then(res => {
                resole(true)
                getLoading(false)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            getLoading(true)
            await submitRun({
                assessInfo: form?.getFieldsValue(true)?.description,
                id: id,
                fileIdList: attchsRef.current.getDataSource().map(res => { return res.id })
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            if (form) {
                form?.validateFields().then(res => {
                    RequestUtil.post(`/tower-science/assessTask/infoSave`, postData).then(res => {
                        resole(true)
                        getLoading(false)
                    }).catch(e => {
                        getLoading(false)
                        reject(e)
                    })
                }).catch(e => {
                    getLoading(false)
                })
            }

        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            getLoading(true)
            await saveRun({
                assessInfo: form?.getFieldsValue(true)?.description,
                id: id,
                fileIdList: attchsRef.current.getDataSource().map(res => { return res.id })
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })
    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSave, onSubmit, resetFields }), [ref, onSave, onSubmit, resetFields]);
    return <Spin spinning={loading}>
        <Form form={form}>
            <Attachment title="说明文件" dataSource={data?.instructionFileVOList} />
            <p className={styles.topPadding}>评估信息<span style={{ color: 'red' }}>*</span></p>
            <Form.Item
                name="description"
                rules={[{ required: true, message: '请输入评估信息' }]}
            >
                <Input.TextArea placeholder="请输入" maxLength={300} disabled={data?.status === 4} showCount />
            </Form.Item>
            <Attachment title="评估文件" ref={attchsRef} edit={!(data?.status === 4)} dataSource={data?.assessFileVOList} />
        </Form>
    </Spin>
})

