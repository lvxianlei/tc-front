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
            name: ""
        })
    }


    // 新增保存
    const { loading, run } = useRequest((postData: { path: string, data: {}, type: number }) => new Promise(async (resolve, reject) => {
        try {
            const result = postData.type === 1 ? await RequestUtil.post(postData.path, postData.data)
                : await RequestUtil.put(postData.path, postData.data);
            resolve(result);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            // console.log(addCollectionForm., "==========>>>")
            const baseData = await addCollectionForm.validateFields();
            baseData.roleIds = baseData?.roleIds?.join(',')
            await run({ path: "/sinzetech-user/user", data: { ...baseData, id, password: "123456" }, type: 2 })
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
                    name="name"
                    className='taxRate'
                    rules={[{ required: true, message: '请输入材料税率' }]}
                >
                    <Input placeholder="请输入材料税率" maxLength={30} addonAfter={<span>%</span>}/>
                </Form.Item>

            </Form>
        </Spin>
    )
})