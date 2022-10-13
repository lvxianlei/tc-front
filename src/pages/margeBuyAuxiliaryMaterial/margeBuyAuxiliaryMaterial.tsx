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
        if (value.createdTime) {
            const formatDate = value.createdTime.map((item: any) => item.format("YYYY-MM-DD"))
            delete value.createdTime
            value.createdTime = formatDate[0] + ' 00:00:00';
            value.createdTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValue({...filterValue,...value})
        return value
    }
    return (
        <>
            <Page
                path="/tower-supply/auxiliaryMaterialPurchasePlan/collect"
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
                                    pathname: `/margeBuyAuxiliaryMaterial/margeBuyAuxiliaryMaterial/${records.id}`,
                                    search: `${records.purchasePlanNumber || records.collectPurchasePlanNumber},${records.repurchaseTime == null ? '': records.repurchaseTime},${records.purchasePlanStatus}`
                                }}>采购清单</Link>
                            </Button>
                        </>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<>
                    <Button
                        type="primary"
                        ghost
                        key="export"
                        style={{ marginRight: 16 }}
                        onClick={() => {
                            setIsExportStoreList(true)
                        }}
                    >导出</Button>
                    {isExport?<ExportList
                        history={history}
                        location={location}
                        match={match}
                        columnsKey={() => {
                            let keys = [...purchasePlan]
                            keys.pop()
                            return keys
                        }}
                        current={1}
                        size={10}
                        total={1000}
                        url={`/tower-supply/auxiliaryMaterialPurchasePlan/collect`}
                        serchObj={{}}
                        closeExportList={() => { setIsExportStoreList(false) }}
                    />:null}
                </>}
                searchFormItems={[
                    {
                        name: 'planStatus',
                        label: '计划状态',
                        children: <Select style={{ width: 100 }} defaultValue="">
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
                        name: 'collectType',
                        label: '汇总状态',
                        children: <Select style={{ width: 100 }} defaultValue="">
                            <Select.Option value="" key={""}>全部</Select.Option>
                            <Select.Option value={0} key={0}>未汇总</Select.Option>
                            <Select.Option value={1} key={1}>已汇总</Select.Option>
                        </Select>
                    },
                    {
                        name: 'purchaserName',
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