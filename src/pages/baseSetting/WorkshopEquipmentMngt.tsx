
/**
 * @author zyc
 * @copyright © 2021 
 * @description 工序管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Table, Popconfirm, message, Row, Col } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './WorkshopEquipmentMngt.module.less';

interface IProcessList {
    readonly time?: string;
    readonly atime?: string;
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
            key: 'taskNum',
            title: '车间名称',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'internalNumber',
            title: '派工设备名称',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '工序',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '设备所属产线',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '设备状态',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '制单人',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '制单时间',
            width: 200,
            dataIndex: 'name'
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
                        getList();
                        setVisible(true);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.post(``).then(res => {
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

    const getList = async () => {
        const data = await RequestUtil.post<IProcessList[]>(``);

    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ searchForm ] = useForm();
    const [ filterValue, setFilterValue ] = useState({});
    const [ disabled, setDisabled] = useState(false);
    const [ disabled2, setDisabled2 ] = useState(false);
    return (
        <>
            <Form form={searchForm} layout="inline" style={{margin:'20px'}} onFinish={(value: Record<string, any>) => {
                setFilterValue(value)
                setRefresh(!refresh);
            }}>
                <Form.Item label='' name='materialName'>
                    <Input placeholder="请输入派工设备进行查询"/>
                </Form.Item>
                <Form.Item label='选择车间' name='a'>
                    <Select placeholder="请选择" className={ styles.width150 } onChange={ (e) => {
                        console.log(e)
                        searchForm.setFieldsValue({ structureTexture: '' });
                    } }>
                        <Select.Option value={ 1 } key="4">全部</Select.Option>
                        <Select.Option value={ 2 } key="">全部222</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='选择工序' name='structureTexture'>
                    <Select placeholder="请选择" className={ styles.width150 } onChange={ (e) => {
                        console.log(e)
                    } }>
                        <Select.Option value={ 1 } key="4">全部</Select.Option>
                        <Select.Option value={ 2 } key="">全部222</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='状态' name='b'>
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
            <Modal visible={ visible } width="60%" title="按车间设置工序顺序" okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 8 }}>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="dept" label="所属车间" rules={[{
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
                        <Col span={ 8 }>
                            <Form.Item name="dept" label="工序" rules={[{
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
                        <Col span={ 8 }>
                            <Form.Item name="dept" label="派工设备名称" rules={[{
                                    "required": true,
                                    "message": "请输入派工设备名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 8 }>
                            <Form.Item name="dept" label="所属产线" rules={[{
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
                            <Form.Item name="dept" label="台账设备关联">
                                <Button>+关联设备</Button>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 }>
                            <Form.Item name="dept" label="状态">
                                <Select placeholder="请选择">
                                    <Select.Option value={ 1 } key="1">正常</Select.Option>
                                    <Select.Option value={ 2 } key="2">停用</Select.Option>
                                    <Select.Option value={ 3 } key="3">维修</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}