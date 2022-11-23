/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-提料列表-塔型信息-提料-段明细复制
 */

import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
import { Spin, Form, Input, Descriptions, Radio, RadioChangeEvent, Select, Divider, Space, Button } from 'antd';
import { DetailContent } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Pick.module.less';
import { PlusOutlined } from '@ant-design/icons';

interface ApplyPackingProps {
    id: string;
}

export interface EditProps {
    onSubmit: () => void
}

export default forwardRef(function PeriodCopy({ id }: ApplyPackingProps, ref) {
    const [form] = Form.useForm();
    const [items, setItems] = useState<any>();
    const inputRef = useRef<any>(null);
    const [name, setName] = useState('');

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/drawProductSegment?productCategory=${id}`);
            setItems(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/drawProductSegment/copy/segment`, postData);
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

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        items.findIndex((value: any) => value.segmentName === name) === -1 ? setItems([...items, { segmentName: name }]) : setItems([...items])
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent className={styles.copy}>
            <Form form={form} >
                <Descriptions bordered labelStyle={{ width: "40%" }} column={1}>
                    <Descriptions.Item label="从段名">
                        <Form.Item name="segmentName">
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                {data && data?.map((item: any) => {
                                    return <Select.Option key={item.segmentName} value={item.segmentName}>{item.segmentName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复制到段名">
                        <Form.Item name="segmentNameCopy">
                            <Select placeholder="请选择" style={{ width: '100%' }}
                                dropdownRender={menu => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder="请输入"
                                                ref={inputRef}
                                                value={name}
                                                onChange={onNameChange}
                                            />
                                            <Button disabled={name.length === 0} type="text" icon={<PlusOutlined />} onClick={addItem}>
                                                新增段名
                                            </Button>
                                        </Space>
                                    </>
                                )}>
                                {items && items?.map((item: any) => {
                                    return <Select.Option key={item.segmentName} value={item.segmentName}>{item.segmentName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复制类型">
                        <Form.Item name="copyType" initialValue={2}>
                            <Radio.Group>
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

