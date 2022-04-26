import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Form, Button, Popconfirm, message, Modal } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

export default function CyclePlanConfig(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [visible,setVisible] = useState<boolean>(false)
    const [refresh,setRefresh] = useState<boolean>(false)
    const [title,setTitle] = useState<string>('新增');
    const [selectedValue,setSelectedValue] = useState<any>({});
    const [prodUnitList, setProdUnitList] = useState<any[]>([])
    const [form] = Form.useForm();
    const location = useLocation<{ state?: number }>();
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/productionUnit?current=1&size=10000`)
        setProdUnitList(data?.records)
        resole(data)
    }), {})
    const columns = [
        {
            key: 'taskNum',
            title: '周期计划类型',
            // width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '生产单元',
            // width: 400,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '是否备料',
            // width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={()=>{
                        setTitle('编辑')
                        setSelectedValue(record)
                        form.setFieldsValue({
                            // record
                        })
                        setVisible(true)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-system/notice?ids=${record.id}`)
                            message.success("删除成功...")
                            setRefresh(!refresh)
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.state === 1}
                    >
                        <Button type="link" disabled={record.state === 1}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]


    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };

    return (
        <>
            <Modal visible={ visible } title={title} okText="确认" onOk={ async ()=>{
                await form.validateFields()
                const value = form.getFieldsValue(true)
                if(title==='新增'){
                    await RequestUtil.put(``,value).then(()=>{
                        message.success('添加成功！')
                    })
                }else{
                    const submitData = {
                        ...value,
                        id: selectedValue.id
                    }
                    await RequestUtil.post(``,submitData).then(()=>{
                        message.success('编辑成功！')
                    })
                }
                setVisible(false)
                setRefresh(!refresh)
            } } onCancel={ ()=>{
                form.resetFields()
                setVisible(false)
                setTitle('新增')
            } }>
                <Form form={ form } { ...formItemLayout }>
                    <Form.Item name="dept" label="周期计划类型" rules={[
                        {
                            required:true,
                            message:"请填写周期计划部门"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }
                    ]}>
                        <Input maxLength={100}/>
                    </Form.Item>
                    <Form.Item name="assignorId" label="生产单元" rules={[{required:true,message:"请选择生产单元"}]}>
                        <Select style={{width:'100%'}} mode='multiple'>
                            {
                                prodUnitList.map((item: any, index: number) => {
                                    return (
                                        <Select.Option
                                            key={index}
                                            value={item.id}
                                            // disabled={item.isUse}
                                        >{item.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="assignorId" label="是否备料" rules={[{required:true,message:"请选择是否备料"}]}>
                        <Select style={{width:'100%'}}>
                            <Select.Option key={1} value={1}>是</Select.Option>
                            <Select.Option key={2} value={2}>否</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Page
                path="/tower-science/loftingTask"
                columns={columns}
                // exportPath="/tower-science/loftingTask"
                onFilterSubmit={onFilterSubmit}
                tableProps={{pagination:false}}
                filterValue={filterValue}
                refresh={refresh}
                extraOperation={<Button type='primary' ghost onClick={()=>{
                    setTitle('新增')
                    form.setFieldsValue({})
                    setVisible(true)
                }}>新增</Button>}
                searchFormItems={[]}
            />
        </>
    )
}