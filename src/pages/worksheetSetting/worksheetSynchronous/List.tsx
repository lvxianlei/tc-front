/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-工单同步
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Button, Popconfirm, message, Switch, Modal } from 'antd';
import { SearchTable as Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './WorksheetSynchronous.module.less';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import WorksheetSynchronousNew from './WorksheetSynchronousNew';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function List(): React.ReactNode {
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
            key: 'name',
            title: '任务名称',
            dataIndex: 'name'
        },
        {
            key: 'templateName',
            title: '工单模板',
            dataIndex: 'templateName'
        },
        //  {
        //      key: 'triggerField',
        //      title: '同步字段',
        //      dataIndex: 'triggerField'
        //  },
        //  {
        //      key: 'apiUrl',
        //      title: '推送API',
        //      dataIndex: 'apiUrl'
        //  },
        {
            key: 'status',
            title: '状态',
            dataIndex: 'status',
            render: (_: number, record: Record<string, any>): React.ReactNode => (
                <Switch checkedChildren="启用" unCheckedChildren="关闭" onChange={(checked: boolean) => {
                    RequestUtil.post(`/tower-work/workOrderSync/status/${record?.id}/${checked ? 1 : 0}`).then(res => {
                        message.success('状态变更成功');
                        history.go(0);
                    });
                }} checked={_ === 1} />
            )
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
                <Space size='small'>
                    <Button type="link" onClick={() => {
                        setType('edit');
                        setVisible(true)
                        setRowId(record?.id)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-work/workOrderSync/${record?.id}`).then(res => {
                                message.success('删除成功');
                                history.go(0);
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

    const history = useHistory();
    const [filterValue, setFilterValue] = useState<any>({});
    const [type, setType] = useState<'new' | 'edit'>('new');
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<EditRefProps>();
    const [rowId, setRowId] = useState<string>('');

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onSubmit()
            message.success("上传成功！")
            setVisible(false)
            // history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            key='workOrderTemplateNew'
            visible={visible}
            footer={<Space>
                <Button type='primary' onClick={handleOk} ghost>提交</Button>
                <Button onClick={() => { setVisible(false); ref.current?.resetFields(); }}>关闭</Button>
            </Space>}
            title={type === 'new' ? '新建' : "编辑"}
            onCancel={() => { setVisible(false); ref.current?.resetFields(); }}>
            <WorksheetSynchronousNew rowId={rowId} type={type} ref={ref} />
        </Modal>
        <Page
            path="/tower-work/workOrderSync"
            columns={columns}
            filterValue={filterValue}
            extraOperation={
                <Button type='primary' onClick={() => { setVisible(true); setType('new') }} ghost>新建任务</Button>
            }
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="任务名称/工单模板/同步字段/备注" />
                }
            ]}
            onFilterSubmit={(values: any) => {
                setFilterValue(values)
                return values;
            }}
        />
    </>
}