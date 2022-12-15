/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-提料指派
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select, DatePicker, Input, TreeSelect, Row, Col, Checkbox } from 'antd'
import { CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './MaterialTaskList.module.less';
import { TreeNode } from "antd/lib/tree-select";
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import moment from "moment"
import { IAssignedList } from "./IMaterialTask"
import SelectUser from "../common/SelectUser"

export interface EditProps {
    id: string;
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ id }: EditProps, ref) {
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<any>();

    const { loading, data } = useRequest<IAssignedList[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: IAssignedList[] = await RequestUtil.get<IAssignedList[]>(`/tower-science/materialProductCategory/list?taskIds=${id}`)
            let newResult = result.map((res: IAssignedList, index: number) => {
                return {
                    ...res,
                    materialDeliverTime: res.materialDeliverTime && moment(res.materialDeliverTime),
                    materialLeader: res.materialLeader ? res.materialLeader : index === 0 ? null : '0',
                    materialLeaderName: res.materialLeader ? res.materialLeaderName : index === 0 ? null : '同上',
                    priority: res.priority ? res.priority : index === 0 ? null : '0'
                }
            })
            form.setFieldsValue({ assignedList: [...newResult || []] });
            setDetailData(newResult);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/materialProductCategory`, [...postData])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            let baseData = await form.validateFields();
            const assignedList = form.getFieldsValue(true).assignedList;
            const value = assignedList.map((res: any, index: number) => {
                return {
                    ...res,
                    materialLeader: res.materialLeader === '0' ? assignedList[assignedList.findIndex((item: any) => item.materialLeader === '0') - 1].materialLeader : res.materialLeader,
                    priority: res.priority === '0' ? assignedList[assignedList.findIndex((item: any) => item.priority === '0') - 1].priority : res.priority,
                    materialDeliverTime: res.materialDeliverTime.format('YYYY-MM-DD')
                }
            })
            await saveRun(value)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    const tableColumns = [
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 120
        },
        {
            key: 'patternName',
            title: '模式',
            dataIndex: 'patternName',
            width: 100
        },
        {
            key: 'materialLeader',
            title: <span>提料负责人<span style={{ color: 'red' }}>*</span></span>,
            dataIndex: 'materialLeader',
            width: 220,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Row gutter={12}>
                    <Col span={18}>
                        <Form.Item name={["assignedList", index, "materialLeaderName"]} rules={[{ required: true, message: "请选择人员" }]} initialValue={_}>
                            <Input size="small" disabled suffix={
                                <SelectUser key={'materialLeader'} selectedKey={[form?.getFieldsValue(true)?.assignedList[index].materialLeader]} onSelect={(selectedRows: Record<string, any>) => {
                                    const values = form.getFieldsValue(true)?.assignedList
                                    values[index] = {
                                        ...values[index],
                                        materialLeader: selectedRows[0]?.userId,
                                        materialLeaderName: selectedRows[0]?.name,
                                    }
                                    form.setFieldsValue({
                                        assignedList: [
                                            ...values
                                        ]
                                    })
                                    setDetailData([...values])
                                }} />
                            } />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        {index === 0 ? null : <Checkbox onChange={(check) => {
                            const values = form.getFieldsValue(true)?.assignedList
                            if (check.target.checked) {
                                values[index] = {
                                    ...values[index],
                                    materialLeader: '0',
                                    materialLeaderName: '同上'

                                }
                                setDetailData([
                                    ...values
                                ])
                                form.setFieldsValue({
                                    assignedList: [...values]
                                })
                            } else {
                                values[index] = {
                                    ...values[index],
                                    materialLeader: '',
                                    materialLeaderName: ''

                                }
                                setDetailData([
                                    ...values
                                ])
                                form.setFieldsValue({
                                    assignedList: [...values]
                                })
                            }
                        }} checked={detailData[index]?.materialLeader === '0'}>
                            同上
                        </Checkbox>}
                    </Col>
                </Row>
            )
        },
        {
            key: 'priority',
            title: <span>优先级<span style={{ color: 'red' }}>*</span></span>,
            dataIndex: 'priority',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["assignedList", index, "priority"]} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择优先级"
                }]}>
                    <Select style={{ width: '100px' }} placeholder="请选择" size="small">
                        {index !== 0 ? <Select.Option value={'0'} key={0}>同上</Select.Option> : null}
                        <Select.Option value={1} key={1}>紧急</Select.Option>
                        <Select.Option value={2} key={2}>高</Select.Option>
                        <Select.Option value={3} key={3}>中</Select.Option>
                        <Select.Option value={4} key={4}>低</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'materialDeliverTime',
            title: <span>计划交付时间<span style={{ color: 'red' }}>*</span></span>,
            dataIndex: 'materialDeliverTime',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["assignedList", index, "materialDeliverTime"]}
                    rules={[{
                        "required": true,
                        "message": "请选择计划交付时间"
                    }]}
                >
                    <DatePicker size="small" />
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 180,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["assignedList", index, "description"]} initialValue={_}>
                    <Input maxLength={40} size="small" key={index} />
                </Form.Item>
            )
        }
    ]

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);


    return <Spin spinning={loading}>
        <DetailTitle title="指派信息" style={{ padding: '0 0 8px' }} />
        <Form form={form} className={styles.BatchAssigned}>
            <CommonTable
                scroll={{ x: 500 }}
                rowKey="id"
                dataSource={[...detailData || []]}
                pagination={false}
                columns={tableColumns}
                className={styles.addModal} />
        </Form>
    </Spin>
})