/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-试装、免试装申请
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TreeSelect, Modal } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './IsTrialDress.module.less';
import { useHistory } from 'react-router-dom';
import Page from '../../common/Page';
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import { columns } from "./isTrialDress.json"
import useRequest from '@ahooksjs/use-request';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import ApplyTrial from './ApplyTrial';

interface EditRefProps {
    onSubmit: () => void;
    resetFields: () => void;
    onSave: () => void;
    onPass: () => void;
    onReject: () => void;
}

export default function List(): React.ReactNode {
    const history = useHistory();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [user, setUser] = useState<any[] | undefined>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const addRef = useRef<EditRefProps>();
    const [type, setType] = useState<'new' | 'detail'>('new');
    const [rowId, setRowId] = useState<string>();
    const { data: departmentData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/department`);
        resole(data)
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

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSave()
            message.success("保存成功！")
            setVisible(false)
            addRef.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleLaunchOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("保存并发起成功！")
            setVisible(false)
            addRef.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    return <>
        <Modal
            destroyOnClose
            key='ApplyTrial'
            visible={visible}
            title={type === 'new' ? '试装/免试装申请' : '详情'}
            footer={<Space direction="horizontal" size="small">
                {type === 'new' ?
                    <>
                        <Button onClick={handleOk} type="primary" ghost>保存并关闭</Button>
                        <Button onClick={handleLaunchOk} type="primary" ghost>保存并发起</Button>
                    </>
                    :
                    null
                    // <>
                    //     <Button>拒绝</Button>
                    //     <Button>通过</Button>
                    // </>
                }
                <Button onClick={() => {
                    setVisible(false);
                    addRef.current?.resetFields();
                }}>关闭</Button>
            </Space>}
            width="60%"
            onCancel={() => {
                setVisible(false);
                addRef.current?.resetFields();
            }}>
            <ApplyTrial type={type} id={rowId} ref={addRef} />
        </Modal>
        <Page
            path="/tower-science/trialAssembly"
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    fixed: 'left' as FixedType,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...columns,
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type='link' onClick={() => {
                                setRowId(record?.id);
                                setVisible(true);
                                setType('detail');
                            }}>详情</Button>
                            <Popconfirm
                                title="确认发起?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/trialAssembly/trialAssembly/launch/${record.id}`).then(res => {
                                        message.success('发起成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={!(record.status === 1 || record.status === 5)}
                            >
                                <Button disabled={!(record.status === 1 || record.status === 5)} type="link">发起</Button>
                            </Popconfirm>
                            {/* <Popconfirm
                                title="确认撤回?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/trialAssembly/trialAssembly/withdraw/${record.id}`).then(res => {
                                        message.success('撤回成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={record.status !== 2}
                            >
                                <Button disabled={record.status !== 2} type="link">撤回</Button>
                            </Popconfirm> */}
                            {/* 和补件申请撤回一样，先隐藏 */}
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => {
                                    RequestUtil.delete(`/tower-science/trialAssembly/trialAssembly/${record.id}`).then(res => {
                                        message.success('删除成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={!(record.status === 1 || record.status === 5)}
                            >
                                <Button disabled={!(record.status === 1 || record.status === 5)} type="link">删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                }
            ]}
            headTabs={[]}
            extraOperation={<Button type='primary' style={{ margin: '6px 0' }} onClick={() => {
                setType('new');
                setVisible(true);
            }} ghost>申请</Button>}
            searchFormItems={[
                {
                    name: 'updateStatusTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'status',
                    label: '审批状态',
                    children: <Select placeholder="请选择审批状态">
                        <Select.Option key={1} value={1}>未发起</Select.Option>
                        <Select.Option key={2} value={2}>待审批</Select.Option>
                        <Select.Option key={3} value={3}>审批中</Select.Option>
                        <Select.Option key={4} value={4}>已通过</Select.Option>
                        <Select.Option key={5} value={5}>已撤回</Select.Option>
                        <Select.Option key={0} value={0}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'loftingUser',
                    label: '人员',
                    children: <Row>
                        <Col>
                            <Form.Item name="dept">
                                <TreeSelect style={{ width: "150px" }} placeholder="请选择" onChange={async (value: any) => {
                                    const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
                                    setUser(userData.records)
                                }}>
                                    {renderTreeNodes(wrapRole2DataNode(departmentData))}
                                </TreeSelect>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="loftingUser">
                                <Select placeholder="请选择" style={{ width: "150px" }}>
                                    <Select.Option value="" key="6">全部</Select.Option>
                                    {user && user.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                },
                {
                    name: 'trialAssemble',
                    label: '单据类型',
                    children: <Select placeholder="请选择补件类型">
                        <Select.Option key={0} value={0}>免试装</Select.Option>
                        <Select.Option key={1} value={1}>试组装</Select.Option>
                    </Select>
                },
                {
                    name: 'productType',
                    label: '产品类型',
                    children: <Select placeholder="请选择产品类型">
                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'voltageGrade',
                    label: '电压等级',
                    children: <Select placeholder="请选择电压等级">
                        {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input style={{ width: '300px' }} placeholder="计划号/单号/塔型/工程名称/说明" />
                }
            ]}
            filterValue={filterValues}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.updateStatusTime) {
                    const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                setFilterValues(values);
                return values;
            }}
        />
    </>
}