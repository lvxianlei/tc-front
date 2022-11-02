/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理
 */

import React, { useEffect, useRef, useState } from 'react';
import { Input, DatePicker, Button, message, Space, Select, Radio, Modal, TreeSelect, Form } from 'antd';
import { SearchTable as Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Management.module.less';
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
    const [dispatchingType, setDispatchingType] = useState<'batch' | 'single'>('single');
    const [rowData, setRowData] = useState<Record<string, any>>({});
    const [detailData, setDetailData] = useState<Record<string, any>>({});
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [dealLoading, setDealLoading] = useState<boolean>(false);
    const [newLoading, setNewLoading] = useState<boolean>(false);


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
            "dataIndex": "workOrderNumber"
        },
        {
            "key": "fieldValue",
            "title": "业务编号",
            "dataIndex": "fieldValue"
        },
        {
            "key": "buildChannel",
            "title": "产生途径",
            "dataIndex": "buildChannel"
        },
        {
            "key": "workOrderTitle",
            "title": "工单标题",
            "dataIndex": "workOrderTitle"
        },
        {
            "key": "workTemplateType",
            "title": "工单类型",
            "dataIndex": "workTemplateType"
        },
        {
            "key": "statusName",
            "title": "工单状态",
            "dataIndex": "statusName"
        },
        {
            "key": "dispatchStatusName",
            "title": "派工状态",
            "dataIndex": "dispatchStatusName"
        },
        {
            "key": "workOrderNode",
            "title": "当前处理节点",
            "dataIndex": "workOrderNode"
        },
        {
            "key": "recipientUserName",
            "title": "接收人",
            "dataIndex": "recipientUserName"
        },
        {
            "key": "createTime",
            "title": "产生时间",
            "dataIndex": "createTime"
        },
        {
            "key": "planStartTime",
            "title": "预计开始时间",
            "dataIndex": "planStartTime"
        },
        {
            "key": "actualStartTime",
            "title": "实际开始时间",
            "dataIndex": "actualStartTime",
        },
        {
            "key": "planEndTime",
            "title": "预计完成时间",
            "dataIndex": "planEndTime"
        },
        {
            "key": "actualEndTime",
            "title": "实际完成时间",
            "dataIndex": "actualEndTime"
        },
        {
            "key": "operation",
            "title": "操作",
            "dataIndex": "operation",
            fixed: "right" as FixedType,
            "width": 280,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space>
                    <Button type='link' onClick={() => {
                        setDetailVisible(true);
                        setRowId(record.id);
                        setRowData(record)
                    }} >详情</Button>
                    <Button type='link' disabled={record?.status !== 1} onClick={() => {
                        setDispatchVisible(true);
                        setRowId(record.id);
                        setDispatchingType('single')
                    }} >派工</Button>
                    <Button type='link' disabled={record?.status !== 1} onClick={async () => {
                        setRowId(record?.id)
                        RequestUtil.post<any>(`/tower-work/workOrder/getWorkOrderNode/${record.id}/${record?.workTemplateId}`).then(res => {
                            setDealVisible(true);
                            setRowData(record);
                            setDetailData(res);
                        })
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
                            onOk: () => new Promise(async (resove, reject) => {
                                try {
                                    const value = await form.validateFields();
                                    await RequestUtil.post(`/tower-work/workOrder/cancelWorkOrder/${record?.id}/${value?.description}`).then(res => {
                                        message.success("取消成功")
                                        history.go(0)
                                    })
                                    resove(true)
                                } catch (error) {
                                    reject(false)
                                }
                            }),
                            onCancel: () => {
                                form?.resetFields();
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
        setFilterValue({
            status: event.target.value
        });
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onSubmit()
            message.success("保存成功！")
            setVisible(false)
            setNewLoading(false)
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
            setDealLoading(false)
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
            setDealLoading(false)
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
            setConfirmLoading(false)
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

    const isAllEqual = (array: any[]) => {
        if (array.length > 0) {
            return !array.some((value, index) => {
                return value !== array[0];
            });
        } else {
            return true;
        }
    }

    useEffect(() => {
        setConfirmLoading(confirmLoading);
        setDealLoading(dealLoading);
        setNewLoading(newLoading)
    }, [confirmLoading, dealLoading, newLoading])

    return <>
        <Modal
            destroyOnClose
            key='Dispatching'
            visible={dispatchVisible}
            width="80%"
            footer={
                <Space>
                    <Button type="primary" loading={confirmLoading} onClick={handleDispatchOk} ghost>完成</Button>
                    <Button onClick={() => {
                        setDispatchVisible(false);
                        dispatchRef.current?.resetFields();
                    }}>关闭</Button>
                </Space>
            }
            title={"派工"}
            onCancel={() => { setDispatchVisible(false); dispatchRef.current?.resetFields(); }}>
            <Dispatching getLoading={(loading) => setConfirmLoading(loading)} type={dispatchingType} rowId={rowId} ref={dispatchRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='EngineeringInformation'
            visible={dealVisible}
            width="95%"
            footer={
                <Space>
                    <Button type="primary" loading={dealLoading} onClick={handleDealOk} ghost>完成</Button>
                    {detailData?.flag === 1 ? null : <Button type="primary" onClick={handleBack} ghost>退回</Button>}
                    <Button onClick={() => {
                        setDealVisible(false);
                    }}>关闭</Button>
                </Space>
            }
            title="报工信息"
            onCancel={() => setDealVisible(false)}>
            <EngineeringInformation getLoading={(loading) => setDealLoading(loading)} rowData={rowData} rowId={rowId} detailData={detailData} ref={dealRef} />
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
            <WorkOrderDetail rowData={rowData} rowId={rowId} />
        </Modal>
        <Modal
            destroyOnClose
            key='WorkOrderNew'
            visible={visible}
            width="60%"
            footer={
                <Space>
                    <Button type="primary" loading={newLoading} onClick={handleOk} ghost>完成</Button>
                    <Button onClick={() => {
                        setVisible(false);
                        ref.current?.resetFields();
                    }}>关闭</Button>
                </Space>
            }
            title={type === 'new' ? '新建' : "编辑"}
            onCancel={() => { setVisible(false); ref.current?.resetFields(); }}>
            <WorkOrderNew getLoading={(loading) => setNewLoading(loading)} rowId={rowId} type={type} ref={ref} />
        </Modal>
        <Form form={searchForm} className={styles.selectBtn} layout="inline" onFinish={(values: Record<string, any>) => onFilterSubmit(values)}>
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
                    <Space size='small'>
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
                                message.warning('仅相同工单标题允许批量派工！')
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
                    },
                    getCheckboxProps: (record: Record<string, any>) => record?.status !== 1
                }
            }}
        />
    </>
}