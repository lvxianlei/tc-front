import React, { useState, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Upload } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable, Attachment, AttachmentRef } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { baseInfoData, enclosure, cargoVOListColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"
import AuthUtil from "../../../utils/AuthUtil"
import { downLoadFile } from "../../../utils"

export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const [address, setAddress] = useState<string>("")
    const [baseInfoForm] = Form.useForm()
    const [cargoVOListForm] = Form.useForm()
    const [attachVosForm] = Form.useForm()
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${params.id}`)
            const addressList: any[] = await RequestUtil.get(`/tower-system/region/00`)
            // 对数据进行处理
            if (result && result.cargoVOList && result.cargoVOList.length > 0) {
                result.cargoVOList.forEach((item: any) => item.amount = item.amount <= 0 ? 0 : item.amount)
            }
            setAttachVosData(result.attachVos)
            baseInfoForm.setFieldsValue(result)
            cargoVOListForm.setFieldsValue({ submit: result.cargoVOList })
            attachVosForm.setFieldsValue(result.attachVos)
            setAddress(result.address)
            resole({ ...result, addressList: [...addressList.map(item => ({ value: item.name, label: item.name })), { value: "其他-国外", label: "其他-国外" }] })
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/projectInfo`, postData)
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
            const result = await run({
                ...baseInfoData,
                id: data?.id,
                // attachInfoDtos: attachVosData,
                attachInfoDtos: attchsRef.current?.getDataSource(),
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

    // const uploadChange = (event: any) => {
    //     if (event.file.status === "done") {
    //         if (event.file.response.code === 200) {
    //             const dataInfo = event.file.response.data
    //             const fileInfo = dataInfo.name.split(".")
    //             setAttachVosData([...attachVosData, {
    //                 id: "",
    //                 uid: attachVosData.length,
    //                 link: dataInfo.link,
    //                 name: dataInfo.originalName.split(".")[0],
    //                 description: "",
    //                 filePath: dataInfo.name,
    //                 fileSize: dataInfo.size,
    //                 fileSuffix: fileInfo[fileInfo.length - 1],
    //                 userName: dataInfo.userName,
    //                 fileUploadTime: dataInfo.fileUploadTime
    //             }])
    //         }
    //     }
    // }

    // const deleteAttachData = (id: number) => {
    //     setAttachVosData(attachVosData.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    // }

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
        <ManagementDetailTabsTitle />
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
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    onChange={handleBaseInfoChange}
                    form={baseInfoForm}
                    columns={
                        address === "其他-国外" ?
                            baseInfoData.map((item: any) => item.dataIndex === "address" ?
                                ({ ...item, type: "select", enum: data?.addressList }) : item) :
                            baseInfoData.map((item: any) => item.dataIndex === "address" ? ({ ...item, type: "select", enum: data?.addressList }) : item).filter((item: any) => item.dataIndex !== "country")
                    } dataSource={data || {}} edit />
                <DetailTitle title="物资清单" />
                <EditTable form={cargoVOListForm} columns={cargoVOListColumns} dataSource={data?.cargoVOList} />
                <Attachment title="附件信息" maxCount={10} ref={attchsRef} edit dataSource={attachVosData} />
            </Spin>
        </DetailContent>
    </>
}