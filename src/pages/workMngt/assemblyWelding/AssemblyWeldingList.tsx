/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Modal, Row, Col, TreeSelect, message } from 'antd';
import { IntgSelect, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './AssemblyWelding.module.less';
import { Link, useLocation } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export default function AssemblyWeldingList(): React.ReactNode {

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'priorityName',
            title: '优先级',
            width: 100,
            dataIndex: 'priorityName'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 150,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 200,
            dataIndex: 'productCategory'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        },
        {
            key: 'weldingLeaderName',
            title: '组焊负责人',
            width: 120,
            dataIndex: 'weldingLeaderName'
        },
        {
            key: 'statusName',
            title: '组焊清单状态',
            width: 120,
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/workMngt/assemblyWeldingList/assemblyWeldingInformation/${record.id}`}>组焊信息</Link>
                    {
                        record.weldingLeader ? 
                            <Link to={{ pathname: `/workMngt/assemblyWeldingList/assemblyWeldingListing/${record.id}/${record.productCategoryId}/${record.weldingLeader}`, state: { status: record.status } }}>组焊清单</Link>
                        : 
                        <Button type='link' onClick={() => {
                            message.warning('当前无组焊负责人，请先进行指派')
                        }}>组焊清单</Button>
                    }
                    {/* {
                        record.weldingLeader.split(',').indexOf(userId) === -1 ?
                            <Button type="link" disabled>组焊清单</Button> */}{/* } */}
                    {/* <Button type='link' onClick={async () => {
                        setDrawTaskId(record.id);
                        setAssignVisible(true);
                    }} disabled={record.status !== 2}>指派</Button> */}
                </Space>
            )
        }
    ]

    const [refresh, setRefresh] = useState(false);
    const location = useLocation<{ state?: number, userId?: string, weldingOperator?: string }>();
    const [filterValue, setFilterValue] = useState<Record<string, any>>();
    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        setDepartment(departmentData);
    }), {})
    // const [user, setUser] = useState<any[] | undefined>([]);
    const [department, setDepartment] = useState<any | undefined>([]);
    // const [assignVisible, setAssignVisible] = useState<boolean>(false);
    // const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [checkUser, setCheckUser] = useState([]);
    // const [form] = Form.useForm();

    // const handleAssignModalOk = async () => {
    //     try {
    //         const submitData = await form.validateFields();
    //         submitData.weldingId = drawTaskId;
    //         await RequestUtil.post('/tower-science/welding/assign', submitData).then(() => {
    //             message.success('指派成功！')
    //         }).then(() => {
    //             setAssignVisible(false);
    //             form.resetFields();
    //         }).then(() => {
    //             setRefresh(!refresh);
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // const handleAssignModalCancel = () => { setAssignVisible(false); form.resetFields(); };
    // const formItemLayout = {
    //     labelCol: { span: 6 },
    //     wrapperCol: { span: 16 }
    // };
    // const onDepartmentChange = async (value: Record<string, any>, title?: string) => {
    //     const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
    //     switch (title) {
    //         case "user":
    //             form.setFieldsValue({ 'weldingOperator': '' })
    //             return setUser(userData.records);
    //     }
    // }
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
    return <>
        {/* <Modal visible={assignVisible} title="指派" okText="提交" onOk={handleAssignModalOk} onCancel={handleAssignModalCancel} width={800}>
            <Form form={form} {...formItemLayout}>
                <Row>
                    <Col span={12}>
                        <Form.Item name="dept" label="部门" rules={[{ required: true, message: "请选择部门" }]}>
                            <TreeSelect
                                onChange={(value: any) => { onDepartmentChange(value, 'user') }}
                            >
                                {renderTreeNodes(wrapRole2DataNode(department))}
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="weldingOperator" label="人员" rules={[{ required: true, message: "请选择人员" }]}>
                            <Select style={{ width: '100px' }}>
                                {user && user.map((item: any) => {
                                    return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal> */}
        <Page
            path="/tower-science/welding"
            exportPath={`/tower-science/welding`}
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            requestData={{ status: location.state?.state, boltLeader: location.state?.userId, boltOperator: location.state?.weldingOperator }}
            filterValue={filterValue}
            searchFormItems={[
                {
                    name: 'updateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'status',
                    label: '组焊清单状态',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value="" key="6">全部</Select.Option>
                            <Select.Option value={2} key="2">组焊中</Select.Option>
                            <Select.Option value={3} key="3">已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'personnel',
                    label: '人员',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'plannedTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'priority',
                    label: '优先级',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="4">全部</Select.Option>
                        <Select.Option value="0" key="0">紧急</Select.Option>
                        <Select.Option value="1" key="1">高</Select.Option>
                        <Select.Option value="2" key="2">中</Select.Option>
                        <Select.Option value="3" key="3">低</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="放样任务编号/计划号/订单编号/内部合同编号/塔型" />
                }
            ]}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.updateTime) {
                    const formatDate = values.updateTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                if (values.plannedTime) {
                    const formatDate = values.plannedTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';;
                    values.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';;
                }
                if (values.personnel) {
                    values.personnel = values.personnel?.value;
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
}