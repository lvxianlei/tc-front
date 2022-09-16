/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-返修单-处理
 */

import useRequest from "@ahooksjs/use-request";
import { Button, Form, Input, InputNumber, Select, Space, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { componentTypeOptions } from "../../../configuration/DictionaryOptions";
import RequestUtil from "../../../utils/RequestUtil";
import { Attachment, BaseInfo, CommonTable, DetailContent, DetailTitle } from "../../common";
import SelectUser from "../../common/SelectUser";
import { baseColumns, detailColumns } from "./repairList.json"
import styles from './RepairList.module.less';

export default function Dispose(): React.ReactNode {
    const [repairTypes, setRepairTypes] = useState<any>([]);
    const history = useHistory();
    const [form] = useForm();
    const params = useParams<{ id: string }>();

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get(``);
        form.setFieldsValue({
            supplyTypeName: 1,
            list: []
        })
        // resole(result?.records);
    }), {})
    
    const { data: partsTypes } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let resData: any[] = await RequestUtil.get(`/tower-science/config/fixItem`);
            resole(resData);
        } catch (error) {
            reject(error)
        }
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
        <DetailContent className={styles.dispose} operation={[
            <Space size="small">
                <Button type="primary" onClick={save} ghost>保存</Button>
            <Button onClick={() => {
                history.push(`/businessDisposal/repairList`);
            }}>关闭</Button>
            </Space>
        ]}>
            <DetailTitle title="基础信息" />
            <Form form={form}>
            <BaseInfo dataSource={{}} layout="vertical" col={10} columns={baseColumns.map(res => {
                if (res.dataIndex === "supplyTypeName") {
                    return ({
                        ...res,
                        render: (): React.ReactNode => (
                            <Form.Item name="supplyTypeName" rules={[{
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
                                <Select placeholder="请选择" size="small" onChange={(e) => {
                                    let data: any = []
                                    partsTypes.forEach((element: any) => {
                                        if(element.typeId === e) {
                                            data = element.fixItemConfigList
                                        }
                                    });
                                    setRepairTypes(data)
                                 }}>
                                    {
                                        partsTypes?.map((item: any, index: number) =>
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
                                <Select placeholder="请选择返修类型" size="small" onChange={(e) => {
                                    console.log(e)
                                    let data: any = {}
                                    repairTypes.forEach((element: any) => {
                                        if(element.typeId === e) {
                                            data = element
                                        }
                                    });
                                    console.log(data,'---189')
                                    let num = 0
                                    if(data.measuringUnit === '件数') {
                                        num = Number(data.maxAmount) - Number(data.amount) * Number()  > 0 ? Number(data.maxAmount) : Number(data.maxAmount) - Number(data.amount)
                                        // 处理数量
                                    } else if(data.measuringUnit === '件号数') {
                                        num = Number(data.maxAmount) - Number(data.amount) * Number(1)  > 0 ? Number(data.maxAmount) : Number(data.maxAmount) - Number(data.amount)
                                    } else {
                                        // 单件重量
                                        num = Number(data.maxAmount) - Number(data.amount) * Number()  > 0 ? Number(data.maxAmount) : Number(data.maxAmount) - Number(data.amount)
                                    }
                                }}>
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
                                <Input value={1} suffix={
                                <SelectUser  key={index} onSelect={(selectedRows: Record<string, any>) => {
                                    console.log(selectedRows)
                                    // const list = form.getFieldsValue(true).list;
                                    // list[index] = {
                                    //     ...list[index],
                                    //     a: selectedRows[0]?.userId
                                    // }
                                    // form.setFieldsValue({
                                    //     list: [...list]
                                    // })
                                }} />
                                }/>
                            </Form.Item>
                        )
                    })
                }
                return res
            })} dataSource={[]} />
            </Form>
            <Attachment dataSource={[]} isBatchDel={true} edit/>
        </DetailContent>
    </Spin>
}