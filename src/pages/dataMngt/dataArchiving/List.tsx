/**
 * @author zyc
 * @copyright © 2022
 * @description RD-资料管理-资料存档管理
 */

import React, { useEffect, useRef, useState } from 'react';
import { Space, Spin, Button, Radio, RadioChangeEvent, message, Modal, Select, Input, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';
import { drawingDataTypeOptions, productTypeOptions, referenceRoomOptions } from '../../../configuration/DictionaryOptions';
import DataArchivingNew from './DataArchivingNew';
import { columns } from './dataArchiving.json'

export interface ILofting {
    readonly id?: string;
}

export interface EditRefProps {
    onSave: () => void
    resetFields: () => void
}

export default function List(): React.ReactNode {
    const [status, setStatus] = useState<any>('');
    const history = useHistory();
    const newRef = useRef<EditRefProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'edit' | 'new' | 'detail'>('new');
    const [filterValue, setFilterValue] = useState<any>();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await newRef.current?.onSave()
            message.success("保存成功！")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            key='DataArchivingNew'
            visible={visible}
            width="50%"
            title={type === 'new' ? '登记' : type === 'edit' ? '编辑' : '查看'}
            confirmLoading={confirmLoading}
            footer={
                <Space>
                    {type === 'detail' ? null : <Button type='primary' onClick={handleOk}>保存</Button>}
                    <Button onClick={() => {
                        setVisible(false);
                        newRef.current?.resetFields();
                    }}>关闭</Button>
                </Space>
            }
            onCancel={() => {
                setVisible(false);
                newRef.current?.resetFields();
            }}
        >
            <DataArchivingNew getLoading={(loading) => setConfirmLoading(loading)} type={type} record={rowData} ref={newRef} />
        </Modal>
        <Page
            path="/tower-science/data/backup"
            filterValue={filterValue}
            requestData={{
                status: status
            }}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    fixed: "left" as FixedType,
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
                            <Button type="link" onClick={() => {
                                setType('detail');
                                setVisible(true);
                                setRowData(record);
                            }}>查看</Button>
                            <Button type="link" onClick={() => {
                                setType('edit');
                                setVisible(true);
                                setRowData(record);
                            }}>编辑</Button>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => {
                                    RequestUtil.delete(`/tower-science/data/backup/${record.id}`).then(res => {
                                        message.success('删除成功');
                                        setRefresh(!refresh);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link">删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                }]}
            extraOperation={<Space size="small">
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                    setStatus(event.target.value);
                    setFilterValue({
                        status: event.target.value
                    })
                }}>
                    <Radio.Button value={''} key="1">全部</Radio.Button>
                    <Radio.Button value={1} key="2">正常</Radio.Button>
                    <Radio.Button value={2} key="3">变更</Radio.Button>
                    <Radio.Button value={3} key="4">无效</Radio.Button>
                </Radio.Group>
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setType('new');
                }} ghost>登记</Button>
            </Space>}
            searchFormItems={[
                {
                    name: "resourceCenter",
                    label: '资料室',
                    children: <Select placeholder="请选择" style={{ width: 200 }} defaultValue={''}>
                        <Select.Option value="" key={0}>全部</Select.Option>
                        {referenceRoomOptions && referenceRoomOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "resourceType",
                    label: "资料类型",
                    children: <Select placeholder="请选择" style={{ width: 200 }} defaultValue={''}>
                        <Select.Option value="" key={0}>全部</Select.Option>
                        {drawingDataTypeOptions && drawingDataTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "productType",
                    label: "产品类型",
                    children: <Select placeholder="请选择" style={{ width: 200 }} defaultValue={''}>
                        <Select.Option value="" key={0}>全部</Select.Option>
                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "fuzzyMsg",
                    label: '模糊查询',
                    children: <Input placeholder="客户名称/工程名称/计划号/塔型名称" style={{ width: 300 }} />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                setFilterValue(values)
                return values;
            }}
        />
    </>
}