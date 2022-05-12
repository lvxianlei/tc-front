import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, Form, Popconfirm, Modal, InputNumber, message } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common'
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../../utils/AuthUtil';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import TextArea from 'antd/lib/input/TextArea';

export default function AssemblyWeldingList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const location = useLocation<{ state?: number, userId?: string }>();
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<string>('添加');
    const [editValue, setEditValue] = useState<any>({});
    const [ workUnit, setWorkUnit] = useState<any[]>([])
    const [form] = Form.useForm();
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
        setWorkUnit(data?.records)
        resole(data)
    }), {})
    const columns = [
        {
            key: 'unProject',
            title: '分组名称',
            width: 200,
            dataIndex: 'unProject'
        },
        {
            key: 'workPro',
            title: '生产单元',
            width: 200,
            dataIndex: 'workPro'
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
                            ...record
                        })
                        setVisible(true)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-quality/projectAllocation/${record.id}`).then(res => {
                                setRefresh(!refresh);
                                history.go(0)
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record?.locking !== 1}
                    >
                        <Button type="link" disabled={record?.locking !== 1}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const onSubmit = async ()=> {
        await form.validateFields();
        const value = form.getFieldsValue(true)
        const submitData = {
            ...value,
            id: edit==='编辑'?editValue.id:'',
        }
        await RequestUtil.post(`/tower-quality/projectAllocation`,submitData)
        message.success(`保存成功！`)
    }

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return (
        <>
        <Page
            path="/tower-quality/projectAllocation"
            columns={columns}
            filterValue={filterValue}
            exportPath="/tower-quality/projectAllocation"
            refresh={refresh}
            // extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            extraOperation={<Button type='primary' ghost onClick={()=>{
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
                    <Button onClick={()=>{
                        setVisible(false)
                        edit==='编辑'&& setEdit(`添加`)
                        form.resetFields()
                        history.go(0)
                    }}>关闭</Button>
                </Space>
            }
            onCancel={()=>{
                setVisible(false)
                edit==='编辑'&& setEdit(`添加`)
                form.resetFields()
                history.go(0)
            }}  width={ 800 }
        >
                <Form form={form} {...formItemLayout}>
                        <Form.Item name="unProject" label="分组名称" rules={[{
                            "required": true,
                            "message":"请填写分组名称"
                        }]} >
                            <Input maxLength={100}/>
                        </Form.Item>
                        <Form.Item name="workUnit" label="生产单元" rules={[{
                            "required": true,
                            "message":"请选择生产单元"
                        }]} >
                            <Select style={{ width: '100%' }} >
                              { workUnit && workUnit.map(({ id, name }, index) => {
                                  return <Select.Option key={ index } value={ id }>
                                      { name }
                                  </Select.Option>
                              }) }
                          </Select>
                        </Form.Item>
                        
                </Form>
            </Modal>
        </>
    )
}