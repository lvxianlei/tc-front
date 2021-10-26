import React, { useState, useEffect } from "react"
import { Button, Form, message, Spin } from "antd"
import { useParams, useHistory } from "react-router-dom"
import { DetailContent, DetailTitle, BaseInfo, formatData, EditTable } from "../../common"
import { baseInfo } from "./headData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function CostEdit() {
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
            const { productType, proport } = await run(fields.productName)
            delete productType.productName
            baseForm.setFieldsValue({ ...formatData(baseInfo, productType) })
            tableRowForm.setFieldsValue({ submit: (proport as any)?.data?.map((item: any, index: number) => ({ ...item, id: index })) })
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
            history.go(-1)
        } catch (error) {
            console.log(error)
        }
    }
    const initData: any = {}
    useEffect(() => {
        data?.proport.head.forEach((item: any) => {
            const value = dataSource[item.dataIndex]
            initData[item.dataIndex] = (!value || value === -1) ? 0 : value
        })
    }, [data])
    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: 16 }} onClick={handleSaveAllData}>保存</Button>,
        <Button key="goback" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <BaseInfo onChange={onSelectChange} form={baseForm} columns={baseInfo.map((item: any) => item.dataIndex === "productName" ? ({
                ...item,
                disabled: id !== "new"
            }) : item)} dataSource={data || {}} edit />
            <DetailTitle title="材质比例" />
            {data?.proport && <EditTable addRowData={initData} form={tableRowForm} columns={data?.proport.head || []} dataSource={dataSource} />}
        </Spin>
    </DetailContent>
}