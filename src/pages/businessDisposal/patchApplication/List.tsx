/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TablePaginationConfig, Tooltip, Modal, InputNumber } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './PatchApplication.module.less';
import { Link, useHistory } from 'react-router-dom';
import { supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns, partsColumns } from "./patchApplication.json"
import { CommonTable, IntgSelect } from '../../common';
import useRequest from '@ahooksjs/use-request';

export default function List(): React.ReactNode {
    const history = useHistory();
    const [detailData, setDetailData] = useState<any>();
    const [partsData, setPartsData] = useState<any>();
    const [rowId, setRowId] = useState<string>('')
    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [deliveryForm] = Form.useForm();

    const { loading, data, run } = useRequest<any[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any>(`/tower-science/supplyEntry`, { current: pagenation?.current || 1, size: pagenation?.size || 10, ...filterValue });
        setPage({ ...data });
        if (data.records.length > 0 && data.records[0]?.id) {
            detailRun(data.records[0]?.id)
            setRowId(data.records[0]?.id)
        } else {
            setDetailData([]);
            setPartsData([]);
        }
        resole(data?.records);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/supplyEntry/productCategory/list/${id}`);
            setDetailData(result);
            result.length > 0 && partsRun(result[0]?.id)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: partsRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/supplyEntry/structure/list/${id}`);
            setPartsData(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onRowChange = async (record: Record<string, any>) => {
        setRowId(record.id)
        detailRun(record.id)
    }

    const onPartsRowChange = async (record: Record<string, any>) => {
        partsRun(record.id)
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const onSearch = (values: Record<string, any>) => {
        if (values.updateStatusTime) {
            const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
            values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
        }
        if (values.applyUser) {
            values.applyUser = values.applyUser?.value
        }
        setFilterValues(values);
        run({}, { ...values });
    }

    return <>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item label='日期' name="updateStatusTime">
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item label='审批状态' name="status">
                <Select placeholder="请选择审批状态">
                    <Select.Option value={1} key="1">未发起</Select.Option>
                    <Select.Option value={2} key="2">待审批</Select.Option>
                    <Select.Option value={3} key="3">审批中</Select.Option>
                    <Select.Option value={4} key="4">已通过</Select.Option>
                    <Select.Option value={5} key="5">已撤回</Select.Option>
                    <Select.Option value={0} key="6">已拒绝</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label='补件类型' name="supplyType">
                <Select placeholder="请选择补件类型">
                    {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label='申请人' name="applyUser">
                <IntgSelect width={200} />
            </Form.Item>
            <Form.Item label='塔型名称' name="productCategoryName">
                <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label='模糊查询项' name="fuzzyMsg">
                <Input style={{ width: '400px' }} placeholder="补件编号/计划号/工程名称/说明" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>

                </Space>
            </Form.Item>
        </Form>
        <Link to={`/businessDisposal/patchApplication/apply`}><Button type='primary' style={{ margin: '16px 0' }} ghost>申请</Button></Link>
        <CommonTable
            haveIndex
            columns={[
                ...columns.map(res => {
                    if (res.dataIndex === 'description') {
                        return {
                            ...res,
                            ellipsis: {
                                showTitle: false,
                            },
                            render: (_: string) => (
                                <Tooltip placement="topLeft" title={_}>
                                    {_ ? _?.substring(0, 5) + '...' : '-'}
                                </Tooltip>
                            ),
                        }
                    }
                    return res
                }),
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Link to={`/businessDisposal/patchApplication/edit/${record.id}`}>
                                <Button type='link' disabled={!(record.status === 1 || record.status === 5)}>编辑</Button>
                            </Link>
                            <Link to={`/businessDisposal/patchApplication/detail/${record.id}`}>详情</Link>
                            <Popconfirm
                                title="确认发起?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/supplyEntry/submit/${record.id}`).then(res => {
                                        message.success('发起成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={!(record.status === 1 || record.status === 5)}
                            >
                                <Button type="link" disabled={!(record.status === 1 || record.status === 5)}>发起</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确认撤回?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/supplyEntry/cancel/${record.id}`).then(res => {
                                        message.success('撤回成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={record.status !== 2}
                            >
                                <Button type="link" disabled={record.status !== 2}>撤回</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => {
                                    RequestUtil.delete(`/tower-science/supplyEntry/${record.id}`).then(res => {
                                        message.success('删除成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={!(record.status === 1 || record.status === 5)}
                            >
                                <Button type="link" disabled={!(record.status === 1 || record.status === 5)}>删除</Button>
                            </Popconfirm>
                            {
                                record?.warehousingStatus === 1 ?
                                    <Popconfirm
                                        title={`确定取消入库？`}
                                        onConfirm={() => {
                                            RequestUtil.post(`/tower-science/supplyEntry/cancel/warehousing/${record.id}`).then(res => {
                                                message.success('取消入库成功');
                                                history.go(0);
                                            })
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                        disabled={record?.shipmentStatus === 1}
                                    >
                                        <Button type="link" disabled={record?.shipmentStatus === 1}>取消入库</Button>
                                    </Popconfirm>
                                    :
                                    <Popconfirm
                                        title={`确定入库？`}
                                        onConfirm={() => {
                                            RequestUtil.post(`/tower-science/supplyEntry/warehousing/${record.id}`).then(res => {
                                                message.success('入库成功');
                                                history.go(0);
                                            })
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                        disabled={!(record?.shipmentStatus === 0 && record?.isSupplyBatch === 1)}
                                    >
                                        <Button type="link" disabled={!(record?.shipmentStatus === 0 && record?.isSupplyBatch === 1)}>入库</Button>
                                    </Popconfirm>
                            }
                            {
                                record?.shipmentStatus === 1 ?
                                    <Popconfirm
                                        title={`确定取消发货？`}
                                        onConfirm={() => {
                                            RequestUtil.post(`/tower-science/supplyEntry/cancel/shipment/${record.id}`).then(res => {
                                                message.success('取消发货成功');
                                                history.go(0);
                                            })
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link">取消发货</Button>
                                    </Popconfirm>
                                    :
                                    <Button type="link" onClick={() => {
                                        Modal.confirm({
                                            title: "发货",
                                            icon: null,
                                            content: <Form form={deliveryForm} labelCol={{ span: 4 }}>
                                                <Form.Item name='logisticsOrderNo' label="物流单号">
                                                    <Input maxLength={100} />
                                                </Form.Item>
                                                <Form.Item name='freightPrice' label="运费">
                                                    <InputNumber style={{width: '100%'}} max={999999.99}/>
                                                </Form.Item>
                                            </Form>,
                                            onOk: () => new Promise(async (resolve, reject) => {
                                                try {
                                                    const value = await deliveryForm.validateFields()
                                                    RequestUtil.post<any>(`/tower-science/supplyEntry/shipment`, {
                                                        ...value,
                                                        supplyEntryId: record?.id
                                                    }).then(res => {
                                                        deliveryForm.resetFields();
                                                        message.success('发货成功！')
                                                        history.go(0)
                                                        resolve(true)
                                                    })

                                                } catch (error) {
                                                    reject(false)
                                                }
                                            }),
                                            onCancel() {
                                                deliveryForm.resetFields()
                                            }
                                        })
                                    }} disabled={!(record?.warehousingStatus === 1)}>发货</Button>
                            }
                        </Space>
                    )
                }]}
            dataSource={data}
            pagination={{
                current: page.current,
                pageSize: page.size,
                total: page?.total,
                showSizeChanger: true,
                onChange: handleChangePage
            }}
            onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChange(record)
            })}
            className={styles.patchList}
            //未入库 未发货 颜色显示
            rowClassName={(record: Record<string, any>) =>
                record?.id === rowId ?
                    styles.selected :
                    record?.warehousingStatus === 0 ?
                        styles.noDelivery :
                        record?.shipmentStatus === 0 ?
                            styles.noPutStorage :
                            undefined
            }
        />
        <Row gutter={12} style={{ marginTop: '16px' }}>
            <Col span={8}>
                <CommonTable
                    haveIndex
                    columns={tableColumns}
                    dataSource={detailData || []}
                    pagination={false}
                    onRow={(record: Record<string, any>) => ({
                        onClick: () => onPartsRowChange(record),
                        className: styles.tableRow
                    })}
                />

            </Col>
            <Col span={16}>
                <CommonTable
                    haveIndex
                    columns={partsColumns}
                    dataSource={partsData || []}
                    pagination={false} />

            </Col>
        </Row>
    </>
}