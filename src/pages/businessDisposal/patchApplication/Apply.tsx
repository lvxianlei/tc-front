/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-申请
 */

import React, { useRef, useState } from 'react';
import { Input, Button, Form, Descriptions, Select, TreeSelect, DatePicker, Row, Col, Modal, InputNumber } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './PatchApplication.module.less';
import { useForm } from 'antd/es/form/Form';
import { towerTypeColumns, patchColumns } from "./patchApplication.json"
import AddPatch from './AddPatch';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function Apply(): React.ReactNode {
    const [applyUser, setApplyUser] = useState<any[]>();
    const [form] = useForm();
    const [tableForm] = useForm();
    const [towerList, setTowerList] = useState([]);
    const [patchList, setPatchList] = useState<any>([]);
    const addRef = useRef<EditRefProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any>()
    const [towerSelects, setTowerSelects] = useState([]);

    const { data: department } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        resole(departmentData)
    }), {})

    const { data: planNums } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-system/department`);
        resole(nums)
    }), {})

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

    const planNumChange = (e: any) => {
        console.log(e)
        setTowerSelects([])
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            const a: any = await addRef.current?.onSubmit();
            console.log(a)
            setPatchList([...(patchList || []), ...a])
            setVisible(false)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const getTowerList = (e: any[]) => {
        console.log(e)
        towerSelects.filter((res: any) => {
            if (e?.findIndex(res?.id) !== -1) {
                return res
            }
        })
        console.log(towerSelects)
        patchList.filter((res: any) => {
            if (e?.findIndex(res?.productCategoryId) !== -1) {
                return res
            }
        })
        console.log(patchList)
    }

    return (
        <>
            <Modal
                destroyOnClose
                key='addPatch'
                visible={visible}
                title={'添加补件'}
                onOk={handleOk}
                width="80%"
                onCancel={() => setVisible(false)}>
                <AddPatch record={rowData} ref={addRef} />
            </Modal>
            <DetailContent>
                <Form form={form}>
                    <Descriptions bordered column={5} size="small" className={styles.description}>
                        <Descriptions.Item label="补件类型">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择补件类型"
                                }
                            ]}>
                                <Select placeholder="请选择补件类型">
                                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="优先级">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择优先级"
                                }
                            ]}>
                                <Select placeholder="请选择优先级">
                                    <Select.Option value={1} key={1}>紧急</Select.Option>
                                    <Select.Option value={2} key={2}>高</Select.Option>
                                    <Select.Option value={3} key={3}>中</Select.Option>
                                    <Select.Option value={4} key={4}>低</Select.Option>
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="申请部门">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择申请部门"
                                }
                            ]}>
                                <TreeSelect style={{ width: "150px" }} placeholder="请选择" onChange={async (value: any) => {
                                    const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
                                    setApplyUser(userData.records);
                                    form.setFieldsValue({
                                        applyUser: ''
                                    })
                                }}>
                                    {renderTreeNodes(wrapRole2DataNode(department))}
                                </TreeSelect>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="申请人">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择申请人"
                                }
                            ]}>
                                <Select placeholder="请选择申请人" style={{ width: "150px" }}>
                                    {applyUser && applyUser?.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="计划号">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择计划号"
                                }
                            ]}>
                                <Select placeholder="请选择计划号" style={{ width: "150px" }} onChange={(e) => planNumChange(e)}>
                                    {planNums && planNums?.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="塔型">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择塔型"
                                }
                            ]}>
                                <Select placeholder="请选择塔型" style={{ width: "150px" }} mode="multiple" onChange={(e: any[]) => getTowerList(e)}>
                                    {towerSelects && towerSelects?.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="计划发货日期">
                            <Form.Item name="status" rules={[
                                {
                                    "required": true,
                                    "message": "请选择计划发货日期"
                                }
                            ]}>
                                <Select placeholder="请选择计划发货日期" style={{ width: "150px" }}>
                                    <DatePicker />
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="说明">
                            <Form.Item name="status">
                                <Input.TextArea maxLength={400} />
                            </Form.Item>
                        </Descriptions.Item>
                    </Descriptions>
                    <Row gutter={12}>
                        <Col span={8}>
                            <CommonTable
                                haveIndex
                                columns={[
                                    ...towerTypeColumns,
                                    {
                                        key: 'operation',
                                        title: '操作',
                                        dataIndex: 'operation',
                                        fixed: 'right' as FixedType,
                                        width: 150,
                                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                            <Button type="link" onClick={() => {
                                                setVisible(true);
                                                setRowData(record);
                                            }}>添加补件</Button>
                                        )
                                    }
                                ]}
                                dataSource={[...towerList || []]}
                                pagination={false}
                            />
                        </Col>
                        <Col span={16}>
                            <Form form={tableForm}>
                                <CommonTable
                                    haveIndex
                                    columns={[
                                        ...patchColumns.map(res => {
                                            if (res.dataIndex === 'num') {
                                                return {
                                                    ...res,
                                                    render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                                                        <InputNumber min={0} max={9999} size="small" onChange={(e) => {
                                                            console.log(e)
                                                        }} />
                                                    )
                                                }
                                            }
                                            return res
                                        }),
                                        {
                                            key: 'operation',
                                            title: '操作',
                                            dataIndex: 'operation',
                                            fixed: 'right' as FixedType,
                                            width: 50,
                                            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                                <Button type="link">删除</Button>
                                            )
                                        }
                                    ]}
                                    dataSource={[{
                                        id: '11'
                                    }]
                                    }
                                    pagination={false}
                                />
                            </Form>

                        </Col>
                    </Row>
                </Form>
            </DetailContent>
        </>
    )
}