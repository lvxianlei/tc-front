/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理
 */

import React, { useEffect, useRef, useState } from 'react';
import { Input, DatePicker, Button, message, Space, Select, Radio, Modal, TreeSelect, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from '../Management.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router-dom';
import SelectUser from '../../common/SelectUser';
import WorkOrderNew from './WorkOrderNew';
import WorkOrderDetail from './WorkOrderDetail';
import EngineeringInformation from './EngineeringInformation';
import Dispatching from './Dispatching';
import { useForm } from 'antd/lib/form/Form';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
    onBack: () => void
}
export default function List(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<any>({});
    const [confirmStatus, setConfirmStatus] = useState<string>('');
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
    const [type, setType] = useState<'new' | 'edit'>('new');
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<EditRefProps>();
    const [rowId, setRowId] = useState<string>('');
    const history = useHistory();
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [dealVisible, setDealVisible] = useState<boolean>(false);
    const dealRef = useRef<EditRefProps>();
    const [dispatchVisible, setDispatchVisible] = useState<boolean>(false);
    const dispatchRef = useRef<EditRefProps>();
    const [selectedRowsName, setSelectedRowsName] = useState<any>({});
    const [form] = useForm();
    const [searchForm] = useForm();
    const [workTemplateTypeId, setWorkTemplateTypeId] = useState<string>('');
    const [dispatchingType, setDispatchingType] = useState<'batch' | 'single'>('single');

    const { data: templateTypes } = useRequest<any>(() => new Promise(async (resole, reject) => {
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

    useEffect(() => {
        if (selectedRowsName) {
            setSelectedRowsName(selectedRowsName)
        }
    }, [selectedRowsName])

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
            "key": "workOrderNumber",
            "title": "工单编号",
            "width": 150,
            "dataIndex": "workOrderNumber"
        },
        {
            "key": "buildChannel",
            "title": "产生途径",
            "width": 150,
            "dataIndex": "buildChannel"
        },
        {
            "key": "workOrderTitle",
            "title": "工单标题",
            "width": 150,
            "dataIndex": "workOrderTitle"
        },
        {
            "key": "workTemplateType",
            "title": "工单类型",
            "width": 150,
            "dataIndex": "workTemplateType"
        },
        {
            "key": "statusName",
            "title": "工单状态",
            "width": 150,
            "dataIndex": "statusName"
        },
        {
            "key": "dispatchStatusName",
            "title": "派工状态",
            "width": 150,
            "dataIndex": "dispatchStatusName"
        },
        {
            "key": "workOrderNode",
            "title": "当前处理节点",
            "width": 150,
            "dataIndex": "workOrderNode"
        },
        {
            "key": "recipientUserName",
            "title": "接收人",
            "width": 150,
            "dataIndex": "recipientUserName"
        },
        {
            "key": "createTime",
            "title": "产生时间",
            "width": 150,
            "dataIndex": "createTime"
        },
        {
            "key": "planStartTime",
            "title": "预计开始时间",
            "width": 150,
            "dataIndex": "planStartTime"
        },
        {
            "key": "actualStartTime",
            "title": "实际开始时间",
            "width": 150,
            "dataIndex": "actualStartTime",
        },
        {
            "key": "planEndTime",
            "title": "预计完成时间",
            "width": 150,
            "dataIndex": "planEndTime"
        },
        {
            "key": "actualEndTime",
            "title": "实际完成时间",
            "width": 150,
            "dataIndex": "actualEndTime"
        },
        {
            "key": "operation",
            "title": "操作",
            "dataIndex": "operation",
            fixed: "right" as FixedType,
            "width": 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space>
                    <Button type='link' onClick={() => {
                        setDetailVisible(true);
                        setRowId(record.id);
                    }} >详情</Button>
                    <Button type='link' disabled={record?.status === 3} onClick={() => {
                        setDispatchVisible(true);
                        setRowId(record.id);
                        setDispatchingType('single')
                    }} >派工</Button>
                    <Button type='link' disabled={record?.status === 3} onClick={() => {
                        setDealVisible(true);
                        setRowId(record.id);
                        setWorkTemplateTypeId(record?.workTemplateTypeId)
                    }}>处理</Button>
                    <Button type='link' disabled={record?.status === 3 || record?.dispatchStatus === 2} onClick={() => {
                        setVisible(true);
                        setType('edit');
                        setRowId(record.id);
                    }} >编辑</Button>
                    <Button type='link' disabled={record?.status !== 1} onClick={() => {
                        Modal.confirm({
                            title: "取消",
                            okText: '确定',
                            cancelText: '取消',
                            content: <Form form={form}>
                                <Form.Item name="description" label="取消原因" rules={[{ required: true, message: "请输入取消原因" }]}>
                                    <Input.TextArea maxLength={300} />
                                </Form.Item>
                            </Form>,
                            onOk: () => {
                                RequestUtil.post(`/tower-work/workOrder/cancelWorkOrder/${record?.id}/${form.getFieldsValue(true)?.description}`).then(res => {
                                    message.success("取消成功")
                                    history.go(0)
                                })
                            }
                        })
                    }}>取消</Button>
                </Space>
            )
        }
    ]

    const searchItems = [
        {
            name: 'time',
            children: <Form.Item name="time" initialValue={1}>
                <Select placeholder="请选择" style={{ width: '120px' }}>
                    <Select.Option key={1} value={1}>预计开始时间</Select.Option>
                    <Select.Option key={2} value={2}>预计完成时间</Select.Option>
                    <Select.Option key={3} value={3}>实际开始时间</Select.Option>
                    <Select.Option key={4} value={4}>实际完成时间</Select.Option>
                </Select>
            </Form.Item>
        },
        {
            name: 'selectTime',
            children: <DatePicker.RangePicker />
        },
        {
            name: 'buildChannel',
            label: '产生途径',
            children: <Select placeholder="请选择" style={{ width: '120px' }} defaultValue={''}>
                <Select.Option key={4} value={''}>全部</Select.Option>
                <Select.Option key={0} value={'系统'}>系统</Select.Option>
                <Select.Option key={1} value={'人工'}>人工</Select.Option>
            </Select>
        },
        {
            name: 'workTemplateType',
            label: '工单类型',
            children: <TreeSelect
                style={{ width: '200px' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={templateTypes}
                placeholder="请选择"
                treeDefaultExpandAll
            />
        },
        {
            name: 'dispatchStatus',
            label: '派工状态',
            children: <Select placeholder="请选择" style={{ width: '120px' }} defaultValue={''}>
                <Select.Option key={4} value={''}>全部</Select.Option>
                <Select.Option key={1} value={1}>待派工</Select.Option>
                <Select.Option key={2} value={2}>已派工</Select.Option>
            </Select>
        },
        {
            name: 'recipientUserName',
            label: '接收人',
            children: <Input style={{ width: '80%' }} disabled suffix={[
                <SelectUser requests={{ deptName: '' }} onSelect={(selectedRows: Record<string, any>) => {
                    searchForm?.setFieldsValue({
                        recipientUser: selectedRows[0]?.userId,
                        recipientUserName: selectedRows[0]?.name
                    })
                }} />
            ]} />
        },
        {
            name: 'fuzzyMsg',
            label: "模糊查询项",
            children: <Input style={{ width: '200px' }} placeholder="工单标题/工单编号" />
        }
    ]

    const operationChange = (event: any) => {
        setConfirmStatus(event.target.value);
        setRefresh(!refresh);
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

    const handleDealOk = () => new Promise(async (resove, reject) => {
        try {
            await dealRef.current?.onSubmit()
            message.success("处理完成！")
            setDealVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleBack = () => new Promise(async (resove, reject) => {
        try {
            await dealRef.current?.onBack()
            message.success("退回成功！")
            setDealVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleDispatchOk = () => new Promise(async (resove, reject) => {
        try {
            await dispatchRef.current?.onSubmit()
            message.success("派工成功！")
            setDispatchVisible(true)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const onFilterSubmit = (values: Record<string, any>) => {
        if (values?.selectTime) {
            const formatDate = values?.selectTime?.map((item: any) => item.format("YYYY-MM-DD"));
            values.startTime = formatDate[0] + ' 00:00:00';
            values.endTime = formatDate[1] + ' 23:59:59';
        }
        values.recipientUser = searchForm?.getFieldsValue(true)?.recipientUser
        setFilterValue(values);
    }

    const isAllEqual = (array:any[]) => {
        if (array.length > 0) {
            return !array.some((value, index) => {
                return value !== array[0];
            });
        } else {
            return true;
        }
    }

    return <>
        <Modal
            destroyOnClose
            key='Dispatching'
            visible={dispatchVisible}
            width="80%"
            footer={
                <Space>
                    <Button type="primary" onClick={handleDispatchOk} ghost>完成</Button>
                    <Button onClick={() => {
                        setDispatchVisible(false); 
                        dispatchRef.current?.resetFields();
                    }}>关闭</Button>
                </Space>
            }
            title={"派工"}
            onCancel={() => { setDispatchVisible(false); dispatchRef.current?.resetFields(); }}>
            <Dispatching type={dispatchingType} rowId={rowId} ref={dispatchRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='EngineeringInformation'
            visible={dealVisible}
            width="95%"
            footer={
                <Space>
                    <Button type="primary" onClick={handleDealOk} ghost>完成</Button>
                    <Button type="primary" onClick={handleBack} ghost>退回</Button>
                    <Button onClick={() => {
                        setDealVisible(false);
                    }}>关闭</Button>
                </Space>
            }
            title="报工信息"
            onCancel={() => setDealVisible(false)}>
            <EngineeringInformation rowId={rowId} workTemplateTypeId={workTemplateTypeId} ref={dealRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='WorkOrderDetail'
            visible={detailVisible}
            width="95%"
            footer={
                <Button onClick={() => {
                    setDetailVisible(false);
                }}>关闭</Button>
            }
            title="详情"
            onCancel={() => setDetailVisible(false)}>
            <WorkOrderDetail rowId={rowId} />
        </Modal>
        <Modal
            destroyOnClose
            key='WorkOrderNew'
            visible={visible}
            width="40%"
            onOk={handleOk}
            okText="完成"
            title={type === 'new' ? '新建' : "编辑"}
            onCancel={() => { setVisible(false); ref.current?.resetFields(); }}>
            <WorkOrderNew rowId={rowId} type={type} ref={ref} />
        </Modal>
        <Form form={searchForm} layout="inline" onFinish={(values: Record<string, any>) => onFilterSubmit(values)}>
            {
                searchItems?.map((res: any) => {
                    return <Form.Item name={res?.name} label={res?.label}>
                        {res?.children}
                    </Form.Item>
                })
            }
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button onClick={async () => {
                    searchForm?.resetFields();
                }}>重置</Button>
            </Form.Item>
        </Form>
        <Page
            path={`/tower-work/workOrder`}
            columns={columns}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={
                <Space style={{ width: '100%' }}>
                    <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                        <Radio.Button value={''}>全部</Radio.Button>
                        <Radio.Button value={1}>待关闭</Radio.Button>
                        <Radio.Button value={2}>已关闭</Radio.Button>
                        <Radio.Button value={3}>已取消</Radio.Button>
                    </Radio.Group>
                    <Space size='small' style={{ position: 'absolute', right: '16px', top: 0 }}>
                        <Button type='primary' onClick={() => {
                            setVisible(true);
                            setType('new')
                        }} ghost>人工创建工单</Button>
                        <Button type='primary' disabled={selectedKeys.length === 0} onClick={() => {
                            const tip = isAllEqual(selectedRows.map((res: any) => res?.workTemplateId))
                                                        console.log(tip)
                            if (tip) {
                                setRowId(selectedKeys?.join(','));
                                setDispatchVisible(true);
                                    setDispatchingType('batch')
                            } else {
                                message.warning('仅相同工单类型允许批量派工！')
                            }
                        }} ghost>批量派工</Button>
                    </Space>
                </Space>
            }
            refresh={refresh}
            searchFormItems={[]}
            filterValue={filterValue}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: (selectedRowKeys: React.Key[], selectedRows: any): void => {
                        setSelectedKeys(selectedRowKeys);
                        setSelectedRows(selectedRows)
                    }
                }
            }}
        />
    </>
}