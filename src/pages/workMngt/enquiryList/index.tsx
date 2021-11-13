import React, { useState, useRef } from 'react'
import { useHistory } from "react-router-dom"
import { Input, DatePicker, Select, Button, Modal, message } from 'antd'
import { Page, IntgSelect } from '../../common';
import { baseInfo } from "./enquiryList.json"
import Edit from "./Edit"
export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [detailId, setDetailId] = useState<string>("")
    const [inquiryStatus, setInquiryStatus] = useState<number>(0)
    const editRef = useRef<{ onSubmit: (type: "save" | "saveAndSubmit") => void, resetFields: () => void }>({ onSubmit: () => { }, resetFields: () => { } })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.startPlannedDeliveryTime) {
            const formatDate = value.startPlannedDeliveryTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPlannedDeliveryTime = formatDate[0] + " 00:00:00"
            value.endPlannedDeliveryTime = formatDate[1] + " 23:59:59"
        }
        if (value.inquirerId) {
            value.deptId = value.inquirerId.first
            value.inquirerId = value.inquirerId.second
        }
        setFilterValue({ ...filterValue, ...value })
        return ({ ...filterValue, ...value })
    }

    const handleModal = (oprationType: "save" | "saveAndSubmit") => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit(oprationType)
            setVisible(false)
            await message.success("保存成功...")
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            title="询价信息"
            width={1011}
            visible={visible}
            footer={[
                <Button type="primary" key="close" ghost
                    onClick={() => {
                        editRef.current?.resetFields()
                        setDetailId("")
                        setVisible(false)
                    }}>关闭</Button>,
                <Button
                    key="save"
                    type="primary"
                    style={{ display: inquiryStatus === 4 ? "inline-block" : "none" }}
                    onClick={() => handleModal("save")}>保存</Button>,
                <Button
                    key="saveAndSubmit"
                    type="primary"
                    style={{ display: inquiryStatus === 4 ? "inline-block" : "none" }}
                    onClick={() => handleModal("saveAndSubmit")}>保存并提交</Button>
            ]}
            onCancel={() => {
                editRef.current?.resetFields()
                setDetailId("")
                setVisible(false)
            }} >
            <Edit detailId={detailId} ref={editRef} />
        </Modal>
        <Page
            path="/tower-supply/inquiryTask/inquirer"
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...baseInfo,
                {
                    key: "operation",
                    title: "操作",
                    width: 100,
                    dataIndex: "operation",
                    render: (_: any, records: any) => <Button disabled={records.inquiryStatus === 2} type="link"
                        onClick={() => {
                            setDetailId(records.id)
                            setInquiryStatus(records.inquiryStatus)
                            setVisible(true)
                        }}>询价信息</Button>
                }]}
            extraOperation={<Button type="primary">导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="" maxLength={200} />
                },
                {
                    name: 'startStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'inquiryStatus',
                    label: '任务状态',
                    children: <Select defaultValue="全部" style={{ width: "100px" }}>
                        <Select.Option value="" key="">全部</Select.Option>
                        <Select.Option value={2} key={2}>已完成</Select.Option>
                        <Select.Option value={4} key={4}>待完成</Select.Option>
                    </Select>
                },
                {
                    name: 'startPlannedDeliveryTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'inquirerId',
                    label: '询价人',
                    children: <IntgSelect width={200} />
                }
            ]}
        />
    </>
}






