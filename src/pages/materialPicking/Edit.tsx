import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Button, Form, Modal, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, CommonTable, PopTableContent } from '../common'
import { setting, materialInfo, chooseMaterial } from "./picking.json"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
export interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    id: string
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [visible, setVisible] = useState<boolean>(false)
    const [baseForm] = Form.useForm()
    const [planNumber, setPlanNumber] = useState<string>("")
    const [productCategoryName, setProductCategoryName] = useState<string>("")
    const [product, setProduct] = useState<string>("")
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPicking/${id}`)
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
                workPlanNumber: baseData.workPlanNumber.value,
                workPlanNumberId: baseData.workPlanNumber.id,
                pickingUserName: baseData.pickingUserName.value,
                pickingUserId: baseData.pickingUserName.id,
                pickingWareHouse: baseData.pickingWareHouse.value,
                pickingWareHouseId: baseData.pickingWareHouse.id,
                saveType,
                materialPickingInfoDTOS: []
            })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.workPlanNumber) {
            const workPlanNumberData = fields.workPlanNumber.records[0]
            baseForm.setFieldsValue({
                projectName: workPlanNumberData.orderProjectName,
                salePlanNumber: workPlanNumberData.planNumber,
                productCategoryName: workPlanNumberData.productCategoryName,
            })
            setPlanNumber(workPlanNumberData.planNumber)
        }
    }

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])

    return <Spin spinning={loading}>
        <Modal
            title=""
            width={1011}
            destroyOnClose
            onCancel={() => {
                setVisible(false)
            }}
            visible={visible}
            onOk={() => {

            }}>
            <PopTableContent data={{
                ...chooseMaterial as any,
                path: `${chooseMaterial.path}?planNumber=${planNumber}`
            }} />
        </Modal>
        <DetailTitle title="基础信息" />
        <BaseInfo
            onChange={handleBaseInfoChange}
            form={baseForm}
            columns={setting}
            col={3}
            dataSource={data || {}} edit />
        <DetailTitle title="原材料信息" operation={[
            <Button
                type="primary"
                key="add"
                ghost
                onClick={() => {
                    setVisible(true)
                }}>选择原材料</Button>
        ]} />
        <CommonTable columns={materialInfo} dataSource={data?.materialPickingInfoVOS || []} />
    </Spin>
})