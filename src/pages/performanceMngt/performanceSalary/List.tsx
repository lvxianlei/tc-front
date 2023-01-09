/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-人员工资绩效
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker } from 'antd';
import styles from './PerformanceSalary.module.less';
import Page from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable, IntgSelect } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [filterValue, setFilterValue] = useState<any>({});

    const columns = [
        {
            "key": "year",
            "title": "年份",
            "width": 120,
            "dataIndex": "year"
        },
        {
            "key": "month",
            "title": "月份",
            "dataIndex": "month",
            "width": 200
        },
        {
            "key": "group",
            "title": "小组",
            "dataIndex": "group",
            "width": 80
        },
        {
            "key": "userName",
            "title": "姓名",
            "dataIndex": "userName",
            "width": 50
        },
        {
            "key": "settleMethod",
            "title": "结算方式",
            "dataIndex": "settleMethod",
            "width": 120
        },
        {
            "key": "attendance",
            "title": "出勤（天）",
            "dataIndex": "attendance",
            "width": 120
        },
        {
            "key": "workOvertime",
            "title": "加班（时）",
            "dataIndex": "workOvertime",
            "width": 120
        },
        {
            "key": "totalAttendance",
            "title": "出勤总计（时）",
            "dataIndex": "totalAttendance",
            "width": 120
        },
        {
            "key": "baseSalary",
            "title": "底薪",
            "dataIndex": "baseSalary",
            "width": 120
        },
        {
            "key": "pieceSalary",
            "title": "计件工资",
            "dataIndex": "pieceSalary",
            "width": 120
        },
        {
            "key": "sundryMerits",
            "title": "杂项绩效",
            "dataIndex": "sundryMerits",
            "width": 120
        },
        {
            "key": "pieceTotal",
            "title": "计件合计",
            "dataIndex": "pieceTotal",
            "width": 120
        },
        {
            "key": "qualityAssess",
            "title": "质量考核",
            "dataIndex": "qualityAssess",
            "width": 120
        },
        {
            "key": "violationAssess",
            "title": "违纪考核",
            "dataIndex": "violationAssess",
            "width": 120
        },
        {
            "key": "issuedSalary",
            "title": "实发工资",
            "dataIndex": "issuedSalary",
            "width": 120
        },
        {
            "key": "confirmUserName",
            "title": "确认人",
            "dataIndex": "confirmUserName",
            "width": 120
        },
        {
            "key": "confirmTime",
            "title": "确认日期",
            "dataIndex": "confirmTime",
            "width": 120
        }
    ]

    const detailColumns = [
        {
            "key": "projectName",
            "title": "工程名称",
            "width": 80,
            "dataIndex": "projectName"
        },
        {
            "key": "planNumber",
            "title": "计划号",
            "width": 120,
            "dataIndex": "planNumber"
        },
        {
            "key": "productTypeName",
            "title": "产品类型",
            "dataIndex": "productTypeName",
            "width": 80
        },
        {
            "key": "voltageGradeName",
            "title": "电压等级",
            "dataIndex": "voltageGradeName",
            "width": 80
        },
        {
            "key": "productCategoryName",
            "title": "塔型名称",
            "dataIndex": "productCategoryName",
            "width": 120
        },
        {
            "key": "pieceOrSundry",
            "title": "计件/杂项",
            "dataIndex": "pieceOrSundry",
            "width": 120
        },
        {
            "key": "category",
            "title": "定额类别",
            "dataIndex": "category",
            "width": 120
        },
        {
            "key": "entry",
            "title": "定额条目/派工事项",
            "dataIndex": "entry",
            "width": 120,
        },
        {
            "key": "unitPrice",
            "title": "单价",
            "dataIndex": "unitPrice",
            "width": 120
        },
        {
            "key": "workHours",
            "title": "数量/工时",
            "dataIndex": "workHours",
            "width": 120
        },
        {
            "key": "salary",
            "title": "工资",
            "dataIndex": "salary",
            "width": 120
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
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker picker="month"/>
                    },
                    {
                        name: 'userId',
                        label: '姓名',
                        children: <IntgSelect width={200} />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    if (values.updateStatusTime) {
                        const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM"));
                        values.timeStart = formatDate[0];
                        values.timeEnd = formatDate[1];
                    }
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