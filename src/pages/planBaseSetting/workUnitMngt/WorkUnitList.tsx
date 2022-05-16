import React, { useState } from 'react'
import { Space, Input, Button, Select, Form, Popconfirm, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

export default function AssemblyWeldingList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<string>('添加');
    const [editValue, setEditValue] = useState<any>({});
    const [form] = Form.useForm();
    const { data: workUnit } = useRequest<{ id: string, name: string }[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
        resole(data?.records)
    }), {})
    const columns = [
        {
            key: 'groupName',
            title: '分组名称',
            width: 200,
            dataIndex: 'groupName'
        },
        {
            key: 'unitNames',
            title: '生产单元',
            width: 200,
            dataIndex: 'unitNames'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 100,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => {
                        setEditValue(record)
                        setEdit('编辑')
                        form.setFieldsValue({
                            ...record,
                            unitIds: record?.unitIds.split(',')
                        })
                        setVisible(true)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`tower-aps/group/unit/config/remove/${record.groupId}`).then(res => {
                                setRefresh(!refresh);
                                history.go(0)
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const onSubmit = async () => {
        await form.validateFields();
        const value = form.getFieldsValue(true)
        const submitData = {
            ...value,
            unitIds: value.unitIds.join(','),
            groupId: edit === '编辑' ? editValue.groupId : '',
        }
        await RequestUtil.post(`tower-aps/group/unit/config/save`, submitData).then(res => {
            message.success(`保存成功！`);
            setRefresh(!refresh);
            setVisible(false);
            form.resetFields();
        })
        
    }

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return (
        <>
            <Page
                path="tower-aps/group/unit/config/list"
                columns={columns}
                filterValue={filterValue}
                // exportPath="tower-aps/group/unit/config/list"
                refresh={refresh}
                // extraOperation={<Button type="primary">导出</Button>}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<Button type='primary' ghost onClick={() => {
                    setEdit('添加')
                    setVisible(true)
                }}>新增</Button>}
                searchFormItems={[]}
            />
            <Modal
                visible={visible}
                title={edit}
                footer={
                    <Space>
                        <Button type='primary' ghost onClick={onSubmit} >保存</Button>
                        <Button onClick={() => {
                            setVisible(false)
                            edit === '编辑' && setEdit(`添加`)
                            form.resetFields()
                        }}>关闭</Button>
                    </Space>
                }
                onCancel={() => {
                    setVisible(false)
                    edit === '编辑' && setEdit(`添加`)
                    form.resetFields()
                }}
            >
                <Form form={form} {...formItemLayout}>
                    <Form.Item name="groupName" label="分组名称" rules={[{
                        "required": true,
                        "message": "请填写分组名称"
                    }]} >
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item name="unitIds" label="生产单元" rules={[{
                        "required": true,
                        "message": "请选择生产单元"
                    }]} >
                        <Select mode="multiple" style={{ width: '100%' }} >
                            {workUnit && workUnit.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}