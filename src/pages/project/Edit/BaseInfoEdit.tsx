import React, { useState, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, Attachment, AttachmentRef } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { baseInfoData, cargoVOListColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"

export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [address, setAddress] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoVOListForm] = Form.useForm()
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const { loading: addressLoading, data: addressList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const addressList: any[] = await RequestUtil.get(`/tower-system/region/00`)
            resole([...addressList.map(item => ({
                value: `${item.bigRegion}-${item.name}`,
                label: `${item.bigRegion}-${item.name}`
            })), { value: "其他-国外", label: "其他-国外" }])
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${params.id}`)
            // 对数据进行处理
            if (result && result.cargoVOList && result.cargoVOList.length > 0) {
                result.cargoVOList.forEach((item: any) => item.amount = item.amount <= 0 ? 0 : item.amount)
            }
            cargoVOListForm.setFieldsValue({ submit: result.cargoVOList })
            setAddress(result.address)
            resole({
                ...result,
                address: `${["null", null].includes(result.bigRegion) ? "" : result.bigRegion}-${["null", null].includes(result.address) ? "" : result.address}`
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: params.id === "new" })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[params.id === "new" ? "post" : "put"](`/tower-market/projectInfo`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const cargoVOListData = await cargoVOListForm.validateFields()
            const projectLeaderType = typeof baseInfoData.projectLeader === "string" ? true : false
            const [bigRegion, address] = baseInfoData.address !== "其他-国外" ? baseInfoData.address.split("-") : ["", "其他-国外"]
            const result = await run({
                ...baseInfoData,
                id: data?.id,
                address,
                bigRegion,
                fileIds: attchsRef.current?.getDataSource().map(item => item.id),
                cargoDTOList: cargoVOListData.submit,
                projectLeaderId: projectLeaderType ? (data as any).projectLeaderId : baseInfoData.projectLeader?.records[0].id,
                projectLeader: baseInfoData.projectLeader?.value || baseInfoData.projectLeader,
                biddingPerson: baseInfoData.biddingPerson?.value || baseInfoData.biddingPerson,
                biddingAgency: baseInfoData.biddingAgency?.value || baseInfoData.biddingAgency
            })
            if (result) {
                message.success("保存成功...")
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.address) {
            setAddress(fields.address);
            //address 不是其他-国外 country 置空
            if (fields.address != '其他-国外') {
                baseInfoForm.setFieldsValue({ country: "" })
            }
        }
    }
    return <>
        {params.id !== "new" && <ManagementDetailTabsTitle />}
        <DetailContent operation={[
            <Button
                key="save"
                type="primary"
                onClick={handleSubmit}
                loading={saveStatus}
                style={{ marginRight: 16 }}
            >保存</Button>,
            <Button key="cacel" onClick={() => history.goBack()}>取消</Button>
        ]}>
            <Spin spinning={loading || addressLoading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    onChange={handleBaseInfoChange}
                    form={baseInfoForm}
                    columns={
                        address === "其他-国外" ?
                            baseInfoData.map((item: any) => item.dataIndex === "address" ?
                                ({
                                    ...item,
                                    type: "select",
                                    enum: addressList
                                }) : item) :
                            baseInfoData.map((item: any) => item.dataIndex === "address" ? ({
                                ...item,
                                type: "select",
                                enum: addressList
                            }) : item).filter((item: any) => item.dataIndex !== "country")
                    } dataSource={data || {}} edit />
                <DetailTitle title="物资清单" />
                <EditTable form={cargoVOListForm} columns={cargoVOListColumns} dataSource={data?.cargoVOList} />
                <Attachment title="附件信息" maxCount={10} ref={attchsRef} edit dataSource={data?.attachVos} />
            </Spin>
        </DetailContent>
    </>
}