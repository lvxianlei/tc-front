/**
 * 创建计划列表
 */
import React, { useState } from 'react';
import { Modal, Form, Button, InputNumber, Select, message } from 'antd';
import { BaseInfo, CommonTable, DetailTitle } from '../../common';
import {
    material,
    addMaterial
} from "./CreatePlan.json";
import { PopTableContent } from "./ComparesModal"
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
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
            const num = parseFloat(item.planPurchaseNum || "1")
            return ({
                ...item,
                planPurchaseNum: num,
                width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.planPurchaseNum || "1")
            return ({
                ...item,
                planPurchaseNum: num,
                width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
            })
        })])
        setVisible(false)
    }

    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.materialCode !== id))
        setPopDataList(materialList.filter((item: any) => item.materialCode !== id))
    }

    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    planPurchaseNum: value,
                    weight: ((item.proportion * (item.length || 1)) / 1000 / 1000).toFixed(3),
                    totalWeight: ((item.proportion * value * (item.length || 1)) / 1000 / 1000).toFixed(3)
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
                    totalWeight: ((item.proportion * value * (item.planPurchaseNum || 1)) / 1000 / 1000).toFixed(3)
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

    const handleCreateClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (materialList.length < 1) {
                message.error("请您选择原材料明细!");
                return false;
            }
            saveRun({
                purchasePlanDetailDTOS: materialList,
                purchaserTaskTowerIds: "",
                purchaseType: baseInfo?.purchaseType
            });
        } catch (error) {
            console.log(error);
        }
    }

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan`, data)
            message.success("创建成功！");
            props?.handleCreate({ code: 1 })
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
                setPopDataList([]);
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    props?.handleCreate();
                }}>
                    关闭
                </Button>,
                <Button key="create" type="primary" onClick={() => handleCreateClick()}>
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
                <Button type='primary' key="add" ghost style={{ marginRight: 8 }} onClick={() => setVisible(true)}>添加</Button>
                <Button type='primary' key="clear" ghost onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                }}>清空</Button>
            </div>
            <CommonTable
                rowKey={"id"}
                style={{ padding: "0" }}
                columns={[
                    ...material.map((item: any) => {
                        if (["planPurchaseNum"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 1} onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                            })
                        }
                        if (item.dataIndex === "length") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 1} onChange={(value: number) => lengthChange(value, records.id)} key={key} />
                            })
                        }
                        if (item.dataIndex === "width") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => records.source === 1 ? value || "0" : <InputNumber
                                    min={0}
                                    max={99999}
                                    value={value}
                                    precision={0}
                                    onChange={(value: number) => widthChange(value, records.id)} key={key} />
                            })
                        }
                        if (item.dataIndex === "materialStandard") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select
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
                                render: (value: number, records: any, key: number) => records.source === 1 ? records.materialTexture : <Select
                                    style={{ width: '150px' }}
                                    value={popDataList[key]?.structureTexture && popDataList[key]?.structureTexture + ',' + popDataList[key]?.materialTexture}
                                    onChange={(e: string) => {
                                        const newData = popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    structureTexture: e.split(',')[0],
                                                    materialTexture: e.split(',')[1]
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
                            materialId: item.id,
                            code: item.materialCode,
                            materialCategoryId: item.materialCategory,
                            planPurchaseNum: item.planPurchaseNum || "1",
                            source: 2,
                            standardName: item.standardName,
                            length: item.length || 1,
                            width: 0,
                            materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                            materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                            structureTexture: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                            materialTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                            weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3),
                            totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * (item.planPurchaseNum || 1)) / 1000 / 1000).toFixed(3),
                        })) || [])
                    }}
                />
            </Modal>
        </Modal>
    )
}