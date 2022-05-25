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
import zhCN from 'antd/es/date-picker/locale/zh_CN';
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
    const [dateForm] = Form.useForm();
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/cyclePlan/${params.id}`)
        setDataSource(data?.issueOrderList)
        setDetail(data)
        form.setFieldsValue({
            ...data,
            date:[moment(data?.startTime),moment(data?.endTime)],

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
            key: 'storageMaterialDescription',
            title: '库存备料',
            width: 100,
            fixed: "right",
            dataIndex: 'storageMaterialDescription',
            render: (_: string, record: any): React.ReactNode => (
                <span title={_}>{_&&_.length>50?_.slice(0,30)+'...':_}</span>
            )
        },
        {
            key: 'planCompleteTime',
            title: '计划完成日期',
            width: 100,
            fixed: "right",
            dataIndex: 'planCompleteTime'
        },
        {
            key: 'processMaterialDescription',
            title: '生产备料',
            width: 100,
            fixed: "right",
            dataIndex: 'processMaterialDescription',
            render: (_: string, record: any): React.ReactNode => (
                <span title={_}>{_&&_.length>50?_.slice(0,30)+'...':_}</span>
            )
        },
        {
            key: 'description',
            title: '周期计划备注',
            width: 100,
            fixed: "right",
            dataIndex: 'description',
            render: (_: string, record: any): React.ReactNode => (
                <span title={_}>{_&&_.length>50?_.slice(0,30)+'...':_}</span>
            )
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
                    disabled={record?.status===2||detail?.status===2}
                >
                    <Button type="link" disabled={record?.status===2||detail?.status===2}>删除</Button>
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


    const useDate = () => {
        Modal.confirm({
            title: "设置计划完成日期",
            icon: null,
            content: <Form form={dateForm}>
                <Form.Item
                    label="计划完成日期"
                    name="planCompleteTime"
                    rules={[{ required: true, message: '请选择计划完成日期' }]}>
                    <DatePicker 
                        format='YYYY-MM-DD' 
                        placeholder='请选择'
                        locale={zhCN} 
                        disabledDate={
                            current => { 
                                const value = form.getFieldsValue(true)
                                const formatDate = value.date.map((item: any) => item.format("YYYY-MM-DD"))
                                value.startTime = formatDate[0];
                                value.endTime = formatDate[1];
                                return current && (current < moment(formatDate[0]) || current > moment(formatDate[1]).add(1, 'days'))
                                
                            }
                        }
                    />
                </Form.Item>
            </Form>,
            onOk: handleModalOk,
            onCancel() {
                dateForm.resetFields()
                // history.go(0)
            }
        })
    }
    const handleModalOk = async () => {
        await dateForm.validateFields()
        Modal.confirm({
            title: "周期计划计划开始日期~计划完成日期未保存，是否保存？",
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    const valueDate = dateForm.getFieldsValue(true)
                    if(JSON.stringify(valueDate) == "{}"){
                        reject(false)
                    }
                    await dateForm.validateFields()
                    console.log(valueDate)
                    const submitValue = selectedKeys.map((item:any)=>{
                        return {
                            id:item,
                            planCompleteTime: moment(valueDate?.planCompleteTime).format('YYYY-MM-DD')
                        }
                    })
                    await RequestUtil.post(`/tower-aps/cyclePlan/cyclePlanCompleteTime`,submitValue)
                    message.success("已成功设置计划完成日期！")
                    dateForm.resetFields()
                    const value = form.getFieldsValue(true)
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
                        deleteIdList: deleteIdList,
                        issueOrderDTOList: dataSource.map((item:any)=>{
                            return{
                                ...item,
                                planCompleteTime: selectedKeys.includes(item.id)?moment(valueDate?.planCompleteTime).format('YYYY-MM-DD'):item?.planCompleteTime
                            }
                        }) 
                    }
                    await RequestUtil.put(`/tower-aps/cyclePlan`,submitData)
                    resove(true)
                    await run()
                    setSelectedKeys([])
                    setDeleteIdList([])
                    setSelectedRows([])
                    history.go(0)
                } catch (error) {
                    console.log(error)
                }
            }),
            onCancel: async () => {
                const valueDate = dateForm.getFieldsValue(true)
                await dateForm.validateFields()
                console.log(valueDate)
                const submitValue = selectedKeys.map((item:any)=>{
                    return {
                        id:item,
                        planCompleteTime: moment(valueDate?.planCompleteTime).format('YYYY-MM-DD')
                    }
                })
                RequestUtil.post(`/tower-aps/cyclePlan/cyclePlanCompleteTime`,submitValue)
                message.success("已成功设置计划完成日期！")
                dateForm.resetFields()
                history.go(0)
            }
        })
        
    }
    return <>
        <Spin spinning={loading}>
        <Modal visible={ visible } title='周期计划备注' okText="确认" onOk={ async ()=>{
                await formRef.validateFields()
                const value = formRef.getFieldsValue(true)

                const submitData = selectedKeys.map((item:any)=>{
                    return {
                        id: item,
                        description: value?.description
                    }
                })
                await RequestUtil.post(`/tower-aps/cyclePlan/cycleDescription`,submitData).then(()=>{
                    message.success('备注添加成功！')
                })
                setVisible(false)
                formRef.resetFields()
                await run()
            } } onCancel={ ()=>{
                formRef.resetFields()
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
                    {detail?.status!==2&&<Button type="primary" ghost onClick={async () =>{
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
                            deleteIdList: deleteIdList,
                            issueOrderDTOList: dataSource 
                        }
                        await RequestUtil.put(`/tower-aps/cyclePlan`,submitData)
                        message.success('保存成功！')
                        setSelectedKeys([])
                        setDeleteIdList([])
                        setSelectedRows([])
                        await run()
                    }}>保存</Button>}
                    {detail?.status!==2&&<Button type="primary" ghost onClick={async () => {
                            await RequestUtil.post(`/tower-aps/cyclePlan/confirmMaterial/${params.id}`)
                            message.success("备料确认已下发！")
                            await run()
                    }} disabled={detail?.status===2}>备料确认</Button>}
                    {detail?.status!==2&&<Popconfirm
                        title="下发后不可取消，是否下发周期计划？"
                        onConfirm={async () => {
                            await RequestUtil.post(`/tower-aps/cyclePlan/issue/${params.id}`)
                            message.success("下发成功！")
                            await run()
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="primary" ghost >周期计划下发</Button>
                    </Popconfirm>}
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
                            <Form.Item name="materialStatus" label="备料状态" >
                                <Select placeholder="请选择" style={{ width: "100%" }} disabled>
                                    <Select.Option value={1} key="1">未下发</Select.Option>
                                    <Select.Option value={2} key="2">已下发</Select.Option>
                                    <Select.Option value={3} key="3">已反馈</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <DetailTitle title="周期计划下达单"/>
                {detail?.status!==2&&<Space>
                    <ReleaseOrder run={run} data={detail}/>
                    <Button type="primary" ghost onClick={useDate} disabled={!(selectedKeys.length > 0)}>计划完成日期</Button>
                    <Button type="primary" ghost onClick={() => {
                        setVisible(true)
                    }} disabled={!(selectedKeys.length > 0)}>周期计划备注</Button>
                </Space>}
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
                            console.log(selectedRows)
                            const totalHoles = selectedRows.reduce((pre: any,cur: { totalHoles: any;totalNumber: number })=>{
                                return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalHoles!==null?cur.totalHoles:0) 
                            },0)
                            const totalNumber = selectedRows.reduce((pre: any,cur: { totalNumber: any; })=>{
                                return parseFloat(pre!==null?pre:0 )+ parseFloat(cur.totalNumber!==null?cur.totalNumber:0 )
                            },0)
                            const totalWeight = selectedRows.reduce((pre: any,cur: { totalWeight: any; })=>{
                                return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)
                            },0)
                            setDetail({
                                ...detail,
                                totalHoles,
                                totalNumber,
                                totalWeight
                            })
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