/**
 * 不合格处置单
 */
import React, { forwardRef, useEffect, useRef, useState ,useImperativeHandle } from 'react';
import { Modal, Form, Button, InputNumber, message, Spin, Select, Input } from 'antd';
import { Attachment, AttachmentRef, BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import {
    material,
    baseInfoColumn
} from "./CreatePlan.json";
import moment from 'moment';
import "./CreatePlan.less";
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
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
                message.error("请您先上传质保单！");
                resole(false as any)
                return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                id,
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
        <Attachment dataSource={data} edit title="质保单" ref={attachRef} style={{ margin: "0px" }} marginTop={false} />
    </Spin>
})

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    let [count, setCount] = useState<number>(1);
    const [warehouseId, setWarehouseId] = useState<string>("");
    const receiveRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const [detailId, setDetailId] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false)
    const [saveLoding, setSaveLoading] = useState<boolean>(false)

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

    const handleLengthChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    processedLength: value 
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handlePriceChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    processedTaxPrice: value 
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleMaterialStandardChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    processedMaterialStandard: value 
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleOptionChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    purchaseDepartmentOpinion: value 
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    
    const handleStructureTextureChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    processedStructureTexture: value 
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleStructureSpecChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    processedStructureSpec: value 
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    
    const handleCreateClick = async (type: string) => {
        try {
            
            // 拦截
            let processedLength = false;
            let processedTaxPrice = false;
            let processedStructureSpec = false;
            let processedStructureTexture = false;
            let processedMaterialStandard = false;
            let purchaseDepartmentOpinion = false;
            for (let i = 0; i < popDataList.length; i += 1) {
                if (!(popDataList[i].processedLength)) {
                    processedLength = true;
                }
                if (!(popDataList[i].processedTaxPrice)) {
                    processedTaxPrice = true;
                }
                if (!(popDataList[i].processedStructureSpec)) {
                    processedStructureSpec = true;
                }
                if (!(popDataList[i].processedStructureTexture)) {
                    processedStructureTexture = true;
                }
                if (!(popDataList[i].processedMaterialStandard)) {
                    processedMaterialStandard = true;
                }
                if (!(popDataList[i].purchaseDepartmentOpinion)) {
                    purchaseDepartmentOpinion = true;
                }
            }
            if (processedTaxPrice) {
                message.error("请您填写处理后单价！");
                return false;
            }
            if (processedStructureSpec) {
                message.error("请您填写处理后规格！");
                return false;
            }
            if (processedStructureTexture) {
                message.error("请您选择处理后材质！");
                return false;
            }
            if (processedMaterialStandard) {
                message.error("请您选择处理后标准！");
                return false;
            }
            if (purchaseDepartmentOpinion) {
                message.error("请您选择采购部处理意见！");
                return false;
            }
            if (processedLength) {
                message.error("请您填写处理后长度！");
                return false;
            }
            type==='save'&&saveRun(popDataList);
            type==='submit'&&submitRun(popDataList);
        } catch (error) {
            console.log(error);
        }
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = `/tower-storage/nonconformityDisposal`
            const result: { [key: string]: any } = await RequestUtil.post(path,  data )
            message.success("保存成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const { run: submitRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = '/tower-storage/nonconformityDisposal/saveAndCommit'
            const result: { [key: string]: any } = await RequestUtil.post(path, data)
            message.success("提交成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/outStock/${props.id}`)
            setPopDataList(result?.outStockDetailVOList)
            setMaterialList(result?.outStockDetailVOList)
            result?.warehouseId && result?.warehouseId!==null && setWarehouseId(result?.warehouseId)
            resole({
                ...result,
                pickingUserId: {
                    id: result?.applyStaffId,
                    value: result?.applyStaffName
                },
                pickingTime: result?.createTime
            })
        } catch (error) {
            reject(error)
        }
    }), { ready: props.visible && props.id, refreshDeps: [props.visible, props.type, props.id] })


    return (
        <>
            <Modal
                title={'不合格处置单'}
                visible={props.visible}
                onCancel={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    props?.handleCreate();
                }}
                maskClosable={false}
                width={1100}
                footer={props.type==='create'?[
                    <Button key="back" onClick={() => {
                        setMaterialList([]);
                        setPopDataList([]);
                        props?.handleCreate();
                    }}>
                        取消
                    </Button>,
                    <Button key="create" type="primary" onClick={() => handleCreateClick('save')}>
                        保存
                    </Button>,
                    <Button key="create" type="primary" onClick={() => handleCreateClick('submit')}>
                        保存并提交
                    </Button>
                ]:[
                    <Button key="back" onClick={() => {
                        setMaterialList([]);
                        setPopDataList([]);
                        props?.handleCreate();
                    }}>
                        关闭
                    </Button>
                ]}
            >
                <Spin spinning={loading}>
                    <DetailTitle title="基本信息" />
                    <BaseInfo
                        dataSource={data || {}}
                        col={2}
                        classStyle="baseInfo"
                        columns={baseInfoColumn}
                    />
                    <DetailTitle title="材料明细" />
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
                                if (["purchaseDepartmentOpinion"].includes(item.dataIndex)&&props.type==='create') {
                                    return ({
                                        ...item,
                                        render: (value: number, records: any, key: number) => <Select placeholder="请选择"  style={{ width: "100px" }} value={value || undefined} onChange={(value: number) => handleOptionChange(value, records.id)} key={key}>
                                            <Select.Option value={1} key="1">让步接收</Select.Option>
                                            <Select.Option value={2} key="2">降级</Select.Option>
                                            <Select.Option value={3} key="3">复检</Select.Option>
                                            <Select.Option value={4} key="4">退货</Select.Option>
                                        </Select>
                                    })
                                }
                                if (["processedMaterialStandard"].includes(item.dataIndex)&&props.type==='create') {
                                    return ({
                                        ...item,
                                        render: (value: string, records: any, key: number) => <Select style={{ width: "100px" }} value={value || undefined} onChange={(value: string) => handleMaterialStandardChange(value, records.id)} key={key} >
                                            {
                                                materialStandardOptions?.map((item: { id: string, name: string }) => <Select.Option
                                                    value={item.id}
                                                    key={item.id}>{item.name}</Select.Option>)
                                            }
                                        </Select>
                                    })
                                }
                                if (["processedStructureTexture"].includes(item.dataIndex)&&props.type==='create') {
                                    return ({
                                        ...item,
                                        render: (value: string, records: any, key: number) => <Select style={{ width: "100px" }} value={value || undefined} onChange={(value: string) => handleStructureTextureChange(value, records.id)} key={key} >
                                        {
                                            materialTextureOptions?.map((item: { id: string, name: string }) => <Select.Option
                                                value={item.name}
                                                key={item.id}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                    })
                                }
                                if (["processedStructureSpec"].includes(item.dataIndex)&&props.type==='create') {
                                    return ({
                                        ...item,
                                        render: (value: number, records: any, key: number) => <Input defaultValue={value || undefined} onBlur={(e: any) => handleStructureSpecChange(e.target.value, records.id)} key={key}/>
                                    })
                                }
                                if (["processedTaxPrice"].includes(item.dataIndex)&&props.type==='create') {
                                    return ({
                                        ...item,
                                        render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handlePriceChange(value, records.id)} key={key} />
                                    })
                                }
                                if (["processedLength"].includes(item.dataIndex)&&props.type==='create') {
                                    return ({
                                        ...item,
                                        render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleLengthChange(value, records.id)} key={key} />
                                    })
                                }
                                return item;
                            },
                            {
                                title: "操作",
                                fixed: "right",
                                dataIndex: "opration",
                                render: (_: any, records: any) => <>
                                    <Button type="link"  onClick={() => {
                                        setDetailId(records.id)
                                        setVisible(true)
                                    }}>质保单</Button>
                                    {/* <Button type="link"  onClick={() => {
                                        
                                    }}>检验结果</Button> */}
                                </>
                            })]}
                        pagination={false}
                        dataSource={popDataList} />
                </Spin>
            </Modal>
            <Modal
                destroyOnClose
                visible={visible}
                title={'质保单'}
                confirmLoading={saveLoding}
                onOk={handleAttachOk}
                okText="保存"
                onCancel={() => {
                    setDetailId("")
                    setVisible(false)
                }}>
                <ReceiveStrokAttach id={detailId} ref={receiveRef}  />
            </Modal>
        </>
    )
}