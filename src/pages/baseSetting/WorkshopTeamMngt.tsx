
/**
 * @author zyc
 * @copyright © 2021 
 * @description 车间班组管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, Row, Col, TreeSelect } from 'antd';
import { CommonTable, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import WorkshopUserSelectionComponent, { IUser } from '../../components/WorkshopUserModal';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IProcess } from './ProductionLineMngt';
import { SelectValue } from 'antd/lib/select';

interface IDetail {
    readonly name?: string;
    readonly id?: string;
    readonly deptProcessesId?: string;
    readonly deptProcessesName?: string;
    readonly productionLinesId?: string;
    readonly productionLinesName?: string;
    readonly workshopDeptId?: string;
    readonly workshopDeptName?: string;
    readonly teamUserVOList?: ITeamUserList[];
}

interface ITeamUserList {
    readonly name?: string;
    readonly position?: string;
    readonly teamId?: string;
    readonly userId?: string;
}

export interface ILineList {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptProcessesId?: string;
    readonly deptProcessesName?: string;
    readonly description?: string;
    readonly id?: string;
    readonly name?: string;
    readonly workshopDeptId?: string;
    readonly workshopDeptName?: string;
}

export default function WorkshopTeamMngt(): React.ReactNode {
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
            key: 'deptProcessesName',
            title: '工序',
            width: 200,
            dataIndex: 'deptProcessesName'
        },
        {
            key: 'name',
            title: '班组名称',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'productionLinesName',
            title: '所属产线',
            width: 200,
            dataIndex: 'productionLinesName'
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
                        setDisabled(false);
                        setDisabled2(false);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/team`, { id: record.id }).then(res => {
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

    const tableColumns = [
        {
            key: 'name',
            title: '姓名',
            dataIndex: 'name'
        },
        {
            key: 'position',
            title: '职位',
            dataIndex: 'position'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
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
            )
        }
    ]

    const save = () => {
        form.validateFields().then(res => {
            let value = form.getFieldsValue(true);
            value = {
                ...value,
                id: detail.id,
                workshopDeptId: value.workshopDeptId.split(',')[0],
                workshopDeptName: value.workshopDeptId.split(',')[1],
                deptProcessesId: value.deptProcessesId.split(',')[0],
                deptProcessesName: value.deptProcessesId.split(',')[1],
                productionLinesId: value.productionLinesId.split(',')[0],
                productionLinesName: value.productionLinesId.split(',')[1],
                teamUserSaveDTOList: userList
            }
            RequestUtil.post<IDetail>(`/tower-production/team`, { ...value }).then(res => {
                message.success('保存成功！');
                setVisible(false);
                setDisabled(true);
                setDisabled2(true);
                setUserList([]);
                setDetail({});
                setLine([]);
                setProcess([]);
                form.resetFields();
                form.setFieldsValue({ deptProcessesId: '', name: '', productionLinesId: '', workshopDeptId: '' })
                setRefresh(!refresh);
            });
        })
    }

    const cancel = () => {
        setVisible(false);
        setDisabled(true);
        setDisabled2(true);
        setUserList([]);
        setDetail({});
        setLine([]);
        setProcess([]);
        form.resetFields();
        form.setFieldsValue({ deptProcessesId: '', name: '', productionLinesId: '', workshopDeptId: '' })
    }

    const delRow = (index: number) => {
        userList.splice(index, 1);
        setUserList([...userList]);
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetail>(`/tower-production/team?id=${ id }`);
        const newData = {
            ...data,
            deptProcessesId: data.deptProcessesId + ',' + data.deptProcessesName,
            workshopDeptId: data.workshopDeptId + ',' + data.workshopDeptName,
            productionLinesId: data.productionLinesId + ',' + data.productionLinesName,
        }
        setDetail(newData);
        getProcess(data.workshopDeptId || '');
        getLine(data.deptProcessesId || '')
        setUserList(newData?.teamUserVOList || []);
        form.setFieldsValue({ ...newData })
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
    const [ searchForm ] = Form.useForm();
    const [ filterValue, setFilterValue ] = useState({});
    const [ disabled, setDisabled] = useState(true);
    const [ disabled2, setDisabled2 ] = useState(true);
    const [ userList, setUserList ] = useState<ITeamUserList[]>([]);
    const [ title, setTitle ] = useState('新增');
    const [ detail, setDetail ] = useState<IDetail>({});
    const [ process, setProcess ] = useState<IProcess[]>([]);
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
                    <Input placeholder="请输入班组名称进行查询"/>
                </Form.Item>
                <Form.Item label='选择车间' name='workshopDeptId'>
                    <Select placeholder="请选择" style={{ width: "150px" }} onChange={(e: string) => {
                        searchForm.setFieldsValue({ deptProcessesId: ''});
                        getProcess(e.toString().split(',')[0]);
                    }}>
                        { departmentData.map((item: any) => {
                            return <Select.Option key={ item.id + ',' + item.deptName } value={ item.id + ',' + item.deptName }>{ item.deptName }</Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item label='选择工序' name='deptProcessesId'>
                    <Select placeholder="请选择" style={{ width: "150px" }} disabled={ !(searchForm.getFieldsValue(true).workshopDeptId) }>
                        { process.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                        }) }
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
                path="/tower-production/team/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle('新增'); } } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [] }
                requestData={{ ...filterValue }}
            />
            <Modal visible={ visible } width="40%" title={ title + "班组" } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 6 }}>
                    <Row>
                        <Col span={ 12 }>
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
                        <Col span={ 12 }>
                            <Form.Item name="deptProcessesId" initialValue={ detail.deptProcessesId } label="工序" rules={[{
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
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="name" label="班组名称" initialValue={ detail.name } rules={[{
                                    "required": true,
                                    "message": "请输入班组名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="productionLinesId" label="所属产线" initialValue={ detail.productionLinesId } rules={[{
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
                    </Row>
                </Form>
                <p>班组成员</p>
                <WorkshopUserSelectionComponent rowSelectionType="checkbox" buttonTitle="添加员工" onSelect={ (selectedRows: object[] | any) => {
                    selectedRows = selectedRows.map((item: IUser) => {
                        return {
                            userId: item.id,
                            name: item.name,
                            position: item.stationName || '1',
                            teamId: detail.id
                        }
                    })
                    setUserList(selectedRows);
                } }/>
                <CommonTable columns={ tableColumns } dataSource={ userList } pagination={ false } />
            </Modal>
        </>
    )
}