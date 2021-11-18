import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopUserSelectionComponent from '../../../components/WorkshopUserModal';
import moment from 'moment';



export default function ProcessDetail(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const params = useParams<{ id: string, status: string }>();
    const [visible, setVisible] = useState<boolean>(false);
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const [packageDataSource,setPackageDataSource] = useState<any>([]);
    const [userDataSource,setUserDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // let data = await RequestUtil.get(``,{})
        resole(data)
    }), {})
    const detailData: any = data;
    const delRow = (index: number) => {
        userDataSource.splice(index, 1);
        setUserDataSource([...userDataSource]);
    }
    const tableColumns = [
        { title: '杆塔号', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '呼高', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '入库重量', dataIndex: 'createTime', key: 'createTime' },
        { title: '总基数', dataIndex: 'description', key: 'description' },
        { title: '入库基数', dataIndex: 'operation', key: 'operation'}
    ]
    const packageColumns = [
        { title: '捆号/包号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '包类型', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '重量', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '入库数', dataIndex: 'createTime', key: 'createTime' },
        { title: '区位', dataIndex: 'description', key: 'description' }
    ]
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={params.status!=='3'?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    // setVisible(true)
                    form.validateFields().then(()=>{
                        let value = form.getFieldsValue(true);
                        RequestUtil.post(``).then(()=>{
                            message.success('入库成功！')
                        }).then(()=>{
                            history.push(`/packagingWorkshop/processingTask`)
                        })
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
                            <Form.Item name="time" label="入库单编号" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="time" label="内部合同编号" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="time" label="订单编号" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="time" label="工程名称" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="noDispatchStatus" label="产品类型" initialValue={1}>
                                <Select style={{width:'100%'}}>
                                    <Select.Option value={1} key={1}>角钢塔</Select.Option>
                                    <Select.Option value={2} key={2}>钢管</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="time" label="计划号" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="time" label="塔型" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="time" label="包装时间" initialValue={[moment('2015-01-01'), moment('2015-01-01')]} style={{width:'100%'}} rules={[
                                {
                                    "required": true,
                                    "message": "请选择包装时间"
                                }
                            ]}>
                                <DatePicker.RangePicker showTime style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="noDispatchStatus" label="仓库" initialValue={1} rules={[
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
                        <Col span={12}>
                            <Form.Item name="time" label="车间" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="time" label="班组" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="noDispatchStatus" label="库位" initialValue={1} rules={[
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
                            <Form.Item name="equipmentName" label="包装人员" initialValue={undefined} rules={[
                                {
                                    "required": true,
                                    "message": "请选择包装人员"
                                }
                            ]}>
                                <Input maxLength={ 50 } addonAfter={ <WorkshopUserSelectionComponent onSelect={ (selectedRows: any[] | any) => {
                                    console.log(selectedRows)
                                    // setEquipment(selectedRows);
                                    form.setFieldsValue({
                                        equipmentName: selectedRows.map((item: any,index:number)=>{
                                            return item.name
                                        })
                                    });
                                } } buttonType="link" buttonTitle="+编辑" rowSelectionType="checkbox"/> } disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <DetailTitle title="杆塔明细" />
                <Table 
                    columns={tableColumns}
                    dataSource={[{id:'1'}]} 
                    onRow={record => {
                        return {
                          onClick: async event => {
                              const packageData= await RequestUtil.get(``,{id:record.id});
                              setPackageDataSource(packageData)
                          }, // 点击行
                        };
                    }}
                    pagination={false}
                />
                <DetailTitle title="包信息" />
                <CommonTable 
                    columns={packageColumns}
                    dataSource={packageDataSource} 
                    pagination={false}
                />
            </DetailContent>
            {/* <Modal
                visible={ visible } 
                width="40%" 
                title="采集确认-选择员工"
                footer={ <Space>
                    <Button type="primary" ghost  onClick={() => setVisible(false) }>取消</Button>
                    <Button type="primary" onClick={async () => {
                        await RequestUtil.get(``,{}).then(()=>{
                            message.success('确认成功！');
                            setVisible(false);
                        }).then(()=>{
                            history.push(`/workshopManagement/processingTask`)
                        })
                    }} disabled={!(userDataSource.length>0)}>确认加工完成</Button>
                </Space> } 
                onCancel={ () => setVisible(false) }
            >
                <WorkshopUserSelectionComponent onSelect={ (selectedRows: object[] | any) => {
                    let temp = [...userDataSource];    
  
                    temp.push(selectedRows[0]);
                    setUserDataSource(temp);
                    } } buttonTitle="添加员工" rowSelectionType="checkbox"/>
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
                    dataSource={[...userDataSource]} 
                    pagination={false}
                />
            </Modal> */}
        </Spin>
    </>
}