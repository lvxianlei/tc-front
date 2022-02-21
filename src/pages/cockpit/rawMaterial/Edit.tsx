import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Spin, Button, Modal, Form, message, Input } from "antd"
import { materialInfo, priceInfo } from "./rawMaterial.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { BaseInfo, DetailTitle, PopTableContent } from "../../common"
import { PopTable } from './LayerModal';
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"

interface priceSourceEnumData {
    label: string
    value: string
}
interface EditProps {
    id: string
    type: "new" | "edit",
    priceSourceEnum: { [key: string]: any } | undefined
}

const materialList = {
    "title": "原材料",
    "dataIndex": "materialName",
    "type": "popTable",
    "path": "/tower-system/material",
    "width": 1011,
    "value": "materialName",
    "dependencies": true,
    "readOnly": true,
    "columns": [
        {
            "title": "类别",
            "dataIndex": "bigCategoryName",
            "search": true
        },
        {
            "title": "类型",
            "dataIndex": "materialCategoryName"
        },
        {
            "title": "物料编号",
            "dataIndex": "materialCode",
            "search": true
        },
        {
            "title": "品名",
            "dataIndex": "materialName"
        },
        {
            "title": "快捷码",
            "dataIndex": "shortcutCode"
        },
        {
            "title": "标准",
            "dataIndex": "standardName"
        },
        {
            "title": "材料",
            "dataIndex": "rowMaterial"
        },
        {
            "title": "材质",
            "dataIndex": "structureTexture"
        },
        {
            "title": "规格",
            "dataIndex": "structureSpec"
        }
    ]
}

export default forwardRef(function Edit({ id, type, priceSourceEnum }: EditProps, ref): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [popContent, setPopContent] = useState<{ id: string, records: any }>({ id: "", records: {} })
    const [materialForm] = Form.useForm()
    const [priceInfoForm] = Form.useForm();
    // 原材料标准
    const materialStandard = materialStandardOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    // 原材料材质
    const materialCategoryName = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/${id}`);
            // 根据价格来源去查询价格来源的id
            const priceSource = priceSourceEnum && priceSourceEnum?.filter((item: any) => item.label === result.priceSource);
            materialForm.setFieldsValue(result)
            priceInfoForm.setFieldsValue(
                {
                    ...result,
                    priceSource: priceSource ? priceSource[0].value : ""
                }
            )
            setPopContent({ id: result.id, records: result })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { loading: saveLoading, run: saveRun } = useRequest<any[]>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/materialPrice`, type === "new" ? data : ({ ...data, id }))
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleOk = () => {
        materialForm.setFieldsValue({
            materialName: popContent.records.materialName,
            materialSpec: popContent.records.structureSpec,
            materialCategoryName: popContent.records.materialCategoryName,
            materialStandard: popContent.records.standardName
        })
        setVisible(false)
    }
    const handleChange = (event: any) => {
        setPopContent({ id: event[0].id, records: event[0] })
    }

    const onSubmit = async () => new Promise(async (resove, reject) => {
        const materialData = await materialForm.validateFields()
        const priceInfoData = await priceInfoForm.validateFields()
        const materialStandardName = materialStandard?.filter((item: any) => item.value === materialData.materialStandard),
            structureTexture = materialCategoryName?.filter((item: any) => item.value === materialData.structureTextureId),
            priceSource = priceSourceEnum && priceSourceEnum?.filter((item: any) => item.value === priceInfoData.priceSource);
        try {
            await saveRun({
                // id:  popContent?.records.id || popContent?.records.id,
                materialCategoryId: popContent?.records.materialCategory || popContent?.records.materialCategory, // 列表没有
                materialCategoryName: materialData.materialCategoryName, // 原材料类型名称
                materialId: popContent?.records.id || popContent?.records.materialId, // 原材料id
                materialName: materialData.materialName.value, // 原材料名称
                materialStandard: materialData.materialStandard, // 原材料标准id
                materialStandardName: materialStandardName ? materialStandardName[0].label : "", // 原材料标准名称
                price: priceInfoData.price, // 原材料价格
                priceSource: (priceSource && priceSource.length > 0) ? priceSource[0].label : priceInfoData.priceSource, // 价格来源
                quotationTime: priceInfoData.quotationTime, // 报价时间
                materialSpec: materialData.materialSpec, // 原材料规格
                structureTexture: structureTexture ? structureTexture[0].label : "", // 原材料材质
                structureTextureId: materialData.structureTextureId, // 原材料材质id
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, loading: saveLoading }), [onSubmit, saveLoading])

    // 选择原材料名称后的回调处理
    const handleChangeName = (fields: { [key: string]: any }) => {
        if (fields.materialName) {
            materialForm.setFieldsValue({
                // purchasePlanCode: fields.records[0].materialName, // 原材料名称
                materialSpec: fields.materialName.records[0].structureSpec, // 原材料规格
                materialCategoryName: fields.materialName.records[0].materialCategoryName, // 原材料类型
            })
            setPopContent({ id: fields.id, records: fields.materialName.records[0] })
        }
    }
    const handleTest = async (fields: any) => {
        if (fields.materialName) {
            materialForm.setFieldsValue({
                purchasePlanCode: fields.records[0].materialName, // 原材料名称
                materialSpec: fields.records[0].structureSpec, // 原材料规格
                materialCategoryName: fields.records[0].materialCategoryName, // 原材料类型
            })
        }
    }

    return <Spin spinning={loading}>
        <BaseInfo form={materialForm} onChange={handleChangeName} col={2} columns={[
            ...materialInfo.map((item: any) => {
                if (item.dataIndex === "materialName") {
                    return (
                        {
                            ...item,
                            disabled: type !== "new" ? true : false,
                            render(data: any, props: any) {
                                return <PopTable data={data} {...props} />
                            }
                        }
                    )
                }
                if (item.dataIndex === "materialStandard") {
                    return (
                        {
                            ...item,
                            disabled: type !== "new" ? true : false,
                            enum: materialStandard
                        }
                    )
                }
                if (item.dataIndex === "structureTextureId") {
                    return (
                        {
                            ...item,
                            disabled: type !== "new" ? true : false,
                            enum: materialCategoryName
                        }
                    )
                }
                return item;
            })
        ]} dataSource={data || {}} edit />
        <DetailTitle title="价格信息" />
        <BaseInfo form={priceInfoForm} col={3} columns={priceInfo.map((item: any) => {
            if (item.dataIndex === "priceSource") {
                return ({ ...item, type: "select", enum: priceSourceEnum })
            }
            return item
        })} dataSource={data || {}} edit />
    </Spin>
})