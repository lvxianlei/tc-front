import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect } from 'antd'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './scheduleList.module.less';

export default function ScheduleView(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [department, setDepartment] = useState<any|undefined>([]);
    const [boltUser, setBoltUser] = useState<any|undefined>([]);
    const [combinedWeldingUser, setCombinedWeldingUser] = useState<any|undefined>([]);
    const [loftingUser, setLoftingUser] = useState<any|undefined>([]);
    const [loftingPartUser, setLoftingPartUser] = useState<any|undefined>([]);
    const [materialUser, setMaterialUser] = useState<any|undefined>([]);
    const [materialPartUser, setMaterialPartUser] = useState<any|undefined>([]);
    const [smallSampleUser, setSmallSampleUser] = useState<any|undefined>([]);
    const params = useParams<{ id: string }>();
    const handleModalOk = async () => {
        try {
            const saveData = await form.validateFields();
            saveData.id = scheduleData.id;
            saveData.boltDeliverTime= moment(saveData.boltDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.combinedWeldingDeliverTime= moment(saveData.combinedWeldingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingDeliverTime= moment(saveData.loftingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingPartDeliverTime= moment(saveData.loftingPartDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.materialDeliverTime=moment(saveData.materialDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.materialPartDeliverTime= moment(saveData.materialPartDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.smallSampleDeliverTime= moment(saveData.smallSampleDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.materialLeaderDepartment= saveData.materialLeaderDepartment[0];
            saveData.materialPartLeaderDepartment= saveData.materialPartLeaderDepartment[0];
            saveData.boltLeaderDepartment= saveData.boltLeaderDepartment[0];
            saveData.combinedWeldingLeaderDepartment= saveData.combinedWeldingLeaderDepartment[0];
            saveData.loftingLeaderDepartment= saveData.loftingLeaderDepartment[0];
            saveData.loftingPartLeaderDepartment= saveData.loftingPartLeaderDepartment[0];
            saveData.smallSampleLeaderDepartment= saveData.smallSampleLeaderDepartment[0];

            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(()=>{
                setVisible(false);
                form.setFieldsValue({});
                history.push(`/workMngt/scheduleList/scheduleView/${params.id}`)
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
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'pattern',
            title: '模式',
            width: 100,
            dataIndex: 'pattern',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "新放"
                  },
                  {
                    value: 2,
                    label: "重新出卡"
                  },
                  {
                    value: 3,
                    label: "套用"
                  },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'priority',
            title: '优先级',
            width: 100,
            dataIndex: 'priority',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "高"
                  },
                  {
                    value: 2,
                    label: "中"
                  },
                  {
                    value: 3,
                    label: "低"
                  },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'materialLeaderName',
            title: '提料负责人',
            width: 200,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialDeliverTime',
            title: '提料计划交付时间',
            width: 200,
            dataIndex: 'materialDeliverTime'
        },
        {
            key: 'materialPartLeaderName',
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'materialPartLeaderName'
        },
        {
            key: 'materialPartDeliverTime',
            title: '提料配段计划交付时间',
            width: 200,
            dataIndex: 'materialPartDeliverTime'
        },
        {
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 100,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'loftingPartDeliverTime',
            title: '放样计划交付时间',
            width: 200,
            dataIndex: 'loftingPartDeliverTime'
        },
        {
            key: 'combinedWeldingLeaderName',
            title: '组焊清单负责人',
            width: 100,
            dataIndex: 'combinedWeldingLeaderName'
        },
        {
            key: 'combinedWeldingDeliverTime',
            title: '组焊计划交付时间',
            width: 200,
            dataIndex: 'combinedWeldingDeliverTime'
        },
        {
            key: 'loftingPartLeaderName',
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'loftingPartLeaderName'
        },
        {
            key: 'loftingPartDeliverTime',
            title: '放样配段计划交付时间',
            width: 200,
            dataIndex: 'loftingPartDeliverTime'
        },
        {
            key: 'smallSampleLeaderName',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        {
            key: 'smallSampleDeliverTime',
            title: '小样图计划交付时间',
            width: 200,
            dataIndex: 'smallSampleDeliverTime'
        },
        {
            key: 'boltLeaderName',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'boltDeliverTime',
            title: '螺栓计划交付时间',
            width: 200,
            dataIndex: 'boltDeliverTime'
        },
        {
            key: 'biddingAddress',
            title: '备注',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={async ()=>{
                        const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
                        setDepartment(departmentData);
                        setScheduleData(resData);
                        if(resData.materialLeaderDepartment){
                            const materialLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialLeaderDepartment}&size=1000`);
                            setMaterialUser(materialLeaderDepartment.records);
                        }
                        if(resData.materialPartLeaderDepartment){
                            const materialPartLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.materialPartLeaderDepartment}&size=1000`);
                            setMaterialPartUser(materialPartLeaderDepartment.records);
                        }
                        if(resData.smallSampleLeaderDepartment){
                            const smallSampleLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.smallSampleLeaderDepartment}&size=1000`);
                            setSmallSampleUser(smallSampleLeaderDepartment.records);
                        }
                        if(resData.loftingPartLeaderDepartment){
                            const loftingPartLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.loftingPartLeaderDepartment}&size=1000`);
                            setLoftingPartUser(loftingPartLeaderDepartment.records);
                        }
                        if(resData.loftingLeaderDepartment){
                            const loftingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.loftingLeaderDepartment}&size=1000`);
                            setLoftingUser(loftingLeaderDepartment.records);
                        }
                        if(resData.combinedWeldingLeaderDepartment){
                            const combinedWeldingLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.combinedWeldingLeaderDepartment}&size=1000`);
                            setCombinedWeldingUser(combinedWeldingLeaderDepartment.records);
                        }
                        if(resData.boltLeaderDepartment){
                            const boltLeaderDepartment: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${resData.boltLeaderDepartment}&size=1000`);
                            setBoltUser(boltLeaderDepartment.records);
                        }
                        form.setFieldsValue({
                            ...resData,
                            materialLeader:resData.materialLeader?resData.materialLeader:'',
                            materialLeaderDepartment:resData.materialLeaderDepartment?[resData.materialLeaderDepartment]:'',
                            boltLeader:resData.boltLeader?resData.boltLeader:'',
                            boltLeaderDepartment:resData.boltLeaderDepartment?[resData.boltLeaderDepartment]:'',
                            combinedWeldingLeader:resData.combinedWeldingLeader?resData.combinedWeldingLeader:'',
                            combinedWeldingLeaderDepartment:resData.combinedWeldingLeaderDepartment?[resData.combinedWeldingLeaderDepartment]:'',
                            loftingLeader:resData.loftingLeader?resData.loftingLeader:'',
                            loftingLeaderDepartment:resData.loftingLeaderDepartment?[resData.loftingLeaderDepartment]:'',
                            loftingPartLeader:resData.loftingPartLeader?resData.loftingPartLeader:'',
                            loftingPartLeaderDepartment:resData.loftingPartLeaderDepartment?[resData.loftingPartLeaderDepartment]:'',
                            materialPartLeader:resData.materialPartLeader?resData.materialPartLeader:'',
                            materialPartLeaderDepartment:resData.materialPartLeaderDepartment?[resData.materialPartLeaderDepartment]:'',
                            smallSampleLeader:resData.smallSampleLeader?resData.smallSampleLeader:'',
                            smallSampleLeaderDepartment:resData.smallSampleLeaderDepartment?[resData.smallSampleLeaderDepartment]:'',
                            boltDeliverTime:resData.boltDeliverTime?moment(resData.boltDeliverTime):'',
                            combinedWeldingDeliverTime: resData.combinedWeldingDeliverTime?moment(resData.combinedWeldingDeliverTime):'',
                            loftingDeliverTime: resData.loftingDeliverTime?moment(resData.loftingDeliverTime):'',
                            loftingPartDeliverTime: resData.loftingPartDeliverTime?moment(resData.loftingPartDeliverTime):'',
                            materialDeliverTime:resData.materialDeliverTime?moment(resData.materialDeliverTime):'',
                            materialPartDeliverTime: resData.materialPartDeliverTime?moment(resData.materialPartDeliverTime):'',
                            smallSampleDeliverTime:resData.smallSampleDeliverTime? moment(resData.smallSampleDeliverTime):''
                        });
                        setVisible(true);
                    }}>指派</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false); form.setFieldsValue({})};
    const onDepartmentChange = async (value: Record<string, any>,title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch (title) {
            case "materialLeaderDepartment":
                return setMaterialUser(userData.records);
            case "materialPartLeaderDepartment":
                return setMaterialPartUser(userData.records);
            case "smallSampleLeaderDepartment":
                return setSmallSampleUser(userData.records);
            case "loftingPartLeaderDepartment":
                return setLoftingPartUser(userData.records);
            case "loftingLeaderDepartment":
                return setLoftingUser(userData.records);
            case "combinedWeldingLeaderDepartment":
                return setCombinedWeldingUser(userData.records);
            case "boltLeaderDepartment":
                return setBoltUser(userData.records);
        };
    }
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 }
    };
    const onFilterSubmit = (value: any) => {
        return value
    }
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
        item.disabled = true;
        return (
        <TreeNode key={item.id} title={item.title} value={item.id} disabled={item.disabled} className={styles.node}>
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
                width={1200} 
                visible={visible} 
                onCancel={handleModalCancel}
                footer={
                    <>
                        <Button onClick={handleModalCancel}>取消</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Form form={form} {...formItemLayout} initialValues={scheduleData||{}}>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="name" label="塔型" >
                                        <span>{scheduleData.name}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="pattern" label="模式" rules={[{required: true,message:'请选择模式'}]}>
                                <Select>
                                    <Select.Option value={1} key={1}>新放</Select.Option>
                                    <Select.Option value={3} key={3}>套用</Select.Option>
                                    <Select.Option value={2} key={2}>重新出卡</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
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
                                        <Select>
                                            { materialUser && materialUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="materialDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} format={'YYYY-MM-DD HH:mm:ss'} showTime onChange={(date: any)=>{
                                    const day = Number(scheduleData.assignConfigVO.materialWithSectionCompletionTime);
                                    let uom = new Date(date);
                                    let newDate =new Date(uom.setHours(uom.getHours() + day));
                                    form.setFieldsValue({ materialPartDeliverTime: moment(newDate) })
                                }}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item name="materialPartDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'} showTime />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
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
                                        <Select>
                                            { loftingUser && loftingUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loftingDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} format={'YYYY-MM-DD HH:mm:ss'} showTime onChange={(date: any)=>{
                                    const weldingCompletionTime = Number(scheduleData.assignConfigVO.weldingCompletionTime);
                                    const loftingWithSectionCompletionTime = Number(scheduleData.assignConfigVO.loftingWithSectionCompletionTime);
                                    const smallSampleCompletionTime = Number(scheduleData.assignConfigVO.smallSampleCompletionTime);
                                    const boltCompletionTime = Number(scheduleData.assignConfigVO.boltCompletionTime);
                                    let uom = new Date(date);
                                    let newWeldingCompletionTime =new Date(uom.setHours(uom.getHours() + weldingCompletionTime));
                                    let newLoftingWithSectionCompletionTime =new Date(uom.setHours(uom.getHours() + loftingWithSectionCompletionTime));
                                    let newSmallSampleCompletionTime =new Date(uom.setHours(uom.getHours() + smallSampleCompletionTime));
                                    let newBoltCompletionTime =new Date(uom.setHours(uom.getHours() + boltCompletionTime));
                                    form.setFieldsValue({ 
                                        combinedWeldingDeliverTime: moment(newWeldingCompletionTime),
                                        boltDeliverTime: moment(newBoltCompletionTime), 
                                        smallSampleDeliverTime: moment(newSmallSampleCompletionTime),
                                        loftingPartDeliverTime: moment(newLoftingWithSectionCompletionTime)  
                                    })
                                }}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="combinedWeldingLeaderDepartment" label="组焊清单负责人 " rules={[{required: true,message:'请选择组焊清单负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'combinedWeldingLeaderDepartment')}  }
                                        >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="combinedWeldingLeader" label="" rules={[{required: true,message:'请选择组焊清单负责人'}]} >
                                        <Select>
                                            { combinedWeldingUser && combinedWeldingUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="combinedWeldingDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingPartLeaderDepartment" label="放样配段负责人" rules={[{required: true,message:'请选择放样配段负责人部门'}]} >
                                        <TreeSelect
                                            onChange={(value:any)=>{onDepartmentChange(value,'loftingPartLeaderDepartment')}  }
                                        >
                                            {renderTreeNodes(wrapRole2DataNode( department ))}
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="loftingPartLeader" label="" rules={[{required: true,message:'请选择放样配段负责人'}]} >
                                        <Select>
                                            { loftingPartUser && loftingPartUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loftingPartDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item name="smallSampleDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
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
                                        <Select>
                                            { boltUser &&boltUser.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="boltDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="priority" label="优先级" rules={[{required: true,message:'请选择优先级'}]} > 
                                        <Select>
                                            <Select.Option value={1} key={1}>高</Select.Option>
                                            <Select.Option value={2} key={2}>中</Select.Option>
                                            <Select.Option value={3} key={3}>低</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="description" label="备注"  >
                                <TextArea rows={1}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Page
                path={ `/tower-science/productCategory/taskPage` }
                columns={ columns }
                extraOperation={
                    <Space>
                        <Button type="primary">导出</Button>
                        <Button type="primary" onClick={ () => history.goBack() }>返回上一级</Button>
                    </Space>
                }
                requestData={{ loftingTaskId: params.id }}
                onFilterSubmit={ onFilterSubmit }
                searchFormItems={[
                    {
                        name: 'pattern',
                        label: '模式',
                        children:   <Select style={{width:"100%"}}>
                                        <Select.Option value='1' key='1'>新放</Select.Option>
                                        <Select.Option value='3' key='3'>套用</Select.Option>
                                        <Select.Option value='2' key='2'>重新出卡</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'priority',
                        label:'优先级',
                        children:   <Select style={{width:"100%"}}>
                                        <Select.Option value='1' key='1'>高</Select.Option>
                                        <Select.Option value='2' key='2'>中</Select.Option>
                                        <Select.Option value='3' key='3'>低</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'materialPartLeader',
                        label: '提料负责人',
                        children: <Input />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入塔型/钢印塔型进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}