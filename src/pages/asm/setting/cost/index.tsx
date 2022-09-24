import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, Modal, Form, message, Radio } from 'antd';
import { CommonTable } from '../../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import useRequest from '@ahooksjs/use-request';
import { MenuOutlined } from '@ant-design/icons';



const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);

export default function Cost(): React.ReactNode {
    const [ isAdd, setIsAdd] = useState<boolean>(false)
    const [ title, setTitle ] = useState<string>('新增');
    const [form] = Form.useForm();
    const history = useHistory();
    const [dataSource, setDataSource] = useState<any[]>([])
    const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-as/cost`);
            setDataSource(result.map((item: any, index: number) => {
                return {
                    ...item,
                    index: index
                }
            }))
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
            title: '费用分类名称',
            width: 150,
            dataIndex: 'name'
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
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" >
                    {record.status===1?<Popconfirm
                        title="是否禁用?"
                        onConfirm={ () => {
                            RequestUtil.put(`/tower-as/cost`,{
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
                            RequestUtil.put(`/tower-as/cost`,{
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
                        setTitle('编辑');
                        setIsAdd(true); 
                        form.setFieldsValue({ ...record });
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-as/cost/${ record.id }`).then(res => {
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
            await RequestUtil.post(`/tower-as/cost/sort`,newData.map((item:any,index:number)=>{
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
         <Modal visible={isAdd} title={ title+'费用分类' } onOk={async ()=>{
            
            await form.validateFields()
            const value = form.getFieldsValue(true)
            console.log(value)
            if(title==='新增'){
                await RequestUtil.post(`/tower-as/cost`,value).then(()=>{
                    message.success('新增成功！')
                }).then(()=>{
                    form.resetFields()
                    setIsAdd(false)
                    setTitle('新增')
                    history.go(0)
                })
            }else{
                await RequestUtil.put(`/tower-as/cost`,value).then(()=>{
                    message.success('编辑成功！')
                }).then(()=>{
                    form.resetFields()
                    setIsAdd(false)
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
                    <Form.Item name="name" label="费用分类名称" rules={[
                        {
                            required:true,
                            message:"请填写费用分类名称"
                        }
                    ]}>
                        <Input maxLength={20}/>
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
        <Button type='primary' style={{marginBottom:'10px'}} onClick={() => {
            setIsAdd(true); 
            setTitle('新增')
            form.setFieldsValue({
                status:1
            })
        }}>添加费用分类</Button>
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