/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-指派信息
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Descriptions, Form, Select, DatePicker, Input, Row, Col, TreeSelect } from 'antd'
import { CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './MaterialTaskList.module.less';
import { IAssignedList } from "./IMaterialTask"
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { TreeNode } from "antd/lib/tree-select"
import moment from "moment"
import SelectUser from "../common/SelectUser"

export interface EditProps {
    id: string;
    status: number;
}

export interface RefProps {
    onSubmit: () => void
    resetFields: () => void
}


export default forwardRef(function Edit({ id, status }: EditProps, ref) {
    const [form] = Form.useForm()
    const [userList, setUserList] = useState<any>();

    const { loading, data } = useRequest<IAssignedList>(() => new Promise(async (resole, reject) => {
        try {
            const result: IAssignedList = await RequestUtil.get<IAssignedList>(`/tower-science/materialProductCategory/material/${id}`)
            form.setFieldsValue({ ...result, materialDeliverTime: result.materialDeliverTime && moment(result.materialDeliverTime), });
            result?.materialLeaderDept && deptChange(result?.materialLeaderDept)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id, status] })

    const { data: department } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const departmentData: any = await RequestUtil.get(`/tower-system/department`);
            resole(departmentData)
        } catch (error) {
            reject(error)
        }
    }))

    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'createDeptName',
            title: '操作部门',
            dataIndex: 'createDeptName',
            width: 100
        },
        {
            key: 'createUserName',
            title: '操作人',
            dataIndex: 'createUserName',
            width: 220,

        },
        {
            key: 'createTime',
            title: '操作时间',
            dataIndex: 'createTime',
            width: 120
        },
        {
            key: 'action',
            title: '操作',
            dataIndex: 'action',
            width: 150
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 180
        }
    ]

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
            } else {
                role.children = []
            }
        });
        return roles;
    }

    const deptChange = async (value: any) => {
        const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
        setUserList(userData.records);
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/materialProductCategory`, [postData])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            let baseData = await form.validateFields();
            const value = {
                ...baseData,
                materialDeliverTime: baseData.materialDeliverTime.format('YYYY-MM-DD'),
                id: data?.id
            }
            await saveRun(value)
            resolve(true);
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <Form form={form} className={styles.BatchAssigned}>
            <DetailTitle title="指派信息" />
            <Descriptions bordered column={3} className={styles.heightScroll}>
                <Descriptions.Item label="塔型">
                    {data?.productCategoryName}
                </Descriptions.Item>
                <Descriptions.Item label="模式">
                    {data?.patternName}
                </Descriptions.Item>
                <Descriptions.Item label="提料负责人">
                    {status === 3 ? data?.materialLeaderName
                        :
                        <Form.Item name="materialLeaderName" rules={[{ required: true, message: "请选择人员" }]}>
                            <Input size="small" disabled suffix={
                                <SelectUser key={'materialLeader'} selectedKey={[form?.getFieldsValue(true)?.materialLeader]} onSelect={(selectedRows: Record<string, any>) => {
                                    form.setFieldsValue({
                                        materialLeader: selectedRows[0]?.userId,
                                        materialLeaderName: selectedRows[0]?.name,
                                    })
                                }} />
                            } />
                        </Form.Item>
                    }
                </Descriptions.Item>
                <Descriptions.Item label="优先级">
                    {status === 3 ? data?.priorityName
                        : <Form.Item name="priority" rules={[{
                            "required": true,
                            "message": "请选择优先级"
                        }]}>
                            <Select style={{ width: '100px' }} placeholder="请选择" size="small">
                                <Select.Option value={1} key={1}>紧急</Select.Option>
                                <Select.Option value={2} key={2}>高</Select.Option>
                                <Select.Option value={3} key={3}>中</Select.Option>
                                <Select.Option value={4} key={4}>低</Select.Option>
                            </Select>
                        </Form.Item>}
                </Descriptions.Item>
                <Descriptions.Item label="计划交付时间">
                    {status === 3 ? data?.materialDeliverTime
                        : <Form.Item name="materialDeliverTime"
                            rules={[{
                                "required": true,
                                "message": "请选择计划交付时间"
                            }]}
                        >
                            <DatePicker size="small" />
                        </Form.Item>}
                </Descriptions.Item>
                <Descriptions.Item label="备注">
                    {status === 3 ? data?.description
                        : <Form.Item name="description">
                            <Input maxLength={40} size="small" />
                        </Form.Item>}
                </Descriptions.Item>
            </Descriptions>

        </Form>
        <DetailTitle title="操作信息" style={{ padding: '8px 0' }} />
        <CommonTable
            scroll={{ x: 500 }}
            rowKey="id"
            dataSource={data?.statusRecordList}
            pagination={false}
            columns={tableColumns}
            className={styles.addModal} />
    </Spin>
})