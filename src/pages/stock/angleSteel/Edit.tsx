import React, { useImperativeHandle, forwardRef } from "react"
import { Form } from 'antd'
import { DetailContent, DetailTitle, BaseInfo } from '../../common'
import { angleConfigStrategy } from "./angleSteel.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any>, loading: boolean }>
}

export default forwardRef(function Edit({ type }: EditProps, ref) {
    const materialTextureEnum = (ApplicationContext.get().dictionaryOption as any)["139"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [baseForm] = Form.useForm()
    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/angleConfigStrategy/saveIngredientsMaterialConfig`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({ ...baseData })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

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
            dataSource={{}}
            edit />
    </DetailContent>
})