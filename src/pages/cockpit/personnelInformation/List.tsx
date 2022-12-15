/**
 * @author zyc
 * @copyright © 2022 
 * @description 驾驶舱-人员工作信息
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Form } from 'antd';
import styles from './PersonnelInformation.module.less';
import { Page } from '../../common'
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
           "width": 80,
           "dataInde": "loftingTaskNumber"
       },
       {
           "key": "productCategoryName",
           "title": "月份",
           "dataIndex": "productCategoryName",
           "width": 80
       },
       {
           "key": "productTypeName",
           "title": "工程名称",
           "dataIndex": "productTypeName",
           "width": 100
       },
       {
           "key": "wasteStructureNum",
           "title": "计划号",
           "dataIndex": "wasteStructureNum",
           "width": 80
       },
       {
           "key": "wasteNum",
           "title": "塔型名称",
           "dataIndex": "wasteNum",
           "width": 100
       },
       {
           "key": "penaltyAmount",
           "title": "项目对接（塔型）",
           "dataIndex": "penaltyAmount",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "放样工作（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "放样互审（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "放样高低腿配置编制（高低腿数）",
           "dataIndex": "rejectWeight",
           "width": 150
       },
       {
           "key": "rejectWeight",
           "title": "放样校核（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "放样高低腿配置校核（高低腿数）",
           "dataIndex": "rejectWeight",
           "width": 150
       },
       {
           "key": "rejectWeight",
           "title": "放样挂线板校核（挂线板数）",
           "dataIndex": "rejectWeight",
           "width": 150
       },
       {
           "key": "rejectWeight",
           "title": "辅助出图设计（图纸数）",
           "dataIndex": "rejectWeight",
           "width": 150
       },
       {
           "key": "rejectWeight",
           "title": "提料工作（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "提料工作校核（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "编程高低腿（高低腿数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "螺栓工作（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "螺栓工作校核（件号数）",
           "dataIndex": "rejectWeight",
           "width": 140
       },
       {
           "key": "rejectWeight",
           "title": "螺栓计划（件号数）",
           "dataIndex": "rejectWeight",
           "width": 130
       },
       {
           "key": "rejectWeight",
           "title": "螺栓计划校核（件号数）",
           "dataIndex": "rejectWeight",
           "width": 150
       },
       {
           "key": "rejectWeight",
           "title": "小样图上传（件号数）",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "样板室图纸打印（图纸数量）",
           "dataIndex": "rejectWeight",
           "width": 120
       },
       {
           "key": "rejectWeight",
           "title": "样板室样板打印（样板数量）",
           "dataIndex": "rejectWeight",
           "width": 120
       }
   ]

    return <Page
            path={""}
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
                    children: <Input placeholder="工程名称/计划号/塔型名称" />
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