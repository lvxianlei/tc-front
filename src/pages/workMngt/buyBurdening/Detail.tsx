import React, { useState, useRef } from 'react'
import { Input, DatePicker, Select, Button, Form, Modal, Row, Col, message } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import { ComponentDetails, Batchingschemed } from "./buyBurdening.json"
import { CommonTable, IntgSelect, Page } from '../../common'
import Batcher from "./Batcher"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const ref = useRef<{ data: any }>()
    const [filterValue, setFilterValue] = useState({ purchaseTaskTowerId: params.id })

    const { run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const detail: any = await RequestUtil.put(`/tower-supply/purchaseTaskTower/finish/${params.id}`)
            resole(detail)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resole, reject) => {
        try {
            const detail: any = await RequestUtil.post(`/tower-supply/purchaseBatchingScheme`, { ...data, id: params.id })
            resole(detail)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: createScheme } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/initData/scheme?purchaseTaskTowerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


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

    const handleSuccess = () => {
        Modal.confirm({
            title: "提交/完成",
            content: "确认提交/完成？",
            okText: "提交/完成",
            onOk() {
                return new Promise(async (resove, reject) => {
                    try {
                        const result = await run()
                        resove(result)
                    } catch (error) {
                        reject(false)
                    }
                })
            }
        })
    }

    const createBatchingScheme = () => {
        Modal.confirm({
            title: "临时生成配料方案",
            content: "确定要生成提料配料方案吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await createScheme(params.id))
                    message.success("成功生成配料方案...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleModalOk = () => new Promise(async (resove, rejects) => {
        try {
            const result = await saveRun({ ...ref.current?.data })
            resove(true)
            message.success("保存成功...")
            setVisible(false)
        } catch (error) {
            rejects(false)
        }
    })

    return <>
        <Modal title="配料" width={1011} visible={visible} okText="保存并提交" onOk={handleModalOk} onCancel={() => setVisible(false)}>
            <Batcher id={params.id} ref={ref} />
        </Modal>
        <Page
            path="/tower-supply/purchaseTaskTower/component"
            columns={ComponentDetails.map((item: any) => {
                if (item.dataIndex === "equipped") {
                    return ({ ...item, render: (text: any, records: any) => <>{text} / {records.notequipped}</> })
                }
                return item
            })}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost onClick={handleSuccess}>完成</Button>
                <Button type="primary" ghost onClick={() => setVisible(true)}>配料</Button>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
                <Button type="primary" ghost onClick={() => createBatchingScheme()}>临时创建配料方案</Button>
            </>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value={1} key={1}>待接收</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'confirmId',
                    label: '配料人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="任务编号/任务单编号/订单编号/内部合同编号" maxLength={200} />
                },
            ]}
        />
    </>
}
