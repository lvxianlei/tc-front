/**
 * 创建原材料盘点
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, InputNumber, Select, message } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    addMaterial,
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

export default function CreatePlan(props: CreateInterface): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string>("");
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

    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.id !== id))
        setPopDataList(materialList.filter((item: any) => item.id !== id))
    }

    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    stockTakingNum: value,
                    weight: ((item.proportion * (item.length || 1)) / 1000 / 1000).toFixed(3),
                    totalWeight: ((item.proportion * value * (item.length || 1)) / 1000 / 1000).toFixed(3),
                    profitAndLossNum: (value) - item.num, // 盈亏数量
                    stockTakingWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * (value)) / 1000 / 1000).toFixed(3), // 盘点重量
                    // 盈亏重量 = 盘点重量 - 账目重量
                    profitAndLossWeight: (+((Number(item?.proportion || 1) * Number(item.length || 1) * (value)) / 1000 / 1000).toFixed(3)) - (+((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3)),
                    taxPrice: item.taxPrice || 0, // 单价
                    // 账目金额
                    totalTaxPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                    // 盘点金额
                    stockTakingPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * (value)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                    // 盈亏金额
                    profitAndLossPrice: (+(((Number(item?.proportion || 1) * Number(item.length || 1) * (value)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2)) - (+(((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2)),
                    // 不含税单价
                    unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                    // 不含税金额
                    totalUnTaxPrice: ((+((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (+((Number(item?.proportion || 1) * Number(item.length || 1) * (value)) / 1000 / 1000).toFixed(3)) - (+((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3))).toFixed(2)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }

    const lengthChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: ((item.proportion * value) / 1000 / 1000).toFixed(3),
                    totalWeight: ((item.proportion * value * (item.stockTakingNum || 1)) / 1000 / 1000).toFixed(3),
                    stockTakingNum: item.stockTakingNum || item.num, // 盘点数量
                    profitAndLossNum: ((item.stockTakingNum || item.num) || 1) - item.num, // 盈亏数量
                    stockTakingWeight: ((Number(item?.proportion || 1) * Number(value) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3), // 盘点重量
                    // 盈亏重量 = 盘点重量 - 账目重量
                    profitAndLossWeight: (+((Number(item?.proportion || 1) * Number(value) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3)) - (+((Number(item?.proportion || 1) * Number(value) * ((item.num) || 1)) / 1000 / 1000).toFixed(3)),
                    taxPrice: item.taxPrice || 0, // 单价
                    // 账目金额
                    totalTaxPrice: (((Number(item?.proportion || 1) * Number(value) * ((item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                    // 盘点金额
                    stockTakingPrice: (((Number(item?.proportion || 1) * Number(value) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                    // 盈亏金额
                    profitAndLossPrice: (+(((Number(item?.proportion || 1) * Number(value) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2)) - (+(((Number(item?.proportion || 1) * Number(value) * ((item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2)),
                    // 不含税单价
                    unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                    // 不含税金额
                    totalUnTaxPrice: ((+((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (+((Number(item?.proportion || 1) * Number(value) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3)) - (+((Number(item?.proportion || 1) * Number(value) * ((item.num) || 1)) / 1000 / 1000).toFixed(3))).toFixed(2)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }

    const widthChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    width: value
                })
            }
            return item
        })
        setMaterialList(list);
        setPopDataList(list)
    }

    const handleSuccessClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (materialList.length < 1) {
                message.error("请您选择入库明细!");
                return false;
            }
            materialList.forEach((item: any) => {
                if (item.id) {
                    // 删除id属性
                    delete item.id;
                }
            })
            const v: any = {
                stockTakingDetailDTOList: materialList,
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
            if (materialList.length < 1) {
                message.error("请您选择入库明细!");
                return false;
            }
            materialList.forEach((item: any) => {
                if (item.id && item.source && item.source === 2) {
                    // 删除id属性
                    delete item.id;
                }
            })
            const v: any = {
                stockTakingDetailDTOList: materialList,
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
            return;
        }
    }

    const { run: stockTakingRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
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
    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
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
                getDataRun();
            } else {
                addCollectionForm.resetFields();
                setWarehouseId("");
            }
        } 
    }, [props.visible])

    return (
        <Modal
            title={props.isEdit ? "编辑盘点单" : "新建盘点单"}
            visible={props.visible}
            onCancel={() => {
                setMaterialList([]);
                setPopDataList([]);
                props?.handleCreate({code: 0});
            }}
            destroyOnClose
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    props?.handleCreate({code: 0});
                }}>
                    关闭
                </Button>,
                <Button key="create" type="primary" onClick={() => handleSuccessClick()}>
                    完成盘点
                </Button>,
                <Button key="save" type="primary" onClick={() => handleCreateClick()}>
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
                        return ({ ...item, enum: batchingStrategy?.map((item: any) => ({
                            value: item.id,
                            label: item.name
                        })) })
                    }
                    return item
                })}
                onChange={performanceBondChange}
            />
            <DetailTitle title="入库明细" />
            <div className='btnWrapper'>
                <Button type='primary' key="add" ghost disabled={!warehouseId} onClick={() => setVisible(true)}>选择</Button>
            </div>
            <CommonTable
                rowKey={"id"}
                style={{ padding: "0" }}
                columns={[
                    ...material.map((item: any) => {
                        if (["stockTakingNum"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                            })
                        }
                        if (item.dataIndex === "length") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => lengthChange(value, records.id)} key={key} />
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
                                    onChange={(value: number) => widthChange(value, records.id)} key={key} />
                            })
                        }
                        if (item.dataIndex === "materialStandardName") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Select
                                    style={{ width: '150px' }}
                                    value={popDataList[key]?.materialStandard && popDataList[key]?.materialStandard + ',' + popDataList[key]?.materialStandardName}
                                    onChange={(e: string) => {
                                        const newData = popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    materialStandard: e.split(',')[0],
                                                    materialStandardName: e.split(',')[1]
                                                }
                                            }
                                            return item
                                        })
                                        setPopDataList(newData)
                                    }}>
                                    {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                                </Select>
                            })
                        }
                        if (item.dataIndex === "structureTexture") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <Select
                                    style={{ width: '150px' }}
                                    value={popDataList[key]?.structureTextureId && popDataList[key]?.structureTextureId + ',' + popDataList[key]?.structureTexture}
                                    onChange={(e: string) => {
                                        const newData = popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    structureTextureId: e.split(',')[0],
                                                    structureTexture: e.split(',')[1]
                                                }
                                            }
                                            return item
                                        })
                                        setPopDataList(newData)
                                    }}>
                                    {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
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
                            <Button type="link" disabled={records.source === 1} onClick={() => handleRemove(records.id)}>移除</Button>
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
                        path: `${addMaterial.path}/${warehouseId}`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
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
                            stockTakingWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3), // 盘点重量
                            // 盈亏重量 = 盘点重量 - 账目重量
                            profitAndLossWeight: (+((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3)) - (+((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3)),
                            weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3),
                            totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3), // 账面重量
                            taxPrice: item.taxPrice || 0, // 单价
                            // 账目金额
                            totalTaxPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                            // 盘点金额
                            stockTakingPrice: (((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2),
                            // 盈亏金额
                            profitAndLossPrice: (+(((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2)) - (+(((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000) * (item.taxPrice || 0)).toFixed(2)),
                            // 不含税单价
                            unTaxPrice: ((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6),
                            // 不含税金额
                            totalUnTaxPrice: ((+((item.taxPrice || 0) / (1 + ((statisticsData?.taxVal || 0) / 100))).toFixed(6)) * (+((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.stockTakingNum || item.num) || 1)) / 1000 / 1000).toFixed(3)) - (+((Number(item?.proportion || 1) * Number(item.length || 1) * ((item.num) || 1)) / 1000 / 1000).toFixed(3))).toFixed(2)
                        }))
                        ] || [])
                    }}
                />
            </Modal>
        </Modal>
    )
}