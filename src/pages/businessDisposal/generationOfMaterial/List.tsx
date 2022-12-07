/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-代料
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Button, message, Popconfirm, Modal, Select } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import Page from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import { columns } from "./generationOfMaterial.json"
import GenerationOfMaterialApply from './GenerationOfMaterialApply';
import useRequest from '@ahooksjs/use-request';

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

    const { data: types } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-system/materialCategory`)
            const newResult = result?.filter((res: any) => res?.name === '原材料')[0];
            resole(newResult?.children)
        } catch (error) {
            reject(error)
        }
    }), {})

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
            title={type === 'new' ? '代料申请' : '详情'}
            footer={<Space direction="horizontal" size="small">
                {
                    type === 'detail' ?
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
            <GenerationOfMaterialApply type={type} id={rowId} ref={addRef} />
        </Modal>
        <Page
            path="/tower-science/substitute/material"
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
                                setType('edit');
                            }}>编辑</Button>
                            <Button type='link' onClick={() => {
                                setRowId(record?.id);
                                setVisible(true);
                                setType('detail');
                            }}>详情</Button>
                            <Popconfirm
                                title="确认发起?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/substitute/material/submit/${record.id}`).then(res => {
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
                                    RequestUtil.post(`/tower-science/substitute/material/retract/${record.id}`).then(res => {
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
                                    RequestUtil.delete(`/tower-science/substitute/material/${record.id}`).then(res => {
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
                    label: '日期',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'materialCategory',
                    label: '原材料类型',
                    children: <Select
                        placeholder="请选择原材料类型"
                        style={{ width: "100%" }}
                        showSearch
                        filterOption={(input, option) =>
                            option?.props?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                        }
                    >
                        {
                            types && types?.map((item: any) => {
                                return <Select.Option key={item?.id} value={item?.name}>{item?.name}</Select.Option>
                            })
                        }
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