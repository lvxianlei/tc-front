/**
 * 配料任务创建
 */
 import React, { useRef, useState } from 'react';
 import { Modal, Form, Button, InputNumber, Select, message, Input } from 'antd';
import { BaseInfo, CommonTable, DetailTitle } from '../../common';
import {
    material,
    addMaterial,
    baseInfoColumn
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

    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        for (let i = 0; i < popDataList.length; i += 1) {
            for (let p = 0; p < materialList.length; p += 1) {
                if (popDataList[i].id === materialList[p].id) {
                    materialList[p].materialName = popDataList[i].materialName;
                    materialList[p].materialTexture = popDataList[i].materialTexture;
                }
            }
        }
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            return ({
                ...item,
                structureTexture: item?.structureTexture || materialTextureOptions?.[0]?.name,
                code: "1", // 件号
                length: "1", // 长度
                num: 1, // 数量
                weight: 1, // 重量
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            return ({
                ...item,
                structureTexture: item?.structureTexture || materialTextureOptions?.[0]?.name,
                code: "1", // 件号
                length: "1", // 长度
                num: 1, // 数量
                weight: 1, // 重量
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

    // 长度
    const lengthChange = (value: any, id: string, keys: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                item[keys] = value
                return item;
            }
            return item
        })
        console.log(list, "修改后的数据========>>>")
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
                components: materialList,
                ...baseInfo
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
            title={'配料任务创建'}
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
            col={2}
            classStyle="baseInfo"
            columns={
                baseInfoColumn.map((item: any) => {
                    // 标准
                    if (item.dataIndex === "materialStandard") {
                        return ({
                            ...item,
                            type: "select",
                            enum: materialStandardEnum
                        })
                    }
                    return item;
                })
            }
        />
        <DetailTitle title="提料明细" />
        <div className='btnWrapper'>
            <Button type='primary' ghost style={{marginRight: 8}}  onClick={() => setVisible(true)}>添加</Button>
            <Button type='primary' ghost onClick={() => {
                setMaterialList([]);
                setPopDataList([]);
            }}>清空</Button>
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
                    // 材质
                    if (item.dataIndex === "structureTexture") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <Select
                                style={{ width: '150px' }}
                                value={records?.structureTexture || materialTextureOptions?.[0]?.name}
                                onChange={(value: string) => lengthChange(value, records.id, "structureTexture")}
                            >
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        })
                    }
                    // 件号
                    if (["code"].includes(item.dataIndex)) {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <Input value={value || 1} onChange={(e: any) => lengthChange(e.target.value, records.id, "code")} />
                        })
                    }
                    // 长度
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 1} onChange={(value: number) => lengthChange(value, records.id, "length")} key={key} />
                        })
                    }
                    // 数量
                    if (item.dataIndex === "num") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} step={0.01} value={value || 1} onChange={(value: number) => lengthChange(value, records.id, "num")} key={key} />
                        })
                    }
                    // 重量
                    if (item.dataIndex === "weight") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={1} step={0.001} value={value || 1} onChange={(value: number) => lengthChange(value, records.id, "weight")} key={key} />
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
        <Modal width={1100} title={`选择提料明细`} destroyOnClose
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
                        structureTexture: item?.structureTexture || materialTextureOptions?.[0]?.name,
                        code: "1", // 件号
                        length: "1", // 长度
                        num: 1, // 数量
                        weight: 1, // 重量
                    })) || [])
                }}
            />
        </Modal>
    </Modal>
    )
 }