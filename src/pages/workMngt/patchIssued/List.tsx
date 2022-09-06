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
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
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
            key: 'planNumber',
            title: '补件下达编号',
            width: 120,
            dataIndex: 'planNumber'
        },
        {
            key: 'projectName',
            title: '补件下达类型',
            width: 120,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '最新状态变更时间',
            width: 120,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '补件类型',
            width: 120,
            dataIndex: 'projectName'
        },
        {
            key: 'productCategoryName',
            title: '计划号',
            width: 120,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryProportion',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryProportion'
        },
        {
            key: 'productProportion',
            title: '工程名称',
            dataIndex: 'productProportion',
            width: 100
        },
        {
            key: 'weight',
            title: '电压等级',
            width: 120,
            dataIndex: 'weight'
        },
        {
            key: 'statusName',
            title: '产品类型',
            dataIndex: 'statusName',
            width: 120
        },
        {
            key: 'updateStatusTime',
            title: '补件数量',
            width: 120,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'plannedDeliveryTime',
            title: '补件重量',
            width: 150,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'taskNum',
            title: '申请部门',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '申请人',
            width: 200,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '补件下达时间',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '说明',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '加工说明',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '电焊说明',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '镀锌要求',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '包装说明',
            width: 200,
            dataIndex: 'internalNumber'
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
                        onConfirm={ () => {
                            RequestUtil.delete(``).then(res => {
                                message.success('取消下达成功');
                                history.go(0);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">取消下达</Button>
                    </Popconfirm>
                    <Link to={`/workMngt/patchIssuedList/issuedDetail/${record.id}`}>下达明细</Link>
                    <Link to={`/workMngt/patchIssuedList/weldingDetail/${record.id}`}>电焊明细</Link>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-science/loftingTask/taskPage"
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
                name: 'updateStatusTime',
                label: '补件类型',
                children: <Select placeholder="请选择补件类型">
                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                    return <Select.Option key={index} value={id}>
                        {name}
                    </Select.Option>
                })}
            </Select>
            },
            {
                name: 'updateStatusTime',
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
                children: <Input placeholder="补件下达编号/计划号/塔型/工程名称" />
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