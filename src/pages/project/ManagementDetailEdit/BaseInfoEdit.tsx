import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Upload } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable } from '../../common'
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
    const [projectLeaderId, setProjectLeaderId] = useState<string>("")
    const [attachVosData, setAttachVosData] = useState<any[]>([])
    const [baseInfoForm] = Form.useForm()
    const [cargoVOListForm] = Form.useForm()
    const [attachVosForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${params.id}`)
            setProjectLeaderId(result.projectLeaderId)
            setAttachVosData(result.attachVos)
            baseInfoForm.setFieldsValue(result)
            cargoVOListForm.setFieldsValue({ submit: result.cargoVOList })
            attachVosForm.setFieldsValue(result.attachVos)
            resole(result)
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
            delete data?.cargoVOList
            delete data?.attachVos
            const result = await run({
                ...data,
                ...baseInfoData,
                attachInfoDtos: attachVosData,
                cargoDTOList: cargoVOListData.submit,
                projectLeaderId,
                projectLeader: baseInfoData.projectLeader.value || baseInfoData.projectLeader,
                biddingPerson: baseInfoData.biddingPerson.value || baseInfoData.biddingPerson,
                biddingAgency: baseInfoData.biddingAgency.value || baseInfoData.biddingAgency
            })
            if (result) {
                message.success("保存成功...")
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (changedFields: any) => {
        if (Object.keys(changedFields)[0] === "projectLeader") {
            setProjectLeaderId(changedFields.projectLeader.records[0].id)
        }
    }
    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachVosData([...attachVosData, {
                    id: "",
                    uid: attachVosData.length,
                    link: dataInfo.link,
                    name: dataInfo.originalName.split(".")[0],
                    description: "",
                    filePath: dataInfo.name,
                    fileSize: dataInfo.size,
                    fileSuffix: fileInfo[fileInfo.length - 1],
                    userName: dataInfo.userName,
                    fileUploadTime: dataInfo.fileUploadTime
                }])
            }
        }
    }

    const deleteAttachData = (id: number) => {
        setAttachVosData(attachVosData.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
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
                <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={baseInfoData} dataSource={data || {}} edit />
                <DetailTitle title="货物清单" />
                <EditTable form={cargoVOListForm} columns={cargoVOListColumns} dataSource={data?.cargoVOList} />
                <DetailTitle title="附件信息" operation={[<Upload
                    key="sub"
                    name="file"
                    multiple={true}
                    action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                    headers={{
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }}
                    showUploadList={false}
                    onChange={uploadChange}
                ><Button key="enclosure" type="default">上传附件</Button></Upload>]} />
                <CommonTable columns={[{
                    title: "操作", dataIndex: "opration",
                    render: (_: any, record: any) => (<>
                        <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                        <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                    </>)
                }, ...enclosure]} dataSource={attachVosData} />
            </Spin>
        </DetailContent>
    </>
}