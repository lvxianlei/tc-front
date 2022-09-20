import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, Modal, Form, message, Select, Checkbox, Radio } from 'antd';
import { CommonTable } from '../../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import useRequest from '@ahooksjs/use-request';
import { MenuOutlined } from '@ant-design/icons';
import SelectDept from './SelectDept';



const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);

export default function AssessmentMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ isAdd, setIsAdd] = useState<boolean>(false)
    const [ title, setTitle ] = useState<string>('新增');
    const [form] = Form.useForm();
    const history = useHistory();
    const [dataSource, setDataSource] = useState<any[]>([])
    const [typeName, setTypeName] = useState<any[]>([])
    const [name, setName] = useState<any[]>([])
    const [list, setList] = useState<any[]>([])
    const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-as/assess`);
            setDataSource(result.map((item: any, index: number) => {
                return {
                    ...item,
                    index: index
                }
            }))
            const typeList: any = await RequestUtil.get(`/tower-as/issue/list`);
            setTypeName(typeList)
            
            resole(result.map((item: any, index: number) => {
                return {
                    ...item,
                    index: index
                }
            }))
        } catch (error) {
            reject(error)
        }
    }))
    const columns = [
        {
            key: 'name',
            title: '考核名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'issueName',
            title: '问题分类',
            width: 200,
            dataIndex: 'issueName'
        },
        {
            key: 'deptName',
            title: '部门',
            width: 200,
            dataIndex: 'deptName'
        },
        {
            key: 'productName',
            title: '产品类型',
            width: 200,
            dataIndex: 'productName'
        },
        {
            key: 'componentName',
            title: '构件类型',
            width: 200,
            dataIndex: 'componentName'
        },
        {
            title: '排序',
            dataIndex: 'sort',
            width: 50,
            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            key: 'status',
            title: '状态',
            width: 200,
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
                <Space direction="horizontal" size="small" >
                    {record.status===1?<Popconfirm
                        title="是否禁用?"
                        onConfirm={ () => {
                            RequestUtil.put(`/tower-as/assess`,{
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
                            RequestUtil.put(`/tower-as/assess`,{
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
                    <Button type="link" onClick={ async () => {
                        setTitle('编辑');
                        setIsAdd(true); 
                        const result: any = await RequestUtil.get(`/tower-as/issue/issue/${record?.typeId}`);
                        setName(result)
                        form.setFieldsValue({ ...record });
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-as/assess/${ record.id }`).then(res => {
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

    const onSortEnd = async (props: { oldIndex: number; newIndex: number; }) => {
        if (props.oldIndex !== props.newIndex) {
            const newData: any = arrayMove(dataSource, props.oldIndex, props.newIndex).filter(el => !!el);
            await RequestUtil.post(`/tower-as/assess`,newData.map((item:any,index:number)=>{
                return{
                    ...item,
                    sort:index+1
                }
            }))
            setDataSource(newData)
        }
    };


    const DraggableContainer = (props: any) => (
        <SortableCon
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ ...restProps }) => {
        const index = dataSource.findIndex((x: any) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
         <Modal visible={isAdd} title={ title+'考核配置' } onOk={async ()=>{
            
            await form.validateFields()
            const value = form.getFieldsValue(true)
            if(value?.issue){
                value.issueId = value?.issue.split(',')[0]
                value.issueName = value?.issue.split(',')[1]
                delete value?.issue
            }
            if(value?.type){
                value.typeId = value?.type.split(',')[0]
                value.typeName = value?.type.split(',')[1]
                delete value?.type
            }
            if(title==='新增'){
                await RequestUtil.post(`/tower-as/assess`,{
                    ...value,
                    configAssessDeptDTOS:list
                }).then(()=>{
                    message.success('新增成功！')
                }).then(()=>{
                    setIsAdd(false)
                    form.resetFields()
                    setTitle('新增')
                    history.go(0)
                })
            }else{
                await RequestUtil.put(`/tower-as/assess`,{
                    ...value,
                    configAssessDeptDTOS:list
                }).then(()=>{
                    message.success('编辑成功！')
                }).then(()=>{
                    setIsAdd(false)
                    form.resetFields()
                    setTitle('新增')
                    history.go(0)
                })
            }
            

        }} onCancel={()=>{
            setIsAdd(false);
            setTitle('新增')            
            form.resetFields()
        }}>
            <Form form={form} {...formItemLayout}>
                    <Form.Item name="name" label="考核名称" rules={[
                        {
                            required:true,
                            message:"请填写考核名称"
                        }
                    ]}>
                        <Input maxLength={20}/>
                    </Form.Item>
                    <Form.Item name="type" label="问题阶段" rules={[
                        {
                            required:true,
                            message:"请选择问题阶段"
                        }
                    ]}>
                        <Select style={{width:'100%'}} onChange={async (value:any)=>{
                            const result: any = await RequestUtil.get(`/tower-as/issue/issue/${value.split(',')[0]}`);
                            setName(result)
                        }}>
                            { typeName && typeName.map((item:any)=>{
                                    return <Select.Option key={item.id} value={item.id+','+item.typeName}>{item.typeName}</Select.Option>
                                }) }
                        </Select>
                    </Form.Item>
                    <Form.Item name="issue" label="问题分类" rules={[
                        {
                            required:true,
                            message:"请选择问题分类"
                        }
                    ]}>
                        <Select style={{width:'100%'}}>
                            { name && name.map((item:any)=>{
                                    return <Select.Option key={item.id} value={item.id+','+item.name}>{item.name}</Select.Option>
                                }) }
                        </Select>
                    </Form.Item>
                    
                    <Form.Item name="dept" label="部门" rules={[
                        {
                            required:true,
                            message:"请选择部门"
                        }
                    ]}>
                        <Input addonBefore={
                            <SelectDept onSelect={(selectRows: any[]) => {
                                console.log(selectRows)
                                setList(selectRows.map((item:any)=>{
                                    return {
                                        deptId: item?.id,
                                        deptName: item?.name
                                    }
                                }))
                                form.setFieldsValue({ dept: selectRows.map(item => item.name) });
                            }} selectedKey={list.length>0?list.map(item=>item.deptId):[]} />
                        } disabled />
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
        <Button type='primary' style={{marginBottom:'10px'}}onClick={() => {
            setIsAdd(true); 
            setTitle('新增')
            form.setFieldsValue({
                status:1
            })
        }}>添加考核配置</Button>
        <CommonTable
            rowKey="index"
            dataSource={[...dataSource]}
            pagination={false}
            columns={columns}
            components={{
                body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                },
            }}
        />
    </>
}