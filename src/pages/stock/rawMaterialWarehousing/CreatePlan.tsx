/**
 * 创建计划列表
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message, Spin, InputNumber } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    baseInfoColumn,
    addMaterial,
    addMaterialB
} from "./CreatePlan.json";
import { materialStandardOptions, materialTextureOptions, qualityAssuranceOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [visibleB, setVisibleB] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [supplierId, setSupplierId] = useState<any>("");
    const [type, setType] = useState<any>('1');
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const structureTextureEnum:any = materialTextureOptions?.map((item: { id: string, name: string }) => ({ value: item.name, label: item.name }))
    const materialStandardEnum:any = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

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
    const handleAddModalOkB = () => {
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
        setVisibleB(false)
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
    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
                    totalTaxPrice: type===4||type==='4'?(Number(item.taxPrice || 0) * (item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * value / 1000 / 1000)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * value / 1000 / 1000 / 1000)
                        : (Number(item?.proportion || 1) * value / 1000)) ).toFixed(2):(Number(item.taxPrice || 0) * value ).toFixed(2),
                    totalPrice: type===4||type==='4'?(Number(item.taxPrice || 0) *  (item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * value / 1000 / 1000)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * value / 1000 / 1000 / 1000)
                        : (Number(item?.proportion || 1) * value / 1000)) ).toFixed(2):(Number(item.price || 0) * value ).toFixed(2),
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                            : (Number(item?.proportion || 1) / 1000).toFixed(5),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * value / 1000 / 1000).toFixed(5)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * value / 1000 / 1000 / 1000).toFixed(5)
                            : (Number(item?.proportion || 1) * value / 1000).toFixed(5)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.warehousingType) {
            console.log(fields.warehousingType)
            setType(fields.warehousingType)
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.supplierId) {
            setSupplierId(fields.supplierId?.id);
            setPopDataList([])
            setMaterialList([])
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
                warehousingEntryDetailList: materialList.map((item:any)=>{
                    return {
                        ...item,
                        materialStockId: type==='4'||type === 4 ? item.materialStockId ? item.materialStockId : item.id : '', 
                        num: type==='4' ||type === 4? 0 - item.num : item.num, 
                        totalTaxPrice: type==='4'||type === 4 ? 0 - item.totalTaxPrice : item.totalTaxPrice,
                        totalPrice:type==='4'||type === 4 ? 0 - item.totalPrice : item.totalPrice,
                        totalWeight: type==='4'||type === 4 ? 0 - item.totalWeight : item.totalWeight,
                        id: props.type === 'create' ? '': item.id 
                    }
                }),
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
                supplierId:'',
                warehousingEntryTime: moment().format('YYYY-MM-DD')
            })
        }
    }, [props.visible])

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            if(props.type === "edit"){
                const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehousingEntry/${props.id}`)
                setPopDataList(result?.warehousingEntryDetailList.map((item:any)=>{
                    return {
                        ...item,
                        num: result?.warehousingType==='4'|| result?.warehousingType===4? 0 - item.num : item.num, 
                        totalTaxPrice: result?.warehousingType==='4'|| result?.warehousingType===4 ? 0 - item.totalTaxPrice : item.totalTaxPrice,
                        totalPrice: result?.warehousingType==='4'|| result?.warehousingType===4? 0 - item.totalPrice : item.totalPrice,
                        totalWeight: result?.warehousingType==='4'|| result?.warehousingType===4 ? 0 - item.totalWeight : item.totalWeight,
                    }
                }))
                setMaterialList(result?.warehousingEntryDetailList.map((item:any)=>{
                    return {
                        ...item,
                        num: result?.warehousingType==='4'|| result?.warehousingType===4 ? 0 - item.num : item.num, 
                        totalTaxPrice: result?.warehousingType==='4'|| result?.warehousingType===4 ? 0 - item.totalTaxPrice : item.totalTaxPrice,
                        totalPrice: result?.warehousingType==='4' || result?.warehousingType===4? 0 - item.totalPrice : item.totalPrice,
                        totalWeight: result?.warehousingType==='4'|| result?.warehousingType===4 ? 0 - item.totalWeight : item.totalWeight,
                    }
                }))
                setType(result?.warehousingType)
                result?.warehouseId && result?.warehouseId!==null&& setWarehouseId(result?.warehouseId)
                result?.supplierId && result?.supplierId!==null&& setSupplierId(result?.supplierId)
                addCollectionForm.setFieldsValue({
                    ...result,
                    warehousingEntryTime: moment(result.warehousingEntryTime),
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
                    warehousingEntryTime: moment(result.warehousingEntryTime),
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

    
    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
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
                <Button key="create" type="primary" onClick={() => handleCreateClick()} loading={saveLoading}>
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
                    { type === '4'? <Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!(warehouseId && supplierId)} onClick={() => setVisibleB(true)}>选择</Button>
                    :<Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!(warehouseId && supplierId)} onClick={() => setVisible(true)}>选择</Button>}
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
                        ...material.map((item: any) => {
                            if (["num"].includes(item.dataIndex)&&(type==='4'||type === 4)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => {return  <InputNumber value={ value || undefined} min={0} onChange={(value: number) => handleNumChange(value, records.id)} key={key}  />

                                    // <Form.Item 
                                    //     name={['list', key, 'num']}
                                    //     initialValue={value||undefined}
                                    //     rules={[{
                                    //         validator: async (rule: any, value: any, callback: (error?: string) => void) => {
                                    //             console.log(records?.rawStockId)
                                    //             const resData:any = await RequestUtil.get(`/tower-storage/materialStock/outDetails?warehouseId=${warehouseId}&current=1&size=10&rawStockId=${records?.rawStockId}`);
                                    //             if(resData.records[0]?.num < value)
                                    //             return Promise.reject(`数量不可大于${resData.records[0]?.num}`);
                                    //             else return Promise.resolve('数量可用');
                                    //         }
                                    //     }]}
                                    //     >
                                    //         <InputNumber  onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0} />
                                    //     </Form.Item>
                                    // render: (value: number, records: any, key: number) => <InputNumber max={records?.maxNum} min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0}/>
                                }})
                            }
                            return item;
                        }),
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
                <Modal width={1100} title={`选择库存`} destroyOnClose
                    visible={visibleB}
                    onOk={handleAddModalOkB}
                    onCancel={() => {
                        setVisibleB(false);
                    }}
                >
                    <PopTableContent
                        data={{
                            ...addMaterialB as any,
                            path: `${addMaterialB.path}?supplierId=${supplierId}&warehouseId=${warehouseId}`,
                            search: addMaterialB.search.map((res: any) => {
                                if (res.dataIndex === 'materialStandard') {
                                    return ({
                                        ...res,
                                        enum: [{value:'',label:'全部'},...materialStandardEnum]
                                    })
                                }
                                if (res.dataIndex === 'structureTexture') {
                                    return ({
                                        ...res,
                                        enum: [{value:'',label:'全部'},...structureTextureEnum]
                                    })
                                }
                                return res
                            }),
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
                                    reservoirArea: item?.reservoirName,
                                    location: item?.locatorName,
                                })
                            }) || [])
                        }}
                    />
                </Modal>
            </Spin>
        </Modal>
    )
}