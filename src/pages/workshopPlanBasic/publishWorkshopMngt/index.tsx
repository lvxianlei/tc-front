import useRequest from "@ahooksjs/use-request"
import { Button, Form, message, Space, Spin } from "antd"
import React, { useCallback, useState } from "react"
import RequestUtil from "../../../utils/RequestUtil"
import { DetailContent, EditableTable, CommonAliTable } from "../../common"
import { pageTable, pageTableSetting } from "./data.json"
import { compoundTypeOptions, factoryTypeOptions, productTypeOptions } from "../../../configuration/DictionaryOptions"
export default function Index(): React.ReactElement {
    const [form] = Form.useForm()
    const [edit, setEdit] = useState<boolean>(false)
    const handleEditClick = useCallback(() => setEdit(true), [setEdit])
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/list`);
            resole(result)
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
        const groupIds = data?.records.filter((item: any) => !(submitData.submit.map((sItem: any) => sItem.id).includes(item.id)))
        await saveRun({
            groupIds: groupIds.map((item: any) => item.id),
            workshopConfigs: submitData.submit.map((item: any) => ({
                productTypeId: item.productTypeName,
                weldingTypeId: item.weldingTypeName,
                weldingWorkshopId: item.weldingWorkshopName,
                workshopId: item.workshopName,
                factoryId: item.factoryName
            }))
        })
        message.success("保存成功...")
        setEdit(false)
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
                        case "productTypeName":
                            return ({
                                ...item,
                                mode: "multiple",
                                allowClear: true,
                                enum: productTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
                            })
                        case "factoryName":
                            return ({ ...item, enum: factoryTypeOptions?.map((item: any) => ({ label: item.name, value: item.id })) })
                        case "weldingTypeName":
                            return ({ ...item, enum: compoundTypeOptions?.map((item: any) => ({ label: item.name, value: item.id })) })
                        case "weldingWorkshopName":
                            return ({
                                ...item,
                                enum: productionUnitData?.map((item: any) => ({ label: item.name, value: item.id }))
                            })
                        case "workshopName":
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
                dataSource={data?.records}
            />}
            {!edit && <>
                <Space size={16} style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={handleEditClick}>编辑</Button>
                </Space>
                <CommonAliTable columns={pageTable} dataSource={data?.records} />
            </>}
        </Spin>
    </DetailContent>
}