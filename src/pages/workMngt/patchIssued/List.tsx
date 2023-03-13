/**
 * @author zyc
- * @description 放样过程管理-补件下达列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, message, Popconfirm, Form, Radio, RadioChangeEvent, Row, Col } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './PatchIssued.module.less';
import { Link, useHistory } from 'react-router-dom';
import { productTypeOptions, supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { patchEntryColumns } from "./patchIssued.json"
import { SearchTable } from '../../common';
import AuthUtil from '@utils/AuthUtil';

export default function List(): React.ReactNode {
    const userId = AuthUtil.getUserInfo().user_id;

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'supplyBatchNumber',
            title: '补件下达编号',
            width: 120,
            dataIndex: 'supplyBatchNumber'
        },
        {
            key: 'supplyNumber',
            title: '补件编号',
            width: 120,
            dataIndex: 'supplyNumber'
        },
        {
            key: 'statusName',
            title: '补件下达状态',
            width: 120,
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 120,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'supplyTypeName',
            title: '补件类型',
            width: 120,
            dataIndex: 'supplyTypeName'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 120,
            dataIndex: 'planNumber'
        },
        {
            key: 'supplyProductCategory',
            title: '塔型',
            width: 100,
            dataIndex: 'supplyProductCategory'
        },
        {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName',
            width: 100
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 120,
            dataIndex: 'voltageGradeName'
        },
        {
            key: 'productTypeName',
            title: '产品类型',
            dataIndex: 'productTypeName',
            width: 120
        },
        {
            key: 'totalNumber',
            title: '补件数量',
            width: 120,
            dataIndex: 'totalNumber'
        },
        {
            key: 'totalWeight',
            title: '补件重量',
            width: 150,
            dataIndex: 'totalWeight'
        },
        {
            key: 'applyUserDepartName',
            title: '申请部门',
            width: 150,
            dataIndex: 'applyUserDepartName'
        },
        {
            key: 'applyUserName',
            title: '申请人',
            width: 200,
            dataIndex: 'applyUserName'
        },
        {
            key: 'createTime',
            title: '补件下达时间',
            width: 200,
            dataIndex: 'createTime'
        },
        {
            key: 'description',
            title: '说明',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'machiningDemand',
            title: '加工说明',
            width: 200,
            dataIndex: 'machiningDemand'
        },
        {
            key: 'weldingDemand',
            title: '电焊说明',
            width: 200,
            dataIndex: 'weldingDemand'
        },
        {
            key: 'galvanizeDemand',
            title: '镀锌要求',
            width: 200,
            dataIndex: 'galvanizeDemand'
        },
        {
            key: 'packDemand',
            title: '包装说明',
            width: 200,
            dataIndex: 'packDemand'
        },
        {
            key: 'isPerforateName',
            title: '是否钻孔特殊要求',
            width: 100,
            dataIndex: 'isPerforateName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认取消下达?"
                        onConfirm={async () => {
                            let result = await RequestUtil.get<any>(`/tower-science/productCategory/assign/user/list/${record.id}`);
                            if (result.indexOf(userId) === -1) {
                                message.warning('当前登录人无取消下达权限！')
                            } else {
                                RequestUtil.delete(`/tower-science/supplyBatch/deleteBatch?id=${record.id}`).then(res => {
                                    message.success('取消下达成功');
                                    history.go(0);
                                });
                            }
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status === 2}
                    >
                        <Button disabled={record.status === 2} type="link">取消下达</Button>
                    </Popconfirm>
                    <Link to={`/workMngt/patchIssuedList/issuedDetail/${record?.id}/${record.supplyProductCategoryId}`}>下达明细</Link>
                    <Link to={`/workMngt/patchIssuedList/weldingDetail/${record?.id}/${record.supplyProductCategoryId}`}>电焊明细</Link>
                </Space>
            )
        }
    ]

    const history = useHistory();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();

    const [status, setStatus] = useState<number>(1);

    const { data: count, run: getCount } = useRequest<any>((filter: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/supplyBatch/count`, { ...filter });
        resole(data);
    }), {})

    const onFinish = (values: any) => {
        if (status === 1) {
            if (values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
        }
        setFilterValues(values)
        getCount(values)
        return values
    }

    return <>
        <SearchTable
            path={status === 1 ? "/tower-science/supplyBatch/batchPage" : "/tower-science/supplyBatch/getEntryPage"}
            exportPath={status === 1 ? '/tower-science/supplyBatch/batchPage' : '/tower-science/supplyBatch/getEntryPage'}
            columns={status === 1 ?
                columns
                :
                [{
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    fixed: 'left' as FixedType,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...patchEntryColumns,
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 50,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Link to={`/workMngt/patchIssuedList/patchIssued/${record?.id}/${record?.supplyNumber}`}>
                            <Button type='link' disabled={record?.batchStatus === 1}>选择</Button>
                        </Link>
                    )
                }]
            }
            headTabs={[]}
            style={{ maxHeight: '700px', overflow: 'auto' }}
            searchFormItems={
                status === 1 ? [
                    {
                        name: 'updateStatusTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker />
                    },
                    {
                        name: 'supplyType',
                        label: '补件类型',
                        children: <Select placeholder="请选择补件类型">
                            {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'productType',
                        label: '产品类型',
                        children: <Select placeholder="请选择产品类型">
                            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'batchStatus',
                        label: '补件下达状态',
                        children: <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value={1} key="1">已下达</Select.Option>
                            <Select.Option value={2} key="2">已取消</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input style={{ width: '300px' }} placeholder="补件下达编号/补件编号/计划号/塔型/工程名称/说明" />
                    }
                ]
                    :
                    [
                        {
                            name: 'supplyType',
                            label: '补件类型',
                            children: <Select placeholder="请选择补件类型">
                                {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        },
                        {
                            name: 'productType',
                            label: '产品类型',
                            children: <Select placeholder="请选择产品类型">
                                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        },
                        {
                            name: 'batchStatus',
                            label: '下达状态',
                            children: <Form.Item name="batchStatus">
                                <Select style={{ width: '120px' }} placeholder="请选择">
                                    <Select.Option value={1} key="1">已下达</Select.Option>
                                    <Select.Option value={2} key="2">未下达</Select.Option>
                                </Select>
                            </Form.Item>
                        },
                        {
                            name: 'fuzzyMsg',
                            label: '模糊查询项',
                            children: <Input style={{ width: '200px' }} placeholder="补件编号/计划号/工程名称/塔型名称/说明" />
                        }
                    ]
            }
            onFilterSubmit={onFinish}
            filterValue={filterValues}
            extraOperation={
                <Row gutter={12}>
                    <Col>
                        <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                            setStatus(event.target.value);
                            setFilterValues({
                                status: event.target.value
                            })
                        }}>
                            <Radio.Button value={1} key="1">补件下达</Radio.Button>
                            <Radio.Button value={2} key="2">补件条目</Radio.Button>
                        </Radio.Group>
                    </Col>
                    <Col>总件号数：<span style={{ color: '#FF8C00' }}>{count?.totalPieceNumber || 0}</span></Col>
                    <Col>总件数：<span style={{ color: '#FF8C00' }}>{count?.totalNumber || 0}</span></Col>
                    <Col>总重量（kg）：<span style={{ color: '#FF8C00' }}>{count?.totalWeight || 0}</span></Col>
                    <Col>角钢总重量（kg）：<span style={{ color: '#FF8C00' }}>{count?.angleTotalWeight || 0}</span></Col>
                    <Col>角钢冲孔重量（kg）：<span style={{ color: '#FF8C00' }}>{count?.apertureWeight || 0}</span></Col>
                    <Col>角钢钻孔重量（kg）：<span style={{ color: '#FF8C00' }}>{count?.perforateWeight || 0}</span></Col>
                    <Col>剪板重量（厚度&le;12）（kg）：<span style={{ color: '#FF8C00' }}>{count?.cutPlateWeight || 0}</span></Col>
                    <Col>火割板重量（厚度&gt;12）（kg）：<span style={{ color: '#FF8C00' }}>{count?.firePlateWeight || 0}</span></Col>

                </Row>
            }
        />
    </>
}
