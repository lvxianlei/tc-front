import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { baseInfo } from "./buyBurdening.json"
import { IntgSelect, SearchTable as Page } from '../../common'
import AuthUtil from "../../../utils/AuthUtil";
import TaskTower from './TaskTower'
export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseId, setChooseId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>(history.location.state as object);
    const userId = AuthUtil.getUserId()
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

    return <>
        <Modal title="配料方案" visible={visible} width={1011}
            footer={<Button type="primary" ghost onClick={() => setVisible(false)}>关闭</Button>} onCancel={() => setVisible(false)}>
            <TaskTower id={chooseId} />
        </Modal>
        <Page
            path="/tower-supply/purchaseTaskTower"
            exportPath={`/tower-supply/purchaseTaskTower`}
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...baseInfo as any,
                {
                    title: '操作',
                    width: 120,
                    fixed: "right",
                    dataIndex: 'operation',
                    render: (_: any, records: any) => (<>
                        <Button type="link" className='btn-operation-link' disabled={![1, 3].includes(records.batcheTaskStatus)} >
                            {/* <Link to={`/ingredients/buyBurdening/component/${records.id}/${records.batcheTaskStatus}`}>配料</Link> */}
                            <Link to={`/ingredients/buyBurdening/ingredientsList/${records.id}/${records.batcheTaskStatus}`}>配料</Link>
                        </Button>
                        {/* <Button type="link" className='btn-operation-link' disabled={![3].includes(records.batcheTaskStatus)}
                            onClick={() => {
                                setChooseId(records.id)
                                setVisible(true)
                            }} >配料方案</Button> */}
                        <Button type="link" className='btn-operation-link'>
                            <Link to={`/ingredients/buyBurdening/batchingScheme/${records.id}`}>配料方案</Link>
                        </Button>
                    </>)
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startBatcheStatusUpdateTime',
                    label: '最新状态变更时间',
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
                    children: <IntgSelect width={400} />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="批次号/塔型/计划号" maxLength={200} />
                }
            ]}
        />
    </>
}
