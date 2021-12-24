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
    length: number | string
    quantity: number
    onlyId: string
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
            setMaterialPickingInfoDTOS(result?.materialPickingInfoVOS)
            resole({
                ...result,
                workPlanNumber: { value: result.workPlanNumber, id: result.workPlanNumberId },
                pickingUserName: { value: result.pickingUserName, id: result.pickingUserId },
                pickingWareHouse: { value: result.pickingWareHouse, id: result.pickingWareHouseId }
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
                workPlanNumber: baseData.workPlanNumber?.value,
                workPlanNumberId: baseData.workPlanNumber?.id,
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
                productCategoryName: workPlanNumberData.productCategoryName,
            })
            setChooseMaterialParmas({
                planNumber: workPlanNumberData.planNumber,
                product: workPlanNumberData.productNumbers,
                productCategoryName: workPlanNumberData.productCategoryName
            })
        }
        if (fields.pickingTeam && fields.pickingTeam.records[0]) {
            baseForm.setFieldsValue({ pickingUnit: fields.pickingTeam.records[0]?.productUnitName })
            setSettingColumns(settingColumns.map((item: any) => {
                if (item.dataIndex === "pickingUserName") {
                    return ({
                        ...item,
                        disabled: false,
                        path: `${item.path}?id=${fields.pickingTeam.id}`
                    })
                }
                return item
            }))
        }
    }

    const materialsUseMaterialPickingInfoDTOS = () => {
        let materialPickingInfos: MaterialData[] = materialPickingInfoDTOS
        materials.forEach((mItem: any) => {
            if (materialPickingInfoDTOS.map(item => item.onlyId).includes(mItem.onlyId)) {
                materialPickingInfos = materialPickingInfoDTOS.map(pitem => {
                    if (pitem.onlyId === mItem.onlyId) {
                        return ({
                            ...pitem,
                            ids: [...pitem.ids, mItem.id],
                            quantity: pitem.quantity + 1
                        })
                    }
                    return pitem
                })
            } else {
                materialPickingInfos.push({
                    onlyId: `${mItem.materialName}${mItem.structureTexture}${mItem.structureSpec}${mItem.length}`,
                    materialName: mItem.materialName,
                    materialTexture: mItem.materialTexture,
                    spec: mItem.spec,
                    length: mItem.length,
                    quantity: 1,
                    ids: [mItem.id]
                })
            }
        })
        console.log(materialPickingInfos)
        setMaterialPickingInfoDTOS(materialPickingInfos)
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
                onChange={(records: any) => setMaterials((records.map((item: any) => ({
                    ...item,
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
                onClick={() => setVisible(true)}>选择原材料</Button>
        ]} />
        <CommonTable
            rowKey="onlyId"
            columns={[
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: undefined, records: any) => <>
                        <Button type="link" size="small">删除</Button>
                    </>
                },
                ...materialInfo]}
            dataSource={materialPickingInfoDTOS} />
    </Spin >
})