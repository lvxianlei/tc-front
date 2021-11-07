
/**
 * @author zyc
 * @copyright © 2021 
 * @description 车间派工设备管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, Row, Col } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './WorkshopEquipmentMngt.module.less';

interface IDetail {
    readonly name?: string;
    readonly id?: string;
    readonly workshopDeptName?: string;
    readonly deptProcessesName?: string;
    readonly deptProcessesId?: string;
    readonly productionLinesName?: string;
    readonly accountEquipmentId?: string;
    readonly accountEquipmentName?: string;
    readonly status?: string;
    readonly workshopDeptId?: string;
}
interface IProcess {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptId?: string;
    readonly deptName?: string;
    readonly id?: string;
}
export default function WorkshopEquipmentMngt(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'workshopDeptName',
            title: '车间名称',
            width: 150,
            dataIndex: 'workshopDeptName'
        },
        {
            key: 'name',
            title: '派工设备名称',
            dataIndex: 'name',
            width: 120
        },
        {
            key: 'deptProcessesName',
            title: '工序',
            width: 200,
            dataIndex: 'deptProcessesName'
        },
        {
            key: 'productionLinesName',
            title: '设备所属产线',
            width: 200,
            dataIndex: 'productionLinesName'
        },
        {
            key: 'status',
            title: '设备状态',
            width: 200,
            dataIndex: 'status'
        },
        {
            key: 'createUserName',
            title: '制单人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '制单时间',
            width: 200,
            dataIndex: 'createTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => {
                        getList(record.id);
                        setVisible(true);
                        setTitle('编辑');
                        getProcess();
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/equipment?equipmentId=${ record.id }`).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const save = () => {
        form.validateFields().then(res => {
            console.log(form.getFieldsValue(true));
        })
    }

    const cancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetail>(`/tower-production/equipment/info?equipmentId=${ id }`);
        setDetail(data);
    }

    const getProcess = async () => {
        const data = await RequestUtil.get<IProcess[]>(`/tower-production/workshopDept/list`);
        setProcess(data);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ searchForm ] = useForm();
    const [ filterValue, setFilterValue ] = useState({});
    const [ disabled, setDisabled] = useState(false);
    const [ disabled2, setDisabled2 ] = useState(false);
    const [ detail, setDetail ] = useState<IDetail>({});
    const [ title, setTitle ] = useState('新增');
    const [ process, setProcess ] = useState<IProcess[]>([]);
    return (
        <>
            <Form form={searchForm} layout="inline" style={{margin:'20px'}} onFinish={(value: Record<string, any>) => {
                setFilterValue(value)
                setRefresh(!refresh);
            }}>
                <Form.Item label='' name='name'>
                    <Input placeholder="请输入派工设备进行查询"/>
                </Form.Item>
                <Form.Item label='选择车间' name='workshopDeptId'>
                    <Select placeholder="请选择" className={ styles.width150 } onChange={ (e) => {
                        console.log(e)
                        searchForm.setFieldsValue({ deptProcessesId: '' });
                    } }>
                        <Select.Option value={ 1 } key="4">全部</Select.Option>
                        <Select.Option value={ 2 } key="">全部222</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='选择工序' name='deptProcessesId'>
                    <Select placeholder="请选择" className={ styles.width150 } onChange={ (e) => {
                        console.log(e)
                    } }>
                        <Select.Option value={ 1 } key="4">全部</Select.Option>
                        <Select.Option value={ 2 } key="">全部222</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='状态' name='status'>
                    <Select placeholder="请选择" className={ styles.width150 }>
                        <Select.Option value={ 1 } key="1">正常</Select.Option>
                        <Select.Option value={ 2 } key="2">停用</Select.Option>
                        <Select.Option value={ 3 } key="3">维修中</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
            <Page
                path="/tower-science/loftingList/loftingPage"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle("新增"); getProcess();} } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [] }
                requestData={{ ...filterValue }}
            />
            <Modal visible={ visible } width="60%" title={ title + '设备信息' } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 8 }}>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="workshopDeptId" initialValue={ detail.workshopDeptId } label="所属车间" rules={[{
                                    "required": true,
                                    "message": "请选择所属车间"
                                }]}>
                                <Select placeholder="请选择" onChange={ (e) => {
                                    console.log(e)
                                    setDisabled(true);
                                    form.setFieldsValue({ deptProcessesId: '', productionLinesId: '' });
                                } }>
                                    <Select.Option value={ 1 } key="4">全部</Select.Option>
                                    <Select.Option value={ 2 } key="">全部222</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="deptProcessesId" label="工序" initialValue={ detail.deptProcessesId } rules={[{
                                    "required": true,
                                    "message": "请选择工序"
                                }]}>
                                <Select placeholder="请选择" disabled={ disabled } onChange={ (e) => {
                                    console.log(e)
                                    setDisabled2(true);
                                    form.setFieldsValue({ productionLinesId: '' });
                                } }>
                                    { process.map((item: any) => {
                                        return <Select.Option key={ item.id } value={ item.id }>{ item.deptName }</Select.Option>
                                    }) }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="name" label="派工设备名称" initialValue={ detail.name } rules={[{
                                    "required": true,
                                    "message": "请输入派工设备名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="productionLinesId" label="所属产线" initialValue={ detail.deptProcessesId } rules={[{
                                    "required": true,
                                    "message": "请选择所属产线"
                                }]}>
                                <Select placeholder="请选择" disabled={ disabled2 }>
                                    <Select.Option value={ 1 } key="4">全部</Select.Option>
                                    <Select.Option value={ 2 } key="">全部222</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="accountEquipmentId" label="台账设备关联">
                                <Button>+关联设备</Button>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="status" initialValue={ detail.status } label="状态">
                                <Select placeholder="请选择">
                                    <Select.Option value={ 1 } key="1">正常</Select.Option>
                                    <Select.Option value={ 2 } key="2">停用</Select.Option>
                                    <Select.Option value={ 3 } key="3">维修中</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}