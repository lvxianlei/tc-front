/**
 * 创建计划列表
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message, InputNumber, Select, TreeSelect } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    baseInfoColumn,
    addMaterial,
    addPlanMaterial
} from "./CreatePlan.json";
import { qualityAssuranceOptions } from "../../../configuration/DictionaryOptions"
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { totalTaxPrice, totalUnTaxPrice, unTaxPrice } from '@utils/calcUtil';
import "./CreatePlan.less";
const { TreeNode } = TreeSelect;
export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [planVisible, setPlanVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [materialPlanList, setMaterialPlanList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [supplierId, setSupplierId] = useState<any>("");
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    // /warehouse/tree/{warehouseId}
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/warehousingEntry/auxiliary/${props.id}`
            )
            setPopDataList(result?.warehousingEntryDetailList)
            setMaterialList(result?.warehousingEntryDetailList)
            setSupplierId(result?.supplierId)
            setWarehouseId(result?.warehouseId)
            resole({
                ...result,
                supplierId: {
                    id: result?.supplierId,
                    value: result?.supplierName,
                    records: [{
                        id: result?.supplierId,
                        supplierName: result?.supplierName,
                        contactsPhone: result?.contactsPhone,
                        contactsUser: result?.contactsUser
                    }]
                },
                warehouseId: {
                    value: result?.warehouseId,
                    label: result?.warehouseName
                },
                warehousingType: result?.warehousingType || "1"
            })
        } catch (error) {
            reject(error)
        }
    }), { ready: props.type === "edit" && props.id, refreshDeps: [props.type, props.id] })

    //库区库位
    const { data: locatorData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree/${warehouseId}`)
            resole(result.map((item: any) => ({
                label: item.name,
                value: item.id
            })))
        } catch (error) {
            reject(error)
        }
    }), { ready: !!warehouseId, refreshDeps: [warehouseId] })

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
            return ({
                ...item,
            })
        })])
        setPopDataList([...materialList, ...newMaterialList].map((item: any, index: number) => {
            return ({
                ...item,
                key: `${item.id}-${item.receiveStockId}-${item.receiveStockDetailId}-${index}`
            })
        }))
        setVisible(false)
    }

    const handleAddPlanModalOk = () => {
        const newMaterialList = materialPlanList.filter((item: any) => !materialPlanList.find((maItem: any) => item.id === maItem.id))
        setMaterialPlanList([...materialPlanList, ...newMaterialList])
        setPopDataList(materialPlanList.map((item: any, index: number) => {
            return ({
                ...item,
                materialName: item.materialName,
                structureSpec: item.structureSpec,
                num: item.planPurchaseNum || 1,
                unit: item.unit,
                purchasePlanId: item.id,
                taxPrice: 1,
                tax: 0,
                totalTaxAmount: totalTaxPrice(1, item.planPurchaseNum || 1),
                price: unTaxPrice(1, 0),
                totalAmount: totalUnTaxPrice(totalTaxPrice(1, item.planPurchaseNum || 1), 0),
                purchasePlanNumber: item.purchasePlanNumber,
                key: `${item.id}-${item.receiveStockId}-${item.receiveStockDetailId}-${index}`
            })
        }))
        setPlanVisible(false)
    }

    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.key !== id))
        setPopDataList(popDataList.filter((item: any) => item.key !== id))
    }

    const performanceBondChange = (fields: { [key: string]: any }) => {
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId.value);
            return;
        }
        if (fields.supplierId) {
            setSupplierId(fields.supplierId?.id);
            return;
        }
    }

    const handleCreateClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (popDataList.length < 1) {
                message.error("请添加入库明细!");
                return false;
            }
            saveRun({
                warehousingEntryDetailList: popDataList,
                ...baseInfo,
                contactsPhone: baseInfo.supplierId?.records[0]?.contactManTel,
                contactsUser: baseInfo.supplierId?.records[0]?.contactMan,
                supplierId: baseInfo.supplierId?.records[0]?.id,
                supplierName: baseInfo.supplierId?.records[0]?.supplierName,
                warehouseId: baseInfo.warehouseId.value,
                warehouseName: baseInfo.warehouseId.label
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
            addCollectionForm.setFieldsValue({
                warehousingType: "1"
            })
        }
    }, [props.visible])

    const handleMaterailChange = (value: any, index: number, dataIndex: string) => {
        const newData = popDataList.map((item: any, pIndex: number) => {
            if (index === pIndex) {
                switch (dataIndex) {
                    case "num":
                        return ({
                            ...item,
                            num: value,
                            taxPrice: item.taxPrice,
                            totalTaxAmount: totalTaxPrice(item.taxPrice, value),
                            price: unTaxPrice(item.taxPrice, item.tax),
                            totalAmount: totalUnTaxPrice(totalTaxPrice(item.taxPrice, value), item.tax),
                        })
                    case "tax":
                        return ({
                            ...item,
                            tax: value,
                            taxPrice: item.taxPrice,
                            totalTaxAmount: totalTaxPrice(item.taxPrice, item.num),
                            price: unTaxPrice(item.taxPrice, value),
                            totalAmount: totalUnTaxPrice(totalTaxPrice(item.taxPrice, item.num), value),
                        })
                    case "taxPrice":
                        return ({
                            ...item,
                            taxPrice: value,
                            totalTaxAmount: totalTaxPrice(value, item.num),
                            price: unTaxPrice(value, item.tax),
                            totalAmount: totalUnTaxPrice(totalTaxPrice(value, item.num), item.tax),

                        })
                }
            }
            return item;
        })
        setPopDataList(newData)
    }

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[props.type === "create" ? "post" : "put"](`/tower-storage/warehousingEntry/auxiliary`, props.type === "create" ? {
                ...data,
                materialType: 2
            } : {
                ...data,
                materialType: 2,
                id: props.id
            })
            message.success("操作成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Modal
            title={`${props.type === "edit" ? "编辑入库单" : '创建入库单'}`}
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
                    取消
                </Button>,
                <Button key="create" type="primary" onClick={() => handleCreateClick()}>
                    确定
                </Button>
            ]}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                edit
                dataSource={{ ...data }}
                col={2}
                classStyle="baseInfo"
                columns={baseInfoColumn.map((item: any) => {
                    if (item.dataIndex === "warehouseId") {
                        return ({
                            ...item,
                            labelInValue: true,
                            enum: batchingStrategy?.map((item: any) => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    if (item.dataIndex === "supplierId") {
                        return ({
                            ...item, search: item.search.map((res: any) => {
                                if (res.dataIndex === 'qualityAssurance') {
                                    return ({
                                        ...res,
                                        enum: qualityAssuranceEnum
                                    })
                                }
                                return res
                            })
                        })
                    }
                    return item
                })}
                onChange={performanceBondChange}
            />
            <DetailTitle title="入库明细" />
            <div className='btnWrapper'>
                <Button type='primary'
                    key="add"
                    ghost
                    style={{ marginRight: 8 }}
                    disabled={!(warehouseId && supplierId)}
                    onClick={() => setVisible(true)}>选择到货明细</Button>
                <Button
                    type='primary'
                    key="clear"
                    ghost
                    disabled={!(warehouseId && supplierId)}
                    onClick={() => setPlanVisible(true)}>选择计划明细</Button>
            </div>
            <CommonTable
                rowKey="key"
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
                        switch (item.dataIndex) {
                            case "num":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                        if (records?.purchasePlanId) {
                                            return <InputNumber
                                                min={1}
                                                value={value || 1}
                                                onChange={(value: number) => handleMaterailChange(value, key, "num")}
                                                key={key} />
                                        }
                                        return value
                                    }
                                })
                            case "taxPrice":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                        if (records?.purchasePlanId) {
                                            return <InputNumber
                                                value={value || 1}
                                                onChange={(value: number) => handleMaterailChange(value, key, "taxPrice")}
                                            />
                                        }
                                        return value
                                    }
                                })
                            case "tax":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                        if (records?.purchasePlanId) {
                                            return <InputNumber
                                                value={value || 0}
                                                onChange={(value: number) => handleMaterailChange(value, key, "tax")}
                                            />
                                        }
                                        return value
                                    }
                                })
                            case "location":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                        if (records?.purchasePlanId) {
                                            return <TreeSelect
                                                style={{ width: '100%' }}
                                                value={value}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(value:any)=>handleMaterailChange(value, key, "location")}
                                            >
                                                <TreeNode value="parent 1" title="parent 1">
                                                    <TreeNode value="parent 1-0" title="parent 1-0">
                                                        <TreeNode value="leaf1" title="leaf1" />
                                                        <TreeNode value="leaf2" title="leaf2" />
                                                    </TreeNode>
                                                    <TreeNode value="parent 1-1" title="parent 1-1">
                                                        <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
                                                    </TreeNode>
                                                </TreeNode>
                                            </TreeSelect>
                                        }
                                        return value
                                    }
                                })
                            default:
                                return item
                        }
                    }),
                    {
                        title: "操作",
                        fixed: "right",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            <Button
                                type="link"
                                disabled={records.source === 1}
                                onClick={() => handleRemove(records.key)}
                            >移除</Button>
                        </>
                    }]}
                pagination={false}
                dataSource={popDataList} />
            <Modal width={1100} title={`选择到货明细`} destroyOnClose
                visible={visible}
                onOk={handleAddModalOk}
                onCancel={() => setVisible(false)}
            >
                <PopTableContent
                    data={{
                        ...addMaterial as any,
                        path: `${addMaterial.path}?supplierId=${supplierId}&warehouseId=${warehouseId}`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => setMaterialList(fields || [])}
                />
            </Modal>
            <Modal width={1100} title={`选择计划明细`} destroyOnClose
                visible={planVisible}
                onOk={handleAddPlanModalOk}
                onCancel={() => setPlanVisible(false)}
            >
                <PopTableContent
                    data={{
                        ...addPlanMaterial as any,
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => setMaterialPlanList(fields || [])}
                />
            </Modal>
        </Modal>
    )
}