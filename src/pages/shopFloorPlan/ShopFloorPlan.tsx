import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Modal, Row, Col, Radio, message, Table } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './ShopFloorPlan.module.less';
import RequestUtil from '../../utils/RequestUtil';
import TeamSelectionModal from '../../components/TeamSelectionModal';
import { IShopFloorPlan } from './IShopFloorPlan';
import { columns } from "./shopFloorPlan.json";
import { Link } from 'react-router-dom';

export default function ShopFloorPlan(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [form] = Form.useForm();

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }

    return <>
        <Page
            path=""
            columns={
                confirmStatus === 1 ? columns :
                [...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        confirmStatus === 1 ? <Link to={`/shopFloorPlan/shopFloorDetail/detail/${record.id }`}></Link> : null
                    )
                }]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={(data: any) =><>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未确认</Radio.Button>
                    <Radio.Button value={2}>加工中</Radio.Button>
                    <Radio.Button value={3}>已完成</Radio.Button>
                </Radio.Group>
                {confirmStatus === 1 ? <Button type="primary" disabled={ selectedKeys.length <= 0 } onClick={() => {
                    RequestUtil.post(`/tower-production/galvanized/daily/plan/confirm`, selectedKeys).then(res => {
                        message.success("确认成功");
                        setRefresh(!refresh);
                    });
                }}>确认并预排产</Button> : null}
                </>}
            refresh={refresh}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                },
                pagination: false,
                summary: (pageData) => {
                    let totalBorrow = 0;
                    let totalRepayment = 0;
                    pageData.forEach(({ borrow, repayment }) => {
                        totalBorrow += borrow;
                        totalRepayment += repayment;
                    });
            
                    return (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                <span>{totalBorrow}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                <span>{totalRepayment}</span>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    );
                }
            }}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '',
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                },
                {
                    name: 'time',
                    label: '计划完成日期',
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