import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Upload } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable } from '../common'
import { baseInfoData, enclosure, paths, cargoVOListColumns } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
import { TabTypes } from "./ManagementDetail"
import AuthUtil from "../../utils/AuthUtil"
export default function BaseInfoEdit(): JSX.Element {
  const history = useHistory()
  const params = useParams<{ tab: TabTypes, id: string }>()
  const [projectLeaderId, setProjectLeaderId] = useState<string>("")
  const [biddingPerson, setBiddingPerson] = useState<string>("")
  const [attachVosData, setAttachVosData] = useState<any[]>([])
  const [baseInfoForm] = Form.useForm()
  const [cargoVOListForm] = Form.useForm()
  const { loading: saveStatus, data: saveResult, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/projectInfo`, postData)
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { manual: true })

  const handleSubmit = async () => {
    await baseInfoForm.validateFields()
    await cargoVOListForm.validateFields()
    const baseInfoData = await baseInfoForm.getFieldsValue()
    const cargoVOListData = await cargoVOListForm.getFieldsValue()
    await run({
      ...baseInfoData,
      attachInfoDtos: attachVosData,
      cargoDTOList: cargoVOListData.submit,
      projectLeaderId,
      biddingPerson
    })

    if (saveResult) {
      message.success("保存成功...")
    }
  }

  const handleBaseInfoChange = (changedFields: any, allFields: any) => {
    if (Object.keys(changedFields)[0] === "projectLeader") {
      baseInfoForm.setFieldsValue({ ...allFields, ...changedFields.projectLeader.records[0] })
      setProjectLeaderId(changedFields.projectLeader.records[0].id)
    }
    if (Object.keys(changedFields)[0] === "biddingPerson") {
      if (changedFields.biddingPerson) {
        baseInfoForm.setFieldsValue({ biddingPerson: changedFields.biddingPerson })
        setBiddingPerson(changedFields.biddingPerson)
      } else {
        setBiddingPerson(changedFields.biddingPerson.value)
      }
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
          name: dataInfo.originalName.split(".")[0],
          description: "",
          filePath: dataInfo.link,
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
  return <DetailContent operation={[
    <Button key="save" type="primary" onClick={handleSubmit} loading={saveStatus}>保存</Button>,
    <Button key="cacel" onClick={() => history.goBack()}>取消</Button>
  ]}>
    <DetailTitle title="基本信息" />
    <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={baseInfoData} dataSource={{}} edit />
    <DetailTitle title="货物清单" />
    <EditTable form={cargoVOListForm} columns={cargoVOListColumns} dataSource={[]} />
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
        {/* <Button type="link">下载</Button> */}
      </>)
    }, ...enclosure]} dataSource={attachVosData} />
  </DetailContent>
}