/**
 * @author zyc
 * @copyright © 2021 
 * @description 成品库配置
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Form, Table, Popconfirm, message, Row, Col, Select } from 'antd';
import { CommonTable, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './ShippingDepartmentConfig.module.less';
import WorkshopUserSelectionComponent, { IUser } from '../../components/WorkshopUserModal';
import { warehouseOptions } from '../../configuration/DictionaryOptions';

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
            key: 'warehouseTypeName',
            title: '仓库类型',
            width: 200,
            dataIndex: 'warehouseTypeName'
        },
        {
            key: 'leaderName',
            title: '负责人',
            width: 200,
            dataIndex: 'leaderName'
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
            key: 'position',
            title: '职位',
            dataIndex: 'position',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <span>保管员</span>
            )
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
                        onConfirm={ () => delUserRow(index, record) }
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
                <Form.Item name={ ["warehousePositionVOList", index, "region"] } initialValue={ _ } rules={[{ 
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
                <Form.Item name={ ["warehousePositionVOList", index, "position"] } initialValue={ _ } rules={[{ 
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
                        onConfirm={ () => delRow(index, record) }
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
            if(!selectedRows[0]) {
                message.warning('请选择负责人')
            } else {
                value = {
                    ...value,
                    id: detailData.id,
                    leader: detailData.leader ? detailData.leader : selectedRows[0].id,
                    leaderName: detailData.leaderName ? detailData.leaderName : selectedRows[0].name,
                    warehousePositionDTOList: value.warehousePositionVOList,
                    warehouseKeeperDTOList: userList,
                    warehousePositionDTODeleteList: warehousePositionDTODeleteList,
                    warehouseKeeperDTODeleteList: warehouseKeeperDTODeleteList
                }
                if(title==='新增') {
                    RequestUtil.post<IDetailData>(`/tower-production/warehouse`, { ...value }).then(res => {
                        message.success('保存成功！')
                        setVisible(false);
                        clear();
                        setRefresh(!refresh);
                    });
                } else {
                    RequestUtil.put<IDetailData>(`/tower-production/warehouse`, { ...value }).then(res => {
                        message.success('保存成功！')
                        setVisible(false);
                        clear();
                        setRefresh(!refresh);
                    });
                }  
            }
        })
    }

    const clear = () => {
        form.setFieldsValue({ code: '', name: '', warehouseType: '', leaderName: '', id: '', leader: '', warehouseKeeperVOList: [], warehousePositionVOList: []});
        setUserList([]);
        setSelectedRows([]);
        setDetailData({});
        setReservoirList([]);
    }

    const cancel = () => {
        setVisible(false);
        clear();
    }

    const addRow = () => {
        let reservoirListValues = form.getFieldsValue(true).warehousePositionVOList || [];
        let newData = {
            position: '',
            region: ''
        }
        setReservoirList([...reservoirListValues, newData]);
        form.setFieldsValue({ warehousePositionVOList: [...reservoirListValues, newData] });
    }

    const delRow = (index: number, record: Record<string, any>) => {
        let reservoirListValues = form.getFieldsValue(true).warehousePositionVOList || []; 
        reservoirListValues.splice(index, 1);
        setReservoirList([...reservoirListValues]);
        setWarehousePositionDTODeleteList([...warehousePositionDTODeleteList ,record]);
        form.setFieldsValue({ warehousePositionVOList: [...reservoirListValues] })
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/warehouse/detail/${ id }`);
        setReservoirList(data?.warehousePositionVOList || []);
        setUserList(data?.warehouseKeeperVOList || []);
        setDetailData(data);
        form.setFieldsValue({...data});
    }

    const delUserRow = (index: number, record: Record<string, any>) => {
        userList.splice(index, 1);
        setUserList([...userList]);
        setWarehouseKeeperDTODeleteList([...warehouseKeeperDTODeleteList, record])
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ reservoirList, setReservoirList ] = useState<IProcessList[]>([]);
    const [ title, setTitle ] = useState('新增');
    const [ userList, setUserList ] = useState<IWarehouseKeeperList[]>([]);
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    const [ selectedRows, setSelectedRows ] = useState<IUser[] | any>({});
    const [ warehousePositionDTODeleteList, setWarehousePositionDTODeleteList ] = useState<IProcessList[]>([]);
    const [ warehouseKeeperDTODeleteList, setWarehouseKeeperDTODeleteList ] = useState<IWarehouseKeeperList[]>([]);
    return (
        <>
            <Page
                path="/tower-production/warehouse"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle('新增');console.log(detailData,form.getFieldsValue(true))} } ghost>新增</Button> }
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
            <Modal visible={ visible } key={ title } width="40%" title={ title } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 6 }}>
                    <DetailTitle title="基础信息"/>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="code" label="仓库编号" initialValue={ detailData?.code } rules={[{
                                    "required": true,
                                    "message": "请输入仓库编号"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="name" label="仓库名称" initialValue={ detailData?.name } rules={[{
                                    "required": true,
                                    "message": "请输入仓库名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="warehouseType" label="仓库类型" initialValue={ detailData?.warehouseType } rules={[{
                                    "required": true,
                                    "message": "请输入仓库类型"
                                }]}>
                                 <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    { warehouseOptions && warehouseOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    }) }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="leaderName" label="负责人" initialValue={ detailData?.leaderName }>
                                <WorkshopUserSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                    setSelectedRows(selectedRows);
                                    form.setFieldsValue({leaderName: selectedRows.name});
                                    setDetailData({leaderName: selectedRows.name})
                                } } buttonType="link" buttonTitle="+选择负责人" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <DetailTitle title="保管员" operation={[<WorkshopUserSelectionComponent rowSelectionType="checkbox" onSelect={ (selectedRows: IUser[] | any) => {
                        selectedRows = selectedRows.map((item: IUser) => {
                            return {
                                ...item,
                                keeperUserId: item.id,
                                keeperName: item.name
                            }
                        })
                        setUserList(selectedRows)
                    } } buttonTitle="选择保管员" />]}/>
                    <CommonTable columns={userColumns} dataSource={userList} showHeader={false} pagination={false} />
                    <DetailTitle title="库区库位信息"/>
                    <Button type="primary" onClick={ addRow }>添加行</Button>
                    <Table rowKey="index" dataSource={[...reservoirList]} pagination={false} columns={tableColumns} className={styles.addModal}/>
                </Form>
            </Modal>
        </>
    )
}