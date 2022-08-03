/**
 * @author zyc
 * @copyright © 2021 
 * @description 返修件条目配置
 */

import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, message, Spin, Modal } from 'antd';
import { CommonTable } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router-dom';
import ItemRepairNew from './ItemRepairNew';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function ItemRepair(): React.ReactNode {
    const columns = [
        {
            key: 'typeName',
            title: '零件类型',
            width: 200,
            dataIndex: 'typeName'
        },
        {
            key: 'fixType',
            title: '返修类型',
            dataIndex: 'fixType',
            width: 200
        },
        {
            key: 'measuringUnit',
            title: '单位',
            width: 200,
            dataIndex: 'measuringUnit'
        },
        {
            key: 'amount',
            title: '金额',
            width: 200,
            dataIndex: 'amount'
        },
        {
            key: 'maxAmount',
            title: '上限金额（元）',
            width: 200,
            dataIndex: 'maxAmount'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {
                    record.isChild ? null : <Button type="link" onClick={() => {
                        setType('new');
                        setVisible(true);
                        setRowData(record);
                    }}>新增条目</Button>
                    }
                    {
                    record.isChild ?
                        <>
                            <Button type="link" onClick={() => {
                                setType('edit');
                                setVisible(true);
                                setRowData(record);
                            }}>编辑</Button>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => {
                                    RequestUtil.delete(`/tower-production/equipment?equipmentId=${record.id}`).then(res => {
                                        message.success('删除成功');
                                        setRefresh(!refresh);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link">删除</Button>
                            </Popconfirm>
                        </>
                        : null
                    }
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
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let resData: any[] = await RequestUtil.get(`/tower-science/fixItemConfig`);
            resData = resData.map((item: any) => {
                if (item.fixItemConfigList && item.fixItemConfigList?.length > 0) {
                    return {
                        ...item,
                        isChild: false,
                        children: item?.fixItemConfigList?.map((items: any) => {
                            return {
                                ...items,
                                typeId: item.typeId,
                                isChild: true,
                                fixItemConfigList: undefined
                            }
                        })
                    }
                } else {
                    return { ...item, isChild: false, children: undefined }
                }
            })
            resole(resData);
        } catch (error) {
            reject(error)
        }
    }), {})
    
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
        <Spin spinning={loading}>
            <Modal
                destroyOnClose
                key='ItemRepairNew'
                visible={visible}
                title={type === 'new' ? '新增' : '编辑'}
                width='60%'
                onOk={handleOk}
                onCancel={() => setVisible(false)}>
                <ItemRepairNew type={type} record={rowData} ref={newRef} />
            </Modal>
            <CommonTable
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </Spin>
    )
}