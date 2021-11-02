import React, { useImperativeHandle, forwardRef, useEffect } from "react"
import { Form } from 'antd'
import { DetailContent, DetailTitle, BaseInfo } from '../../common'
import { angleConfigStrategy } from "./angleSteel.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface EditProps {
    type: "new" | "edit",
    data?: { [key: string]: any }
    ref?: React.RefObject<{ onSubmit: () => Promise<any>, loading: boolean }>
}

export default forwardRef(function Edit({ type, data = {} }: EditProps, ref) {
    const materialTextureEnum = (ApplicationContext.get().dictionaryOption as any)["139"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [baseForm] = Form.useForm()

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const url: string = type === "new" ? `/tower-supply/angleConfigStrategy/saveIngredientsMaterialConfig`
                :
                `/tower-supply/angleConfigStrategy/updateIngredientsMaterialConfig`
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](url, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({ ...baseData, id: Number(data?.id || 0) })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useEffect(() => {
        type === "new" ? baseForm.resetFields() : baseForm.setFieldsValue(data)
    }, [JSON.stringify(data), type])

    useImperativeHandle(ref, () => ({ onSubmit, loading: saveLoading }), [ref, onSubmit])

    return <DetailContent>
        <DetailTitle title="票据信息" />
        <BaseInfo
            form={baseForm}
            columns={angleConfigStrategy.map((item: any) => {
                if (item.dataIndex === "materialTexture") {
                    return ({ ...item, type: "select", enum: materialTextureEnum })
                }
                return item
            })}
            col={3}
            dataSource={data}
            edit />
    </DetailContent>
})