/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-人员工资绩效
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Form } from 'antd';
import styles from './PerformanceSalary.module.less';
import Page from '../../common/Page';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [visible, setVisible] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const history = useHistory();
    const [filterValue, setFilterValue] = useState<any>({});

    const columns= [
       {
           "key": "loftingTaskNumber",
           "title": "年份",
           "width": 120,
           "dataIndex": "loftingTaskNumber"
       },
       {
           "key": "productCategoryName",
           "title": "月份",
           "dataIndex": "productCategoryName",
           "width": 200
       },
       {
           "key": "productTypeName",
           "title": "小组",
           "dataIndex": "productTypeName",
           "width": 80
       },
       {
           "key": "wasteStructureNum",
           "title": "姓名",
           "dataIndex": "wasteStructureNum",
           "width": 50
       },
       {
           "key": "wasteNum",
           "title": "结算方式",
           "dataIndex": "wasteNum",
           "width": 120
       },
       {
           "key": "penaltyAmount",
           "title": "出勤（天）",
           "dataIndex": "penaltyAmount",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "加班（时）",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "出勤总计（时）",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "底薪",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "计件工资",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "杂项绩效",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "计件合计",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "质量考核",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "违纪考核",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "实发工资",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "确认人",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "确认日期",
           "dataIndex": "rejectWeight",
           "width": 120
       }
   ]

   const detailColumns= [
       {
           "key": "planNumber",
           "title": "工程名称",
           "width": 80,
           "dataIndex": "planNumber"
       },
       {
           "key": "loftingTaskNumber",
           "title": "计划号",
           "width": 120,
           "dataIndex": "loftingTaskNumber"
       },
       {
           "key": "productCategoryName",
           "title": "产品类型",
           "dataIndex": "productCategoryName",
           "width": 80
       },
       {
           "key": "productTypeName",
           "title": "电压等级",
           "dataIndex": "productTypeName",
           "width": 80
       },
       {
           "key": "wasteStructureNum",
           "title":"塔型名称",
           "dataIndex": "wasteStructureNum",
           "width": 120
       },
       {
           "key": "wasteNum",
           "title": "计件/杂项",
           "dataIndex": "wasteNum",
           "width": 120
       },
       {
           "key": "penaltyAmount",
           "title": "定额类别",
           "dataIndex": "penaltyAmount",
           "width": 120,
           "type": "number"
       },
       {
           "key": "rejectWeight",
           "title": "定额条目/派工事项",
           "dataIndex": "rejectWeight",
           "width": 120,
       },
       {
           "key": "rejectAmount",
           "title": "单价",
           "dataIndex": "rejectAmount",
           "width": 120
       },
       {
           "key": "rejectAmount",
           "title": "数量/工时",
           "dataIndex": "rejectAmount",
           "width": 120
       },
       {
           "key": "rejectAmount",
           "title": "工资",
           "dataIndex": "rejectAmount",
           "width": 120
       }
   ]

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/wasteProductReceipt/structure/list/${id}`);
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
            path={"/tower-science/productStructure/supply/entry/list"}
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
            onRow:(record: Record<string, any>) => ({
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })
        }}
            headTabs={[]}
            searchFormItems={[
                {
                    name: 'updateStatusTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="姓名" />
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
            <CommonTable
                haveIndex
                columns={detailColumns}
                dataSource={detailData || []}
                pagination={false} />
        </Space>
    </>
}