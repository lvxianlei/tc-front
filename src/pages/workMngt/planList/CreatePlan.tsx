/**
 * 创建计划列表
 */
 import React, { useRef, useState } from 'react';
 import { Modal, Form, Button, InputNumber, Select, message } from 'antd';
import { BaseInfo, CommonTable, DetailTitle } from '../../common';
import {
    material,
    addMaterial
} from "./CreatePlan.json";
import { PopTableContent } from "./ComparesModal"
import { deliverywayOptions, materialStandardOptions, materialTextureOptions, transportationTypeOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
 
 export default function CreatePlan(props: any): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])

    const formatSpec = (spec: any): { width: string, length: string } => {
        if (!spec) {
            return ({
                width: "0",
                length: "0"
            })
        }
        const splitArr = spec.replace("∠", "").split("*")
        return ({
            width: splitArr[0] || "0",
            length: splitArr[1] || "0"
        })
    }
    const handleAddModalOk = () => {
        const newMaterialList = popDataList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.planPurchaseNum || "1")
            const taxPrice = parseFloat(item.taxOffer || "1.00")
            const price = parseFloat(item.offer || "1.00")
            return ({
                ...item,
                planPurchaseNum: num,
                taxPrice,
                price,
                width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
                taxTotalAmount: (num * taxPrice).toFixed(2),
                totalAmount: (num * price).toFixed(2)
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.planPurchaseNum || "1")
            const taxPrice = parseFloat(item.taxOffer || "1.00")
            const price = parseFloat(item.offer || "1.00")
            return ({
                ...item,
                planPurchaseNum: num,
                taxPrice,
                price,
                width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
                taxTotalAmount: (num * taxPrice).toFixed(2),
                totalAmount: (num * price).toFixed(2)
            })
        })])
        setVisible(false)
    }

    // 移除
    const handleRemove = (id: string) => setMaterialList(materialList.filter((item: any) => item.materialCode !== id))
    
    const handleNumChange = (value: number, materialCode: string, dataIndex: string) => {
        const newData = materialList.map((item: any) => {
            if (item.materialCode === materialCode) {
                const allData: any = {
                    planPurchaseNum: parseFloat(item.planPurchaseNum || "1"),
                    taxPrice: parseFloat(item.taxPrice || "1.00"),
                    price: parseFloat(item.price || "1.00"),
                    weight: (item.weight && item.weight >= 0) ? parseFloat(item.weight) : parseFloat("0")
                }
                allData[dataIndex] = value
                return ({
                    ...item,
                    taxTotalAmount: (allData.planPurchaseNum * allData.taxPrice * allData.weight).toFixed(2),
                    totalAmount: (allData.planPurchaseNum * allData.price * allData.weight).toFixed(2),
                    totalWeight: (allData.planPurchaseNum * allData.weight).toFixed(3),
                    [dataIndex]: value
                })
            }
            return item
        })
        setMaterialList(newData)
        setPopDataList(newData)
    }

    const lengthChange = (value: number, id: string) => {
        const list = materialList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    length: value,
                    weight: ((item.proportion * value) / 1000).toFixed(3)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }

    const handleCreateClick = async() => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (materialList.length < 1) {
                message.error("请您选择原材料明细!");
                return false;
            }
            const v = {
                lists: materialList,
                purchaserTaskTowerIds: "",
                purchaseType: baseInfo?.purchaseType
            }
            saveRun(v);
        } catch(error) {
            console.log(error);
        }
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan`, data)
            message.success("创建成功！");
            props?.handleCreate({code: 1})
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    return (
        <Modal
            title={'创建采购计划'}
            visible={props.visible}
            onCancel={() => {
                setMaterialList([]);
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    props?.handleCreate();
                }}>
                    关闭
                </Button>,
                <Button type="primary" onClick={() => handleCreateClick()}>
                    创建
                </Button>
            ]}
        >
        <DetailTitle title="基本信息" />
        <BaseInfo
            form={addCollectionForm}
            edit
            dataSource={[]}
            col={4}
            classStyle="baseInfo"
            columns={[
                {
                    "dataIndex": "purchaseType",
                    "title": "采购类型",
                    "type": "select",
                    "rules": [
                        {
                            "required": true,
                            "message": "请选择采购类型"
                        }
                    ],
                    "enum": [
                        {
                            "value": 2,
                            "label": "库存采购"
                        }
                    ]
                }
            ]}
        />
        <DetailTitle title="原材料明细" />
        <div className='btnWrapper'>
            <Button type='primary' ghost style={{marginRight: 8}}  onClick={() => setVisible(true)}>添加</Button>
            <Button type='primary' ghost onClick={() => setMaterialList([])}>清空</Button>
        </div>
        <CommonTable
            rowKey={"id"}
            style={{ padding: "0" }}
            columns={[
                ...material.map((item: any) => {
                    if (["planPurchaseNum", "taxPrice", "price"].includes(item.dataIndex)) {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 1} onChange={(value: number) => handleNumChange(value, records.materialCode, item.dataIndex)} key={key} />
                        })
                    }
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 1} onChange={(value: number) => lengthChange(value, records.id)} key={key} />
                        })
                    }
                    if (item.dataIndex === "standard") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select
                                style={{ width: '150px' }}
                                value={materialList[key]?.standard && materialList[key]?.standard + ',' + materialList[key]?.materialStandardName}
                                onChange={(e: string) => {
                                    const newData = materialList.map((item: any, index: number) => {
                                        if (index === key) {
                                            return {
                                                ...item,
                                                standard: e.split(',')[0],
                                                materialStandardName: e.split(',')[1]
                                            }
                                        }
                                        return item
                                    })
                                    setMaterialList(newData)
                                }}>
                                {materialStandardOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' + item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    if (item.dataIndex === "materialTextureId") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => records.source === 1 ? records.materialTexture : <Select
                                style={{ width: '150px' }}
                                value={materialList[key]?.materialTextureId && materialList[key]?.materialTextureId + ',' + materialList[key]?.materialTexture}
                                onChange={(e: string) => {
                                    const newData = materialList.map((item: any, index: number) => {
                                        if (index === key) {
                                            return {
                                                ...item,
                                                materialTextureId: e.split(',')[0],
                                                materialTexture: e.split(',')[1]
                                            }
                                        }
                                        return item
                                    })
                                    setMaterialList(newData)
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
                    render: (_: any, records: any) => <Button type="link" disabled={records.source === 1} onClick={() => handleRemove(records.materialCode)}>移除</Button>
                }]}
            pagination={false}
            dataSource={popDataList} />
        <Modal width={1100} title={`选择原材料明细`} destroyOnClose
            visible={visible}
            onOk={handleAddModalOk}
            onCancel={() => {
                setVisible(false);
            }}
        >
            <PopTableContent
                data={{
                    ...(addMaterial as any),
                    columns: (addMaterial as any).columns.map((item: any) => {
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
                    records: popDataList,
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    setMaterialList(fields.map((item: any) => ({
                        ...item,
                        planPurchaseNum: item.planPurchaseNum || "1",
                        spec: item.structureSpec,
                        source: 2,
                        materialTextureId: item.structureTexture,
                        standardName: item.standardName,
                        length: item.length || 1,
                        standard: item.standard,
                        taxPrice: item.taxPrice || 1.00,
                        price: item.price || 1.00,
                        taxTotalAmount: item.taxTotalAmount || 1.00,
                        totalAmount: item.totalAmount || 1.00,
                        weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000).toFixed(3)
                    })) || [])
                }}
            />
        </Modal>
    </Modal>
    )
 }