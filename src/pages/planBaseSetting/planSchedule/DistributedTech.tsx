import React, { useState } from "react";
import { Button, Form, Space, Spin, Modal, Input, message, DatePicker } from 'antd';
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
            message.success("成功设置计划完成日期")
            setDataSource(dataSource.map((item: any) => ({
                ...item,
                loftingCompleteTime: params.find(fitem => fitem.id === item.id)?.loftingCompleteTime || item.loftingCompleteTime
            })))
            setSelectedRows([])
            completeTimeForm.resetFields()
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
            title: '下发技术备注',
            dataIndex: 'issueDescription'
        }
    ]

    const unitChange = async (value: string) => {
        const result: ILink[] = await RequestUtil.get(`/tower-aps/productionLink/link/${value}`);
        setLinkList(result || [])
    }


    const SelectChange = (selectedRowKeys: number[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    const modalOk = async () => {
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
        return RequestUtil.post(`/tower-aps/productionPlan/batch/issue/remark`, list.map((res: IPlanSchedule, index: number) => {
            return {
                id: res.id,
                issueDescription: res.issueDescription,
                sort: index
            }
        })).then(async res => {
            await message.success('批量新增备注成功');
            setSelectedKeys([]);
            setSelectedRows([]);
            setVisible(false);
            await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/issue`, [...params.ids.split(',')]);
            modalForm.resetFields();
            history.go(0)
        });
    }

    const issue = async () => {
        const data = await form.validateFields();
        RequestUtil.post(`/tower-aps/planUnitLink/lofting/issue?unitId=${data?.unitId}&ids=${dataSource.map((item: IPlanSchedule) => { return item.id }).join(',')}&linkId=${data?.linkId}`).then(res => {
            message.success('下发成功');
            history.goBack();
        });
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
            onOk: async () => {
                const loftingCompleteTime = await completeTimeForm.validateFields()
                return run(selectedKeys.map((item: any) => ({
                    id: item,
                    loftingCompleteTime: loftingCompleteTime.loftingCompleteTime.format("YYYY-MM-DD") + " 00:00:00"
                })))
            },
            onCancel() {
                completeTimeForm.resetFields()
            }
        })
    }

    const techDescription = () => {
        Modal.confirm({
            title: "下发技术备注",
            icon: null,
            content: <Form form={modalForm} style={{ marginTop: 16 }}>
                <Form.Item label="下发技术备注" name="issueDescription" rules={[{
                    required: true,
                    message: '请输入下发技术备注'
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
            <Button style={{ marginRight: 16 }} type="primary" key="tech" onClick={issue}>下发技术</Button>,
            <Button key="close" onClick={() => history.goBack()}>关闭</Button>
        ]}>
            <BaseInfo form={form} columns={baseColumns} col={4} dataSource={{}} edit />
            <Space size={16} style={{ marginBottom: '6px' }}>
                <Button
                    type="primary"
                    disabled={selectedKeys.length <= 0}
                    onClick={completeTime} >设置计划完成日期</Button>
                <Button
                    type="primary"
                    disabled={selectedKeys.length <= 0}
                    onClick={techDescription} >下发技术备注</Button>
            </Space>
            <CommonAliTable
                dataSource={dataSource}
                pagination={false}
                columns={tableColumns}
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