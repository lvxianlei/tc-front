/**
 * 迭代配料重写
 * author: mschange
 * time: 2022/4/21
 */
import { Button, Checkbox, Col, Descriptions, Divider, Form, message, Modal, Radio, Row, Select, Table, Tabs } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import { StockColumn, ConstructionDetailsColumn, BatchingScheme } from "./IngredientsList.json";

import InheritOneIngredient from "./BatchingRelatedPopFrame/InheritOneIngredient"; // 继承一次配料
import AllocatedScheme from "./BatchingRelatedPopFrame/AllocatedScheme"; // 已配方案
import SelectMeters from "./BatchingRelatedPopFrame/SelectMeters"; // 选择米数
import ComparisonOfSelectedSchemes from "./BatchingRelatedPopFrame/ComparisonOfSelectedSchemes"; // 已选方案对比
import SelectWarehouse from "./BatchingRelatedPopFrame/SelectWarehouse"; // 选择仓库

import "./ingredientsList.less"
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

interface Panes {
    title?: string
    key?: string
    closable?: boolean
    [key: string]: any
}

interface BtnList {
    key: string
    value: string
    type?: "link" | "text" | "ghost" | "primary" | "default" | "dashed" | undefined
}

interface Gobal {
    id: string
    sortChildren: any[]
}
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export default function IngredientsList(): React.ReactNode {
    const history = useHistory()
    const [ serarchForm ] = Form.useForm();
    // 传递的参数 status: 状态 productionBatchNo：批次号 productCategoryName： 塔型 materialStandardName： 标准
    const params = useParams<{ id: string, status: string, productionBatchNo: string, productCategoryName: string, materialStandardName: string }>();
    console.log(params, "=========>>>>>")

    // 切换tab数据
    // const [panes, setPanes] = useState<Panes[]>([
    //     { title: "方案1", key: "fangan1", closable: false }
    // ])

    // 按钮
    const btnList: BtnList[] = [
        { key: "inherit", value: "继承一次方案" },
        { key: "fast", value: "快速配料" },
        { key: "programme", value: "已配方案" },
        { key: "save", value: "保存" },
        { key: "generate", value: "生成配料方案" },
        { key: "batchingStrategy", value: "配料策略设置" },
        { key: "goback", value: "返回", type: "default" }
    ]

    // 全局存储的数据接口
    const [globallyStoredData, setGloballyStoredData] = useState<any>({});

    // tab选中的项
    const [activeKey, setActiveKey] = useState<string>("fangan1");
    // 库存单选
    const [value, setValue] = useState<string>("2");
    // 构建分类明细选择的集合
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    // 控制继承一次方案
    const [visible, setVisible] = useState<boolean>(false);
    // 控制已配方案
    const [visibleAllocatedScheme, setVisibleAllocatedScheme] = useState<boolean>(false);
    // 控制选择米数
    const [visibleSelectMeters, setVisibleSelectMeters] = useState<boolean>(false);
    // 控制已选方案对比
    const [visibleComparisonOfSelectedSchemes, setVisibleComparisonOfSelectedSchemes] = useState<boolean>(false);
    // 控制选择仓库
    const [visibleSelectWarehouse, setVisibleSelectWarehouse] = useState<boolean>(false);
    // 米数数据
    const [ meterNumber, setMeterNumber ] = useState<any[]>([]);

    // 构建分类当前选中项
    const [activeSort, setActiveSort] = useState<string>("");
    // 构建分类数据
    const [constructionClassification, setConstructionClassification] = useState<any[]>([]);
    // 构建明细数据
    const [sortDetailList, setSortDetailList] = useState<any[]>([]);
    // 库存列表数据
    const [availableInventoryData, setAvailableInventoryData] = useState<any[]>([]);
    // 选中的构建明细列表
    const [selectedRowCheck, setSelectedRowCheck] = useState<any[]>([]);
    // 备选方案
    const [alternativeData, setAlternativeData] = useState<any[]>([]);
    // 已选方案对比的数据
    const [schemeComparison, setSchemeComparison] = useState<any[]>([]);
    // 已配方案的全部数据
    const [allocatedScheme, setAllocatedScheme] = useState<any[]>([]);
    // 继承一次方案的数据
    const [inheritScheme, setInheritScheme] = useState<any[]>([]);

    // 已选方案 用于计算数量
    const [selectedScheme, setSelectedScheme] = useState<any[]>([]);
    // 存储仓库id
    const [warehouseId, setWarehouseId] = useState<any>([]);
    // 过滤
    const [sort, setSort] = useState<string>("");
    let [count, setCount] = useState<number>(0);
    // 操作按钮
    const handleBtnClick = (options: BtnList) => {
        switch (options.key) {
            case "goback":
                history.go(-1);
                break;
            case "inherit":
                getPurchaseBatchingSchemeList(params?.productionBatchNo, activeSort.split("_")[0], activeSort.split("_")[1]);
                // setVisible(true);
                break;
            case "programme":
                handleAllocatedScheme();
                break;
            case "fast":
                message.error("暂未不支持该功能");
                break;
            case "batchingStrategy":
                history.push("/config/configList/angleSteel")
                break;
            case "save":
                const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
                if (panes.length !== 1) {
                    message.error("请您先进行方案对比!");
                    return false;
                }
                handleSaveData(1);
                break;
            case "generate":
                const result = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
                if (result.length !== 1) {
                    message.error("请您先进行方案对比!");
                    return false;
                }
                handleSaveData(2);
                break;
            default:
                break;
        }
    }

    // 保存数据处理
    const handleSaveData = (code: number) => {
        const result = globallyStoredData.sortChildren;
        let v: any[] = [];
        for (let i = 0; i < result.length; i += 1) {
            for (let p = 0; p < result[i].children.length; p += 1) {
                v = v.concat(result[i].children[p].selectedScheme)
            }
        }
        console.log(v, "保存的数据");
        if (v.length < 1) {
            message.error("暂无已选方案！");
            return false;
        }
        const res = {
            produceId: params.id,
            schemeDtos: v
        }
        if (code === 1) {
            getPurchaseBatchingScheme(res)
        } else {
            getFinish(res);
        }
    }

    // 新增/删除
    const onEdit = (targetKey: any, action: any) => {
        action === "remove" ?
            remove(targetKey)
            : add();
    }

    // 方案tab切换
    const onTabChange = (activeKey: string) => {
        console.log(activeKey, "====>>")
        setActiveKey(activeKey);
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        serarchForm.resetFields();
        serarchForm.setFieldsValue({
            ...panes[index2].batchingStrategy
        })
    }

    // 继承一次方案的回调
    const handleInheritClick = (options: any) => {
        let v = globallyStoredData?.sortChildren;
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.sortChildren?.findIndex((item: any) => item.key === activeSort);
        // 全局存储已选方案
        const programme = panes.filter((item: any) => item.key === activeKey);
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        // selectedScheme
        panes[index2].selectedScheme = options || []
        // 页面存储已选方案，计算
        const {
            meterNumber,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        } = calculationStatistics(panes[index2].selectedScheme);
        panes[index2].selectedSchemeSummary = [{
            meterNumber,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        }]
        v[index].children = panes;
        console.log(v, "点击选中后的修改")
        setGloballyStoredData({
            id: params.id,
            sortChildren: v
        })
        // 清空备选方案
        setAlternativeData([]);
        // 展示的已选方案
        setSelectedScheme(panes[index2].selectedScheme);
    }

    // 新增tab
    const add = () => {
        let v = globallyStoredData?.sortChildren;
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.sortChildren?.findIndex((item: any) => item.key === activeSort);
        // 存储配料策略
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        console.log(index, "index")
        if (panes[index2].selectedScheme.length < 1) {
            message.error("请您先配置当前的方案！");
            return false;
        }
        if (panes.length >= 5) {
            message.error("方案最多增加五套！")
            return false;
        }
        const news = [
            ...globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children,
            {
                title: `方案${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}`,
                key: `fangan${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}`,
                selectedScheme: [], // 已选方案数组
                batchingStrategy: {}, // 配料策略
                selectedSchemeSummary: [], // 已选方案汇总一条数据
            }
        ]
        v[index].children = news;

        // 存配料策略
        panes[index2].batchingStrategy = serarchForm.getFieldsValue();
        // 清除配料策略 构建明细
        setSelectedRowKeysCheck([]);
        setSelectedRowCheck([]);
        serarchForm.resetFields();
        // 存储数据
        setActiveKey(`fangan${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}`);
        setGloballyStoredData({
            id: params.id,
            sortChildren: v
        })
    };

    // 移除
    const remove = (targetKey: string) => {
        let newActiveKey: any = activeKey;
        let lastIndex: any;
        let v = globallyStoredData?.sortChildren;
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.sortChildren?.findIndex((item: any) => item.key === activeSort);
        panes.forEach((pane: { key: string; }, i: number) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = panes.filter((pane: { key: string; }) => pane.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        v[index].children = newPanes;
        console.log(newPanes, "=====>>>新增======》》", newActiveKey)
        setActiveKey(newActiveKey);
        setGloballyStoredData({
            id: params.id,
            sortChildren: v
        })
        // form处理
        serarchForm.setFieldsValue({
            ...newPanes[0].batchingStrategy
        })
    };

    // 库存单选改变
    const onRaioChange = (e: any) => {
        setValue(e.target.value);
    }

    // 构建明细多选触发
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            console.log(selectedRows, "selectedRows", selectedRowKeys)
            setSelectedRowKeysCheck(selectedRowKeys);
            setSelectedRowCheck(selectedRows)
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.noIngredients <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };

    // 已配方案
    const handleAllocatedScheme = () => {
        // 已配方案的数据
        const result = globallyStoredData.sortChildren;
        let v: any[] = [];
        for (let i = 0; i < result.length; i += 1) {
            for (let p = 0; p < result[i].children.length; p += 1) {
                v = v.concat(result[i].children[p].selectedScheme)
            }
        }
        console.log(v, "所有已配方案");
        setAllocatedScheme(v);
        setVisibleAllocatedScheme(true);
    }

    // 已选方案移除
    const handleRemove = (idx: number) => {
        let v = globallyStoredData?.sortChildren;
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.sortChildren?.findIndex((item: any) => item.key === activeSort);
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        // console.log(panes[index2].selectedScheme.splice(idx, 1), "===>>", panes[index2].selectedScheme, idx)
        let t = panes[index2].selectedScheme;
        let result = t.splice(idx, 1);
        console.log(result, "删除后的原始数据", t)
        panes[index2].selectedScheme = t;
        const {
            meterNumber,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        } = calculationStatistics(panes[index2].selectedScheme);
        panes[index2].selectedSchemeSummary = [{
            meterNumber,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        }]
        v[index].children = panes;
        console.log(v, "v====================>>>")
        setGloballyStoredData({
            id: params.id,
            sortChildren: v
        })
    }

    // 统计数量
    const Statistics = () => {
        let map: Map<string, number> = new Map();
        map.clear();
        // 先获取当前构建下面 => 当前方案下的已选方案
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        console.log("统计数量，当前构建下的所有方案", panes, activeKey)
        // 当前方案下的已选方案
        const schemeData = panes?.filter((item: any) => item.key === activeKey)[0]?.selectedScheme || [];
        console.log("统计数量，当前方案下的已选方案", schemeData)

        // 存储数据
        for (let i = 0; i < schemeData.length; i += 1) {
            // 根据件号
            if (schemeData[i].component1) {
                if (map.has(schemeData[i].component1)) {
                    const result: number = map.get(schemeData[i].component1) || 0;
                    map.set(schemeData[i].component1, result + schemeData[i].num1 * schemeData[i].quantity);
                } else {
                    map.set(schemeData[i].component1, schemeData[i].num1 * schemeData[i].quantity);
                }
            }
            if (schemeData[i].component2) {
                if (map.has(schemeData[i].component2)) {
                    const result: number = map.get(schemeData[i].component2) || 0;
                    map.set(schemeData[i].component2, result + schemeData[i].num2 * schemeData[i].quantity);
                } else {
                    map.set(schemeData[i].component2, schemeData[i].num2 * schemeData[i].quantity);
                }
            }
            if (schemeData[i].component3) {
                if (map.has(schemeData[i].component3)) {
                    const result: number = map.get(schemeData[i].component3) || 0;
                    map.set(schemeData[i].component3, result + schemeData[i].num3 * schemeData[i].quantity);
                } else {
                    map.set(schemeData[i].component3, schemeData[i].num3 * schemeData[i].quantity);
                }
            }
            if (schemeData[i].component4) {
                if (map.has(schemeData[i].component4)) {
                    const result: number = map.get(schemeData[i].component4) || 0;
                    map.set(schemeData[i].component4, result + schemeData[i].num4 * schemeData[i].quantity);
                } else {
                    map.set(schemeData[i].component4, schemeData[i].num4 * schemeData[i].quantity);
                }
            }
            // 根据原材料长度
            if (schemeData[i].length) {
                if (map.has(schemeData[i].length)) {
                    const result = map.get(schemeData[i].length);
                    map.set(schemeData[i].length, result + schemeData[i].quantity);
                } else {
                    map.set(schemeData[i].length, schemeData[i].quantity);
                }
            }
            // 添加构建分类map
            if (map.has(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`)) {
                const result = map.get(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`) || 0;
                let num = (schemeData[i].num1 || 0) * schemeData[i].quantity + (schemeData[i].num2 || 0) * schemeData[i].quantity + (schemeData[i].num3 || 0) * schemeData[i].quantity + (schemeData[i].num4 || 0) * schemeData[i].quantity
                map.set(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`, result + num);
            } else {
                let num = (schemeData[i].num1 || 0) * schemeData[i].quantity + (schemeData[i].num2 || 0) * schemeData[i].quantity + (schemeData[i].num3 || 0) * schemeData[i].quantity + (schemeData[i].num4 || 0) * schemeData[i].quantity
                map.set(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`, num);
            }
        }
        console.log(map, "存储的数据")

        // 当已选方案发生变化，构建明细处理 
        let result:any = sortDetailList;
        for (let i = 0; i < result.length; i += 1) {
            if (map.has(result[i].code)) {
                // map对应存在，则需要减少
                let num:number = map.get(result[i]?.code) || 0;
                result[i].noIngredients = result[i].num - num;
            } else {
                result[i].noIngredients = result[i].num;
            }
        }
        console.log(result, "result")
        setSortDetailList(result.slice(0))

        // 库存发生变化
        let resultAvailableInventoryData:any = availableInventoryData;
        for (let i = 0; i < resultAvailableInventoryData.length; i += 1) {
            if (map.has(resultAvailableInventoryData[i].length)) {
                // map对应存在，则需要减少
                let num:number = map.get(resultAvailableInventoryData[i]?.length) || 0;
                resultAvailableInventoryData[i].alreadyNum = num;
            } else {
                resultAvailableInventoryData[i].alreadyNum = 0;
            }
        }
        setAvailableInventoryData(resultAvailableInventoryData.slice(0))

        // 构建分类
        let sort: any = constructionClassification;
        const ix = sort.findIndex((item: any) => `${item.structureTexture}_${item.structureSpec}` === activeSort)

        // 构建分类只改当前的数据
        if (sort.length > 0) {
            if (map.has(`${sort[ix].structureTexture}_${sort[ix].structureSpec}`)) {
                // map对应存在，则需要减少
                let num:number = map.get(`${sort[ix].structureTexture}_${sort[ix].structureSpec}`) || 0;
                sort[ix].notConfigured = sort[ix].totalNum - num;
            } else {
                sort[ix].notConfigured = sort[ix].totalNum;
            }
        }
        setConstructionClassification(sort.slice(0))
    }

    // 当已选方案发生改变
    useEffect(() => {
        console.log("需要修改数据了==============================>>>>>>>>>>>>>>>", constructionClassification)
        Statistics()
    }, [JSON.stringify(globallyStoredData), activeKey, activeSort, count])

    // 备选方案点击选中
    const handleAlternativeCick = (options: any) => {
        console.log(options, "======>>>")
        let v = globallyStoredData?.sortChildren;
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.sortChildren?.findIndex((item: any) => item.key === activeSort);
        // 全局存储已选方案
        const programme = panes.filter((item: any) => item.key === activeKey);
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        // selectedScheme
        panes[index2].selectedScheme = [
            ...programme[0].selectedScheme,
            options
        ]
        // 页面存储已选方案，计算
        const {
            meterNumber,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        } = calculationStatistics(panes[index2].selectedScheme);
        panes[index2].selectedSchemeSummary = [{
            meterNumber,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        }]
        v[index].children = panes;
        console.log(v, "点击选中后的修改")
        setGloballyStoredData({
            id: params.id,
            sortChildren: v
        })
        // 清空备选方案
        setAlternativeData([]);
        // 展示的已选方案
        setSelectedScheme(panes[index2].selectedScheme);
    }

    // 计算统计
    const calculationStatistics = (options: any) => {
        // 使用map统计拆号数
        let map: Map<string, number> = new Map();
        map.clear();
        let meterNumber: any = [], // 统计米数
            numberAll = 0, // 总数量
            surplusMaaterial = 0, // 余料总长 余料总长 = 余料长度 * 数量
            totalUtilization = 0, // 总利用率和 总利用率 = （单个利用率 * 数量）
            calculation: any = 0, // 最终返回的总利用率 总利用率和 / 总数量
            disassemblyNumber = 0; // 统计拆号数
        for (let i = 0; i < options.length; i += 1) {
            if (meterNumber.indexOf(options[i].length) === -1) {
                meterNumber.push(options[i].length);
            }
            numberAll = numberAll + options[i].quantity;
            surplusMaaterial = surplusMaaterial + (options[i].plannedSurplusLength * options[i].quantity);
            totalUtilization = totalUtilization + (options[i].utilizationRate * options[i].quantity);
            if (options[i].component1) {
                if (map.has(options[i].component1)) {
                    const result = map.get(options[i].component1) || 0;
                    map.set(options[i].component1, result + 1);
                } else {
                    map.set(options[i].component1, 1);
                }
            }
            if (options[i].component2) {
                if (map.has(options[i].component2)) {
                    const result = map.get(options[i].component2) || 0;
                    map.set(options[i].component2, result + 1);
                } else {
                    map.set(options[i].component2, 1);
                }
            }
            if (options[i].component3) {
                if (map.has(options[i].component3)) {
                    const result = map.get(options[i].component3) || 0;
                    map.set(options[i].component3, result + 1);
                } else {
                    map.set(options[i].component3, 1);
                }
            }
            if (options[i].component4) {
                if (map.has(options[i].component4)) {
                    const result = map.get(options[i].component4) || 0;
                    map.set(options[i].component4, result + 1);
                } else {
                    map.set(options[i].component4, 1);
                }
            }
        }
        calculation = (totalUtilization && numberAll) ? parseFloat((totalUtilization / numberAll) + "").toFixed(2) : 0; // 总利用率
        console.log(map, "===============>>>map")
        map.forEach((value: any) => {
            if (+value >= 2) {
                disassemblyNumber = disassemblyNumber + value;
            }
        })
        console.log(disassemblyNumber, "拆号数")
        return {
            meterNumber: meterNumber.join("、") || 0,
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        }
    }

    // 点击方案对比
    const handleSchemeComparison = () => {
        console.log(globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children)
        const res = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        let schemeComparisonList: any = [];
        for (let i = 0; i < res.length; i += 1) {
            if (res[i].selectedSchemeSummary.length > 0) {
                schemeComparisonList.push({
                    ...res[i].selectedSchemeSummary[0],
                    key: res[i].key
                });
            }
        }
        console.log(schemeComparisonList, "看看对比后的")
        setSchemeComparison(schemeComparisonList);
        setVisibleComparisonOfSelectedSchemes(true)
    }

    // 方案对比的回调
    const handleComparisonOfSelectedSchemes = (res: any) => {
        if (res.code) {
            console.log(globallyStoredData?.sortChildren)
            let v = globallyStoredData?.sortChildren;
            const index = globallyStoredData?.sortChildren?.findIndex((item: any) => item.key === activeSort);
            const result = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children.filter((v: any) => v.key === res.data[0]);
            result[0].title = "方案1";
            result[0].key = "fangan1";
            result[0].closable = false;
            v[index].children = result;
            v[index].isContrast = true; // 已对比
            setActiveKey("fangan1");
            setGloballyStoredData({
                id: params.id,
                sortChildren: v
            })
            serarchForm.setFieldsValue({
                ...result[0].batchingStrategy
            })
        }
        setVisibleComparisonOfSelectedSchemes(false);
    }

    // 点击构建分类
    const handleConstructionClassification = (options: string) => {
        let v = globallyStoredData?.sortChildren;
        const panes = globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children;
        if (panes.length !== 1) {
            message.error("请您先进行方案对比!");
            return false;
        }
        panes[0].batchingStrategy = serarchForm.getFieldsValue();
        setActiveSort(options);
        setActiveKey("fangan1");
        setGloballyStoredData({
            id: params.id,
            sortChildren: v
        })
        const result = globallyStoredData?.sortChildren?.filter((v: any) => v.key === options)[0].children;
        console.log(result, "======================>>>>", options)
        // 重新调用
        getIngredient(options.split("_")[1]);
        // 获取构建分类明细
        getSortDetail(params.id, options.split("_")[1], options.split("_")[0]);
        // 获取库存
        getAvailableInventoryList("", 2, "", "", options.split("_")[0],options.split("_")[1]);
        if (JSON.stringify(result[0].batchingStrategy) == "{}") {
            serarchForm.resetFields();
        } else {
            serarchForm.setFieldsValue({
                ...result[0].batchingStrategy
            })
        }
        setCount(++count);
        setAlternativeData([])
    }

    // 初始获取数据
    useEffect(() => {
        // 获取配料策略的利用率
        getBatchingStrategy();
        // 获取构建分类
        getSort(params.id);
    }, [])

    // 保存操作
    const { run: getPurchaseBatchingScheme } = useRequest<{ [key: string]: any }>((options: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/produceIngredients/programme`, options);
            console.log(result, "保存")
            if (result) {
                message.success("保存成功！");
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 生成配料
    const { run: getFinish } = useRequest<{ [key: string]: any }>((options: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/produceIngredients/programme/create`, options);
            console.log(result, "保存")
            if (result) {
                message.success("生成配料成功！");
                history.go(-1);
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    // 获取配料策略-刀口、端口、余量等数据
    const { run: getIngredient, data: IngredientData } = useRequest<{ [key: string]: any }>((spec: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/angleConfigStrategy/ingredient`, {spec});
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    // 获取利用率
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/angleConfigStrategy/getIngredientsConfigList`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取构建分类
    const { run: getSort, data: SortData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/loftingScheme/${id}`);
            // 获取页面配料方案
            const schemeResult: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/programme/getLoftingSchemesByProduceId`, {
                produceId: params.id
            });
            console.log(schemeResult, "获取到的配料方案");
            result?.map((element: any, index: number) => {
                element["key"] = `${element.structureTexture}_${index}`
            });
            setConstructionClassification((result as any) || []);
            if (result?.length > 0) {
                setActiveSort(`${result?.[0].structureTexture}_${result?.[0].structureSpec}`)
                // 根据构建分类获取配料策略
                getIngredient(result?.[0]?.structureSpec);
                // // 获取构建分类明细
                getSortDetail(params.id, result?.[0]?.structureSpec, result?.[0]?.structureTexture);
                // 获取库存,
                getAvailableInventoryList("", 2, "", "", result?.[0].structureTexture, result?.[0].structureSpec)

                // 全局存储数据结构
                // setGloballyStoredData
                const v: Gobal = {
                    id: params.id,
                    sortChildren: []
                }
                for (let i = 0; i < result.length; i += 1) {
                    const data = {
                        isContrast: false, // 是否对比
                        key: `${result?.[i].structureTexture}_${result?.[i].structureSpec}`, // 构建分类的唯一标识
                        children: [
                            {
                                title: "方案1",
                                key: "fangan1",
                                closable: false,
                                selectedScheme: [], // 已选方案数组
                                batchingStrategy: {}, // 配料策略
                                selectedSchemeSummary: [], // 已选方案汇总一条数据
                            }
                        ] // 二级数据 方案
                    }
                    v.sortChildren.push(data);
                }
                if (schemeResult?.loftingComponentMaterialVOS.length > 0) {
                    // 存在配料方案，合并处理
                    for (let i = 0; i < schemeResult?.loftingComponentMaterialVOS.length; i += 1) {
                        for (let p = 0; p < v.sortChildren.length; p += 1) {
                            if (`${schemeResult?.loftingComponentMaterialVOS[i].structureTexture}_${schemeResult?.loftingComponentMaterialVOS[i].structureSpec}` === v.sortChildren[p].key) {
                                // 添加已选方案数量quantity
                                schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeVOS?.map((element: any, index: number) => {
                                    element["quantity"] = `${element.num}`
                                });
                                v.sortChildren[p].children[0].selectedScheme = schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeVOS;
                                v.sortChildren[p].children[0].selectedSchemeSummary = [{
                                    numberAll: schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeStatisticsListVO.quantity || 0,
                                    calculation: schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeStatisticsListVO.utilizationRate || 0,
                                    surplusMaaterial: schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeStatisticsListVO.plannedSurplusLength || 0,
                                    disassemblyNumber: schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeStatisticsListVO.disassemblyNum || 0,
                                    meterNumber: schemeResult?.loftingComponentMaterialVOS[i].loftingSchemeStatisticsListVO.meterRange || 0
                                }]
                            }
                        }
                    }
                }
                console.log(v, "最终的汇总数据==================>>>>")
                setGloballyStoredData(v);
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取构建分类明细
    const { run: getSortDetail } = useRequest<{ [key: string]: any }>((purchaseTowerId: string, spec: string, texture: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/loftingScheme/${purchaseTowerId}/${spec}/${texture}`)
            result?.map((element: any, index: number) => {
                element["key"] = `${element.id}`
            });
            console.log(result, "构建分类明细")
            setSortDetailList((result as any) || [])
            setCount(++count)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取库存
    const { run: getAvailableInventoryList, data: AvailableInventoryData } = useRequest<{ [key: string]: any }>((
        latestArrivalTime: string = "",
        inRoadInventory: number = 2,
        length: string = "",
        warehouseId: string = "",
        structureTexture: string = "",
        structureSpec: string = ""
    ) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-storage/materialStock/getAvailableInventoryList`, {
                warehouseId,
                structureTexture, // 材质
                structureSpec, // 规格
                latestArrivalTime, // 最晚到货时间
                length,
                inRoadInventory, // 是否使用在途库存（1:使用 2:不使用）
            });
            let v: any[] = [];
            for (let i = 0; i < result.length; i += 1) {
                v.push({
                    meterNumber: result[i].length
                })
            }
            setAvailableInventoryData(result || []);
            // 获取米数
            setMeterNumber(v);
            setCount(++count);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 手动配料
    const { run: getScheme } = useRequest<{ [key: string]: any }>((code: number = 1, sorts: string = "") => new Promise(async (resole, reject) => {
        setAlternativeData([]);
        try {
            if (code === 1) {
                setSort("");
            }
            const serarchData = await serarchForm.validateFields();
            console.log(serarchData, "==========>>>")
            if (selectedRowCheck.length < 1) {
                message.error("请您选择构建明细！");
                return false;
            }
            // 重组构建明细数据
            const comp = [];
            for (let i = 0; i < sortDetailList.length; i += 1) {
                if (sortDetailList[i].id === selectedRowKeysCheck[0]) {
                    comp.push({
                        ...sortDetailList[i],
                        notConfigured: sortDetailList[i].noIngredients,
                        head: true
                    })
                } else {
                    comp.push({
                        ...sortDetailList[i],
                        notConfigured: sortDetailList[i].noIngredients,
                        head: false
                    })
                }
            }
            const result: any[] = await RequestUtil.post(`/tower-supply/produceIngredients/batcher/scheme`, {
                ...serarchData,
                components: comp, // 构建明细分类
                produceId: params.id, // 采购塔型的id
                stockDetails: availableInventoryData, // 库存信息
                structureSpec: activeSort.split("_")[1], // 规格
                structureTexture: activeSort.split("_")[0], // 材质
                useStock: false, // 是否使用实际库存
                sort: code === 1 ? "" : sorts
            });
            console.log(result, "手动配料")
            if (result.length < 1) {
                message.error("暂无合适的备选方案！");
                return false;
            }
            const v: any[] = [];
            result.map((item: any) => {
                v.push(Object.assign(item, { num: item.quantity }))
            })
            setAlternativeData(v || []);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 继承一次配料方案
    const { run: getPurchaseBatchingSchemeList } = useRequest<{ [key: string]: any }>((productionBatchNo: string, spec: string, texture: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/${productionBatchNo}/${spec}/${texture}`)
            result?.map((element: any, index: number) => {
                element["num"] = `${element.quantity}`
            });
            console.log(result, "继承一次配料方案")
            setInheritScheme((result) || [])
            setVisible(true);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    console.log(globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0], "全局", globallyStoredData?.sortChildren, activeSort)
    console.log(constructionClassification, "构建分类")
    return (
        <div className='ingredientsListWrapper'>
            <DetailContent operation={
                btnList.map((item: BtnList) => {
                    return <Button key={item.key} type={item.type ? item.type : "primary"} style={{marginRight: 16}} onClick={() => handleBtnClick(item)}>{ item.value }</Button>
                })
            }>
                <DetailTitle title="配料信息" key={"ingre"}/>
                <Descriptions bordered>
                    <Descriptions.Item label="批次号">{ params.productionBatchNo || "" }</Descriptions.Item>
                    <Descriptions.Item label="塔型">{ params.productCategoryName || "" }</Descriptions.Item>
                    <Descriptions.Item label="标准">{ params.materialStandardName || "" }</Descriptions.Item>
                </Descriptions>
                {
                    constructionClassification.length > 0 && <div className='content_wrapper'>
                        <div className='contentWrapperLeft' style={{maxHeight: document.documentElement.clientHeight - 240, overflow: "auto"}}>
                            {/* 构建list */}
                            {
                                constructionClassification?.map((item: any) => {
                                    const flag = activeSort === `${item.structureTexture}_${item.structureSpec}`;
                                    return <div className={`contentWrapperLeftlist ${flag ? "active" : ""}`} onClick={() => handleConstructionClassification(`${item.structureTexture}_${item.structureSpec}`)}>
                                        <div className='color' style={{
                                            backgroundColor: item.notConfigured === item.totalNum ? "#EE483C"
                                                : item.notConfigured === 0 ? "#13C519" : "#FFB631"
                                        }}></div>
                                        <div className='structure_wrapper'>
                                            <p>{ item.structureTexture }</p>
                                            <p>{ item.structureSpec }</p>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className='content_wrapper_ringht'>
                            <div style={{width: "100%"}}>
                                <Tabs
                                    type="editable-card"
                                    addIcon={<>新增方案</>}
                                    onChange={onTabChange}
                                    activeKey={activeKey}
                                    onEdit={(targetKey, action) => onEdit(targetKey, action)}
                                >
                                    {
                                        globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0]?.children?.map((item: Panes) => {
                                            return <TabPane tab={item.title} key={item.key} closable={item.closable} style={{position: "relative"}}>
                                                <div className='ingredients_content_wrapper'>
                                                    <div className='ingredients_content_wrapper_left'>
                                                        <DetailTitle title="配料策略" key={"strategy"}  operation={[
                                                            <Button></Button>
                                                        ]}/>
                                                        <Form {...formItemLayout} form={serarchForm} style={{border: "1px solid #eee", padding: "12px 16px", boxSizing: "border-box", marginBottom: 18}}>
                                                            <Form.Item
                                                                name="openNumber"
                                                                label="开数"
                                                                rules={[
                                                                    {
                                                                        "required": true,
                                                                        "message": "请选择开数"
                                                                    }
                                                                ]}
                                                            >
                                                                <Checkbox.Group>
                                                                    <Row>
                                                                        <Col span={6}>
                                                                            <Checkbox value="1" style={{ lineHeight: '32px' }}>
                                                                                1
                                                                            </Checkbox>
                                                                        </Col>
                                                                        <Col span={6}>
                                                                            <Checkbox value="2" style={{ lineHeight: '32px' }}>
                                                                                2
                                                                            </Checkbox>
                                                                        </Col>
                                                                        <Col span={6}>
                                                                            <Checkbox value="3" style={{ lineHeight: '32px' }}>
                                                                                3
                                                                            </Checkbox>
                                                                        </Col>
                                                                        <Col span={6}>
                                                                            <Checkbox value="4" style={{ lineHeight: '32px' }}>
                                                                            4
                                                                            </Checkbox>
                                                                        </Col>
                                                                    </Row>
                                                                </Checkbox.Group>
                                                            </Form.Item>
                                                            <Form.Item
                                                                name="edgeLoss"
                                                                label="刀口"
                                                                rules={[
                                                                    {
                                                                        "required": true,
                                                                        "message": "请选择刀口"
                                                                    }
                                                                ]}
                                                            >
                                                                <Select placeholder="请选择刀口">
                                                                    {
                                                                        IngredientData?.edgeLossList.map((item: any, index: number) => {
                                                                            return <Select.Option value={item} key={ `${ item }_${ index }` }>{ item }</Select.Option>
                                                                        })
                                                                    }
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="端头"
                                                                name="clampLoss"
                                                                rules={[
                                                                    {
                                                                        "required": true,
                                                                        "message": "请选择端头"
                                                                    }
                                                                ]}
                                                            >
                                                                    <Select placeholder="请选择端头">
                                                                        {
                                                                            IngredientData?.clampLossList.map((item: any, index: number) => {
                                                                                return <Select.Option value={item} key={ `${ item }_${ index }` }>{ item }</Select.Option>
                                                                            })
                                                                        }
                                                                    </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="余量"
                                                                name="margin"
                                                                rules={[
                                                                    {
                                                                        "required": true,
                                                                        "message": "请选择余量"
                                                                    }
                                                                ]}
                                                            >
                                                                    <Select placeholder="请选择余量">
                                                                        {
                                                                            IngredientData?.marginList.map((item: any, index: number) => {
                                                                                return <Select.Option value={item} key={ `${ item }_${ index }` }>{ item }</Select.Option>
                                                                            })
                                                                        }
                                                                    </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                name="utilizationRate"
                                                                label="利用率"
                                                                rules={[
                                                                    {
                                                                        "required": true,
                                                                        "message": "请选择利用率"
                                                                    }
                                                                ]}
                                                            >
                                                                <Select placeholder="请选择">
                                                                    {
                                                                        batchingStrategy?.utilizationRate?.policyDetailed.map((item: any, index: number) => {
                                                                            return <Select.Option value={item} key={ `${item}_${ index }` }>{ item }%</Select.Option>
                                                                        })
                                                                    }
                                                                </Select>
                                                            </Form.Item>
                                                        </Form>
                                                        <DetailTitle title="库存" key={"stock"} operation={[
                                                            <Button disabled={value === "1"} type="primary" ghost key="add" style={{ marginRight: 8 }} onClick={() => setVisibleSelectWarehouse(true)}>选择仓库</Button>,
                                                            <Button disabled={warehouseId.length < 1} type="primary" ghost key="choose" onClick={() => setVisibleSelectMeters(true)}>选择米数</Button>
                                                        ]} />
                                                        <Radio.Group onChange={onRaioChange} value={value} style={{marginBottom: 8}}>
                                                            {/* <Radio value={"1"}>理想库存</Radio> */}
                                                            <Radio value={"2"}>可用库存</Radio>
                                                        </Radio.Group>
                                                        <Table
                                                            size="small"
                                                            columns={[
                                                                ...StockColumn.map((item: any) => {
                                                                    if (item.dataIndex === "surplus") {
                                                                        return ({
                                                                            title: item.title,
                                                                            dataIndex: item.dataIndex,
                                                                            render: (_: any, record: any): React.ReactNode => {
                                                                                return (
                                                                                    <span>
                                                                                        { record?.totalNum - record?.alreadyNum }
                                                                                    </span>)
                                                                            }
                                                                        })
                                                                    }
                                                                    return item;
                                                                })
                                                            ]}
                                                            dataSource={availableInventoryData}
                                                            pagination={false}
                                                            scroll={{ y: 250 }}
                                                        />
                                                    </div>
                                                    <div className='ingredients_content_wrapper_right'>
                                                        <div className='ingredients_content_wrapper_right_detail'>
                                                            <DetailTitle key={"detail"} title="构件明细" operation={[
                                                                <Button type="primary" ghost key="add" style={{ marginRight: 8 }} onClick={() => {
                                                                    message.warn("该功能暂未开发！");
                                                                    return false;
                                                                }}>自动配料</Button>,
                                                                <Button type="primary" ghost key="choose" onClick={() => getScheme(1)}>手动配料</Button>
                                                            ]} />
                                                            <Table
                                                                size="small"
                                                                rowSelection={{
                                                                    type: "radio",
                                                                    ...rowSelectionCheck,
                                                                }}
                                                                key={"id"}
                                                                columns={ConstructionDetailsColumn}
                                                                dataSource={sortDetailList}
                                                                pagination={false}
                                                                scroll={{ y: 590 }}
                                                            />
                                                        </div>
                                                        <div className='ingredients_content_wrapper_right_programme'>
                                                            <div className='title_wrapper marginTop' style={{width: document.documentElement.clientWidth - 1000}}>
                                                                <div>已选方案
                                                                    <span className='textLabel'>已选米数：</span><span className='textValue'>{ item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).meterNumber : 0}</span>
                                                                    <span className='textLabel'>总数量：</span><span className='textValue'>{ item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).numberAll : 0}</span>
                                                                    <span className='textLabel'>拆号数：</span><span className='textValue'>{ item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).disassemblyNumber : 0}</span>
                                                                    <span className='textLabel'>余料总长：</span><span className='textValue'>{ item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).surplusMaaterial : 0}mm</span>
                                                                    <span className='textLabel'>总利用率：</span><span className='textValue'>{ item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).calculation : 0}%</span>
                                                                </div>
                                                            </div>
                                                            <div style={{width: document.documentElement.clientWidth - 1020}} className="alternativeWrapper">
                                                                <CommonTable
                                                                    size="small"
                                                                    columns={[
                                                                        ...BatchingScheme,
                                                                        {
                                                                            title: "操作",
                                                                            dataIndex: "opration",
                                                                            fixed: "right",
                                                                            width: 80,
                                                                            render: (_: any, record: any, index: number) => {
                                                                                return (
                                                                                    <>
                                                                                        <Button type="link" onClick={() => handleRemove(index)}>移除</Button>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        }
                                                                    ]}
                                                                    dataSource={item.selectedScheme.slice(0)}
                                                                    pagination={false}
                                                                    scroll={{ x: 1200, y: 200 }}
                                                                />
                                                            </div>
                                                            <div className='title_wrapper' style={{width: document.documentElement.clientWidth - 1028}}>
                                                                <div>备选方案</div>
                                                                <div>
                                                                    <span>排序</span>
                                                                    <Select placeholder="请选择" value={sort} style={{ width: 150 }} onChange={(res) => {
                                                                        setSort(res);
                                                                        getScheme(2, res);
                                                                    }}>
                                                                        <Select.Option value="">默认排序</Select.Option>
                                                                        <Select.Option value="1">完全下料优先</Select.Option>
                                                                        <Select.Option value="2">利用率<ArrowDownOutlined /></Select.Option>
                                                                        <Select.Option value="4">余料长度<ArrowDownOutlined /></Select.Option>
                                                                        <Select.Option value="5">余料长度<ArrowUpOutlined /></Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div style={{width: document.documentElement.clientWidth - 1020}} className="alternativeWrapper">
                                                                <CommonTable
                                                                    size="small"
                                                                    columns={[
                                                                        // ...BatchingScheme,
                                                                        ...BatchingScheme.map((item: any) => {
                                                                            if (
                                                                                item.dataIndex === 'component1'
                                                                                || item.dataIndex === "num1"
                                                                                || item.dataIndex === "len1"
                                                                                || item.dataIndex === 'component2'
                                                                                || item.dataIndex === "num2"
                                                                                || item.dataIndex === "len2"
                                                                                || item.dataIndex === 'component3'
                                                                                || item.dataIndex === "num3"
                                                                                || item.dataIndex === "len3"
                                                                                || item.dataIndex === 'component4'
                                                                                || item.dataIndex === "num4"
                                                                                || item.dataIndex === "len4"
                                                                            ) {
                                                                                return ({
                                                                                    title: item.title,
                                                                                    dataIndex: item.dataIndex,
                                                                                    width: item.width,
                                                                                    render: (_: any, record: any): React.ReactNode => (
                                                                                        // <span>{record[item.dataIndex]}</span>
                                                                                        <div style={{
                                                                                            color: record.lineHeightColumn.includes(item.dataIndex) ? "#fff" : "black",
                                                                                            backgroundColor: record.lineHeightColumn.includes(item.dataIndex) ? "green" : "",
                                                                                            height: "32px",
                                                                                            lineHeight: "32px"
                                                                                        }}>{record[item.dataIndex]}</div>
                                                                                    )
                                                                                })
                                                                            }
                                                                            if (item.dataIndex === 'utilizationRate') {
                                                                                return ({
                                                                                    title: item.title,
                                                                                    dataIndex: item.dataIndex,
                                                                                    width: item.width,
                                                                                    render: (_: any, record: any): React.ReactNode => (
                                                                                        <span>{record.utilizationRate}%</span>
                                                                                    )
                                                                                })
                                                                            }
                                                                            return item;
                                                                        }),
                                                                        {
                                                                            title: "操作",
                                                                            dataIndex: "opration",
                                                                            fixed: "right",
                                                                            width: 80,
                                                                            render: (_: any, record: any, index: number) => {
                                                                                return (
                                                                                    <>
                                                                                        <Button type="link" onClick={() => handleAlternativeCick(record)}>选中</Button>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        }
                                                                    ]}
                                                                    dataSource={alternativeData}
                                                                    pagination={false}
                                                                    scroll={{ x: 1200, y: 200 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabPane>
                                        })
                                    }
                                </Tabs>
                            </div>
                            <div className='operation_button'>
                                <Button ghost
                                    type="primary"
                                    disabled={globallyStoredData?.sortChildren?.filter((v: any) => v.key === activeSort)[0].children.length === 1}
                                    onClick={() => handleSchemeComparison()}>方案对比</Button>
                            </div>
                        </div>
                    </div>
                }
                
            </DetailContent>
            {/* 继承一次方案 */}
            <InheritOneIngredient visible={visible} inheritScheme={inheritScheme} hanleInheritSure={(res) => {
                console.log(res);
                if (res.code) {
                    handleInheritClick(res.data.selectedRowsCheck);
                }
                setVisible(false);
            }}/>
            {/* 已配方案 */}
            <AllocatedScheme visible={visibleAllocatedScheme} allocatedScheme={allocatedScheme} hanleInheritSure={() => {
                setVisibleAllocatedScheme(false);
            }} />
            {/* 选择米数 */}
            <SelectMeters visible={visibleSelectMeters} meterNumber={meterNumber} hanleInheritSure={(res) => {
                console.log(res, "res")
                if (res.code) {
                    getAvailableInventoryList("", 2, res.data.join(","), warehouseId.join(","), activeSort.split("_")[0],activeSort.split("_")[1]);
                }
                setVisibleSelectMeters(false);
            }} />
            {/* 已选方案对比 */}
            <ComparisonOfSelectedSchemes visible={visibleComparisonOfSelectedSchemes} schemeComparison={schemeComparison} hanleInheritSure={(res) => handleComparisonOfSelectedSchemes(res)} />
            {/* 选择仓库 */}
            <SelectWarehouse visible={visibleSelectWarehouse} hanleInheritSure={(res) => {
                console.log(res,)
                if (res.code) {
                    setWarehouseId(res.data.selectedRowKeysCheck);
                    if (res.data.inventory) {
                        getAvailableInventoryList(`${res.data.inventoryTime} 00:00:00`, 1, "", res.data.selectedRowKeysCheck.join(","), activeSort.split("_")[0],activeSort.split("_")[1]);
                    } else {
                        getAvailableInventoryList("", 2, "", res?.data.selectedRowKeysCheck.join(","), activeSort.split("_")[0],activeSort.split("_")[1]);
                    }
                }
                setVisibleSelectWarehouse(false);
            }} />
        </div>
    )
}