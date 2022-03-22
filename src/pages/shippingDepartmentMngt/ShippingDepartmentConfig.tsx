
/**
 * @author zyc
 * @copyright © 2022 
 * @description 成品库配置
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Button, Modal, Popconfirm, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { EditRefProps } from './Edit';
import Edit from "./Edit"

export interface IShipping {
    readonly id?: string;
}

export default function ProcessMngt(): React.ReactNode {
    const columns = [
        {
            key: 'name',
            title: '成品库名称',
            dataIndex: 'name'
        },
        {
            key: 'leaderName',
            title: '负责人',
            dataIndex: 'leaderName'
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => {
                        setVisible(true);
                        setType('edit');
                        setDetailedData(record);
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-production/packageStorage/${record.id}`).then(res => {
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
        }
    ]

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success(`${type === "new" ? "创建" : "编辑"}成品库成功`)
            setVisible(false);
            resove(true);
            setDetailedData({});
            setRefresh(!refresh);
        } catch (error) {
            reject(false)
        }
    })

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [filterValue, setFilterValue] = useState({});
    const [type, setType] = useState<'new' | 'edit'>('new');
    const editRef = useRef<EditRefProps>();
    const [detailedData, setDetailedData] = useState<IShipping>({});
    return (
        <>
            <Modal
                destroyOnClose
                visible={visible}
                title={type === "new" ? "添加成品库" : "编辑成品库"}
                onOk={handleModalOk}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setType('new');
                    setDetailedData({});
                    setVisible(false);
                }}>
                <Edit type={type} ref={editRef} detailedData={detailedData} />
            </Modal>
            <Page
                path={`/tower-production/packageStorage`}
                columns={columns}
                headTabs={[]}
                extraOperation={<Button type="primary" onClick={() => { setVisible(true); setType('new'); }}>添加</Button>}
                refresh={refresh}
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '',
                        children: <Input placeholder="成品库名称/负责人" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    setFilterValue(values);
                    return values;
                }}
            />
        </>
    )
}