/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TablePaginationConfig, Tooltip } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './PatchApplication.module.less';
import { Link, useHistory } from 'react-router-dom';
import { IResponseData } from '../../common/Page';
import { supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns, partsColumns } from "./patchApplication.json"
import { CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';

export default function List(): React.ReactNode {
    const history = useHistory();
    const [detailData, setDetailData] = useState<any>();
    const [partsData, setPartsData] = useState<any>();
    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();

    const { loading, data, run } = useRequest<any[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-science/supplyEntry`, { current: pagenation?.current || 1, size: pagenation?.size || 10, ...filterValue });
        setPage({ ...data });
        if (data.records.length > 0 && data.records[0]?.id) {
            detailRun(data.records[0]?.id)
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
        <Link to={`/businessDisposal/patchApplication/apply`}><Button type='primary' style={{ margin: '6px 0' }} ghost>申请</Button></Link>
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
                                <Button type='link' disabled={!(record.status === 1 || record.status === 5 || record.status === 0)}>编辑</Button>
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
                                disabled={!(record.status === 1 || record.status === 5 || record.status === 0)}
                            >
                                <Button type="link" disabled={!(record.status === 1 || record.status === 5 || record.status === 0)}>发起</Button>
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
                                disabled={!(record.status === 1 || record.status === 5 || record.status === 0)}
                            >
                                <Button type="link" disabled={!(record.status === 1 || record.status === 5 || record.status === 0)}>删除</Button>
                            </Popconfirm>
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
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })}
        />
        <Row gutter={12} style={{ marginTop: '6px' }}>
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