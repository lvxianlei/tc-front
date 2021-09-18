import React, { useState } from "react"
import { useHistory, useParams, useRouteMatch } from "react-router-dom"
import { Button, Form, Modal } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { productGroupColumns, newProductGroup } from '../managementDetailData.json'
import { TabTypes } from "../ManagementDetail"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
export default function ProductGroupEdit() {
    const history = useHistory()
    const match: any = useRouteMatch<{ type: "new" | "edit", id: string }>("/project/management/detail/:type/productGroup/:id")
    const [visible, setVisible] = useState<boolean>(false)
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/frameAgreement/${match.params.id}`)
        baseInfoForm.setFieldsValue(result)
        cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
        resole(result)
    }), { manual: match.params.type === "new" })

    const { loading: saveStatus, error: saveError, data: saveResult, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/frameAgreement`, postData)
        resole(result)
    }), { manual: true })

    const handleSubmit = async () => {
        const baseInfoData = await baseInfoForm.getFieldsValue()
        const contractCargoDtosData = await cargoDtoForm.getFieldsValue()
        delete data?.contractCargoVos
        // await run({ ...data, ...baseInfoData, projectId: match.params.id, contractCargoDtos: contractCargoDtosData.submit })
    }

    const handleBaseInfoChange = (changedFields: any, allFields: any) => {
        if (Object.keys(changedFields)[0] === "orderNumber") {
            baseInfoForm.setFieldsValue({ ...allFields, ...changedFields.orderNumber.records[0] })
        }
    }

    return <DetailContent
        title={[<Button key="pro" type="primary" onClick={() => setVisible(true)}>导入确认明细</Button>]}
        operation={[
            <Button key="save" type="primary" style={{ marginRight: "12px" }} onClick={handleSubmit}>保存</Button>,
            <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
        ]}>
        <Modal title="选择确认明细" visible={visible} onCancel={() => setVisible(false)} width={1011}>
            <CommonTable columns={newProductGroup.map(item => ({ ...item, width: 150 }))} dataSource={[]} />
            <DetailTitle title="明细" />
            <CommonTable columns={newProductGroup.map(item => ({ ...item, width: 150 }))} dataSource={[]} />
        </Modal>
        <DetailTitle title="基本信息" />
        <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={newProductGroup} dataSource={data || {}} edit />
        <DetailTitle title="明细" />
        <CommonTable columns={productGroupColumns} />
    </DetailContent>
}