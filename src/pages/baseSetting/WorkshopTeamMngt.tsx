
/**
 * @author zyc
 * @copyright © 2021 
 * @description 车间班组管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, Row, Col } from 'antd';
import { CommonTable, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
 import styles from './WorkshopEquipmentMngt.module.less';
import WorkshopUserSelectionComponent from '../../components/WorkshopUserModal';

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
            key: 'createTime',
            title: '姓名',
            dataIndex: 'createTime'
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
            console.log(form.getFieldsValue(true));
            console.log(userList);
        })
    }

    const cancel = () => {
        setVisible(false);
        form.resetFields();
        setUserList([]);
        setDisabled(false);
        setDisabled2(false);
    }

    const delRow = (index: number) => {
        userList.splice(index, 1);
        setUserList([...userList]);
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetail>(`/tower-production/team?id=${ id }`);
        setDetail(data);
        setUserList(data?.teamUserVOList || [])
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ searchForm ] = useForm();
    const [ filterValue, setFilterValue ] = useState({});
    const [ disabled, setDisabled] = useState(false);
    const [ disabled2, setDisabled2 ] = useState(false);
    const [ userList, setUserList ] = useState<ITeamUserList[]>([]);
    const [ title, setTitle ] = useState('新增');
    const [ detail, setDetail ] = useState<IDetail>({});
    return (
        <>
            <Form form={searchForm} layout="inline" style={{margin:'20px'}} onFinish={(value: Record<string, any>) => {
                setFilterValue(value)
                setRefresh(!refresh);
            }}>
                <Form.Item label='' name='name'>
                    <Input placeholder="请输入班组名称进行查询"/>
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
                    <Select placeholder="请选择" className={ styles.width150 }>
                        <Select.Option value={ 1 } key="4">全部</Select.Option>
                        <Select.Option value={ 2 } key="">全部222</Select.Option>
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
                extraOperation={ <Button type="primary" onClick={ () => setVisible(true) } ghost>新增</Button> }
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
                                <Select placeholder="请选择" onChange={ (e) => {
                                    console.log(e)
                                    setDisabled(true);
                                } }>
                                    <Select.Option value={ 1 } key="4">全部</Select.Option>
                                    <Select.Option value={ 2 } key="">全部222</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="deptProcessesId"initialValue={ detail.deptProcessesId } label="工序" rules={[{
                                    "required": true,
                                    "message": "请选择工序"
                                }]}>
                                <Select placeholder="请选择"  disabled={ disabled } onChange={ (e) => {
                                    console.log(e)
                                    setDisabled2(true);
                                } }>
                                    <Select.Option value={ 1 } key="4">全部</Select.Option>
                                    <Select.Option value={ 2 } key="">全部222</Select.Option>
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
                                    <Select.Option value={ 1 } key="4">全部</Select.Option>
                                    <Select.Option value={ 2 } key="">全部222</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <p>班组成员</p>
                <WorkshopUserSelectionComponent onSelect={ (selectedRows: object[] | any) => {
                    console.log(selectedRows)
                    setUserList(selectedRows);
                } }/>
                <CommonTable columns={ tableColumns } dataSource={ userList } pagination={ false } />
            </Modal>
        </>
    )
}