import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, Form, Popconfirm, Modal, Row, Card, Col, message } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../common'
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../utils/AuthUtil';
import { PlusOutlined } from '@ant-design/icons';
import { patternTypeOptions } from '../../configuration/DictionaryOptions';

export default function UnqualifiedAmountList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const location = useLocation<{ state?: number, userId?: string }>();
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<string>('添加');
    const [editValue, setEditValue] = useState<any>({});
    const [form] = Form.useForm();
    const [workmanship, setWorkmanship] = useState<any[]>([{workProList:[{}]}]);
    const [workmanshipChild, setWorkmanshipChild] = useState<any[]>([{}]);
    const [prodLinkList, setProdLinkList] = useState<any[]>([])
    const [productUnitData, setProductUnitData] = useState<any[]>([])
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<SelectDataNode[]>(`/tower-aps/productionUnit?size=10000`);
        const prodLinkList: any = await RequestUtil.get(`/tower-aps/productionLink?current=1&size=10000`)
        setProdLinkList(prodLinkList?.records)
        setProductUnitData(data?.records)
        console.log(workmanship)
        form.setFieldsValue({
            craftNameDTOS: workmanship
        })
        resole(data)
    }), {})
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'workUnit',
            title: '生产单元',
            width: 100,
            dataIndex: 'workUnit'
        },
        {
            key: 'craftName',
            title: '工艺',
            width: 200,
            dataIndex: 'craftName'
        },
        {
            key: 'workPro',
            title: '工序',
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
                            RequestUtil.delete(`/tower-quality/workAllocation/${record.id}`).then(res => {
                                message.success("删除成功！")
                                history.go(0)
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" >删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
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
        <Page
            path="/tower-quality/workAllocation"
            columns={columns}
            filterValue={filterValue}
            // exportPath="/tower-science/drawProductDetail"
            refresh={refresh}
            extraOperation={<Button type='primary' ghost onClick={()=>{
                setEdit('添加')
                setVisible(true)
            }}>新增</Button>}
            // extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'workUnit',
                    label: '生产单元',
                    children: <Form.Item name="workUnit" >
                        <Select style={{ width: "100px" }}>
                            {productUnitData?.map((item: any) => {
                                return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'craftName',
                    label: '工艺',
                    children: <Form.Item name="craftName">
                        <Input/>
                    </Form.Item>
                }
            ]}
        />
        <Modal 
            visible={visible} 
            title={edit} 
            footer={
                <Space>
                    <Button type='primary' ghost onClick={async ()=>{
                        await form.validateFields();
                        const value = form.getFieldsValue(true)
                        const submitData = {
                            craftNameDTOS: value?.craftNameDTOS.map((item:any)=>{
                                return {
                                    ...item,
                                    workProList: item?.workProList.length>0?item?.workProList.map((itemList:any)=>{
                                        return itemList?.count
                                    }):[]
                                }
                            }),
                            workUnit: value?.unit.split(',')[1],
                            workUnitId: value?.unit.split(',')[0],
                            linkName: value?.link.split(',')[1],
                            linkId: value?.link.split(',')[0],
                        }
                        await RequestUtil.post(`/tower-quality/workAllocation`, submitData).then(res => {
                            message.success('添加成功！')
                            form.resetFields()
                            setVisible(false)
                            history.go(0)
                        });
                    }} >保存</Button>
                    {/* {<Button type='primary' onClick={onSubmit}>解锁</Button>} */}
                    <Button onClick={()=>{
                        setVisible(false)
                        edit==='编辑'&& setEdit(`添加`)
                        form.resetFields()
                    }}>关闭</Button>
                </Space>
            }
            onCancel={()=>{
                setVisible(false)
                edit==='编辑'&& setEdit(`添加`)
                form.resetFields()
            }}  width={ '80%' }
        >
                <Form form={form} {...formItemLayout}>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="unit" label="生产单元" labelCol={{span:4}} rules={[{
                                required:true,
                                message:'请选择生产单元'
                            }]}>
                                <Select placeholder="请选择">
                                    {productUnitData?.map((item: any) => {
                                        return <Select.Option key={item.id} value={item.id+','+item.name}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="link" label="生产环节" rules={[{
                                required:true,
                                message:'请选择生产环节'
                            }]}>
                                <Select style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    { prodLinkList && prodLinkList.map((item:any)=>{
                                        return <Select.Option key={item.userId} value={item.id+','+item.name}>{item.name}</Select.Option>
                                    }) }
                            </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {workmanship?.map((items: any, index: number) => {
                        return <Card>
                                <Row>
                                    <Col span={6}>
                                        <Form.Item name={["craftNameDTOS", index, "craftName"]} label='工艺' >
                                            <Input maxLength={2} placeholder="请输入"  />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.List name={["craftNameDTOS", index, "workProList"]}>
                                        {
                                            ( fields , { add, remove }) => fields.map(
                                                (field:any,index:number )=> (
                                                <>
                                                    <Col span={6}>
                                                        <Form.Item name={[field.name,'count']} label={`工序${index+1}`} >
                                                            <Input maxLength={2} placeholder="请输入"/>
                                                        </Form.Item>
                                                    </Col>
                                                    
                                                    <Col span={2}>
                                                            {index === fields.length-1&&<Button type='link' onClick={()=>{
                                                                add()
                                                            }} style={{padding:'0px'}}>添加 </Button>}
                                                            {fields.length>1 && <Button type='link' onClick={()=>{
                                                                remove(index)
                                                            }} style={{padding:'0px'}}> 删除</Button>}
                                                    </Col>
                                                </>
                                                )
                                            )
                                        }
                                    </Form.List> 
                                </Row>
                                <Space>
                                    {workmanship.length-1===index && <Button type='primary' onClick={()=>{
                                        const value = form.getFieldsValue(true).craftNameDTOS
                                        console.log(value)
                                        value.push({
                                            segmentName:'',
                                            workProList:[{}]
                                        })
                                        form.setFieldsValue({
                                            craftNameDTOS: [...value]
                                        })
                                        setWorkmanship([...value])
                                        console.log(workmanship)
                                    }}>添加工艺</Button>}
                                    {workmanship.length > 1 && <Button type='primary' ghost onClick={()=>{
                                        workmanship.splice(index,1)
                                        form.setFieldsValue({
                                            craftNameDTOS: [...workmanship]
                                        })
                                        setWorkmanship([...workmanship])
                                    }}>删除</Button>}
                                </Space>
                                
                        </Card>
                    })
                }
                </Form>
            </Modal>
        </>
    )
}