/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Modal, Button, Form, TreeSelect, Space, Input, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RequestUtil from "../../../utils/RequestUtil"
import './WarehouseModal.less';
import { warehouseOptions } from '../../../configuration/DictionaryOptions'
import { BaseInfo, DetailTitle, generateTreeNode, PopTable, CommonTable } from '../../common';
import { base, userColums } from "./warehouse.json"
import { useHistory } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
interface Props {
    isModal: boolean,
    cancelModal: Function,
    id: string | null,
}

const Edit = (props: Props) => {
    const [warehouseData, setWarehouseData] = useState<any[]>([])
    const [baseForm] = Form.useForm()
    const [staffsForm] = Form.useForm()
    const [editForm] = Form.useForm()
    const history = useHistory()

    const { loading, data } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/${props.id}`)
            setWarehouseData(result?.warehouseDetails.map((item: any) => ({ ...item, id: item.id || (Math.random() * 1000000).toFixed(0) })) || [])
            staffsForm.setFieldsValue({
                submit: result?.staffs.map((item: any) => ({
                    userId: {
                        id: item.userId,
                        value: item.userName
                    }
                }))
            })
            resole({
                ...result,
                person: {
                    id: result.person?.userId,
                    value: result?.personName
                }
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: !props.id })

    const { loading: saveLoading, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[props.id ? "put" : "post"](`/tower-storage/warehouse`, props.id ? ({ ...params, id: props.id }) : params)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { data: deptData } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-system/department`)
            resole(generateTreeNode(result))
        } catch (error) {
            reject(error)
        }
    }))

    const changeInputList = (ev: React.ChangeEvent<HTMLInputElement>, item: any, key: string, index: number) => {
        const newWarehouseData = [...warehouseData]
        newWarehouseData[index][key] = ev.target.value;
        setWarehouseData(newWarehouseData)
    }

    const submit = async () => {
        const baseData: any = await baseForm.validateFields()
        const staffsData = await staffsForm.validateFields()
        const editData = await editForm.validateFields()
        try {
            await run({
                ...baseData,
                warehouseDetails: warehouseData,
                staffs: staffsData.submit?.map((item: any) => ({
                    userId: item.userId?.id
                })),
                person: {
                    userId: baseData.person?.id
                }
            })
            message.success("保存成功...")
            props.cancelModal()
            history.go(0)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Modal
                className='WarehouseModal'
                title={props.id ? "编辑" : "创建"}
                visible={props.isModal}
                onOk={() => {
                    submit()
                }}
                onCancel={() => {
                    props.cancelModal()
                }}
                okText='保存'
                cancelText='关闭'
            >
                <DetailTitle title="基本信息" />
                <BaseInfo col={2} form={baseForm} columns={base.map((item: any) => {
                    if (item.dataIndex === "warehouseCategoryId") {
                        return ({
                            ...item,
                            "enum": warehouseOptions?.map(item => ({
                                label: item.name,
                                value: item.id
                            }))
                        })
                    }
                    if (item.dataIndex === "shopId") {
                        return ({
                            ...item, render: (data: any, props: any) => <TreeSelect
                                placeholder="请选择车间"
                                treeData={deptData}
                                {...props}
                            />
                        })
                    }
                    return item
                })}
                    edit
                    dataSource={data || {}}
                />
                <DetailTitle title="保管员信息" />
                <div style={{ width: "70%" }}>
                    <Form form={staffsForm} name="dynamic_form_nest_item" autoComplete="off">
                        <Form.List name="submit">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'userId']}
                                                label="保管员"
                                                rules={[{ required: true, message: "请选择保管员..." }]}
                                            >
                                                <PopTable data={userColums as any} />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            添加一行
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </div>
                <DetailTitle title="库区库位信息" operation={[<Button key="new" type="primary" onClick={() => setWarehouseData([{
                    id: (Math.random() * 1000000).toFixed(0),
                    reservoirName: "",
                    locatorName: ""
                }, ...warehouseData])
                }>新增一行</Button>]} />
                <CommonTable haveIndex columns={[
                    {
                        title: "*库区",
                        dataIndex: 'reservoirName',
                        render: (text, item: any, index) => {
                            return (
                                <Input
                                    value={item.reservoirName}
                                    maxLength={50}
                                    onChange={(ev) => {
                                        changeInputList(ev, item, 'reservoirName', index)
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title: "*库位",
                        dataIndex: 'locatorName',
                        render: (text, item: any, index) => {
                            return (
                                <Input
                                    value={item.locatorName}
                                    maxLength={50}
                                    onChange={(ev) => {
                                        changeInputList(ev, item, 'locatorName', index)
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title: "操作",
                        dataIndex: "opration",
                        width: 50,
                        fixed: "right",
                        render: (_, records: any) => <Button type="link" onClick={() => {
                            setWarehouseData(warehouseData.filter(item => item.id !== records?.id))
                        }}>删除</Button>
                    }
                ]} dataSource={warehouseData} />
            </Modal>
        </div>
    )
}

export default Edit;