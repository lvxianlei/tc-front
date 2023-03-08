/**
 * 送检明细
 * 时间：2022/01/06
 */
import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Button, InputNumber, message, Modal, Popconfirm, Select, Space, Spin } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { Attachment, AttachmentRef, CommonTable, SearchTable as Page } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useParams, useHistory } from 'react-router-dom';
import { baseColumn } from "./detail.json";
import '../../StockPublicStyle.less';
import './detail.less';
import {
    material
} from "../CreatePlan.json";
import { testTypeOptions } from '../../../../configuration/DictionaryOptions';
interface ReceiveStrokAttachProps {
    id: string
}
const ReceiveStrokAttach = forwardRef(({ id }: ReceiveStrokAttachProps, ref): JSX.Element => {
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/attach?attachType=2&id=${id}`)
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            // 对上传数据进行处理
            const fieldIds: any = [],
                source = attachRef.current.getDataSource();
            if (source.length < 1) {
                message.error("请您先上传附件！");
                resole(false as any)
                return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                ids: id,
                fieldIds,
                attachType:2
            })
            resole(true as any)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment dataSource={data} edit title="附件" ref={attachRef} style={{ margin: "0px" }} marginTop={false} />
    </Spin>
})
export default function RawMaterialWarehousing(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [popDataList, setPopDataList] = useState<any[]>([])
    const receiveRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const [detailId, setDetailId] = useState<string>("")
    const [attachVisible, setAttachVisible] = useState<boolean>(false)
    const [saveLoding, setSaveLoading] = useState<boolean>(false)
    const [userList, setUserList] = useState<any[]>([])

    // 批量复检
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    // 申请复检  待联调
    const { data: statisticsDatas, run: saveRun } = useRequest<any[]>((data) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-storage/qualityInspection/repeatInspection`, data )
            message.success("复检成功！");
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleAttachOk = async () => {
        setSaveLoading(true)
        const res = await receiveRef.current.onSubmit()
        if (!(res as any)) {
            setSaveLoading(false)
            return;
        }
        setSaveLoading(false)
        message.success("保存成功...")
        setVisible(false)
    }
    const handleWarehousingClick = async () => {
        if (selectedRowKeys.length < 1) {
            message.error("请选择需要复检数据！");
            return false;
        }
        setLoading(true)
        // const result: any = await RequestUtil.put(`/tower-storage/warehousingEntry/batchSaveWarehousingEntry`, selectedRowKeys )
        setPopDataList(selectedRow.map((item:any)=>{
            return {
                ...item,
                inspectionTypeName: item?.inspectionTypeName?item?.inspectionTypeName.split(','):[],
                type: item?.inspectionNum>0?1:2

            }
        }))
        const userData: any = await RequestUtil.get(`/tower-system/employee?size=10000`);
        setUserList(userData.records);
        setLoading(false)
        setVisible(true)
        
    }
    const { data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-storage/qualityInspection/detail/${params.id}`)
            resole({
                ...result
            })
        } catch (error) {
            reject(error)
        }
    }))
    const handleCreateClick = async (type:string) => {
        try {
            if (popDataList.length < 1) {
                message.error("当前没有送检单数据,不可保存或提交!");
                return false;
            }
            // 添加对取样数量的拦截
            let inspectionNum = false;
            let machiningUser = false;
            let sampler = false;
            let machiningNum = false;
            let inspectionScheme = false
            for (let i = 0; i < popDataList.length; i += 1) {
                if (!(popDataList[i].inspectionNum)&&popDataList[i].inspectionScheme!==0) {
                    inspectionNum = true;
                }
                if (!(popDataList[i].machiningUser)) {
                    machiningUser = true;
                }
                if (!(popDataList[i].sampler)) {
                    sampler = true;
                }
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
            if (sampler) {
                message.error("请您选择取样人！");
                return false;
            }
            if (machiningUser) {
                message.error("请您选择机加人！");
                return false;
            }
            if (inspectionScheme) {
                message.error("请您选择检验方案！");
                return false;
            }
            type==='save'&&saveRun({
                qualityInspectionDetailDTOs: popDataList.map((item:any)=>{
                    return {
                        receiveStockDetailId: item?.detailId?item?.detailId:item?.receiveStockDetailId,
                        manufactureTime: item?.manufactureTime,
                        ...item,
                        inspectionTypeName: item?.inspectionScheme===3&&item?.inspectionTypeName.length>0?item?.inspectionTypeName.join(','):''
                    }
                }),
                id:params.id,
                // initialQualityInspectionNumber: data?.initialQualityInspectionNumber,
                receiveStockId: data?.id,
                receiveNumber: data?.receiveNumber,
                supplierId:data?.supplierId,
                supplierName:data?.supplierName,
                warehouseId:data?.warehouseId,
                isUrgent: data?.isUrgent,
                inspectionBatch: 2,
                commit:0
            });
            type==='submit'&&saveRun({
                qualityInspectionDetailDTOs: popDataList.map((item:any)=>{
                    return {
                        receiveStockDetailId: item?.detailId?item?.detailId:item?.receiveStockDetailId,
                        manufactureTime: item?.manufactureTime,
                        ...item,
                        inspectionTypeName: item?.inspectionScheme===3&&item?.inspectionTypeName.length>0?item?.inspectionTypeName.join(','):''
                    }
                }),
                id:params.id,
                // initialQualityInspectionNumber: data?.initialQualityInspectionNumber,
                receiveStockId: data?.id,
                receiveNumber: data?.receiveNumber,
                isUrgent: data?.isUrgent,
                supplierId:data?.supplierId,
                supplierName:data?.supplierName,
                warehouseId:data?.warehouseId,
                inspectionBatch: 2,
                commit:1
            });
        } catch (error) {
            console.log(error);
        }
    }
    const handleInspectionSchemeChange = (value: number, receiveStockDetailId: string) => {
        const list = popDataList.map((item: any) => {
            if (item.receiveStockDetailId === receiveStockDetailId) {
                return ({
                    ...item,
                    inspectionScheme: value,
                    inspectionNum:value===0?0:item.inspectionNum,
                    type: value===0?2:item.type,
                    inspectionTypeName: value!==3?[]:item.inspectionTypeName
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
    return (
        <>
            <Page
                path={`/tower-storage/qualityInspection/${params.id}`}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...baseColumn,
                    {
                        title: '操作',
                        dataIndex: 'key',
                        width: 100,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <a style={{ marginRight: 12 }} onClick={() => {
                                    setDetailId(record.id)
                                    setAttachVisible(true)
                                }}>附件</a>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <>
                        <Button type="primary" ghost onClick={() => handleWarehousingClick()} >申请复检</Button>
                        <Button type="ghost" onClick={() => history.go(-1)}>返回</Button>
                    </>
                }
                searchFormItems={[]}
                tableProps={{
                    pagination:false,
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: any[], selectedRows:any[]) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setSelectedRow(selectedRows)
                        },
                        getCheckboxProps: (record: any) => record.totalConclusion === '合格'
                    }
                }}
            />
            <Modal
                destroyOnClose
                visible={attachVisible}
                title={'附件'}
                confirmLoading={saveLoding}
                onOk={handleAttachOk}
                okText="保存"
                onCancel={() => {
                    setDetailId("")
                    setAttachVisible(false)
                }}>
                <ReceiveStrokAttach id={detailId} ref={receiveRef}  />
            </Modal>
            <Modal
                title={'申请复检'}
                visible={visible}
                onCancel={() => {
                    setPopDataList([]);
                    setVisible(false)
                }}
                maskClosable={false}
                width={1100}
                footer={[
                    <Button key="back" onClick={() => {
                        setPopDataList([]);
                        setVisible(false)
                    }}>
                        取消
                    </Button>,
                    <Button key="create" type="primary" onClick={() => handleCreateClick('save')}>
                        保存
                    </Button>,
                    <Button key="create" type="primary" onClick={() => handleCreateClick('submit')}>
                        保存并提交
                    </Button>
                ]}
            >
                <Spin spinning={loading}>
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
                                        render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleMachiningNumChange(value, records.receiveStockDetailId)} key={key} />
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
        </>
    )
}