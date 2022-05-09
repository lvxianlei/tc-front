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
    const [totalWeight, setTotalWeight] = useState<number>(0)
    const [totalNum, setTotalNum] = useState<number>(0)
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object
    });
    const onFilterSubmit = (value: any) => {
        // 最新状态变更时间
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.planStartTime = formatDate[0] + ' 00:00:00';
            value.planCompleteTime = formatDate[1] + ' 23:59:59';
        }
        if (value.startBatcheUpdateTime) {
            const formatDate = value.startBatcheUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStartTime = formatDate[0] + ' 00:00:00';
            value.updateEndTime = formatDate[1] + ' 23:59:59';
        }
        // 配料人
        if (value.batcherId) {
            value.feedbackUser = value.batcherId.second
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
            path="/tower-supply/materialConfirm"
            exportPath={`/tower-supply/materialConfirm`}
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
                    width: 40,
                    fixed: "right",
                    dataIndex: 'operation',
                    render: (_: any, records: any) => (
                        <>
                            <Button type="link" className='btn-operation-link' onClick={() => {
                                setChooseId(records.id);
                                setTotalWeight(records.totalWeight || 0);
                                setTotalNum(records.totalNum || 0);
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
                    name: 'materialConfirmStatus',
                    label: '任务状态',
                    children: <Select style={{ width: "100px" }} defaultValue="">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="0">待反馈</Select.Option>
                        <Select.Option value="1">已反馈</Select.Option>
                    </Select>
                },
                {
                    name: 'batcherId',
                    label: '反馈负责人',
                    children: <IntgSelect width={400} />
                },
                {
                    name: 'startBatcheUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="周期计划号" maxLength={200} />
                }
            ]}
        />
        <Overview totalWeight={totalWeight} totalNum={totalNum} visible={visible} chooseId={chooseId} handleCallBack={ handleCallBack } />
    </>
}
