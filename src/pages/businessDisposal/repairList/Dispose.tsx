/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-返修单-处理
 */

import useRequest from "@ahooksjs/use-request";
import { Button, Form, InputNumber, Select, Space, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { componentTypeOptions } from "../../../configuration/DictionaryOptions";
import RequestUtil from "../../../utils/RequestUtil";
import { Attachment, BaseInfo, CommonTable, DetailContent, DetailTitle, IntgSelect } from "../../common";
import { baseColumns, detailColumns } from "./repairList.json"

export default function Dispose(): React.ReactNode {
    const [repairTypes, setRepairTypes] = useState<any>([]);
    const history = useHistory();
    const [form] = useForm();

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(``);
        resole(data?.records);
    }), {})

    const { data: user } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})

    const save = () => new Promise(async (resolve, reject) => {
        try {
            const data = await form.getFieldsValue(true);
            console.log(data)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    return <Spin spinning={false}>
        <DetailContent operation={[
            <Space size="small">
                <Button type="primary" onClick={save} ghost>保存</Button>
            <Button onClick={() => {
                history.push(`/businessDisposal/repairList`);
            }}>关闭</Button>
            </Space>
        ]}>
            <Form form={form}>
            <DetailTitle title="基础信息" />
            <BaseInfo dataSource={{}} layout="vertical" col={10} columns={baseColumns.map(res => {
                if (res.dataIndex === "") {
                    return ({
                        ...res,
                        render: (): React.ReactNode => (
                            <Form.Item name="" rules={[{
                                required: true,
                                message: "请选择状态"
                            }]}>
                                <Select placeholder="请选择状态">
                                    <Select.Option value={1} key="1">待处理</Select.Option>
                                    <Select.Option value={2} key="2">已处理</Select.Option>
                                </Select>
                            </Form.Item>
                        )
                    })
                }
                return res
            })} />
            <DetailTitle title="返修信息" />
            <CommonTable columns={detailColumns.map(res => {
                if (res.dataIndex === "") {
                    // 单段返修数量
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请输入返修信息"
                            }]}>
                                <InputNumber max={9999} min={1} onChange={(e: number) => {
                                    console.log(e)
                                    const list = form.getFieldsValue(true).list;
                                    list[index] = {
                                        ...list[index],

                                    }
                                }}/>
                            </Form.Item>
                        )
                    })
                }
                if (res.dataIndex === "") {
                    // 单基段数
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请输入单基段数"
                            }]}>
                                <InputNumber max={9999} min={1} />
                            </Form.Item>
                        )
                    })
                }
                if (res.dataIndex === "") {
                    // 基数
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请输入基数"
                            }]}>
                                <InputNumber max={9999} min={1} />
                            </Form.Item>
                        )
                    })
                }
                if (res.dataIndex === "") {
                    // 零件类型
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请选择零件类型"
                            }]}>
                                <Select placeholder="请选择" size="small">
                                    {
                                        componentTypeOptions?.map((item: any, index: number) =>
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
                if (res.dataIndex === "") {
                    // 返修类型
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请选择返修类型"
                            }]}>
                                <Select placeholder="请选择返修类型" size="small">
                                    {
                                        repairTypes?.map((item: any, index: number) =>
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
                if (res.dataIndex === "") {
                    // 返修车间
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请选择返修车间"
                            }]}>
                                <Select placeholder="请选择返修车间" size="small">
                                    {
                                        repairTypes?.map((item: any, index: number) =>
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
                if (res.dataIndex === "") {
                    // 返修工序
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, ""]} rules={[{
                                required: true,
                                message: "请选择返修工序"
                            }]}>
                                <Select placeholder="请选择返修工序" size="small">
                                    {
                                        repairTypes?.map((item: any, index: number) =>
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
                if (res.dataIndex === "A") {
                    // 责任人
                    return ({
                        ...res,
                        render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name={["list", index, "a"]} rules={[{
                                required: true,
                                message: "请选择责任人"
                            }]}>
                                <IntgSelect width={"100%"} />
                            </Form.Item>
                        )
                    })
                }
                return res
            })} dataSource={[{
                id: 4,
                a: '444'
            }]} />
            </Form>
            <Attachment dataSource={[]} />
        </DetailContent>
    </Spin>
}