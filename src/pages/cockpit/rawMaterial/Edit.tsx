import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Spin, Button, Modal, Form, message, Input } from "antd"
import { materialInfo, priceInfo } from "./rawMaterial.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { BaseInfo, DetailTitle, PopTableContent } from "../../common"
import { PopTable } from './LayerModal';
interface EditProps {
    id: string
    type: "new" | "edit"
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

export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [popContent, setPopContent] = useState<{ id: string, records: any }>({ id: "", records: {} })
    const [materialForm] = Form.useForm()
    const [priceInfoForm] = Form.useForm()
    const { data: priceSourceEnum } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/list`)
            resove(result.map((item: any) => ({ label: item.supplierName, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/${id}`)
            materialForm.setFieldsValue(result)
            priceInfoForm.setFieldsValue(result)
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
            materialStandardName: popContent.records.standardName
        })
        setVisible(false)
    }
    const handleChange = (event: any) => {
        setPopContent({ id: event[0].id, records: event[0] })
    }

    const onSubmit = async () => new Promise(async (resove, reject) => {
        if (!popContent.id) {
            message.warning("请先选择原材料...")
            return
        }
        const materialData = await materialForm.validateFields()
        const priceInfoData = await priceInfoForm.validateFields()
        try {
            await saveRun({
                ...materialData,
                ...priceInfoData,
                materialId: popContent?.records.id || popContent?.records.materialId,
                materialCategoryId: popContent?.records.materialCategory || popContent?.records.materialCategoryId,
                materialStandard: popContent?.records.standard || popContent?.records.materialStandard
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, loading: saveLoading }), [onSubmit, saveLoading])

    const performanceBondChange = (fields: { [key: string]: any }, allFields: { [key: string]: any }) => {
        console.log(fields, 'fields')
    }

    return <Spin spinning={loading}>
        <Modal width={1011} title="选择" destroyOnClose visible={visible} onOk={handleOk} onCancel={() => setVisible(false)}>
            <PopTableContent data={materialList as any} onChange={handleChange} />
        </Modal>
        <DetailTitle title="原材料信息" operation={[
            <Button disabled={type === "edit"} type="primary" ghost key="choose" onClick={() => setVisible(true)}>选择</Button>
        ]} />
        <BaseInfo form={materialForm} onChange={performanceBondChange} col={2} columns={[
            ...materialInfo.map((item: any) => {
                if(item.dataIndex === "materialName") {
                    return (
                        {
                            ...item,
                            render() {
                                return <PopTable data={item} />
                            }
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