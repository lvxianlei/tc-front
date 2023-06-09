/**
 * 创建原材料盘点
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, InputNumber, Select, message, Input } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    addMaterial,
    addNewMaterial,
    baseInfoColumn,
    baseInfoEditColumn
} from "./CreatePlan.json";
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

interface CreateInterface {
    isEdit: boolean,
    visible: boolean,
    handleCreate: (options: any) => void
    id?: string
    stockTakingNumber?: string
    warehouseId?: string
    warehouseName?: string
    takingNumberStatus?: number | string
}

interface WeightParams {
    width: number | string
    length: number | string
    weightAlgorithm: number
    proportion: number | string
}
interface TotalWeightParmas extends WeightParams {
    num: number | string
}

interface StockTakingWeightParmas extends TotalWeightParmas {
    stockTakingNum: number | string
}

export const calcFun = {
    /**
     * 理重
     */
    weight: ({ length, width, weightAlgorithm, proportion }: WeightParams) => {
        if (weightAlgorithm === 1) {
            return ((Number(proportion || 1) * Number(length || 1)) / 1000 / 1000).toFixed(3)
        }
        if (weightAlgorithm === 2) {
            return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) / 1000 / 1000 / 1000).toFixed(3)
        }
        return (Number(proportion || 1) / 1000).toFixed(3)
    },
    /**
     * 总重量
     */
    totalWeight: ({ length, width, weightAlgorithm, proportion, num }: TotalWeightParmas) => {
        if (weightAlgorithm === 1) {
            return ((Number(proportion || 1) * Number(length || 1)) * Number(num || 1) / 1000 / 1000).toFixed(3)
        }
        if (weightAlgorithm === 2) {
            return (Number(proportion || 1) * Number(length || 1) * Number(width || 0) * Number(num || 1) / 1000 / 1000 / 1000).toFixed(3)
        }
        return (Number(proportion || 1) * Number(num || "1") / 1000).toFixed(3)
    },
    stockTakingWeight: ({ length, width, weightAlgorithm, stockTakingNum = 1, proportion, num }: StockTakingWeightParmas) => {
        if (weightAlgorithm === 1) {
            return ((Number(proportion || 1) * Number(length)) * Number(stockTakingNum) / 1000 / 1000).toFixed(3)
        }
        if (weightAlgorithm === 2) {
            return (Number(proportion || 1) * Number(length) * Number(width || 0) * Number(stockTakingNum) / 1000 / 1000 / 1000).toFixed(3)
        }
        return (Number(proportion || 1) * Number(stockTakingNum) / 1000).toFixed(3)
    }
}

