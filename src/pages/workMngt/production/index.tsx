import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "./productionData.json"
import Overview from "./Edit"
export default function Invoicing() {
    const [visible, setVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0]+" 00:00:00"
            value.endStatusUpdateTime = formatDate[1]+" 23:59:59"
        }
        return value
    }

    return <>
        <Modal title="配料方案" visible={visible} width={1011} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
            <Overview id={detailId} />
        </Modal>
        <Page
            path="/tower-supply/produceIngredients"
            columns={[
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Link to={`/workMngt/production/detailed/${record.productionBatch}`}>明细</Link>
                            <Button type="link"
                                onClick={() => {
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>配料单</Button>
                            <Button type="link"
                                    onClick={() => {

                                    }}>生成放样构件</Button>
                            <Button type="link"
                                    onClick={() => {

                                    }}>生成差异列表</Button>
                            </>
                    }
                }]}
            extraOperation={<><Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost>临时生成生产数据</Button>
            </>}

            onFilterSubmit={onFilterSubmit}
            searchFormItems={[

                {
                    name: 'startStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'loftingState',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="">全部</Select.Option>、
                        <Select.Option value="1">待完成</Select.Option>、
                        <Select.Option value="2">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'loftingId',
                    label: '配料负责人',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">待完成</Select.Option>、
                        <Select.Option value="2">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="方案编号/任务编号/生产批次/塔型" style={{ width: 300 }} />
                }
            ]}
        />
    </>
}
