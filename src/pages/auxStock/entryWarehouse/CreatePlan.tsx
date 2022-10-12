/**
 * 创建计划列表
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    material,
    baseInfoColumn,
    addMaterial
} from "./CreatePlan.json";
import { qualityAssuranceOptions } from "../../../configuration/DictionaryOptions"
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [supplierId, setSupplierId] = useState<any>("");
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

    let [count, setCount] = useState<number>(1);

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
        setPopDataList([...materialList, ...newMaterialList.map((item: any, index: number) => {
            return ({
                ...item,
                key: `${item.receiveStockId}-${item.receiveStockDetailId}-${index}`
            })
        })])
        setVisible(false)
    }

    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.key !== id))
        setPopDataList(popDataList.filter((item: any) => item.key !== id))
    }

    // 复制
    const handleCopy = (options: any) => {
        const result = {
            ...options,
            width: "",
            length: "",
            planPurchaseNum: "",
            totalWeight: "",
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

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
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
            if (materialList.length < 1) {
                message.error("请您选择原材料明细!");
                return false;
            }
            saveRun({
                warehousingEntryDetailList: materialList,
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
                <Button type='primary' key="add" ghost style={{ marginRight: 8 }} disabled={!(warehouseId && supplierId)} onClick={() => setVisible(true)}>选择</Button>
                <Button type='primary' key="clear" ghost onClick={() => message.warning("暂无此功能！")}>导入</Button>
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
                    ...material,
                    {
                        title: "操作",
                        fixed: "right",
                        dataIndex: "opration",
                        render: (_: any, records: any) => <>
                            {/* <Button type="link" style={{marginRight: 8}} onClick={() => handleCopy(records)}>复制</Button> */}
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
        </Modal>
    )
}