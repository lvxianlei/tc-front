/**
 * 申请送检
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, InputNumber, message, Spin, Select } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import {
    material,
    baseInfoColumn
} from "./CreatePlan.json";
import moment from 'moment';
import "./CreatePlan.less";
import { testTypeOptions } from '../../../configuration/DictionaryOptions';

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [userList, setUserList] = useState<any>();

    const handleInspectionSchemeChange = (value: number, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    inspectionScheme: value,
                    inspectionNum:value===0?0:value===2?3:item.inspectionNum,
                    machiningNum:value===0?0:value===2?3:item.machiningNum,
                    type: value===0?2:value===2?1:item.type,
                    inspectionTypeName: value!==3?[]:item.inspectionTypeName
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
    }
    const handleInspectionTypeNameChange = (value: number, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    inspectionTypeName: value
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
    }
    const handleNumChange = (value: number, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    inspectionNum: value,
                    type: value===0?2:value?1:'',
                    inspectionScheme: value===0?0:item.inspectionScheme
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
    }
    const handleSamplerChange = (value: string, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    sampler: value
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
    }
    const handleMachiningUserChange = (value: string, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    machiningUser: value
                })
            }
            return item
        })
        setPopDataList(list.slice(0))
    }
    const handleMachiningNumChange = (value: number, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    machiningNum: value,
                    })
            }
            return item
        })
        setPopDataList(list.slice(0))
    }



    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.issuedNumber) {
            const result = fields.issuedNumber.records[0];
            addCollectionForm.setFieldsValue({
                productCategoryName: result.productCategoryName, // 塔型
                contractNumber: result.contractNumber,// 内部合同号
                planNumber: result.planNumber,// 计划号
                projectName: result.projectName, // 工程名称
                issuedNumber: result.issuedNumber, // 下达单号
            })
            return;
        }
    }

    const handleCreateClick = async (type:string) => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (popDataList.length < 1) {
                message.error("当前没有送检单数据,不可保存或提交!");
                return false;
            }
            // 添加对取样数量的拦截
            let inspectionNum = false;
            // let machiningUser = false;
            // let sampler = false;
            let machiningNum = false;
            let inspectionScheme = false
            for (let i = 0; i < popDataList.length; i += 1) {
                if (!(popDataList[i].inspectionNum)&&popDataList[i].inspectionScheme!==0) {
                    inspectionNum = true;
                }
                // if (!(popDataList[i].machiningUser)) {
                //     machiningUser = true;
                // }
                // if (!(popDataList[i].sampler)) {
                //     sampler = true;
                // }
                if (!(popDataList[i].machiningNum)) {
                    machiningNum = true;
                }
                if (!(popDataList[i].inspectionScheme)&&popDataList[i].inspectionNum!==0) {
                    inspectionScheme = true;
                }
            }
            if (inspectionNum) {
                message.error("请您填写取样数量！");
                return false;
            }
            if (machiningNum) {
                message.error("请您填写机加数量！");
                return false;
            }
            // if (sampler) {
            //     message.error("请您选择取样人！");
            //     return false;
            // }
            // if (machiningUser) {
            //     message.error("请您选择机加人！");
            //     return false;
            // }
            if (inspectionScheme) {
                message.error("请您选择检验方案！");
                return false;
            }
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${props.id}`)
            console.log(result)
            // type==='save'&&saveRun({
            //     qualityInspectionDetailDTOs: popDataList.map((item:any)=>{
            //         return {
            //             ...item,
            //             inspectionTypeName: item?.inspectionScheme===3&&item?.inspectionTypeName.length>0?item?.inspectionTypeName.join(','):'',
            //             receiveStockDetailId: item?.receiveStockDetailId,
            //             productionTime: item?.manufactureTime
            //         }
            //     }),
            //     ...baseInfo,
            //     receiveStockId: props.id,
            //     supplierId: result?.supplierId,
            //     supplierName:result?.supplierName,
            //     receiveTime: result?.receiveTime,
            //     receiveNumber: result?.receiveNumber,
            //     warehouseId:result?.warehouseId,
            //     inspectionBatch:1,
            //     commit:0,
            // });
            type==='submit'&&submitRun({
                qualityInspectionDetailDTOs: popDataList.map((item:any)=>{
                    return {
                        ...item,
                        inspectionTypeName: item?.inspectionScheme===3&&item?.inspectionTypeName.length>0?item?.inspectionTypeName.join(','):'',
                        receiveStockDetailId: item?.receiveStockDetailId,
                        manufactureTime: item?.manufactureTime
                    }
                }),
                ...baseInfo,
                receiveStockId: props.id,
                supplierId: result?.supplierId,
                supplierName:result?.supplierName,
                receiveTime: result?.receiveTime,
                receiveNumber: result?.receiveNumber,
                warehouseId:result?.warehouseId,
                inspectionBatch:1,
                commit:1,
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (props.visible) {
            addCollectionForm.setFieldsValue({
                isUrgent: 0,
            })
        }
    }, [props.visible])

    // const { loading: saveLoading,  run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
    //     try {
    //         const path = '/tower-storage/qualityInspection'
    //         const result: { [key: string]: any } = await RequestUtil.post(path, {
    //             ...data,
    //             // id: props.id
    //         })
    //         message.success("保存成功！");
    //         props?.handleCreate({ code: 1 })
    //         resove(result)
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { manual: true })
    const { loading: submitLoading, run: submitRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path =  '/tower-storage/tower-storage/qualityInspection/inspection'
            const result: { [key: string]: any } = await RequestUtil.post(path,  data )
            message.success("提交成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-storage/receiveStock/quality/${props.id}`)
            const userData: any = await RequestUtil.get(`/tower-system/employee?size=10000`);
            setUserList(userData.records);
            const realReceiveBatchNumbers = result?.map((res: any) => res?.realReceiveBatchNumber)
            const ids: any = Array.from(new Set([...realReceiveBatchNumbers]))
            console.log(ids)
            let value:any = []
            ids.map((item:any)=>{
                const index = result.findIndex((itemE:any)=>{return itemE.realReceiveBatchNumber===item})
                value.push(index)
            })
            console.log(value)
            setPopDataList(result.map((item:any,index:number)=>{
                return {
                    ...item,
                    inspectionScheme: value.includes(index)?2:0,
                    inspectionNum: value.includes(index)?3:0,
                    machiningNum: value.includes(index)?3:0,
                    type: value.includes(index)?1:2,
                }
            }))
            resole({
                ...(result.map((item:any,index:number)=>{
                    return {
                        ...item,
                        inspectionScheme: value.includes(index)?2:0,
                        inspectionNum: value.includes(index)?3:0,
                        machiningNum: value.includes(index)?3:0,
                        type: value.includes(index)?1:2,
                    }
                }))
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { ready: props.visible && props.id, refreshDeps: [props.visible, props.id] })


    return (
        <Modal
            title={'创建送检单'}
            visible={props.visible}
            onCancel={() => {
                setPopDataList([]);
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setPopDataList([]);
                    props?.handleCreate();
                }}>
                    取消
                </Button>,
                // <Button key="create" type="primary" onClick={() => handleCreateClick('save')} loading={saveLoading}>
                //     保存
                // </Button>,
                <Button key="create" type="primary" onClick={() => handleCreateClick('submit')} loading={submitLoading}>
                    保存并提交
                </Button>
            ]}
        >
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    form={addCollectionForm}
                    edit
                    dataSource={data || {}}
                    col={2}
                    classStyle="baseInfo"
                    columns={baseInfoColumn}
                    onChange={performanceBondChange}
                />
                <DetailTitle title="送检单" />
                <CommonTable
                    style={{ padding: "0" }}
                    columns={[
                        {
                            key: 'index',
                            title: '序号',
                            dataIndex: 'index',
                            fixed: "left",
                            width: 50,
                            render: (_a: any, _b: any, index: number): React.ReactNode => {
                                return (
                                    <span>
                                        {index + 1}
                                    </span>
                                )
                            }
                        },
                        ...material.map((item: any) => {
                            if (["inspectionScheme"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => 
                                    <Select placeholder="请选择"  style={{ width: "150px" }} value={value} onChange={(value: number) => handleInspectionSchemeChange(value, records.receiveStockDetailId)} key={key}>
                                        <Select.Option value={0} key="0">无</Select.Option>
                                        <Select.Option value={1} key="1">特高压</Select.Option>
                                        <Select.Option value={2} key="2">正常</Select.Option>
                                        <Select.Option value={3} key="3">其他</Select.Option>
                                    </Select>}
                                )
                            }
                            if (["inspectionTypeName"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <Select placeholder="请选择" value={value} style={{ width: "150px" }} mode='multiple' disabled={records?.inspectionScheme!==3} onChange={(value: number) => handleInspectionTypeNameChange(value, records.receiveStockDetailId)}>
                                        {testTypeOptions && testTypeOptions.map(({  name }, index) => {
                                            return <Select.Option key={index} value={name}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>}
                                )
                            }
                            
                            if (["inspectionNum"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber min={0} value={value===0?0:value || undefined } onChange={(value: number) => handleNumChange(value, records.receiveStockDetailId)} key={key} />
                                })
                            }
                            if (["machiningNum"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber min={0} value={value===0?0:value || undefined} onChange={(value: number) => handleMachiningNumChange(value, records.receiveStockDetailId)} key={key} />
                                })
                            }
                            if (["sampler"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: string, records: any, key: number) => <Select style={{width:160}} placeholder="请选择" showSearch allowClear value={value || undefined} onChange={(value: string) => handleSamplerChange(value, records.receiveStockDetailId)} key={key} >
                                        {userList && userList.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                })
                            }
                            if (["machiningUser"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: string, records: any, key: number) =><Select style={{width:160}} placeholder="请选择" showSearch allowClear value={value || undefined} onChange={(value: string) => handleMachiningUserChange(value, records.receiveStockDetailId)} key={key} >
                                        {userList && userList.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                })
                            }
                            return item;
                        })]}
                    pagination={false}
                    dataSource={[...popDataList]} />
            </Spin>
        </Modal>
    )
}