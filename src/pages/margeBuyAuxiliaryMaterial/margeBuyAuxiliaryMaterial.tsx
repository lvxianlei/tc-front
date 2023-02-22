import React, { useState, useRef } from 'react';
import { Modal, Button, DatePicker, Select, Input, message } from 'antd';
import {Attachment, BaseInfo, DetailTitle, IntgSelect, OperationRecord, SearchTable as Page} from '../common'
import {Link, useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import { purchasePlan } from './margeBuyAuxiliaryMaterial.json'
import useRequest from '@ahooksjs/use-request';
import ExportList from "../../components/export/list";

export default function MargePurchasePlan() {
    const history = useHistory();
    const location = useLocation<{ state: {} }>();
    const match = useRouteMatch()
    // 导出模态框
    const [isExport, setIsExportStoreList] = useState(false)
    const [dataSource, setDataSource] = useState<object[]>([{}])
    // 筛选组
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        inquirer: history.location.state ? sessionStorage.getItem('USER_ID') : "",
        purchaseType:2
    })



    const onFilterSubmit = (value: any) => {
        if (value.createTime) {
            const formatDate = value.createTime.map((item: any) => item.format("YYYY-MM-DD"))
            delete value.createTime
            value.startCreateTime = formatDate[0] + ' 00:00:00';
            value.endCreateTime = formatDate[1] + ' 23:59:59';
        }else{
            value.startCreateTime = null
            value.endCreateTime = null
        }
        if (value.purchaserId) {
            value.purchaserId = value.purchaserId.value
        }else{
            value.purchaserId = null
        }
        setFilterValue({...filterValue,...value})
        return value
    }
    return (
        <>
            <Page
                path="/tower-supply/auxiliaryMaterialPurchasePlan/collect"
                exportPath="/tower-supply/auxiliaryMaterialPurchasePlan/collect"
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...purchasePlan.map((item: any) => {
                        return ({ ...item})
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 80,
                        render: (_: any, records: any) => <>
                            <Button type="link" className="btn-operation-link">
                                <Link className="btn-operation-link" to={{
                                    pathname: `/buyAuxiliaryMaterial/margeBuyAuxiliaryMaterial/${records.id}`,
                                    search: `${records.purchasePlanNumber || records.collectPurchasePlanNumber},${records.repurchaseTime == null ? '': records.repurchaseTime},${records.purchasePlanStatus},${1}`
                                }}>采购清单</Link>
                            </Button>
                        </>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'planStatus',
                        label: '计划状态',
                        children: <Select style={{ width: 100 }} >
                            <Select.Option value="" key="">全部</Select.Option>
                            <Select.Option value={1} key={1}>待完成</Select.Option>
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                            <Select.Option value={3} key={3}>已取消</Select.Option>
                        </Select>
                    },
                    {
                        name: 'createTime',
                        label: '创建日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'purchaserId',
                        label: '制单人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '模糊查询',
                        children: <Input placeholder="汇总采购任务编号" style={{ width: 260 }} maxLength={200} />
                    }
                ]}
            />
        </>
    )
}