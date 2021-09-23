import React, { useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../../common"
import SelectProductGroup from "./SelectProductGroup"
import { newProductGroup, productAssist } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
export default function ProductGroupEdit() {
    const history = useHistory()
    const match: any = useRouteMatch<{ type: "new" | "edit", id: string }>("/project/management/detail/:type/productGroup/:id")
    const [visible, setVisible] = useState<boolean>(false)
    const [select, setSelect] = useState<any[]>([])
    const [contractId, setContractId] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productGroup/${match.params.id}`)
        baseInfoForm.setFieldsValue(result)
        cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
        setSelect(result.productDetails)
        resole(result)
    }), { manual: match.params.type === "new" })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[match.params.type === "new" ? "post" : "put"](`/tower-market/productGroup`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        const baseInfoData = await baseInfoForm.getFieldsValue()
        const saleOrderData = baseInfoData.saleOrderNumber?.id || baseInfoData.saleOrderId
        baseInfoData.saleOrderId = saleOrderData
        const contractCargoDtosData = await cargoDtoForm.getFieldsValue()
        delete data?.contractCargoVos
        await run({ ...data, ...baseInfoData, projectId: match.params.id, contractId, contractCargoDtos: contractCargoDtosData.submit, productIds: select.map(item => item.id) })
        history.goBack()
    }

    const handleBaseInfoChange = (changedFields: any, allFields: any) => {
        if (Object.keys(changedFields)[0] === "saleOrderNumber") {
            baseInfoForm.setFieldsValue({ ...allFields, ...changedFields.saleOrderNumber.records[0] })
            setContractId(changedFields.saleOrderNumber.records[0].contractId)
        }
    }

    const handleModalOk = (selectRows: any[]) => {
        setSelect(selectRows)
        setVisible(false)
    }

    return <DetailContent
        title={[<Button key="pro" type="primary" onClick={() => setVisible(true)}>导入确认明细</Button>]}
        operation={[
            <Button key="save" type="primary" style={{ marginRight: "12px" }} onClick={handleSubmit} loading={saveStatus}>保存</Button>,
            <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
        ]}>
        <SelectProductGroup visible={visible} onCancel={() => setVisible(false)} onOk={handleModalOk} />
        <DetailTitle title="基本信息" />
        <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={newProductGroup} dataSource={data || {}} edit />
        <DetailTitle title="明细" />
        <CommonTable columns={productAssist} dataSource={select} />
    </DetailContent>
}