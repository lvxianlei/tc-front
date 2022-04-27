import React, { useImperativeHandle, forwardRef, useEffect } from "react"
import { Form, InputNumber, Row, Col } from 'antd'
import { BaseInfo } from '../../common'
import { angleConfigStrategy } from "./angleSteel.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { materialTextureOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    data?: { [key: string]: any }
    ref?: React.RefObject<{ onSubmit: () => Promise<any>, loading: boolean }>
}

export default forwardRef(function Edit({ type, data = {} }: EditProps, ref) {
    const materialTextureEnum = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [baseForm] = Form.useForm()

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            console.log("=-=====111111")
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
            console.log("=============>>>")
            const baseData = await baseForm.validateFields();
            console.log(baseData, "数据", type)
            await saveRun(type === "new" ? ({
                ...baseData,
                // materialTextureIds: baseData.materialTextureIds.join(","),
                thickness: `${baseData.thicknessMin}~${baseData.thicknessMax}`,
                width: `${baseData.widthMin}~${baseData.widthMax}`
            }) : ({
                ...baseData,
                // materialTextureIds: baseData.materialTextureIds.join(","),
                thickness: `${baseData.thicknessMin}~${baseData.thicknessMax}`,
                width: `${baseData.widthMin}~${baseData.widthMax}`,
                id: data?.id
            }))
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useEffect(() => {
        if (type === "new") {
            baseForm.resetFields()
        } else {
            const thickness = data.thickness.split("~")
            const width = data.width.split("~")
            baseForm.setFieldsValue({ data, widthMin: width[0], widthMax: width[1], thicknessMin: thickness[0], thicknessMax: thickness[1] })
        }

    }, [JSON.stringify(data), type])

    useImperativeHandle(ref, () => ({ onSubmit, loading: saveLoading }), [ref, onSubmit])

    return <BaseInfo
        form={baseForm}
        columns={angleConfigStrategy.map((item: any) => {
            switch (item.dataIndex) {
                // case "materialTextureIds":
                //     return ({
                //         ...item,
                //         type: "select",
                //         enum: materialTextureEnum
                //     })
                case "thickness":
                    return ({
                        ...item,
                        render: () => <Row>
                            <Col span={11}><Form.Item name="thicknessMin" rules={[{ required: true, message: "请输入最小值..." }]}><InputNumber /></Form.Item></Col>
                            <Col span={2} style={{ lineHeight: "32px" }}>~</Col>
                            <Col span={11}><Form.Item name="thicknessMax" rules={[{ required: true, message: "请输入最大值..." }]}><InputNumber /></Form.Item></Col>
                        </Row>
                    })
                case "width":
                    return ({
                        ...item,
                        render: () => <Row>
                            <Col span={11}><Form.Item name="widthMin" rules={[{ required: true, message: "请输入最小值..." }]}><InputNumber /></Form.Item></Col>
                            <Col span={2} style={{ lineHeight: "32px" }}>~</Col>
                            <Col span={11}><Form.Item name="widthMax" rules={[{ required: true, message: "请输入最大值..." }]}><InputNumber /></Form.Item></Col>
                        </Row>
                    })
                default:
                    return item
            }
        })}
        col={3} dataSource={data} edit />
})