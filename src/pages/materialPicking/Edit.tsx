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
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/materialPicking/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/materialPicking`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = (saveType?: "save" | "saveAndApply") => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            const postData = type === "new" ? {
                ...baseData,
            } : {
                ...baseData
            }
            await saveRun(postData, saveType)
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.workPlanNumber) {
            const workPlanNumberData = fields.workPlanNumber.records[0]
            baseForm.setFieldsValue({
                projectName: workPlanNumberData.projectName,
                salePlanNumber: workPlanNumberData.salePlanNumber,
                productCategoryName: workPlanNumberData.productCategoryName,
            })
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
            <PopTableContent data={chooseMaterial as any} />
        </Modal>
        <DetailTitle title="基础信息" />
        <BaseInfo
            onChange={handleBaseInfoChange}
            form={baseForm}
            columns={setting}
            col={3}
            dataSource={data || {}} edit />
        <DetailTitle title="原材料信息" operation={[
            <Button type="primary" ghost onClick={() => {
                setVisible(true)
            }}>选择原材料</Button>
        ]} />
        <CommonTable columns={materialInfo} dataSource={[]} />
    </Spin>
})