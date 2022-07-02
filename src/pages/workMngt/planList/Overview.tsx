import React, { Fragment, useState } from "react"
import { Button, InputNumber, message, Modal, Select } from 'antd'
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom'
import { DetailContent, CommonTable, PopTableContent, SearchTable } from '../../common'
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

    const paginationChange = (page: number, pageSize: number) => run(page, pageSize)

    const { loading, data: dataTable, run } = useRequest<{ [key: string]: any }>((current = 1, size = 10) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPurchasePlan/list/${params.id}`, {
                current: current,
                size: size
            })
            setPopDataList(result.records.map(((item: any, index: number) => ({
                ...item,
                source: 1,
                id: `${item.materialName}-${index}`
            }))))
            resole(result)
            setPagenation({ ...pagenation, current: result.page, pageSize: result.size })
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: cancelPlanLoading, run: cancelPlanRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((options: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan/purchasePlanInfo/save`, {
                ...options
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const handleRemove = (id: string) => {
        setPopDataList(popDataList.filter((item: any) => item.id !== id))
    }

    const handleNumChange = (value: number, id: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                return ({
                    ...item,
                    planPurchaseNum: value,
                    // weight: ((item.proportion * (item.length || 1)) / 1000 / 1000).toFixed(3),
                    // totalWeight: ((item.proportion * value * (item.length || 1)) / 1000 / 1000).toFixed(3)
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
                    weight: (((item.proportion || "0") * value) / 1000 / 1000).toFixed(3),
                    totalWeight: (((item.proportion || "0") * value * (item.planPurchaseNum || 1)) / 1000 / 1000).toFixed(3)
                })
            }
            return item
        })
        setMaterialList(list);
        setPopDataList(list)
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

    const handleAddModalOk = () => {
        const newMaterialList = materialList.filter((item: any) => !materialList.find((maItem: any) => item.id === maItem.id))
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
            const taxPrice = parseFloat(item.taxOffer || "1.00")
            const price = parseFloat(item.offer || "1.00")
            return ({
                ...item,
                planPurchaseNum: num,
                taxPrice,
                price,
                width: 0,
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
                width: 0,
                // length: formatSpec(item.structureSpec).length,
                weight: item.weight || "1.00",
                taxTotalAmount: (num * taxPrice).toFixed(2),
                totalAmount: (num * price).toFixed(2)
            })
        })])
        setVisible(false)
    }

    const handleSave = async () => {
        const purchasePlanDetailDTOS = popDataList.map((item: any) => {
            delete item.id
            return item
        })
        await saveRun({
            purchasePlanId: params.id,
            purchasePlanDetailDTOS
        })
        await message.success("保存成功...")
        history.go(0)
    }

    const handleCancelPlan = async () => {
        await cancelPlanRun()
        await message.success("成功取消计划...")
        history.goBack()
    }

    return (
        <>
            <DetailContent title={<>
                <Button
                    key="export" type="primary" ghost
                    onClick={() => setIsExportStoreList(true)}
                    style={{ marginBottom: 16 }}
                >导出</Button>
                <span style={{ paddingLeft: 20 }}>批次号：<i style={{ fontStyle: "normal", color: "rgb(255, 140, 0)" }}>{location.search.replace("?", "").split("=")[1] || "(空)"}</i></span>
                {isEdit && <Button key="add" type="primary" style={{ margin: "0px 16px" }} onClick={() => setVisible(true)}>添加</Button>}
            </>}
                operation={[
                    <Fragment key="edit">{!isEdit && <Button key="edit" type="primary" style={{ marginRight: 16 }} onClick={() => setIsEdit(true)}>编辑</Button>}</Fragment>,
                    <Button key="cancel" loading={cancelPlanLoading} type="primary" style={{ marginRight: 16 }} onClick={handleCancelPlan}>取消计划</Button>,
                    <Fragment key="save">{isEdit && <Button key="save" loading={saveLoading} type="primary" style={{ marginRight: 16 }} onClick={handleSave}>保存</Button>}</Fragment>,
                    <Button key="goback" type="ghost" onClick={() => history.goBack()}>返回</Button>
                ]}>
                {!isEdit && <CommonTable
                    loading={loading}
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
                    style={{ padding: "0" }}
                    columns={[
                        ...PurchaseList.map((item: any) => {
                            if (["planPurchaseNum"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => <InputNumber
                                        min={1} value={value}
                                        onChange={(value: number) => handleNumChange(value, records.id)} key={key} />
                                })
                            }
                            if (item.dataIndex === "length") {
                                return ({
                                    ...item,
                                    render: (value: number, records: any, key: number) => records.source === 1 ? value || "0" : <InputNumber
                                        min={1}
                                        value={value}
                                        onChange={(value: number) => lengthChange(value, records.id)} key={key} />
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
                            if (item.dataIndex === "materialStandardName") {
                                return ({
                                    ...item,
                                    render: (_value: any, records: any, key: number) => records.source === 1 ? records.materialStandardName : <Select
                                        style={{ width: '150px' }}
                                        labelInValue
                                        value={{ value: records.materialStandard, label: records.materialStandardName }}
                                        options={materialStandardOptions?.map((item: any) => ({ label: item.name, value: item.id })) || []}
                                        onChange={(e: any) => setPopDataList(popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    materialStandard: e.value,
                                                    materialStandardName: e.label
                                                }
                                            }
                                            return item
                                        }))} />
                                })
                            }
                            if (item.dataIndex === "structureTexture") {
                                return ({
                                    ...item,
                                    render: (_value: any, records: any, key: number) => records.source === 1 ? records.structureTexture : <Select
                                        style={{ width: '150px' }}
                                        labelInValue
                                        value={{ value: records.structureTextureId, label: records.structureTexture }}
                                        options={materialTextureOptions?.map((item: any) => ({ value: item.id, label: item.name })) || []}
                                        onChange={(e: any) => setPopDataList(popDataList.map((item: any, index: number) => {
                                            if (index === key) {
                                                return {
                                                    ...item,
                                                    structureTextureId: e.value,
                                                    structureTexture: e.label
                                                }
                                            }
                                            return item
                                        }))} />
                                })
                            }
                            return item
                        }),
                        {
                            title: "操作",
                            fixed: "right",
                            dataIndex: "opration",
                            render: (_: any, records: any) => <Button type="link" disabled={records.source === 1} onClick={() => handleRemove(records.id)}>移除</Button>
                        }]}
                    pagination={false}
                    dataSource={popDataList} />}
                <SearchTable
                    modal={true}
                    path={`/tower-supply/materialPurchasePlan/list/summary/${params.id}`}
                    columns={PurchaseTypeStatistics as any[]}
                    pagination={false}
                    transformResult={(result: any) => result.purchasePlanListTotalVOS || []}
                    extraOperation={(result: any) => (<div style={{ marginBottom: 12 }}>
                        采购类型统计： 圆钢总重（t）：<span style={{ color: "#FF8C00" }}>{result?.roundSteelTotal === -1 ? "0" : result?.roundSteelTotal}</span>
                        <span style={{ margin: "0px 12px" }}>角钢总重（t）：<span style={{ color: "#FF8C00" }}>{result?.angleSteelTotal === -1 ? "0" : result?.angleSteelTotal}</span></span>
                        钢板总重（t）：<span style={{ color: "#FF8C00" }}>{result?.steelPlateTotal === -1 ? "0" : result?.steelPlateTotal}</span>
                    </div>)}
                    searchFormItems={[]} />
            </DetailContent>
            <Modal width={1100} title={`选择原材料明细`} destroyOnClose
                visible={visible}
                onOk={handleAddModalOk}
                onCancel={() => setVisible(false)}
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
                        setMaterialList(fields.map((item: any, index: number) => ({
                            ...item,
                            id: `${item.materialCode}-${index}-${new Date().getTime()}`,
                            // materialId: item.id,
                            // materialCode: item.materialCode,
                            // materialCategoryId: item.materialCategoryId,
                            planPurchaseNum: item.planPurchaseNum || "1",
                            // structureSpec: item.structureSpec,
                            // source: 2,
                            // structureTexture: item.structureTexture,
                            // materialStandardName: item.materialStandardName,
                            length: item.length || 1,
                            width: 0,
                            // materialStandard: item.materialStandard,
                            taxPrice: item.taxPrice || 1.00,
                            price: item.price || 1.00,
                            taxTotalAmount: item.taxTotalAmount || 1.00,
                            totalAmount: item.totalAmount || 1.00,
                            weight: item.weight || ((parseFloat(item?.proportion || 1) * parseFloat(item.length || 1)) / 1000 / 1000).toFixed(3)
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
                current={pagenation.current || 1}
                size={dataTable?.records.length || 10}
                total={dataTable?.records.length || 0}
                url={`/tower-supply/materialPurchasePlan/list/${params.id}`}
                serchObj={{}}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </>
    )
}