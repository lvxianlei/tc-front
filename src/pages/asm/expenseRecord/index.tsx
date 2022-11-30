import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Upload } from "antd"
import { Attachment, AttachmentRef, DetailTitle, SearchTable as Page } from "../../common"
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from "@ahooksjs/use-request"
import moment from "moment";
import { FileProps } from "../../common/Attachment";
import SelectAfterSales from "./SelectAfterSales";
export default () => {
    const history = useHistory()
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        status: 1
    });
    const attachRef = useRef<AttachmentRef>()
    const [title, setTitle] = useState('添加');
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<any>({});
    const [costType, setCostType] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-as/cost`)
        setCostType(data)
        const users: any = await RequestUtil.get(`/tower-system/employee?current=1&size=1000`)
        setUsers(users?.records)

        resole(data)
    }))
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            fixed: "left",
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: "工单编号",
            width: 150,
            dataIndex: "workOrderNumber"
        }, {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber"
        }, {
            title: "工程名称",
            width: 150,
            dataIndex: "projectName"
        }, {
            title: "售后人员",
            width: 150,
            dataIndex: "afterSaleUser"
        }, {
            title: "费用分类",
            width: 150,
            dataIndex: "typeName"
        }, {
            title: "金额",
            width: 150,
            dataIndex: "money"
        }, {
            title: "发生日期",
            width: 150,
            dataIndex: "date"
        }, {
            title: "图片",
            width: 150,
            dataIndex: "picNumber"
        }, {
            title: "备注",
            width: 150,
            dataIndex: "description"
        },
        {
            title: "创建人",
            dataIndex: "createUserName",
            width: 150,
        },
        {
            title: "创建时间",
            width: 150,
            dataIndex: "createTime"
        }
    ]
    return <>
        <Modal visible={isAdd} title={title + "费用"} width='40%' onOk={async () => {
            await form.validateFields()
            const value = form.getFieldsValue(true)
            console.log(value)
            if (value?.cost) {
                value.type = value?.cost.split(',')[0]
                value.typeName = value?.cost.split(',')[1]
                delete value?.cost
            }
            if (value?.date) {
                value.date = value?.date.format("YYYY-MM-DD")
            }

            if (title === '添加') {
                await RequestUtil.post(`/tower-as/workCost`, {
                    ...value,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id),
                }).then(() => {
                    message.success('添加成功！')
                }).then(() => {
                    form.resetFields()
                    setIsAdd(false)
                    setTitle('添加')
                    history.go(0)
                })
            } else {
                await RequestUtil.put(`/tower-as/workCost`, {
                    ...value,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id),
                }).then(() => {
                    message.success('编辑成功！')
                }).then(() => {
                    form.resetFields()
                    setIsAdd(false)
                    setTitle('添加')
                    history.go(0)
                })
            }


        }} onCancel={() => {
            setIsAdd(false);
            setTitle('添加')
            form.resetFields()
            setDetailData({
                attachInfoVos: []
            })
        }}>
            <DetailTitle title="基本信息" key={1} />
            <Form form={form} {...formItemLayout}>
                <Form.Item name="workOrderNumber" label="工单编号" rules={[
                    {
                        required: true,
                        message: "请选择工单编号"
                    }
                ]}>
                    <Input addonBefore={
                        <SelectAfterSales onSelect={(selectRows: any[]) => {
                            form.setFieldsValue({
                                workOrderNumber: selectRows[0].workOrderNumber,
                                workOrderId: selectRows[0].id
                            })
                            form.setFieldsValue({ dept: selectRows.map(item => item.name) });
                        }} selectedKey={detailData || []} />
                    } disabled />
                </Form.Item>
                <Form.Item name="money" label="金额" rules={[
                    {
                        required: true,
                        message: "请输入金额"
                    }
                ]}>
                    <InputNumber precision={2} min={0} />
                </Form.Item>
                <Form.Item name="cost" label="费用分类" rules={[
                    {
                        required: true,
                        message: "请选择费用分类"
                    }
                ]}>
                    <Select style={{ width: '100%' }}>
                        {costType && costType.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="date" label="发生日期" rules={[
                    {
                        required: true,
                        message: "请选择发生日期"
                    }
                ]}>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="description" label="备注" >
                    <Input.TextArea showCount maxLength={600} />
                </Form.Item>
                <Form.Item name="id" label="" style={{ display: 'none' }}>
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item name="workOrderId" label="" style={{ display: 'none' }}>
                    <Input type='hidden' />
                </Form.Item>
            </Form>
            <Attachment
                ref={attachRef}
                dataSource={detailData.attachInfoVos}
                edit
                accept="image/png,image/jpeg"
                multiple
                maxCount={5}
                onDoneChange={(dataInfo: FileProps[]) => {
                    setDetailData({ ...detailData, attachInfoVos: [...dataInfo] })
                }}
            />
        </Modal>
        <Page
            path="/tower-as/workCost"
            filterValue={filterValue}
            exportPath="/tower-as/workCost"
            extraOperation={<Button
                type="primary"
                onClick={() => {
                    setIsAdd(true)
                    setTitle('添加')
                }}
            >添加费用</Button>}
            columns={[
                ...columns as any,
                {
                    title: "操作",
                    dataIndex: "operation",
                    fixed: "right",
                    render: (_: any, record: any) => <Space>
                        <Button type="link" onClick={async () => {
                            const value: any = await RequestUtil.get(`/tower-as/workCost/${record?.id}`)
                            setDetailData({ ...value, workOrderNumber: record?.workOrderNumber })
                            setTitle('编辑');
                            setIsAdd(true);
                            form.setFieldsValue({
                                ...record,
                                date: record?.date ? moment(record?.date) : '',
                                cost: record?.type && record?.typeName ? record?.type + ',' + record?.typeName : '',
                                workOrderNumber: record?.workOrderNumber
                            });
                        }}>编辑</Button>
                        <Popconfirm
                            title="删除后不可恢复，确认删除?"
                            onConfirm={async () => {
                                await RequestUtil.delete(`/tower-as/workCost?id=${record?.id}`)
                                message.success("删除成功！")
                                history.go(0)
                                setRefresh(!refresh)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link" >删除</Button>
                        </Popconfirm>
                    </Space>
                }
            ]}
            searchFormItems={[
                {
                    name: "fuzzyQuery",
                    label: '模糊查询',
                    children: <Input placeholder="请输入工单编号/计划号/工程名称进行查询" style={{ width: 150 }} />
                },
                {
                    name: "afterSaleUserId",
                    label: '售后人员',
                    children: <Select placeholder="请选择" style={{ width: "150px" }}>
                        {/* <Select.Option value='' key="">全部</Select.Option> */}
                        {users && users.map(({ userId, name }, index) => {
                            return <Select.Option key={index} value={userId}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "happenDate",
                    label: "发生日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "date",
                    label: "创建日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.date) {
                    const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                    values.createTimeStart = formatDate[0] + ' 00:00:00';
                    values.createTimeEnd = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                if (values.happenDate) {
                    const formatDate = values.happenDate.map((item: any) => item.format("YYYY-MM-DD"))
                    values.dateStart = formatDate[0] + ' 00:00:00';
                    values.dateEnd = formatDate[1] + ' 23:59:59';
                    delete values.happenDate
                }
                setFilterValue(values)
                return values;
            }}
        />
    </>


}