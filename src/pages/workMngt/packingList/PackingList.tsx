/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-包装列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Popconfirm, message, Button } from 'antd';
import styles from './PackingList.module.less';
import Page from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable, IntgSelect } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [filterValue, setFilterValue] = useState<any>({});
    const history = useHistory();

    const columns = [
        {
            "key": "year",
            "title": "放样任务编号",
            "width": 120,
            "dataIndex": "year"
        },
        {
            "key": "month",
            "title": "计划号",
            "dataIndex": "month",
            "width": 200
        },
        {
            "key": "group",
            "title": "内部合同编号",
            "dataIndex": "group",
            "width": 80
        },
        {
            "key": "userName",
            "title": "塔型",
            "dataIndex": "userName",
            "width": 50
        },
        {
            "key": "settleMethod",
            "title": "工程名称",
            "dataIndex": "settleMethod",
            "width": 120
        },
        {
            "key": "attendance",
            "title": "杆塔（基）",
            "dataIndex": "attendance",
            "width": 120
        },
        {
            "key": "workOvertime",
            "title": "打包负责人",
            "dataIndex": "workOvertime",
            "width": 120
        },
        {
            "key": "totalAttendance",
            "title": "计划完成时间",
            "dataIndex": "totalAttendance",
            "width": 120
        },
        {
            "key": "baseSalary",
            "title": "实际完成时间",
            "dataIndex": "baseSalary",
            "width": 120
        },
        {
            "key": "pieceSalary",
            "title": "任务打包状态",
            "dataIndex": "pieceSalary",
            "width": 120
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <>
                    <Popconfirm
                        title="确认完成打包?"
                        onConfirm={async () => {
                            await RequestUtil.get(``).then(() => {
                                message.success('完成打包成功！')
                            }).then(() => {
                                history.go(0)
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        完成打包
                    </Popconfirm>
                </>

            )
        }
    ]

    const detailColumns = [
        {
            "key": "projectName",
            "title": "杆塔号",
            "width": 80,
            "dataIndex": "projectName"
        },
        {
            "key": "planNumber",
            "title": "呼高",
            "width": 120,
            "dataIndex": "planNumber"
        },
        {
            "key": "productTypeName",
            "title": "基数",
            "dataIndex": "productTypeName",
            "width": 80
        },
        {
            "key": "voltageGradeName",
            "title": "总件数",
            "dataIndex": "voltageGradeName",
            "width": 80
        },
        {
            "key": "productCategoryName",
            "title": "已打包件数",
            "dataIndex": "productCategoryName",
            "width": 120
        },
        {
            "key": "pieceOrSundry",
            "title": "未打包件数",
            "dataIndex": "pieceOrSundry",
            "width": 120
        },
        {
            "key": "category",
            "title": "包数",
            "dataIndex": "category",
            "width": 120
        },
        {
            "key": "entry",
            "title": "杆塔打包状态",
            "dataIndex": "entry",
            "width": 120,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <>
                    <Link to={{ pathname: `/workMngt/setOutList/poleInformation/${record.id}/packingList/${record.id}`, state: { status: record?.loftingStatus } }}>
                        <Button type="link">包装清单</Button>
                    </Link>
                </>

            )
        }
    ]

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/salary/getSalary/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
    }

    return <>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Page
                path={"/tower-science/salary"}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        fixed: "left" as FixedType,
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...columns]}
                onGetDataSource={(e) => {
                    if (e.length > 0 && e[0]?.id) {
                        detailRun(e[0]?.id)
                    } else {
                        setDetailData([]);
                    }
                    return e
                }}
                tableProps={{
                    onRow: (record: Record<string, any>) => ({
                        onClick: () => onRowChange(record),
                        className: styles.tableRow
                    })
                }}
                headTabs={[]}
                searchFormItems={[
                    {
                        name: 'updateStatusTime',
                        label: '任务打包状态',
                        children: <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value="" key="6">全部</Select.Option>
                            <Select.Option value={1} key="1">完成打包</Select.Option>
                            <Select.Option value={2} key="2">部分打包</Select.Option>
                            <Select.Option value={3} key="3">未打包</Select.Option>
                        </Select>
                    },
                    {
                        name: 'userId',
                        label: '打包负责人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="编号/计划号/合同号/塔型/工程名称" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    if (values.userId) {
                        values.userId = values.userId?.value;
                    }
                    setFilterValue(values);
                    return values;
                }}
            />
            <CommonTable
                haveIndex
                columns={detailColumns}
                dataSource={detailData || []}
                pagination={false} />
        </Space>
    </>
}