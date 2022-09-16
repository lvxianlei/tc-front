/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-不合格处置单-详情
 */

 import useRequest from "@ahooksjs/use-request";
 import { Button, Form, Input, InputNumber, Select, Space, Spin } from "antd";
 import { useForm } from "antd/es/form/Form";
 import React, { useState } from 'react';
 import { useHistory, useParams } from "react-router-dom";
 import { componentTypeOptions } from "../../../configuration/DictionaryOptions";
 import RequestUtil from "../../../utils/RequestUtil";
 import { BaseInfo, CommonTable, DetailContent, DetailTitle, OperationRecord } from "../../common";
 import SelectUser from "../../common/SelectUser";
 import { baseColumns, unqualifiedColumns } from "./unqualifiedDisposal.json"
 import styles from './UnqualifiedDisposal.module.less';
 
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
         resole(result);
     }), {})

    const {data: processList } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(``);
        resole(data);
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
                 <Button type="primary" onClick={save} ghost>拒绝</Button>
                 <Button type="primary" onClick={save} ghost>提交并生成返修单</Button>
             <Button onClick={() => {
                 history.push(`/businessDisposal/unqualifiedDisposal`);
             }}>关闭</Button>
             </Space>
         ]}>
             <DetailTitle title="基础信息" />
             <BaseInfo dataSource={{}} layout="vertical" col={10} columns={baseColumns} />
             <DetailTitle title="不合格信息" />
             <Form form={form}>
             <CommonTable columns={unqualifiedColumns.map(res => {
                 if (res.dataIndex === "") {
                     // 处理数量
                     return ({
                         ...res,
                         render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                             <Form.Item name={["list", index, ""]} rules={[{
                                 required: true,
                                 message: "请输入处理数量"
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
                 if (res.dataIndex === "") {
                     // 责任工序
                     return ({
                         ...res,
                         render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                             <Form.Item name={["list", index, ""]} rules={[{
                                 required: true,
                                 message: "请选择责任工序"
                             }]}>
                                 <Select placeholder="请选择" size="small">
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
                                             <Select.Option value={item.typeId} key={index}>
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
             })} dataSource={[]} />
             </Form>
             <OperationRecord title="审批信息" serviceId={params.id} serviceName="tower-science" />
             <DetailTitle title="信息" />
             <Form.Item name=''>
                <Input.TextArea />
             </Form.Item>
         </DetailContent>
     </Spin>
 }