import React, { useCallback, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space } from "antd"
import { Page } from "../../common"
import { tableHeader } from "./data.json"
import { productTypeOptions } from "../../../configuration/DictionaryOptions"
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
export default () => {
    const history = useHistory()
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [form] = Form.useForm();
    const [cyclePlanType,setCyclePlanType] = useState<any[]>([]);
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/workshop/config/cycleConfig?current=1&size=10000`)
        setCyclePlanType(data?.records)
        resole(data)
    }), {})
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Modal visible={isAdd} title="新增周期计划" onOk={async ()=>{
            await form.validateFields()
            const value = form.getFieldsValue(true)
            console.log(value)
            if (value.date) {
                const formatDate = value.date.map((item: any) => item.format("YYYY-MM-DD"))
                value.startTime = formatDate[0] + ' 00:00:00';
                value.endTime = formatDate[1] + ' 23:59:59';
                delete value.date
            }
            if (value.config) {
                value.configId = value.config.split(',')[0];
                value.configName = value.config.split(',')[1];
                delete value.config
            }
            await RequestUtil.post(`/tower-aps/cyclePlan`,value).then(()=>{
                message.success('新增成功！')
            }).then(()=>{
                setIsAdd(false)
                setRefresh(!refresh)
            })

        }} onCancel={()=>{
            setIsAdd(false);
            form.resetFields()
        }}>
            <Form form={form} {...formItemLayout}>
                    <Form.Item name="cyclePlanNumber" label="周期计划号">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="date" label="计划起止日期" rules={[
                        {
                            required:true,
                            message:"请选择计划起止日期"
                        }
                    ]}>
                        <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="config" label="周期计划类型" rules={[
                        {
                            required:true,
                            message:"请选择周期计划类型"
                        }
                    ]}>
                        <Select style={{width:'100%'}}>
                            { cyclePlanType && cyclePlanType.map((item:any)=>{
                                    return <Select.Option key={item.groupId} value={item.groupId+','+item.cyclePlan}>{item.cyclePlan}</Select.Option>
                                }) }
                        </Select>
                    </Form.Item>
                    
            </Form>
        </Modal>
        <Page
            path="/tower-aps/cyclePlan"
            filterValue={filterValue}
            extraOperation={<Button
                type="primary"
                onClick={useCallback(() => setIsAdd(true), [setIsAdd])}
            >新增周期计划</Button>}
            columns={[
                ...tableHeader as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_:any,record: any) => <Space>
                        <Link
                            to={`/planProd/cyclePlan/detail/${record?.id}`}
                        >
                            <Button type="link" size="small">详情</Button>
                        </Link>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={() => {
                                RequestUtil.delete(`/tower-system/notice?ids=${record?.id}`)
                                message.success("删除成功...")
                                history.go(0)
                            }}
                            okText="确认"
                            cancelText="取消"
                            disabled={record?.state === 1}
                        >
                            <Button type="link" disabled={record?.state === 1}>删除</Button>
                        </Popconfirm>
                    </Space>
                }
            ]}
            searchFormItems={[
                {
                    name: "fuzzyMsg",
                    label: '周期计划号',
                    children: <Input placeholder="周期计划号" style={{ width: 150 }} />
                },
                {
                    name: "fuzzyMsg",
                    label: '周期计划类型',
                    children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                        {cyclePlanType && cyclePlanType.map(({ groupId, cyclePlan }, index) => {
                            return <Select.Option key={index} value={groupId}>
                                {cyclePlan}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "status",
                    label: "周期计划状态",
                    children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                        <Select.Option value={1}>未下发</Select.Option>
                        <Select.Option value={2}>已下发</Select.Option>
                    </Select>
                },
                {
                    name: "startDate",
                    label: "计划开始日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "endDate",
                    label: "计划完成日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.startDate) {
                    const formatDate = values.startDate.map((item: any) => item.format("YYYY-MM-DD"))
                    values.planStartTime = formatDate[0] + ' 00:00:00';
                    values.planEndTime = formatDate[1] + ' 23:59:59';
                    delete values.startDate
                }
                if (values.endDate) {
                    const formatDate = values.endDate.map((item: any) => item.format("YYYY-MM-DD"))
                    values.completedStartTime = formatDate[0] + ' 00:00:00';
                    values.completedEndTime = formatDate[1] + ' 23:59:59';
                    delete values.endDate
                }
                return values;
            }}
        />
    </>


}