/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TablePaginationConfig, Tooltip, Modal, InputNumber, TreeSelect } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './PatchApplication.module.less';
import { Link, useHistory } from 'react-router-dom';
import { supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns, partsColumns } from "./patchApplication.json"
import { CommonTable, IntgSelect, SearchTable as Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export default function List(): React.ReactNode {
    const history = useHistory();
    const [detailData, setDetailData] = useState<any>();
    const [partsData, setPartsData] = useState<any>();
    const [rowId, setRowId] = useState<string>('')
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [deliveryForm] = Form.useForm();

    const { data: department } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        resole(departmentData)
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

    const renderTreeNodes = (data: any) =>
        data.map((item: any) => {
            if (item.children) {
                return (
                    <TreeNode key={item.id} title={item.name} value={item.id} className={styles.node}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
        });

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            } else {
                role.children = []
            }
        });
        return roles;
    }

    const onFilterSubmit = (values: any) => {
        if (values.updateStatusTime) {
            const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
            values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
        }
        if (values.applyUser) {
            values.applyUser = values.applyUser?.value
        }
        setFilterValues(values)
        return values
    }

    return <>
        <Page
            path='/tower-science/supplyEntry'
            columns={[
                {
                    "key": "supplyNumber",
                    "title": "补件编号",
                    "dataIndex": "supplyNumber",
                    "width": 100,
                    fixed: 'left' as FixedType,
                },
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
                    width: 400,
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
                                                    <InputNumber style={{ width: '100%' }} max={999999.99} />
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
                }] as any}
            extraOperation={
                <Link to={`/businessDisposal/patchApplication/apply`}><Button type='primary' ghost>申请</Button></Link>

            }
            searchFormItems={[
                {
                    name: 'updateStatusTime',
                    label: '日期',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'status',
                    label: '审批状态',
                    children: <Select placeholder="请选择审批状态">
                        <Select.Option value={1} key="1">未发起</Select.Option>
                        <Select.Option value={2} key="2">待审批</Select.Option>
                        <Select.Option value={3} key="3">审批中</Select.Option>
                        <Select.Option value={4} key="4">已通过</Select.Option>
                        <Select.Option value={5} key="5">已撤回</Select.Option>
                        <Select.Option value={0} key="6">已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'supplyType',
                    label: '补件类型',
                    children:
                        <Select placeholder="请选择补件类型">
                            {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                },
                {
                    name: 'applyUserDept',
                    label: '申请部门',
                    children:
                        <TreeSelect style={{ width: "150px" }} placeholder="请选择">
                            {renderTreeNodes(wrapRole2DataNode(department))}
                        </TreeSelect>
                },
                {
                    name: 'applyUser',
                    label: '申请人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'productCategoryName',
                    label: '塔型名称',
                    children: <Input placeholder="请输入" />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input style={{ width: '400px' }} placeholder="补件编号/计划号/工程名称/说明" />
                }
            ]}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValues}
            getDataSource={(e: any) => {
                if (e.records.length > 0 && e.records[0]?.id) {
                    detailRun(e.records[0]?.id)
                    setRowId(e.records[0]?.id)
                } else {
                    setDetailData([]);
                    setPartsData([]);
                }
                return e
            }}
            tableProps={{
                getRowProps: (record: Record<string, any>) => {
                    return ({
                        onClick: () => onRowChange(record),
                        // style: record?.id === rowId ?
                        // styles.selected :
                        // record?.warehousingStatus === 0 ?
                        //     styles.noDelivery :
                        //     record?.shipmentStatus === 0 ?
                        //         styles.noPutStorage :
                        //         undefined
                        style: record?.id === rowId ?
                            {
                                //     outlineOffset: -2,
                                // outline: '2px solid gold',
                                // '--hover-bgcolor': 'transparent',
                                // background: 'linear-gradient(140deg, #ff000038, #009cff3d)',
                                backgroundColor: "#ffb65d"
                            } :
                            // record?.warehousingStatus === 0 ?
                            //     styles.noDelivery :
                            //     record?.shipmentStatus === 0 ?
                            //         styles.noPutStorage :
                            undefined

                    })
                },
                // //未入库 未发货 颜色显示
                // rowClassName: (record: Record<string, any>) =>
                //     record?.id === rowId ?
                //         styles.selected :
                //         record?.warehousingStatus === 0 ?
                //             styles.noDelivery :
                //             record?.shipmentStatus === 0 ?
                //                 styles.noPutStorage :
                //                 undefined

            }}
            className={styles.patchList}

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