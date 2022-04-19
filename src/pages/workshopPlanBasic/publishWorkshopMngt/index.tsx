import useRequest from "@ahooksjs/use-request"
import { Button, Form, message, Space, Spin } from "antd"
import React, { useCallback, useState } from "react"
import RequestUtil from "../../../utils/RequestUtil"
import { DetailContent, EditableTable, CommonAliTable } from "../../common"
import { pageTable, pageTableSetting } from "./data.json"
import { compoundTypeOptions, factoryTypeOptions, productTypeOptions } from "../../../configuration/DictionaryOptions"
import { useHistory } from "react-router"
export default function Index(): React.ReactElement {
    const history = useHistory()
    const [form] = Form.useForm()
    const [edit, setEdit] = useState<boolean>(false)
    const handleEditClick = useCallback(() => setEdit(true), [setEdit])
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/list?size=1000`);
            resole(result?.records.map((item: any) => ({
                ...item,
                productTypeId: item.productTypeId?.split(",") || [],
                workshopId: item.workshopId?.split(",") || []
            })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: productionUnitDataLoading, data: productionUnitData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
            resole(result.records)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveLoading, run: saveRun } = useRequest<any>((params) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/workshop/config`, params);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        const submitData = await form.validateFields()
        const groupIds = data?.filter((item: any) => !((submitData.submit || []).map((sItem: any) => sItem.id).includes(item.groupId)))
        await saveRun({
            groupIds: groupIds.map((item: any) => item.groupId),
            workshopConfigs: (submitData.submit || []).map((item: any) => ({
                productTypeId: item.productTypeId?.join(","),
                weldingTypeId: item.weldingTypeId,
                weldingWorkshopId: item.weldingWorkshopId,
                workshopId: item.workshopId?.join(","),
                factoryId: item.factoryId
            }))
        })
        message.success("保存成功...")
        history.go(0)
    }

    return <DetailContent>
        <Spin spinning={loading || productionUnitDataLoading}>
            {edit && <EditableTable
                form={form}
                opration={[
                    <Button type="primary" loading={saveLoading} key="edit" onClick={handleSubmit}>保存</Button>
                ]}
                columns={pageTableSetting.map((item: any) => {
                    switch (item.dataIndex) {
                        case "productTypeId":
                            return ({
                                ...item,
                                mode: "multiple",
                                allowClear: true,
                                enum: productTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
                            })
                        case "factoryId":
                            return ({ ...item, enum: factoryTypeOptions?.map((item: any) => ({ label: item.name, value: item.id })) })
                        case "weldingTypeId":
                            return ({ ...item, enum: compoundTypeOptions?.map((item: any) => ({ label: item.name, value: item.id })) })
                        case "weldingWorkshopId":
                            return ({
                                ...item,
                                enum: productionUnitData?.map((item: any) => ({ label: item.name, value: item.id }))
                            })
                        case "workshopId":
                            return ({
                                ...item,
                                mode: "multiple",
                                allowClear: true,
                                enum: productionUnitData?.map((item: any) => ({ label: item.name, value: item.id }))
                            })
                        default:
                            return item
                    }
                })}
                haveIndex={false}
                dataSource={data.map((item: any) => ({ ...item, id: item.groupId })) || []}
            />}
            {!edit && <>
                <Space size={16} style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={handleEditClick}>编辑</Button>
                </Space>
                <CommonAliTable columns={pageTable} dataSource={data || []} />
            </>}
        </Spin>
    </DetailContent>
}