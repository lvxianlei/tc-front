/**
 * 编辑税率
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Spin, Input, InputNumber } from 'antd';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import "./index.less"

interface EditRefProps {
    id?: string
    onSubmit?: () => void
    resetFields?: () => void
}

export default forwardRef(function AddTaxRateModal({ id }: EditRefProps, ref) {
    const [addCollectionForm] = Form.useForm();

    const resetFields = () => {
        addCollectionForm.setFieldsValue({
            taxVal: ""
        })
    }

    const handleChange = (e: any) => {
        let v = new RegExp(`^(\\-)*(\\d+)\.(\\d{${2}}).*$`);
        let arg = e.target.value;
        arg = arg.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        arg = arg.replace(/^\./g, ""); // 验证第一个字符是数字而不是
        arg = arg.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
        arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        arg = arg.replace(v, '$1$2.$3');
        if (arg * 1 >= 100) {
            arg = 100
        }
        addCollectionForm.setFieldsValue({
            taxVal: arg
        })
    }

    // 新增保存
    const { loading, run } = useRequest((data) => new Promise(async (resolve, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-storage/tax`, data)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            await run({
                taxVal: baseData.taxVal,
                id
            })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit]);

    return (
        <Spin spinning={loading}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                onFinish={onSubmit}
                onFinishFailed={resetFields}
                autoComplete="off"
                form={addCollectionForm}
            >

                <Form.Item
                    label="材料税率"
                    name="taxVal"
                    className='taxRate'
                    rules={[{ required: true, message: '请输入材料税率' }]}
                >
                    <Input placeholder="请输入材料税率" onChange={(e) => handleChange(e)} maxLength={30} addonAfter={<span>%</span>}/>
                </Form.Item>

            </Form>
        </Spin>
    )
})