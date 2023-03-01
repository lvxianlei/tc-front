/**
 * 原材料盘点
 * time: 2022-07-27
 * author: mschange
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Select, Popconfirm, message } from 'antd';
import useRequest from '@ahooksjs/use-request'
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { SearchTable as Page } from '../../common';
import {
    baseInfoColumn
} from "./materials.json";
import CreatePlan from "./CreatePlan";
import OverView from './OverView';

export default function Materials(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [ clearSearch, setClearSearch ] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<any>({})
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [isOpenOverViewId, setIsOpenOverViewId] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [id, setId] = useState<string>("");
    const [warehouseName, setWarehouseName] = useState<string>("");
    const [stockTakingNumber, setStockTakingNumber] = useState<string>("");
    const [warehouseId, setWarehouseId] = useState<string>("")
    const [takingNumberStatus, setTakingNumberStatus] = useState<number | string>("");

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStockTakingTime = `${formatDate[0]} 00:00:00`
            value.endStockTakingTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        // setFilterValue({ ...filterValue, ...value })
        return value
    }

    // 新建盘点关闭
    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }

    const handleOverView = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenOverViewId(false);
    }

    return (
        <>
            <Page
                path="/tower-storage/stockTaking"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => {
                            return (
                                <span>
                                    {index + 1}
                                </span>
                            )
                        }
                    },
                    ...baseInfoColumn as any,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 150,
                        render: (_: any, record: any) => {
                            return (
                                <>
                                    <Button type="link"
                                        className="btn-operation-link" onClick={() => {
                                            setIsOpenOverViewId(true);
                                            setId(record?.id);
                                            setWarehouseName(record?.warehouseName);
                                            setStockTakingNumber(record?.stockTakingNumber);
                                            setTakingNumberStatus(record?.takingNumberStatus)
                                            setWarehouseId(record?.warehouseId)
                                        }}>详情</Button>
                                    <Button
                                        type="link"
                                        className="btn-operation-link"
                                        disabled={(+record?.takingNumberStatus) !== 0}
                                        onClick={() => {
                                            setId(record?.id);
                                            setStockTakingNumber(record?.stockTakingNumber);
                                            setWarehouseName(record?.warehouseName);
                                            setWarehouseId(record?.warehouseId);
                                            setTakingNumberStatus(record?.takingNumberStatus)
                                            setIsOpenId(true)
                                            setIsEdit(true);
                                        }}
                                    >编辑</Button>
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={() => {
                                            RequestUtil.delete(`/tower-storage/stockTaking/${record.id}`).then(res => {
                                                message.success("删除成功！");
                                                history.go(0);
                                            });
                                        }}
                                        okText="确认"
                                        className="btn-operation-link"
                                        cancelText="取消"
                                        disabled={(+record?.takingNumberStatus) !== 0}
                                    >
                                        <Button type="link" className="btn-operation-link" disabled={(+record?.takingNumberStatus) !== 0}>删除</Button>
                                    </Popconfirm>
                                </>
                            )
                        }
                    }]}
                refresh={refresh}
                clearSearch={clearSearch}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                extraOperation={<>
                    <Button type="primary" ghost onClick={() => {
                        setId("");
                        setStockTakingNumber("");
                        setWarehouseName("");
                        setWarehouseId("")
                        setIsOpenId(true)
                        setIsEdit(false);
                    }}>创建</Button>
                </>}
                searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '盘点日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'takingNumberStatus',
                        label: '盘点状态',
                        children:  <Select style={{ width: "100px" }} defaultValue={""}>
                            <Select.Option value="">全部</Select.Option>
                            <Select.Option value="0">盘点中</Select.Option>
                            <Select.Option value="1">已盘点</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入盘点单号/盘点仓库/盘点人查询" style={{ width: 300 }} />
                    }
                ]}
            />
            <CreatePlan
                visible={isOpenId}
                handleCreate={handleCreate}
                isEdit={isEdit}
                stockTakingNumber={stockTakingNumber}
                warehouseId={warehouseId}
                warehouseName={warehouseName}
                takingNumberStatus={takingNumberStatus}
                id={id}
            />
            <OverView
                visible={isOpenOverViewId}
                handleCreate={handleOverView}
                id={id}
                warehouseName={warehouseName}
                stockTakingNumber={stockTakingNumber}
                takingNumberStatus={takingNumberStatus}
                warehouseId={warehouseId}
            />
        </>
    )
}