/**
 * 创建计划列表
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message, Spin } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    baseInfoColumn,
    addMaterial
} from "./CreatePlan.json";
import { qualityAssuranceOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [supplierId, setSupplierId] = useState<any>("");
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

    let [count, setCount] = useState<number>(1);

    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        for (let i = 0; i < popDataList.length; i += 1) {
            for (let p = 0; p < materialList.length; p += 1) {
                if (popDataList[i].id === materialList[p].id) {
                    materialList[p].structureTexture = popDataList[i].structureTexture;
                    materialList[p].materialTexture = popDataList[i].materialTexture;
                }
            }
        }
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            return ({
                ...item,
                price: item?.unTaxPrice,
                totalPrice: item?.totalUnTaxPrice
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any, index: number) => {
            return ({
                ...item,
                price: item?.unTaxPrice,
                totalPrice: item?.totalUnTaxPrice,
                key: `${item.id}-${index}-${Math.random()}-${new Date().getTime()}`
            })
        })])
        setVisible(false)
    }

    // 移除
    const handleRemove = (index: number) => {
        materialList.splice(index,1)
        setMaterialList([...materialList])
        setPopDataList([...materialList])
    }

    // 复制
    const handleCopy = (options: any) => {
        const result = {
            ...options,
            width: "",
            length: "",
            planPurchaseNum: "",
            totalWeight: "",
            id: count + ""
        }
        setCount(count + 1)
        setMaterialList([
            ...materialList,
            result
        ])
        setPopDataList([
            ...popDataList,
            result
        ])
    }

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
            return;
        }
        if (fields.supplierId) {
            setSupplierId(fields.supplierId?.id);
            return;
        }
    }

    const handleCreateClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            console.log(baseInfo)
            if (materialList.length < 1) {
                message.error("请您选择原材料明细!");
                return false;
            }
            // // 添加对长度以及数量的拦截
            // let flag = false;
            // for (let i = 0; i < materialList.length; i += 1) {
            //     if (!(materialList[i].length && materialList[i].planPurchaseNum && materialList[i].width)) {
            //         flag = true;
            //     }
            // }
            // if (flag) {
            //     message.error("请您填写长度、宽度、数量！");
            //     return false;
            // }
            saveRun({
                warehousingEntryDetailList: materialList,
                ...baseInfo,
                contactsPhone: baseInfo.supplierId?.records[0]?.contactManTel,
                contactsUser: baseInfo.supplierId?.records[0]?.contactMan,
                supplierId: baseInfo.supplierId?.records[0]?.id,
                supplierName: baseInfo.supplierId?.records[0]?.supplierName
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
            addCollectionForm.setFieldsValue({
                warehousingType: "1",
                warehouseId:'',
                warehousingEntryNumber:'',
                supplierId:''
            })
        }
    }, [props.visible])

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            if(props.type === "edit"){
                const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehousingEntry/${props.id}`)
                setPopDataList(result?.warehousingEntryDetailList)
                setMaterialList(result?.warehousingEntryDetailList)
                result?.warehouseId && result?.warehouseId!==null&& setWarehouseId(result?.warehouseId)
                result?.supplierId && result?.supplierId!==null&& setSupplierId(result?.supplierId)
                addCollectionForm.setFieldsValue({
                    ...result,
                    warehousingType: typeof(result?.warehousingType)==='number'?String(result?.warehousingType):result?.warehousingType,
                    supplierId: {
                        id: result?.supplierId,
                        value: result?.supplierName,
                        records:[{
                            id: result?.supplierId,
                            value: result?.supplierName,
                            contactManTel:result?.contactsPhone,
                            contactMan:result?.contactsUser,
                            supplierName:result?.supplierName,
                        }]
                        
                    }
                })
                resole({
                    ...result,
                    warehousingType: typeof(result?.warehousingType)==='number'?String(result?.warehousingType):result?.warehousingType,
                    supplierId: {
                        id: result?.supplierId,
                        value: result?.supplierName,
                        records:[{
                            id: result?.supplierId,
                            value: result?.supplierName,
                            contactManTel:result?.contactsPhone,
                            contactMan:result?.contactsUser,
                            supplierName:result?.supplierName,
                        }]
                        
                    }
                })
            }
            else{
                resole({})
            }
        } catch (error) {
            reject(error)
        }
    }), { ready: props.type === "edit" && props.id && props.visible , refreshDeps: [props.visible, props.type, props.id] })

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    
    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = `/tower-storage/warehousingEntry`
            const result: { [key: string]: any } = await RequestUtil[props.type === "create" ? "post" : "put"](path, props.type === "create" ? data : {
                ...data,
                id: props.id
            })
            message.success("创建成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    return (
        <Modal
            title={'入库单'}
            visible={props.visible}
            onCancel={() => {
                setMaterialList([]);
                setPopDataList([]);
                setSupplierId('')
                setWarehouseId('')
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    setSupplierId('')
                    setWarehouseId('')
                    props?.handleCreate();
                }}>
                    取消
                </Button>,
                <Button key="create" type="primary" onClick={() => handleCreateClick()}>
                    确定
                </Button>
            ]}
        >
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    form={addCollectionForm}
                    edit
                    dataSource={data||[]}
                    col={2}
                    classStyle="baseInfo"
                    columns={baseInfoColumn.map((item: any) => {
                        
                        if (item.dataIndex === "warehouseId") {
                            return ({
                                ...item, 
                                disabled:props.type === "edit"&&data?.warehousingEntryDetailList.filter((item:any)=>{return item.warehousingEntryStatus===1}).length>0,
                                enum: batchingStrategy?.map((item: any) => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            })
                        }
                        if (item.dataIndex === "supplierId") {
                            return ({
                                ...item, 
                                disabled:props.type === "edit"&&data?.warehousingEntryDetailList.filter((item:any)=>{return item.warehousingEntryStatus===1}).length>0,
                                search: item.search.map((res: any) => {
                                    if (res.dataIndex === 'qualityAssurance') {
                                        return ({
                                            ...res,
                                            enum: qualityAssuranceEnum
                                        })
                                    }
                                    return res
                                })
                            })
                        }
                        
                        return{ 
                            ...item,
                            disabled:props.type === "edit"&&data?.warehousingEntryDetailList.filter((item:any)=>{return item.warehousingEntryStatus===1}).length>0,
                        }
                    })}
                    onChange={performanceBondChange}
                />
                <DetailTitle title="入库明细" />
                <div className='btnWrapper'>
                    <Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!(warehouseId && supplierId)} onClick={() => setVisible(true)}>选择</Button>
                    <Button type='primary' key="clear" ghost onClick={() => message.warning("暂无此功能！")}>导入</Button>
                </div>
                <CommonTable
                    rowKey={"id"}
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
                        ...material,
                        {
                            title: "操作",
                            fixed: "right",
                            dataIndex: "opration",
                            render: (_: any, records: any,index) => <>
                                {/* <Button type="link" style={{marginRight: 8}} onClick={() => handleCopy(records)}>复制</Button> */}
                                <Button
                                    type="link"
                                    disabled={records.warehousingEntryStatus === 1}
                                    onClick={() => handleRemove(index)}
                                >移除</Button>
                            </>
                        }]}
                    pagination={false}
                    dataSource={[...popDataList]} />
                <Modal width={1100} title={`选择到货明细`} destroyOnClose
                    visible={visible}
                    onOk={handleAddModalOk}
                    onCancel={() => {
                        setVisible(false);
                    }}
                >
                    <PopTableContent
                        data={{
                            ...addMaterial as any,
                            path: `${addMaterial.path}?supplierId=${supplierId}&warehouseId=${warehouseId}`
                        }}
                        value={{
                            id: "",
                            records: popDataList,
                            value: ""
                        }}
                        onChange={(fields: any[]) => {
                            console.log(fields)
                            setMaterialList(fields.map((item: any, index: number) => {
                                return ({
                                    ...item,
                                    price: item?.price?item?.price:item?.unTaxPrice,
                                    totalPrice: item?.totalPrice?item?.totalPrice:item?.totalUnTaxPrice,
                                })
                            }) || [])
                        }}
                    />
                </Modal>
            </Spin>
        </Modal>
    )
}