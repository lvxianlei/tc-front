import React, { useRef, useState } from 'react'
import { Spin, Form, Button, Modal, message, Row, Radio, Popconfirm, Steps, Space, Input, InputNumber, Select, DatePicker, Upload } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, DetailContent, CommonTable, Attachment, Page } from '../../common'
import { baseInfoData, pageInfo, pageInfoCount } from './detail.json'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import Dispatch from './Dispatch'
import Tower from './Tower'
import { AttachmentRef } from '../../common/Attachment'
import HandSelect from './HandSelect'
import moment from 'moment'

const { Step } = Steps

export default function InformationDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [form] = Form.useForm();
    const [formAssess] = Form.useForm();
    const [formEdit] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [assessVisible, setAssessVisible] = useState<boolean>(false)
    const [viewBidList, setViewBidList] = useState<"detail" | "count">("detail")
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [title, setTitle] = useState('添加');
    const [questionTitle, setQuestionTitle] = useState('添加');
    const [assessTitle, setAssessTitle] = useState('添加');
    const [formRef] = Form.useForm();
    const [formQuestion] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const attachCostRef = useRef<AttachmentRef>()
    const [detailData, setDetailData] = useState<any>({});
    const [detailCostData, setDetailCostData] = useState<any>({});
    const [detailQuestionData, setDetailQuestionData] = useState<any>({});
    const [detailAssessData, setDetailAssessData] = useState<any[]>([]);
    const [assessDataSource, setAssessDataSource] = useState<any[]>([]);
    const [pieceCode, setPieceCode] = useState<any[]>([]);
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
    };
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [typeName, setTypeName] = useState<any[]>([])
    const [name, setName] = useState<any[]>([])
    const [costType, setCostType] = useState<any[]>([]);
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
            const detailData: any = await RequestUtil.get(`/tower-as/workOrder/${params.id}`);
            setDetailData(detailData)
            const typeList: any = await RequestUtil.get(`/tower-as/issue/list`);
            setTypeName(typeList.filter((item: any) => {
                return item?.status !== 2
            }))
            const data: any = await RequestUtil.get(`/tower-as/cost`)
            setCostType(data)
            resole(data)

        } catch (error) {
            reject(error)
        }
    }), {})


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    const afterSaleInfo = [
        {
            title: "售后人员",
            dataIndex: "afterSaleUser",
            width: 50
        },
        {
            title: "售后开始日期",
            width: 120,
            dataIndex: "startTime"
        },
        {
            title: "售后开始打卡",
            width: 120,
            dataIndex: "goodsType",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>{record?.startTime ? '已打卡' : '-'}</>
            )
        },
        {
            title: "售后完成日期",
            dataIndex: "endTime",
            width: 120,
        },
        {
            title: "售后完成打卡",
            width: 120,
            dataIndex: "goodsExplain",
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>{record?.endTime ? '已打卡' : '-'}</>
            )
        },
        {
            title: "售后周期",
            width: 120,
            dataIndex: "cycle",
            type: "number"
        }
    ]
    const tableColumns = [
        {
            key: 'issueName',
            title: '问题分类',
            dataIndex: 'issueName'
        },
        {
            key: 'productCategory',
            title: '塔型',
            dataIndex: 'productCategory'
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            dataIndex: 'productNumber'
        },
        {
            key: 'pieceCode',
            title: '件号',
            dataIndex: 'pieceCode'
        },
        {
            key: 'pieceCodeNum',
            title: '件数',
            dataIndex: 'pieceCodeNum'
        },
        {
            key: 'description',
            title: '问题描述',
            dataIndex: 'description'
        }
    ]
    const columns = [
        {
            key: 'deptName',
            title: '责任部门',
            dataIndex: 'deptName',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <><span>{_}</span>
                    <Form.Item name={["list", index, "deptId"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                    <Form.Item name={["list", index, "deptName"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                </>
            )
        },
        {
            key: 'userName',
            title: '责任人',
            width: 100,
            dataIndex: 'userName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <><span>{_}</span>
                    <Form.Item name={["list", index, "userId"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                    <Form.Item name={["list", index, "userName"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                </>
            )
        },
        {
            key: 'stationName',
            title: '责任人岗位',
            width: 150,
            dataIndex: 'stationName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <><span>{_}</span>
                    <Form.Item name={["list", index, "stationId"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                    <Form.Item name={["list", index, "stationName"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                </>
            )
        },
        {
            key: 'type',
            title: '考核方式',
            width: 80,
            dataIndex: 'type',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <><span>{_ === 1 ? '扣款' : ''}</span>
                    <Form.Item name={["list", index, "type"]} style={{ display: 'none' }}>
                        <Input type='hidden' />
                    </Form.Item>
                </>
            )
        },
        {
            key: 'money',
            title: '考核金额',
            dataIndex: 'money',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "money"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请输入考核金额"
                }]}>
                    <InputNumber precision={2} min={0} />
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "description"]} key={index} initialValue={_}>
                    <Input.TextArea rows={1} />
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            assessDataSource.splice(index, 1)
                            setAssessDataSource([...assessDataSource])
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const expandedRowRender = (record: any) => {
        const columnsOther = [
            {
                key: 'deptName',
                title: '责任部门',
                dataIndex: 'deptName'
            },
            {
                key: 'userName',
                title: '责任人',
                dataIndex: 'userName'
            },
            {
                key: 'type',
                title: '考核方式',
                dataIndex: 'type',
                type: "select",
                enum: [
                    {
                        "value": 1,
                        "label": "扣款"
                    }
                ]
            },
            {
                key: 'money',
                title: '考核金额',
                dataIndex: 'money'
            },
            {
                key: 'description',
                title: '备注',
                dataIndex: 'description'
            },
            {
                key: 'createUserName',
                title: '记录人',
                dataIndex: 'createUserName'
            },
            {
                key: 'createTime',
                title: '记录时间',
                dataIndex: 'createTime'
            },
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        <Button type="link" onClick={async () => {
                            await formEdit.setFieldsValue({
                                ...record
                            })
                            Modal.confirm({
                                title: "编辑考核",
                                icon: null,
                                content: <Form form={formEdit}>
                                    <Form.Item name={"id"} label="" style={{ display: 'none' }}>
                                        <Input type='hidden' />
                                    </Form.Item>
                                    <Form.Item name={"stationName"} label="" style={{ display: 'none' }}>
                                        <Input type='hidden' />
                                    </Form.Item>
                                    <Form.Item name={"stationId"} label="" style={{ display: 'none' }}>
                                        <Input type='hidden' />
                                    </Form.Item>
                                    <Form.Item name={"workIssueId"} label="" style={{ display: 'none' }}>
                                        <Input type='hidden' />
                                    </Form.Item>
                                    <Form.Item name={"deptName"} label="责任部门" >
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item name={"deptId"} label="" style={{ display: 'none' }}>
                                        <Input type='hidden' />
                                    </Form.Item>
                                    <Form.Item name={"userName"} label="责任人" >
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item name={"userId"} label="" style={{ display: 'none' }}>
                                        <Input type='hidden' />
                                    </Form.Item>
                                    <Form.Item name={"type"} label="考核方式" >
                                        <Select style={{ width: '100%' }} >
                                            <Select.Option key={1} value={1}>扣款</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="考核金额"
                                        name="money"
                                        rules={[{ required: true, message: '请输入考核金额' }]}>
                                        <InputNumber min={0} precision={2} />
                                    </Form.Item>
                                    <Form.Item name={"description"} label="备注" >
                                        <Input.TextArea />
                                    </Form.Item>
                                </Form>,
                                onOk: () => new Promise(async (resove, reject) => {
                                    try {
                                        const value = await formEdit.validateFields()
                                        await RequestUtil.put(`/tower-as/workAssess`, {
                                            ...value,
                                            workOrderId: params.id
                                        })
                                        await message.success("编辑成功！")
                                        setSelectedKeys([])
                                        setSelectedRows([])
                                        formEdit.resetFields()
                                        history.go(0)
                                        resove(true)
                                    } catch (error) {
                                        reject(false)
                                    }
                                }),
                                onCancel() {
                                    formEdit.resetFields()
                                    history.go(0)
                                }
                            })
                        }} disabled={detailData?.status === 5}>编辑</Button>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={async () => {
                                await RequestUtil.delete(`/tower-as/workAssess/${record?.id}`)
                                message.success('删除成功！')
                                history.go(0)
                            }}
                            okText="确认"
                            cancelText="取消"
                            disabled={detailData?.status === 5}
                        >
                            <Button type="link" disabled={detailData?.status === 5}>删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        ]
        return <CommonTable
            columns={columnsOther}
            dataSource={record && record?.workAssessVOList ? [...record?.workAssessVOList] : []}
            rowKey='id'
            pagination={false}
        />;
    }

    return <>
        <Modal visible={assessVisible} title={assessTitle + "考核"} width="60%" onOk={async () => {
            await formAssess.validateFields()
            const value = formAssess.getFieldsValue(true)
            console.log(value)
            if (assessTitle === '添加') {
                await RequestUtil.post(`/tower-as/workAssess`, value?.list.map((item: any) => {
                    return {
                        ...item,
                        workIssueId: detailAssessData[0].id,
                        workOrderId: params.id
                    }
                })).then(() => {
                    message.success('新增成功！')
                }).then(() => {
                    formQuestion.resetFields()
                    setAssessVisible(false)
                    setQuestionTitle('添加')
                    history.go(0)
                })
            }
        }} onCancel={() => {
            setAssessVisible(false);
            setAssessTitle('添加')
            formAssess.resetFields()
        }}>
            <Form form={formAssess} {...formItemLayout}>
                <DetailTitle title='基本信息' />
                <CommonTable
                    columns={tableColumns}
                    dataSource={detailAssessData}
                    pagination={false}
                />
                <DetailTitle title='根据上述条件匹配到下面责任人' operation={[<HandSelect
                    onSelect={(selectRows: any[]) => {
                        setAssessDataSource(selectRows.map((item: any) => {
                            return {
                                ...item,
                                type: 1,
                                userName: item?.name
                            }
                        }))
                        formAssess.setFieldsValue({
                            list: selectRows.map((item: any) => {
                                return {
                                    ...item,
                                    type: 1,
                                    userName: item?.name,
                                    description: ''
                                }
                            })
                        })
                    }}
                />
                ]} />
                <CommonTable
                    columns={columns}
                    dataSource={[...assessDataSource]}
                    pagination={false}
                />
            </Form>
        </Modal>
        <Modal
            visible={visible}
            title={questionTitle + "问题"}
            width={'40%'}
            onOk={async () => {
                await formQuestion.validateFields()
                const value = formQuestion.getFieldsValue(true)
                if (questionTitle === '添加') {
                    await RequestUtil.post(`/tower-as/workIssue`, {
                        ...value,
                        workOrderId: params.id,
                        description: value?.description ? value?.description : '',
                        issueTypeId: value?.type ? value?.type.split(',')[0] : '',
                        issueTypeName: value?.type ? value?.type.split(',')[1] : '',
                        issueId: value?.issue ? value?.issue.split(',')[0] : '',
                        issueName: value?.issue ? value?.issue.split(',')[1] : '',
                        pieceCode: value?.pieceCode ? value?.pieceCode.join(',') : '',
                        pieceCodeNum: value?.pieceCodeNum ? value?.pieceCodeNum : '',
                        productCategory: value?.productCategory ? value?.productCategory : '',
                        productCategoryId: value?.productCategoryId ? value?.productCategoryId : '',
                        productNumber: value?.productNumber ? value?.productNumber : '',
                        fileIds: attachRef.current?.getDataSource().map(item => item.id)
                    }).then(() => {
                        message.success('添加成功！')
                    }).then(() => {
                        formQuestion.resetFields()
                        setVisible(false)
                        setQuestionTitle('添加')
                        history.go(0)
                    })
                } else {
                    await RequestUtil.put(`/tower-as/workIssue`, {
                        ...value,
                        workOrderId: params.id,
                        description: value?.description ? value?.description : '',
                        issueTypeId: value?.type ? value?.type.split(',')[0] : '',
                        issueTypeName: value?.type ? value?.type.split(',')[1] : '',
                        issueId: value?.issue ? value?.issue.split(',')[0] : '',
                        issueName: value?.issue ? value?.issue.split(',')[1] : '',
                        pieceCode: value?.pieceCode ? value?.pieceCode.join(',') : '',
                        pieceCodeNum: value?.pieceCodeNum ? value?.pieceCodeNum : '',
                        productCategory: value?.productCategory ? value?.productCategory : '',
                        productCategoryId: value?.productCategoryId ? value?.productCategoryId : '',
                        productNumber: value?.productNumber ? value?.productNumber : '',
                        fileIds: attachRef.current?.getDataSource().map(item => item.id)
                    }).then(() => {
                        message.success('编辑成功！')
                    }).then(() => {
                        formQuestion.resetFields()
                        setVisible(false)
                        setQuestionTitle('添加')
                        history.go(0)
                    })
                }
            }} onCancel={() => {
                setVisible(false);
                setQuestionTitle('添加')
                formQuestion.resetFields()
            }}>
            <Form form={formQuestion} {...formItemLayout}>
                <Form.Item name="type" label="问题阶段" rules={[
                    {
                        required: true,
                        message: "请选择问题阶段"
                    }
                ]}>
                    <Select style={{ width: '100%' }} onChange={async (value: any) => {
                        const result: any = await RequestUtil.get(`/tower-as/issue/issue/${value.split(',')[0]}`);
                        setName(result.filter((item: any) => {
                            return item?.status !== 2
                        }))
                    }}>
                        {typeName && typeName.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id + ',' + item.typeName}>{item.typeName}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="issue" label="问题分类" rules={[
                    {
                        required: true,
                        message: "请选择问题分类"
                    }
                ]}>
                    <Select style={{ width: '100%' }}>
                        {name && name.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="productCategory" label="塔型"  >
                    <Input disabled placeholder='选择杆塔号自动带出' />
                </Form.Item>
                <Form.Item name="productCategoryId" label="" style={{ display: 'none' }} >
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item name="id" label="" style={{ display: 'none' }} >
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item name="productId" label="" style={{ display: 'none' }} >
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item name="productNumber" label="杆塔号" rules={[{
                    "required": true,
                    "message": "请选择杆塔号"
                }]}>
                    <Input addonBefore={
                        <Tower onSelect={async (select: any) => {
                            formQuestion.setFieldsValue({
                                productId: select?.selectRows[0].id,
                                productNumber: select?.selectRows[0].productNumber,
                                productCategory: select?.selectedRows[0].productCategoryName,
                                productCategoryId: select?.selectedRows[0].productCategoryId,
                            });
                            const value: any[] = await RequestUtil.get(`/tower-science/productStructure/listByProductForSales?current=1&pageSize=10000&productId=${select?.selectRows[0].id}`)
                            setPieceCode(value)
                        }} selectedKey={[]} planNumber={detailData.planNumber} />
                    } disabled />
                </Form.Item>
                <Form.Item name="pieceCode" label="件号" rules={[{
                    "required": true,
                    "message": "请选择件号"
                }]}>
                    <Select style={{ width: '100%' }} mode='multiple' onChange={(value: any) => {
                        if (value.length > 0) {
                            const arr: any[] = [];
                            value.map((item: any, index: number) => {
                                const everyOne = pieceCode.filter((every: any) => {
                                    return every?.code === item
                                })
                                arr.push(everyOne[0])
                            })
                            const numberAll = arr.reduce((pre: any, cur: any) => {
                                return parseFloat(pre !== null ? pre : 0) + parseFloat(cur.basicsPartNum !== null ? cur.basicsPartNum : 0)
                            }, 0)
                            formQuestion.setFieldsValue({
                                pieceCodeNum: Number(numberAll)
                            });
                        }
                    }}>
                        {pieceCode && pieceCode.map((item: any) => {
                            return <Select.Option key={item.id} value={item.code}>{item.code}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="pieceCodeNum" label="件数" rules={[{
                    "required": true,
                    "message": "请输入件数"
                }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="description" label="问题描述" rules={[{
                    "required": true,
                    "message": "请输入问题描述"
                }]}>
                    <Input.TextArea showCount maxLength={600} />
                </Form.Item>
                <Form.Item name="plan" label="解决方案" >
                    <Input.TextArea showCount maxLength={600} />
                </Form.Item>
            </Form>
            <Attachment
                ref={attachRef}
                dataSource={detailQuestionData.attachInfoVos}
                edit
                multiple
            />
        </Modal>
        <Modal visible={isAdd} title={title + "费用"} onOk={async () => {
            await formRef.validateFields()
            const value = formRef.getFieldsValue(true)
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
                    workOrderId: params.id,
                    fileIds: attachCostRef.current?.getDataSource().map(item => item.id),
                }).then(() => {
                    message.success('新增成功！')
                }).then(() => {
                    formRef.resetFields()
                    setIsAdd(false)
                    setTitle('添加')
                    history.go(0)
                })
            } else {
                await RequestUtil.put(`/tower-as/workCost`, {
                    ...value,
                    workOrderId: params.id,
                    fileIds: attachCostRef.current?.getDataSource().map(item => item.id),
                }).then(() => {
                    message.success('编辑成功！')
                }).then(() => {
                    formRef.resetFields()
                    setIsAdd(false)
                    setTitle('添加')
                    history.go(0)
                })
            }
        }} onCancel={() => {
            setIsAdd(false);
            setTitle('添加')
            form.resetFields()
        }}>
            <Form form={formRef} {...formItemLayout}>
                <Form.Item name="workOrderNumber" label="工单编号">
                    <Input disabled />
                </Form.Item>
                <Form.Item name="money" label="金额" rules={[
                    {
                        required: true,
                        message: "请输入金额"
                    }
                ]}>
                    <InputNumber precision={2} min={0} style={{ width: '100%' }} />
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
                ref={attachCostRef}
                dataSource={detailCostData.attachInfoVos}
                edit
                multiple
            />
        </Modal>
        <DetailContent
            operation={detailData?.status !== 5 ? [
                <Button key="setting" type="primary" style={{ marginRight: "16px" }} onClick={() => {

                    RequestUtil.post(`/tower-as/workOrder/close?id=${params.id}`).then(() => {
                        message.success('已关闭订单！')
                    }).then(() => {
                        history.goBack()
                    })
                }} disabled={detailData?.status < 4}>关闭工单</Button>,
                <Button key="new" onClick={() => history.goBack()}>返回列表</Button>
            ] : [<Button key="new" onClick={() => history.goBack()}>返回列表</Button>]}>
            <Steps current={detailData?.status}  >
                <Step title="派工" />
                <Step title="到场" />
                <Step title="处理" />
                <Step title="完成" />
                <Step title="关闭" />
            </Steps>
            <DetailTitle title="基本信息" />
            <BaseInfo
                columns={baseInfoData}
                dataSource={detailData || {}}
                col={4} />
            <DetailTitle title="售后人员" operation={detailData?.status !== 5 ? [
                <Dispatch onSelect={async (selectRows: any[]) => {
                    console.log(selectRows)
                    // form.setFieldsValue({  });

                    await RequestUtil.post(`/tower-as/workOrder/dispatch?workOrderId=${params?.id}&userId=${selectRows[0]?.userId}`)
                    message.success("派工成功！")
                    history.go(0)
                }} selectedKey={detailData?.workOrderUserVO} disabled={detailData?.workOrderUserVO !== null ? true : false} />] : []} />
            <CommonTable columns={[...afterSaleInfo as any,
            {
                title: "操作",
                dataIndex: "operation",
                width: 100,
                fixed: "right",
                render: (_: any, record: any) => {
                    return <Popconfirm
                        title="确定取消?"
                        onConfirm={async () => {
                            await RequestUtil.post(`/tower-as/workOrder/cancelDispatch?workOrderId=${params?.id}&userId=${record?.afterSaleUserId}`)
                            message.success("取消成功！")
                            history.go(0)
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={detailData?.status > 2}
                    >
                        <Button type="link" disabled={detailData?.status > 2}>取消派工</Button>
                    </Popconfirm>
                }
            }]} dataSource={detailData?.workOrderUserVO !== null ? [detailData?.workOrderUserVO] : []} pagination={false} />
            <Row style={{ marginTop: "10px" }}>
                <Radio.Group defaultValue={viewBidList} onChange={(event: any) => setViewBidList(event.target.value)}>
                    <Radio.Button value="detail" key="detail">问题信息</Radio.Button>
                    <Radio.Button value="count" key="count">费用信息</Radio.Button>
                </Radio.Group>
            </Row>
            {viewBidList === "detail" && <>

                {/* <CommonTable haveIndex  dataSource={data?.bidPackageInfoVOS} pagination={false}/> */}
                <Page
                    path="/tower-as/workIssue"
                    requestData={{ workOrderId: params?.id }}
                    tableProps={{
                        expandable: {
                            expandedRowRender,
                            // onExpand
                        }
                    }}
                    columns={[...pageInfo as any,
                    {
                        title: "操作",
                        dataIndex: "operation",
                        fixed: "right",
                        width: 150,
                        render: (_: any, record: any) => <Space>
                            <Button type="link" onClick={() => {
                                formQuestion.setFieldsValue({ record });
                                setDetailAssessData([{ ...record }])
                                setAssessTitle('添加');
                                setAssessVisible(true);
                            }} disabled={detailData?.status === 5}>添加考核</Button>
                            <Button type="link" onClick={async () => {
                                const result: any = await RequestUtil.get(`/tower-as/issue/issue/${record?.issueTypeId}`);
                                const value: any[] = await RequestUtil.get(`/tower-science/productStructure/listByProductForSales?current=1&pageSize=10000&productId=${record?.productId}`)
                                setPieceCode(value)
                                setName(result)
                                formQuestion.setFieldsValue({
                                    ...record,
                                    type: record?.issueTypeId && record?.issueTypeName ? record?.issueTypeId + ',' + record?.issueTypeName : '',
                                    issue: record?.issueId && record?.issueName ? record?.issueId + ',' + record?.issueName : "",
                                    pieceCode: record?.pieceCode ? record?.pieceCode.split(',') : ''
                                });
                                setDetailQuestionData({ attachInfoVos: record?.attachVos })
                                setQuestionTitle('编辑');
                                setVisible(true);
                            }} disabled={detailData?.status === 5}>编辑</Button>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={async () => {
                                    await RequestUtil.delete(`/tower-as/workIssue?id=${record.id}`).then(res => {
                                        message.success("删除成功！")
                                        history.go(0)
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={detailData?.status === 5}
                            >
                                <Button type="link" disabled={detailData?.status === 5}>删除</Button>
                            </Popconfirm>
                        </Space>
                    }
                    ]}
                    extraOperation={detailData?.status !== 5 && [
                        <Button
                            type="primary"
                            onClick={() => {
                                setVisible(true)
                                setQuestionTitle('添加')
                            }}
                        // style={{marginBottom:"10px"}}
                        >添加问题</Button>
                    ]}
                    searchFormItems={[]}
                    onFilterSubmit={(values: any) => {
                        return values;
                    }}
                />
            </>}
            {viewBidList === "count" && <>
                <Page
                    path="/tower-as/workCost"
                    exportPath="/tower-as/workCost"
                    requestData={{ workOrderId: params?.id }}
                    extraOperation={detailData?.status !== 5 && <Button
                        type="primary"
                        onClick={() => {
                            setIsAdd(true)
                            setTitle('添加')
                            formRef.setFieldsValue({
                                workOrderNumber: detailData?.workOrderNumber,
                                workOrderId: params.id
                            })
                        }}
                    >添加费用</Button>}
                    columns={[
                        ...pageInfoCount as any,
                        {
                            title: "操作",
                            dataIndex: "operation",
                            fixed: "right",
                            width: 100,
                            render: (_: any, record: any) => <Space>
                                <Button type="link" onClick={async () => {
                                    setTitle('编辑');
                                    setIsAdd(true);
                                    const value: any = await RequestUtil.get(`/tower-as/workCost/${record?.id}`)
                                    // setDetailData(value)
                                    setDetailCostData({ ...value, attachInfoVos: value?.attachVos })
                                    formRef.setFieldsValue({
                                        ...record,
                                        date: record?.date ? moment(record?.date) : '',
                                        cost: record?.type && record?.typeName ? record?.type + ',' + record?.typeName : '',
                                        workOrderNumber: record?.workOrderNumber
                                    });
                                }} disabled={detailData?.status === 5}>编辑</Button>
                                <Popconfirm
                                    title="删除后不可恢复，确认删除?"
                                    onConfirm={async () => {
                                        await RequestUtil.delete(`/tower-as/workCost?id=${record?.id}`)
                                        message.success("删除成功！")
                                        history.go(0)
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                    disabled={detailData?.status === 5}
                                >
                                    <Button type="link" disabled={detailData?.status === 5}>删除</Button>
                                </Popconfirm>
                            </Space>
                        }
                    ]}
                    searchFormItems={[]}
                    onFilterSubmit={(values: any) => {
                        return values;
                    }}
                />
            </>
            }
        </DetailContent>
    </>
}
