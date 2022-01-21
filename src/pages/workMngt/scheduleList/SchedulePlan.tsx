import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Table } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './scheduleList.module.less';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';



export default function SchedulePlan(){
    const [visible, setVisible] = useState<boolean>(false);
    const [tableVisible, setTableVisible] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [department, setDepartment] = useState<any|undefined>([]);
    const [boltUser, setBoltUser] = useState<any|undefined>([]);
    const [weldingUser, setWeldingUser] = useState<any|undefined>([]);
    const [loftingUser, setLoftingUser] = useState<any|undefined>([]);
    const [drawUser, setDrawUser] = useState<any|undefined>([]);
    const [materialUser, setMaterialUser] = useState<any|undefined>([]);
    const [materialPartUser, setMaterialPartUser] = useState<any|undefined>([]);
    const [smallSampleUser, setSmallSampleUser] = useState<any|undefined>([]);
    const params = useParams<{ id: string, status: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    
    
    const handleModalOk = async () => {
        try {
            const saveData = await form.validateFields();
            saveData.id = scheduleData.id;
            saveData.materialLeaderDepartment= Array.isArray(saveData.materialLeaderDepartment)?saveData.materialLeaderDepartment[0]:saveData.materialLeaderDepartment;
            saveData.materialPartLeaderDepartment= Array.isArray(saveData.materialPartLeaderDepartment)?saveData.materialPartLeaderDepartment[0]:saveData.materialPartLeaderDepartment;
            saveData.boltLeaderDepartment= Array.isArray(saveData.boltLeaderDepartment)?saveData.boltLeaderDepartment[0]:saveData.boltLeaderDepartment;
            saveData.weldingLeaderDepartment= Array.isArray(saveData.weldingLeaderDepartment)?saveData.weldingLeaderDepartment[0]:saveData.weldingLeaderDepartment;
            saveData.loftingLeaderDepartment=  Array.isArray(saveData.loftingLeaderDepartment)?saveData.loftingLeaderDepartment[0]:saveData.loftingLeaderDepartment;
            saveData.drawLeaderDepartment= Array.isArray(saveData.drawLeaderDepartment)?saveData.drawLeaderDepartment[0]:saveData.drawLeaderDepartment;
            saveData.smallSampleLeaderDepartment= Array.isArray(saveData.smallSampleLeaderDepartment)?saveData.smallSampleLeaderDepartment[0]:saveData.smallSampleLeaderDepartment;

            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(()=>{
                setVisible(false);
                form.setFieldsValue({});
            }).then(()=>{
            })
        
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {setVisible(false); form.setFieldsValue({})};
    const onDepartmentChange = async (value: Record<string, any>,title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch (title) {
            case "materialLeaderDepartment":
                form.setFieldsValue({materialLeader:''});
                return setMaterialUser(userData.records);
            case "materialPartLeaderDepartment":
                form.setFieldsValue({materialPartLeader:''});
                return setMaterialPartUser(userData.records);
            case "smallSampleLeaderDepartment":
                form.setFieldsValue({smallSampleLeader:''});
                return setSmallSampleUser(userData.records);
            case "drawLeaderDepartment":
                form.setFieldsValue({drawLeader:''});
                return setDrawUser(userData.records);
            case "loftingLeaderDepartment":
                form.setFieldsValue({loftingLeader:''});
                return setLoftingUser(userData.records);
            case "weldingLeaderDepartment":
                form.setFieldsValue({weldingLeader:''});
                return setWeldingUser(userData.records);
            case "boltLeaderDepartment":
                form.setFieldsValue({boltLeader:''});
                return setBoltUser(userData.records);
        };
    }
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 }
    };
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
    if (item.children) {
        return (
        <TreeNode key={item.id} title={item.title} value={item.id} className={styles.node}>
            {renderTreeNodes(item.children)}
        </TreeNode>
        );
    }
    return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });
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
                <Form form={form} {...formItemLayout} initialValues={scheduleData||{}}>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="指派方案名称" rules={[{required: true,message:'请选择指派方案名称'}]}>
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="提料负责人" rules={[{required: true,message:'请选择提料负责人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'materialLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select >
                                            { materialUser && materialUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialPartLeaderDepartment" label="提料配段负责人" rules={[{required: true,message:'请选择提料配段负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'materialPartLeaderDepartment')}  }
                                           >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialPartLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select>
                                            { materialPartUser && materialPartUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingLeaderDepartment" label="放样负责人" rules={[{required: true,message:'请选择放样负责人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'loftingLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="loftingLeader" label="" rules={[{required: true,message:'请选择放样负责人'}]} >
                                        <Select >
                                            { loftingUser && loftingUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="weldingLeaderDepartment" label="编程负责人" rules={[{required: true,message:'请选择编程负责人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'weldingLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="weldingLeader" label="" rules={[{required: true,message:'请选择编程负责人'}]} >
                                        <Select > 
                                            { weldingUser && weldingUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="smallSampleLeaderDepartment" label="小样图负责人" rules={[{required: true,message:'请选择小样图负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'smallSampleLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="smallSampleLeader" label="" rules={[{required: true,message:'请选择小样图负责人'}]} >
                                        <Select>
                                            { smallSampleUser && smallSampleUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltLeaderDepartment" label="螺栓清单负责人" rules={[{required: true,message:'请选择螺栓清单负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'boltLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="boltLeader" label="" rules={[{required: true,message:'请选择螺栓清单负责人'}]} >
                                        <Select >
                                            { boltUser &&boltUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="drawLeaderDepartment" label="图纸上传负责人" rules={[{required: true,message:'请选择图纸上传负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'drawLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="drawLeader" label="" rules={[{required: true,message:'请选择图纸上传负责人'}]} >
                                        <Select >
                                            { drawUser && drawUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal
                title='指派方案'  
                width={700} 
                visible={tableVisible} 
                onCancel={()=>{
                    setTableVisible(false)
                }}
            >
                <Button type='primary' onClick={()=>{
                    setVisible(true)
                }}>添加</Button>
                <Table
                    dataSource={[]}
                    pagination={false}
                    size='small'
                    columns={[
                        {
                            title:'方案名称',
                            dataIndex:'name'
                        },{
                            title:'操作',
                            dataIndex:'operation'
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