export default function CreatePlan(props: CreateInterface): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [materialVisible, setMaterialVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [addMaterialList, setAddMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [InReservoirArea, setInReservoirArea] = useState<any[]>([]);//入库库区数据
    const [InLocation, setInLocation] = useState<any[]>([]);//入库库位数据
    const [warehouseId, setWarehouseId] = useState<string>("");
    const structureTextureEnum:any = materialTextureOptions?.map((item: { id: string, name: string }) => ({ value: item.name, label: item.name }))
    const materialStandardEnum:any = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        for (let i = 0; i < popDataList.length; i += 1) {
            for (let p = 0; p < materialList.length; p += 1) {
                if (popDataList[i].id === materialList[p].id) {
                    materialList[p].structureTextureId = popDataList[i].structureTextureId;
                    materialList[p].structureTexture = popDataList[i].structureTexture;
                }
            }
        }
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.stockTakingNum || "1")
            return ({
                ...item,
                stockTakingNum: num,
                weight: item.weight || "1.00",
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.stockTakingNum || "1")
            return ({
                ...item,
                stockTakingNum: num,
                weight: item.weight || "1.00",
            })
        })])
        setVisible(false)
    }
    const handleAddMaterialModalOk = () => {
        setAddMaterialList([...addMaterialList.map((item: any) => {
            const num = parseFloat(item.stockTakingNum || "0")
            return ({
                ...item,
                stockTakingNum: num,
                weight: item.weight || "1.00",
            })
        })])
        setPopDataList([...materialList, ...addMaterialList.map((item: any) => {
            const num = parseFloat(item.stockTakingNum || "0")
            return ({
                ...item,
                stockTakingNum: num,
                weight: item.weight || "1.00",
            })
        })])
        setMaterialVisible(false)
    }
    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.id !== id))
        setPopDataList(materialList.filter((item: any) => item.id !== id))
    }
    
    const handleABatchChange = (value: string, id: number) => {
        const list = popDataList.map((item: any,index:number) => {
            if (index === id) {
                return ({
                    ...item,
                    receiveBatchNumber: value
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleBBatchChange = (value: string, id: number) => {
        const list = popDataList.map((item: any,index:number) => {
            if (index === id) {
                return ({
                    ...item,
                    furnaceBatchNumber: value
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleCBatchChange = (value: string, id: number) => {
        const list = popDataList.map((item: any,index:number) => {
            if (index === id) {
                return ({
                    ...item,
                    warrantyNumber: value
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleNumChange = (value: number, id: number) => {
        const list = popDataList.map((item: any,index:number) => {
            if (index === id) {
                const weight = calcFun.weight({
                    length: item.length,
                    width: item.width,
                    weightAlgorithm: item.weightAlgorithm,
                    proportion: item.proportion
                })
                return ({
                    ...item,
                    stockTakingNum: value,
                    profitAndLossNum: (((value) - item.num)) + "" + "   ", // 盈亏数量
                    // 不含税单价
                    unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                    // 盘点重量
                    stockTakingWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (value) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (value) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (value) / 1000).toFixed(3),
                    // 盈亏重量 = 盘点重量 - 账目重量
                    profitAndLossWeight: ((+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (value) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (value) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (value) / 1000).toFixed(3))) - (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)))).toFixed(3),
                    weight,
                    //账面重量
                    totalWeight: calcFun.totalWeight({
                        length: item.length,
                        width: item.width,
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        num: item.num
                    }),
                    taxPrice: item.taxPrice || 0, // 单价
                    // 账目金额
                    totalTaxPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2),
                    // 盘点金额
                    // stockTakingPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                    stockTakingPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (value) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (value) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (value) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2),
                    // 盈亏金额
                    profitAndLossPrice: ((+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (value) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (value) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (value) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2)) - (+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2))).toFixed(2),
                    // 不含税金额
                    totalUnTaxPrice: (Number(((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (+((+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (value) / 1000 / 1000).toFixed(3)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (value) / 1000 / 1000 / 1000).toFixed(3)
                        : (Number(item?.proportion || 1) * (value) / 1000).toFixed(3))) - (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                            : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)))).toFixed(3))).toFixed(2),
                })
            }
            return item
        })
        setMaterialList([...list]);
        setPopDataList([...list])
    }

    const lengthChange = (value: number, id: number) => {
        const list = popDataList.map((item: any, index:number) => {
            if (index === id) {
                const weight = calcFun.weight({
                    length: value,
                    width: item.width,
                    weightAlgorithm: item.weightAlgorithm,
                    proportion: item.proportion
                })
                return ({
                    ...item,
                    length: value,
                    stockTakingNum: item.stockTakingNum || item.num, // 盘点数量
                    profitAndLossNum: ((item.stockTakingNum || item.num) || 1) - item.num, // 盈亏数量
                    // 不含税单价
                    unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                    stockTakingWeight: calcFun.stockTakingWeight({
                        length: value,
                        width: item.width,
                        weightAlgorithm: item.weightAlgorithm,
                        stockTakingNum: item.stockTakingNum || item.num,
                        proportion: item.proportion,
                        num: item.num
                    }),
                    // 盈亏重量 = 盘点重量 - 账目重量 
                    profitAndLossWeight: ((+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value)) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value) * Number(item.width || 0) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * ((item.stockTakingNum || item.num) || 1) / 1000).toFixed(3))) - (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)))).toFixed(3),
                    weight,
                    // totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3), // 账面重量
                    totalWeight: calcFun.totalWeight({
                        length: value,
                        width: item.width,
                        weightAlgorithm: item.weightAlgorithm,
                        proportion: item.proportion,
                        num: item.num
                    }),
                    // 账目金额
                    totalTaxPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * value) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * value * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2),
                    // 盘点金额
                    // stockTakingPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                    stockTakingPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * (value)) * (item.stockTakingNum || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * (value) * Number(item.width || 0) * (item.stockTakingNum || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (item.stockTakingNum || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2),
                    // 盈亏金额
                    profitAndLossPrice: ((+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value)) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value) * Number(item.width || 0) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * ((item.stockTakingNum || item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2)) - (+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(value)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(value) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2))).toFixed(2),
                    // 不含税金额
                    totalUnTaxPrice: (Number(((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * value) * (item.stockTakingNum || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * value * Number(item.width || 0) * (item.stockTakingNum || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (item.stockTakingNum || 1) / 1000).toFixed(3))) - (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * value) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * value * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)))).toFixed(2)
                })
            }
            return item
        })
        setMaterialList(list);
        setPopDataList(list)
    }

    const widthChange = (value: number, id: number) => {
        const list = popDataList.map((item: any,index:number) => {
            if (index === id) {
                return ({
                    ...item,
                    width: value
                })
            }
            return item
        })
        setMaterialList([...list]);
        setPopDataList([...list])
    }
    const taxPriceChange = (value: number, id: number) => {
        const list = popDataList.map((item: any,index:number) => {
            if (index === id) {
                return ({
                    ...item,
                    taxPrice: value,
                    unTaxPrice: ((value || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                    // 账目金额
                    totalTaxPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * (item.length||0)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * (item.length||0 )* Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (value || 0)).toFixed(2),
                    // 盘点金额
                    stockTakingPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * (item.length||0)) * (item.stockTakingNum || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * (item.length||0) * Number(item.width || 0) * (item.stockTakingNum || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * (item.stockTakingNum || 1) / 1000).toFixed(3)) * (value|| 0)).toFixed(2),
                    // 盈亏金额
                    profitAndLossPrice: ((+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length||0)) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length||0) * Number(item.width || 0) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * ((item.stockTakingNum || item.num) || 1) / 1000).toFixed(3)) * (value || 0)).toFixed(2)) - (+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length||0)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length||0) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (value || 0)).toFixed(2))).toFixed(2),
                    // 不含税金额
                    totalUnTaxPrice: (Number(((value || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (item.stockTakingWeight-item.totalWeight)).toFixed(2),
                
                })
            }
            return item
        })
        setMaterialList([...list]);
        setPopDataList([...list])
    }
    const handleSuccessClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (popDataList.length < 1) {
                message.error("请您选择入库明细!");
                return false;
            }
            // let receiveBatchNumber = false;
            let materialStandard = false;
            let structureTexture = false;
            let length = false;
            let locator = false;
            let reservoir = false;
            let furnaceBatchNumber = false;
            let warrantyNumber = false;
            let width = false;
            for (let i = 0; i < popDataList.length; i += 1) {
                // if (!(popDataList[i].receiveBatchNumber)) {
                //     receiveBatchNumber = true;
                // }
                if (!(popDataList[i].materialStandard)) {
                    materialStandard = true;
                }
                if (!(popDataList[i].structureTexture)) {
                    structureTexture = true;
                }
                if (!(popDataList[i].length)) {
                    length = true;
                }
                if (!(popDataList[i].locatorName)) {
                    locator = true;
                }
                if (!(popDataList[i].reservoirName)) {
                    reservoir = true;
                }
                if (!(popDataList[i].furnaceBatchNumber)) {
                    furnaceBatchNumber = true;
                }
                if (!(popDataList[i].warrantyNumber)) {
                    warrantyNumber = true;
                }
                if (popDataList[i].width === undefined||popDataList[i].width === null) {
                    width = true;
                }
            }
            // if (receiveBatchNumber) {
            //     message.error("请您填写收货批次！");
            //     return false;
            // }
            if (materialStandard) {
                message.error("请您选择标准！");
                return false;
            }
            if (structureTexture) {
                message.error("请您选择材质！");
                return false;
            }
            if (length) {
                message.error("请您填写长度！");
                return false;
            }
            if (width) {
                message.error("请您填写宽度！");
                return false;
            }
            if (locator) {
                message.error("请您选择区位！");
                return false;
            }
            if (reservoir) {
                message.error("请您选择库位！");
                return false;
            }
            if (furnaceBatchNumber) {
                message.error("请您填写炉批号！");
                return false;
            }
            if (warrantyNumber) {
                message.error("请您填写质保书号！");
                return false;
            }
            popDataList.forEach((item: any) => {
                if (item.id && item.num && item.num > 0) {
                    item["materialStockId"] = item.id
                    // 删除id属性
                    delete item.id;
                } else {
                    delete item.id;
                }
            })
            const v: any = {
                stockTakingDetailDTOList: popDataList,
                warehouseName: batchingStrategy?.filter((item: any) => item.id === baseInfo.warehouseId)[0].name,
                warehouseId: baseInfo.warehouseId
            }
            if (props.isEdit) {
                v.id = props.id
                v.stockTakingNumber = props.stockTakingNumber
                v.takingNumberStatus = props.takingNumberStatus
            }
            stockTakingRun(v);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (popDataList.length < 1) {
                message.error("请您选择入库明细!");
                return false;
            }
            popDataList.forEach((item: any) => {
                if (item.id && item.num && item.num > 0) {
                    item["materialStockId"] = item.id
                    // 删除id属性
                    delete item.id;
                } else {
                    delete item.id;
                }
            })
            const v: any = {
                stockTakingDetailDTOList: popDataList,
                warehouseName: batchingStrategy?.filter((item: any) => item.id === baseInfo.warehouseId)[0].name,
                warehouseId: baseInfo.warehouseId
            }
            if (props.isEdit) {
                v.id = props.id
                v.stockTakingNumber = props.stockTakingNumber
                v.takingNumberStatus = props.takingNumberStatus
            }
            saveRun(v);
        } catch (error) {
            console.log(error);
        }
    }

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
            // 盘点仓库修改后入库明细清空
            getInWarehousing(fields.warehouseId,1)
            setMaterialList([])
            setPopDataList([])
            return;
        }
    }

    const { loading: finishLoading ,run: stockTakingRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/stockTaking/finish`, data)
            message.success("完成盘点！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 保存
    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[props.isEdit ? "put" : "post"](`/tower-storage/stockTaking`, data)
            message.success(props.isEdit ? "编辑成功！" : "创建成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取利用率
    const { data: statisticsData, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/tax`)
            if (result.length > 0) {
                for (let i = 0; i < result.length; i += 1) {
                    if (result[i].modeName === "材料税率") {
                        resole(result[i]);
                        return;
                    }
                }
            }
            resole(result || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: getDataRun, data: detailData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-storage/stockTaking/detail/${props.id}`)
            result.map((item: any) => item["source"] = 1)
            setMaterialList([
                ...result,
                ...materialList
            ])
            setPopDataList([
                ...result,
                ...popDataList
            ])
            resove(result || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
            run();
            if (props?.isEdit) {
                setWarehouseId((props?.warehouseId as any));
                getInWarehousing(props?.warehouseId,1)
                getDataRun();
            } else {
                addCollectionForm.resetFields();
                setWarehouseId("");
            }
        }
    }, [props.visible])
    //库区库位
    const { data: locator } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree/${warehouseId}`)
            resole(result?.map((item: any) => ({
                label: item.name,
                value: item.id,
                key: item.id,
                disabled: true,
                children: item.children?.map((cItem: any) => ({
                    label: cItem.name,
                    value: cItem.id,
                    key: cItem.id
                }) || [])
            })) || [])
        } catch (error) {
            reject(error)
        }
    }), { ready: !!warehouseId, refreshDeps: [warehouseId] })
    // 获取仓库/库区/库位
    const getInWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            id,
            type,
        });
        switch (type) {
            case 1:
                setInReservoirArea(data)
                break;
            case 2:
                setInLocation(data)
                break;
            default:
                break;
        }
    }
    const handleInReservoirChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    reservoirId: InReservoirArea.filter((itemOne:any)=>{return itemOne?.name===value})[0].id,
                    reservoirName: value,
                })
            }
            return item
        })
        getInWarehousing(InReservoirArea.filter((itemOne:any)=>{return itemOne?.name===value})[0].id, 2)
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    const handleInLocatorChange = (value: string, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    locatorId: InLocation.filter((itemOne:any)=>{return itemOne?.name===value})[0].id,
                    locatorName: value
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }
    return (
        <Modal
            title={props.isEdit ? "编辑盘点单" : "新建盘点单"}
            visible={props.visible}
            onCancel={() => {
                setMaterialList([]);
                setPopDataList([]);
                props?.handleCreate({ code: 1 });
            }}
            destroyOnClose
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    props?.handleCreate({ code: 1 });
                }}>
                    关闭
                </Button>,
                <Button key="create" type="primary" onClick={() => handleSuccessClick()} loading={finishLoading}>
                    完成盘点
                </Button>,
                <Button key="save" type="primary" onClick={() => handleCreateClick()} loading={saveLoading}>
                    保存
                </Button>
            ]}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                edit
                dataSource={props.isEdit ? {
                    ...props
                } : {}}
                col={2}
                classStyle="baseInfo"
                columns={(props.isEdit ? baseInfoEditColumn : baseInfoColumn).map((item: any) => {
                    if (item.dataIndex === "warehouseId") {
                        return ({
                            ...item, enum: batchingStrategy?.map((item: any) => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    return item
                })}
                onChange={performanceBondChange}
            />
            <DetailTitle title="入库明细" />
            <div className='btnWrapper'>
                <Button type='primary' key="add" ghost disabled={!warehouseId} onClick={() => setVisible(true)}>选择库存</Button>
                <Button
                    type="primary"
                    ghost
                    key="add"
                    disabled={!warehouseId}
                    style={{marginLeft:'10px'}}
                    onClick={async () => {
                        setMaterialVisible(true)
                }}>选择物料档案</Button>
            </div>
            <CommonTable
                rowKey={"id"}
                style={{ padding: "0" }}
                columns={[
                    ...material.map((item: any) => {
                        if (["stockTakingNum"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={0} value={value || undefined} onChange={(value: number) => handleNumChange(value, key)} key={key} />
                            })
                        }
                        if (item.dataIndex === "length") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => lengthChange(value, key)} key={key} />
                            })
                        }
                        if (item.dataIndex === "width") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber
                                    min={0}
                                    max={99999}
                                    value={value}
                                    precision={0}
                                    onChange={(value: number) => widthChange(value, key)} key={key} />
                            })
                        }
                        if (item.dataIndex === "receiveBatchNumber") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Input
                                    defaultValue={value || undefined}
                                    placeholder='自动生成'
                                    style={{width: '150px'}}
                                    disabled
                                    // onBlur={(e: any) => handleABatchChange(e.target.value, key)}
                                 />
                            })
                        }
                        if (item.dataIndex === "furnaceBatchNumber") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Input
                                    defaultValue={value || undefined}
                                    style={{width: '150px'}}
                                    onBlur={(e: any) => handleBBatchChange(e.target.value, key)}
                                 />
                            })
                        }
                        if (item.dataIndex === "warrantyNumber") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Input
                                    defaultValue={value || undefined}
                                    style={{width: '150px'}}
                                    onBlur={(e: any) => handleCBatchChange(e.target.value, key)}
                                 />
                            })
                        }
                        if (item.dataIndex === "taxPrice") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber
                                    min={0}
                                    value={value}
                                    precision={2}
                                    onChange={(value: number) => taxPriceChange(value, key)} key={key} />
                            })
                        }
                        if (item.dataIndex === "materialStandard") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Select
                                    style={{ width: '150px' }}
                                    labelInValue
                                    value={{
                                        label: popDataList[key]?.materialStandardName,
                                        value: popDataList[key]?.materialStandard
                                    } as any}
                                    onChange={(e: any) => {
                                        console.log(e)
                                        const newData = popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    materialStandard: e.value,
                                                    materialStandardName: e.label
                                                }
                                            }
                                            return item
                                        })
                                        setPopDataList(newData.slice(0))
                                    }}>
                                    {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                                </Select>
                            })
                        }
                        if (item.dataIndex === "structureTexture") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Select
                                    style={{ width: '150px' }}
                                    labelInValue
                                    value={{ label: popDataList[key]?.structureTexture, value: popDataList[key]?.structureTextureId } as any}
                                    onChange={(e: any) => {
                                        const newData = popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    structureTextureId: e.value,
                                                    structureTexture: e.label
                                                }
                                            }
                                            return item
                                        })
                                        setPopDataList(newData.slice(0))
                                    }}>
                                    {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                                </Select>
                            })
                        }
                        if (item.dataIndex === "profitAndLossNum") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <span>{`${records.profitAndLossNum}`}</span>
                            })
                        }
                        if (item.dataIndex==="reservoirName") {
                            return ({
                                ...item,
                                render: (value: string, records: any, key: number) => <Select
                                            className="select"
                                            style={{ width: "100%" }}
                                            value={value ? value : '请选择'}
                                            onChange={(val) => { handleInReservoirChange(val,records.id) }}
                                        >
                                            {
                                                InReservoirArea.map((item, index) => {
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
                        if (item.dataIndex==='locatorName') {
                            return ({
                                ...item,
                                render: (value: string, records: any, key: number) => <Select
                                            className="select"
                                            style={{ width: "100%" }}
                                            value={value ? value : '请选择'}
                                            onChange={(val) => { handleInLocatorChange(val,records.id) }}
                                        >
                                            {
                                                InLocation.map((item, index) => {
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
                        return item
                    }),
                    {
                        title: "操作",
                        fixed: "right",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            {/* <Button type="link" style={{marginRight: 8}} onClick={() => handleCopy(records)}>复制</Button> */}
                            <Button type="link" onClick={() => handleRemove(records.id)}>移除</Button>
                        </>
                    }]}
                pagination={false}
                dataSource={popDataList} />
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
                        search: (addMaterial as any).search.map((item: any) => {
                            if (item.dataIndex === 'materialStandard') {
                                return ({
                                    ...item,
                                    enum: [{value:'',label:'全部'},...materialStandardEnum]
                                })
                            }
                            if (item.dataIndex === 'structureTexture') {
                                return ({
                                    ...item,
                                    enum: [{value:'',label:'全部'},...structureTextureEnum]
                                })
                            }
                            if (item.dataIndex === "locatorId") {
                                return ({
                                    ...item,
                                    treeData: locator
                                })
                            }
                            return item
                        }),
                        path: `${addMaterial.path}?warehouseId=${warehouseId}`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
                        console.log(((110.83 || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6), "====>>", statisticsData?.taxVal)
                        setMaterialList([
                            // ...materialList,
                            ...fields.map((item: any) => ({
                                ...item,
                                materialId: item.id,
                                source: item.source || 2,
                                materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                                materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                                structureTextureId: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                                structureTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                                width: item.width?item.width:0,

                                /**
                                 *  账面数量=当前收货批次下当前原材料的库存数量
                                    账面重量=根据账面数量计算，按照各自重量计算公式计算（保留三位小数）
                                    盘点数量=用户手动输入的数值，默认显示库存数量，用户可手动修改
                                    盘点重量=根据盘点数量计算，根据账面数量计算，按照各自重量计算公式计算（保留三位小数）
                                    盈亏数量=盘点数量-账面数量
                                    盈亏重量=盘点重量-账面重量
                                    单价=库存中当前原材料的含税单价
                                    账面金额=当前原材料重量*单价（保留两位小数）
                                    盘点金额=盘点重量*单价（保留两位小数）
                                    盈亏金额=盘点金额-账面金额
                                    不含税单价=单价/(1+材料税率/100)（保留六位小数）
                                    不含税金额=不含税单价*盈亏重量（保留两位小数）
                                 */
                                stockTakingNum: item.stockTakingNum || item.num, // 盘点数量
                                profitAndLossNum: ((item.stockTakingNum || item.num) || 1) - item.num, // 盈亏数量
                                // stockTakingWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3), // 盘点重量
                                stockTakingWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) * ((item.stockTakingNum || item.num) || 1) / 1000).toFixed(3),
                                // 盈亏重量 = 盘点重量 - 账目重量
                                profitAndLossWeight: ((+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) * ((item.stockTakingNum || item.num) || 1) / 1000).toFixed(3))) - (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                            : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                                : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)))).toFixed(3),
                                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) / 1000).toFixed(3),
                                // totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3), // 账面重量
                                totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3),
                                taxPrice: item.taxPrice || 0, // 单价
                                // 账目金额
                                totalTaxPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2),
                                // 盘点金额
                                // stockTakingPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                                stockTakingPrice: (Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2),
                                // 盈亏金额
                                profitAndLossPrice: ((+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2)) - (+(Number(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                            : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                                : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)) * (item.taxPrice || 0)).toFixed(2))).toFixed(2),
                                // 不含税单价
                                unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                                // 不含税金额
                                totalUnTaxPrice: (Number(((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (+((+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.stockTakingNum || item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * ((item.stockTakingNum || item.num) || 1) / 1000).toFixed(3))) - (+(item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * ((item.num) || 1) / 1000 / 1000).toFixed(3)
                                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * ((item.num) || 1) / 1000 / 1000 / 1000).toFixed(3)
                                            : (Number(item?.proportion || 1) * ((item.num) || 1) / 1000).toFixed(3)))).toFixed(3))).toFixed(2)
                            }))
                        ] || [])
                    }}
                />
            </Modal>
            <Modal width={addNewMaterial.width || 520} title={`选择${addNewMaterial.title}`} destroyOnClose visible={materialVisible}
                onOk={handleAddMaterialModalOk} onCancel={() => setMaterialVisible(false)}>
                <PopTableContent data={{
                    ...(addNewMaterial as any),
                    columns: (addNewMaterial as any).columns.map((item: any) => {
                        if (item.dataIndex === "standard") {
                            return ({
                                ...item,
                                type: "select",
                                enum: materialStandardEnum
                            })
                        }
                        return item
                    })
                }}
                    value={{
                        id: "",
                        records: [],
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
                        // fields.map((element: any, index: number) => {
                        //     if (element.structureSpec) {
                        //         element["spec"] = element.structureSpec;
                        //         element["weight"] = ((Number(element?.proportion || 1) * Number(element.length || 1)) / 1000).toFixed(3);
                        //         element["totalWeight"] = ((Number(element?.proportion || 1) * Number(element.length || 1) * (element.planPurchaseNum || 1)) / 1000).toFixed(3);
                        //     }
                        // });
                        setAddMaterialList([
                            // ...materialList,
                            ...fields.map((item: any) => ({
                                ...item,
                                materialId: item.id,
                                source: item.source || 2,
                                materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                                materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                                structureTextureId: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                                structureTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                                width: item.width?item.width:0,

                                /**
                                 *  账面数量=当前收货批次下当前原材料的库存数量
                                    账面重量=根据账面数量计算，按照各自重量计算公式计算（保留三位小数）
                                    盘点数量=用户手动输入的数值，默认显示库存数量，用户可手动修改
                                    盘点重量=根据盘点数量计算，根据账面数量计算，按照各自重量计算公式计算（保留三位小数）
                                    盈亏数量=盘点数量-账面数量
                                    盈亏重量=盘点重量-账面重量
                                    单价=库存中当前原材料的含税单价
                                    账面金额=当前原材料重量*单价（保留两位小数）
                                    盘点金额=盘点重量*单价（保留两位小数）
                                    盈亏金额=盘点金额-账面金额
                                    不含税单价=单价/(1+材料税率/100)（保留六位小数）
                                    不含税金额=不含税单价*盈亏重量（保留两位小数）
                                 */
                                num: '0',
                                stockTakingNum: 0, // 盘点数量
                                profitAndLossNum: 0, // 盈亏数量
                                // stockTakingWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3), // 盘点重量
                                stockTakingWeight: 0,
                                // 盈亏重量 = 盘点重量 - 账目重量
                                profitAndLossWeight: 0,
                                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                                        : (Number(item?.proportion || 1) / 1000).toFixed(3),
                                // totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3), // 账面重量
                                totalWeight: '0',
                                taxPrice: item.taxPrice || 0, // 单价
                                // 账目金额
                                totalTaxPrice: 0,
                                // 盘点金额
                                // stockTakingPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                                stockTakingPrice: 0,
                                // 盈亏金额
                                profitAndLossPrice: 0,
                                // 不含税单价
                                unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                                // 不含税金额
                                totalUnTaxPrice: 0
                            }))
                        ] || [])
                    }} />
            </Modal>
        </Modal>
    )
}