/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-提料指派
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select,DatePicker, Input, TreeSelect, Row, Col } from 'antd'
import { CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './MaterialTaskList.module.less';
import moment from "moment"
import { TreeNode } from "antd/lib/tree-select";
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IMaterialTask } from "./MaterialTaskList"

export interface EditProps {
    type: "new" | "edit",
    id: string
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}


export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState<any>();

    const { loading, data } = useRequest<IMaterialTask>(() => new Promise(async (resole, reject) => {
        try {
            const result: IMaterialTask = await RequestUtil.get<IMaterialTask>(`/tower-aps/work/center/info/${id}`)
            form.setFieldsValue({ assignedList: [...result?.assignedList || []] });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

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
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-aps/work/center/info`, { ...postData, id: data?.id })
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
                    user: res.user === 0 ? assignedList[assignedList.findIndex((item: any) => item.user === 0 ) - 1].user : res.user,
                    specificationName: res.specificationName === 4 ? assignedList[assignedList.findIndex((item: any) => item.specificationName === 4 ) - 1].specificationName : res.specificationName
                }
            })
            console.log(value)
            await saveRun({})
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
            key: 'name',
            title: '塔型',
            dataIndex: 'name',
            width: 120
        },
        {
            key: 'processId',
            title: '模式',
            dataIndex: 'processId',
            width: 100
        },
        {
            key: 'user',
            title: <span>提料负责人<span style={{ color: 'red' }}>*</span></span>,
            dataIndex: 'user',
            width: 220,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Row>
                    <Col span={14}>
                    <Form.Item name={["assignedList", index, "materialName"]}>
                        <TreeSelect size="small" placeholder="请选择" onChange={async (value: any) => {
                           
                                const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
                                setUserList({ ...userList, [index]: userData.records });
                                form.getFieldsValue(true).assignedList[index] = {
                                    ...form.getFieldsValue(true).assignedList[index],
                                    user: ''
                                }
                                console.log(form.getFieldsValue(true).assignedList)
                                form.setFieldsValue({assignedList: [...form.getFieldsValue(true).assignedList]})
                                
                            
                        }}>
                            {renderTreeNodes(wrapRole2DataNode(department))}
                        </TreeSelect>
                    </Form.Item>
                    </Col>
                    <Col span={10}>
                    
                    <Form.Item name={["assignedList", index, "user"]} rules={[{ required: true, message: "请选择人员" }]} initialValue={_ ? _ : index === 0 ? '' : 0}>
                        <Select size="small" onChange={(e: any) => {
                            if(e === 0) {
                                console.log(_)
                                form.getFieldsValue(true).assignedList[index] = {
                                    ...form.getFieldsValue(true).assignedList[index],
                                    materialName: ''
                                }
                                form.setFieldsValue({assignedList: [...form.getFieldsValue(true).assignedList]});
                                setUserList({ ...userList, [index]: [] });
                            }
                        }}>
                            {index !== 0 ? <Select.Option value={0} key={0}>同上</Select.Option> : null}
                            {userList && userList[index] &&  userList[index].map((item: any) => {
                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    </Col>
                </Row>
            )
        },
        {
            key: 'specificationName',
            title: <span>优先级<span style={{ color: 'red' }}>*</span></span>,
            dataIndex: 'specificationName',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["assignedList", index, "specificationName"]} initialValue={_ ? _ : index === 0 ? '' : 4} rules={[{
                    "required": true,
                    "message": "请选择优先级"
                }]}>
                    <Select style={{ width: '100px' }} placeholder="请选择" size="small">
                        {index !== 0 ? <Select.Option value={4} key={4}>同上</Select.Option> : null}
                        <Select.Option value={0} key={0}>紧急</Select.Option>
                        <Select.Option value={1} key={1}>高</Select.Option>
                        <Select.Option value={2} key={2}>中</Select.Option>
                        <Select.Option value={3} key={3}>低</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'materialTextureName',
            title: <span>计划交付时间<span style={{ color: 'red' }}>*</span></span>,
            dataIndex: 'materialTextureName',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["assignedList", index, "materialTextureName"]} initialValue={_} 
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
            key: 'workHour',
            title: '备注',
            dataIndex: 'workHour',
            width: 180,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["assignedList", index, "workHour"]} initialValue={_}>
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
                dataSource={[{ name: '塔型A', id: '123456', materialName: '', specificationName: '' }, { name: '塔型B', id: '12348452', materialName: '', specificationName: 4 }, { name: '塔型C', id: '789546' }]}
                pagination={false}
                columns={tableColumns}
                className={styles.addModal} />
        </Form>
    </Spin>
})