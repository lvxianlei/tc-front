import React, { useState, useRef } from "react"
import { Row, Button, Form, message } from "antd"
import { useParams, useHistory } from "react-router-dom"
import { DetailContent, DetailTitle, BaseInfo } from "../../common"
import { EditableProTable, } from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table';
import { baseInfo } from "./headData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function CostEdit() {
    const ref = useRef<ActionType>()
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const [productName, setProductName] = useState(id || "")
    const [editableKeys, setEditableRowKeys] = useState<any[]>([])
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
            baseForm.setFieldsValue({ ...productType, productName })
            resole({ productType, proport: { ...proport, data: (proport as any)?.data?.map((item: any, index: number) => ({ ...item, id: index })) } })
        } catch (error) {
            reject(error)
        }
    }), { manual: id === "new" })

    const { loading: productTypeLoading, run: productTypeRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/ProductType`, { ...saveData })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: productRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/ProductType`, { ...saveData })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: productEditRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/ProductType/updateProductTypeProportion`, { ...saveData })
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

    const saveProductType = async () => {
        try {
            const saveData = await baseForm.validateFields()
            await productTypeRun(saveData)
            message.success("公共费用保存成功...")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSave = async (key: any, record: any) => new Promise(async (resove, reject) => {
        try {
            const data = await tableRowForm.validateFields()
            if (record.isNew) {
                const saveData = await productRun({
                    params: Object.keys(data[key] || data).map((item: string) => `${item}-${data[key] ? data[key][item] : data[item]}`).join(","),
                    productName,
                    voltage: data[key] ? data[key].vd : data.vd || ""
                })
                message.success("保存成功...")
                resove(true)
            } else {
                const saveData = await productEditRun({
                    params: Object.keys(data).map((item: string) => `${item}-${data[item]}`).join(","),
                    productName,
                    voltage: data.vd || ""
                })
                message.success("保存成功...")
                resove(true)
            }

        } catch (error: any) {
            if (error.errorFields) {
                reject("请检查是否有必填项未填写...")
            }
            reject("保存失败")
            console.log(error)
            message.error("保存失败")
        }
    })

    return <DetailContent operation={[
        <Button key="goback" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <DetailTitle title="公共费用" operation={[
            <Button
                key="save" type="primary"
                style={{ marginRight: 16 }}
                loading={productTypeLoading}
                onClick={saveProductType}
            >保存公共费用</Button>,
            <Button key="cancle" onClick={() => history.go(-1)} >取消</Button>
        ]} />
        <BaseInfo onChange={onSelectChange} form={baseForm} columns={baseInfo} dataSource={[]} edit />
        {data?.proport && <>
            <Row><Button type="primary" onClick={() => ref.current?.addEditRecord?.({ id: dataSource.length, isNew: true })}>新增一行</Button></Row>
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
                columns={[...data?.proport.head.map((item: any) => ({
                    ...item,
                    valueType: item.type,
                    formItemProps: {
                        rules: item.rules
                    },
                    valueEnum: item.enum
                })), {
                    title: '操作',
                    valueType: 'option',
                    fixed: "left",
                    width: 100,
                    render: (text, record, _, action: any) => [
                        <a key="editable" type="link" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
                        <a key="delete" type="link" onClick={() => {
                            console.log(dataSource)
                            setDataSource(dataSource.filter((item: any) => item.id !== record.id))
                        }}>删除</a>
                    ]
                }]}
                value={dataSource}
                onChange={setDataSource}
            />
        </>}
    </DetailContent>
}