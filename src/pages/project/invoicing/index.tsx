import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { invoicingListHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { contractPlanStatusOptions } from "../../../configuration/DictionaryOptions"
import BatchCreate from "./BatchCreate"
export default function Invoicing() {
    const history = useHistory()
    const modalRef = useRef<{ onSubmit: () => void, loading: boolean }>()
    const [visible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0] + " 00:00:00"
            value.endLaunchTime = formatDate[1] + " 23:59:59"
        }
        setFilterValue(value)
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此开票申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await deleteRun(id))
                    message.success("删除成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    return <>
        <Modal
            title="批量创建"
            width={1101}
            visible={visible}
            destroyOnClose
            confirmLoading={!!modalRef.current?.loading}
            onOk={async () => {
                try {
                    const result = await modalRef.current?.onSubmit()
                    if (result) {
                        message.success("批量创建成功....")
                        setVisible(false)
                        history.go(0)
                    }
                } catch (error) {
                    console.log(error)
                }
            }}
            onCancel={() => setVisible(false)}>
            <BatchCreate ref={modalRef} />
        </Modal>
        <Page
            path="/tower-market/invoicing"
            filterValue={filterValue}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...invoicingListHead.map((item: any) => {
                    if (item.dataIndex === "contractType") {
                        return ({
                            ...item,
                            enum: contractPlanStatusOptions?.map(item => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    return item
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <span style={{ color: "#FF8C00", cursor: "pointer", marginRight: 12 }} onClick={() => history.push(`/project/invoicing/detail/${record.id}`)}>查看</span>
                            <Button className="btn-operation-link" type="link" size="small" disabled={![0, 3].includes(record.state)} onClick={() => history.push(`/project/invoicing/edit/${record.id}`)}>编辑</Button>
                            <Button className="btn-operation-link" type="link" size="small" disabled={record.state !== 0} onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Link to="/project/invoicing/new/new"><Button type="primary">新增开票申请</Button></Link>
                <Button type="primary" onClick={() => setVisible(true)}>批量创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'isOpen',
                    label: '是否已全开',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="2">发票未开全</Select.Option>
                        <Select.Option value="3">发票已开全</Select.Option>
                    </Select>
                },
                {
                    name: 'contractType',
                    label: '合同下计划状态',
                    children: <Select style={{ width: 200 }}>
                        {
                            contractPlanStatusOptions?.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                },
                {
                    name: 'startLaunchTime',
                    label: '申请日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="编号/内部合同编号/工程名称/票面单位/业务经理" style={{ width: 300 }} />
                },
            ]}
        />
    </>
}
