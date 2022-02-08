import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Table, InputNumber, Radio } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Attachment, CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './template.module.less';



export default function TaskNew(){
    const [visible, setVisible] = useState<boolean>(false);
    const [printVisible, setPrintVisible] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [radioValue, setRadioValue] = useState<string>('Apple');
    const [formRef] = Form.useForm();
    const [department, setDepartment] = useState<any|undefined>([]);
    const [materialUser, setMaterialUser] = useState<any|undefined>([]);
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


            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(()=>{
                setVisible(false);
                form.setFieldsValue({});
            }).then(()=>{
            })
        
        } catch (error) {
            console.log(error)
        }
    }
    const handlePrintModalOk = async () => {
        try {
            const saveData = await formRef.validateFields();
            console.log(saveData)
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
    const handlePrintModalCancel = () => {setPrintVisible(false); formRef.setFieldsValue({})};
    const onDepartmentChange = async (value: Record<string, any>,title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch (title) {
            case "materialLeaderDepartment":
                form.setFieldsValue({materialLeader:''});
                return setMaterialUser(userData.records);
        };
    }
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 }
    };
    const formItemPrintLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
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
    // const plainOptions = ['全部', '自定义'];
    const plainOptions = [
        { label: '全部', value: 'Apple' },
        { label: '自定义', value: 'Pear' },
      ];
    return (
        <>
            <Modal 
                title={'创建'}
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
                <DetailTitle title='基本信息'/>
                <Form form={form} {...formItemLayout} initialValues={scheduleData||{}}>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="计划号" rules={[{required: true,message:'请选择计划号'}]}>
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={11}>
                            <Form.Item name="materialLeaderDepartment" label="塔型" rules={[{required: true,message:'请选择塔型'}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="产品类型" >
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={11}>
                            <Form.Item name="materialLeaderDepartment" label="打印条件" >
                                <Input addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={() => {
                                    setPrintVisible(true)
                                }}>+编辑</Button>}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="数量" rules={[{required: true,message:'请输入数量'}]}>
                                        <InputNumber min={1} max={9999} precision={0} style={{width:'100%'}}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={11}>
                            <Form.Item name="materialLeaderDepartment" label="钢板明细" >
                                <Button type='link' onClick={()=>history.push(`/workMngt/templateList/steel/${'id'}`)}>查看</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeaderDepartment" label="接收人" rules={[{required: true,message:'请选择接收人部门'}]}>
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'materialLeaderDepartment')}  }
                                            >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择接收人'}]} >
                                        <Select >
                                            { materialUser && materialUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={11}>
                            <Form.Item name="description" label="备注">
                                <TextArea maxLength={200} showCount rows={1}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Attachment edit/>
            </Modal>
            <Modal
                title='样板打印条件'  
                width={500} 
                visible={printVisible} 
                onCancel={handlePrintModalCancel}
                footer={
                    <>
                        <Button onClick={handlePrintModalCancel}>关闭</Button>
                        <Button type='primary' onClick={handlePrintModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Form form={formRef} {...formItemPrintLayout} initialValues={scheduleData||{}}>  
                        <Form.Item label="规格">
                            <Input.Group>
                                <Form.Item
                                    name={['address', 'province']}
                                    noStyle
                                    rules={[{ required: true, message: 'Province is required' }]}
                                >
                                    <Radio.Group options={plainOptions} onChange={ e => {setRadioValue(e.target.value)}}/>
                                </Form.Item>
                               {radioValue==='Pear'&& <Form.Item
                                    name={['address', 'after']}
                                    noStyle
                                >
                                    <InputNumber style={{ width: '25%' }} />
                                </Form.Item>}
                                {radioValue==='Pear'&& <Form.Item
                                    name={['address', 'before']}
                                    noStyle
                                >
                                    <InputNumber style={{ width: '25%' }} />
                                </Form.Item>}
                            </Input.Group>
                        </Form.Item>
                        <Form.Item name="materialLeaderDepartment" label="特殊工艺">
                            <Input/>
                        </Form.Item>
                    
                </Form>
            </Modal>
            <Button type='primary' onClick={()=>{
                setVisible(true)
            }}>创建样板任务</Button>
            
        </>
    )
}