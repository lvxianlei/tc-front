/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-明细变更申请-申请
 */

 import React, { useImperativeHandle, forwardRef, useState } from "react";
 import { Button, Descriptions, Form, Input, Select, Modal } from 'antd';
 import { BaseInfo, CommonTable, DetailContent, OperationRecord } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './IsTrialDress.module.less';
import SelectByTaskNum from "./SelectByTaskNum";
import { FixedType } from 'rc-table/lib/interface';
import { productTypeOptions, voltageGradeOptions } from "../../../configuration/DictionaryOptions";
 
 interface modalProps {
     readonly id?: any;
     readonly type?: 'new' | 'detail';
 }
 
 export default forwardRef(function RequestForChange({ id, type }: modalProps, ref) {
     const [form] = Form.useForm();
     const [changeForm] = Form.useForm();
     const [selectedForm] = Form.useForm();
     const [changeData, setChangeData] = useState<any>([]);
     const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
     const [selectedRows, setSelectedRows] = useState<any[]>([]);
     const [selectedData, setSelectedData] = useState([]);
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             const result: any = await RequestUtil.get(`/tower-science/trialAssembly/getDetails?id=${id}`)
             resole(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: type === 'new', refreshDeps: [id, type] })

     const applyColumns = [
        {
            key: 'taskNum',
            title: '确认任务编号',
            width: 50,
            dataIndex: 'taskNum'
        },
        {
            key: 'partNum',
            title: '营销任务编号',
            width: 80,
            dataIndex: 'partNum'
        },
        {
            key: 'mistakenPartNum',
            title: '内部合同编号',
            width: 80,
            dataIndex: 'mistakenPartNum'
        },
        {
            key: 'loftingUserName',
            title: '工程名称',
            width: 80,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'loftingPrice',
            title: '变更说明',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPunishmentAmount',
            title: '计划号',
            width: 80,
            dataIndex: 'loftingPunishmentAmount'
        },
        {
            key: 'leaderPunishmentAmount',
            title: '合同名称',
            width: 80,
            dataIndex: 'leaderPunishmentAmount'
        },
        {
            key: 'loftingPerformanceAmount',
            title: '业务员',
            width: 80,
            dataIndex: 'loftingPerformanceAmount'
        },
        {
            key: 'checkUserName',
            title: '备注',
            width: 80,
            dataIndex: 'checkUserName'
        },
        {
            key: 'checkPrice',
            title: '备注（修改后）',
            width: 80,
            dataIndex: 'checkPrice'
        }
    ]

    const changeColumns = [
        {
            key: 'taskNum',
            title: '杆塔号',
            width: 50,
            dataIndex: 'taskNum'
        },
        {
            key: 'partNum',
            title: '产品类型',
            width: 80,
            dataIndex: 'partNum'
        },
        {
            key: 'mistakenPartNum',
            title: '电压等级（kv）',
            width: 80,
            dataIndex: 'mistakenPartNum'
        },
        {
            key: 'loftingUserName',
            title: '塔型',
            width: 80,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'loftingPrice',
            title: '塔型钢印号',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Button type='link' onClick={() => {

                    }}>修改</Button>
            )
        }
    ]

    const selectedColumns = [
        {
            key: 'taskNum',
            title: '变更类型',
            width: 50,
            dataIndex: 'taskNum'
        },
        {
            key: 'partNum',
            title: '杆塔号（修改前）',
            width: 80,
            dataIndex: 'partNum'
        },
        {
            key: 'mistakenPartNum',
            title: '杆塔号（修改后）',
            width: 80,
            dataIndex: 'mistakenPartNum'
        },
        {
            key: 'loftingUserName',
            title: '塔型名（修改前）',
            width: 80,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'loftingPrice',
            title: '塔型名（修改后）',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPrice',
            title: '塔型钢印号（修改前）',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPrice',
            title: '塔型钢印号（修改后）',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPrice',
            title: '电压等级（修改前）',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPrice',
            title: '电压等级（修改后）',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPrice',
            title: '产品名称（修改前）',
            width: 80,
            dataIndex: 'loftingPrice'
        },
        {
            key: 'loftingPrice',
            title: '产品名称（修改后）',
            width: 80,
            dataIndex: 'loftingPrice'
        },{
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                    <Button type='link' onClick={() => {
                        const value  = selectedForm?.getFieldsValue(true)?.data;
                        value?.splice(index, 1)
                        console.log(value)
                        setSelectedData(value)
                    }}>移除</Button>
            )
        }
    ]
    
    const SelectedChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const bulkChanges = () => {
        console.log(selectedRows)
        Modal.confirm({
            title: "添加修改",
            icon: null,
            content: <Form form={changeForm} layout="inline">
                <Form.Item
                    label='塔型名'
                    name="packageFirst"
                >
                    <Input maxLength={100}/>
                </Form.Item>
                <Form.Item
                    label='塔型钢印号'
                    name='packageFirstStartTime'
                >
                    <Input maxLength={100}/>
                </Form.Item>
                <Form.Item
                    label='电压等级kV'
                    name="packageSecond"
                >
                    <Select style={{width:'100%'}} allowClear>
                    {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label='产品类型'
                    name='packageSecondStartTime'
                >
                    <Select style={{ width: '100%' }} allowClear>
                {
                    productTypeOptions?.map((item: any, index: number) =>
                        <Select.Option value={item.id} key={index}>
                            {item.name}
                        </Select.Option>
                    )
                }
            </Select>
                </Form.Item>
                <Form.Item
                    label='变更类型'
                    name='packageCompleteTime'
                >
                    <Select style={{ width: '100%' }} allowClear>
                        <Select.Option value={'设计变更'} key={0}>设计变更</Select.Option>
                        <Select.Option value={'需求变更'} key={0}>需求变更</Select.Option>
                        <Select.Option value={'输入变更'} key={0}>输入变更</Select.Option>
                        <Select.Option value={'其他'} key={0}>其他</Select.Option>
            </Select>
                </Form.Item>
                
            </Form>,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    const value = await changeForm.validateFields()
                    console.log(value)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                changeForm.resetFields()
            }
        })
    }

    const removeAll = () => {
        setSelectedData([])
    }
 
     const onSave = () => new Promise(async (resolve, reject) => {
         try {
             const value = await form.validateFields();
             console.log(value)
             await saveRun({
                 ...value
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             const result: any = await RequestUtil.post(`/tower-science/trialAssembly/save`, data)
             resove(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const onSubmit = () => new Promise(async (resolve, reject) => {
         try {
             const value = await form.validateFields();
             await submitRun({
                 ...value
             })
             resolve(true);
         } catch (error) {
             reject(false)
         }
     })
 
     const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
         try {
             const result: any = await RequestUtil.post(`/tower-science/trialAssembly/saveAndLaunch`, data)
             resove(result)
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
 
     const resetFields = () => {
         form.resetFields();
         changeForm.resetFields();
         selectedForm.resetFields();
     }
 
     useImperativeHandle(ref, () => ({ onSubmit, onSave, resetFields }), [ref, onSubmit, onSave, resetFields]);
 
     return <DetailContent>
        <Form form={form}>

                 <BaseInfo dataSource={data || {}} columns={...applyColumns?.map(res => {
                    if (res.dataIndex === "taskNum") {
                        return ({
                            ...res,
                            render: (_: string, record: Record<string,any>, index: number) => (
                                <Form.Item name={"taskNum"}>
                                    
                <SelectByTaskNum onSelect={(selectedRows: Record<string, any>) => {
                    console.log(selectedRows[0])
                    setChangeData([])
                    form?.setFieldsValue({
                        taskNumId: selectedRows[0]?.id,
                        taskNum: selectedRows[0]?.taskNum
                    })
                }} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "") { //变更说明
                        return ({
                            ...res,
                            render: (_: string, record: Record<string,any>, index: number) => (
                                <Form.Item name={""}>        
                <Input.TextArea maxLength={800}/>
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "") {//备注（修改后）
                        return ({
                            ...res,
                            render: (_: string, record: Record<string,any>, index: number) => (
                                <Form.Item name={""}>        
                <Input.TextArea maxLength={800}/>
                                </Form.Item>
                            )
                        })
                    }
                    return res
                 })} col={3} />
         
        </Form>
        <Button type="primary" onClick={bulkChanges} ghost>批量修改</Button>
        <CommonTable 
        columns={changeColumns} 
        dataSource={changeData} 
        rowSelection={{
            selectedRowKeys: selectedKeys,
            type: "checkbox",
            onChange: SelectedChange,
        }}
        />
        <Button type="primary" onClick={removeAll} ghost>移除全部</Button>
        <Form form={selectedForm}>
        <CommonTable 
        columns={selectedColumns.map(res => {
            if (res.dataIndex === "") {
                return ({
                    ...res,
                    render: (_: string, record: Record<string,any>, index: number) => (
                        <Form.Item name={['data', index, '']}>
                            <Input maxLength={100}/>
                        </Form.Item>
                    )
                })
            }
            if (res.dataIndex === "") {
                return ({
                    ...res,
                    render: (_: string, record: Record<string,any>, index: number) => (
                        <Form.Item name={['data', index, '']}>
                            <Input maxLength={100}/>
                        </Form.Item>
                    )
                })
            }
            if (res.dataIndex === "") {
                return ({
                    ...res,
                    render: (_: string, record: Record<string,any>, index: number) => (
                        <Form.Item name={['data', index, '']}>
                            <Input maxLength={100}/>
                        </Form.Item>
                    )
                })
            }
            if (res.dataIndex === "") {
                return ({
                    ...res,
                    render: (_: string, record: Record<string,any>, index: number) => (
                        <Form.Item name={['data', index, '']}>
                        <Select style={{width:'100%'}} allowClear>
                        {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                        </Form.Item>
                    )
                })
            }
            if (res.dataIndex === "") {
                return ({
                    ...res,
                    render: (_: string, record: Record<string,any>, index: number) => (
                        <Form.Item name={['data', index, '']}>
                        <Select style={{ width: '100%' }} allowClear>
                    {
                        productTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
                </Select>
                        </Form.Item>
                    )
                })
            }

            return res
        })} 
        dataSource={selectedData}
        />

        </Form>
     </DetailContent>
 })
 
 