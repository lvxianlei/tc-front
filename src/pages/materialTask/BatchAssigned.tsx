/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-提料指派
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select, DatePicker, Input, TreeSelect, Row, Col } from 'antd'
import { CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './MaterialTaskList.module.less';
import { TreeNode } from "antd/lib/tree-select";
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IAssignedList } from "./MaterialTaskList"

export interface EditProps {
    id: string;
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ id }: EditProps, ref) {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState<any>();

    const { loading, data } = useRequest<IAssignedList[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: IAssignedList[] = await RequestUtil.get<IAssignedList[]>(`/tower-science/materialProductCategory/list?taskIds=${id}`)
            form.setFieldsValue({ assignedList: [...result || []] });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { data: department } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const departmentData: any = await RequestUtil.get(`/tower-system/department`);
            resole(departmentData)
        } catch (error) {
            reject(error)
        }
    }))

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
                    materialLeader: res.materialLeader === 0 ? assignedList[assignedList.findIndex((item: any) => item.materialLeader === 0) - 1].materialLeader : res.materialLeader,
                    priority: res.priority === 0 ? assignedList[assignedList.findIndex((item: any) => item.priority === 4) - 1].priority : res.priority,
                    materialDeliverTime: value.materialDeliverTime.format('YYYY-MM-DD')
                }
            })
            console.log(value)
            await saveRun(value)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    const renderTreeNodes = (data: any) =>
        data.map((item: any) => {
            if (item.children) {
                return (
                    <TreeNode key={item.id} title={item.name} value={item.id} className={styles.node}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
        });

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
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
                <Row>
                    <Col span={14}>
                        <Form.Item name={["assignedList", index, "materialLeaderDept"]}>
                            <TreeSelect size="small" placeholder="请选择" onChange={async (value: any) => {
                                const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
                                setUserList({ ...userList, [index]: userData.records });
                                form.getFieldsValue(true).assignedList[index] = {
                                    ...form.getFieldsValue(true).assignedList[index],
                                    materialLeader: ''
                                }
                                console.log(form.getFieldsValue(true).assignedList)
                                form.setFieldsValue({ assignedList: [...form.getFieldsValue(true).assignedList] })
                            }}>
                                {renderTreeNodes(wrapRole2DataNode(department))}
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item name={["assignedList", index, "materialLeader"]} rules={[{ required: true, message: "请选择人员" }]} initialValue={_ ? _ : index === 0 ? null : 0}>
                            <Select size="small" onChange={(e: any) => {
                                if (e === 0) {
                                    form.getFieldsValue(true).assignedList[index] = {
                                        ...form.getFieldsValue(true).assignedList[index],
                                        materialLeaderDept: ''
                                    }
                                    form.setFieldsValue({ assignedList: [...form.getFieldsValue(true).assignedList] });
                                    setUserList({ ...userList, [index]: [] });
                                }
                            }}>
                                {index !== 0 ? <Select.Option value={0} key={0}>同上</Select.Option> : null}
                                {userList && userList[index] && userList[index].map((item: any) => {
                                    return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
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
                <Form.Item name={["assignedList", index, "priority"]} initialValue={_ ? _ : index === 0 ? '' : 0} rules={[{
                    "required": true,
                    "message": "请选择优先级"
                }]}>
                    <Select style={{ width: '100px' }} placeholder="请选择" size="small">
                        {index !== 0 ? <Select.Option value={0} key={0}>同上</Select.Option> : null}
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
                <Form.Item name={["assignedList", index, "materialDeliverTime"]} initialValue={_}
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
                dataSource={data}
                pagination={false}
                columns={tableColumns}
                className={styles.addModal} />
        </Form>
    </Spin>
})