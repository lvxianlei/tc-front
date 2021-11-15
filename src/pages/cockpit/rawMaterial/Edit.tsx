import React, { useState, forwardRef, useImperativeHandle } from "react"
import { InputNumber, Spin, Button, Modal, Form, message } from "antd"
import { materialInfo, priceInfo } from "./rawMaterial.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { BaseInfo, DetailTitle, PopTableContent } from "../../common"
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
            "dataIndex": "field_3",
            "search": true
        },
        {
            "title": "类型",
            "dataIndex": "materialCategory"
        },
        {
            "title": "物料编号",
            "dataIndex": "customerCompany",
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
            "dataIndex": "standard"
        },
        {
            "title": "材料",
            "dataIndex": "rowMaterial"
        },
        {
            "title": "材质",
            "dataIndex": "materialTexture"
        },
        {
            "title": "规格",
            "dataIndex": "spec"
        }
    ]
}

export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [popContent, setPopContent] = useState<{ id: string, records: any }>({ id: "", records: {} })
    const [materialForm] = Form.useForm()
    const [priceInfoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/${id}`)
            materialForm.setFieldsValue(result)
            priceInfoForm.setFieldsValue(result)
            setPopContent({ ...popContent, id: result?.materialId })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { loading: saveLoading, run: saveRun } = useRequest<any[]>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/materialPrice`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleCancel = () => setVisible(false)
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
            await saveRun({ ...materialData, ...priceInfoData })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, loading: saveLoading }), [onSubmit, saveLoading])

    return <Spin spinning={loading}>
        <Modal width={1011} title="选择合同" destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <PopTableContent data={materialList as any} onChange={handleChange} />
        </Modal>
        <DetailTitle title="原材料信息" operation={[
            <Button type="primary" ghost key="choose" onClick={() => setVisible(true)}>选择</Button>
        ]} />
        <BaseInfo form={materialForm} col={3} columns={materialInfo} dataSource={data || {}} edit />
        <DetailTitle title="价格信息" />
        <BaseInfo form={priceInfoForm} col={3} columns={priceInfo} dataSource={data || {}} edit />
    </Spin>
})