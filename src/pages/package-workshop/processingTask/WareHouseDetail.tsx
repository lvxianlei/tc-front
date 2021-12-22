import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Space, Spin, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopUserSelectionComponent from '../../../components/WorkshopUserModal';
import moment from 'moment';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';



export default function ProcessDetail(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const params = useParams<{ id: string, status: string }>();
    const [visible, setVisible] = useState<boolean>(false);
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const [packageDataSource,setPackageDataSource] = useState<any>([]);
    const [userDataSource,setUserDataSource] = useState<any>([]);
    const [paragraphList,setParagraphList] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`tower-production/packageWorkshop/taskCollectDetail/${params.id}`)
        form.setFieldsValue({
            ...data,
            packingWarehouseTime:data.packingWarehouseTime?moment(data.packingWarehouseTime):''
        })
        const packageData:any = data.productVOList.length>0 && await RequestUtil.get(`tower-production/packageWorkshop/packageList/${data.productVOList[0].id}`);
        data.productVOList.length>0 && setPackageDataSource(packageData)
        data.productVOList.length>0 && formRef.setFieldsValue({ dataV: packageData })
        resole(data)
    }), {})
    const detailData: any = data;
    const delRow = (index: number) => {
        userDataSource.splice(index, 1);
        setUserDataSource([...userDataSource]);
    }
    const tableColumns = [
        { title: '塔型', dataIndex: 'productCategoryName', key: 'productCategoryName', },
        { title: '杆塔号', dataIndex: 'productNumber', key: 'productNumber' },
        { title: '呼高', dataIndex: 'productHeight', key: 'productHeight' },
        { title: '入库重量', dataIndex: 'warehouseWeight', key: 'warehouseWeight'},
        { title: '总基数', dataIndex: 'number', key: 'number'},
        { title: '入库基数', dataIndex: 'currentStatus', key: 'currentStatus'},
    ]
    const packageColumns = [
        { title: '捆号/包号', dataIndex: 'balesCode', key: 'balesCode', },
        { title: '包类型', dataIndex: 'packageType', key: 'packageType' },
        { title: '重量', dataIndex: 'weightCount', key: 'weightCount' },
        { title: '包长度', dataIndex: 'packageLength', key: 'packageLength', render:(_a: any, _b: any, index: number): React.ReactNode =>(
            <Form.Item name={['dataV',index, "packageLength"]} initialValue={ _a } >
                <InputNumber style={{width:'100%'}} precision={0} min={0}/>
            </Form.Item>
        ) },
        { title: '包高度', dataIndex: 'packageHeight', key: 'packageHeight', render:(_a: any, _b: any, index: number): React.ReactNode =>(
            <Form.Item name={['dataV',index, "packageHeight"]} initialValue={ _a } >
                <InputNumber style={{width:'100%'}} precision={0} min={0}/>
            </Form.Item>
        ) },
        { title: '入库数', dataIndex: 'num', key: 'num'},
        { title: '库位', dataIndex: 'warehousePosition', key: 'warehousePosition', render:(_a: any, _b: any, index: number): React.ReactNode =>(
            <Form.Item name={['dataV',index, "warehousePosition"]} initialValue={ _a } rules={[{required:true, message:'请选择'}]}>
                <Select>
                    { paragraphList.map((item: any) => {
                        return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                    }) }
                </Select>
            </Form.Item>
        ) }
    ]
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={params.status==='3'?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await  form.validateFields();
                    let value = form.getFieldsValue(true);
                    RequestUtil.put(`/packageWorkshop/confirmWarehouse`).then(()=>{
                        message.success('入库成功！')
                    }).then(()=>{
                        history.push(`/packagingWorkshop/processingTask`)
                    })
                }}>确认入库</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <Form form={form} { ...formItemLayout }>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="warehouseNumber" label="入库单编号" >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="internalNumber" label="内部合同编号">
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="saleOrderNumber" label="订单编号" >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="orderProjectName" label="工程名称" >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="productType" label="产品类型" >
                                <Select style={{width:'100%'}} disabled>
                                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="planNumber" label="计划号" >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="packingWarehouseTime" label="包装时间"  style={{width:'100%'}} rules={[
                                {
                                    "required": true,
                                    "message": "请选择包装时间"
                                }
                            ]}>
                                <DatePicker style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="warehouseId" label="仓库" initialValue={1} rules={[
                                {
                                    "required": true,
                                    "message": "请选择仓库"
                                }
                            ]}>
                                <Select style={{width:'100%'}}>
                                    <Select.Option value={1} key={1}>成品仓库</Select.Option>
                                    <Select.Option value={2} key={2}>半成品仓库</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        
                        <Col span={12}>
                            <Form.Item name="unit" label="生产单元" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="noDispatchStatus" label="库区" initialValue={1} rules={[
                                {
                                    "required": true,
                                    "message": "请选择库位"
                                }
                            ]}>
                                <Select style={{width:'100%'}}>
                                    <Select.Option value={1} key={1}>角钢成品库</Select.Option>
                                    <Select.Option value={2} key={2}>钢管成品库</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                       
                        <Col span={12}>
                            <Form.Item name="teamName" label="班组" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="equipmentName" label="包装人员" initialValue={undefined} rules={[
                                {
                                    "required": true,
                                    "message": "请选择包装人员"
                                }
                            ]}>
                                <Input maxLength={ 50 } addonAfter={ 
                                    <Button type='link' onClick={()=>{
                                        setVisible(true)
                                    }} style={{ paddingBottom: '0', paddingTop: '0', height: 'auto', lineHeight: 1 }}>+编辑</Button>
                                } disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <DetailTitle title="杆塔明细" />
                
                <Table 
                    columns={tableColumns}
                    dataSource={detailData?.productVOList} 
                    onRow={record => {
                        return {
                          onClick: async event => {
                              const packageData= await RequestUtil.get(`tower-production/packageWorkshop/packageList/${record.id}`);
                              setPackageDataSource(packageData)
                          }, // 点击行
                        };
                    }}
                    pagination={false}
                />
                <DetailTitle title="包信息" />
                <Form form={formRef}>
                    <CommonTable 
                        columns={packageColumns}
                        dataSource={packageDataSource} 
                        pagination={false}
                    />
                </Form>
            </DetailContent>
            <Modal
                visible={ visible } 
                width="40%" 
                title="采集入库-包装人员"
                footer={ <Space>
                    <Button type="primary" ghost  onClick={() => setVisible(false) }>取消</Button>
                    <Button type="primary" onClick={async () => {
                        await RequestUtil.get(``,{}).then(()=>{
                            message.success('确认成功！');
                            setVisible(false);
                        })
                    }} disabled={!(userDataSource.length>0)}>确认</Button>
                </Space> } 
                onCancel={ () => setVisible(false) }
            >
                <WorkshopUserSelectionComponent onSelect={ (selectedRows: object[] | any) => {
                    let temp = [...userDataSource];    
                    temp.push(selectedRows[0]);
                    setUserDataSource(temp);
                    } } buttonTitle="添加员工" selectKey={[...userDataSource]}/>
                <Table 
                    columns={[
                        { title: '姓名', dataIndex: 'name', key:'name' },
                        { title: '操作', dataIndex: 'operation', key: 'operation' ,render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={ () => delRow(index) }
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="link">删除</Button>
                                </Popconfirm>
                            </Space>
                        ) }
                    ]}
                    size="small"
                    dataSource={[...userDataSource]} 
                    pagination={false}
                />
            </Modal>
        </Spin>
    </>
}