/***
 * 备料确认页
 * author：mschage
 * time: 2022/05/06
 */
import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { baseInfo } from "./buyBurdening.json"
import { IntgSelect, SearchTable as Page } from '../../common'
import AuthUtil from "../../../utils/AuthUtil";
// 引入查看详情
import Overview from './OverView';
export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseId, setChooseId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        batcherId: history.location.state ? sessionStorage.getItem('USER_ID') : "",
    });
    const onFilterSubmit = (value: any) => {
        // 最新状态变更时间
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBatcheStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endBatcheStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        // 配料人
        if (value.batcherId) {
            value.batcherDeptId = value.batcherId.first
            value.batcherId = value.batcherId.second
        }
        setFilterValue(value)
        return value
    }

    // 关闭回调
    const handleCallBack = () => {
        setVisible(false);
    }

    return <>
        <Page
            path="/tower-supply/purchaseTaskTower"
            exportPath={`/tower-supply/purchaseTaskTower`}
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 50,
                    render: (_: any, _a: any, index) => <>{index + 1}</>
                },
                ...baseInfo as any,
                {
                    title: '操作',
                    width: 60,
                    fixed: "right",
                    dataIndex: 'operation',
                    render: (_: any, records: any) => (
                        <>
                            <Button type="link" className='btn-operation-link' onClick={() => {
                                setVisible(true);
                            }}>详情</Button>
                        </>
                    )
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startBatcheStatusUpdateTime',
                    label: '计划时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'batcheTaskStatus',
                    label: '任务状态',
                    children: <Select style={{ width: "100px" }} defaultValue="">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'batcherId',
                    label: '反馈负责人',
                    children: <IntgSelect width={400} />
                },
                {
                    name: 'startBatcheStatusUpdateTime1',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="批次号/计划号/周期计划号" maxLength={200} />
                }
            ]}
        />
        <Overview visible={visible} handleCallBack={ handleCallBack } />
    </>
}
