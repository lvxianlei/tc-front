import React, { useState } from 'react'
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Spin } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
// import { baseInfoData } from './question.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopEquipmentSelectionComponent, { IUser } from '../../../components/WorkshopEquipmentModal';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../../utils/AuthUtil';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'createDeptName', key: 'createDeptName', },
    { title: '操作人', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '操作时间', dataIndex: 'createTime', key: 'createTime' },
    // { title: '任务状态', dataIndex: 'status', key: 'status',  render: (value: number, record: object): React.ReactNode => {
    //     const renderEnum: any = [
    //         {
    //             value: 0,
    //             label: "已拒绝"
    //         },
    //         {
    //             value: 1,
    //             label: "待修改"
    //         },
    //         {
    //             value: 2,
    //             label: "已修改"
    //         },
    //         {
    //             value: 3,
    //             label: "已删除"
    //         },
    //     ]
    //     return <>{renderEnum.find((item: any) => item.value === value).label}</>
    // }},
    { title: '备注', dataIndex: 'description', key: 'description' }
]

export default function OtherDetail(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const params = useParams<{ id: string }>();
    const [show, setShow] = useState<boolean>(false);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        console.log(params.id)
        let data:any = {};
        if(params.id!=='new'){
            data = await RequestUtil.get(`/tower-science/issue/material?id=${params.id}`);
        }
        resole(data)
    }), {})
    const detailData: any = data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.post(`/tower-science/issue/verify`,{id:params.id}).then(()=>{
                        message.success('修改成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>确认派工</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基础信息" />
                <Form form={form} { ...formItemLayout }>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="equipmentName" label="派工设备" initialValue={undefined} rules={[
                                {
                                    "required": true,
                                    "message": "请选择派工设备"
                                }
                            ]}>
                                <Input maxLength={ 50 } addonAfter={ <WorkshopEquipmentSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                    // setSelectedRows(selectedRows);
                                    // form.setFieldsValue({leaderName: selectedRows[0].name});
                                } } buttonType="link" buttonTitle="+选择设备" /> }/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="workshopDeptName" label="派工车间" initialValue={undefined}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="deptProcessesName" label="工序" initialValue={undefined}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="productionLinesName" label="产线" initialValue={undefined}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="startTime" label="任务时间范围" initialValue={undefined} rules={[
                                {
                                    "required": true,
                                    "message": "请选择任务时间范围"
                                }
                            ]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="noDispatchStatus" label="仅显示未派工明细" initialValue={1} rules={[
                                {
                                    "required": true,
                                    "message": "请选择是否显示未派工明细"
                                }
                            ]}>
                                <Select style={{width:'100%'}}>
                                    <Select.Option value={1} key={1}>是</Select.Option>
                                    <Select.Option value={2} key={2}>否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Space>
                <Button type='primary' onClick={()=>{
                    // RequestUtil.get(`/workshopOperating/dispatchDetail`,{startTime,endTime,equipmentId,noDispatchStatus}).then(()=>{
                    //     message.success('查询成功！')
                    // }).then(()=>{
                    //     setShow(true)
                    // })
                    setShow(true)
                }}>查询</Button>
                <Button type='primary' ghost onClick={()=>{
                    setShow(false)
                    form.resetFields();
                }}>重置</Button>
                </Space>
                {show?<>
                    <DetailTitle title="指派班组选择" />
                    <DetailTitle title="加工明细" />
                    <CommonTable 
                        columns={tableColumns} 
                        rowKey='id'
                        dataSource={[{id:"1"}]} 
                        pagination={false} 
                        rowSelection={{
                            selectedRowKeys: [{id:"1"}].map((item:any)=>{
                                return item.id
                            }),
                            type: "checkbox",
                            onChange: (select:any)=>{
                                console.log(select)
                            },
                        }}
                    />
                </>:null}
            </DetailContent>
        </Spin>
    </>
}