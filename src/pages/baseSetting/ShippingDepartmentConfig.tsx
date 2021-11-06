/**
 * @author zyc
 * @copyright © 2021 
 * @description 成品库配置
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Form, Table, Popconfirm, message, Row, Col } from 'antd';
import { CommonTable, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './ShippingDepartmentConfig.module.less';

interface IProcessList {
    readonly region?: string;
    readonly position?: string;
}
interface IWarehouseKeeperList {
    readonly keeperName?: string;
    readonly warehouseId?: string;
    readonly keeperUserId?: string;
    readonly id?: string;
}
interface IDetailData {
    readonly code?: string;
    readonly id?: string;
    readonly leader?: string;
    readonly leaderName?: string;
    readonly name?: string;
    readonly status?: string;
    readonly warehouseType?: string;
    readonly warehousePositionVOList?: IProcessList[];
    readonly warehouseKeeperVOList?: IWarehouseKeeperList[];
}
export default function ShippingDepartmentConfig(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 80,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'code',
            title: '仓库编号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'name',
            title: '仓库名称',
            dataIndex: 'name',
            width: 120
        },
        {
            key: 'warehouseType',
            title: '仓库类型',
            width: 200,
            dataIndex: 'warehouseType'
        },
        {
            key: 'leader',
            title: '负责人',
            width: 200,
            dataIndex: 'leader'
        },
        {
            key: 'keeperName',
            title: '保管员',
            width: 200,
            dataIndex: 'keeperName',
            render: (_: any, record: Record<string, any>): React.ReactNode => {
                return <span>{record.warehouseKeeperVOList.map((item: IWarehouseKeeperList) => {
                    return item.keeperName;
                }).join(',')}</span>
            }  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
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
                            RequestUtil.delete(`/tower-production/warehouse?warehouseId=${ record.id }`).then(res => {
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

    const userColumns = [
        {
            key: 'time',
            title: '职位',
            dataIndex: 'time'
        },
        {
            key: 'keeperName',
            title: '姓名',
            dataIndex: 'keeperName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => delUserRow(index) }
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
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'region',
            title: '库区',
            dataIndex: 'region',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["data", index, "region"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入库区" }]}>
                    <Input maxLength={ 50 } key={ index } bordered={false} />
                </Form.Item>
            )  
        },
        {
            key: 'position',
            title: '库位',
            dataIndex: 'position',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["data", index, "position"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入库位" }]}>
                    <Input maxLength={ 50 } key={ index } bordered={false} />
                </Form.Item>
            )  
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
        })
    }

    const cancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const addRow = () => {
        let reservoirListValues = form.getFieldsValue(true).data || [];
        let newData = {
            position: '',
            region: ''
        }
        setReservoirList([...reservoirListValues, newData]);
        form.setFieldsValue({ data: [...reservoirListValues, newData] })
    }

    const delRow = (index: number) => {
        let reservoirListValues = form.getFieldsValue(true).data || []; 
        reservoirListValues.splice(index, 1);
        setReservoirList([...reservoirListValues]);
        form.setFieldsValue({ data: [...reservoirListValues] })
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/warehouse/detail/${ id }`);
        setReservoirList(data?.warehousePositionVOList || []);
        setUserList(data?.warehouseKeeperVOList || []);
        setDetailData(data);
    }

    const delUserRow = (index: number) => {
        userList.splice(index, 1);
        setUserList([...userList]);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ reservoirList, setReservoirList ] = useState<IProcessList[]>([]);
    const [ title, setTitle ] = useState('新增');
    const [ userList, setUserList ] = useState<IWarehouseKeeperList[]>([]);
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    return (
        <>
            <Page
                path="/tower-production/warehouse"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => setVisible(true) } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'fuzzyMsg',
                        label: '',
                        children: <Input placeholder="输入仓库名称/仓库类型进行查询"/>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title={ title } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 6 }}>
                    <DetailTitle title="基础信息"/>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="code" label="仓库编号" initialValue={ detailData.code } rules={[{
                                    "required": true,
                                    "message": "请输入仓库编号"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="name" label="仓库名称" initialValue={ detailData.name } rules={[{
                                    "required": true,
                                    "message": "请输入仓库名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="warehouseType" label="仓库类型" initialValue={ detailData.warehouseType } rules={[{
                                    "required": true,
                                    "message": "请输入仓库类型"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="leader" label="负责人" initialValue={ detailData.leader } rules={[{
                                    "required": true,
                                    "message": "请选择负责人"
                                }]}>
                                
                            </Form.Item>
                        </Col>
                    </Row>
                    <DetailTitle title="保管员" operation={[<Button type="primary" onClick={ () => {} }>选择保育员</Button>]}/>
                    <CommonTable columns={userColumns} dataSource={userList} showHeader={false} pagination={false} />
                    <DetailTitle title="库区库位信息"/>
                    <Button type="primary" onClick={ addRow }>添加行</Button>
                    <Table rowKey="index" dataSource={[...reservoirList]} pagination={false} columns={tableColumns} className={styles.addModal}/>
                </Form>
            </Modal>
        </>
    )
}