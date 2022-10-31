/**
 * @author zyc
 * @copyright © 2022
 * @description 放样过程管理-补件下达列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, message, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './PatchIssued.module.less';
import { Link, useHistory } from 'react-router-dom';
import Page from '../../common/Page';
import { productTypeOptions, supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';

export default function List(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const history = useHistory();

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
            key: 'status',
            title: '补件下达状态',
            width: 120,
            dataIndex: 'status',
            type: 'select',
            enum: [
                {
                    "value": 1,
                    "label": "已下达"
                },
                {
                    "value": 2,
                    "label": "已取消"
                },
            ]
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
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认取消下达?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-science/supplyBatch/deleteBatch?id=${record.id}`).then(res => {
                                message.success('取消下达成功');
                                history.go(0);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status === 2}
                    >
                        <Button disabled={record.status === 2} type="link">取消下达</Button>
                    </Popconfirm>
                    <Link to={`/workMngt/patchIssuedList/issuedDetail/${record.supplyProductCategoryId}`}>下达明细</Link>
                    <Link to={`/workMngt/patchIssuedList/weldingDetail/${record.supplyProductCategoryId}`}>电焊明细</Link>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-science/supplyBatch/batchPage"
        columns={columns}
        headTabs={[]}
        extraOperation={<Link to={`/workMngt/patchIssuedList/patchIssued`}><Button type='primary' ghost>补件下达</Button></Link>}
        searchFormItems={[
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
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: '200px' }} placeholder="补件下达编号/补件编号/计划号/塔型/工程名称" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />
}
