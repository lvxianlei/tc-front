import React, { useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, message, Modal, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { taskNoticeEditBaseInfo, taskNoticeEditSpec, salesAssist, productAssist } from "../managementDetailData.json"
import { materialStandardOptions } from "../../../configuration/DictionaryOptions"
export default function SalesPlanEdit() {
    const history = useHistory()
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const editMatch: any = useRouteMatch<{ type: "new" | "edit", projectId: string, id: string }>("/project/management/:type/salesPlan/:projectId/:id")
    const newMatch: any = useRouteMatch<{ type: "new" | "edit", projectId: string }>("/project/management/:type/salesPlan/:projectId")
    const match = editMatch || newMatch
    const [select, setSelect] = useState<string[]>([])
    const [selectRows, setSelectRows] = useState<any[]>([])
    const [productDetails, setProductDetails] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [saleOrderId, setSaleOrderId] = useState<string>("")
    const [contractId, setContractId] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/${match.params.id}`)
            baseInfoForm.setFieldsValue(result)
            cargoDtoForm.setFieldsValue(result)
            setSaleOrderId(result.saleOrderId)
            setContractId(result.contractId)
            setProductDetails(result.productInfos || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: match.params.type === "new" })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/taskNotice`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveAndApproveLoading, run: saveAndApproveRun } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/taskNotice/saveAndApprove`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: modalLoading, data: modalData, run: modalRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductBySaleOrderId?saleOrderId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async (type: "save" | "saveAndApprove") => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const cargoDtoData = await cargoDtoForm.validateFields()
            if (productDetails.length <= 0) {
                message.error("请添加产品信息...")
                return
            }
            const submitData = {
                ...data, ...baseInfoData, ...cargoDtoData,
                projectId: match.params.projectId,
                contractId,
                saleOrderId,
                saleOrder: baseInfoData.saleOrderNumber.saleOrderId || "",
                productIds: productDetails.map(item => item.id),
                saleOrderNumber: baseInfoData.saleOrderNumber.value || baseInfoData.saleOrderNumber
            }
            if (type === "save") {
                await run(submitData)
                message.success("保存成功...")
                history.goBack()
                return
            }
            if (type === "saveAndApprove") {
                await saveAndApproveRun(submitData)
                message.success("保存并提交审核成功...")
                history.goBack()
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (changedFields: any, allFields: any) => {
        if (Object.keys(changedFields)[0] === "saleOrderNumber") {
            const {
                internalNumber,
                orderProjectName,
                customerCompany,
                signCustomerName,
                orderDeliveryTime
            } = changedFields.saleOrderNumber.records[0]
            baseInfoForm.setFieldsValue({
                internalNumber,
                orderProjectName,
                customerCompany,
                signCustomerName,
                orderDeliveryTime
            })
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
        setProductDetails([...selectRows, ...productDetails.filter((pro: any) => !selectRows.map((item: any) => item.id).includes(pro.id))])
        setVisible(false)
    }

    const deleteProject = (id: string) => {
        setProductDetails(productDetails.filter((pro: any) => pro.id !== id))
    }

    return <DetailContent operation={[
        <Button
            key="save" type="primary"
            style={{ marginRight: "12px" }}
            onClick={() => handleSubmit("save")} loading={saveStatus || saveAndApproveLoading} >保存</Button>,
        <Button key="saveOr" type="primary"
            style={{ marginRight: "12px" }}
            loading={saveStatus || saveAndApproveLoading}
            onClick={() => handleSubmit("saveAndApprove")}>保存并提交审核</Button>,
        <Button key="cacel" onClick={() => history.goBack()} >取消</Button>
    ]}>
        <Modal
            title="选择明细"
            visible={visible}
            width={1011}
            onCancel={() => setVisible(false)}
            onOk={handleModalOk}
            destroyOnClose>
            <Spin spinning={modalLoading}>
                <CommonTable columns={productAssist} dataSource={(modalData as any[]) || []}
                    rowSelection={{
                        selectedRowKeys: select,
                        type: "checkbox",
                        onChange: onRowsChange,
                    }} />
            </Spin>
        </Modal>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange}
                columns={taskNoticeEditBaseInfo.map((item: any) => item.dataIndex === "saleOrderNumber" ? ({
                    ...item,
                    path: `${item.path}?projectId=${match.params.projectId}&taskStatus=0,1`
                }) : item)} dataSource={data || {}} edit col={3} />
            <DetailTitle title="特殊要求" />
            <BaseInfo form={cargoDtoForm}
                columns={taskNoticeEditSpec.map(item => item.dataIndex === "materialStandard" ? ({ ...item, enum: materialStandardEnum }) : item)}
                dataSource={data || {}} edit col={3} />
            <DetailTitle title="产品信息" operation={[<Button key="select" type="primary" disabled={!saleOrderId} onClick={handleSelectClick}>选择杆塔明细</Button>]} />
            <CommonTable columns={[...salesAssist, {
                title: "操作",
                dataIndex: "opration",
                width: 30,
                fixed: true,
                render: (_: any, records: any) => <>
                    <Button type="link" onClick={() => deleteProject(records.id)}>删除</Button>
                </>
            }]} scroll={{ x: true }} dataSource={productDetails} />
        </Spin>
    </DetailContent>
}