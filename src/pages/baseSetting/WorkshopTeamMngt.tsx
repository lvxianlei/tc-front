
/**
 * @author zyc
 * @copyright © 2021 
 * @description 车间班组管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, Row, Col, Spin } from 'antd';
import { CommonTable, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import WorkshopUserSelectionComponent from '../../components/WorkshopUserModal';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IProcess } from './ProductionLineMngt';
import styles from './WorkshopEquipmentMngt.module.less';
import { DataType } from '../../components/AbstractSelectableModal';

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
            key: 'name',
            title: '班组名称',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'productionLinesName',
            title: '生产单元',
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
            if(userList.length > 0) {
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
                    close();
                    setRefresh(!refresh);
                });
            } else {
                message.warning('车间班组员工不可为空')
            }
        })
    }

    const close = () => {
        setVisible(false);
        setUserList([]);
        setDetail({});
        setProcess([]);
        setLoading(true);
        form.resetFields();
        form.setFieldsValue({ deptProcessesId: '', name: '', productionLinesId: '', workshopDeptId: '' })
    }

    const cancel = () => {
        close();
    }

    const delRow = (index: number) => {
        userList.splice(index, 1);
        setUserList([...userList]);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ userList, setUserList ] = useState<ITeamUserList[]>([]);
    const [ title, setTitle ] = useState('新增');
    const [ detail, setDetail ] = useState<IDetail>({});
    const [ process, setProcess ] = useState<IProcess[]>([]);
    const [ loading, setLoading ] = useState(true);
    const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/tower-production/workshopDept/list`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    return (
        <>
            <Page
                path="/tower-production/team/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle('新增');
                setLoading(false); } } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'vehicleName',
                        label: '',
                        children: <Input placeholder="请输入班组名称进行查询"/>
                    },
                    {
                        name: 'vehicleType',
                        label: '车辆类型',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            { process.map((item: any) => {
                                return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                            }) }
                        </Select>
                    }
                ] }
            />
            <Modal visible={ visible } width="40%" title={ title + "班组" } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Spin spinning={loading}>
                    <Form form={ form } labelCol={{ span: 6 }}>
                        <Row>
                            <Col span={ 12 }>
                                <Form.Item name="workshopDeptId" initialValue={ detail.workshopDeptId } label="所属车间" rules={[{
                                        "required": true,
                                        "message": "请选择所属车间"
                                    }]}>
                                    <Select placeholder="请选择">
                                        { departmentData.map((item: any) => {
                                            return <Select.Option key={ item.id + ',' + item.deptName } value={ item.id + ',' + item.deptName }>{ item.deptName }</Select.Option>
                                        }) }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={ 12 }>
                                <Form.Item name="name" label="班组名称" initialValue={ detail.name } rules={[{
                                        "required": true,
                                        "message": "请输入班组名称"
                                    },
                                    {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }]}>
                                    <Input maxLength={ 50 }/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <p><span style={{ color: 'red' }}>*</span>班组成员</p>
                    <WorkshopUserSelectionComponent rowSelectionType="checkbox" buttonTitle="添加员工" onSelect={ (selectedRows: object[] | any) => {
                        selectedRows = selectedRows.map((item: DataType) => {
                            return {
                                userId: item.id,
                                name: item.name,
                                position: item.stationName || '1',
                                teamId: detail.id
                            }
                        })
                        const res = new Map();
                        const rows = [...userList, ...selectedRows]
                        let newRows = rows.filter((item: DataType) => !res.has(item.userId) && res.set(item.userId, 1));
                        setUserList(newRows);
                    } }/>
                    <CommonTable columns={ tableColumns } dataSource={ userList } pagination={ false } />
                </Spin>
            </Modal>
        </>
    )
}