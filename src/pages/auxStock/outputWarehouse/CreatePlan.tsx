/**
 * 创建出库单
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, InputNumber, message, Spin } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import {
    material,
    baseInfoColumn,
    addMaterial
} from "./CreatePlan.json";
import moment from 'moment';
import "./CreatePlan.less";

export default function CreatePlan(props: any): JSX.Element {
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
                    materialList[p].structureTexture = popDataList[i].structureTexture;
                    materialList[p].materialTexture = popDataList[i].materialTexture;
                }
            }
        }
        setMaterialList([...materialList, ...newMaterialList.map((item: any) => {
            return ({
                ...item,
                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                        : (Number(item?.proportion || 1) / 1000).toFixed(3),
                totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(3)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(3)
                        : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(3)
            })
        })])
        setPopDataList([...materialList, ...newMaterialList.map((item: any) => {
            return ({
                ...item,
                weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                        : (Number(item?.proportion || 1) / 1000).toFixed(3),
                totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(3)
                    : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(3)
                        : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(3)
            })
        })])
        setVisible(false)
    }

    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    num: value,
                    weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) / 1000).toFixed(3),
                    totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * value / 1000 / 1000).toFixed(3)
                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * value / 1000 / 1000 / 1000).toFixed(3)
                            : (Number(item?.proportion || 1) * value / 1000).toFixed(3)
                })
            }
            return item
        })
        setMaterialList(list.slice(0));
        setPopDataList(list.slice(0))
    }

    // 移除
    const handleRemove = (id: string) => {
        setMaterialList(materialList.filter((item: any) => item.id !== id))
        setPopDataList(materialList.filter((item: any) => item.id !== id))
    }

    const performanceBondChange = (fields: { [key: string]: any }) => {
        if (fields.warehouseId) {
            setWarehouseId(fields.warehouseId);
            return;
        }
        if (fields.pickingUserId) {
            addCollectionForm.setFieldsValue({
                departmentName: fields.pickingUserId.records[0].deptName
            })
            return;
        }
    }

    const handleCreateClick = async () => {
        try {
            const baseInfo = await addCollectionForm.validateFields();
            if (materialList.length < 1) {
                message.error("请您选择出库明细!");
                return false;
            }
            // 添加对长度以及数量的拦截
            let flag = false;
            for (let i = 0; i < materialList.length; i += 1) {
                if (!(materialList[i].num)) {
                    flag = true;
                }
            }
            if (flag) {
                message.error("请您填写数量！");
                return false;
            }
            saveRun({
                outStockDetailDTOList: materialList,
                ...baseInfo,
                pickingUserId: baseInfo?.pickingUserId.id
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
            addCollectionForm.setFieldsValue({
                pickingTime: moment(new Date()).format("YYYY-MM-DD")
            })
        }
    }, [props.visible])

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const path = props.type === "create" ? `/tower-storage/outStock/save` : '/tower-storage/outStock'
            const result: { [key: string]: any } = await RequestUtil[props.type === "create" ? "post" : "put"](path, props.type === "create" ? {
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

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/outStock/${props.id}`,
                { materialType: 2 }
            )
            setPopDataList(result?.outStockDetailVOList)
            setMaterialList(result?.outStockDetailVOList)
            resole({
                ...result,
                pickingUserId: {
                    id: result?.applyStaffId,
                    value: result?.applyStaffName
                },
                pickingTime: result?.createTime
            })
        } catch (error) {
            reject(error)
        }
    }), { ready: props.type === "edit" && props.id, refreshDeps: [props.type, props.id] })

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/warehouse/getWarehouses`, {
                materialType: 2
            });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Modal
            title={`${props.type === "create" ? '创建出库单' : "编辑出库单"}`}
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
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    form={addCollectionForm}
                    edit
                    dataSource={data || {}}
                    col={2}
                    classStyle="baseInfo"
                    columns={baseInfoColumn.map((item: any) => {
                        if (item.dataIndex === "warehouseId") {
                            return ({
                                ...item,
                                enum: batchingStrategy?.map((item: any) => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            })
                        }
                        return item
                    })}
                    onChange={performanceBondChange}
                />
                <DetailTitle title="出库明细" />
                <div className='btnWrapper'>
                    <Button
                        type='primary'
                        key="add"
                        ghost
                        style={{ marginRight: 8 }}
                        disabled={!warehouseId}
                        onClick={() => setVisible(true)}>选择</Button>
                </div>
                <CommonTable
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
                            if (["num"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || undefined} onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                                })
                            }
                            return item;
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
            </Spin>
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
                        path: `${addMaterial.path}/${warehouseId}?materialType=1`
                    }}
                    value={{
                        id: "",
                        records: popDataList,
                        value: ""
                    }}
                    onChange={(fields: any[]) => {
                        setMaterialList(fields.map((item: any) => ({
                            ...item,
                            weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) / 1000).toFixed(3),
                            totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.num || 1) / 1000 / 1000).toFixed(3)
                                : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width || 0) * (item.num || 1) / 1000 / 1000 / 1000).toFixed(3)
                                    : (Number(item?.proportion || 1) * (item.num || 1) / 1000).toFixed(3)
                        })) || [])
                    }}
                />
            </Modal>
        </Modal>
    )
}