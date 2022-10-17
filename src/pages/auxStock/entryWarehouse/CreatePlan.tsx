/**
 * 创建计划列表
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message, InputNumber, TreeSelect } from 'antd';
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
export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [planVisible, setPlanVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [materialPlanList, setMaterialPlanList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string | undefined>();
    const [supplierId, setSupplierId] = useState<any>("");
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
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
    }), {
        ready: props.type === "edit" && props.id,
        refreshDeps: [props.type, props.id]
    })
    //库区库位
    const { data: locatorData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree/${warehouseId}`)
            resole(result?.map((item: any) => ({
                label: item.name,
                value: item.id,
                key: item.id,
                disabled: true,
                children: item.children?.map((cItem: any) => ({
                    label: cItem.name,
                    value: `${item.id}-${cItem.id}`,
                    key: `${item.id}-${cItem.id}`
                }) || [])
            })) || [])
        } catch (error) {
            reject(error)
        }
    }), { ready: props.visible && !!warehouseId, refreshDeps: [warehouseId] })

    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        setMaterialList([...materialList, ...newMaterialList])
        setPopDataList(materialList.map((item: any, index: number) => {
            return ({
                ...item,
                totalTaxPrice: item.totalTaxAmount,
                totalPrice: item.totalAmount,
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
                receiveTime: item.createTime,
                num: item.planPurchaseNum || 1,
                purchasePlanId: item.id,
                taxPrice: 1,
                tax: 0,
                totalTaxPrice: totalTaxPrice(1, item.planPurchaseNum || 1),
                price: unTaxPrice(1, 0),
                totalPrice: totalUnTaxPrice(totalTaxPrice(1, item.planPurchaseNum || 1), 0),
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
            let warehousingEntryDetailList = [...popDataList]
            if (warehousingEntryDetailList.length < 1) {
                message.error("请添加入库明细!");
                return false;
            }
            if (props.type === "create") {
                warehousingEntryDetailList.forEach((item: any) => {
                    delete item.id
                    delete item.key
                })
            }
            await saveRun({
                warehousingEntryDetailList,
                ...baseInfo,
                contactsPhone: baseInfo.supplierId?.records[0]?.contactManTel,
                contactsUser: baseInfo.supplierId?.records[0]?.contactMan,
                supplierId: baseInfo.supplierId?.records[0]?.id,
                supplierName: baseInfo.supplierId?.records[0]?.supplierName,
                warehouseId: baseInfo.warehouseId.value,
                warehouseName: baseInfo.warehouseId.label
            });
            setWarehouseId(undefined)
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
                            totalTaxPrice: totalTaxPrice(item.taxPrice, value),
                            price: unTaxPrice(item.taxPrice, item.tax),
                            totalPrice: totalUnTaxPrice(totalTaxPrice(item.taxPrice, value), item.tax),
                        })
                    case "tax":
                        return ({
                            ...item,
                            tax: value,
                            taxPrice: item.taxPrice,
                            totalTaxPrice: totalTaxPrice(item.taxPrice, item.num),
                            price: unTaxPrice(item.taxPrice, value),
                            totalPrice: totalUnTaxPrice(totalTaxPrice(item.taxPrice, item.num), value),
                        })
                    case "taxPrice":
                        return ({
                            ...item,
                            taxPrice: value,
                            totalTaxPrice: totalTaxPrice(value, item.num),
                            price: unTaxPrice(value, item.tax),
                            totalPrice: totalUnTaxPrice(totalTaxPrice(value, item.num), item.tax)
                        })
                    case "locatorId":
                        const valueIds = value.value.split("-")
                        return ({
                            ...item,
                            locatorId: valueIds[1],
                            location: value.label,
                            reservoirId: valueIds[0],
                            reservoirArea: locatorData.find((item: any) => item.value === valueIds[0]).label
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

    return (<>
        <Modal
            title={`${props.type === "edit" ? "编辑入库单" : '创建入库单'}`}
            visible={props.visible}
            onCancel={() => {
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button
                    key="back"
                    onClick={() => {
                        props?.handleCreate();
                    }}>
                    取消
                </Button>,
                <Button
                    key="create"
                    type="primary"
                    onClick={() => handleCreateClick()}>
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
                            case "locatorId":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                        if (records?.purchasePlanId) {
                                            return <TreeSelect
                                                style={{ width: 130 }}
                                                value={{
                                                    label: records.location,
                                                    value: `${records.reservoirId}-${value}`
                                                }}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="请选择"
                                                allowClear
                                                labelInValue
                                                showCheckedStrategy="SHOW_ALL"
                                                treeDefaultExpandAll
                                                treeData={locatorData}
                                                onChange={(value: any) => handleMaterailChange(value, key, "locatorId")}
                                            />
                                        }
                                        return records.location
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
        </Modal>
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
    </>
    )
}