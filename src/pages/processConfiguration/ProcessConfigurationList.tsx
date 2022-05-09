import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, Form, Popconfirm, Modal, Row, Card } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../common'
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../utils/AuthUtil';
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
    const [workmanship, setWorkmanship] = useState<any[]>([{},{}]);
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data)
    }), {})
    const confirmLeader: any = data?.records || [];
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'contractName',
            title: '生产单元',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'plannedDeliveryTime',
            title: '工艺',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'confirmName',
            title: '工序',
            width: 200,
            dataIndex: 'confirmName'
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
                    }} disabled={AuthUtil.getUserId() !== record.confirmId}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-system/notice?ids=${record.id}`).then(res => {
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

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return (
        <>
        <Page
            path="/tower-science/drawProductDetail"
            columns={columns}
            filterValue={filterValue}
            exportPath="/tower-science/drawProductDetail"
            refresh={refresh}
            extraOperation={<Button type='primary' ghost onClick={()=>{
                setEdit('添加')
                setVisible(true)
            }}>新增</Button>}
            // extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'status',
                    label: '车间',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'status',
                    label: '工艺',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
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
                    <Button type='primary' ghost onClick={()=>{
                        
                    }} >保存</Button>
                    <Button type='primary' ghost onClick={()=>{

                    }}>添加工艺</Button>
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
                      <Form.Item name="pattern" label="生产环节">
                            <Select style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                              { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                  return <Select.Option key={ index } value={ id }>
                                      { name }
                                  </Select.Option>
                              }) }
                          </Select>
                        </Form.Item>
                        {
                    workmanship?.map((items: any, index: number) => {
                        return <Card>
                                <Form.Item name={["productSegmentListDTOList", index, "segmentName"]} label='工艺'>
                                    <Input maxLength={2} placeholder="请输入"  />
                                </Form.Item>
                                <Form.Item name={["productSegmentListDTOList", index, "count"]} label={`工序${index+1}`} initialValue={items.count} rules={[{
                                    required: true,
                                    message: '请输入段数 '
                                }, {
                                    pattern: /^[0-9]*$/,
                                    message: '仅可输入数字',
                                }]}>
                                    <Input maxLength={2} placeholder="请输入"  />
                                </Form.Item>
                                <Button onClick={()=>{
                                    workmanship.push({
                                        productSegmentListDTOList:''
                                    })
                                    console.log(workmanship)
                                }}>添加</Button>
                        </Card>
                    })
                }
                </Form>
            </Modal>
        </>
    )
}