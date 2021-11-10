import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal, Form, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "./productionData.json"
import Overview from "./Edit"
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";

export default function Invoicing() {
    const [form] = Form.useForm()
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const [generaterVisible, setGenerteVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const { loading, run: saveRun } = useRequest<any[]>((id: string, productCategoryName: string) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/initData/ingredients?materialTaskCode=${id}&productCategoryName=${productCategoryName}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const { run: getLoftingRun } = useRequest<any[]>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/initData/ingredientsComponent?productionBatch=${id}`)
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
        return value
    }
    const handleGenerateOk = async () => {
        const formData = await form.validateFields()
        await saveRun(formData.materialTaskCode, formData.productCategoryName)
        message.success("成功生成配料方案...")
        history.go(0)
    }
    return <>
        <Modal title="配料方案" visible={visible} width={1011} onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}>
            <Overview id={detailId} />
        </Modal>
        <Modal title="生成数据" visible={generaterVisible} onCancel={() => {
            form.resetFields()
            setGenerteVisible((false))
        }}
            onOk={handleGenerateOk}>
            <Form form={form}>
                <Form.Item rules={[
                    { required: true, message: "请输入原材料编号..." }
                ]} name="materialTaskCode" label="原材料任务编号">
                    <Input />
                </Form.Item>
                <Form.Item rules={[
                    { required: true, message: "请输入塔形..." }
                ]} name="productCategoryName" label="塔形">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        <Page
            path="/tower-supply/produceIngredients"
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 40,
                    render: (_: any, _a: any, index: number) => <>{index + 1}</>
                },
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Link to={`/workMngt/production/detailed/${record.id}`}>明细</Link>
                            <Button type="link"
                                onClick={() => {
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>配料单</Button>
                            <Button type="link"
                                onClick={async () => {
                                    await getLoftingRun(record.productionBatch)
                                    message.success("生成成功...")
                                }}>生成放样构件</Button>
                            <Button type="link"
                                onClick={() => {
                                    message.warning("啥也没有...")
                                }}>生成差异列表</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" loading={loading} ghost onClick={() => setGenerteVisible(true)}>临时生成生产数据</Button>
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
