import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Button, Form, Modal, Row, Spin } from "antd"
import { BaseInfo, CommonTable, DetailContent, DetailTitle, EditableTable } from "../../common"
import { edit } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { productAssist } from "../managementDetailData.json"
interface EditProps {
    id: string
    type: 1 | 2 | 3
}

export default forwardRef(function Edit({ id, type }: EditProps, ref) {
    const [editForm] = Form.useForm()
    const [contentForm] = Form.useForm()
    const [suspendForm] = Form.useForm()
    const [select, setSelect] = useState<string[]>([])
    const [selectRows, setSelectRows] = useState<any[]>([])
    const [taskNoticeId, setTaskNoticeId] = useState<string>("")
    const [productGroupDetails, setProductGroupDetails] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [productDetails, setProductDetails] = useState<any[]>([])
    const { loading, data: planData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/editNotice/detail?id=${id}`)
            setProductGroupDetails(result?.editNoticeProductVOList || [])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: id === "create" })

    const { run: saveRun } = useRequest((postData) => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil[id === "create" ? "post" : "put"]("/tower-market/editNotice", postData)
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
            editForm.setFieldsValue({
                internalNumber: taskNotice.internalNumber,
                orderProjectName: taskNotice.orderProjectName,
                editBaseNum: taskNotice.editBaseNum,
                editWeight: taskNotice.editWeight,
                ascriptionName: taskNotice.ascriptionName,
                region: taskNotice.region
            })
        }
    }

    const handleSubmit = async () => {
        const postData = await editForm.validateFields()
        const contentFormData = await contentForm.validateFields()
        const suspendFormData = await suspendForm.validateFields()
        await saveRun({
            editType: type,
            taskNoticeId: postData.taskNoticeId?.id,
            editNoticeInfoDTOList: contentFormData?.submit?.map((item: any) => ({
                description: item.description,
                editAfter: item.editAfter,
                editBefore: item.editBefore,
                field: item.field
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
        setProductGroupDetails([
            ...selectRows,
            ...productGroupDetails.filter((pro: any) => !select.includes(pro.id))])
        setVisible(false)
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
                    dataSource={planData || {}}
                />
                {type === 1 && <EditableTable
                    form={contentForm}
                    columns={edit.content}
                    dataSource={planData?.editNoticeInfoVOList || []}
                />}
                {[2, 3].includes(type) && <>
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
                        form={suspendForm}
                        columns={edit.suspend}
                        dataSource={productGroupDetails} />
                </>}
            </DetailContent>
        </Spin>
    </>
})