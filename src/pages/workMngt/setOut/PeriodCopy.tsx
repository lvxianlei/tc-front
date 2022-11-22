/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-工作目录-放样-段明细复制
 */

import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
import { Spin, Form, Input, Descriptions, Radio, RadioChangeEvent, Select, Divider, Space, Button } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './SetOut.module.less';
import { PlusOutlined } from '@ant-design/icons';

interface ApplyPackingProps {
    id: string;
    segmentId: string;
}

export interface EditProps {
    onSubmit: () => void
}

export default forwardRef(function PeriodCopy({ id, segmentId }: ApplyPackingProps, ref) {
    const [value, setValue] = useState(2);
    const [form] = Form.useForm();
    const [items, setItems] = useState<any>();
    const inputRef = useRef<any>(null);
    const [name, setName] = useState('');

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/productSegment?productCategoryId=${id}`);
            setItems(result)
            resole(result)
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
                        <Form.Item name="q">
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                {data && data?.map((item: any) => {
                                    return <Select.Option key={item.segmentName} value={item.segmentName}>{item.segmentName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复制到段名">
                        <Form.Item name="b">
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
                        <Form.Item name="c">
                            <Radio.Group onChange={onChange} value={value}>
                                <Radio value={1}>覆盖</Radio>
                                <Radio value={2}>追加</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
            <Divider style={{ margin: '8px 0' }} children={'覆盖：覆盖后，整段覆盖替换；追加：存在相同件号时，提醒，不允许复制。'} />
        </DetailContent>
    </Spin >
})

