import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, Form, Popconfirm, Modal, InputNumber, message } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../common'
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../utils/AuthUtil';
import { patternTypeOptions } from '../../configuration/DictionaryOptions';
import TextArea from 'antd/lib/input/TextArea';

export default function UnqualifiedAmountList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const location = useLocation<{ state?: number, userId?: string }>();
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [lock, setLock] = useState<string>('锁定');
    const [edit, setEdit] = useState<string>('添加');
    const [editValue, setEditValue] = useState<any>({});
    const [ workPro, setWorkPro] = useState<any[]>([])
    const [form] = Form.useForm();
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-quality/projectAllocation`);
        const workPro: any = await RequestUtil.get(`/tower-quality/workAllocation/list`);
        setWorkPro(workPro)
        resole(data)
    }), {})
    const unProject: any = data?.records || [];
    const columns = [
        // {
        //     key: 'index',
        //     title: '序号',
        //     dataIndex: 'index',
        //     width: 50,
        //     render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        // },
        {
            key: 'unProject',
            title: '不合格项目',
            width: 200,
            dataIndex: 'unProject'
        },
        {
            key: 'workPro',
            title: '责任工序',
            width: 200,
            dataIndex: 'workPro'
        },
        {
            key: 'processType',
            title: '处理类型',
            width: 200,
            dataIndex: 'processType',
            render:(text:number)=>{
                switch (text) {
                    case 1:
                        return '返修';
                    case 2:
                        return '返镀';
                    case 3:
                        return '报废';
                    case 4:
                        return '退货';
                }
            }
        },
        {
            key: 'fineMoney',
            title: '罚款类别（元）',
            width: 200,
            dataIndex: 'fineMoney'
        },
        {
            key: 'description',
            title: '说明',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'createUserName',
            title: '制单人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'valid',
            title: '是否有效',
            width: 200,
            dataIndex: 'valid',
            render:(text:number)=>{
                return text===1?'是':text===2?'否':'-'
            }
        },
        {
            key: 'locking',
            title: '是否锁定',
            width: 200,
            dataIndex: 'locking',
            render:(text:number)=>{
                return text===1?'否':text===2?'是':'-'
            }
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
                        setLock('解锁')
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
                            });
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
    ];
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const onSubmit = async ()=> {
        await form.validateFields();
        const value = form.getFieldsValue(true)
        if(edit==='编辑'){
            RequestUtil.put(``,)
            message.success(`编辑成功！`)
            setVisible(false)
            form.resetFields()
            setRefresh(!refresh)
        }else{
            RequestUtil.put(``,)
            message.success(`新增成功！`)
            setVisible(false)
            form.resetFields()
            setRefresh(!refresh)
        }
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
                setLock('锁定')
                setVisible(true)
            }}>新增</Button>}
            searchFormItems={[
                {
                    name: 'workPro',
                    label: '责任工序',
                    children: <Form.Item name="workPro" >
                        <Select style={{ width: "100px" }}>
                            { workPro && workPro.map(({ id, workPro }, index) => {
                                  return <Select.Option key={ index } value={ workPro }>
                                      { workPro }
                                  </Select.Option>
                              }) }
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'unProject',
                    label: '不合格项目',
                    children: <Form.Item name="unProject" >
                        <Select style={{ width: "100px" }}>
                            { unProject && unProject.map(({ id, unProject }:any, index:number) => {
                                  return <Select.Option key={ index } value={ unProject }>
                                      { unProject }
                                  </Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                },
                
                {
                    name: 'processType',
                    label: '处理类型',
                    children: <Form.Item name="processType">
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>返修</Select.Option>
                            <Select.Option value={2} key={2}>返镀</Select.Option>
                            <Select.Option value={3} key={3}>报废</Select.Option>
                            <Select.Option value={4} key={4}>退货</Select.Option>
                        </Select>
                    </Form.Item>
                }
            ]}
        />
        <Modal 
            visible={visible} 
            title={edit} 
            footer={
                <Space>
                    <Button type='primary' ghost onClick={onSubmit} >保存</Button>
                    <Button type='primary' ghost onClick={async ()=>{
                        await form.validateFields();
                        const value = form.getFieldsValue(true)
                        if(edit==='添加'&& lock==='锁定'){
                            await RequestUtil.post(`/tower-quality/projectAllocation`,value)
                            message.success(`锁定成功！`)
                            setVisible(false)
                            form.resetFields()
                            // history.go(0)
                        }else{
                            setLock('解锁')
                        }
                        
                    }}>{lock}</Button>
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
            }}  width={ 800 }
        >
                <Form form={form} {...formItemLayout}>
                        <Form.Item name="workPro" label="责任工序" >
                            <Select style={{ width: '100%' }} disabled={lock==='解锁'}>
                              { workPro && workPro.map(({ id, workPro }, index) => {
                                  return <Select.Option key={ index } value={ id }>
                                      { workPro }
                                  </Select.Option>
                              }) }
                          </Select>
                        </Form.Item>
                        <Form.Item name="unProject" label="不合格项目" rules={[{
                            "required": true,
                            "message":"请输入不合格项目"
                        }]} >
                            <Input disabled={lock==='解锁'}/>
                        </Form.Item>
                        
                        <Form.Item name="processType" label="处理类型" rules={[{
                            "required": true,
                            "message":"请选择处理类型"
                        }]}>
                            <Select style={{ width: '100%' }} disabled={lock==='解锁'}>
                                <Select.Option value={1} key={1}>返修</Select.Option>
                                <Select.Option value={2} key={2}>返镀</Select.Option>
                                <Select.Option value={3} key={3}>报废</Select.Option>
                                <Select.Option value={4} key={4}>退货</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item name="fineMoney" label="罚款系数（元）">
                            <InputNumber min={0} precision={2} disabled={lock==='解锁'}/>
                        </Form.Item>
                        <Form.Item name="description" label="说明">
                            <TextArea rows={1} showCount maxLength={100} disabled={lock==='解锁'}/>
                        </Form.Item>
                        <Form.Item name="fineType" label="罚款类别" rules={[{
                            "required": true,
                            "message":"请选择罚款类别"
                        }]}>
                            <Select style={{ width: '100%' }} disabled={lock==='解锁'}>
                                <Select.Option value={1} key={1}>数量</Select.Option>
                                <Select.Option value={2} key={2}>重量</Select.Option>
                                <Select.Option value={3} key={3}>次数</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name=" " label="制单人">
                            <Input disabled placeholder='自动生成'/>
                        </Form.Item>
                        <Form.Item name="valid" label="是否有效" initialValue={1}>
                            <Select style={{ width: '100%' }}  disabled={lock==='解锁'}>
                                <Select.Option value={1} key={1}>是</Select.Option>
                                <Select.Option value={2} key={2}>否</Select.Option>
                            </Select>
                        </Form.Item>
                    {/* <BaseInfo columns={towerData} dataSource={detailData || {}} edit col={ 2 }/> */}
                </Form>
            </Modal>
        </>
    )
}