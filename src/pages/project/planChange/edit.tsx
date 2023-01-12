import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Button, Form, Modal, Row, Spin } from "antd"
import { BaseInfo, CommonTable, DetailContent, DetailTitle, EditableTable } from "../../common"
import { edit } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { productAssist } from "../managementDetailData.json"
interface EditProps {
    id: string
    type: 1 | 2 | 3 | 4
}
const calcContractTotal = (records: any[]) => {
    return records.reduce((result: { weight: string, amount: string }, item: any) => ({
        weight: (parseFloat(result.weight) + parseFloat(item.totalWeight || "0.00")).toFixed(2),
        amount: (parseFloat(result.amount) + parseFloat(item.number || "0")).toFixed(0)
    }), { weight: "0.00", amount: "0" })
}

export default forwardRef(function Edit({ id, type }: EditProps, ref) {
    const [editForm] = Form.useForm()
    const [contentForm] = Form.useForm()
    const [suspendForm] = Form.useForm()
    const [planDataSource, setPlanDataSource] = useState<{ [key: string]: any }>({})
    const [select, setSelect] = useState<string[]>([])
    const [selectRows, setSelectRows] = useState<any[]>([])
    const [taskNoticeId, setTaskNoticeId] = useState<string>("")
    const [productGroupDetails, setProductGroupDetails] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const { loading, data: planData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/editNotice/detail?id=${id}`)
            setProductGroupDetails(result?.editNoticeProductVOList || [])
            setSelect((result?.editNoticeProductVOList || []).map((item: any) => item.productId))
            setTaskNoticeId(result.taskNoticeId)
            resole({
                ...result,
                editNoticeInfoVOList: result?.editNoticeInfoVOList?.map((item: any) => ({
                    ...item,
                    field: item.field ? {
                        value: item.field,
                        label: item.fieldName
                    } : null
                })) || []
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: id === "create" })
    const { run: saveRun } = useRequest((postData) => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil[id === "create" ? "post" : "put"]("/tower-market/editNotice", id === "create" ? postData : ({
                ...postData,
                id: planData?.id
            }))
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: modalLoading, data: modalData, run: modalRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/${id}`)
            resole(result?.productInfos)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleEditChange = (fields: any) => {
        if (fields.taskNoticeId) {
            setTaskNoticeId(fields.taskNoticeId?.id)
            const taskNotice = fields.taskNoticeId.records[0]
            setPlanDataSource({
                materialStandardName: taskNotice.materialStandardName,
                materialDemand: taskNotice.materialDemand,
                weldingDemand: taskNotice.weldingDemand,
                packDemand: taskNotice.packDemand,
                galvanizeDemand: taskNotice.galvanizeDemand,
                payAsk: taskNotice.payAsk,
                peculiarDescription: taskNotice.peculiarDescription,
            })
            editForm.setFieldsValue({
                internalNumber: taskNotice.internalNumber,
                orderProjectName: taskNotice.orderProjectName,
                editBaseNum: taskNotice.productNumber,
                editWeight: taskNotice.totalWeight,
                ascriptionName: taskNotice.ascriptionName,
                region: taskNotice.region,
                customerCompany: taskNotice.customerCompany
            })
        }
    }

    const handleSubmit = async () => {
        const postData = await editForm.validateFields()
        const contentFormData = await contentForm.validateFields()
        const suspendFormData = await suspendForm.validateFields()
        await saveRun({
            editType: type,
            editRemark: postData.editRemark,
            description: postData.description,
            taskNoticeId: postData.taskNoticeId?.id,
            editNoticeInfoDTOList: contentFormData?.submit?.map((item: any) => ({
                description: item.description,
                editAfter: item.editAfter,
                editBefore: item.editBefore,
                field: item.field.value,
                fieldName: item.field.label,
            })) || [],
            editNoticeProductDTOList: suspendFormData?.submit?.map((item: any) => ({
                description: item.description,
                editNoticeId: item.editNoticeId,
                isIssuedWorkshop: item.isIssuedWorkshop,
                processedWeight: item.processedWeight,
                productId: item.id,
                productionStatus: item.productionStatus
            })) || []
        })
    }

    useImperativeHandle(ref, () => ({ handleSubmit }), [])

    const handleModalOk = async () => {
        const total = calcContractTotal(selectRows)
        setProductGroupDetails(selectRows)
        editForm.setFieldsValue({
            editBaseNum: total.amount,
            editWeight: total.weight
        })
        setVisible(false)
    }

    const handleContentChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const result = allFields.submit[fields.submit.length - 1]
            if (result.field) {
                contentForm.setFieldsValue({
                    submit: allFields.submit.map((item: any) => {
                        if (item.id === result.id) {
                            return ({
                                ...item,
                                editBefore: planDataSource[result.field]
                            })
                        }
                        return item
                    })
                })
            }
        }
    }

    const handleProductChange = (fields: any, allFields: any) => {
        if (fields.type === "remove") {
            const total = calcContractTotal(allFields.submit)
            editForm.setFieldsValue({
                editBaseNum: total.amount,
                editWeight: total.weight
            })
        }
    }

    return <>
        <Modal
            title="选择杆塔"
            visible={visible}
            width={1011}
            onCancel={() => setVisible(false)}
            onOk={handleModalOk}
            destroyOnClose>
            <Spin spinning={modalLoading}>
                <CommonTable
                    columns={productAssist}
                    dataSource={(modalData as any[]) || []}
                    rowSelection={{
                        selectedRowKeys: select,
                        type: "checkbox",
                        getCheckboxProps: (records: any) => ({
                            // disabled: productDetails.map(item => item.id).includes(records.id)
                        }),
                        onChange: (selectedRowKeys: string[], rows: any[]) => {
                            setSelect(selectedRowKeys)
                            setSelectRows(rows)
                        }
                    }}
                />
            </Spin>
        </Modal>
        <Spin spinning={loading}>
            <DetailContent>
                <DetailTitle title="基础信息" />
                <BaseInfo
                    col={4}
                    edit
                    form={editForm}
                    columns={edit.base}
                    onChange={handleEditChange}
                    dataSource={{
                        ...planData,
                        taskNoticeId: {
                            id: planData?.taskNoticeId,
                            value: planData?.planNumber,
                            records: [
                                {
                                    id: planData?.taskNoticeId,
                                    planNumber: planData?.planNumber,
                                    internalNumber: planData?.internalNumber,
                                    orderProjectName: planData?.orderProjectName,
                                    editBaseNum: planData?.editBaseNum,
                                    editWeight: planData?.editWeight,
                                    ascriptionName: planData?.ascriptionName,
                                    region: planData?.region,
                                    customerCompany: planData?.customerCompany
                                }
                            ]
                        }
                    }}
                />
                {type === 1 && <EditableTable
                    form={contentForm}
                    columns={edit.content}
                    onChange={handleContentChange}
                    dataSource={planData?.editNoticeInfoVOList || []}
                />}
                {[2, 3, 4].includes(type) && <>
                    <Row>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => {
                                setVisible(true)
                                modalRun(taskNoticeId)
                            }}
                        >选择杆塔</Button>
                    </Row>
                    <EditableTable
                        haveNewButton={false}
                        onChange={handleProductChange}
                        form={suspendForm}
                        columns={type === 4 ? edit.revertSuspend : edit.suspend}
                        dataSource={productGroupDetails} />
                </>}
            </DetailContent>
        </Spin>
    </>
})