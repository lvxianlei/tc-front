
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
import styles from './WorkshopEquipmentMngt.module.less';
import { DataType } from '../../components/AbstractSelectableModal';
import { IDetail, ITeamUserList } from './IBaseSetting';


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
            key: 'productUnitName',
            title: '生产单元',
            width: 200,
            dataIndex: 'productUnitName'
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
                    <Button type="link" onClick={ () => edit(record.id) } >编辑</Button>
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
                    teamUserSaveDTOList: userList.map((res: ITeamUserList) => {
                        return {
                            ...res,
                            teamId: detail.id
                        }
                    })
                }
                RequestUtil.post<IDetail>(`/tower-production/team`, { ...value }).then(res => {
                    message.success('保存成功！');
                    close();
                    setRefresh(!refresh);
                });
            } else {
                message.warning('车间班组成员不可为空')
            }
        })
    }

    const edit = async (id: string) => {
        const data = await RequestUtil.get<IDetail>(`/tower-production/team?id=${ id }`);
        setDetail(data);
        form.setFieldsValue({ ...data });
        setUserList(data?.teamUserVOList || [])
        setVisible(true);
        setLoading(false)
        setTitle('编辑');

    }

    const close = () => {
        setVisible(false);
        setUserList([]);
        setDetail({});
        setLoading(true);
        form.resetFields();
        form.setFieldsValue({ name: '', productUnitId: '' })
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
    const [ loading, setLoading ] = useState(true);
    const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<SelectDataNode[]>(`/tower-aps/productionUnit?size=1000`);
        resole(data?.records);
    }), {})
    const productUnitData: any = data || [];
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
                        name: 'name',
                        label: '',
                        children: <Input placeholder="请输入班组名称进行查询"/>
                    }
                ] }
                onFilterSubmit={(values: Record<string, any>) => { return values; }}
            />
            <Modal visible={ visible } width="40%" title={ title + "班组" } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Spin spinning={loading}>
                    <Form form={ form } labelCol={{ span: 6 }}>
                        <Row>
                            <Col span={ 12 }>
                                <Form.Item name="productUnitId" initialValue={ detail.productUnitId } label="所属生产单元" rules={[{
                                        "required": true,
                                        "message": "请选择所属生产单元"
                                    }]}>
                                    <Select placeholder="请选择">
                                        { productUnitData?.map((item: any) => {
                                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
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