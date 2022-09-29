/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-不合格处置单-详情
 */

import useRequest from "@ahooksjs/use-request";
import { Button, Form, Input, InputNumber, message, Select, Space, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import RequestUtil from "../../../utils/RequestUtil";
import { BaseInfo, CommonTable, DetailContent, DetailTitle, OperationRecord } from "../../common";
import SelectUser from "../../common/SelectUser";
import { baseColumns, unqualifiedColumns } from "./unqualifiedDisposal.json"
import styles from './UnqualifiedDisposal.module.less';

export default function Dispose(): React.ReactNode {
    const [repairTypes, setRepairTypes] = useState<any>();
    const history = useHistory();
    const [form] = useForm();
    const params = useParams<{ id: string }>();
    const [wasteProductStructureList, setWasteProductStructureList] = useState<any>([]);
    const [partsTypes, setPartsTypes] = useState<any>();

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get(`/tower-science/wasteProductReceipt/${params.id}`);
        form.setFieldsValue({
            list: result?.wasteProductStructureList || [],
            description: result.description
        })
        setWasteProductStructureList(result?.wasteProductStructureList)
        let resData: any[] = await RequestUtil.get(`/tower-science/config/fixItem`);
        setPartsTypes(resData)
        let newData: any = {}
        result?.wasteProductStructureList?.forEach((res: any, index: number) => {
            let result: any = []
            resData?.forEach((element: any) => {
                if (element.typeId === res.typeId) {
                    result = element.fixItemConfigList
                }
            });
            newData = {
                ...newData,
                [index]: result
            }
        })
        setRepairTypes(newData)
        resole(result);
    }), {})

    const { data: processList } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/performance`);
        resole(data);
    }), {})

    const save = (status: number) => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(async (res: any) => {
                const data = await form.getFieldsValue(true);
                if (status === 0) {
                    if (data.description) {
                        RequestUtil.post(`/tower-science/wasteProductReceipt/examine`, {
                            id: params.id,
                            status: status,
                            description: data.description,
                            wasteProductStructureList: data.list
                        }).then(res => {
                            message.success('处理成功！');
                            history.push(`/businessDisposal/unqualifiedDisposal`)
                        })
                    } else {
                        message.warning('请填写信息！')
                    }
                } else {
                    RequestUtil.post(`/tower-science/wasteProductReceipt/examine`, {
                        id: params.id,
                        status: status,
                        description: data.description,
                        wasteProductStructureList: data.list
                    }).then(res => {
                        message.success('处理成功！');
                        history.push(`/businessDisposal/unqualifiedDisposal`)
                    })
                }
                resolve(true);
            })
        } catch (error) {
            reject(false)
        }
    })

    return <Spin spinning={false}>
        <DetailContent className={styles.unqualifiedDisposal} operation={[
            <Space size="small">
                {data?.status === 1 ?
                    <>
                        <Button type="primary" onClick={() => save(0)} ghost>拒绝</Button>
                        <Button type="primary" onClick={() => save(2)} ghost>提交并生成返修单</Button>
                    </>
                    : null}
                <Button onClick={() => {
                    history.push(`/businessDisposal/unqualifiedDisposal`);
                }}>关闭</Button>
            </Space>
        ]}>
            <DetailTitle title="基础信息" />
            <BaseInfo dataSource={data || {}} layout="vertical" col={10} columns={baseColumns} />
            <DetailTitle title="不合格信息" />
            <Form form={form}>
                <CommonTable columns={unqualifiedColumns.map(res => {
                    if (res.dataIndex === "disposeNum") {
                        // 处理数量
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "disposeNum"]} rules={[{
                                    required: true,
                                    message: "请输入处理数量"
                                }]}>
                                    <InputNumber disabled={data?.status !== 1} max={9999} min={1} onChange={(e: number) => {
                                        const list = form.getFieldsValue(true).list;
                                        list[index] = {
                                            ...list[index],
                                            disposeWeight: (Number(list[index].basicsWeight || 0) * Number(e)).toFixed(4)
                                        }
                                        form.setFieldsValue({
                                            list: [...list]
                                        })
                                        setWasteProductStructureList([...list])
                                    }} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "leaderId") {
                        // 责任人
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "leaderName"]} rules={[{
                                    required: true,
                                    message: "请选择责任人"
                                }]}>
                                    <Input size="small" disabled={data?.status !== 1} suffix={
                                        <SelectUser key={index} onSelect={(selectedRows: Record<string, any>) => {
                                            const list = form.getFieldsValue(true).list;
                                            list[index] = {
                                                ...list[index],
                                                leaderId: selectedRows[0]?.userId,
                                                leaderName: selectedRows[0]?.name,
                                                responsibleTeam: selectedRows[0]?.deptName
                                            }
                                            form.setFieldsValue({
                                                list: [...list]
                                            })
                                            setWasteProductStructureList([...list])
                                        }} />
                                    } />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "responsibleProcedure") {
                        // 责任工序
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "responsibleProcedure"]} rules={[{
                                    required: true,
                                    message: "请选择责任工序"
                                }]}>
                                    <Select disabled={data?.status !== 1} placeholder="请选择" size="small">
                                        {
                                            processList?.map((item: any, index: number) =>
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
                    if (res.dataIndex === "typeId") {
                        // 零件类型
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={["list", index, "typeId"]} rules={[{
                                    required: true,
                                    message: "请选择零件类型"
                                }]}>
                                    <Select placeholder="请选择" disabled={data?.status !== 1} size="small">
                                        {
                                            partsTypes?.map((item: any, index: number) =>
                                                <Select.Option value={item.typeId} key={index}>
                                                    {item.typeName}
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
                                    <Select placeholder="请选择返修类型" disabled={data?.status !== 1} onChange={(e) => {
                                        let data: any = {}
                                        repairTypes && repairTypes[index].forEach((element: any) => {
                                            if (element.id === e) {
                                                data = element
                                            }
                                        });
                                    }}
                                        onDropdownVisibleChange={(open) => {
                                            let data: any = []
                                            const list = form.getFieldsValue(true).list;
                                            partsTypes.forEach((element: any) => {
                                                if (element.typeId === list[index].typeId) {
                                                    data = element.fixItemConfigList
                                                }
                                            });
                                            setRepairTypes({
                                                [index]: data
                                            })
                                        }}>
                                        {
                                            repairTypes && repairTypes[index]?.map((item: any, index: number) =>
                                                <Select.Option value={item.id} key={index}>
                                                    {item.fixType}
                                                </Select.Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                            )
                        })
                    }
                    return res
                })} dataSource={wasteProductStructureList || []} />
                <OperationRecord title="审批信息" serviceId={params.id} serviceName="tower-science" />
                <DetailTitle title="信息" />
                <Form.Item name='description'>
                    <Input.TextArea disabled={data?.status !== 1} />
                </Form.Item>
            </Form>
        </DetailContent>
    </Spin>
}