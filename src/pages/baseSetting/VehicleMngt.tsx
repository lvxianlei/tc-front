
/**
 * @author zyc
 * @copyright © 2021 
 * @description 车辆管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Table, Popconfirm, message, Row, Col } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './ProcessMngt.module.less';
import EquipmentSelectionModal from '../../components/EquipmentSelectionModal';

interface IDetail {
    readonly name?: string;
    readonly id?: string;
    readonly registrationNumber?: string;
    readonly vehicleType?: string;
    readonly accountEquipmentId?: string;
    readonly accountEquipmentName?: string;
    readonly status?: string;
    readonly description?: string;
}
export default function VehicleMngt(): React.ReactNode {
    const columns = [
        {
            key: 'registrationNumber',
            title: '车辆设备号/车牌号',
            width: 150,
            dataIndex: 'registrationNumber'
        },
        {
            key: 'name',
            title: '车辆名称',
            dataIndex: 'name',
            width: 120
        },
        {
            key: 'vehicleType',
            title: '车辆类型',
            width: 200,
            dataIndex: 'vehicleType'
        },
        {
            key: 'status',
            title: '车辆状态',
            width: 200,
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '正常';
                    case 2:
                        return '停用';
                    case 3:
                        return '维修中';
                }
            }  
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
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => {
                        getList(record.id);
                        setVisible(true);
                        setTitle('编辑');
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/vehicle?vehicleId=${ record.id }`).then(res => {
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
        const data = await RequestUtil.get<IDetail>(`/tower-production/vehicle/info?vehicleId=${ id }`);
        setDetail(data);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ detail, setDetail ] = useState<IDetail>({});
    const [ title, setTitle ] = useState('新增');
    return (
        <>
            <Page
                path="/tower-production/vehicle"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setDetail({});} } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'vehicleName',
                        label: '',
                        children: <Input placeholder="请输入派工设备号/车辆名称进行查询"/>
                    },
                    {
                        name: 'vehicleType',
                        label: '车辆类型',
                        children: <Select placeholder="请选择">
                            <Select.Option value={ 1 } key="1">全部</Select.Option>
                            <Select.Option value={ 2 } key="2">正常</Select.Option>
                            <Select.Option value={ 3 } key="3">停用</Select.Option>
                            <Select.Option value={ 4 } key="4">维修中</Select.Option>
                        </Select>
                    },
                    {
                        name: 'status',
                        label: '状态',
                        children: <Select placeholder="请选择">
                            <Select.Option value={ 1 } key="1">正常</Select.Option>
                            <Select.Option value={ 2 } key="2">停用</Select.Option>
                            <Select.Option value={ 3 } key="3">维修中</Select.Option>
                        </Select>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="60%" title={ title } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 8 }}>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="registrationNumber" initialValue={ detail.registrationNumber } label="车辆设备号/车牌号" rules={[{
                                    "required": true,
                                    "message": "请输入车辆设备号/车牌号"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="name" label="车辆名称" initialValue={ detail.name } rules={[{
                                    "required": true,
                                    "message": "请输入车辆名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="vehicleType" label="车辆种类" initialValue={ detail.vehicleType } rules={[{
                                    "required": true,
                                    "message": "请选择所属产线"
                                }]}>
                                <Select placeholder="请选择">
                                    <Select.Option value={ 1 } key="4">全部</Select.Option>
                                    <Select.Option value={ 2 } key="">全部222</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="status" label="车辆状态" initialValue={ detail.status } rules={[{
                                    "required": true,
                                    "message": "请选择车辆状态"
                                }]}>
                                <Select placeholder="请选择">
                                    <Select.Option value={ 1 } key="1">正常</Select.Option>
                                    <Select.Option value={ 2 } key="2">停用</Select.Option>
                                    <Select.Option value={ 3 } key="3">维修中</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="accountEquipmentId" label="台账设备关联">
                                <EquipmentSelectionModal onSelect={ (selectedRows: object[] | any) => {
                                    console.log(selectedRows)
                                } }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}