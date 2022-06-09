import React, { useState } from "react"
import { Button, InputNumber, Modal, Select } from 'antd'
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom'
import { DetailContent, CommonTable, CommonAliTable, PopTableContent } from '../../common'
import { PurchaseList, PurchaseTypeStatistics } from "./planListData.json"
import { addMaterial } from "./CreatePlan.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ExportList from '../../../components/export/list';
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
interface PagenationProps {
    current: number
    pageSize: number
}
export default function Edit() {
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [materialList, setMaterialList] = useState<any[]>([])
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
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
    const paginationChange = (page: number, pageSize: number) => {
        run(page, pageSize)
    }

    const { loading: purchasePlanLoading, data: purchasePlanData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/total/${params.id}`)
            const total: { [key: string]: any } = await RequestUtil.get(`tower-supply/materialPurchasePlan/list/mesg/${params.id}`)
            resole({ data: result, total })
        } catch (error) {
            reject(error)
        }
    }))

    const { data: dataTable, run } = useRequest<{ [key: string]: any }>((current = 1, size = 10) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/${params.id}`, {
                current: current,
                size: size
            })
            setPopDataList([...result.records])
            resole(result)
            setPagenation({ ...pagenation, current: result.page, pageSize: result.size })
        } catch (error) {
            reject(error)
        }
    }))
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
    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.materialCode === maItem.materialCode))
        for (let i = 0; i < popDataList.length; i += 1) {
            for (let p = 0; p < materialList.length; p += 1) {
                if (popDataList[i].id === materialList[p].id) {
                    materialList[p].materialTextureId = popDataList[i].materialTextureId;
                    materialList[p].materialTexture = popDataList[i].materialTexture;
                }
            }
        }
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

    const handleSave = () => {

    }

    return (
        <>
            <DetailContent title={<>
                <Button
                    key="export" type="primary" ghost
                    onClick={() => { setIsExportStoreList(true) }}
                    style={{ marginBottom: 16 }}
                >导出</Button>
                {isEdit && <Button key="add" type="primary" style={{ margin: "0px 16px" }} onClick={() => setVisible(true)}>添加</Button>}
            </>}
                operation={[
                    <>{!isEdit && <Button key="edit" type="primary" style={{ marginRight: 16 }} onClick={() => setIsEdit(true)}>编辑</Button>}</>,
                    <Button key="cancel" type="primary" style={{ marginRight: 16 }} onClick={() => { }}>取消计划</Button>,
                    <>{isEdit && <Button key="save" type="primary" style={{ marginRight: 16 }} onClick={handleSave}>保存</Button>}</>,
                    <Button key="goback" type="ghost" onClick={() => history.goBack()}>返回</Button>
                ]}>
                {!isEdit && <CommonAliTable
                    loading={purchasePlanLoading}
                    columns={PurchaseList}
                    dataSource={dataTable?.records || []}
                    pagination={{
                        size: "small",
                        pageSize: pagenation.pageSize,
                        onChange: paginationChange,
                        current: pagenation.current,
                        total: dataTable?.total
                    }}
                />}
                {isEdit && <CommonTable
                    rowKey="id"
                    style={{ padding: "0" }}
                    columns={[
                        ...PurchaseList.map((item: any) => {
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
                            if (item.dataIndex === "standard") {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select
                                        style={{ width: '150px' }}
                                        value={popDataList[key]?.standard && popDataList[key]?.standard + ',' + popDataList[key]?.materialStandardName}
                                        onChange={(e: string) => {
                                            const newData = popDataList.map((item: any, index: number) => {
                                                if (index === key) {
                                                    return {
                                                        ...item,
                                                        standard: e.split(',')[0],
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
                            if (item.dataIndex === "materialTextureId") {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => records.source === 1 ? records.materialTexture : <Select
                                        style={{ width: '150px' }}
                                        value={popDataList[key]?.materialTextureId && popDataList[key]?.materialTextureId + ',' + popDataList[key]?.materialTexture}
                                        onChange={(e: string) => {
                                            const newData = popDataList.map((item: any, index: number) => {
                                                if (index === key) {
                                                    return {
                                                        ...item,
                                                        materialTextureId: e.split(',')[0],
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
                    dataSource={popDataList} />}
                <div style={{ marginBottom: 12 }}>
                    采购类型统计： 圆钢总重（t）：<span style={{ color: "#FF8C00" }}>{purchasePlanData?.total?.roundSteelTotal === -1 ? "0" : purchasePlanData?.total?.roundSteelTotal}</span>
                    <span style={{ margin: "0px 12px" }}>角钢总重（t）：<span style={{ color: "#FF8C00" }}>{purchasePlanData?.total?.angleSteelTotal === -1 ? "0" : purchasePlanData?.total?.angleSteelTotal}</span></span>
                    钢板总重（t）：<span style={{ color: "#FF8C00" }}>{purchasePlanData?.total?.steelPlateTotal === -1 ? "0" : purchasePlanData?.total?.steelPlateTotal}</span>
                </div>
                <CommonTable loading={purchasePlanLoading} columns={PurchaseTypeStatistics} dataSource={purchasePlanData?.data || []} />
            </DetailContent>
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
                            materialCode: item.materialCode,
                            materialCategoryId: item.materialCategoryId,
                            planPurchaseNum: item.planPurchaseNum || "1",
                            structureSpec: item.structureSpec,
                            source: 2,
                            structureTexture: item.structureTexture,
                            materialStandardName: item.materialStandardName,
                            length: item.length || 1,
                            materialStandard: item.materialStandard,
                            taxPrice: item.taxPrice || 1.00,
                            price: item.price || 1.00,
                            taxTotalAmount: item.taxTotalAmount || 1.00,
                            totalAmount: item.totalAmount || 1.00,
                            weight: ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3),
                            totalWeight: ((Number(item?.proportion || 1) * Number(item.length || 1) * (item.planPurchaseNum || 1)) / 1000 / 1000).toFixed(3),
                        })) || [])
                    }}
                />
            </Modal>
            {isExport ? <ExportList
                history={history}
                location={location}
                match={match}
                columnsKey={() => {
                    let keys = [...PurchaseList]
                    return keys
                }}
                current={purchasePlanData?.current || 1}
                size={dataTable?.records.length || 10}
                total={dataTable?.records.length || 0}
                url={`/tower-supply/materialPurchasePlan/list/${params.id}`}
                serchObj={{}}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </>
    )
}