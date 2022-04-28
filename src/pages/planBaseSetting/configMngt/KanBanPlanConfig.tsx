import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Form, Button, Popconfirm, message, Modal } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { DetailTitle, Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';

export default function KanbanPlanConfig(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [visible,setVisible] = useState<boolean>(false)
    const [refresh,setRefresh] = useState<boolean>(false)
    const [title,setTitle] = useState<string>('新增');
    const [selectedValue,setSelectedValue] = useState<any>({});
    const [prodLinkList, setProdLinkList] = useState<any[]>([])
    const location = useLocation<{ state?: number }>();
    const [form] = Form.useForm();
    const { loading, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/productionLink?current=1&size=10000`)
        setProdLinkList(data?.records)
        resole(data)
    }), {})
    const columns = [
        {
            key: 'productType',
            title: '产品类型',
            // width: 100,
            dataIndex: 'productType'
        },
        {
            key: 'productionLinks',
            title: '生产环节',
            // width: 400,
            dataIndex: 'productionLinks'
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
                            // recor
                            productType:record?.productTypeId+','+record?.productType,
                            productionLinkIds: record?.productionLinkIds.split(',')
                        })
                        setVisible(true)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-aps/workshop/config/planBoard/${record.productTypeId}`)
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
            <Modal visible={ visible } title={DetailTitle} okText="确认" onOk={ async ()=>{
                await form.validateFields()
                const value = form.getFieldsValue(true)
                if(title==='新增'){
                    const submitData={
                        productionLinkIds: value?.productionLinkIds.join(','),
                        productTypeId:value?.productType.split(',')[0],
                        productType:value?.productType.split(',')[1]
                    }
                    await RequestUtil.post(`/tower-aps/workshop/config/planBoard`,submitData).then(()=>{
                        message.success('添加成功！')
                    })
                }else{
                    const submitData = {
                        ...value,
                        productionLinkIds: value?.productionLinkIds.join(','),
                        productTypeId:value?.productType.split(',')[0],
                        productType:value?.productType.split(',')[1],
                        id: selectedValue.productTypeId
                    }
                    await RequestUtil.post(`/tower-aps/workshop/config/planBoard`,submitData).then(()=>{
                        message.success('编辑成功！')
                    })
                }
                form.resetFields()
                setVisible(false)
                setRefresh(!refresh)
            } } onCancel={ ()=>{
                form.resetFields()
                setVisible(false)
                setTitle('新增')
            } }>
                <Form form={ form } { ...formItemLayout }>
                    <Form.Item name="productType" label="产品类型" rules={[
                        {
                            required:true,
                            message:"请选择产品类型"
                        }
                    ]}>
                        <Select style={{width:'100%'}}>
                            { productTypeOptions && productTypeOptions.map((item:any)=>{
                                    return <Select.Option key={item.id} value={item.id+','+item.name}>{item.name}</Select.Option>
                                }) }
                        </Select>
                    </Form.Item>
                    <Form.Item name="productionLinkIds" label="生产环节" rules={[{required:true,message:"请选择生产环节"}]}>
                        <Select style={{width:'100%'}} mode='multiple'>
                            { prodLinkList && prodLinkList.map((item:any)=>{
                                return <Select.Option key={item.userId} value={item.id}>{item.name}</Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Page
                path="/tower-aps/workshop/config/planBoard"
                columns={columns}
                // exportPath="/tower-science/loftingTask"
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                refresh={refresh}
                tableProps={{pagination:false}}
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