import React, { useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { Button, Form, message, Row, Space, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../../common"
import SelectProductGroup from "./SelectProductGroup"
import { newProductGroup, productAssist } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"

const calcContractTotal = (records: any[]) => {
    return records.reduce((result: { weight: string, amount: string }, item: any) => ({
        weight: (parseFloat(result.weight) + parseFloat(item.totalWeight || "0.00")).toFixed(2),
        amount: (parseFloat(result.amount) + parseFloat(item.number || "0.00")).toFixed(2)
    }), { weight: "0.00", amount: "0.00" })
}

export default function ProductGroupEdit() {
    const history = useHistory()
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const editMatch: any = useRouteMatch<{ type: "new" | "edit", projectId: string, id: string }>("/project/:entryPath/:type/productGroup/:projectId/:id")
    const newMatch: any = useRouteMatch<{ type: "new" | "edit", projectId: string }>("/project/:entryPath/:type/productGroup/:projectId")
    const match = editMatch || newMatch
    const [visible, setVisible] = useState<boolean>(false)
    const [select, setSelect] = useState<any[]>([])
    const [when, setWhen] = useState<boolean>(true)
    const [contractId, setContractId] = useState<string>("")
    const [saleOrderId, setSaleOrderId] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoDtoForm] = Form.useForm()
    const total: any = calcContractTotal(selectedRows)
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productGroup/${match.params?.id}`)
            baseInfoForm.setFieldsValue(result)
            cargoDtoForm.setFieldsValue({ submit: result.contractCargoVos })
            setContractId(result.contractId)
            setSaleOrderId(result.saleOrderId)
            setSelect(result.productDetails)
            resole({
                ...result,
                saleOrderNumber: {
                    value: result.saleOrderNumber,
                    id: result.saleOrderId
                }
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: match.params?.type === "new" || !match.params?.id })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[match.params?.type === "new" ? "post" : "put"](`/tower-market/productGroup`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const saleOrderData = baseInfoData.saleOrderNumber?.id || baseInfoData.saleOrderId
            baseInfoData.saleOrderId = saleOrderData
            const contractCargoDtosData = await cargoDtoForm.validateFields()
            delete data?.contractCargoVos
            if (select.map(item => item.id).length <= 0) {
                message.error("当前杆塔明细未关联确认明细，请关联后再保存...")
            } else {
                await run({
                    ...data,
                    ...baseInfoData,
                    projectId: match.params?.projectId && match.params?.projectId !== "undefined" ? match.params?.projectId : undefined,
                    contractId,
                    saleOrderNumber: baseInfoData.saleOrderNumber?.value,
                    saleOrderId,
                    contractCargoDtos: contractCargoDtosData.submit,
                    productIds: select.map(item => item.id)
                })
                setWhen(false)
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (changedFields: any, allFields: any) => {
        if (Object.keys(changedFields)[0] === "saleOrderNumber") {
            baseInfoForm.setFieldsValue({
                ...allFields,
                ...changedFields.saleOrderNumber.records[0],
                saleOrderNumber: changedFields.saleOrderNumber
            })
            setContractId(changedFields.saleOrderNumber.records[0]?.contractId || "")
            setSaleOrderId(changedFields.saleOrderNumber.records[0]?.id || "")
        }
    }

    const handleModalOk = (selectRows: any[]) => {
        setSelect([...select,
        ...selectRows.filter((item: any) => !select.map((item: any) => item.id).includes(item.id))])
        setVisible(false)
    }

    const deleteProject = (id: string) => setSelect(select.filter((item: any) => item.id !== id))

    return <DetailContent
        when={when}
        title={[<Button key="pro" type="primary" onClick={() => setVisible(true)}>导入确认明细</Button>]}
        operation={[
            <Button
                key="save"
                type="primary"
                style={{ marginRight: "12px" }}
                onClick={handleSubmit}
                loading={saveStatus}>保存</Button>,
            <Button key="goback"
                type="default"
                onClick={() => history.goBack()}
            >返回</Button>
        ]}>
        <Spin spinning={loading}>
            <SelectProductGroup
                projectId={match.params?.projectId}
                productGroupId={match.params?.id}
                select={select.map(item => item.id)}
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleModalOk} />
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={baseInfoForm}
                onChange={handleBaseInfoChange}
                columns={newProductGroup.map((item: any) => {
                    switch (item.dataIndex) {
                        case "saleOrderNumber":
                            return ({
                                ...item,
                                disabled: [1, 2].includes(data?.status),
                                path: `${item.path}?${match.params?.projectId === 'undefined' ? undefined : `projectId=${match.params?.projectId}`}`
                            })
                        case "description":
                            return ({ ...item, disabled: [1, 2].includes(data?.status) })
                        default:
                            return item
                    }
                })}
                dataSource={data || {}}
                edit />
            <DetailTitle title="明细" />
            {
                selectedRows.length > 0 && <Row style={{ width: 1600 }}>
                    <Row style={{ color: "#FF8C00", fontWeight: 600, fontSize: 14 }}>合计：</Row>
                    <Space>
                        <div>总基数：<span style={{ color: "#FF8C00" }}>{total.amount}基</span></div>
                        <div>总重量：<span style={{ color: "#FF8C00" }}>{total.weight}吨</span></div>
                    </Space>
                </Row>
            }
            <CommonTable
                columns={[{
                    title: "操作",
                    dataIndex: "opration",
                    width: 30,
                    fixed: "left",
                    render: (_: any, records: any) => <>
                        <Button type="link" disabled={!["0", 0, null].includes(records.taskNoticeId)} onClick={() => deleteProject(records.id)}>删除</Button>
                    </>
                }, {
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }, ...productAssist]}
                dataSource={select}
                pagination={false}
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRows?.map((item: any) => item.id),
                    onChange: (_: string[], selectedRows: any[]) => {
                        setSelectedRows(selectedRows)
                    },
                }}
            />
        </Spin>
    </DetailContent>
}