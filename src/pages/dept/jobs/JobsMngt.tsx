import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, Modal, Form, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';

interface IJobs {
    readonly id?: string;
    readonly stationName?: string;
}

export default function JobsMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ detail, setDetail ] = useState<IJobs>({});
    
    const columns = [
        {
            key: 'stationName',
            title: '名称',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ async () => {
                        const data: IJobs = await RequestUtil.get(`/tower-system/station/${ record.id }`);
                        setDetail(data);
                        setVisible(true);
                        setTitle("编辑");
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/station/${ record.id }`).then(res => {
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
                if(title === '新增') {
                    RequestUtil.post(`/tower-system/station`, value).then(res => {
                        setDetail({});
                        message.success('新增成功');
                        setVisible(false);
                    })
                } else {
                    RequestUtil.put(`/tower-system/station`,  {
                        ...value,
                        id: detail.id
                    }).then(res => {
                        setDetail({});
                        message.success('编辑成功');
                        setVisible(false);
                    })
                }
            })
        }
    }

    return <>
        <Page
            path="/tower-system/station"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={ <Button type="primary" onClick={ () => { setVisible(true); setTitle("新增"); } }>新增</Button> }
            searchFormItems={ [] }
        />
        <Modal visible={ visible } title={ title + "岗位" } onOk={ () => save } onCancel={ () => { setVisible(false); setDetail({}); } }>
            <Form form={ form }>
                <Form.Item label="名称" name="stationName" initialValue={ detail.stationName } rules={[{
                    "required": true,
                    "message": "请输入名称"
                }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}