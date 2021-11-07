import React, { useState } from 'react'
import {Input, DatePicker, Select, Button, Form, Modal, message} from 'antd'
import { useHistory, Link, useParams } from 'react-router-dom'
import { Page } from '../../common';
import { SeeList } from "./buyBurdening.json"
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
export default function Overview(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const [filterValue, setFilterValue] = useState({ purchaseTaskId: params.id });
    const onFilterSubmit = (value: any) => {
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBatcheStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endBatcheStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    const { run: createComponent } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/initData/materialWithdrawal?purchaseTaskTowerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const handleCreateComponent = (id: string) => {
        Modal.confirm({
            title: "生成提料数据",
            content: "确定要生成提料数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await createComponent(id))
                    message.success("生成提料数据...")
                    // history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    return <>
        <Page
            path="/tower-supply/purchaseTaskTower"
            columns={[
                ...SeeList,
                {
                    title: '操作',
                    width: 250,
                    dataIndex: 'operation',
                    render: (_: any, records: any) => (<>
                        <Link to={`/workMngt/buyBurdening/component/${records.id}`}>明细</Link>
                        <Button type="link" >配料方案</Button>
                        <Button type="link" onClick={()=> handleCreateComponent(records.id)
                        } >临时造数据</Button>
                    </>)
                }
            ]}
            extraOperation={<Button type="primary" ghost>导出</Button>}
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
                    label: '塔型配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待接收</Select.Option>
                        <Select.Option value="2">待完成</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="塔型/方案编号" maxLength={200} />
                },
            ]}
        />
    </>
}
