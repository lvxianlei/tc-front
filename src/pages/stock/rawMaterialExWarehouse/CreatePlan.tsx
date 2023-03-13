/**
 * 创建计划列表
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, InputNumber, message, Spin, Input, Select, Space } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, IntgSelect, PopTableContent } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import {
    material,
    baseInfoColumn,
    addMaterial,
    addMaterialPick,
    addDetailMaterial
} from "./CreatePlan.json";
import moment from 'moment';
import styles from "./CreatePlan.module.less";
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [pickVisible, setPickVisible] = useState<boolean>(false)
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [saveLoading, setSaveLoading] = useState<boolean>(false)
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [type, setType] = useState<number>(0);
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    let [count, setCount] = useState<number>(1);
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [locatorId, setLocatorId] = useState('');//入库弹框选择库位
    const [reservoirId, setReservoirId] = useState('');//入库弹框选择库区
    const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
    const [Location, setLocation] = useState<any[]>([]);//入库库位数据
    const structureTextureEnum:any = materialTextureOptions?.map((item: { id: string, name: string }) => ({ value: item.name, label: item.name }))
    const materialStandardEnum:any = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

    // 获取仓库/库区/库位
    const getWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            id,
            type,
        });
        switch (type) {
            case 1:
                setReservoirArea(data)
                break;
            case 2:
                setLocation(data)
                break;
            default:
                break;
        }
    }
    const handleAddModalOk = () => {
        
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // for (let i = 0; i < popDataList.length; i += 1) {
        //     for (let p = 0; p < materialList.length; p += 1) {
        //         if (popDataList[i].id === materialList[p].id) {
        //             materialList[p].structureTexture = popDataList[i].structureTexture;
        //             materialList[p].materialTexture = popDataList[i].materialTexture;
        //         }
        //     }
        // }
        setMaterialList([...materialList, ...newMaterialList])
        setPopDataList([...materialList.map((item: any) => {
            return ({
                ...item,
                rawStockId: item.rawStockId?item.rawStockId:item.ids?item.ids:item.id,
                furnaceBatch: item.furnaceBatchNumber,
                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                        : (Number(item?.proportion || 1) / 1000).toFixed(5),
                totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                        : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
            })
        })])
        setVisible(false)
    }
    const handlePickAddModalOk = () => {
        
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // for (let i = 0; i < popDataList.length; i += 1) {
        //     for (let p = 0; p < materialList.length; p += 1) {
        //         if (popDataList[i].id === materialList[p].id) {
        //             materialList[p].structureTexture = popDataList[i].structureTexture;
        //             materialList[p].materialTexture = popDataList[i].materialTexture;
        //         }
        //     }
        // }
        setMaterialList([...materialList, ...newMaterialList])
        setPopDataList([...materialList.map((item: any) => {
            return ({
                ...item,
                furnaceBatch: item.furnaceBatchNumber,
                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                        : (Number(item?.proportion || 1) / 1000).toFixed(5),
                totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                        : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
            })
        })])
        setPickVisible(false);
    }
    const handleDetailAddModalOk = () => {
        // let flag = false;
        // for (let i = 0; i < materialList.length; i += 1) {
        //     if (materialList[i].issuedNumber!== materialList[0].issuedNumber) {
        //         flag = true;
        //     }
        // }
        // if (flag) {
        //     message.error("请选择同一下达单下的明细！");
        //     return false;
        // }
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        // for (let i = 0; i < popDataList.length; i += 1) {
        //     for (let p = 0; p < materialList.length; p += 1) {
        //         if (popDataList[i].id === materialList[p].id) {
        //             materialList[p].structureTexture = popDataList[i].structureTexture;
        //             materialList[p].materialTexture = popDataList[i].materialTexture;
        //         }
        //     }
        // }
        getWarehousing(warehouseId,1)
        setMaterialList([...materialList, ...newMaterialList])
        setPopDataList([...materialList.map((item: any,index: number) => {
            return ({
                ...item,
                reservoirName: item?.outStockItemStatus===4?item.reservoirName:index===0?'':'0',
                locatorName: item?.outStockItemStatus===4?item.locatorName:index===0?'':'0',
                outStockItemStatus: item?.outStockItemStatus||0,
                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                        : (Number(item?.proportion || 1) / 1000).toFixed(5),
                totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                        : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
            })
        })])
        setDetailVisible(false)
    }
    const handleBatchChange = async (value: any, id: string) => {
        // const isRepeat: boolean = await RequestUtil.get(`/tower-storage/materialStock/checkReceiveBatchNumber?receiveBatchNumber=${value}`)
        // if(isRepeat){
            const list = popDataList.map((item: any) => {
                if (item.id === id) {
                    return ({
                        ...item,
                        receiveBatchNumber: value
                    })
                }
                return item
            })
            setMaterialList(list.slice(0));
            setPopDataList(list.slice(0))
        // }else{
        //     message.error(`当前收货批次存在重复，请修改`)
        //     const list = popDataList.map((item: any) => {
        //         if (item.id === id) {
                    
        //             return ({
        //                 ...item,
        //                 receiveBatchNumber: '' 
        //             })
        //         }
        //         return item
        //     });
        //     setMaterialList(list.slice(0));
        //     setPopDataList(list.slice(0))
        // }
        
    }
    const handleDescriptionChange = async (value: any, id: string) => {
            const list = popDataList.map((item: any) => {
                if (item.id === id) {
                    return ({
                        ...item,
                        remark: value
                    })
                }
                return item
            })
            setMaterialList(list.slice(0));
            setPopDataList(list.slice(0))
        
    }
    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
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
    const handleLengthChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value || 1)) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) / 1000).toFixed(3),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value || 1) * Number(item.num || 1))  / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value || 1) * Number(item.width || 0)* Number(item.num || 1)  / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1)/ 1000).toFixed(3)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleWidthChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    width: value,
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(value || 0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) / 1000).toFixed(3),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)* Number(item.num || 1))  / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(value || 0) * Number(item.num || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1)  / 1000).toFixed(3)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleReservoirChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    reservoirId: value!=='0'?ReservoirArea.filter((itemOne:any)=>{return itemOne?.name===value})[0].id:'',
                    reservoirName: value,
                    locatorName:value!=='0'?'':item.locatorName
                })
            }
            return item
        })
        value!=='0'&&getWarehousing(ReservoirArea.filter((itemOne:any)=>{return itemOne?.name===value})[0].id, 2)
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleLocatorChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    locatorId: value!=='0'?Location.filter((itemOne:any)=>{return itemOne?.name===value})[0].id:'',
                    locatorName: value
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    // 移除
    const handleRemove = (id: string) => {
        const value = materialList.filter((item: any) => item.id !== id)
        form.setFieldsValue({
            list: value
        })
        setMaterialList([...value])
        setPopDataList([...value])
    }

    // 复制
    const handleCopy = (options: any) => {
        const result = {
            ...options,
            ids: options.rawStockId?options.rawStockId:options.ids?options.ids:options.id,
            num:'',
            planPurchaseNum: "",
            totalWeight: "",
            id: count + "",
            
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
        console.log(fields)
        if (fields.outStockType&&fields.outStockType!==0) {
            console.log(fields.outStockType)
            setType(fields.outStockType)
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.outStockType===0) {
            setType(fields.outStockType)
            setPopDataList([])
            setMaterialList([])
            return;
        }
        if (fields.issuedNumber) {
            const result = fields.issuedNumber.records[0];
            addCollectionForm.setFieldsValue({
                productCategoryName: result.productCategoryName, // 塔型
                internalNumber: result.internalNumber,// 内部合同号
                planNumber: result.planNumber,// 计划号
                projectName: result.orderProjectName, // 工程名称
                issuedNumber: result.issuedNumber, // 下达单号
            })
            return;
        }
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
            setPopDataList(popDataList.filter(item=>item.materialPickingDetailId))
            setMaterialList(popDataList.filter(item=>item.materialPickingDetailId))
            return;
        }
    }

    const handleCreateClick = async () => {
        try {
            setSaveLoading(true)
            const baseInfo = await addCollectionForm.validateFields();
            if (popDataList.length < 1) {
                message.error("请您选择出库明细!");
                return false;
            }
            // 添加对长度以及数量的拦截
            let flag = false;
            for (let i = 0; i < popDataList.length; i += 1) {
                if (!(popDataList[i].num)) {
                    flag = true;
                }
            }
            if (flag) {
                message.error("请您填写数量！");
                return false;
            }
            saveRun({
                outStockDetailDTOList: popDataList.map((item:any)=>{
                    return{
                        ...item,
                        id: item?.ids?item.ids:item.id
                    }
                }),
                ...baseInfo,
                materialType: 1,
                issuedNumber: typeof(baseInfo?.issuedNumber)==='object'?'':baseInfo?.issuedNumber,
                pickingUserId: baseInfo?.pickingUserId.id
            });
        } catch (error) {
            setSaveLoading(false)
            console.log(error);
        }
    }
    const findLastIndex = (arr:any, callback:any, thisArg:any, num:number)=> {
        for (let index = num - 1; index >= 0; index--) {
          const value = arr[index];
          if (callback.call(thisArg, value, index, arr)) {
            return index;
          }
        }
        return -1;
      }
    const handleSaveClick = async (typeClick: string) => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (popDataList.length < 1) {
                message.error("请您选择出库明细!");
                return false;
            }
            // 添加对长度以及数量的拦截
            let flag = false;
            let num = false;
            let width = false;
            // let batch = false;
            let locator = false;
            let reservoir = false;
            for (let i = 0; i < popDataList.length; i += 1) {
                if (!(popDataList[i].length)) {
                    flag = true;
                }
                if (!(popDataList[i].width)){
                    width = true
                }
                // if (!(popDataList[i].receiveBatchNumber)){
                //     batch = true
                // }
                if (!(popDataList[i].locatorName)){
                    locator = true
                }
                if (!(popDataList[i].reservoirName)){
                    reservoir = true
                }
                if (!(popDataList[i].num)){
                    num = true
                }
            }
            if (flag) {
                message.error("请您填写长度！");
                return false;
            }
            if (width) {
                message.error("请您填写宽度！");
                return false;
            }
            // if (batch) {
            //     message.error("请您填写收货标识码！");
            //     return false;
            // }
            if (locator) {
                message.error("请您选择区位！");
                return false;
            }
            if (reservoir) {
                message.error("请您选择库区！");
                return false;
            }
            if (num) {
                message.error("请您填写数量！");
                return false;
            }
            typeClick==='save'&& setSaveLoading(true)
            typeClick==='save'&&saveRun({
                outStockDetailDTOList: popDataList.map((item:any,index:number)=>{
                    return {
                        ...item,
                        num: type !== 2 ? item.num : 0- item.num,
                        totalWeight: type !==2 ? item.totalWeight : 0- item.totalWeight,
                        warehouseItemId: item.locatorName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.locatorName !== '0', popDataList,index)].locatorId: item.locatorId,
                        id: item?.ids?item.ids:item.id,
                        reservoirName: item.reservoirName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.reservoirName !== '0', popDataList,index)].reservoirName: item.reservoirName,
                        reservoirId: item.reservoirName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.reservoirName !== '0', popDataList,index)].reservoirId:item.reservoirId,
                        locatorName: item.locatorName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.locatorName !== '0', popDataList,index)].locatorName: item.locatorName,
                        locatorId: item.locatorName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.locatorName !== '0', popDataList,index)].locatorId: item.locatorId,
                        // rawStockId: item?.ids?item.ids:item.rawStockId,
                    }
                }),
                ...baseInfo,
                materialType: 1,
                issuedNumber: typeof(baseInfo?.issuedNumber)==='object'?'':baseInfo?.issuedNumber,
                pickingUserId: baseInfo?.pickingUserId.id
            });
            typeClick==='submit'&& setSubmitLoading(true)
            typeClick==='submit'&&submitRun({
                outStockDetailDTOList: popDataList.map((item:any,index:number)=>{
                    return {
                        ...item,
                        num: type !==2 ? item.num : 0- item.num,
                        totalWeight: type !==2 ? item.totalWeight : 0- item.totalWeight,
                        warehouseItemId: item.locatorName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.locatorName !== '0', popDataList,index)].locatorId: item.locatorId,
                        reservoirName: item.reservoirName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.reservoirName !== '0', popDataList,index)].reservoirName: item.reservoirName,
                        reservoirId: item.reservoirName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.reservoirName !== '0', popDataList,index)].reservoirId:item.reservoirId,
                        locatorName: item.locatorName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.locatorName !== '0', popDataList,index)].locatorName: item.locatorName,
                        locatorId: item.locatorName==='0'?popDataList[findLastIndex(popDataList, (item:any) => item.locatorName !== '0', popDataList,index)].locatorId: item.locatorId,
                        // rawStockId: item?.ids?item.ids:item.rawStockId,
                    }
                }),
                ...baseInfo,
                materialType: 1,
                issuedNumber: typeof(baseInfo?.issuedNumber)==='object'?'':baseInfo?.issuedNumber,
                pickingUserId: baseInfo?.pickingUserId.id
            });
        } catch (error) {
            setSaveLoading(false)
            setSubmitLoading(false)
            console.log(error);
        }
    }
    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
            addCollectionForm.setFieldsValue({
                outStockType:0,
                pickingTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                issuedNumber:'',
                projectName:'',
                planNumber:'',
                internalNumber:'',
                productCategoryName:'',
            })
        }
    }, [props.visible])

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = props.type === "create" ? `/tower-storage/outStock/save` : '/tower-storage/outStock'
            const result: { [key: string]: any } = await RequestUtil[props.type === "create" ? "post" : "put"](path, props.type === "create" ? data : {
                ...data,
                id: props.id
            })
            message.success("创建成功！");
            setType(0)
            setSaveLoading(false)
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            setSaveLoading(false)
            reject(error)
        }
    }), { manual: true })
    const { run: submitRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = `/tower-storage/outStock/saveExcess` 
            const result: { [key: string]: any } = await RequestUtil[ "post" ](path, props.type === "create" ? data : {
                ...data,
                id: props.id
            })
            message.success("创建成功！");
            setSubmitLoading(false)
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            setSubmitLoading(false)
            reject(error)
        }
    }), { manual: true })
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/outStock/${props.id}`, {
                materialType: 1
            })
            setPopDataList(result?.outStockDetailVOList)
            setMaterialList(result?.outStockDetailVOList)
            setType(result?.outStockType)
            result?.warehouseId && getWarehousing(result?.warehouseId,1)
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
    }), { ready: props.type === "edit" && props.id && props.visible, refreshDeps: [props.visible, props.type, props.id] })

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Modal
            title={'出库单'}
            visible={props.visible}
            onCancel={() => {
                setMaterialList([]);
                setPopDataList([]);
                setType(0)
                props?.handleCreate({code:1});
                
            }}
            maskClosable={false}
            width={1100}
            footer={type===2?[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    setType(0)
                    props?.handleCreate({code:1});
                }}>
                    取消
                </Button>,
                <Button key="create" type="primary" onClick={() => handleSaveClick('save')} loading={saveLoading}>
                    保存
                </Button>,
                <Button key="create" type="primary" onClick={() => handleSaveClick('submit')} loading={submitLoading}>
                    保存并提交
                </Button>
            ]:[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    setType(0)
                    props?.handleCreate({code:1});
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
                    dataSource={data || {}}
                    col={2}
                    classStyle={styles.baseInfo}
                    columns={baseInfoColumn.map((item: any) => {
                        if(item.dataIndex==='issuedNumber'){
                            return ({
                                ...item, 
                                // required: addCollectionForm.getFieldValue('outStockType') === 0,
                                disabled: addCollectionForm.getFieldValue('outStockType') === 2
                            })
                        }
                        if (item.dataIndex === "warehouseId") {
                            return ({
                                ...item, enum: batchingStrategy?.map((item: any) => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            })
                        }
                        if (item.dataIndex === "outStockType") {
                            return ({
                                ...item, 
                                disabled: props.type === 'edit'
                            })
                        }
                        return item
                    })}
                    onChange={performanceBondChange}
                />
                <DetailTitle title="出库明细" />
                <div className={styles.btnWrapper}>
                    {type!==2?
                    <Space>
                        <Button type='primary' key="add" ghost style={{ marginRight: 8 }} onClick={() => setPickVisible(true)}>选择领料明细</Button>
                        <Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!warehouseId} onClick={() => setVisible(true)}>选择库存</Button>
                    </Space>
                        
                        :<Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!warehouseId} onClick={() => setDetailVisible(true)}>选择货物明细</Button>}
                </div>
                <Form form={form} className={styles.descripForm}>
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
                            if (["receiveBatchNumber"].includes(item.dataIndex)&&type===2) {
                                return ({
                                    ...item,
                                    width: 160,
                                    render: (value: string, records: any, key: number) => {return <Form.Item 
                                        name={['list', key, 'receiveBatchNumber']}
                                        // rules={[{
                                        //     validator: async (rule: any, value: any, callback: (error?: string) => void) => {
                                        //         const resData = await RequestUtil.get(`/tower-storage/materialStock/checkReceiveBatchNumber?receiveBatchNumber=${value}`);
                                        //         if(!resData)
                                        //         return Promise.reject('收货标识码已存在');
                                        //         else return Promise.resolve('收货标识码可用');
                                        //     }
                                        // }]}
                                        >
                                            <Input defaultValue={value || undefined} placeholder={'自动生成'} disabled   onBlur={(e:any)=> handleBatchChange(e.target.value,records.id)} maxLength={30} />
                                        </Form.Item>
                                }})
                            }
                            
                            if (["num"].includes(item.dataIndex)&&type!==2) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => {return <Form.Item 
                                        name={['list', key, 'num']}
                                        initialValue={value||undefined}
                                        rules={[{
                                            validator: async (rule: any, value: any, callback: (error?: string) => void) => {
                                                console.log(records?.rawStockId)
                                                const resData:any = await RequestUtil.get(`/tower-storage/materialStock/outDetails?warehouseId=${warehouseId}&current=1&size=10&rawStockId=${records?.rawStockId}`);
                                                if(resData.records[0]?.num < value)
                                                return Promise.reject(`数量不可大于${resData.records[0]?.num}`);
                                                else return Promise.resolve('数量可用');
                                            }
                                        }]}
                                        >
                                            <InputNumber  onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0} />
                                        </Form.Item>
                                    // render: (value: number, records: any, key: number) => <InputNumber max={records?.maxNum} min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key}  disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0}/>
                                }})
                            }
                            if (["num"].includes(item.dataIndex)&&type===2) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber min={1} value={ value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key} disabled={records?.outStockItemStatus===4}/>
                                })
                            }
                            if (["length"].includes(item.dataIndex)&&type===2) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleLengthChange(value, records.id)} key={key} disabled={records?.outStockItemStatus===4}/>
                                })
                            }
                            if (["width"].includes(item.dataIndex)&&type===2) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleWidthChange(value, records.id)} key={key} disabled={records?.outStockItemStatus===4}/>
                                })
                            }
                            if (["reservoirName"].includes(item.dataIndex)&&type===2) {
                                return ({
                                    ...item,
                                    render: (value: string, records: any, key: number) => <Select
                                                className="select"
                                                style={{ width: "100%" }}
                                                value={value ? value : '请选择'}
                                                onChange={(val) => { handleReservoirChange(val,records.id) }}
                                                disabled={records?.outStockItemStatus===4}
                                                // disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0}
                                            >
                                                {key!==0 && <Select.Option
                                                    value={'0'}
                                                >
                                                    同上
                                                </Select.Option>}
                                                {
                                                    ReservoirArea.map((item, index) => {
                                                        return (
                                                            <Select.Option
                                                                value={item.name}
                                                            >
                                                                {item.name}
                                                            </Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                })
                            }
                            if (["locatorName"].includes(item.dataIndex)&&type===2) {
                                return ({
                                    ...item,
                                    render: (value: string, records: any, key: number) => <Select
                                                className="select"
                                                style={{ width: "100%" }}
                                                value={value ? value : '请选择'}
                                                onChange={(val) => { handleLocatorChange(val,records.id) }}
                                                disabled={records?.outStockItemStatus===4}
                                                // disabled={records?.outStockItemStatus&&records?.outStockItemStatus!==0}
                                            >
                                                {key!==0 && <Select.Option
                                                    value={'0'}
                                                    // key={'0'}
                                                    disabled={records.reservoirName!=='0'}
                                                >
                                                    同上
                                                </Select.Option>}
                                                {
                                                    Location.map((item, index) => {
                                                        return (
                                                            <Select.Option
                                                                value={item.name}
                                                                // key={index}
                                                            >
                                                                {item.name}
                                                            </Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                })
                            }
                            if (["remark"].includes(item.dataIndex)&&type!==2) {
                                return ({
                                    ...item,
                                    width: 160,
                                    render: (value: string, records: any, key: number) => {return <Form.Item 
                                        name={['list', key, 'remark']}>
                                            <Input defaultValue={value || undefined}   onBlur={(e:any)=> handleDescriptionChange(e.target.value,records.id)} maxLength={50} />
                                        </Form.Item>
                                }})
                            }
                            return item;
                        }),
                        {
                            title: "操作",
                            fixed: "right",
                            dataIndex: "opration",
                            render: (_: any, records: any) => <>
                                <Button type="link" style={{marginRight: 8}} onClick={() => handleCopy(records)} disabled={records.source === 1||(type===0&&records?.outStockItemStatus&&records?.outStockItemStatus!==0)||records?.outStockItemStatus===4||records.materialPickingDetailId}>复制</Button>
                                <Button type="link" disabled={records.source === 1||(type===0&&records?.outStockItemStatus&&records?.outStockItemStatus!==0)||records?.outStockItemStatus===4} onClick={() => handleRemove(records.id)}>移除</Button>
                            </>
                        }]}
                    pagination={false}
                    dataSource={[...popDataList]} />
                </Form>
            </Spin>
            <Modal width={1100} title={`选择库存`} destroyOnClose
                visible={visible}
                onOk={handleAddModalOk}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <PopTableContent
                    data={{
                        ...addMaterial as any,
                        search: addMaterial.search.map((res: any) => {
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
                        path: `${addMaterial.path}?warehouseId=${warehouseId}`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
                        setMaterialList(fields.map((item: any) => ({
                            ...item,
                            rawStockId: item.rawStockId?item.rawStockId:item.ids?item.ids:item.id,
                            maxNum: item.num,
                            weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                                    : (Number(item?.proportion || 1) / 1000).toFixed(5),
                            totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                                    : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
                        })) || [])
                    }}
                />
            </Modal>
            <Modal width={1100} title={`选择货物明细`} destroyOnClose
                visible={detailVisible}
                onOk={handleDetailAddModalOk}
                onCancel={() => {
                    setDetailVisible(false);
                }}
            >
                <PopTableContent
                    data={{
                        ...addDetailMaterial as any,
                        search: addDetailMaterial.search.map((res: any) => {
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
                        path: `${addDetailMaterial.path}?materialType=1&outStockItemStatus=2`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
                        addCollectionForm.setFieldsValue({
                            issuedNumber:Array.from(new Set(fields.map((item)=>item.issuedNumber))).join(','),
                            projectName:Array.from(new Set(fields.map((item)=>item.projectName))).join(','),
                            planNumber:Array.from(new Set(fields.map((item)=>item.planNumber))).join(','),
                            internalNumber:Array.from(new Set(fields.map((item)=>item.internalNumber))).join(','),
                            productCategoryName:Array.from(new Set(fields.map((item)=>item.productCategoryName))).join(','),
                        })
                        setMaterialList(fields.map((item: any) => ({
                            ...item,
                            num:1,
                            reservoirName: item?.outStockItemStatus===4?item.reservoirName:'',
                            locatorName: item?.outStockItemStatus===4?item.locatorName:'',
                            outStockItemStatus: item?.outStockItemStatus||0,
                            weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) / 1000).toFixed(3),
                            totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * (1) / 1000).toFixed(3)
                        })) || [])
                    }}
                />
            </Modal>
            <Modal width={1100} title={`选择领料明细`} destroyOnClose
                visible={pickVisible}
                onOk={handlePickAddModalOk}
                onCancel={() => {
                    setPickVisible(false);
                }}
            >
                <PopTableContent
                    data={{
                        ...addMaterialPick as any,
                        search: addMaterialPick.search.map((res: any) => {
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
                                    if (res.dataIndex === 'applyStaffId') {
                                        return ({
                                            ...res,
                                            format: (search:any) => {return search.value},
                                            render: () => <IntgSelect width={200} />
                                        })
                                    }
                                    return res
                        }),
                        path: `${addMaterialPick.path}`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
                        setMaterialList(fields.map((item: any) => ({
                            ...item,
                            rawStockId: item.ids?item.ids:item.id,
                            materialPickingDetailId: item?.materialPickingId?item.id:'',
                            maxNum: item.num,
                            weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(5)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(5)
                                    : (Number(item?.proportion || 1) / 1000).toFixed(5),
                            totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(5)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(5)
                                    : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(5)
                        })) || [])
                    }}
                />
            </Modal>
        </Modal>
    )
}