import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Button, Form, Modal, Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, PopTableContent } from '../common'
import { setting, materialInfo, chooseMaterial } from "./picking.json"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
export interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    id: string
}
interface ChooseMaterialParmas {
    planNumber: string
    productCategoryName: string
    product: string
}
interface MaterialData {
    materialName: string
    spec: string
    materialTexture: string
    materialStandard: string
    length: number | string
    weight: number | string
    applyQuantity: number
    materialShortageQuantity: number
    onlyId: string
    plannedSurplusLength: string
    ids: string[]
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [baseForm] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false)
    const [settingColumns, setSettingColumns] = useState<any[]>(setting)
    const [chooseMaterialParmas, setChooseMaterialParmas] = useState<ChooseMaterialParmas>({
        planNumber: "",
        productCategoryName: "",
        product: ""
    })
    const [materials, setMaterials] = useState<any[]>([])
    const [materialPickingInfoDTOS, setMaterialPickingInfoDTOS] = useState<MaterialData[]>([])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPicking/${id}`)
            setMaterialPickingInfoDTOS(result?.materialPickingInfoVOS.map((item: any) => ({
                ...item,
                ids: item.ids.split(","),
                onlyId: `${item.materialName}${item.materialTexture}${item.spec}${item.length}`
            })))
            setChooseMaterialParmas({
                planNumber: result?.salePlanNumber,
                product: result?.productNumbers,
                productCategoryName: result?.productCategoryName
            })
            resole({
                ...result,
                workPlanNumber: { value: result.workPlanNumber, id: result.workPlanNumberId },
                pickingUserName: { value: result.pickingUserName, id: result.pickingUserId },
                pickingWareHouse: { value: result.pickingWareHouse, id: result.pickingWareHouseId },
                pickingUnit: { value: result.pickingUnit, id: result.pickingUnitId },
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const postData = type === "new" ? data : { ...data, id }
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/materialPicking`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = (saveType?: 1 | 2) => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({
                ...baseData,
                pickingUnit: baseData.pickingUnit?.value,
                pickingUnitId: baseData.pickingUnit?.id,
                workPlanNumber: baseData.workPlanNumber?.value,
                workPlanNumberId: baseData.workPlanNumber?.id,
                productNumber: baseData.workPlanNumber?.records[0].productNumbers,
                internalNumber: baseData.workPlanNumber?.records[0].internalNumber,
                pickingUserName: baseData.pickingUserName?.value,
                pickingUserId: baseData.pickingUserName?.id,
                pickingWareHouse: baseData.pickingWareHouse?.value,
                pickingWareHouseId: baseData.pickingWareHouse?.id,
                pickingTeam: baseData.pickingTeam?.value,
                pickingTeamId: baseData.pickingTeam?.id,
                saveType,
                materialPickingInfoDTOS: materialPickingInfoDTOS.map(item => ({
                    ...item,
                    ids: item.ids.join(",")
                }))
            })
            resolve(true)
        } catch (error) {
            console.log(error)
        }
    })

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.workPlanNumber) {
            const workPlanNumberData = fields.workPlanNumber.records[0] || {}
            baseForm.setFieldsValue({
                projectName: workPlanNumberData.orderProjectName,
                salePlanNumber: workPlanNumberData.planNumber,
                productCategoryName: workPlanNumberData.productCategoryName
            })
            setChooseMaterialParmas({
                planNumber: workPlanNumberData.planNumber,
                product: workPlanNumberData.productNumbers,
                productCategoryName: workPlanNumberData.productCategoryName
            })
        }
        if (fields.pickingTeam && fields.pickingTeam.records[0]) {
            baseForm.setFieldsValue({
                pickingUnit: {
                    value: fields.pickingTeam.records[0]?.productUnitName,
                    id: fields.pickingTeam.records[0]?.productUnitId
                }
            })
            setSettingColumns(settingColumns.map((item: any) => {
                if (item.dataIndex === "pickingUserName") {
                    return ({
                        ...item,
                        disabled: false,
                        path: `${item.path.split("?")[0]}?id=${fields.pickingTeam.id}`
                    })
                }
                baseForm.setFieldsValue({
                    pickingUserName: {
                        value: "",
                        records: [],
                        id: ""
                    }
                })
                return item
            }))
        }
    }

    const materialsUseMaterialPickingInfoDTOS = () => {
        let materialPickingInfos: MaterialData[] = []
        materials.forEach((mItem: any) => {
            if (materialPickingInfos.map(item => item.onlyId).includes(mItem.onlyId)) {
                materialPickingInfos = materialPickingInfos.map(pitem => {
                    if (pitem.onlyId === mItem.onlyId) {
                        return ({
                            ...pitem,
                            ids: [...pitem.ids, mItem.id],
                            applyQuantity: pitem.applyQuantity + 1
                        })
                    }
                    return pitem
                })
            } else {
                materialPickingInfos.push({
                    onlyId: mItem.onlyId,
                    materialName: mItem.materialName,
                    materialTexture: mItem.materialTexture,
                    materialStandard: mItem.materialStandard,
                    materialShortageQuantity: mItem.materialShortageQuantity,
                    plannedSurplusLength: mItem.plannedSurplusLength,
                    spec: mItem.spec,
                    length: mItem.length,
                    weight: mItem.weight,
                    applyQuantity: 1,
                    ids: [mItem.id]
                })
            }
        })
        setMaterialPickingInfoDTOS(materialPickingInfos)
    }

    const handleRemove = (onlyId: string) => {
        setMaterialPickingInfoDTOS(materialPickingInfoDTOS.filter((item: any) => item.onlyId !== onlyId))
    }

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])

    return <Spin spinning={loading}>
        <Modal
            title="选择原材料"
            width={1011}
            destroyOnClose
            onCancel={() => setVisible(false)}
            visible={visible}
            onOk={() => {
                materialsUseMaterialPickingInfoDTOS()
                setVisible(false)
            }}>
            <PopTableContent
                data={{
                    ...chooseMaterial as any,
                    path: `${chooseMaterial.path}?planNumber=${chooseMaterialParmas.planNumber}&product=${chooseMaterialParmas.product}&productCategoryName=${chooseMaterialParmas.productCategoryName}`
                }}
                value={{
                    value: "", id: "",
                    records: materialPickingInfoDTOS.reduce((total: any[], item: any) => total.concat(item.ids.map((id: any) => ({ id }))), [])
                }}
                onChange={(records: any) => setMaterials((records.map((item: any) => ({
                    ...item,
                    spec: item.structureSpec,
                    materialTexture: item.structureTexture,
                    onlyId: `${item.materialName}${item.structureTexture}${item.structureSpec}${item.length}`
                }))))}
            />
        </Modal>
        <DetailTitle title="基础信息" />
        <BaseInfo
            onChange={handleBaseInfoChange}
            form={baseForm}
            columns={settingColumns}
            col={3}
            dataSource={data || {}} edit />
        <DetailTitle title="原材料信息" operation={[
            <Button
                type="primary"
                key="add"
                ghost
                disabled={!chooseMaterialParmas.planNumber}
                onClick={() => setVisible(true)}>选择原材料</Button>
        ]} />
        <CommonTable
            rowKey="onlyId"
            columns={[
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: undefined, records: any) => <>
                        <Button type="link" size="small" onClick={() => handleRemove(records.onlyId)}>删除</Button>
                    </>
                },
                ...materialInfo]}
            dataSource={materialPickingInfoDTOS} />
    </Spin >
})