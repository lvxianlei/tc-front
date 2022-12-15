import React, { useState } from 'react'
import { Input, DatePicker, Select, Button } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { baseInfo } from "./buyBurdening.json"
import { IntgSelect, SearchTable as Page } from '../../common'
import AuthUtil from "../../../utils/AuthUtil";
import CreatePlan from "./CreatePlan";

export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseId, setChooseId] = useState<string>("")
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        batcherId: history.location.state ? sessionStorage.getItem('USER_ID') : "",
    });
    const onFilterSubmit = (value: any) => {
        // 最新状态变更时间
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startTaskFinishTime = formatDate[0] + ' 00:00:00';
            value.endTaskFinishTime = formatDate[1] + ' 23:59:59';
        }
        // 配料人
        if (value.batcherId) {
            value.batcherDeptId = value.batcherId.first
            value.batcherId = value.batcherId.value
        }
        setFilterValue(value)
        return value
    }

     // 创建关闭
     const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }

    return <>
        <Page
            path="/tower-supply/task/purchase/batcher"
            exportPath="/tower-supply/task/purchase/batcher"
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...baseInfo as any,
                {
                    title: '操作',
                    width: 120,
                    fixed: "right",
                    dataIndex: 'operation',
                    render: (_: any, records: any) => {
                        return <>
                            <Button type="link" className='btn-operation-link'  >
                                <Link to={`/ingredients/buyBurdening/ingredientsList/${records.id}/${records.batcheTaskStatus}/${records.batchNumber}/${records.productCategoryName}/${records.materialStandardName || "--"}`}>配料</Link>
                            </Button>
                            <Button type="link" className='btn-operation-link'>
                                <Link to={`/ingredients/buyBurdening/batchingScheme/${records.id}/${records.batcheTaskStatus}`}>配料方案</Link>
                            </Button>
                        </>
                    }
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            extraOperation={<>
                <Button type="primary" ghost onClick={() => {
                    setIsOpenId(true)
                }}>创建</Button>
            </>}
            searchFormItems={[
                {
                    name: 'startBatcheStatusUpdateTime',
                    label: '配料完成时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'batcheTaskStatus',
                    label: '配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'batcherId',
                    label: '配料人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'executingStatus',
                    label: '执行状态',
                    children: <Select placeholder="请选择" style={{ width: "100px" }}>
                        <Select.Option value="0">正常</Select.Option>
                        <Select.Option value="1">取消</Select.Option>
                        <Select.Option value="2">暂停</Select.Option>
                        <Select.Option value="3">作废</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="批次号/塔型/计划号" maxLength={200} />
                }
            ]}
        />
        <CreatePlan
            visible={isOpenId}
            handleCreate={handleCreate}
        />
    </>
}
