/**
 * 迭代配料重写
 * author: mschange
 * time: 2022/4/21
 */
import { Button, Checkbox, Col, Form, InputNumber, message, Modal, Radio, Row, Select, Tabs, Tooltip } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable as CommonTableBeFore, DetailContent, DetailTitle } from '../../common';
import CommonTable from '../../common/CommonAliTable';
import { ConstructionDetailsColumn, BatchingScheme } from "./IngredientsList.json";

import AllocatedScheme from "./BatchingRelatedPopFrame/AllocatedScheme"; // 已配方案
import ComparisonOfSelectedSchemes from "./BatchingRelatedPopFrame/ComparisonOfSelectedSchemes"; // 已选方案对比
import SelectWarehouse from "./BatchingRelatedPopFrame/SelectWarehouse"; // 选择仓库

import "./ingredientsList.less"
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import layoutStyles from '../../../layout/Layout.module.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

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

const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

export default function IngredientsList(): React.ReactNode {
    const history = useHistory()
    const [serarchForm] = Form.useForm();
    // 传递的参数 status: 状态 batchNumber:批次号 productCategoryName: 塔型 materialStandardName: 标准
    const params = useParams<{ id: string, status: string, batchNumber: string, productCategoryName: string, materialStandardName: string }>();

    // 按钮
    const btnList: BtnList[] = [
        // { key: "inherit", value: "继承一次方案" },
        { key: "fast", value: "快速配料" },
        { key: "programme", value: "已配方案" },
        { key: "save", value: "保存" },
        { key: "generate", value: "生成配料方案" },
        // { key: "batchingStrategy", value: "配料策略设置" },
        { key: "goback", value: "返回", type: "default" }
    ]
    // 按钮
    const dbtnList: BtnList[] = [
        // { key: "inherit", value: "继承一次方案" },
        { key: "fast", value: "快速配料" },
        { key: "programme", value: "已配方案" },
        // { key: "batchingStrategy", value: "配料策略设置" },
        { key: "goback", value: "返回", type: "default" }
    ]
    // 全局存储的数据接口
    const [globallyStoredData, setGloballyStoredData] = useState<any>([]);

    // tab选中的项
    const [activeKey, setActiveKey] = useState<string>("fangan1");
    // 库存单选
    const [value, setValue] = useState<string>("1");
    // 构建分类明细选择的集合
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    // 控制继承一次方案
    const [visible, setVisible] = useState<boolean>(false);
    // 角钢配置
    const [angleConfigVisible, setAngleConfigVisible] = useState<boolean>(false);
    // 控制已配方案
    const [visibleAllocatedScheme, setVisibleAllocatedScheme] = useState<boolean>(false);
    // 控制已选方案对比
    const [visibleComparisonOfSelectedSchemes, setVisibleComparisonOfSelectedSchemes] = useState<boolean>(false);
    // 控制选择仓库
    const [visibleSelectWarehouse, setVisibleSelectWarehouse] = useState<boolean>(false);

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

    // 已选方案 用于计算数量
    const [selectedScheme, setSelectedScheme] = useState<any[]>([]);

    // 过滤
    const [sort, setSort] = useState<string>("1");

    let [count, setCount] = useState<number>(0);

    // 记录构建明细改变
    let [detailCount, setDetailCount] = useState<number>(0);

    // 存储配料策略的list
    const [angleConfigStrategy, setAngleConfigStrategy] = useState<any[]>([]);

    // 存储当前的配料策略
    const [nowIngre, setNowIngre] = useState<{ [key: string]: any }>({});

    // 初始米数
    const [miter, setMiter] = useState<any[]>([]);

    // 长度合计
    const [lengthAll, setLengthAll] = useState<number>(0);

    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);

    // 当前选中的所有明细
    const [activeInfo, setActiveInfo] = useState<any>({});

    const [indeterminateStock, setIndeterminateStock] = useState(true);
    const [checkAllStock, setCheckAllStock] = useState(false);
    // 操作按钮
    const handleBtnClick = (options: BtnList) => {
        switch (options.key) {
            case "goback":
                history.go(-1);
                break;
            case "inherit":
                setVisible(true);
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
                const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
                if (panes.length !== 1) {
                    message.error("请您先进行方案对比!");
                    return false;
                }
                handleSaveData(1);
                break;
            case "generate":
                const result = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
                if (result.length !== 1) {
                    message.error("请您先进行方案对比!");
                    return false;
                }
                getbatch();
                handleSaveData(2);
                break;
            default:
                break;
        }
    }
    // 获取库存
    const { run: getAvailableInventoryList, data: AvailableInventoryData } = useRequest<{ [key: string]: any }>((
        inRoadInventory: number = 2,
        structureTexture: string = "",
        structureSpec: string = ""
    ) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/materialPurchaseTask/material/scheme/materialStock`, {
                structureTexture, // 材质
                structureSpec, // 规格
                inRoadInventory, // 是否使用在途库存（1:使用 2:不使用）
            });
            let v: any[] = [];
            let s: any[] = [];
            for (let i = 0; i < result.length; i += 1) {
                v.push({
                    meterNumber: result[i].length
                })
                s.push(result[i].length)
            }
            setMiter(s);
            setAvailableInventoryData(result || []);
            setCount(++count);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    // 保存数据处理
    const handleSaveData = (code: number) => {
        const result = globallyStoredData;
        let v: any[] = [];
        for (let i = 0; i < result.length; i += 1) {
            for (let p = 0; p < result[i].children.length; p += 1) {
                v = v.concat(result[i].children[p].selectedScheme)
            }
        }
        if (v.length < 1) {
            message.error("暂无已选方案！");
            return false;
        }
        const res = {
            batchingTaskId: params.id,
            schemeList: v
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
        setActiveKey(activeKey);
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        serarchForm.setFieldsValue({
            ...panes[index2].batchingStrategy
        })
    }

    // 新增tab
    const add = () => {
        let v = globallyStoredData;
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.findIndex((item: any) => item.key === activeSort);
        // 存储配料策略
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        if (panes[index2].selectedScheme.length < 1) {
            message.error("请您先配置当前的方案！");
            return false;
        }
        if (panes.length >= 5) {
            message.error("方案最多增加五套！")
            return false;
        }
        const news = [
            ...globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children,
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
        // serarchForm.resetFields();
        // 存储数据
        setActiveKey(`fangan${+(panes[panes.length - 1].key?.split("fangan")[1] as any) + 1}`);
        setGloballyStoredData(v)
    };
    const onCheckAllChangeStock = (e: CheckboxChangeEvent) => {
        console.log(e)
        const list = [];
        for (let i = 0; i < AvailableInventoryData?.length; i += 1) {
            list.push(AvailableInventoryData?.[i].length)
        }
        serarchForm.setFieldsValue({
            available: e.target.checked ? list : []
        })
        setIndeterminateStock(false);
        setCheckAllStock(e.target.checked);
    };

    const onCheckChangeStock = (list: CheckboxValueType[]) => {
        console.log(list)
        setIndeterminateStock(!!list.length && list.length < AvailableInventoryData?.length);
        setCheckAllStock(list.length === AvailableInventoryData?.length);
    };
    // 移除
    const remove = (targetKey: string) => {
        let newActiveKey: any = activeKey;
        let lastIndex: any;
        let v = globallyStoredData;
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.findIndex((item: any) => item.key === activeSort);
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
        setActiveKey(newActiveKey);
        setGloballyStoredData(v.slice(0))
    };

    // 库存单选改变
    const onRaioChange = (e: any) => {
        setValue(e.target.value);
        if(e.target.value==='2'){
            setIndeterminateStock(false);
        }else{
            setIndeterminate(false);
        }
    }

    // 构建明细多选触发
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys);
            setSelectedRowCheck(selectedRows)

            // 计算构建长度合计
            let lenth: number = 0;
            for (let i = 0; i < selectedRows.length; i += 1) {
                lenth = lenth + (+selectedRows[i].length || 0)
            }
            setLengthAll(lenth);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.notConfigured <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };

    // 已配方案
    const handleAllocatedScheme = () => {
        // 已配方案的数据
        const result = globallyStoredData;
        let v: any[] = [];
        for (let i = 0; i < result.length; i += 1) {
            for (let p = 0; p < result[i].children.length; p += 1) {
                v = v.concat(result[i].children[p].selectedScheme)
            }
        }
        setAllocatedScheme(v);
        setVisibleAllocatedScheme(true);
    }

    // 已选方案移除
    const handleRemove = (idx: number) => {
        let v = globallyStoredData;
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.findIndex((item: any) => item.key === activeSort);
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        let t = panes[index2].selectedScheme;
        let result = t.splice(idx, 1);
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
        setGloballyStoredData([...v])
    }

    // 选中
    const onChange = (checkedValues: any[]) => {
        console.log('checked = ', checkedValues);
    };

    // 统计数量
    const Statistics = () => {
        let map: Map<string, number> = new Map();
        map.clear();
        // 先获取当前构建下面 => 当前方案下的已选方案
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0]?.children;
        // 当前方案下的已选方案
        const schemeData = panes?.filter((item: any) => item.key === activeKey)[0]?.selectedScheme || [];

        // 存储数据
        for (let i = 0; i < schemeData.length; i += 1) {
            // 根据件号
            if (schemeData[i].component1) {
                if (map.has(schemeData[i].component1)) {
                    const result: number = map.get(schemeData[i].component1) || 0;
                    map.set(schemeData[i].component1, result + schemeData[i].num1 * schemeData[i].num);
                } else {
                    map.set(schemeData[i].component1, schemeData[i].num1 * schemeData[i].num);
                }
            }
            if (schemeData[i].component2) {
                if (map.has(schemeData[i].component2)) {
                    const result: number = map.get(schemeData[i].component2) || 0;
                    map.set(schemeData[i].component2, result + schemeData[i].num2 * schemeData[i].num);
                } else {
                    map.set(schemeData[i].component2, schemeData[i].num2 * schemeData[i].num);
                }
            }
            if (schemeData[i].component3) {
                if (map.has(schemeData[i].component3)) {
                    const result: number = map.get(schemeData[i].component3) || 0;
                    map.set(schemeData[i].component3, result + schemeData[i].num3 * schemeData[i].num);
                } else {
                    map.set(schemeData[i].component3, schemeData[i].num3 * schemeData[i].num);
                }
            }
            if (schemeData[i].component4) {
                if (map.has(schemeData[i].component4)) {
                    const result: number = map.get(schemeData[i].component4) || 0;
                    map.set(schemeData[i].component4, result + schemeData[i].num4 * schemeData[i].num);
                } else {
                    map.set(schemeData[i].component4, schemeData[i].num4 * schemeData[i].num);
                }
            }
            // 根据原材料长度
            if (schemeData[i].length) {
                if (map.has(schemeData[i].length)) {
                    const result = map.get(schemeData[i].length);
                    map.set(schemeData[i].length, result + schemeData[i].num);
                } else {
                    map.set(schemeData[i].length, schemeData[i].num);
                }
            }
            // 添加构建分类map
            if (map.has(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`)) {
                const result = map.get(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`) || 0;
                let num = (schemeData[i].num1 || 0) * schemeData[i].num + (schemeData[i].num2 || 0) * schemeData[i].num + (schemeData[i].num3 || 0) * schemeData[i].num + (schemeData[i].num4 || 0) * schemeData[i].num
                map.set(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`, result + num);
            } else {
                let num = (schemeData[i].num1 || 0) * schemeData[i].num + (schemeData[i].num2 || 0) * schemeData[i].num + (schemeData[i].num3 || 0) * schemeData[i].num + (schemeData[i].num4 || 0) * schemeData[i].num
                map.set(`${schemeData[i].structureTexture}_${schemeData[i].structureSpec}`, num);
            }
        }

        console.log(map, "存储的数据========>>>>>")

        // 当已选方案发生变化，构建明细处理 
        let result: any = sortDetailList;
        let selectKeys = selectedRowKeysCheck;
        let selectRows = selectedRowCheck;
        for (let i = 0; i < result.length; i += 1) {
            if (map.has(result[i].code)) {
                // map对应存在，则需要减少
                let num: number = map.get(result[i]?.code) || 0;
                result[i].notConfigured = (result[i].num - num > 0 ? (result[i].num - num) : "0");
            } else {
                result[i].notConfigured = result[i].num;
            }
            // 处理未配为0的情况
            if (+result[i].notConfigured === 0) {
                if (selectedRowKeysCheck.indexOf(result[i].id) !== -1) {
                    // 说明存在
                    selectKeys = selectKeys.filter((item: any) => item !== result[i].id);
                    selectRows = selectRows.filter((item: any) => item.id !== result[i].id)
                }
            }
        }
        setSelectedRowKeysCheck(selectKeys);
        setSelectedRowCheck(selectRows);
        setSortDetailList(result.slice(0))

        // 当已选方案发生改变，导致选中的变换，修改长度合计
        let lenth: number = 0;
        for (let i = 0; i < selectRows.length; i += 1) {
            lenth = lenth + (+selectRows[i].length || 0)
        }
        setLengthAll(lenth);

        // 库存发生变化
        let resultAvailableInventoryData: any = availableInventoryData;
        for (let i = 0; i < resultAvailableInventoryData.length; i += 1) {
            if (map.has(resultAvailableInventoryData[i].length)) {
                // map对应存在，则需要减少
                let num: number = map.get(resultAvailableInventoryData[i]?.length) || 0;
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
                let num: number = map.get(`${sort[ix].structureTexture}_${sort[ix].structureSpec}`) || 0;
                sort[ix].notConfigured = sort[ix].totalNum - num;
            } else {
                sort[ix].notConfigured = sort[ix].totalNum;
            }
        }

        setConstructionClassification(sort.slice(0))
    }

    // 当已选方案发生改变
    useEffect(() => {
        Statistics()
    }, [JSON.stringify(globallyStoredData), activeKey, activeSort, count])

    // 双击后构建明细发生变化
    useEffect(() => {
        if (detailCount > 0) {
            getScheme(1);
        }
    }, [detailCount])


    const handleModalSure = async () => {
        // 修改当前的配料策略
        const baseData = await serarchForm.validateFields();
        setNowIngre({
            ...baseData,
            idealRepertoryLengthList: value === "1" ? baseData.available : baseData.idealRepertoryLengthList
        });
        // 调整整个配料策略数据
        let result = angleConfigStrategy;
        const v = activeSort.split("_")[1].split("∠")[1].split("*")[0];
        const index = angleConfigStrategy.findIndex((item: any) => v > item?.width.split("~")[0] && v < item?.width.split("~")[1]);
        if (value === "1") {
            result[index] = {
                ...result[index],
                ...baseData
            }
        } else {
            result[index] = {
                ...result[index],
                ...baseData,
                idealRepertoryLengthList: baseData.idealRepertoryLengthList
            }
        }
        // result[index] = {
        //     ...result[index],
        //     ...baseData,
        //     idealRepertoryLengthList: baseData.idealRepertoryLengthList
        // }
        setAngleConfigStrategy(result.slice(0));
        setAngleConfigVisible(false)
    }

    // 备选方案点击选中
    const handleAlternativeCick = (options: any) => {
        let v = globallyStoredData;
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        const index = globallyStoredData?.findIndex((item: any) => item.key === activeSort);
        // 全局存储已选方案
        const programme = panes.filter((item: any) => item.key === activeKey);
        const index2 = panes.findIndex((item: any) => item.key === activeKey);
        // selectedScheme
        panes[index2].selectedScheme = [
            ...programme[0].selectedScheme,
            {
                ...options,
                clampLoss: serarchForm.getFieldValue("clampLoss"),
                edgeLoss: serarchForm.getFieldValue("edgeLoss"),
                margin: serarchForm.getFieldValue("margin"),
            }
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
        setGloballyStoredData(v)
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
            numberAll = numberAll + options[i].num;
            surplusMaaterial = surplusMaaterial + (options[i].plannedSurplusLength * options[i].num);
            totalUtilization = totalUtilization + (options[i].utilizationRate * options[i].num);
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
        map.forEach((value: any) => {
            if (+value >= 2) {
                disassemblyNumber = disassemblyNumber + value;
            }
        })
        return {
            meterNumber: meterNumber.join("、"),
            numberAll,
            surplusMaaterial,
            disassemblyNumber,
            calculation
        }
    }

    // 点击方案对比
    const handleSchemeComparison = () => {
        const res = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        let schemeComparisonList: any = [];
        for (let i = 0; i < res.length; i += 1) {
            if (res[i].selectedSchemeSummary.length > 0) {
                schemeComparisonList.push({
                    ...res[i].selectedSchemeSummary[0],
                    key: res[i].key
                });
            }
        }
        setSchemeComparison(schemeComparisonList);
        setVisibleComparisonOfSelectedSchemes(true)
    }

    // 方案对比的回调
    const handleComparisonOfSelectedSchemes = (res: any) => {
        if (res.code) {
            let v = globallyStoredData;
            const index = globallyStoredData?.findIndex((item: any) => item.key === activeSort);
            const result = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children.filter((v: any) => v.key === res.data[0]);
            result[0].title = "方案1";
            result[0].key = "fangan1";
            result[0].closable = false;
            v[index].children = result;
            v[index].isContrast = true; // 已对比
            setActiveKey("fangan1");
            setGloballyStoredData(v)
            serarchForm.setFieldsValue({
                ...result[0].batchingStrategy
            })
        }
        setVisibleComparisonOfSelectedSchemes(false);
    }

    // 点击构建分类
    const handleConstructionClassification = (options: string, currentInfo: any) => {
        let v = globallyStoredData;
        const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
        if (panes.length !== 1) {
            message.error("请您先进行方案对比!");
            return false;
        }
        panes[0].batchingStrategy = serarchForm.getFieldsValue();
        setActiveSort(options);
        setActiveInfo(currentInfo)
        setActiveKey("fangan1");
        setGloballyStoredData(v)
        const result = globallyStoredData?.filter((v: any) => v.key === options)[0].children;
        // 获取构建分类明细
        getSortDetail(params.id, options.split("_")[1], options.split("_")[0]);
        getAvailableInventoryList(2, options.split("_")[0], options.split("_")[1] );
        if (JSON.stringify(result[0].batchingStrategy) == "{}") {
            serarchForm.resetFields();
        } else {
            serarchForm.setFieldsValue({
                ...result[0].batchingStrategy
            })
        }
        setCount(++count);
        setAlternativeData([])
        setSelectedRowKeysCheck([]);
        setSelectedRowCheck([]);
        setLengthAll(0);

        // 回滚到顶部
        var dom = document.querySelector('.ant-table-body');
        (dom as any).scrollTop = 0;
    }

    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        const lists = ["6000", "6500", "7000", "7500", "8000", "8500", "9000", "9500", "10000", "10500", "11000", "11500", "12000", "12500"]
        serarchForm.setFieldsValue({
            idealRepertoryLengthList: e.target.checked ? lists : []
        })
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const onCheckChange = (list: CheckboxValueType[]) => {
        // setCheckedList(list);
        setIndeterminate(!!list.length && list.length < 14);
        setCheckAll(list.length === 14);
    };

    // 初始获取数据
    useEffect(() => {
        // 获取配料策略的利用率
        getBatchingStrategy();
        // 获取构建分类
        getSort(params.id);
    }, [])

    useEffect(() => {
        if (activeSort) {
            let test = activeSort;
            handleAnge(angleConfigStrategy, +test.split("_")[1].split("∠")[1].split("*")[0], activeSort);
        }
    }, [JSON.stringify(activeSort)])

    // 对配料策略进行处理
    const handleAnge = (options: any[], key: number, activeSort: any) => {
        console.log(options, "接受到的数据", key, activeSort)
        const spec = activeSort.split("_")[0];
        for (let i = 0; i < options.length; i += 1) {
            const result = options[i].width.split("~");
            if ((key >= result[0] * 1) && (key <= result[1] * 1)) {
                setNowIngre({
                    ...options[i],
                    available: miter,
                    edgeLoss: spec.includes("420") ? 0 : options[i].edgeLoss, // 刀口
                    clampLoss: spec.includes("420") ? 0 : options[i].clampLoss, // 端口
                    utilizationRate: options[i]?.utilizationRate || 96.5
                });
                serarchForm.setFieldsValue({
                    ...options[i],
                    available: miter,
                    edgeLoss: spec.includes("420") ? 0 : options[i].edgeLoss, // 刀口
                    clampLoss: spec.includes("420") ? 0 : options[i].clampLoss, // 端口
                    utilizationRate: options[i]?.utilizationRate || 96.5
                })
            }
        }
    }

    // 保存操作
    const { run: getPurchaseBatchingScheme } = useRequest<{ [key: string]: any }>((options: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/task/scheme`, options);
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
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/task/scheme/finish`, options);
            if (result) {
                message.success("生成配料成功！");
                history.go(-1);
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取配料策略-刀口、端口、余量等数据 list
    const { run: getIngredient, data: IngredientData } = useRequest<{ [key: string]: any }>((spec: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/angleConfigStrategy/ingredientConfigList`);
            setAngleConfigStrategy((result as any) || [])
            handleAnge(result, +spec.split("∠")[1].split("*")[0], activeSort)
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
            const result: any = await RequestUtil.get(`/tower-supply/task/component/${id}/material`);
            // 获取页面配料方案
            const schemeResult: { [key: string]: any } = await RequestUtil.get(`/tower-supply/task/scheme/info/${id}`);
            result?.map((element: any, index: number) => {
                element["key"] = `${element.structureTexture}_${index}`
            });
            setConstructionClassification(result || []);
            if (result?.length > 0) {
                setActiveSort(`${result?.[0].structureTexture}_${result?.[0].structureSpec}`)
                setActiveInfo(result?.[0]);
                // 根据构建分类获取配料策略
                getIngredient(result?.[0]?.structureSpec);
                // // 获取构建分类明细
                getSortDetail(params.id, result?.[0]?.structureSpec, result?.[0]?.structureTexture);
                getAvailableInventoryList(2, result?.[0]?.structureTexture, result?.[0]?.structureSpec, );
                // 全局存储数据结构
                // setGloballyStoredData
                const v: any = []
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
                    v.push(data);
                }
                if (schemeResult.length > 0) {
                    // 说明有配料方案，合并处理
                    for (let i = 0; i < schemeResult.length; i += 1) {
                        for (let p = 0; p < v.length; p += 1) {
                            if (`${schemeResult[i].structureTexture}_${schemeResult[i].structureSpec}` === v[p].key) {
                                v[p].children[0].selectedScheme = schemeResult[i].details;
                                v[p].children[0].selectedSchemeSummary = [{
                                    numberAll: schemeResult[i].statisticsVo.num,
                                    calculation: schemeResult[i].statisticsVo.utilizationRate,
                                    surplusMaaterial: schemeResult[i].statisticsVo.plannedSurplusLength,
                                    disassemblyNumber: schemeResult[i].statisticsVo.disassemblyNum,
                                    meterNumber: schemeResult[i].statisticsVo.meterRange
                                }];
                            }
                        }
                    }
                }
                setGloballyStoredData(v);
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 抢占配料任务
    const { run: getbatch } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.post(`/tower-supply/task/batch?batchId=${params.id}`)
            resole(result || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取构建分类明细
    const { run: getSortDetail } = useRequest<any[]>((purchaseTowerId: string, spec: string, texture: string) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/task/component/${purchaseTowerId}/${spec}/${texture}`)
            result?.forEach((element: any, index: number) => {
                element["key"] = `${element.id}`
            });
            setSortDetailList(result || [])
            setCount(++count)
            resole(result || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 手动配料
    const { loading, run: getScheme } = useRequest<{ [key: string]: any }>((code: number = 1, sorts: string = "") => new Promise(async (resole, reject) => {
        setAlternativeData([]);
        try {
            if (code === 1) {
                setSort("1");
            }
            const serarchData = await serarchForm.validateFields();
            if (selectedRowCheck.length < 1) {
                message.error("请选择配料构件！");
                resole({});
                return false;
            }
            if (selectedRowCheck.length > 4) {
                message.error("最多四个构件、辛苦修改后在配料~");
                resole({});
                return false;
            }
            // 当前选中禁用
            if (selectedRowCheck[0].notConfigured <= 0) {
                message.error("请您更换构件后再进行配料！");
                resole({});
                return false;
            }
            // 重组构建明细数据
            let comp = [];
            if (selectedRowCheck.length === 1) {
                for (let i = 0; i < sortDetailList.length; i += 1) {
                    if (selectedRowKeysCheck.includes(sortDetailList[i].id)) {
                        comp.push({
                            ...sortDetailList[i],
                            head: true
                        })
                    } else {
                        comp.push({
                            ...sortDetailList[i],
                            head: false
                        })
                    }
                }
            } else {
                comp = selectedRowCheck;
                comp.map((item: any) => item["head"] = false);
            }
            let res = [];
            for (let i = 0; i < nowIngre?.idealRepertoryLengthList.length; i += 1) {
                const v = {
                    length: nowIngre?.idealRepertoryLengthList[i]
                }
                res.push(v);
            }
            const result: any[] = await RequestUtil.post(`/tower-supply/task/scheme/manual`, {
                ...serarchData,
                ...nowIngre,
                openNumber: nowIngre?.openNumberList,
                components: comp, // 构建明细分类
                purchaseTowerId: params.id, // 采购塔型的id
                stockDetails: res, // 库存信息
                structureSpec: activeSort.split("_")[1], // 规格
                structureTexture: activeSort.split("_")[0], // 材质
                useStock: false, // 是否使用实际库存
                sort: code === 1 ? "" : sorts
            });
            resole(result)
            if (result.length < 1) {
                message.error("暂无合适的备选方案！");
                return false;
            }
            setAlternativeData(result || []);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 自动配料
    const { loading: autoLoading, run: getAuto } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const serarchData = await serarchForm.validateFields();
            const comp = selectedRowCheck;
            comp.map((item: any) => item["head"] = false);
            let res = [];
            for (let i = 0; i < nowIngre?.idealRepertoryLengthList.length; i += 1) {
                const v = {
                    length: nowIngre?.idealRepertoryLengthList[i]
                }
                res.push(v);
            }
            const result: any = await RequestUtil.post(`/tower-supply/task/scheme/auto/single`, {
                ...serarchData,
                ...nowIngre,
                openNumber: nowIngre?.openNumberList,
                components: comp, // 构建明细分类
                businessKey: params.id, // 采购塔型的id
                stockDetails: res, // 库存信息
                structureSpec: activeSort.split("_")[1], // 规格
                structureTexture: activeSort.split("_")[0], // 材质
                useStock: false, // 是否使用实际库存
                sort
            });
            resole(result)

            // 查询当前选中的
            let v = globallyStoredData;
            const panes = globallyStoredData?.filter((v: any) => v.key === activeSort)[0].children;
            const index = globallyStoredData?.findIndex((item: any) => item.key === activeSort);
            // 全局存储已选方案
            const index2 = panes.findIndex((item: any) => item.key === activeKey);
            // selectedScheme
            result?.details?.map((item: any) => {
                item["clampLoss"] = serarchForm.getFieldValue("clampLoss");
                item["edgeLoss"] = serarchForm.getFieldValue("edgeLoss");
                item["margin"] = serarchForm.getFieldValue("margin");
            })
            panes[index2].selectedScheme = result?.details || []
            // 页面存储已选方案
            panes[index2].selectedSchemeSummary = [{
                numberAll: result.statisticsVo.num,
                calculation: result.statisticsVo.utilizationRate,
                surplusMaaterial: result.statisticsVo.plannedSurplusLength,
                disassemblyNumber: result.statisticsVo.disassemblyNum,
                meterNumber: result.statisticsVo.meterRange
            }] || [];
            v[index].children = panes;
            console.log(v, "数据")
            setGloballyStoredData(v.slice(0))
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const components = {
        body: {
            row: (e: any) => <Tooltip title="双击进行配料~"><tr {...e} /></Tooltip>,
            cell: "td"
        }
    }

    return (
        <div className='ingredientsListWrapper'>
            <DetailContent operation={params.status==='1'?[
                <span className='texts' style={{ marginRight: 4 }}>长度合计:</span>,
                <span className='values' style={{ marginRight: 16 }}>{lengthAll}</span>,
                ...btnList.map((item: BtnList) => {
                    return <Button key={item.key} type={item.type ? item.type : "primary"} style={{ marginRight: 16 }} onClick={() => handleBtnClick(item)}>{item.value}</Button>
                })
            ]:[
                <span className='texts' style={{ marginRight: 4 }}>长度合计:</span>,
                <span className='values' style={{ marginRight: 16 }}>{lengthAll}</span>,
                ...dbtnList.map((item: BtnList) => {
                    return <Button key={item.key} type={item.type ? item.type : "primary"} style={{ marginRight: 16 }} onClick={() => handleBtnClick(item)}>{item.value}</Button>
                })
            ]}>
                <div className='top-title-wrapper'>
                    <span className='title-name'>配料信息</span>
                    <span className='texts'>批次号:</span>
                    <span className='values'>{params.batchNumber || ""}</span>
                    <span className='texts'>塔型:</span>
                    <span className='values'>{params.productCategoryName || ""}</span>
                    <span className='texts'>标准:</span>
                    <span className='values'>{params.materialStandardName || ""}</span>
                    <span className='texts'>状态:</span>
                    <span className='values'>{params.status==='1'?'待完成':params.status==='3'?'已完成':'' || ""}</span>
                </div>
                {
                    constructionClassification.length > 0 && <div className='content_wrapper'>
                        <div className='contentWrapperLeft' style={{ maxHeight: document.documentElement.clientHeight - 184, overflow: "auto" }}>
                            {/* 构建list */}
                            {
                                constructionClassification?.map((item: any, index: number) => {
                                    const flag = activeSort === `${item.structureTexture}_${item.structureSpec}`;
                                    return <div
                                        key={index}
                                        className={`contentWrapperLeftlist ${flag ? "active" : ""}`}
                                        onClick={() => handleConstructionClassification(`${item.structureTexture}_${item.structureSpec}`, item)}>
                                        <div className='color' style={{
                                            backgroundColor: item.notConfigured === item.totalNum ? "#EE483C"
                                                : item.notConfigured === 0 ? "#13C519" : "#FFB631"
                                        }}></div>
                                        <div className='structure_wrapper'>
                                            <p>{item.structureTexture}</p>
                                            <p>{item.structureSpec}</p>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className='content_wrapper_ringht'>
                            <div style={{ width: "100%" }}>
                                <Tabs
                                    type="editable-card"
                                    addIcon={<>新增方案</>}
                                    onChange={onTabChange}
                                    activeKey={activeKey}
                                    onEdit={(targetKey, action) => onEdit(targetKey, action)}
                                >
                                    {
                                        globallyStoredData?.filter((v: any) => v.key === activeSort)[0]?.children?.map((item: Panes) => {
                                            return <TabPane tab={item.title} key={item.key} closable={item.closable} style={{ position: "relative" }}>
                                                <div className='topStrategyWrapper'>
                                                    <Button type='primary' onClick={() => {
                                                        serarchForm.setFieldsValue({
                                                            ...nowIngre
                                                        })
                                                        setAngleConfigVisible(true)
                                                    }
                                                    }>配料策略设置</Button>
                                                    <span className='texts'>开数:</span>
                                                    <span className='values'>{nowIngre?.openNumberList?.join("、")}</span>
                                                    <span className='texts'>刀口:</span>
                                                    <span className='values'>{nowIngre.edgeLoss}</span>
                                                    <span className='texts'> 端口:</span>
                                                    <span className='values'>{nowIngre.clampLoss}</span>
                                                    <span className='texts'>余量:</span>
                                                    <span className='values'>{nowIngre.margin}mm</span>
                                                    <span className='texts'>利用率:</span>
                                                    <span className='values'>{nowIngre.utilizationRate}%</span>
                                                    <span className='texts'>原材料米数:</span>
                                                    <span className='values'
                                                        title={nowIngre?.idealRepertoryLengthList?.join("、")}>
                                                        {nowIngre?.idealRepertoryLengthList && nowIngre?.idealRepertoryLengthList.length > 2 ? `${nowIngre?.idealRepertoryLengthList[0]}、${nowIngre?.idealRepertoryLengthList[1]}...` : nowIngre?.idealRepertoryLengthList?.join("、")}
                                                    </span>
                                                </div>
                                                <div className='ingredients_content_wrapper'>
                                                    <div className='ingredients_content_wrapper_right'>
                                                        <div className='ingredients_content_wrapper_right_detail'>
                                                            <DetailTitle key="detail" title="构件明细" col={{ left: 8, right: 16 }} operation={params.status==='1'?[
                                                                <Button type="primary" ghost key="add" style={{ marginRight: 8, padding: "6px 16px" }} disabled={autoLoading} onClick={() => getAuto()}>自动配料</Button>,
                                                                <Button type="primary" ghost key="choose" style={{ padding: "6px 16px" }} disabled={loading} onClick={() => getScheme(1)}>手动配料</Button>
                                                            ]:[]} />
                                                            <CommonTableBeFore
                                                                size="small"
                                                                rowSelection={{
                                                                    type: "checkbox",
                                                                    ...rowSelectionCheck,
                                                                }}
                                                                components={components}
                                                                rowClassName={(record: any) => {
                                                                    if (+record.notConfigured === 0) return 'table-color-dust';
                                                                }}
                                                                onRow={(record: any) => {
                                                                    return {
                                                                        onDoubleClick: async (event: any) => getScheme(1)
                                                                    }
                                                                }}
                                                                key={"id"}
                                                                columns={ConstructionDetailsColumn}
                                                                dataSource={sortDetailList}
                                                                pagination={false}
                                                                scroll={{ y: document.documentElement.clientHeight - 364 }}
                                                            />
                                                        </div>
                                                        <div className='ingredients_content_wrapper_right_programme'>
                                                            <div className='title_wrapper marginTop' style={{ width: document.documentElement.clientWidth - 660 }}>
                                                                <div>已选方案
                                                                    <span className='textLabel'>已选米数:</span><span className='textValue'>{item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).meterNumber : 0}</span>
                                                                    <span className='textLabel'>总数量:</span><span className='textValue'>{item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).numberAll : 0}</span>
                                                                    <span className='textLabel'>拆号数:</span><span className='textValue'>{item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).disassemblyNumber : 0}</span>
                                                                    <span className='textLabel'>余料总长:</span><span className='textValue'>{item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).surplusMaaterial : 0}mm</span>
                                                                    <span className='textLabel'>总利用率:</span><span className='textValue'>{item.selectedSchemeSummary.length > 0 ? (item.selectedSchemeSummary[0] as any).calculation : 0}%</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: document.documentElement.clientWidth - 660 }} className="alternativeWrapper">
                                                                <CommonTable
                                                                    size="small"
                                                                    columns={[
                                                                        ...BatchingScheme,
                                                                        {
                                                                            title: "操作",
                                                                            dataIndex: "opration",
                                                                            fixed: "right",
                                                                            width: 40,
                                                                            render: (_: any, record: any, index: number) => {
                                                                                return (
                                                                                    <>
                                                                                        <Button type="link" disabled={activeInfo.isHandler === 2} onClick={() => handleRemove(index)}>移除</Button>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        }
                                                                    ]}
                                                                    dataSource={item.selectedScheme.slice(0)}
                                                                    pagination={false}
                                                                    // scroll={{ x: 1200, y: 320 }}
                                                                    style={{ height: 200, overflow: "auto" }}
                                                                    code={1}
                                                                />
                                                            </div>
                                                            <div className='title_wrapper' style={{ width: document.documentElement.clientWidth - 678 }}>
                                                                <div>备选方案</div>
                                                                <div>
                                                                    <span>排序</span>
                                                                    <Select placeholder="请选择" value={sort} style={{ width: 150 }} onChange={(res) => {
                                                                        setSort(res);
                                                                        getScheme(2, res);
                                                                    }}>
                                                                        <Select.Option value="1">完全下料优先</Select.Option>
                                                                        <Select.Option value="2">利用率<ArrowDownOutlined /></Select.Option>
                                                                        <Select.Option value="4">余料长度<ArrowDownOutlined /></Select.Option>
                                                                        <Select.Option value="5">余料长度<ArrowUpOutlined /></Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: document.documentElement.clientWidth - 660 }} className="alternativeWrapper">
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
                                                                                            // color: record.lineHeightColumn.includes(item.dataIndex) ? "#fff" : "black",
                                                                                            backgroundColor: record.lineHeightColumn.includes(item.dataIndex) ? "#CAF982" : "",
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
                                                                            width: 40,
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
                                                                    // scroll={{ x: 1200, y: 310 }}
                                                                    style={{ height: document.documentElement.clientHeight - 580, overflow: "auto" }}
                                                                    code={1}
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
                                    disabled={globallyStoredData?.filter((v: any) => v.key === activeSort)[0]?.children.length === 1}
                                    onClick={() => handleSchemeComparison()}>方案对比</Button>
                            </div>
                        </div>
                    </div>
                }
            </DetailContent>
            <Modal
                title={'配料策略'}
                visible={angleConfigVisible}
                width={400}
                maskClosable={false}
                onCancel={() => setAngleConfigVisible(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setAngleConfigVisible(false)
                        }}
                    >
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => handleModalSure()}
                    >
                        确认
                    </Button>
                ]}
            >
                <Form {...formItemLayout} form={serarchForm} style={{ marginBottom: 18 }}>
                    <Form.Item
                        name="openNumberList"
                        label="开数"
                        style={{ marginBottom: 8 }}
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
                                    <Checkbox value={1} style={{ lineHeight: '32px' }}>
                                        1
                                    </Checkbox>
                                </Col>
                                <Col span={6}>
                                    <Checkbox value={2} style={{ lineHeight: '32px' }}>
                                        2
                                    </Checkbox>
                                </Col>
                                <Col span={6}>
                                    <Checkbox value={3} style={{ lineHeight: '32px' }}>
                                        3
                                    </Checkbox>
                                </Col>
                                <Col span={6}>
                                    <Checkbox value={4} style={{ lineHeight: '32px' }}>
                                        4
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item
                        name="edgeLoss"
                        label="刀口"
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                "required": true,
                                "message": "请选择刀口"
                            }
                        ]}
                    >
                        <InputNumber
                            stringMode={false}
                            min="0"
                            className={layoutStyles.width100}
                        />
                    </Form.Item>
                    <Form.Item
                        label="端头"
                        name="clampLoss"
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                "required": true,
                                "message": "请选择端头"
                            }
                        ]}
                    >
                        <InputNumber
                            stringMode={false}
                            min="0"
                            className={layoutStyles.width100}
                        />
                    </Form.Item>
                    <Form.Item
                        label="余量"
                        name="margin"
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                "required": true,
                                "message": "请选择余量"
                            }
                        ]}
                    >
                        <InputNumber
                            stringMode={false}
                            min="0"
                            className={layoutStyles.width100}
                        />
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
                        <InputNumber
                            stringMode={false}
                            min="0"
                            step="0.01"
                            className={layoutStyles.width100}
                            precision={2}
                        />
                    </Form.Item>

                    {/* <DetailTitle title="原材料米数" key={"strategy"} operation={[
                        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                            全选
                        </Checkbox>
                    ]} /> */}
                    <DetailTitle title="原材料米数" key={"strategy"} operation={
                        value === "2" ? [
                            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                全选
                            </Checkbox>
                        ] : [
                            <Checkbox indeterminate={indeterminateStock} onChange={onCheckAllChangeStock} checked={checkAllStock}>
                                全选
                            </Checkbox>
                        ]
                    } />
                    <Radio.Group onChange={onRaioChange} value={value} style={{ marginBottom: 8 }}>
                        <Radio value={"1"}>可用库存</Radio>
                        <Radio value={"2"}>理想库存</Radio>
                    </Radio.Group>
                    {
                        value === "1" && <>
                            <Form.Item
                                name="available"
                                rules={[
                                    {
                                        "required": true,
                                        "message": "请选择可用库存"
                                    }
                                ]}
                            >
                                <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChangeStock}>
                                    <Row>
                                        {
                                            AvailableInventoryData?.map((item: any) => {
                                                return <Col span={12} style={{ marginBottom: 8 }}>
                                                    <Checkbox value={item.length}>{item.length} 可用数量:{item?.totalNum}</Checkbox>
                                                </Col>
                                            })
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </>
                    }
                    {
                        value === "2" && <>
                            <Form.Item
                                name="idealRepertoryLengthList"
                                rules={[
                                    {
                                        "required": true,
                                        "message": "请选择理想库存"
                                    }
                                ]}
                            >
                                <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange}>
                                    <Row>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="6000">6000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="6500">6500</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="7000">7000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="7500">7500</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="8000">8000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="8500">8500</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="9000">9000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="9500">9500</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="10000">10000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="10500">10500</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="11000">11000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="11500">11500</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="12000">12000</Checkbox>
                                        </Col>
                                        <Col span={8} style={{ marginBottom: 8 }}>
                                            <Checkbox value="12500">12500</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </>
                    }
                    {/* <Form.Item
                        name="idealRepertoryLengthList"
                        rules={[
                            {
                                "required": true,
                                "message": "请选择理想库存"
                            }
                        ]}
                    >
                        <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange}>
                            <Row>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="6000">6000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="6500">6500</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="7000">7000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="7500">7500</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="8000">8000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="8500">8500</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="9000">9000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="9500">9500</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="10000">10000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="10500">10500</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="11000">11000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="11500">11500</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="12000">12000</Checkbox>
                                </Col>
                                <Col span={8} style={{ marginBottom: 8 }}>
                                    <Checkbox value="12500">12500</Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item> */}
                </Form>
            </Modal>
            {/* 已配方案 */}
            <AllocatedScheme visible={visibleAllocatedScheme} allocatedScheme={allocatedScheme} hanleInheritSure={() => {
                setVisibleAllocatedScheme(false);
            }} />
            {/* 已选方案对比 */}
            <ComparisonOfSelectedSchemes visible={visibleComparisonOfSelectedSchemes} schemeComparison={schemeComparison} hanleInheritSure={(res) => handleComparisonOfSelectedSchemes(res)} />
            {/* 选择仓库 */}
            <SelectWarehouse visible={visibleSelectWarehouse} hanleInheritSure={(res) => {
                setVisibleSelectWarehouse(false);
            }} />
        </div>
    )
}