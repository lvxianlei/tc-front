/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Modal, Row, Col, TreeSelect, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './BoltList.module.less';
import { Link, useHistory, useLocation } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import QuotaEntries from './QuotaEntries';
import SelectUser from '../../common/SelectUser';
import Assigned from './Assigned';

export interface EditProps {
    onSubmit: () => void
}

export default function BoltList(): React.ReactNode {
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
            width: 150,
            dataIndex: 'priorityName',
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
            key: 'productCategoryName',
            title: '塔型',
            width: 200,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 200,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'boltDeliverTime',
            title: '计划交付时间',
            dataIndex: 'boltDeliverTime',
            width: 200,
        },
        {
            key: 'boltLeaderName',
            title: '螺栓负责人',
            width: 200,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'boltPlanCheckUserName',
            title: '计划校核',
            width: 200,
            dataIndex: 'boltPlanCheckUserName'
        },
        {
            key: 'boltOperatorName',
            title: '作业员',
            width: 200,
            dataIndex: 'boltOperatorName'
        },
        {
            key: 'boltCheckerName',
            title: '螺栓校核',
            width: 200,
            dataIndex: 'boltCheckerName'
        },
        {
            key: 'boltStatus',
            title: '螺栓清单状态',
            width: 200,
            dataIndex: 'boltStatusName',
        },
        {
            key: 'boltUpdateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'boltUpdateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/workMngt/boltList/boltListing/${record.id}/${record.boltLeader}/${record.boltStatus}`}>螺栓清单</Link>
                    {
                        record.boltStatus === 3 && record.boltChecker === userId ? <Link to={`/workMngt/boltList/boltCheck/${record.id}`}>校核</Link> : <Button type="link" disabled>校核</Button>
                    }
                    <Button type='link' onClick={() => {
                        setVisible(true);
                        setRowId(record?.id)
                    }}>定额条目</Button>
                    <Button type='link' onClick={async () => {
                        setDrawTaskId(record.id);
                        setAssignVisible(true);
                        setAssignType('single')
                    }} disabled={record.boltStatus !== 1}>指派</Button>
                </Space>
            )
        }
    ]

    const location = useLocation<{ state?: number, userId?: string, weldingOperator?: string }>();
    const userId = AuthUtil.getUserInfo().user_id;
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        setDepartment(departmentData);
    }), {})
    const [user, setUser] = useState<any[] | undefined>([]);
    const [checkPerson, setCheckPerson] = useState<any | undefined>([]);
    const [department, setDepartment] = useState<any | undefined>([]);
    const [assignVisible, setAssignVisible] = useState<boolean>(false);
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [form] = Form.useForm();
    const [refresh, setRefresh] = useState(false);
    const [checkUser, setCheckUser] = useState([]);
    const [filterValue, setFilterValue] = useState<any>();
    const [visible, setVisible] = useState<boolean>(false);
    const editRef = useRef<EditProps>();
    const history = useHistory();
    const [rowId, setRowId] = useState<string>('');
    const assignedRef = useRef<EditProps>();
    const [assignType, setAssignType] = useState<'single' | 'batch'>('single');
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const handleAssignModalOk = () => new Promise(async (resove, reject) => {
        try {
            await assignedRef.current?.onSubmit();
            message.success('指派成功！');
            setAssignVisible(false);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

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

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('定额条目保存成功！');
            setVisible(false);
            history.go(0);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            visible={visible}
            title="定额条目"
            okText="保存并关闭"
            onOk={handleModalOk}
            width="70%"
            className={styles.tryAssemble}
            onCancel={() => {
                setVisible(false);
            }}>
            <QuotaEntries id={rowId} ref={editRef} />
        </Modal>
        <Modal
            destroyOnClose
            visible={assignVisible}
            title="指派"
            onOk={handleAssignModalOk}
            className={styles.tryAssemble}
            onCancel={() => {
                setAssignVisible(false);
            }}>
            <Assigned id={drawTaskId} type={assignType} ref={assignedRef} />
        </Modal>
        <Page
            path="/tower-science/boltRecord"
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            exportPath={`/tower-science/boltRecord`}
            requestData={{ boltStatus: location.state?.state, weldingLeader: location.state?.userId }}
            filterValue={filterValue}
            extraOperation={<Button type='primary' disabled={selectedKeys.length === 0} onClick={() => {
                setDrawTaskId(selectedKeys.join(','));
                setAssignVisible(true);
                setAssignType('batch')
            }} ghost>批量指派</Button>}
            searchFormItems={[
                {
                    name: 'updateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'boltStatus',
                    label: '螺栓清单状态',
                    children: <Form.Item name="boltStatus" initialValue={location.state?.state || ''}>
                        <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value="" key="6">全部</Select.Option>
                            <Select.Option value={1} key="1">待指派</Select.Option>
                            <Select.Option value={2} key="2">待完成</Select.Option>
                            <Select.Option value={3} key="3">校核中</Select.Option>
                            <Select.Option value={4} key="4">已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'personnel',
                    label: '人员',
                    children: <Row>
                        <Col>
                            <Form.Item name="dept">
                                <TreeSelect style={{ width: "150px" }} placeholder="请选择" onChange={async (value: any) => {
                                    const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
                                    setCheckUser(userData.records)
                                }}>
                                    {renderTreeNodes(wrapRole2DataNode(department))}
                                </TreeSelect>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="personnel">
                                <Select placeholder="请选择" style={{ width: "150px" }}>
                                    <Select.Option value="" key="6">全部</Select.Option>
                                    {checkUser && checkUser.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                },
                {
                    name: 'priority',
                    label: '优先级',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="9">全部</Select.Option>
                        <Select.Option value="0" key="0">紧急</Select.Option>
                        <Select.Option value="1" key="1">高</Select.Option>
                        <Select.Option value="2" key="2">中</Select.Option>
                        <Select.Option value="3" key="3">低</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号" />
                }
            ]}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.updateTime) {
                    const formatDate = values.updateTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                setFilterValue(values);
                return values;
            }}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange,
                    getCheckboxProps: (record: Record<string, any>) => ({
                        disabled: record?.boltStatus !== 1
                    })
                }
            }}
        />
    </>
}