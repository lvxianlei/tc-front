/**
 * @author zyc
 * @copyright © 2021 
 * @description 车间派工设备管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, Row, Col, TreeSelect } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './WorkshopEquipmentMngt.module.less';
import EquipmentSelectionModal, { IData } from '../../components/EquipmentSelectionModal';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IProcess } from './ProductionLineMngt';
import { ILineList } from './WorkshopTeamMngt';
import { SelectValue } from 'antd/lib/select';
import { CloseOutlined } from '@ant-design/icons';

interface IDetail {
    readonly name?: string;
    readonly id?: string;
    readonly workshopDeptName?: string;
    readonly deptProcessesName?: string;
    readonly deptProcessesId?: string;
    readonly productionLinesName?: string;
    readonly accountEquipmentId?: string | number;
    readonly accountEquipmentName?: string;
    readonly status?: string;
    readonly workshopDeptId?: string;
    readonly productionLinesId?: string;
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
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => {
                        getList(record.id);
                        setVisible(true);
                        setDisabled(false);
                        setDisabled2(false);
                        setTitle('编辑');
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
            let value = form.getFieldsValue(true);
            if(selectedRows[0] || detail.accountEquipmentId) {
                value = {
                    ...value,
                    id: detail.id,
                    workshopDeptId: value.workshopDeptId.split(',')[0],
                    workshopDeptName: value.workshopDeptId.split(',')[1],
                    deptProcessesId: value.deptProcessesId.split(',')[0],
                    deptProcessesName: value.deptProcessesId.split(',')[1],
                    productionLinesId: value.productionLinesId.split(',')[0],
                    productionLinesName: value.productionLinesId.split(',')[1],
                    accountEquipmentId: selectedRows[0] && selectedRows[0].id ? selectedRows[0].id : detail.accountEquipmentId,
                    accountEquipmentName: selectedRows[0] && selectedRows[0].deviceName ? selectedRows[0].deviceName : detail.accountEquipmentName
                }
            } else {
                value = {
                    ...value,
                    id: detail.id,
                    workshopDeptId: value.workshopDeptId.split(',')[0],
                    workshopDeptName: value.workshopDeptId.split(',')[1],
                    deptProcessesId: value.deptProcessesId.split(',')[0],
                    deptProcessesName: value.deptProcessesId.split(',')[1],
                    productionLinesId: value.productionLinesId.split(',')[0],
                    productionLinesName: value.productionLinesId.split(',')[1],
                }
            }
            RequestUtil.post<IDetail>(`/tower-production/equipment`, { ...value }).then(res => {
                message.success('保存成功！');
                setVisible(false);
                setDisabled(true);
                setDisabled2(true);
                setDetail({});
                setLine([]);
                setProcess([]);
                setSelectedRows([]);
                form.resetFields();
                form.setFieldsValue({ deptProcessesId: '', name: '', productionLinesId: '', status: '', workshopDeptId: '',accountEquipmentName: '' });
                setRefresh(!refresh);
            });
        })
    }

    const cancel = () => {
        setVisible(false);
        setDisabled(true);
        setDisabled2(true);
        setDetail({});
        setLine([]);
        setProcess([]);
        setSelectedRows([]);
        form.resetFields();
        form.setFieldsValue({ deptProcessesId: '', name: '', productionLinesId: '', status: '', workshopDeptId: '',accountEquipmentName: '' });
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetail>(`/tower-production/equipment/info?equipmentId=${ id }`);
        const newData = {
            ...data,
            deptProcessesId: data.deptProcessesId + ',' + data.deptProcessesName,
            workshopDeptId: data.workshopDeptId + ',' + data.workshopDeptName,
            productionLinesId: data.productionLinesId + ',' + data.productionLinesName,
            accountEquipmentId: data.accountEquipmentId === -1 ? undefined : data.accountEquipmentId
        }
        setDetail(newData);
        getProcess(data.workshopDeptId || '');
        getLine(data.deptProcessesId || '');
        form.setFieldsValue({...newData});
    }

    const getProcess = async (id: string) => {
        const data = await RequestUtil.get<IProcess[]>(`/tower-production/workshopDept/workshopDeptDetail?id=${ id }`);
        setProcess(data || []);
    }

    const getLine = async (id: string) => {
        const data = await RequestUtil.get<ILineList[]>(`/tower-production/productionLines/list?deptProcessesId=${ id }`);
        setLine(data || []);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ searchForm ] = useForm();
    const [ filterValue, setFilterValue ] = useState({});
    const [ disabled, setDisabled] = useState(true);
    const [ disabled2, setDisabled2 ] = useState(true);
    const [ detail, setDetail ] = useState<IDetail>({});
    const [ title, setTitle ] = useState('新增');
    const [ process, setProcess ] = useState<IProcess[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IData[] | any>({});
    const [ line, setLine ] = useState<ILineList[]>([]);
    const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/tower-production/workshopDept/list`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    return (
        <>
            <Form form={searchForm} layout="inline" style={{margin:'20px'}} onFinish={(value: Record<string, any>) => {
                value = {
                    ...value,
                    workshopDeptId: value.workshopDeptId && value.workshopDeptId.split(',')[0]
                }
                setFilterValue(value)
                setRefresh(!refresh);
            }}>
                <Form.Item label='' name='name'>
                    <Input placeholder="请输入派工设备进行查询"/>
                </Form.Item>
                <Form.Item label='选择车间' name='workshopDeptId'>
                    <Select placeholder="请选择" style={{ width: "150px" }} onChange={(e: string) => {
                        searchForm.setFieldsValue({ deptProcessesId: '' });
                        getProcess(e.toString().split(',')[0]);
                    }}>
                        { departmentData.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.deptName }</Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item label='选择工序' name='deptProcessesId'>
                    <Select placeholder="请选择" style={{ width: "150px" }} disabled={ !(searchForm.getFieldsValue(true).workshopDeptId) }>
                        { process.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.ide }>{ item.name }</Select.Option>
                        }) }
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
                    <Button onClick={ () => {
                        searchForm.resetFields();
                        setProcess([]);
                    } }>重置</Button>
                </Form.Item>
            </Form>
            <Page
                path="/tower-production/equipment"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle("新增");} } ghost>新增</Button> }
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
                                <Select placeholder="请选择" onChange={(e: string) => {
                                    setDisabled(false);
                                    form.setFieldsValue({ deptProcessesId: '', productionLinesId: '' });
                                    getProcess(e.toString().split(',')[0]);
                                }}>
                                    { departmentData.map((item: any) => {
                                        return <Select.Option key={ item.id + ',' + item.deptName } value={ item.id + ',' + item.deptName }>{ item.deptName }</Select.Option>
                                    }) }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="deptProcessesId" className={ styles.maxWidth60 } label="工序" initialValue={ detail.deptProcessesId } rules={[{
                                    "required": true,
                                    "message": "请选择工序"
                                }]}>
                                <Select placeholder="请选择" disabled={ disabled } onChange={ (e: SelectValue = '') => {
                                    setDisabled2(false);
                                    form.setFieldsValue({ productionLinesId: '' });
                                    getLine(e.toString().split(',')[0]);
                                } }>
                                    { process.map((item: any) => {
                                        return <Select.Option key={ item.id + ',' + item.name } value={ item.id + ',' + item.name }>{ item.name }</Select.Option>
                                    }) }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="name" label="派工设备名称" initialValue={ detail.name } rules={[{
                                    "required": true,
                                    "message": "请输入派工设备名称"
                                },
                                {
                                  pattern: /^[^\s]*$/,
                                  message: '禁止输入空格',
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="productionLinesId" className={ styles.maxWidth60 } label="所属产线" initialValue={ detail.deptProcessesId } rules={[{
                                    "required": true,
                                    "message": "请选择所属产线"
                                }]}>
                                <Select placeholder="请选择" disabled={ disabled2 }>
                                    { line.map((item: any) => {
                                        return <Select.Option key={ item.id + ',' + item.name } value={ item.id + ',' + item.name }>{ item.name }</Select.Option>
                                    }) }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="accountEquipmentName" initialValue={ detail.accountEquipmentName } label="台账设备关联">
                                <Input maxLength={ 50 } value={ detail.accountEquipmentName } addonBefore={ <EquipmentSelectionModal onSelect={ (selectedRows: object[] | any) => {
                                        setSelectedRows(selectedRows);
                                        setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                        form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                                    } }/> } addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={ () => {
                                        setSelectedRows([]);
                                        setDetail({ ...detail, accountEquipmentName: '' });
                                        form.setFieldsValue({ accountEquipmentName: '' })
                                    } }><CloseOutlined /></Button>} disabled />
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