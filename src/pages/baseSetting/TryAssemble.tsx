/**
 * @author zyc
 * @copyright © 2021 
 * @description 试组装配置
 */

import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, message, Modal } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import TryAssembleNew from './TryAssembleNew';
import { useHistory } from 'react-router-dom';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function TryAssemble(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            fixed: "left" as FixedType,
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productTypeName',
            title: '产品类型',
            width: 150,
            dataIndex: 'productTypeName'
        },
        {
            key: 'country',
            title: '国内国外',
            dataIndex: 'country',
            width: 120
        },
        {
            key: 'areaNames',
            title: '地区',
            width: 200,
            dataIndex: 'areaNames'
        },
        {
            key: 'towerStructureNames',
            title: '铁塔结构',
            width: 200,
            dataIndex: 'towerStructureNames'
        },
        {
            key: 'voltageGradeNames',
            title: '电压等级',
            width: 200,
            dataIndex: 'voltageGradeNames'
        },
        {
            key: 'number',
            title: '基数限制',
            width: 200,
            dataIndex: 'number'
        },
        {
            key: 'segmentModeNames',
            title: '段模式',
            width: 200,
            dataIndex: 'segmentModeNames'
        },
        {
            key: 'weldingTypeNames',
            title: '电焊件类型',
            width: 200,
            dataIndex: 'weldingTypeNames'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => {
                        setType('edit');
                        setVisible(true);
                        setRowData(record);
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.put(`/tower-science/trial/delete?id=${record.id}`).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <Popconfirm
                        title={record.status === 1 ? '确认停用' : '确认启用'}
                        onConfirm={() => {
                            RequestUtil.post(`/tower-science/trial/update`, { id: record.id, status: record.status === 1 ? 2 : 1 }).then(res => {
                                message.success('操作成功');
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        {/* 状态，1启用，2停用 */}
                        <Button type="link">{record.status === 1 ? '停用' : '启用'}</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const [refresh, setRefresh] = useState(false);
    const newRef = useRef<EditRefProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'edit' | 'new'>('new');
    const [rowData, setRowData] = useState<any>();
    const history = useHistory();

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await newRef.current?.onSubmit()
            message.success("保存成功！")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return (
        <>
            <Modal
                destroyOnClose
                key='TryAssembleNew'
                visible={visible}
                title={type === 'new' ? '新增' : '编辑'}
                width='60%'
                onOk={handleOk}
                onCancel={() => setVisible(false)}>
                <TryAssembleNew type={type} record={rowData} ref={newRef} />
            </Modal>
            <Page
                path="/tower-science/trial/list"
                columns={columns}
                headTabs={[]}
                extraOperation={
                    <Button type="primary" onClick={() => {
                        setVisible(true);
                        setType("new");
                    }} ghost>新增试装条件</Button>
                }
                refresh={refresh}
                searchFormItems={[]}
                tableProps={{
                    pagination: false
                }}
            />
        </>
    )
}