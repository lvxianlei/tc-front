import React, { useState, useRef } from 'react'
import { Input, DatePicker, Select, Button, Modal, message } from 'antd'
import { Page } from '../../common';
import { baseInfo } from "./enquiryList.json"
import Edit from "./Edit"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function EnquiryList(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [deptId, setDeptId] = useState<string>("")
    const [detailId, setDetailId] = useState<string>("")
    const editRef = useRef<{ onSubmit: () => void, resetFields: () => void }>({ onSubmit: () => { }, resetFields: () => { } })

    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/department`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/user?departmentId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

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
        setFilterValue({ ...filterValue, ...value })
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
        <Modal width={1011} visible={visible} onOk={handleModal} onCancel={() => {
            editRef.current?.resetFields()
            setVisible(false)
        }} >
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
                    children: <Select style={{ width: "100px" }}>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>已完成</Select.Option>
                        <Select.Option value={3} key={3}>待指派</Select.Option>
                        <Select.Option value={4} key={4}>待完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={6} key={6}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'startPlannedDeliveryTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'deptId',
                    label: '询价人',
                    children: <Select onChange={(value: string) => {
                        setDeptId(value)
                        getUser(value)
                    }} style={{ width: 100 }}>{deptData?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
                },
                {
                    name: 'inquirerId',
                    label: '',
                    children: <Select
                        disabled={!deptId}
                        style={{ width: 100 }}
                    >{userData?.records?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
                },
            ]}
        />
    </>
}






