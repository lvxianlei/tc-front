/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-提料列表-塔型信息-提料-段明细复制
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Input, Descriptions, Radio, RadioChangeEvent } from 'antd';
import { DetailContent } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Pick.module.less';

interface ApplyPackingProps {
    id: string;
}

export interface EditProps {
    onSubmit: () => void
}

export default forwardRef(function PeriodCopy({ id }: ApplyPackingProps, ref) {
    const [value, setValue] = useState(1);
    const [form] = Form.useForm();

    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        try {
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/packageStructure/copy`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const data = form.getFieldsValue(true);
            await saveRun(data)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent className={styles.copy}>
            <Form form={form} >
                <Descriptions bordered labelStyle={{ width: "40%" }} column={1}>
                    <Descriptions.Item label="从段名">
                        <Form.Item name="q">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复制到段名">
                        <Form.Item name="b">
                            <Input placeholder="请输入" maxLength={100} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复制类型">
                        <Form.Item name="c">
                            <Radio.Group onChange={onChange} value={value}>
                                <Radio value={1}>覆盖</Radio>
                                <Radio value={2}>追加</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
        </DetailContent>
    </Spin >
})

