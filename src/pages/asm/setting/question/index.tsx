import React, { useState } from 'react';
import { Space, Button, Popconfirm, Modal, Form, Input, Radio, message, InputNumber } from 'antd';
import { CommonTable } from '../../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';

export default function DeptMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [ formRef ] = Form.useForm();
    const [ visible, setVisible ] = useState(false);
    const [ visibleOther, setVisibleOther] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ titleOther, setTitleOther ] = useState('新增');
    const [ detail, setDetail ] = useState<any>({});
    const history = useHistory();
    const [ dataSource, setDataSource ] = useState<any[]>([]);
    const wrapAuthority2DataNode = (authorities: any): any[] => {
        authorities.forEach((authority: any,index:number): void => {
            // authority.sort = index + 1

            if (authority.configIssueVOS && authority.configIssueVOS.length) {
                wrapAuthority2DataNode(authority.configIssueVOS as (any)[]);
                authority.children = authority.configIssueVOS.map((item:any)=>{
                    return {
                        ...item,
                        nameNull: authority.typeName
                    }
                })
            }
        });
        return authorities;
    }
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-as/issue/list`);
            setDataSource(wrapAuthority2DataNode(result))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const columns = [
        {
            key: 'typeName',
            title: '问题阶段',
            width: 150,
            dataIndex: 'typeName'
        },
        {
            key: 'name',
            title: '问题分类',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'sort',
            title: '排序',
            width: 150,
            dataIndex: 'sort'
        },
        {
            key: 'status',
            title: '状态',
            width: 150,
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '已启用';
                    case 2:
                        return '已禁用';
                }
            }  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {record?.typeName&&<Button type="link" onClick={()=>{
                        setVisibleOther(true)
                        formRef.setFieldsValue({
                            // ...record,
                            typeName: record?.typeName,
                            typeId: record?.id,
                            name:'',
                            status:1,
                            sort:1
                        })
                    }}>添加问题分类</Button>}
                    {record.status===1?<Popconfirm
                        title="是否禁用?"
                        onConfirm={ () => {
                            RequestUtil.put(record?.typeName?`/tower-as/issue/type`:`/tower-as/issue`,{
                                ...record,
                                status:2
                            }).then(res => {
                                message.success('禁用成功！')
                                history.go(0)
                            });
                        } }
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="link">禁用</Button>
                    </Popconfirm>
                    :<Popconfirm
                        title="是否启用?"
                        onConfirm={ () => {
                            RequestUtil.put(record?.typeName?`/tower-as/issue/type`:`/tower-as/issue`,{
                                ...record,
                                status:1
                            }).then(res => {
                                message.success('启用成功！')
                                history.go(0)
                            });
                        } }
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="link">启用</Button>
                    </Popconfirm>
                    }
                    <Button type="link" onClick={ () => {
                        record?.typeName&&setTitle('编辑');
                        record?.typeName&&setVisible(true);
                        record?.typeName&&form.setFieldsValue({ ...record, name: record?.typeName });
                        record?.name&&setTitleOther('编辑');
                        record?.name&&setVisibleOther(true);
                        record?.name&&formRef.setFieldsValue({ ...record, typeName: record?.nameNull });
                        console.log(record)
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            record?.typeName&&RequestUtil.delete(`/tower-as/issue/type/${ record.id }`).then(res => {
                                message.success('删除成功！')
                                history.go(0)
                            });
                            record?.name&&RequestUtil.delete(`/tower-as/issue/${ record.id }`).then(res => {
                                message.success('删除成功！')
                                history.go(0)
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

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        {/* <Page
            path="/tower-system/dataPlace"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={ <Button type="ghost" onClick={ () => setVisible(true) }>添加问题阶段</Button> }
            searchFormItems={ [] }
        /> */}
        
        <Button type='primary' style={{marginBottom:'10px'}}  onClick={() => {
            setVisible(true)
            form.setFieldsValue({
                status:1,
                sort:1
            })
        }}>添加问题阶段</Button>
        <CommonTable
            rowKey="id"
            dataSource={[...dataSource]}
            pagination={false}
            columns={columns}
        />
        <Modal 
            visible={ visible } 
            title={ title+'问题阶段' } 
            onOk={ async ()=>{
                await form.validateFields()
                const value = form.getFieldsValue(true)
                console.log(value)
                if(title==='新增'){
                    await RequestUtil.post(`/tower-as/issue/type`,value).then(()=>{
                        message.success('新增成功！')
                    }).then(()=>{
                        form.resetFields()
                        setVisible(false)
                        setTitle('新增')
                        history.go(0)
                    })
                }else{
                    await RequestUtil.put(`/tower-as/issue/type`,value).then(()=>{
                        message.success('编辑成功！')
                    }).then(()=>{
                        form.resetFields()
                        setVisible(false)
                        setTitle('新增')
                        history.go(0)
                    })
                }
                
            } } 
            onCancel={ () => { 
                setVisible(false); 
                setDetail({}); 
                form.resetFields(); 
                form.setFieldsValue({ name: '',status:1 }); 
            } }
        >
            <Form form={ form } {...formItemLayout}>
                <Form.Item label='问题阶段名称' name="name" rules={[
                    {
                        required:true,
                        message:"请选择状态"
                    }
                ]}>
                    <Input  maxLength={20}/>
                </Form.Item> 
                <Form.Item label='排序' name="sort" rules={[
                    {
                        required:true,
                        message:"请输入排序"
                    }
                ]}>
                    <InputNumber  precision={0} min={1}/>
                </Form.Item> 
                <Form.Item name="status" label="状态" rules={[
                    {
                        required:true,
                        message:"请选择状态"
                    }
                ]}>
                    <Radio.Group >
                        <Radio value={1}>启用</Radio>
                        <Radio value={2}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="id" label="" style={{display:'none'}}>
                    <Input type='hidden'/>
                </Form.Item>
            </Form>
        </Modal>
        <Modal 
            visible={ visibleOther } 
            title={ titleOther+'问题分类' } 
            onOk={ async ()=>{
                await formRef.validateFields()
                const value = formRef.getFieldsValue(true)
                if(titleOther==='新增'){
                    await RequestUtil.post(`/tower-as/issue`,value).then(()=>{
                        message.success('新增成功！')
                    }).then(()=>{
                        formRef.resetFields()
                        setVisibleOther(false)
                        setTitleOther('新增')
                        history.go(0)
                    })
                }else{
                    await RequestUtil.put(`/tower-as/issue`,value).then(()=>{
                        message.success('编辑成功！')
                    }).then(()=>{
                        formRef.resetFields()
                        setVisibleOther(false)
                        setTitleOther('新增')
                        history.go(0)
                    })
                }
                
            } } 
            onCancel={ () => { 
                setVisibleOther(false); 
                setDetail({}); 
                formRef.resetFields(); 
                formRef.setFieldsValue({ typeName: '', name: '', status:1 }); 
            } }
        >
            <Form form={ formRef } {...formItemLayout}>
                <Form.Item label='所属问题阶段' name="typeName" >
                    <Input disabled />
                </Form.Item> 
                <Form.Item label='问题分类名称' name="name" rules={[
                    {
                        required:true,
                        message:"请输入问题分类名称"
                    }
                ]}>
                    <Input  maxLength={20}/>
                </Form.Item> 
                <Form.Item label='排序' name="sort" rules={[
                    {
                        required:true,
                        message:"请输入排序"
                    }
                ]}>
                    <InputNumber  precision={0} min={1}/>
                </Form.Item> 
                <Form.Item name="status" label="状态" rules={[
                    {
                        required:true,
                        message:"请选择状态"
                    }
                ]}>
                    <Radio.Group >
                        <Radio value={1}>启用</Radio>
                        <Radio value={2}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="id" label="" style={{display:'none'}}>
                    <Input type='hidden'/>
                </Form.Item>
                <Form.Item name="typeId" label="" style={{display:'none'}}>
                    <Input type='hidden'/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}