/**
 * 配料任务创建
 */
 import React, { useRef, useState } from 'react';
 import { Modal, Form, Button, InputNumber, Select, message, Input, Upload } from 'antd';
import { BaseInfo, CommonTable, DetailTitle } from '../../common';
import {
    material,
    addMaterial,
    baseInfoColumn
} from "./CreatePlan.json";
import { PopTableContent } from "./ComparesModal"
import {  materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
 
 export default function CreatePlan(props: any): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    let [count, setCount] = useState<number>(1);

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
                code: "", // 件号
                length: "100", // 长度
                num: 1, // 数量
                weight: 1, // 重量
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            return ({
                ...item,
                structureTexture: item?.structureTexture || materialTextureOptions?.[0]?.name,
                code: "", // 件号
                length: "100", // 长度
                num: 1, // 数量
                weight: 1, // 重量
            })
        })])
        setVisible(false)
    }

    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.id !== id))
        setPopDataList(materialList.filter((item: any) => item.id !== id))
    }

    // 复制
    const handleCopy = (options: any) => {
        const result = {
            ...options,
            code: "",
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
                    planPurchaseNum: value,
                    weight: ((item.proportion * (item.length || 1)) / 1000).toFixed(3),
                    totalWeight: ((item.proportion * value * (item.length || 1)) / 1000).toFixed(3)
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
            let flag = false,
                str = [],
                isAll = false;
            for (let i = 0; i < materialList.length; i += 1) {
                if (!materialList[i].code) {
                    flag = true
                }
                if (str.indexOf(materialList[i].code) === -1) {
                    str.push(materialList[i].code)
                } else {
                    isAll = true;
                }
            }
            if (flag) {
                message.error("请填写件号！");
                return false;
            }
            if (isAll) {
                message.error("存在相同件号的构件，请修改！");
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

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/task/purchase/manual`, data)
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
                setPopDataList([]);
                addCollectionForm.resetFields();
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    setMaterialList([]);
                    setPopDataList([]);
                    addCollectionForm.resetFields();
                    props?.handleCreate();
                }}>
                    关闭
                </Button>,
                <Button type="primary" onClick={() => handleCreateClick()} loading={saveLoading}>
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
            <Upload 
                accept=".xls,.xlsx"
                style={{marginRight: 8}}
                action={ () => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl+'/tower-supply/task/purchase/manual/component'
                } } 
                headers={
                    {
                        'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }
                }
                showUploadList={ false }
                onChange={ (info) => {
                    if(info.file.response && !info.file.response?.success) {
                        message.warning(info.file.response?.msg)
                    }else if(info.file.response && info.file.response?.success){
                        console.log(info.file.response, "info.file.response")
                        message.success('导入成功！');
                        let counts: number = count,
                         result = popDataList;
                        if (info.file.response.data && info.file.response.data.length > 0) {
                            for (let i = 0; i < info.file.response.data.length; i += 1) {
                                const v = {
                                    ...info.file.response.data[i],
                                    id: (+counts) + 1 + "",
                                }
                                counts = counts + 1;
                                result.push(v)
                            }
                        }
                        setMaterialList(result.slice(0));
                        setPopDataList(result.slice(0))
                        setCount(counts);
                    }
                } }
            >
                <Button type="primary" style={{marginRight: 8}} ghost>导入</Button>
            </Upload>
            <Button type='primary' ghost onClick={() => setVisible(true)}>添加</Button>
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
                            render: (value: number, records: any, key: number) => <Input value={value || ""} onChange={(e: any) => lengthChange(e.target.value, records.id, "code")} />
                        })
                    }
                    // 长度
                    if (item.dataIndex === "length") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={100} value={value || 100} onChange={(value: number) => lengthChange(value, records.id, "length")} key={key} />
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
                    render: (_: any, records: any) => <>
                        <Button type="link" style={{marginRight: 8}} onClick={() => handleCopy(records)}>复制</Button>
                        <Button type="link" onClick={() => handleRemove(records.id)}>移除</Button>
                    </>
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
                        code: item.code || "", // 件号
                        length: item.length || "100", // 长度
                        num: item.num || 1, // 数量
                        weight: item.weight || 1, // 重量
                    })) || [])
                }}
            />
        </Modal>
    </Modal>
    )
 }