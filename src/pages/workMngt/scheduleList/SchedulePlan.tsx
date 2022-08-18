import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Table, Popconfirm, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { BaseInfo} from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { userBaseInfo }  from "./userBase.json"
export default function SchedulePlan(props: any){
    const [visible, setVisible] = useState<boolean>(false);
    const [tableVisible, setTableVisible] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [tableDataSource, setTableDataSource] = useState<any|undefined>([])
    const params = useParams<{ id: string, status: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setTableDataSource(planData);
        
        resole(data)
    }), {})
    
    
    const handleModalOk = async () => {
        try {
            const saveData = await form.validateFields();
            saveData.id = scheduleData.id;
            saveData.materialLeader = saveData.material?.id
            saveData.materialLeaderName = saveData.material?.name
            saveData.boltLeader = saveData.bolt?.id
            saveData.boltLeaderName = saveData.bolt?.name
            saveData.weldingLeader = saveData.welding?.id
            saveData.weldingLeaderName = saveData.welding?.name
            saveData.loftingLeader = saveData.lofting?.id
            saveData.loftingLeaderName = saveData.lofting?.name
            saveData.drawLeader = saveData.draw?.id
            saveData.drawLeaderName = saveData.draw?.name
            saveData.smallSampleLeader = saveData.smallSample?.id
            saveData.smallSampleLeaderName = saveData.smallSample?.name
           
           console.log(saveData)
            await RequestUtil.post('/tower-science/tower-science/assignPlan', saveData).then(async ()=>{
                setVisible(false);
                const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
                setTableDataSource(planData);
                form.resetFields();
            })
        
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {setVisible(false); form.resetFields()}; 
   
    const handleBaseInfoChange = async (fields: any, allFields: any) => {
        console.log(fields,allFields)
    }
    return (
        <>
            <Modal 
                title='指派信息'  
                width={800} 
                visible={visible} 
                onCancel={handleModalCancel}
                footer={
                    <>
                        <Button onClick={handleModalCancel}>关闭</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Spin spinning={load}>
                <BaseInfo
                    form={form}
                    col={2}
                    classStyle={"overall-form-class-padding0"}
                    onChange={handleBaseInfoChange}
                    columns={userBaseInfo.map((item: any) => {
                        switch (item.dataIndex) {
                            case "assignName":
                                return ({ ...item, render: () => {
                                    console.log(item)
                                    return <Form.Item name="assignName" label="" rules={[{required: true,message:'请填写指派方案名称'}]}>
                                    <Input maxLength={20}/>
                                </Form.Item>
                                } })
                           default:
                                return item
                        }
                    })}
                    dataSource={scheduleData} edit 
                />
                </Spin>
            </Modal>
            <Modal
                title='指派方案'  
                width={700} 
                visible={tableVisible} 
                onCancel={()=>{
                    props?.plan(tableDataSource)
                    setTableVisible(false)
                }}
                footer={false}
            >
                <Button type='primary' onClick={()=>{
                    form.setFieldsValue({
                        assignName:'',
                    })
                    setScheduleData({})
                    setVisible(true)
                   
                }} style={{marginBottom:'8px'}}>添加</Button>
                <Table
                    dataSource={tableDataSource}
                    pagination={false}
                    size='small'
                    columns={[
                        {
                            title:'方案名称',
                            dataIndex:'assignName'
                        },{
                            title:'操作',
                            dataIndex:'operation',
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type='link' onClick={async ()=>{
                                            setLoad(true)
                                            const resData: any = await RequestUtil.get(`/tower-science/assignPlan/planDetailById/${record.id}`)
                                            setScheduleData(resData);
                                         
                                            
                                            form.setFieldsValue({
                                                ...resData,
                                                bolt: { id: resData.boltLeader, value: resData.boltLeaderName },
                                                welding: { id: resData.weldingLeader, value: resData.weldingLeaderName },
                                                lofting: { id: resData.loftingLeader, value: resData.loftingLeaderName },
                                                draw: { id: resData.drawLeader, value: resData.drawLeaderName },
                                                smallSample: { id: resData.smallSampleLeader, value: resData.smallSampleLeaderName },
                                            });
                                            setLoad(false)
                                            setVisible(true);
                                    }}>编辑</Button>
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={() => {
                                            RequestUtil.delete(`/tower-science/assignPlan/${record.id}`).then(async res => {
                                                const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
                                                setTableDataSource(planData);
                                            });
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link">删除</Button>
                                    </Popconfirm>
                                </Space>
                            )
                        }
                    ]}
                />
            </Modal>
            <Button type='primary' onClick={()=>{
                setTableVisible(true)
            }}>指派方案管理</Button>
            
        </>
    )
}