import React, { useState } from "react"
import { useHistory, useParams, useRouteMatch } from "react-router-dom"
import { Button, Form, Modal } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { taskNoticeEditBaseInfo, taskNoticeEditSpec, salesAssist, productAssist } from "../managementDetailData.json"
import ApplicationContext from "../../../configuration/ApplicationContext"
export default function SalesPlanEdit() {
    const history = useHistory()
    const materialStandardEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const match: any = useRouteMatch<{ type: "new" | "edit", id: string }>("/project/management/detail/:type/salesPlan/:id")
    const [select, setSelect] = useState<string[]>([])
    const [selectRows, setSelectRows] = useState<any[]>([])
    const [productDetails, setProductDetails] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [saleOrderId, setSaleOrderId] = useState<string>("")
    const [contractId, setContractId] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/${match.params.id}`)
        baseInfoForm.setFieldsValue(result)
        cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
        setProductDetails(result.productDetails || [])
        resole(result)
    }), { manual: match.params.type === "new" })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/taskNotice`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: modalLoading, data: modalData, run: modalRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductBySaleOrderId?saleOrderId=${id}`)
        resole(result)
    }), { manual: true })

    const handleSubmit = async () => {
        await baseInfoForm.validateFields()
        await cargoDtoForm.validateFields()
        const baseInfoData = baseInfoForm.getFieldsValue()
        const cargoDtoData = cargoDtoForm.getFieldsValue()
        baseInfoData.saleOrderId = saleOrderId
        const result = await run({ ...data, ...baseInfoData, ...cargoDtoData, projectId: match.params.id, contractId, productIds: selectRows.map(item => item.id) })
        history.goBack()
    }

    const handleBaseInfoChange = (changedFields: any, allFields: any) => {
        if (Object.keys(changedFields)[0] === "saleOrderNumber") {
            console.log(changedFields)
            baseInfoForm.setFieldsValue({ ...allFields, ...changedFields.saleOrderNumber.records[0] })
            setSaleOrderId(changedFields.saleOrderNumber.records[0].id)
            setContractId(changedFields.saleOrderNumber.records[0].contractId)
        }
    }

    const onRowsChange = (selectedRowKeys: string[], rows: any[]) => {
        setSelect(selectedRowKeys)
        setSelectRows(rows)
    }

    const handleSelectClick = () => {
        setVisible(true)
        modalRun(saleOrderId)
    }

    const handleModalOk = () => {
        setVisible(false)
        console.log(selectRows, productDetails)
        setProductDetails([...selectRows, ...productDetails])
    }

    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: "12px" }} onClick={handleSubmit} loading={saveStatus} >保存</Button>,
        <Button key="saveOr" type="primary" style={{ marginRight: "12px" }} loading={saveStatus}>保存并提交审核</Button>,
        <Button key="cacel" onClick={() => history.goBack()} >取消</Button>
    ]}>
        <Modal
            title="选择明细"
            visible={visible}
            width={1011}
            onCancel={() => setVisible(false)}
            onOk={handleModalOk}
            destroyOnClose>
            <CommonTable columns={productAssist} dataSource={(modalData as any[]) || []}
                rowSelection={{
                    selectedRowKeys: select,
                    type: "checkbox",
                    onChange: onRowsChange,
                }} />
        </Modal>
        <DetailTitle title="基本信息" />
        <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={taskNoticeEditBaseInfo} dataSource={data || {}} edit col={3} />
        <DetailTitle title="特殊要求" />
        <BaseInfo form={cargoDtoForm} columns={taskNoticeEditSpec.map(item => item.dataIndex === "materialStandard" ? ({ ...item, enum: materialStandardEnum }) : item)} dataSource={{}} edit col={3} />
        <DetailTitle title="产品信息" operation={[<Button key="select" type="primary" disabled={!saleOrderId} onClick={handleSelectClick}>选择杆塔明细</Button>]} />
        <CommonTable columns={salesAssist} scroll={{ x: true }} dataSource={productDetails} />
    </DetailContent>
}