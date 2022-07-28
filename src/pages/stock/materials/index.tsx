/**
 * 原材料盘点
 * time: 2022-07-27
 * author: mschange
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Select } from 'antd';
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
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/guarantee/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.applicantStartTime = `${formatDate[0]} 00:00:00`
            value.applicantEndTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        if (value.issuanceDateTime) {
            const formatDate = value.issuanceDateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.issuanceStartTime = `${formatDate[0]} 00:00:00`
            value.issuanceEndTime = `${formatDate[1]} 23:59:59`
            delete value.issuanceDateTime
        }
        if (value.guaranteeTime) {
            const formatDate = value.guaranteeTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.recoveryStartTime = `${formatDate[0]} 00:00:00`
            value.recoveryEndTime = `${formatDate[1]} 23:59:59`
            delete value.guaranteeTime
        }
        setFilterValue({ ...filterValue, ...value })
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
                path="/tower-finance/guarantee"
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
                        width: 100,
                        render: (_: any, record: any) => {
                            return (
                                <>
                                    <Button type="link"
                                        className="btn-operation-link" onClick={() => {
                                            setIsOpenOverViewId(true);
                                        }}>详情</Button>
                                    <Button type="link"
                                        className="btn-operation-link">编辑</Button>
                                    <Button
                                        className="btn-operation-link"
                                        type="link">删除</Button>
                                </>
                            )
                        }
                    }]}
                refresh={refresh}
                clearSearch={clearSearch}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                extraOperation={<>
                    <Button type="primary" ghost  onClick={() => setIsOpenId(true)}>创建</Button>
                </>}
                searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '盘点日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'issuanceDateTime',
                        label: '盘点状态',
                        children:  <Select style={{ width: "100px" }} defaultValue="">
                            <Select.Option value="">全部</Select.Option>
                            <Select.Option value="1">盘点中</Select.Option>
                            <Select.Option value="3">已盘点</Select.Option>
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
            />
            <OverView
                visible={isOpenOverViewId}
                handleCreate={handleOverView}
            />
        </>
    )
}