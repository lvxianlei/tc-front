import React, { useState } from "react";
import { Button, Form, Space, Spin, Modal, Input, message, DatePicker, Select, Popconfirm } from 'antd';
import { BaseInfo, CommonAliTable, DetailContent } from '../../common';
import { ILink, IPlanSchedule, IUnit } from './IPlanSchedule';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
import moment from "moment";
import zhCN from 'antd/es/date-picker/locale/zh_CN';
export interface DistributedTechRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function DistributedTech(): React.ReactNode {
    const [form] = Form.useForm();
    const [completeTimeForm] = Form.useForm();
    const [modalForm] = Form.useForm();
    const [linkList, setLinkList] = useState<ILink[]>([])
    const history = useHistory();
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<IPlanSchedule[]>([])
    const params = useParams<{ ids: string }>()

    const unitChange = async (value: string) => {
        const result: ILink[] = await RequestUtil.get(`/tower-aps/productionLink/link/${value}`);
        setLinkList(result || [])
    }
    
    const { loading, data } = useRequest<IUnit[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: IUnit[] = await RequestUtil.get(`/tower-aps/productionUnit/list`);
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/issue`, [...params.ids.split(',')]);
            setDataSource(data.map((item: IPlanSchedule, index: number) => {
                return {
                    ...item,
                    index: index
                }
            }))
            if (result.length === 1) {
                form.setFieldsValue({ unitId: result[0].id })
                unitChange(result[0].id);
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: time, run } = useRequest<any>((params: any[]) => new Promise(async (resole, reject) => {
        try {
            const result: IUnit[] = await RequestUtil.post(`/tower-aps/productionPlan/lofting/complete/time`, params);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const baseColumns = [
        {
            "title": "生产单元",
            "dataIndex": "unitId",
            "type": "select",
            enum: data?.map(item => ({ label: item.name, value: item.id })),
            "rules": [
                {
                    "required": true,
                    "message": "请选择生产单元"
                }
            ]
        },
        {
            "title": "生产环节",
            "dataIndex": "linkId",
            "type": "select",
            enum: linkList?.map(item => ({ label: item.name, value: item.id })),
            "rules": [
                {
                    "required": true,
                    "message": "请选择生产环节"
                }
            ]
        }
    ]

    const tableColumns = [
        {
            title: '计划号',
            dataIndex: 'planNumber',
            width: 150
        },
        {
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 150
        },
        {
            title: '基数',
            dataIndex: 'productNum',
            width: 120
        },
        {
            title: '放样计划完成日期',
            dataIndex: 'loftingCompleteTime',
            type: "date",
            format: "YYYY-MM-DD"
        },
        {
            title: '技术派工备注',
            dataIndex: 'issueDescription'
        },
        {
            title: "操作",
            dataIndex: "operation",
            fixed: "right",
            render: (_:any,record: any,index:number) =>
                <Popconfirm
                    title="是否确认删除？"
                    onConfirm={async () => {
                        dataSource.splice(index,1)
                        setDataSource([...dataSource])
                        message.success("删除成功！")
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="link" >删除</Button>
                </Popconfirm>
        }
        
    ]

    const SelectChange = (selectedRowKeys: number[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    const modalOk = () => new Promise(async (resolve, reject) => {
        try {
            const data = await modalForm.validateFields();
            let list: IPlanSchedule[] = []
            list = dataSource.map((item: IPlanSchedule) => {
                if (selectedRows.findIndex((items: any) => items.id === item.id) !== -1) {
                    return {
                        ...item,
                        issueDescription: data.issueDescription
                    }
                } else {
                    return item
                }
            })
            await RequestUtil.post(`/tower-aps/productionPlan/batch/issue/remark`, list.map((res: IPlanSchedule, index: number) => {
                return {
                    id: res.id,
                    issueDescription: res.issueDescription,
                    sort: index
                }
            })).then(async res => {
                setSelectedKeys([]);
                setSelectedRows([]);
                setVisible(false);
                await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/issue`, [...params.ids.split(',')]);
            });
            resolve(true)
            modalForm.resetFields();
            await message.success('批量新增备注成功');
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })

    const issue = async () => {
        const data = await form.validateFields();
        if(dataSource.length>0){
            RequestUtil.post(`/tower-aps/planUnitLink/lofting/issue?unitId=${data?.unitId}&ids=${dataSource.map((item: IPlanSchedule) => { return item.id }).join(',')}&linkId=${data?.linkId}`).then(res => {
                message.success('下发成功');
                history.goBack();
            });
        }else{
            message.error(`当前无数据，不可技术派工！`)
        }
        
    }

    const completeTime = () => {
        Modal.confirm({
            title: "设置放样计划完成日期",
            icon: null,
            content: <Form form={completeTimeForm} style={{ marginTop: 16 }}>
                <Form.Item name="loftingCompleteTime" label="放样计划完成日期" rules={[{ required: true, message: "请选择放样计划完成日期" }]}>
                    <DatePicker
                        style={{ width: "100%" }}
                        locale={zhCN}
                        placeholder="放样计划完成日期"
                        format="YYYY-MM-DD"
                        disabledDate={current => current && current < moment().startOf('day')}
                    />
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resolve, reject) => {
                try {
                    const loftingCompleteTime = await completeTimeForm.validateFields()
                    await run(selectedKeys.map((item: any) => ({
                        id: item,
                        loftingCompleteTime: loftingCompleteTime.loftingCompleteTime.format("YYYY-MM-DD") + " 00:00:00"
                    })))
                    resolve(true)
                    setSelectedRows([])
                    completeTimeForm.resetFields()
                    await message.success("成功设置计划完成日期")
                    history.go(0)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                completeTimeForm.resetFields()
            }
        })
    }

    const techDescription = () => {
        Modal.confirm({
            title: "技术派工备注",
            icon: null,
            content: <Form form={modalForm} style={{ marginTop: 16 }}>
                <Form.Item label="技术派工备注" name="issueDescription" rules={[{
                    required: true,
                    message: '请输入技术派工备注'
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input.TextArea maxLength={100} />
                </Form.Item>
            </Form>,
            onOk: modalOk,
            onCancel: () => modalForm.resetFields()
        })
    }

    return (<Spin spinning={loading}>
        <DetailContent operation={[
            <Button style={{ marginRight: 16 }} type="primary" key="tech" onClick={issue}>技术派工</Button>,
            <Button key="close" onClick={() => history.goBack()}>关闭</Button>
        ]}>
            <BaseInfo form={form} columns={baseColumns.map((item: any) => {
                if (item.dataIndex === "unitId") {
                    return ({
                        ...item,
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="unitId" style={{ width: '100%' }}>
                                <Select getPopupContainer={triggerNode => triggerNode.parentNode} onChange={(e: string) => unitChange(e)} style={{ width: "70%" }}>
                                    {data && data.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>)
                    })
                }
                return item
            })} col={4} dataSource={{}} edit />
            <Space size={16} style={{ marginBottom: '6px' }}>
                <Button
                    type="primary"
                    disabled={selectedKeys.length <= 0}
                    onClick={completeTime} >设置计划完成日期</Button>
                <Button
                    type="primary"
                    disabled={selectedKeys.length <= 0}
                    onClick={techDescription} >技术派工备注</Button>
            </Space>
            <CommonAliTable
                dataSource={[...dataSource]}
                pagination={false}
                columns={tableColumns as any}
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }}
            />
        </DetailContent>
    </Spin>
    )
}