/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-杂项绩效管理
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Button, message, Popconfirm, Modal } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './MiscellaneousPerformance.module.less';
import { useHistory } from 'react-router-dom';
import Page from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import MiscellaneousPerformanceNew from './MiscellaneousPerformanceNew';
import {columns}from './miscellaneousPerformance.json'

interface EditRefProps {
    onSubmit: () => void;
    resetFields: () => void;
    onSave: () => void;
}

export default function List(): React.ReactNode {
    const history = useHistory();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [visible, setVisible] = useState<boolean>(false);
    const addRef = useRef<EditRefProps>();
    const [type, setType] = useState<'new' | 'detail' | 'edit'>('new');
    const [rowId, setRowId] = useState<string>();

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
            title={type === 'new' ? '新增' : type === 'edit' ? '编辑' : '详情'}
            footer={<Space direction="horizontal" size="small">
                {type === 'detail' ?
                null
                    :
                    <>
                        <Button onClick={handleOk} type="primary" ghost>保存并关闭</Button>
                        <Button onClick={handleLaunchOk} type="primary" ghost>保存并发起</Button>
                    </>
                }
                <Button onClick={() => {
                    setVisible(false);
                    addRef.current?.resetFields();
                }}>关闭</Button>
            </Space>}
            width="40%"
            onCancel={() => {
                setVisible(false);
                addRef.current?.resetFields();
            }}>
            <MiscellaneousPerformanceNew type={type} id={rowId} ref={addRef} />
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
                                setVisible(true);
                                setType('edit');
                                setRowId(record?.id);
                            }}>编辑</Button>
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
                            <Popconfirm
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
                            </Popconfirm>
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
            }} ghost>创建</Button>}
            searchFormItems={[
                {
                    name: 'updateStatusTime',
                    label: '日期',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'fuzzyMsg',
                    label: '审批状态',
                    children: <Select placeholder="请选择审批状态">
                        <Select.Option value={1} key="1">未发起</Select.Option>
                        <Select.Option value={2} key="2">待审批</Select.Option>
                        <Select.Option value={3} key="3">审批中</Select.Option>
                        <Select.Option value={4} key="4">已通过</Select.Option>
                        <Select.Option value={5} key="5">已撤回</Select.Option>
                        <Select.Option value={0} key="6">已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input style={{ width: '300px' }} placeholder="任务编号/项目名称/计划号/塔型" />
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