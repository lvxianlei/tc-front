/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-人工创建工单/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, InputNumber, Select, Space } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Management.module.less'

interface modalProps {
    type: 'new' | 'edit';
    rowId: string;
}

export default forwardRef(function WorkOrderNew({ type, rowId }: modalProps, ref) {
    const [form] = Form.useForm();
    const [customForm] = Form.useForm();
    const [upstreamNodes, setUpstreamNode] = useState<any[]>([]);
    const [dealList, setDealList] = useState<any[]>([]);
    const [customList, setCustomList] = useState<any[]>([]);

    const { data: templateList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(``);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const columns = [
        {
            key: 'hierarchy',
            title: '层级',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'model',
            title: '模式',
            dataIndex: 'model',
            width: 100
        },
        {
            key: 'upstreamNode',
            title: '上游节点',
            dataIndex: 'upstreamNode',
            width: 100
        },
        {
            key: 'agingType',
            title: '时效类型',
            dataIndex: 'agingType',
            width: 100
        },
        {
            key: 'aging',
            title: '时效',
            dataIndex: 'aging',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['node', index, '']} rules={[{
                    required: true,
                    message: '请输入时效要求'
                }]}>
                    <InputNumber size="small" placeholder="请输入时效要求" style={{ width: '100%' }} min={1} max={99} precision={0} />
                </Form.Item>
            )
        },
        {
            key: 'handleName',
            title: '处理名称',
            dataIndex: 'handleName',
            width: 100
        },
        {
            key: 'jobs',
            title: '岗位',
            dataIndex: 'jobs',
            width: 100
        },
        {
            key: 'color',
            title: '颜色',
            dataIndex: 'color',
            width: 100,
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Space>
                    <div className={styles.color_set_show} style={{ backgroundColor: _ }}></div>
                    <div>{_}</div>
                </Space>
            )
        }
    ]

    const customColumns = [
        {
            key: 'index',
            title: '排序',
            dataIndex: 'index'
        },
        {
            key: 'name',
            title: '字段名称',
            dataIndex: 'name'
        },
        {
            key: 'is',
            title: '是否必填',
            dataIndex: 'is'
        },
        {
            key: 'node',
            title: '所属节点',
            dataIndex: 'node'
        }
    ]

    const { data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
        form.setFieldsValue({ ...result, node: [{ color: '#FFFFFF' }] });
        setDealList([{ id: 111, color: '#FFFFFF' }])
        resole(result);
    }), { manual: type === 'new', refreshDeps: [rowId, type] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/performance/config`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(res => {
                customForm.validateFields().then(res => {
                    const value = form.getFieldsValue(true);
                    const customValue = customForm.getFieldsValue(true);
                    console.log(value, customValue)
                    //  await saveRun(value)
                    resolve(true);

                })
            })
        } catch (error) {
            reject(false)
        }
    })

    const templateChange = async (e: any) => {
        console.log(e)
        const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
        setCustomList([]);
        setDealList([]);
        
    }

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <DetailContent key='WorkOrderTemplateNew' className={styles.workOrderTemplateNew}>
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} labelAlign="right">
            <Form.Item
                name={'userPenaltyRatio'}
                label={'工单标题'}
                rules={[
                    {
                        required: true,
                        message: `请输入工单标题`
                    }
                ]}>
                <Input maxLength={20} />
            </Form.Item>

            <Form.Item
                name={'userPenaltyRatio'}
                label={'工单模板'}
                rules={[
                    {
                        required: true,
                        message: `请选择工单模板`
                    }
                ]}>
                <Select placeholder={'请选择工单模板'} onChange={(e: any) => templateChange(e)}>
                    {
                        templateList?.map((res: any, ind: number) => {
                            return <Select.Option value={res?.hierarchy} key={ind}>{res?.hierarchy}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            <CommonTable
                className={styles.table}
                bordered={false}
                showHeader={false}
                columns={columns}
                dataSource={dealList || []}
                scroll={{ x: 800 }}
                pagination={false}
            />

        </Form>
        <DetailTitle title="自定义项" key={0} />
        <CommonTable
            columns={customColumns}
            dataSource={customList}
            pagination={false}
        />
    </DetailContent>
})

