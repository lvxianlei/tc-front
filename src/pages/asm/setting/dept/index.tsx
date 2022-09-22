import React, { useState } from 'react';
import { Space, Button, Popconfirm, Modal, Form, Input, Select, message, InputNumber } from 'antd';
import { CommonTable, DetailTitle, Page } from '../../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../../utils/RequestUtil';
import SelectDept from './SelectDept';
import ProductType from './ProductType';
import { productTypeOptions } from '../../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router-dom';

export default function DeptMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ detail, setDetail ] = useState<any>({});
    const [ list, setList ] = useState<any[]>([]);
    const history = useHistory();
    const [ dataSource, setDataSource ] = useState<any[]>([]);
    const wrapAuthority2DataNode = (authorities: any): any[] => {
        authorities.forEach((authority: any,index:number): void => {
            if (authority.configDeptProductVOS && authority.configDeptProductVOS.length) {
                wrapAuthority2DataNode(authority.configDeptProductVOS as (any)[]);
                authority.children = authority.configDeptProductVOS.map((item:any)=>{
                    return {
                        ...item,
                        nameNull: authority.name,
                        component: item?.componentId+','+item?.componentName
                    }
                })
             
            }
        });
        return authorities;
    }
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-as/dept`);
            setDataSource(wrapAuthority2DataNode(result))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const columns = [
        {
            key: 'name',
            title: '部门名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'productName',
            title: '产品类型',
            width: 150,
            dataIndex: 'productName'
        },
        {
            key: 'componentName',
            title: '构件类型',
            width: 150,
            dataIndex: 'componentName'
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
                    {record.status===1?<Popconfirm
                        title="是否禁用?"
                        onConfirm={ () => {
                            record?.name&&RequestUtil.put(`/tower-as/dept/dept`,{
                                ...record,
                                status:2
                            }).then(res => {
                                message.success('禁用成功！')
                                history.go(0)
                            });
                            record?.productName&&RequestUtil.put(`/tower-as/dept/product`,{
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
                            record?.name&&RequestUtil.put(`/tower-as/dept/dept`,{
                                ...record,
                                status:1
                            }).then(res => {
                                message.success('启用成功！')
                                history.go(0)
                            });
                            record?.productName&&RequestUtil.put(`/tower-as/dept/product`,{
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
                        setVisible(true);
                        console.log(record)
                        record?.name&&setDetail(record)
                        record?.name&&setList(record?.children)
                        record?.name&&form.setFieldsValue({ 
                            name:record?.name, 
                            data: record?.children, 
                            deptId: record?.id,
                            id:record?.id 
                        });
                        record?.productName&&setDetail({...record, name: record?.nameNull})
                        record?.productName&&setList([{ ...record }]);
                        record?.productName&&form.setFieldsValue({ data: [record] });
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            record?.name&&RequestUtil.delete(`/tower-as/dept/${ record.id }`).then(res => {
                                message.success('删除成功！')
                                history.go(0)
                            });
                            record?.productName&&RequestUtil.delete(`/tower-as/dept/product/${ record.id }`).then(res => {
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
   
    const save = async () => {
        if(form) {
            await form.validateFields();
            const value = form.getFieldsValue(true)
            console.log(value?.data)
            if(detail?.productName){
                if(value?.data[0]?.component){
                    value.data[0].componentId = value?.data[0]?.component.split(',')[0]
                    value.data[0].componentName = value?.data[0]?.component.split(',')[1]
                    delete value.data[0].component
                }
                RequestUtil.put(`/tower-as/dept/product`, value.data[0]).then(res => {
                    setVisible(false); 
                    setDetail({}); 
                    setTitle('新增')
                    form.resetFields(); 
                    setRefresh(!refresh);
                    form.setFieldsValue({ id:'',name: '', deptId: '',data:[] });
                    history.go(0)
                })
            }else{
                if(value?.data){
                    value.configDeptProductDTOS = value?.data.map((item:any)=>{
                        return {
                            ...item,
                            deptName: value?.name,
                            deptId: value?.deptId,
                            componentId: item?.component&&item?.component.length>0&&item.component.split(',')[0],
                            componentName: item?.component&&item?.component.length>0&&item.component.split(',')[1]
                        }
                    })
                    delete value?.data
                }
                if(title==='编辑') {
                    RequestUtil.put(`/tower-as/dept`, {
                        ...value,
                        status:detail?.status
                    }).then(res => {
                        setVisible(false); 
                        setDetail({}); 
                        setTitle('新增')
                        form.resetFields(); 
                        setRefresh(!refresh);
                        form.setFieldsValue({ sort:'',id:'' , name: '', deptId: '',data:[] });
                        history.go(0)
                    })
                } else {
                    RequestUtil.post(`/tower-as/dept`, value).then(res => {
                        setVisible(false); 
                        setDetail({}); 
                        setTitle('新增')
                        form.resetFields(); 
                        setRefresh(!refresh);
                        form.setFieldsValue({ name: '', deptId: '',data:[]});
                        history.go(0)
                    })
                }
            }
            
        }
    }
    

    return <>
        <Button type='primary' style={{marginBottom:'10px'}} onClick={() => {
            setVisible(true)
            form.setFieldsValue({
                status:1,
                sort:1
            })
        }}>添加部门配置</Button>
        <CommonTable
            rowKey="id"
            dataSource={[...dataSource]}
            pagination={false}
            columns={columns}
        />
        <Modal 
            visible={ visible } 
            title={ title+'部门配置' } 
            onOk={ save } 
            onCancel={ () => { 
                setVisible(false); 
                setDetail({}); 
                setList([])
                setTitle('新增')
                form.resetFields(); 
                form.setFieldsValue({ name: '', dept: '',data:[] }); 
            } }
        >
            <Form form={ form }>
                <DetailTitle title='基本信息'/>
                { 
                    detail.id !== undefined && detail.id !== '' 
                    ?<>
                     <Form.Item label='部门' name="name" initialValue={ detail.name } rules={[{
                        "required": true,
                        "message": "请选择部门"
                    }]}>
                        <Input  disabled/>
                    </Form.Item> 
                    <Form.Item name="deptId" style={{ display: "none" }}>
                        <Input size="small" type='hidden' />
                    </Form.Item>
                    <Form.Item name="id" style={{ display: "none" }}>
                        <Input size="small" type='hidden' />
                    </Form.Item>
                    <Form.Item
                        name="sort"
                        label='排序'
                        initialValue={detail.sort||1}
                        rules={[{
                            "required": true,
                            "message": "请填写排序"
                        }]}
                    >
                        <InputNumber precision={0} min={1} disabled={detail?.nameNull}/>
                    </Form.Item>
                    </>
                    : <><Form.Item name="name" label="部门" initialValue={detail.name} rules={[{
                        "required": true,
                        "message": "请选择部门"
                    }]}>
                        <Input addonBefore={
                            <SelectDept onSelect={(selectRows: any[]) => {
                                console.log(selectRows)
                                form.setFieldsValue({ name: selectRows[0].name, deptId: selectRows[0].id });
                            }} selectedKey={detail.name||[]} />
                        } disabled />
                    </Form.Item>
                    <Form.Item name="deptId" style={{ display: "none" }}>
                        <Input size="small" type='hidden' />
                    </Form.Item>
                    <Form.Item
                        name="sort"
                        label='排序'
                        initialValue={detail.sort||1}
                        rules={[{
                            "required": true,
                            "message": "请填写排序"
                        }]}
                    >
                        <InputNumber precision={0} min={1}/>
                    </Form.Item>
                    </>
                }
                <DetailTitle title='产品类型' operation={[detail?.nameNull?null:<ProductType onSelect={(selectRows: any[]) => {
                    console.log(selectRows)
                    const value = selectRows.map((item:any)=>{
                        return{
                            productName: item?.name,
                            productId: item?.id,
                        }
                    }) 
                    
                    form.setFieldsValue({ data: value });
                    setList(value)
                }} selectedKey={[]}/>]}/>
                <CommonTable columns={[
                    {
                        key: 'productName',
                        title: '产品类型',
                        width: 120,
                        dataIndex: 'productName',
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <><span>{_}</span>
                           <Form.Item name={['data', index, "productName"]} style={{ display: "none" }}>
                                <Input size="small" type='hidden' />
                            </Form.Item>
                            <Form.Item name={['data', index, "productId"]} style={{ display: "none" }}>
                                <Input size="small" type='hidden' />
                            </Form.Item>
                            </>
                        )
                        
                    },
                    {
                        key: 'component',
                        title: '构件类型',
                        width: 150,
                        dataIndex: 'component',
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item
                                name={['data', index, "component"]}
                                initialValue={_}
                            >
                                <Select  style={{width:'100%'}} >
                                    {/* {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })} */}
                                    <Select.Option key={1} value={'1,角钢'}>角钢</Select.Option>
                                    <Select.Option key={2} value={'2,钢板'}>钢板</Select.Option>
                                </Select>
                            </Form.Item>
                        )
                    },
                    {
                        key: 'sort',
                        title: '排序',
                        width: 50,
                        dataIndex: 'sort',
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item
                                name={['data', index, "sort"]}
                                initialValue={_||1}
                            >
                                <InputNumber precision={0} min={1}/>
                            </Form.Item>
                        )
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 50,
                        render: (_: undefined, record: Record<string, any>, index:number): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={ () => {
                                        list.splice(index,1)
                                        setList([...list])
                                    } }
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="link">删除</Button>
                                </Popconfirm>
                            </Space>
                        )
                    }
                ]} pagination={false} dataSource={[...list]}/>
            </Form>
        </Modal>
    </>
}