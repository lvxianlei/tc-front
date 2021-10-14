import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form, Popconfirm, Row, Col, TreeSelect, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import styles from './confirm.module.less';

export default function ConfirmTaskMngt(): React.ReactNode {
    const [user, setUser] = useState<any[]|undefined>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [confirmLeader, setConfirmLeader] = useState<any|undefined>([]);
    const [department, setDepartment] = useState<any|undefined>([]);
    const [assignVisible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [form] = Form.useForm();
    const history = useHistory();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    
    const handleAssignModalOk = async () => {
        try {
            const submitData = await form.validateFields();
            submitData.drawTaskId = drawTaskId;
            submitData.plannedDeliveryTime = moment(submitData.plannedDeliveryTime).format('YYYY-MM-DD');
            await RequestUtil.post('/tower-science/drawTask/assignDrawTask', submitData).then(()=>{
                message.success('指派成功！')
            }).then(()=>{
                setVisible(false);
                form.resetFields();
            }).then(()=>{
                setRefresh(!refresh);
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
            key: 'taskNum',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'status',
            title: '任务状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 0,
                        label: "已拒绝"
                    },
                    {
                        value: 1,
                        label: "待确认"
                    },
                    {
                        value: 2,
                        label: "待指派"
                    },
                    {
                        value: 3,
                        label: "待完成"
                    },
                    {
                        value: 4,
                        label: "已完成"
                    },
                    {
                        value: 5,
                        label: "已提交"
                    }
                  ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'confirmName',
            title: '确认人',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'contractName',
            title: '合同名称',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'aeName',
            title: '业务经理',
            width: 100,
            dataIndex: 'aeName'
        },
        {
            key: 'operation',
            title: '操作',
            // fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={()=>history.push(`/confirmTask/ConfirmTaskMngt/ConfirmTaskDetail/${record.id}/${record.status}`)} >任务详情</Button>
                    <Button type='link' onClick={async () => { 
                        setDrawTaskId(record.id);
                        setVisible(true) 
                    }} disabled={ record.status !== 2 }>指派</Button>
                    <Button type='link' onClick={()=>history.push(`/confirmTask/ConfirmTaskMngt/ConfirmDetail/${record.id}`)} disabled={ record.status < 4 }>明细</Button>
                    <Popconfirm
                        title="确认提交任务?"
                        onConfirm={ async () => {
                            await RequestUtil.post(`/tower-science/drawTask/submitDrawTask`,{ drawTaskId: record.id }).then(()=>{
                                message.success('提交成功！');
                            }).then(()=>{
                                setRefresh(!refresh)
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                        disabled={ record.status !== 4 }
                    >   
                        <Button type='link' disabled={ record.status !== 4 }>提交任务</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const handleAssignModalCancel = () => {setVisible(false);form.resetFields();};
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    const onDepartmentChange = async (value: Record<string, any>,title?: string) => {
        const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
        switch(title){
            case "confirmDept":
                return setConfirmLeader(userData.records);
            case "user":
                return setUser(userData.records);
        }
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
    
    return <>
        <Modal visible={ assignVisible } title="指派" okText="提交" onOk={ handleAssignModalOk } onCancel={ handleAssignModalCancel } width={ 800 }>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item name="dept" label="部门" rules={[{required:true,message:"请选择部门"}]}>
                            <TreeSelect
                                onChange={(value:any)=>{onDepartmentChange(value,'user')}  }
                            >
                                {renderTreeNodes(wrapRole2DataNode( department ))}
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="assignorId" label="人员" rules={[{required:true,message:"请选择人员"}]}>
                            <Select style={{width:'100px'}}>
                                { user && user.map((item:any)=>{
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="plannedDeliveryTime" label="计划交付时间" rules={[{required:true,message:"请选择计划交付时间"}]}>
                            <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <Page
            path="/tower-science/drawTask"
            columns={columns}
            refresh={ refresh }
            // extraOperation={<Button type="primary">导出</Button>}
            filterValue={ filterValue }
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label:'最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Select style={{width:"100px"}}>
                        <Select.Option value={''} key ={''}>全部</Select.Option>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>待指派</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={0} key={0}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'confirmDept',
                    label: '确认人',
                    children:  <TreeSelect style={{width:'200px'}}
                                    onChange={(value:any)=>{onDepartmentChange(value,'confirmDept')}  }
                                >
                                    {renderTreeNodes(wrapRole2DataNode( department ))}
                                </TreeSelect>
                },
                {
                    name: 'confirmId',
                    label:'',
                    children:   <Select style={{width:'100px'}}>
                                    { confirmLeader && confirmLeader.map((item:any)=>{
                                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    }) }
                                </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称/业务经理进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}