/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-包装列表
 */

import React, { useState } from 'react';
import { Space, Input, Select, Popconfirm, message, Button } from 'antd';
import styles from './PackingList.module.less';
import Page from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable, IntgSelect, SearchTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [filterValue, setFilterValue] = useState<any>({});
    const history = useHistory();

    const columns = [
        {
            "key": "taskNum",
            "title": "放样任务编号",
            "width": 120,
            "dataIndex": "taskNum"
        },
        {
            "key": "planNumber",
            "title": "计划号",
            "dataIndex": "planNumber",
            "width": 200
        },
        {
            "key": "internalNumber",
            "title": "内部合同编号",
            "dataIndex": "internalNumber",
            "width": 80
        },
        {
            "key": "name",
            "title": "塔型",
            "dataIndex": "name",
            "width": 50
        },
        {
            "key": "projectName",
            "title": "工程名称",
            "dataIndex": "projectName",
            "width": 120
        },
        {
            "key": "num",
            "title": "杆塔（基）",
            "dataIndex": "num",
            "width": 120
        },
        {
            "key": "packageUserName",
            "title": "打包负责人",
            "dataIndex": "packageUserName",
            "width": 120
        },
        {
            "key": "programmingDeliverTime",
            "title": "计划完成时间",
            "dataIndex": "programmingDeliverTime",
            "width": 120
        },
        {
            "key": "packageEndTime",
            "title": "实际完成时间",
            "dataIndex": "packageEndTime",
            "width": 120
        },
        {
            "key": "packageStatusName",
            "title": "任务打包状态",
            "dataIndex": "packageStatusName",
            "width": 120
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <>
                    <Popconfirm
                        title="确认完成打包?"
                        onConfirm={async () => {
                            await RequestUtil.post(`/tower-science/packageStructure/submit/all/${record?.id}`).then(() => {
                                message.success('完成打包成功！')
                            }).then(() => {
                                history.go(0)
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.packageStatus === 2}
                    >
                        <Button type='link' disabled={record.packageStatus === 2}>完成打包</Button>
                    </Popconfirm>
                </>

            )
        }
    ]

    const detailColumns = [
        {
            "key": "productNumber",
            "title": "杆塔号",
            "width": 80,
            "dataIndex": "productNumber"
        },
        {
            "key": "productHeight",
            "title": "呼高",
            "width": 120,
            "dataIndex": "productHeight"
        },
        {
            "key": "num",
            "title": "基数",
            "dataIndex": "num",
            "width": 80
        },
        {
            "key": "count",
            "title": "总件数",
            "dataIndex": "count",
            "width": 80
        },
        {
            "key": "processedCount",
            "title": "已打包件数",
            "dataIndex": "processedCount",
            "width": 120
        },
        {
            "key": "untreatedCount",
            "title": "未打包件数",
            "dataIndex": "untreatedCount",
            "width": 120
        },
        {
            "key": "packageStructureCount",
            "title": "包数",
            "dataIndex": "packageStructureCount",
            "width": 120
        },
        {
            "key": "packageStatus",
            "title": "杆塔打包状态",
            "dataIndex": "packageStatus",
            "type": "select",
            "enum": [
                {
                    "label": "未完成",
                    "value": 0
                },
                {
                    "label": "已完成",
                    "value": 1
                }
            ],
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
                    <Link to={{ pathname: `/workMngt/setOutList/poleInformation/${record.productCategory}/packingList/${record.id}`, state: { status: record?.packageStatus } }}>
                        <Button type="link">包装清单</Button>
                    </Link>
                </>

            )
        }
    ]

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/product/package/list/${id}`);
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
            <SearchTable
                path={"/tower-science/loftingList"}
                exportPath="/tower-science/loftingList"
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
                onGetDataSource={(e: any) => {
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
                        name: 'packageStatus',
                        label: '任务打包状态',
                        children: <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value="" key="6">全部</Select.Option>
                            <Select.Option value={0} key="0">未打包</Select.Option>
                            <Select.Option value={1} key="1">部分打包</Select.Option>
                            <Select.Option value={2} key="2">完成打包</Select.Option>
                        </Select>
                    },
                    {
                        name: 'packageUser',
                        label: '打包负责人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'packageFuzzyMsg',
                        label: '模糊查询项',
                        children: <Input width={200} placeholder="编号/计划号/合同号/塔型/工程名称" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: any) => {
                    if (values.packageUser) {
                        values.packageUser = values.packageUser?.value;
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