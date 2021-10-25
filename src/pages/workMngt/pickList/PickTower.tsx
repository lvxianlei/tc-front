import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Popconfirm, Select, message, InputNumber } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
export interface IDetail {
    productCategory?: string;
    productCategoryName?: string;
    productId?: string;
    productNumber?: string;
    materialDrawProductSegmentList?: IMaterialDetail[]
}
export interface IMaterialDetail{
    count: string;
    id: string;
    name: string;
}
export default function PickTower(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState({});
    const [productId, setProductId] = useState('');
    const [detail, setDetail] = useState<IDetail>({});
    const handleModalOk = async () => {
        try {
            const data = await form.validateFields()
            const submitData = data.detailData.map((item:any,index:number)=>{
                return{
                    segmentId: detail?.materialDrawProductSegmentList&&detail?.materialDrawProductSegmentList[index].id,
                    segmentName: item.name,
                    count: item.count
                }
            });
            RequestUtil.post(`/tower-science/product/material/segment/submit?productCategoryId=${params.id}&productId=${productId}`,submitData).then(()=>{
                message.success('提交成功！');
                setVisible(false);
                setProductId('')
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalSave =  async () => {
        try {
            const data = await form.validateFields();
            const saveData = data.detailData.map((item:any,index:number)=>{
                return{
                    segmentId: detail?.materialDrawProductSegmentList&&detail?.materialDrawProductSegmentList[index].id,
                    segmentName: item.name,
                    count: item.count
                }
            });
            RequestUtil.post(`/tower-science/product/material/segment/save?productCategoryId=${params.id}&productId=${productId}`,saveData).then(()=>{
                message.success('保存成功！');
                setVisible(false);
                setProductId('')
            })
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            width: 100,
            dataIndex: 'productNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'materialDeliverTime',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'materialDeliverTime'
        },
        {
            key: 'materialUser',
            title: '配段人',
            width: 100,
            dataIndex: 'materialUser'
        },
        {
            key: 'materialStatus',
            title: '杆塔提料状态',
            width: 100,
            dataIndex: 'materialStatus',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "待指派"
                  },
                  {
                    value: 2,
                    label: "提料中"
                  },
                  {
                    value: 3,
                    label: "配段中"
                  },
                  {
                    value: 4,
                    label: "已完成"
                  },
                  {
                    value: 5,
                    label: "已提交"
                  },
                ]
                return <>{value&&value!==-1?renderEnum.find((item: any) => item.value === value).label:null}</>
            }
        },
        {
            key: 'materialUpdateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'materialUpdateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={async () => {
                        setVisible(true);
                            let data: IDetail = await RequestUtil.get<IDetail>(`/tower-science/product/material/${record.id}`)
                            const detailData: IMaterialDetail[]|undefined = data&&data.materialDrawProductSegmentList&&data.materialDrawProductSegmentList.map((item:IMaterialDetail)=>{
                                return {
                                    ...item,
                                    // value:item.count===-1?0:item.count,
                                }
                            })
                            setProductId(record.id);
                            setDetail({
                                ...data,
                                materialDrawProductSegmentList:detailData
                            })
                            
                    }}>配段</Button>
                    <Link to={`/workMngt/pickList/pickTower/${params.id}/pickTowerDetail/${record.id}`}>杆塔提料明细</Link>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false);setProductId('')};
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 }
    };
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <>
            <Modal title='配段信息'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
                {detail?.materialDrawProductSegmentList?<Form initialValues={{ detailData : detail.materialDrawProductSegmentList }} autoComplete="off" form={form}>  
                    <Row>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name="productCategoryName" label="塔型">
                                <span>{detail?.productCategoryName}</span>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name="productNumber" label="杆塔号">
                                <span>{detail?.productNumber}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                    
                        <Form.List name="detailData">
                            
                            {
                                ( fields , { add, remove }) => fields.map(
                                    field => (
                                    <>
                                        <Col span={ 1}></Col>
                                        <Col span={ 11 }>
                                        <Form.Item name={[ field.name , 'segmentName']} label='段号'>
                                            <span>{detail.materialDrawProductSegmentList&&detail.materialDrawProductSegmentList[field.name].name}</span>
                                        </Form.Item>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={ 11 }>
                                        <Form.Item  name={[ field.name , 'count']} label='段数' initialValue={[ field.name , 'count']}>
                                            <InputNumber min={0} precision={0} style={{width:'100%'}}/>
                                        </Form.Item>
                                        </Col>
                                    </>
                                    )
                                )
                            }
                        </Form.List> 
                    </Row>
                </Form>:null}
                <Space style={{position:'relative',left:'80%'}}>
                    <Button type="primary" ghost onClick={()=>handleModalCancel()}>取消</Button>
                    <Button type="primary" onClick={()=>handleModalSave()}>保存</Button>
                    <Button type="primary" onClick={()=>handleModalOk()}>保存并提交</Button>
                </Space>
            </Modal>
            <Page
                path="/tower-science/product/material"
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                requestData={{ productCategoryId: params.id }}
                extraOperation={
                    <Space>
                    <Button type="primary">导出</Button>
                    <Popconfirm
                        title="确认提交?"
                        onConfirm={ async ()=>{
                            await RequestUtil.post(`/tower-science/product/material/submit?productCategoryId=${params.id}`).then(()=>{
                                message.success('提交成功！')
                            }).then(()=>{
                                history.push('/workMngt/pickList')
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                    >   
                        <Button type="primary" >提交</Button>
                    </Popconfirm>
                    <Button type="primary" onClick={()=>history.push('/workMngt/pickList')}>返回上一级</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'status',
                        label: '杆塔提料状态',
                        children: <Select style={{width:'100px'}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>配段中</Select.Option>
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                            <Select.Option value={3} key={3}>已提交</Select.Option>
                        </Select>
                    },
                    {
                        name: 'loftingUser',
                        label:'配段人',
                        children: <Input/>
                    }
                ]}
            />
        </>
    )
}