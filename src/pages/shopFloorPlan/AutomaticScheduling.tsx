import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Modal, Row, Col, Radio, message, Table } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './ShopFloorPlan.module.less';
import RequestUtil from '../../utils/RequestUtil';
import TeamSelectionModal from '../../components/TeamSelectionModal';
import { IShopFloorPlan } from './IShopFloorPlan';
import { detailColumns } from "./shopFloorPlan.json";
import { Link } from 'react-router-dom';

export default function AutomaticScheduling(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);

    return <>
        <Page
            path=""
            columns={
                confirmStatus === 1 ? detailColumns :
                [...detailColumns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    "fixed": "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type='link'>调整</Button>
                    )
                }]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={(data: any) =><>

                </>}
            refresh={refresh}
            tableProps={{
                pagination: false
            }}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '',
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                },
                {
                    name: 'time',
                    label: '送齐时间',
                    children: <DatePicker.RangePicker />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                    values.galvanizedStartTime = formatDate[0];
                    values.galvanizedEndTime = formatDate[1];
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
}