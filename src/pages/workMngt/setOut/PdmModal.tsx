/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 PDM同步
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Spin, Form, Descriptions, InputNumber, Checkbox } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';

interface PdmModalProps {
    id: string;
}

export default forwardRef(function PdmModal({ id }: PdmModalProps, ref) {
    const [form] = Form.useForm();

    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
        try {
            //  const result: [] = await RequestUtil.get(``);
            resole([])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })


    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(``);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            await saveRun({

            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent>
            <Form form={form} className={styles.descripForm}>
                <Descriptions title="" bordered size="small" colon={false} column={1}>
                    <Descriptions.Item key={1} label="塔型">
                        JC301508
                    </Descriptions.Item>
                    {
                        [[{ A: 1 }]]?.map((items: any, index: number) => {
                            return (
                                <Descriptions.Item key={index + '_' + id} label={<Form.Item name="check" valuePropName="checked"><Checkbox value={1} onChange={(e) => { console.log(e.target.checked) }}>段号</Checkbox></Form.Item>}>
                                    1
                                </Descriptions.Item>
                            )
                        })
                    }
                </Descriptions>
            </Form>
        </DetailContent>
    </Spin>
})

