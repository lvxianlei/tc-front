/**
 * @author zyc
 * @copyright © 2022 
 * @description 工单设置-工单模板管理
 */

import React, { useEffect, useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Spin, TreeSelect, Popconfirm, message, Switch, Modal } from 'antd';
import { SearchTable as Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkOrderTemplateNew from './WorkOrderTemplateNew';
import { rowDetail } from 'ali-react-table/dist/pipeline/features';

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
            key: 'templateNumber',
            title: '模板编号',
            dataIndex: 'templateNumber'
        },
        {
            key: 'templateName',
            title: '模板名称（标题名称）',
            dataIndex: 'templateName'
        },
        {
            key: 'templateType',
            title: '模板类型',
            dataIndex: 'templateType'
        },
        {
            key: 'postName',
            title: '岗位',
            dataIndex: 'postName'
        },
        {
            key: 'status',
            title: '当前状态',
            dataIndex: 'status',
            render: (_: number, record: Record<string, any>): React.ReactNode => (
                <Switch checkedChildren="启用" unCheckedChildren="关闭" onChange={(checked: boolean) => {
                    console.log(checked)
                    RequestUtil.post(`/tower-work/template/status/${record?.id}/${checked ? 1 : 0}`).then(res => {
                        message.success('状态变更成功');
                        history.go(0);
                    });
                }} checked={_ === 1} />
            )
        },
        {
            key: 'updateUserName',
            title: '最近编辑人',
            dataIndex: 'updateUserName'
        },
        {
            key: 'updateTime',
            title: '最近编辑时间',
            dataIndex: 'updateTime'
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
                        setType('detail');
                        setVisible(true)
                        setRowId(record?.id)
                    }}>详情</Button>
                    <Button type="link" onClick={() => {
                        setType('edit');
                        setVisible(true)
                        setRowId(record?.id)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-work/template/${record?.id}`).then(res => {
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
    const [type, setType] = useState<'new' | 'edit' | 'detail'>('new');
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<EditRefProps>();
    const [rowId, setRowId] = useState<string>('');
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])


    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        let result: any = await RequestUtil.get<any>(`/tower-work/template/type`);
        resole(treeNode(result))
    }), {})

    const treeNode = (nodes: any) => {
        nodes?.forEach((res: any) => {
            res.title = res?.name;
            res.value = res?.id;
            res.children = res?.children;
            if (res?.children?.length > 0) {
                treeNode(res?.children)
            }
        })
        return nodes
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onSubmit()
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
            key='workOrderTemplateNew'
            visible={visible}
            width="80%"
            footer={<Space>
                {type === 'detail' ? null : <Button type='primary' loading={confirmLoading} onClick={handleOk} ghost>完成</Button>}
                <Button onClick={() => { setVisible(false); ref.current?.resetFields(); }}>关闭</Button>
            </Space>}
            title={type === 'new' ? '新建工单模板' : type === 'edit' ? "编辑工单模板" : "详情"}
            onCancel={() => { setVisible(false); ref.current?.resetFields(); }}>
            <WorkOrderTemplateNew getLoading={(loading) => setConfirmLoading(loading)} rowId={rowId} type={type} ref={ref} />
        </Modal>
        <Page
            path="/tower-work/template"
            columns={columns}
            filterValue={filterValue}
            extraOperation={
                <Button type='primary' onClick={() => { setVisible(true); setType('new') }} ghost>新建模板</Button>
            }
            searchFormItems={[
                {
                    name: 'status',
                    label: '启用状态',
                    children: <Form.Item name="status">
                        <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value="" key="6">全部</Select.Option>
                            <Select.Option value={1} key="1">启用</Select.Option>
                            <Select.Option value={0} key="2">关闭</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'templateTypeId',
                    label: '模板类型',
                    children: <TreeSelect
                        style={{ width: '400px' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={data}
                        placeholder="请选择"
                        treeDefaultExpandAll
                    />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="模板编号/模板名称/备注" />
                }
            ]}
            onFilterSubmit={(values: any) => {
                setFilterValue(values)
                return values;
            }}
        />
    </>
}