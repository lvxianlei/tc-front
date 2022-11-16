import React, { useState, useEffect } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, DatePicker, Form, message, Modal, Spin } from "antd"
import moment from "moment"
import { DetailContent, BaseInfo, DetailTitle, CommonTable, FormItemType } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { taskNoticeEditBaseInfo, taskNoticeEditSpec, salesAssist, productAssist } from "../managementDetailData.json"
import { materialStandardOptions } from "../../../configuration/DictionaryOptions"
export default function SalesPlanEdit() {
    const history = useHistory()
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const editMatch: any = useRouteMatch<{ type: "new" | "edit", projectId: string, id: string }>("/project/:entryPath/:type/salesPlan/:projectId/:id")
    const newMatch: any = useRouteMatch<{ type: "new" | "edit", projectId: string }>("/project/:entryPath/:type/salesPlan/:projectId")
    const match = editMatch || newMatch
    const [when, setWhen] = useState<boolean>(true)
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
    const { loading, data }: any = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/${match.params.id}`)
            setSaleOrderId(result.saleOrderId)
            setContractId(result.contractId)
            setProductDetails(result.productInfos || [])
            resole({
                ...result,
                saleOrderNumber: {
                    value: result.saleOrderNumber,
                    id: result.saleOrderId,
                }
            })
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

    const { loading: rdResonLoading, run: resonRun } = useRequest<{ [key: string]: any }>((postData: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/drawingConfirmation/rdDescription`, { ids: postData })
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
                contractId,
                saleOrderNumber: baseInfoData.saleOrderNumber?.value,
                saleOrderId: baseInfoData.saleOrderNumber?.id,
                deliveryTime: `${moment(baseInfoData.deliveryTime).format("YYYY-MM-DD")} 00:00:00`,
                saleOrder: baseInfoData.saleOrderNumber.saleOrderId || "",
                productInfoList: submitProductDetailsData
            }
            match.params.projectId !== "undefined" && (submitData.projectId = match.params.projectId)
            if (type === "save") {
                await run(submitData)
                setWhen(false)
                message.success("保存成功...")
                history.goBack()
                return
            }
            if (type === "saveAndApprove") {
                await saveAndApproveRun(submitData)
                setWhen(false)
                message.success("保存并提交审核成功...")
                history.goBack()
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (changedFields: any) => {
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

    const handleModalOk = async () => {
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
        const resonData = await resonRun(newProductDetails.map((item: any) => item?.businessId))
        cargoDtoForm.setFieldsValue({ rdDescription: resonData.filter((item: any) => !!item).join("\n") })
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
                return ({ ...item, deliveryTime: productDetailsFormData[item.id].deliveryTime })
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

    /***
     * 比较时间大小
     */
    const comparisonTime = (timer: any) => {
        let v: any = [];
        timer.map((d: any) => {
            let date = new Date(d).getTime();
            v.push(date);
        });
        v.sort((a: any, b: any) => b - a)
        return moment(v[0]).format("YYYY-MM-DD")
    }

    // 当杆塔信息数据发生变化触发
    useEffect(() => {
        if (productDetails && productDetails.length > 0) {
            let result: any = [];
            productDetails.map((item: any) => item.deliveryTime && result.push(item.deliveryTime));
            if (result.length > 0) {
                baseInfoForm.setFieldsValue({
                    deliveryTime: moment(comparisonTime(result))
                })
            }
        }

    }, [JSON.stringify(productDetails)])

    // 当修改客户交货日期触发
    const handleChange = (changedFields: any, allFields: any) => {
        if (changedFields && changedFields.length > 0) {
            // 修改对应的值
            const index = allFields.findIndex((item: any) => changedFields[0].name[0] === item.name[0])
            let result = productDetails;
            result[index].deliveryTime = changedFields[0].value;
            setProductDetails(result.slice(0))
        }
    }

    return <DetailContent
        when={when}
        operation={[
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
            confirmLoading={rdResonLoading}
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
                columns={taskNoticeEditBaseInfo.map((item: any) => {
                    if (item.dataIndex === "saleOrderNumber") {
                        const projectId = !match.params.projectId || match.params.projectId === "undefined"
                        return ({
                            ...item,
                            path: `${item.path}?taskStatus=0,1${!projectId ? `&projectId=${match.params.projectId}` : ""}`
                        })
                    }
                    if (item.dataIndex === "issueTime" && match.params.type === "new") {
                        return ({
                            ...item,
                            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name="issueTime" initialValue={moment(new Date())}>
                                    <DatePicker format={'YYYY-MM-DD'} style={{ width: '105%' }} />
                                </Form.Item>
                            )
                        })
                    }
                    return item
                })} dataSource={data || {}} edit col={3} />
            <DetailTitle title="特殊要求" />
            <BaseInfo form={cargoDtoForm}
                columns={taskNoticeEditSpec.map(item => item.dataIndex === "materialStandard" ? ({ ...item, enum: materialStandardEnum }) : item)}
                dataSource={data || {}} edit col={3} />
            <DetailTitle title="杆塔信息" operation={[<Button key="select" type="primary" disabled={!saleOrderId} onClick={handleSelectClick}>选择杆塔明细</Button>]} />
            <Form form={productDetailsForm} onFieldsChange={handleChange}>
                <CommonTable
                    pagination={false}
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