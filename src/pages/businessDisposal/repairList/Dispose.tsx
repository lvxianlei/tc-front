/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-返修单-处理
 */

import useRequest from "@ahooksjs/use-request";
import { Button, Form, Input, InputNumber, message, Select, Space, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useRef, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import RequestUtil from "../../../utils/RequestUtil";
import { Attachment, AttachmentRef, BaseInfo, CommonTable, DetailContent, DetailTitle } from "../../common";
import SelectUser from "../../common/SelectUser";
import { baseColumns, detailColumns } from "./repairList.json"
import styles from './RepairList.module.less';

export default function Dispose(): React.ReactNode {
    const [repairTypes, setRepairTypes] = useState<any>([]);
    const history = useHistory();
    const [form] = useForm();
    const params = useParams<{ id: string }>();
    const attachRef = useRef<AttachmentRef>()

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get(`/tower-science/repair/getRepairDetails/${params.id}`);
        form.setFieldsValue({
            ...result,
            list: result?.repairStructureVOList || []
        })
        resole(result);
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
            console.log(attachRef.current?.getDataSource())
            console.log(data)
            RequestUtil.post(`/tower-science/repair/save`, {
                wasteProductReceiptId: data.wasteProductReceiptId
            }).then(res => {
                message.success('处理成功！')
            })
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
                    if (res.dataIndex === "status") {
                        return ({
                            ...res,
                            render: (): React.ReactNode => (
                                <Form.Item name="status" rules={[{
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
                    if (res.dataIndex === "basicsPartNum") {
                        // 单段返修数量
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "basicsPartNum"]} rules={[{
                                    required: true,
                                    message: "请输入单段返修数量"
                                }]}>
                                    <InputNumber max={9999} min={1} onChange={(e: number) => {
                                        console.log(e)
                                        const list = form.getFieldsValue(true).list;
                                        list[index] = {
                                            ...list[index],
                                            repairTotalNum: Number(e) * Number(list[index]?.segmentCount || 0) * Number(list[index]?.baseNum || 0)
                                        }
                                        let num = 0
                                        if (list[index].repairType) {
                                            let data: any = {}
                                            repairTypes.forEach((element: any) => {
                                                if (element.typeId === list[index].repairType) {
                                                    data = element
                                                }
                                            });
                                            console.log(data, '---189')
                                            if (data.measuringUnit === '件数') {
                                                num = Number(data.maxAmount) - Number(data.amount) * Number(e) < 0 ? Number(data.maxAmount) : Number(data.amount) * Number(e)
                                                // 处理数量
                                            } else if (data.measuringUnit === '件号数') {
                                                num = Number(data.maxAmount) - Number(data.amount) * Number(1) < 0 ? Number(data.maxAmount) : Number(data.amount) * Number(1)
                                            } else {
                                                // 单件重量
                                                num = Number(data.maxAmount) - Number(data.amount) * Number(e) * Number(list[index]?.basicsWeight || 0) < 0 ? Number(data.maxAmount) : Number(data.amount) * Number(e) * Number(list[index]?.basicsWeight || 0)
                                            }
                                        }
                                        list[index] = {
                                            ...list[index],
                                            actualPenaltyAmount: num,
                                            penaltyAmount: num
                                        }
                                        console.log(list)
                                    }} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "segmentCount") {
                        // 单基段数
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "segmentCount"]} rules={[{
                                    required: true,
                                    message: "请输入单基段数"
                                }]}>
                                    <InputNumber max={9999} min={1} onChange={(e: number) => {
                                        console.log(e)
                                        const list = form.getFieldsValue(true).list;
                                        list[index] = {
                                            ...list[index],
                                            repairTotalNum: Number(e) * Number(list[index]?.basicsPartNum || 0) * Number(list[index]?.baseNum || 0)
                                        }
                                        console.log(list)
                                    }} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "baseNum") {
                        // 基数
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "baseNum"]} rules={[{
                                    required: true,
                                    message: "请输入基数"
                                }]}>
                                    <InputNumber max={9999} min={1} onChange={(e: number) => {
                                        console.log(e)
                                        const list = form.getFieldsValue(true).list;
                                        list[index] = {
                                            ...list[index],
                                            repairTotalNum: Number(e) * Number(list[index]?.basicsPartNum || 0) * Number(list[index]?.segmentCount || 0)
                                        }
                                        console.log(list)
                                    }} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "typeDictName") {
                        // 零件类型
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "typeDictId"]} rules={[{
                                    required: true,
                                    message: "请选择零件类型"
                                }]}>
                                    <Select placeholder="请选择" size="small" onChange={(e) => {
                                        let data: any = []
                                        partsTypes.forEach((element: any) => {
                                            if (element.typeId === e) {
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
                    if (res.dataIndex === "repairTypeName") {
                        // 返修类型
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "repairType"]} rules={[{
                                    required: true,
                                    message: "请选择返修类型"
                                }]}>
                                    <Select placeholder="请选择返修类型" size="small" onChange={(e) => {
                                        console.log(e)
                                        const list = form.getFieldsValue(true).list;
                                        let data: any = {}
                                        repairTypes.forEach((element: any) => {
                                            if (element.typeId === e) {
                                                data = element
                                            }
                                        });
                                        console.log(data, '---189')
                                        let num = 0
                                        if (data.measuringUnit === '件数') {
                                            num = Number(data.maxAmount) - Number(data.amount) * Number(list[index]?.basicsPartNum) < 0 ? Number(data.maxAmount) : Number(data.amount) * Number(list[index]?.basicsPartNum)
                                            // 处理数量
                                        } else if (data.measuringUnit === '件号数') {
                                            num = Number(data.maxAmount) - Number(data.amount) * Number(1) < 0 ? Number(data.maxAmount) : Number(data.amount) * Number(1)
                                        } else {
                                            // 单件重量
                                            num = Number(data.maxAmount) - Number(data.amount) * Number(list[index]?.basicsPartNum) * Number(list[index]?.basicsWeight || 0) < 0 ? Number(data.maxAmount) : Number(data.amount) * Number(list[index]?.basicsPartNum) * Number(list[index]?.basicsWeight || 0)
                                        }
                                        list[index] = {
                                            ...list[index],
                                            actualPenaltyAmount: num,
                                            penaltyAmount: num
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
                    if (res.dataIndex === "repairLeaderName") {
                        // 责任人
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "repairLeader"]} rules={[{
                                    required: true,
                                    message: "请选择责任人"
                                }]}>
                                    <Input value={1} suffix={
                                        <SelectUser key={index} onSelect={(selectedRows: Record<string, any>) => {
                                            console.log(selectedRows)
                                            const list = form.getFieldsValue(true).list;
                                            list[index] = {
                                                ...list[index],
                                                repairLeader: selectedRows[0]?.userId
                                            }
                                            console.log([...list])
                                            form.setFieldsValue({
                                                list: [...list]
                                            })
                                        }} />
                                    } />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "actualPenaltyAmount") {
                        // 实际罚款金额
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "actualPenaltyAmount"]} rules={[{
                                    required: true,
                                    message: "请输入实际罚款金额"
                                }]}>
                                    <InputNumber max={99999.99} min={0} />
                                </Form.Item>
                            )
                        })
                    }
                    return res
                })} dataSource={data?.repairStructureVOList || []} />
            </Form>
            <Attachment dataSource={data?.fileVOList || []} ref={attachRef} isBatchDel={true} edit />
        </DetailContent>
    </Spin>
}