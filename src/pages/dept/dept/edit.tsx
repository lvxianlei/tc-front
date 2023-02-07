import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, Modal, Form, message } from 'antd';
import { BaseInfo, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { useParams } from 'react-router-dom';

export interface IJobs {
    readonly id?: string;
    readonly stationId?: string;
    readonly stationName?: string;
    readonly userId?: string;
    readonly userName?: string;
}

export default function Edit(): React.ReactNode {
    const params = useParams<{ id: string | undefined }>()
    const [refresh, setRefresh] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('新增');
    const [detail, setDetail] = useState<IJobs>({});

    const columns = [
        {
            title: '名称',
            width: 150,
            dataIndex: 'userName'
        },
        {
            title: '岗位',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={async () => {
                        setDetail(record);
                        setTitle("编辑");
                        setVisible(true);
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-system/deptStationEmp?id=${record.id}`)
                            message.success("删除成功")
                            setRefresh(!refresh);
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const save = async () => {
        const formValue = await form.validateFields()
        const value = {
            ...formValue,
            deptId: params?.id,
            userName: formValue.userName?.value,
            userId: formValue.userName?.id,
            stationId: formValue.stationName?.value,
            stationName: formValue.stationName?.label
        }
        if (title === '新增') {
            await RequestUtil.post(`/tower-system/deptStationEmp`, value)
            setDetail({});
            message.success('新增成功');
            setRefresh(!refresh);
            setVisible(false);
        } else {
            await RequestUtil.put(`/tower-system/deptStationEmp`, {
                ...value,
                id: detail.id
            })
            setDetail({});
            message.success('编辑成功');
            setRefresh(!refresh);
            form.resetFields();
            form.setFieldsValue({ stationName: '' });
            setVisible(false);
        }

    }

    return <>
        <Modal
            visible={visible}
            title={title}
            onOk={save}
            destroyOnClose
            onCancel={() => {
                setVisible(false);
                setDetail({});
            }}>
            <BaseInfo
                form={form}
                col={1}
                edit
                columns={[
                    {
                        title: '人员',
                        dataIndex: 'userName',
                        width: 1101,
                        "type": "popTable",
                        "path": "/tower-system/employee",
                        "rowKey": "userId",
                        "readOnly": true,
                        "dependencies": true,
                        "value": "name",
                        "columns": [
                            {
                                "title": "登录账号",
                                "dataIndex": "account"
                            },
                            {
                                "title": "用户姓名",
                                "dataIndex": "name",
                                "search": true
                            },
                            {
                                "title": "所属角色",
                                "dataIndex": "roleName"
                            },
                            {
                                "title": "所属机构",
                                "dataIndex": "deptName"
                            }
                        ],
                    },
                    {
                        title: '岗位',
                        dataIndex: 'stationName',
                        type: "fetchSelect",
                        path: "/tower-system/station",
                        labelInValue: true,
                        transformData: (data: any) => data?.records?.map((item: any) => ({
                            label: item.stationName,
                            value: item.id
                        }))
                    },
                ]}
                dataSource={{
                    userName: {
                        id: detail?.userId,
                        value: detail?.userName
                    },
                    stationName: detail?.stationId ? {
                        label: detail?.stationName,
                        value: detail?.stationId
                    } : undefined
                }} />
        </Modal>
        <Page
            path="/tower-system/deptStationEmp"
            columns={columns}
            filterValue={{ deptId: params?.id }}
            headTabs={[]}
            refresh={refresh}
            extraOperation={<Button type="primary" onClick={() => { setVisible(true); setTitle("新增"); }}>新增</Button>}
            searchFormItems={[]}
        />

    </>
}