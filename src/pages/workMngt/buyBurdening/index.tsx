import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { baseInfo } from "./buyBurdening.json"
import { IntgSelect, Page } from '../../common'
import AuthUtil from "../../../utils/AuthUtil";
import TaskTower from './TaskTower'
export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [chooseId, setChooseId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>(history.location.state as object);
    const userId = AuthUtil.getUserId()
    const onFilterSubmit = (value: any) => {
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBatcheStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endBatcheStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        if (value.batcherId) {
            value.batcherDeptId = value.batcherId.first
            value.batcherId = value.batcherId.second
        }
        setFilterValue(value)
        return value
    }

    return <>
        <Modal title="配料方案" visible={visible} width={1011}
            footer={<Button type="primary" onClick={() => setVisible(false)}>确认</Button>} onCancel={() => setVisible(false)}>
            <TaskTower id={chooseId} />
        </Modal>
        <Page
            path="/tower-supply/purchaseTaskTower"
            exportPath={`/tower-supply/purchaseTaskTower`}
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...baseInfo,
                {
                    title: '操作',
                    width: 100,
                    fixed: "right",
                    dataIndex: 'operation',
                    //disabled={![1, 3].includes(records.batcheTaskStatus)}
                    // render: (_: any, records: any) => <Button className="btn-operation-link" type="link" disabled={userId !== records.batcherId} ><Link to={`/ingredients/buyBurdening/detail/${records.id}`}>查看</Link></Button>
                    render: (_: any, records: any) => (<>
                        <Button type="link" disabled={![1, 3].includes(records.batcheTaskStatus)} >
                            <Link to={`/ingredients/buyBurdening/component/${records.id}/${records.batcheTaskStatus}`}>明细</Link>
                        </Button>
                        <Button type="link" style={{ marginLeft: 12 }} disabled={![3].includes(records.batcheTaskStatus)}
                            onClick={() => {
                                setChooseId(records.id)
                                setVisible(true)
                            }} >配料方案</Button>
                        {/* <Button type="link" onClick={() => handleCreateComponent(records.id)
                        } >临时造数据</Button> */}
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
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="2">待接收</Select.Option>
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
                    children: <Input placeholder="批次号/塔型/计划号/任务编号/内部合同号" maxLength={200} />
                }
            ]}
        />
    </>
}
