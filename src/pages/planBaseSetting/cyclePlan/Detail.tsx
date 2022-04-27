import React, { useState } from 'react'
import { Button, Spin, Space, Popconfirm, message, Form, Input, Select, DatePicker, Row, Col, Modal} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import ReleaseOrder from './ReleaseOrder';
import moment from 'moment';
const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);


export default function CyclePlanDetail(): React.ReactNode {
    const DragHandle = SortableHandle(() => <>
        <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
    </>);
    const history = useHistory()
    const [ dataSource, setDataSource] = useState<any[]>([])
    const [ detail, setDetail] = useState<any>({})
    const [ visible, setVisible] = useState<boolean>(false)
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<any[]>([]);
    const [ deleteIdList, setDeleteIdList ] = useState<any[]>([]);
    const params = useParams<{ id: string }>()
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/cyclePlan/${params.id}`)
        setDataSource(data?.issueOrderList)
        setDetail(data)
        form.setFieldsValue({
            ...data,
            date:[moment(data?.startTime),moment(data?.endTime)],
            status: data?.status===1?'未下发':data?.status===2?'已下发':data?.status===3?'已反馈':"-"

        })
        resole(data)
    }), {})
    const columns : any =[
        {
            key: 'index',
            title: '优先级',
            width: 100,
            fixed: "left",
            dataIndex: 'index',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{ index+ 1 }</span> 
            )
            
        },
        {
            title: '优先级排序',
            dataIndex: 'sort',
            width: 50,
            fixed: "left",
            className: 'drag-visible',
            render: ()=><DragHandle/>,
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            fixed: "left",
            dataIndex: 'planNumber'
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 100,
            fixed: "left",
            dataIndex: 'productCategory'
        },
        {
            key: 'issueOrderNumber',
            title: '下达单号',
            width: 100,
            dataIndex: 'issueOrderNumber'
        },
        
        {
            key: 'batchNo',
            title: '批次',
            width: 100,
            dataIndex: 'batchNo'
        },
        {
            key: 'lineName',
            title: '线路名称',
            width: 100,
            dataIndex: 'lineName'
        },
        {
            key: 'businessManagerName',
            title: '客户经理',
            width: 100,
            dataIndex: 'businessManagerName'
        },
        {
            key: 'productType',
            title: '产品类型',
            width: 100,
            dataIndex: 'productType'
        },
        {
            key: 'trialAssemble',
            title: '试装类型',
            width: 100,
            dataIndex: 'trialAssemble'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级（kV）',
            width: 100,
            dataIndex: 'voltageGradeName'
        },
        {
            key: 'totalHoles',
            title: '总孔数',
            width: 100,
            dataIndex: 'totalHoles'
        },
        {
            key: 'totalNumber',
            title: '总件数',
            width: 100,
            dataIndex: 'totalNumber'
        },
        {
            key: 'totalWeight',
            title: '总重量（t）',
            width: 100,
            dataIndex: 'totalWeight'
        },
        {
            key: 'angleWeight',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'angleWeight'
        },
        {
            key: 'plateWeight',
            title: '钢板重量（t）',
            width: 100,
            dataIndex: 'plateWeight'
        },
        {
            key: 'description',
            title: '库存备料',
            width: 100,
            fixed: "right",
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '生产备料',
            width: 100,
            fixed: "right",
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '周期计划备注',
            width: 100,
            fixed: "right",
            dataIndex: 'description'
        },
        {
            title: "操作",
            dataIndex: "opration",
            fixed: "right",
            render: (_:any,record: any) => 
                <Popconfirm
                    title="确认删除?"
                    onConfirm={async () => {
                        deleteIdList.push(record.id)
                        setDataSource(dataSource.filter((item:any)=>{
                            return item.id!==record.id
                        }))
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="link" >删除</Button>
                </Popconfirm>
        }
    ]
    const onSortEnd = (props: { oldIndex: number; newIndex: number; }) => {
        if (props.oldIndex !== props.newIndex) {
            const newData = arrayMove(dataSource, props.oldIndex, props.newIndex).filter(el => !!el);
            console.log(newData)
            setDataSource(newData)
        }
    };


    const DraggableContainer = (props: any) => (
        <SortableCon
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ ...restProps }) => {
       
        const index = dataSource.findIndex((x: any) => x.id === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Spin spinning={loading}>
        <Modal visible={ visible } title='周期计划备注' okText="确认" onOk={ async ()=>{
                await formRef.validateFields()
                const value = formRef.getFieldsValue(true)
                const submitData = {
                    id: params.id,
                    description: value?.description
                }
                await RequestUtil.post(`/tower-aps/cyclePlan/cycleDescription`,[submitData]).then(()=>{
                    message.success('编辑成功！')
                })
                setVisible(false)
                await run()
            } } onCancel={ ()=>{
                form.resetFields()
                setVisible(false)
            } }>
                <Form form={ formRef } { ...formItemLayout }>
                    <Form.Item name="description" label="周期计划备注" rules={[
                        {
                            required:true,
                            message:"请填写周期计划备注"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }
                    ]}>
                        <Input.TextArea maxLength={100} showCount/>
                    </Form.Item>
                </Form>
            </Modal>
            <DetailContent operation={[
                <Space>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                    <Button type="primary" ghost onClick={async () =>{
                        await form.validateFields()
                        const value = form.getFieldsValue(true)
                        console.log(value)
                        if (value.date) {
                            const formatDate = value.date.map((item: any) => item.format("YYYY-MM-DD"))
                            value.startTime = formatDate[0] + ' 00:00:00';
                            value.endTime = formatDate[1] + ' 23:59:59';
                            delete value.date
                        }
                        const submitData = {
                            configId: detail?.configId,
                            id: params.id,
                            configName: detail?.configName,
                            startTime: value?.startTime,
                            endTime: value?.endTime,
                            deleteIdList: deleteIdList
                        }
                        await RequestUtil.post(`/tower-aps/cyclePlan`,submitData)
                        message.success('保存成功！')
                        setSelectedKeys([])
                        setDeleteIdList([])
                        setSelectedRows([])
                        await run()
                    }}>保存</Button>
                    <Button type="primary" ghost onClick={async () => {
                            await RequestUtil.post(`/tower-aps/cyclePlan/confirmMaterial/${params.id}`)
                            message.success("备料确认已下发！")
                            await run()
                    }}>备料确认</Button>
                    <Popconfirm
                        title="下发后不可取消，是否下发周期计划？"
                        onConfirm={async () => {
                            await RequestUtil.post(`/tower-aps/cyclePlan/confirmMaterial/${params.id}`)
                            message.success("下发成功！")
                            await run()
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="primary" ghost >周期计划下发</Button>
                    </Popconfirm>
                </Space>
            ]}>
                <DetailTitle title="基础信息"/>
                <Form form={ form } { ...formItemLayout }>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="cyclePlanNumber" label="周期计划号" rules={[
                                {
                                    required:true,
                                    message:"请填写周期计划部门"
                                },
                                {
                                    pattern: /^[^\s]*$/,
                                    message: '禁止输入空格',
                                }
                            ]}>
                                <Input maxLength={100} disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="date" label="计划起止日期" rules={[{required:true,message:"请选择计划起止日期"}]}>
                                <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                   
                    <Row>
                        <Col span={12}>
                            <Form.Item name="configName" label="周期计划类型" rules={[
                                {
                                    required:true,
                                    message:"请选择周期计划类型"
                                }
                            ]}>
                                <Input maxLength={100} disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="备料状态" >
                                <Input maxLength={100} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <DetailTitle title="周期计划下达单"/>
                <Space>
                    <ReleaseOrder run={run}/>
                    <Button type="primary" ghost onClick={() => {
                        setVisible(true)
                    }} disabled={!(selectedKeys.length===1)}>周期计划备注</Button>
                </Space>
                <div>
                    <Space>
                        <span>合计：</span>
                        <span>总件数：{detail?.totalNumber}</span>
                        <span>总孔数：{detail?.totalHoles}</span>
                        <span>总重量（t）：{detail?.totalWeight}</span>
                    </Space>
                </div>
                <CommonTable 
                    columns={columns} 
                    dataSource={[...dataSource]} 
                    pagination={false}  
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedKeys: React.Key[], selectedRows: any) => {
                            setSelectedKeys(selectedKeys);
                            setSelectedRows(selectedRows);
                        }
                    }}
                    components={{
                        body: {
                            wrapper: DraggableContainer,
                            row: DraggableBodyRow,
                        },
                    }}
                    rowKey='id'
                />
            </DetailContent>
        </Spin>
    </>
}