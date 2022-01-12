import React, { useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, message, Modal, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable, FormItemType } from "../../common"
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
    const [settingVisible, setSettingVisible] = useState<boolean>(false)
    const [saleOrderId, setSaleOrderId] = useState<string>("")
    const [contractId, setContractId] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const [productDetailsForm] = Form.useForm()
    const [deliveryTimeForm] = Form.useForm()
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
            const paramsData = match.params.type === "new" ? { saleOrderId: id } : { saleOrderId: id, taskNoticeId: match.params.id }
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductBySaleOrderId`, paramsData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async (type: "save" | "saveAndApprove") => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const cargoDtoData = await cargoDtoForm.validateFields()
            const productDetailsData = await productDetailsForm.validateFields()
            const submitProductDetailsData = productDetails.map((item: any) => ({
                id: item.id,
                deliveryTime: productDetailsData[item.id].deliveryTime && (productDetailsData[item.id].deliveryTime + " 00:00:00")
            }))
            if (submitProductDetailsData.length <= 0) {
                message.warning("请选择杆塔明细...")
                return
            }
            const submitData = {
                ...data,
                ...baseInfoData,
                ...cargoDtoData,
                projectId: match.params.projectId,
                contractId,
                saleOrderId,
                saleOrder: baseInfoData.saleOrderNumber.saleOrderId || "",
                productInfoList: submitProductDetailsData,
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
        const productDetailsData = productDetailsForm.getFieldsValue()
        const newProductDetailsData: { [key: string]: any } = {}
        productDetailsForm.resetFields()
        const newProductDetails = [
            ...selectRows,
            ...productDetails.filter((pro: any) => !select.includes(pro.id))]
        newProductDetails.forEach(item => {
            item.deliveryTime && delete item.deliveryTime
            if (productDetailsData[item.id]) {
                newProductDetailsData[item.id] = { ...item, ...productDetailsData[item.id] }
            } else {
                newProductDetailsData[item.id] = item
            }
        })
        setProductDetails(newProductDetails)
        productDetailsForm.setFieldsValue(newProductDetailsData)
        setVisible(false)
        setSettingVisible(true)
    }

    const handleSettingModalOk = async () => {
        const newProductDetailsForm: { [key: string]: { deliveryTime: string } } = {}
        const deliveryTime = await deliveryTimeForm.validateFields()
        const productDetailsFormData = productDetailsForm.getFieldsValue()
        const newProductDetails = productDetails.map((item: any) => {
            if (productDetailsFormData[item.id].deliveryTime) {
                return item
            } else {
                newProductDetailsForm[item.id] = { ...deliveryTime }
                return ({ ...item, ...deliveryTime })
            }
        })
        setProductDetails(newProductDetails)
        productDetailsForm.setFieldsValue(newProductDetailsForm)
        setSettingVisible(false)
    }

    const deleteProject = (id: string) => {
        const productDetailsData = productDetailsForm.getFieldsValue()
        const productDetailsResult = productDetails.filter((pro: any) => pro.id !== id)
        Object.keys(productDetailsData).forEach((item: string) => {
            item === id && delete productDetailsData[item]
        })
        setProductDetails(productDetailsResult)
        productDetailsForm.setFieldsValue(productDetailsData)
        setSelect(productDetailsResult.map(item => item.id))
        setSelectRows(productDetailsResult)
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
        <Modal title="设置杆塔交货日期"
            visible={settingVisible}
            width={506}
            onCancel={() => setSettingVisible(false)}
            onOk={handleSettingModalOk}
            destroyOnClose>
            <Form form={deliveryTimeForm}>
                <Form.Item name="deliveryTime" label="交货日期" rules={[
                    {
                        "required": true,
                        "message": "请选择交货日期..."
                    }
                ]}>
                    <FormItemType type="date" data={{ format: "YYYY-MM-DD" }} />
                </Form.Item>
            </Form>
        </Modal>
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
                        getCheckboxProps: (records: any) => ({
                            disabled: productDetails.map(item => item.id).includes(records.id)
                        }),
                        onChange: onRowsChange,
                    }} />
            </Spin>
        </Modal>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={baseInfoForm}
                onChange={handleBaseInfoChange}
                columns={taskNoticeEditBaseInfo.map((item: any) => item.dataIndex === "saleOrderNumber" ? ({
                    ...item,
                    path: `${item.path}?projectId=${match.params.projectId}&taskStatus=0,1`
                }) : item)} dataSource={data || {}} edit col={3} />
            <DetailTitle title="特殊要求" />
            <BaseInfo form={cargoDtoForm}
                columns={taskNoticeEditSpec.map(item => item.dataIndex === "materialStandard" ? ({ ...item, enum: materialStandardEnum }) : item)}
                dataSource={data || {}} edit col={3} />
            <DetailTitle title="杆塔信息" operation={[<Button key="select" type="primary" disabled={!saleOrderId} onClick={handleSelectClick}>选择杆塔明细</Button>]} />
            <Form form={productDetailsForm}>
                <CommonTable
                    columns={[...salesAssist.map((item: any) => {
                        if (item.dataIndex === "deliveryTime") {
                            return ({
                                ...item,
                                render: (value: string, record: any) => <Form.Item
                                    name={[record.id, item.dataIndex]}
                                    initialValue={value}
                                    rules={item.rules}
                                >
                                    <FormItemType type={item.type} data={item} />
                                </Form.Item>
                            })
                        }
                        return item
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => deleteProject(records.id)}>删除</Button>
                        </>
                    }]}
                    dataSource={productDetails} />
            </Form>
        </Spin>
    </DetailContent>
}