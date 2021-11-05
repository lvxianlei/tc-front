import React, { useState, useRef } from 'react'
import { Input, DatePicker, Select, Button, Modal, message } from 'antd'
import { Page } from '../../common';
import { baseInfo } from "./enquiryList.json"
import Edit from "./Edit"
export default function EnquiryList(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState({})
    const [detailId, setDetailId] = useState<string>("")
    const editRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }

    const handleModal = () => new Promise(async (resove, reject) => {
        try {
            const result = await editRef.current?.onSubmit()
            message.success("保存成功...")
            setVisible(false)
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal width={1011} visible={visible} onOk={handleModal} onCancel={() => setVisible(false)} >
            <Edit detailId={detailId} ref={editRef} />
        </Modal>
        <Page
            path="/tower-supply/inquiryTask"
            columns={[
                ...baseInfo,
                {
                    key: "operation",
                    title: "操作",
                    width: 100,
                    dataIndex: "operation",
                    render: (_: any, records: any) => <Button type="link" onClick={() => {
                        setDetailId(records.id)
                        setVisible(true)
                    }}>询价信息</Button>
                }]}
            extraOperation={<Button type="primary">导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '查询',
                    children: <Input placeholder="任务编号/项目名称/项目负责人/客户名称" maxLength={200} />
                },
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Select style={{ width: "100px" }}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>待指派</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={0} key={0}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'statusUpdateTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'confirmId',
                    label: '询价人',
                    children: <div>

                    </div>
                }
            ]}
        />
    </>
}






