/**
 * 创建计划列表
 */
import React, { useState } from 'react';
import { Modal, Form, Button, InputNumber, Select, message, Input } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    addMaterial
} from "./CreatePlan.json";
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { spawn } from 'child_process';

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [addCollectionNumberForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [visibleNumber, setVisibleNumber] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    
    let [count, setCount] = useState<number>(1);
    let [indexNumber, setIndexNumber] = useState<number>(0);
    let [dataCopy, setDataCopy] = useState<any[]>([]);

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

    const handleAddModalOkNumber = async() => {
        const baseData = await addCollectionNumberForm.validateFields();
        console.log(baseData, "baseData")
        let ix = count,
            materialListCopy = materialList,
            popDataListCopy = popDataList;
        for (let i = 0; i < baseData.name; i += 1) {
            const result = {
                ...dataCopy,
                width: 0,
                length: 0,
                planPurchaseNum: "",
                totalWeight: "",
                id: ix + ""
            }
            ix = ix + 1;
            materialListCopy.splice((indexNumber + 1), 0, result);
            popDataListCopy.splice((indexNumber + 1), 0, result);
        }

        setCount(ix)
        setMaterialList(materialListCopy.splice(0))
        setPopDataList(popDataListCopy.splice(0));
        setVisibleNumber(false);

    }

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
            const num = parseFloat(item.planPurchaseNum || "1")
            return ({
                ...item,
                planPurchaseNum: num,
                // width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            const num = parseFloat(item.planPurchaseNum || "1")
            return ({
                ...item,
                planPurchaseNum: num,
                // width: formatSpec(item.structureSpec).width,
                // length: formatSpec(item.structureSpec).length,
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
            // 添加对长度以及数量的拦截
            let flag = false;
            for (let i = 0; i < materialList.length; i += 1) {
                if (!(materialList[i].length && materialList[i].planPurchaseNum && (materialList[i].width !== ""))) {
                    flag = true;
                }
            }
            if (flag) {
                message.error("请您填写长度、宽度、数量！");
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
                                render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                            })
                        }
                        if (item.dataIndex === "length") {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <InputNumber min={0} value={value || 0} onChange={(value: number) => lengthChange(value, records.id)} key={key} />
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
                        render: (_: any, records: any, index: number) => <>
                            <Button type="link" style={{ marginRight: 8 }} onClick={() => {
                                setIndexNumber(index);
                                setDataCopy(records);
                                setVisibleNumber(true);
                            }}>复制</Button>
                            <Button type="link" disabled={records.source === 1} onClick={() => handleRemove(records.id)}>移除</Button>
                        </>
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
                            planPurchaseNum: item.planPurchaseNum || 1,
                            source: 2,
                            standardName: item.standardName,
                            length: item.length || 0,
                            width: item.width || 0,
                            materialStandard: item?.materialStandard ? item?.materialStandard : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.id : "",
                            materialStandardName: item?.materialStandardName ? item?.materialStandardName : (materialStandardOptions && materialStandardOptions.length > 0) ? materialStandardOptions[0]?.name : "",
                            structureTextureId: item?.structureTextureId ? item?.structureTextureId : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.id : "",
                            structureTexture: item?.structureTexture ? item?.structureTexture : (materialTextureOptions && materialTextureOptions.length > 0) ? materialTextureOptions[0]?.name : "",
                            weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3),
                            totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * (item.planPurchaseNum || 1)) / 1000 / 1000).toFixed(3),
                        })) || [])
                    }}
                />
            </Modal>
            <Modal width={400} title={`请输入要复制的行数`} destroyOnClose
                visible={visibleNumber}
                onOk={handleAddModalOkNumber}
                onCancel={() => {
                    setVisibleNumber(false);
                }}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}
                    initialValues={{ remember: true }}
                    onFinish={handleAddModalOkNumber}
                    autoComplete="off"
                    form={addCollectionNumberForm}
                >

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: '请输入要复制的行数' }]}
                    >
                        <InputNumber
                            min={1}
                            max={100}
                            style={{width: 200}}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </Modal>
    )
}