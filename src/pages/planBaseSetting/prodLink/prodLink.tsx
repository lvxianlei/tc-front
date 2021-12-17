/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, } from 'react'
import { Button, TableColumnProps, Input, Modal, message, Popconfirm, Form, Row, Col, Select, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
const ProdLink = (): React.ReactNode => {
    const columns: TableColumnProps<object>[] = [
        {
            title: '生产环节名称',
            dataIndex: 'name',
        },
        {
            title: '类型',
            dataIndex: 'typeName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text, item: any, index) => {
                return (
                    <div className='operation'>
                        <span
                            style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer', }}
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                                setName(item.name)
                                form.setFieldsValue({
                                    name:item.name,
                                    type:item.type
                                })
                            }}
                        >编辑</span>
                        <Popconfirm
                            title='确定删除吗？'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText='是'
                            cancelText='否'
                        >
                            <span style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer', }}>删除</span>
                        </Popconfirm>
                    </div>
                )
            }
        },
    ]
    let [isModal, setIsModal] = useState<boolean>(false)
    let [id, setId] = useState<string | null>(null)
    let [name, setName] = useState<string>('')
    const [filterValue, setFilterValue] = useState<any>({})
    const [refresh, setRefresh] = useState<boolean>(false)
    const [typeList, setTypeList] = useState<any>([])
    const [form] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        getTypeList();
        resole(data);
    }), {})

    /**
     * @description 获取类型
     */
    const getTypeList = async () => {
        const data: any = await RequestUtil.get('/tower-aps/productionLink/type')
        setTypeList(data)
        
    }
    /**
     * 
     * @param id 
     */
    const deleteItem = async (id: string) => {
        await RequestUtil.delete(`/tower-aps/productionLink/${id}`)
        message.success('操作成功')
        cancelModal(true)
    }
    /**
     * @description 弹窗提交
     */
    const submit = async () => {
        // if(!name){
        //     message.error('请输入生产环节名称')
        //     return
        // }
        await form.validateFields();
        const value = form.getFieldsValue(true)
        await RequestUtil.post('/tower-aps/productionLink', {
            name: value.name,
            type: value.type,
            id,
        })
        message.success('操作成功')
        cancelModal(true);
        form.resetFields()
    }
    /**
     * @description 关闭弹窗
     * @param refresh 是否刷新数据
     */
    const cancelModal = (isRefresh?: boolean) => {
        setId(null)
        setName('')
        setIsModal(false)
        form.resetFields()
        if (isRefresh) {
            setRefresh(!refresh)
        }
    }
    /**
     * 
     * @param value 
     * @returns 
     */
    const onFilterSubmit = (value: any) => {
        setFilterValue({ ...filterValue, ...value })
        return value
    }
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return (
        <div className='public_page'>
            <Page
                path="/tower-aps/productionLink"
                filterValue={filterValue}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                extraOperation={
                    <div>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => { setIsModal(true) }}
                            style={{ marginLeft: 10, }}
                        >添加</Button>
                    </div>
                }
                searchFormItems={[
                    {
                        name: 'name',
                        label: '查询',
                        children: <Input placeholder="生产环节名称" style={{ width: 300 }} />
                    },
                    {
                        name: 'type',
                        label: '类型',
                        children: <Select style={{width:150}}
                    >
                        <Select.Option
                            key={''}
                            value={''}
                        >全部</Select.Option>
                        {
                            typeList.map((item: any, index: number) => {
                                return (
                                    <Select.Option
                                        key={index}
                                        value={item.type}
                                    >{item.typeName}</Select.Option>
                                )
                            })
                        }
                    </Select>
                    }
                ]}
            />
            <Modal
                className='public_modal_input'
                title={id ? '编辑' : '新增'}
                visible={isModal}
                onOk={() => {
                    submit()
                }}
                onCancel={() => {
                    cancelModal()
                }}
                cancelText='取消'
                okText='确定'
            >
                <Form form={ form } {...formItemLayout}>
                    <Row>
                        <Col  span={24}>
                            <Form.Item label="生产环节名称" rules={[{required:true,message:'请填写生产环节名称'}]} name='name'>
                                <Input maxLength={12}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24}>
                            <Form.Item label="类型" rules={[{required:true,message:'请选择类型'}]} name='type'>
                                <Select
                                    placeholder='请选择'
                                    // mode='multiple'
                                    // maxTagCount={10}
                                >
                                    {
                                        typeList.map((item: any, index: number) => {
                                            return (
                                                <Select.Option
                                                    key={index}
                                                    value={item.type}
                                                >{item.typeName}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {/* <div className='edit-item'>
                    <span className='tip' style={{ width: 110, }}>生产环节名称*：</span>
                    <Input
                        className='input'
                        maxLength={24}
                        value={name}
                        onChange={(ev) => {
                            setName(ev.target.value.trim())
                        }}
                        placeholder='请输入'
                    />
                </div> */}
            </Modal>
        </div>
    )
}

export default ProdLink;