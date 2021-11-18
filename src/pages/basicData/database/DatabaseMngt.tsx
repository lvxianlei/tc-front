import React, { useState } from 'react';
import { Space, Button, Popconfirm, Modal, Form, Input } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';

export interface IMetaDept {
    readonly id?: string;
    readonly dataPlaceName?: string;
    readonly parentId?: string;
    readonly pid?: string;
    readonly hasChildren?: boolean;
    readonly parentName?: string;
}

export interface IDatabaseTree {
    readonly id?: string;
    readonly dataPlaceName?: string;
    readonly parentId?: string;
    readonly hasChildren?: boolean;
    readonly pid?: string;
    readonly parentName?: string;
    readonly children?: [];
}

export default function DatabaseMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ detail, setDetail ] = useState<IDatabaseTree>({});
    
    const columns = [
        {
            key: 'dataPlaceName',
            title: '名称',
            width: 150,
            dataIndex: 'dataPlaceName'
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
                        setDetail({ parentName: record.dataPlaceName, pid: record.id });
                        form.setFieldsValue({ parentName: record.dataPlaceName, pid: record.id });
                        setTitle('新增子库');
                        setVisible(true);
                    } }>新增子库</Button>
                    <Button type="link" onClick={ () => {
                        setDetail({ dataPlaceName: record.dataPlaceName, id: record.id });
                        form.setFieldsValue({ dataPlaceName: record.dataPlaceName, id: record.id });
                        setTitle('编辑');
                        setVisible(true);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/dataPlace?id=${ record.id }`).then(res => {
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
        if(form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                if(detail.id) {
                    value = {
                        ...value,
                        id: detail.id
                    }
                    RequestUtil.put(`/tower-system/dataPlace`, value).then(res => {
                        setVisible(false); 
                        setDetail({}); 
                        form.resetFields(); 
                        setRefresh(!refresh);
                        form.setFieldsValue({ parentName: '', dataPlaceName: '' });
                    })
                } else {
                    value = {
                        ...value,
                        pid: detail.pid
                    }
                    RequestUtil.post(`/tower-system/dataPlace`, value).then(res => {
                        setVisible(false); 
                        setDetail({}); 
                        form.resetFields(); 
                        setRefresh(!refresh);
                        form.setFieldsValue({ parentName: '', dataPlaceName: '' });
                    })
                }
                console.log(form.getFieldsValue(true))
            })
        }
    }
    

    return <>
        <Page
            path="/tower-system/dataPlace"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={ <Button type="ghost" onClick={ () => { setVisible(true); } }>新增一级库</Button> }
            searchFormItems={ [] }
        />
        <Modal visible={ visible } title={ title } onOk={ save } onCancel={ () => { setVisible(false); setDetail({}); form.resetFields(); form.setFieldsValue({ parentName: '', dataPlaceName: '' }); } }>
            <Form form={ form }>
                { detail.pid !== undefined && detail.pid !== '' ? <Form.Item label={<span><span style={{color: 'red'}}>*</span>上级</span>} name="parentName" initialValue={ detail.parentName }>
                    <Input maxLength={ 50 } disabled/>
                </Form.Item> : null}
                <Form.Item label="名称" name="dataPlaceName" initialValue={ detail.dataPlaceName } rules={[{
                    "required": true,
                    "message": "请输入名称"
                }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}