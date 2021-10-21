import React, { useState, useRef } from "react"
import { Row, Button, Form, message, Spin, Modal } from "antd"
import { useParams, useHistory } from "react-router-dom"
import { DetailContent, DetailTitle, BaseInfo, formatData, EditTable } from "../../common"
import type { ActionType } from '@ant-design/pro-table';
import { baseInfo } from "./headData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function CostEdit() {
    const ref = useRef<ActionType>()
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const [productName, setProductName] = useState(id || "")
    const [dataSource, setDataSource] = useState<any[]>([])
    const [baseForm] = Form.useForm()
    const [tableRowForm] = Form.useForm()

    const { loading, data, run } = useRequest<{ [key: string]: any }>((productName = id) => new Promise(async (resole, reject) => {
        try {
            const [productType, proport]: Promise<any>[] = await Promise.all([
                RequestUtil.get(`/tower-market/ProductType/getProductTypeInfo?productName=${productName}`),
                RequestUtil.get(`/tower-market/ProductType/getProductParamProportion?productName=${productName}`)
            ])
            setDataSource((proport as any)?.data?.map((item: any, index: number) => ({ ...item, id: index })))
            baseForm.setFieldsValue({ ...formatData(baseInfo, productType), productName })
            resole({ productType, proport: { ...proport, data: (proport as any)?.data?.map((item: any, index: number) => ({ ...item, id: index })) } })
        } catch (error) {
            reject(error)
        }
    }), { manual: id === "new" })

    const { loading: productTypeLoading, run: productTypeRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/ProductType/saveProductTypeAll`, { ...saveData })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSelectChange = async (fields: any) => {
        if (fields.productName) {
            setProductName(fields.productName)
            const { productType } = await run(fields.productName)
            delete productType.productName
            baseForm.setFieldsValue({ ...productType })
        }
    }

    const handleSaveAllData = async () => {
        try {
            const saveData = await baseForm.validateFields()
            const proportionDtos = await tableRowForm.validateFields()
            await productTypeRun({
                ...saveData, addOrUpdateProportionDtos: proportionDtos.submit.map((item: any) => ({
                    params: Object.keys(item).map((co: string) => `${co}-${item[co]}`).join(","),
                    productName,
                    voltage: item.vd
                }))
            })
            message.success("数据保存成功...")
        } catch (error) {
            console.log(error)
        }
    }

    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: 16 }} onClick={handleSaveAllData}>保存</Button>,
        <Button key="goback" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <BaseInfo onChange={onSelectChange} form={baseForm} columns={baseInfo} dataSource={data || {}} edit />
            <DetailTitle title="材质比例" />
            {data?.proport && <EditTable form={tableRowForm} columns={data?.proport.head || []} dataSource={dataSource} />}
        </Spin>
    </DetailContent>
}


{/* <Row><Button type="primary" onClick={handleNewRow}>新增一行</Button></Row>
<EditableProTable
    rowKey="id"
    actionRef={ref}
    headerTitle="材质比例"
    maxLength={5}
    recordCreatorProps={false}
    editable={{
        form: tableRowForm,
        editableKeys,
        onlyOneLineEditorAlertMessage: "不能同时编辑多行",
        onlyAddOneLineAlertMessage: "新增行保存前不能新增...",
        onSave: handleSave,
        onChange: setEditableRowKeys,
        actionRender: (_a, _b, dom) => [dom.save, dom.cancel]
    }}
    columns={}
    value={dataSource}
    onChange={setDataSource}
/>
</> */}