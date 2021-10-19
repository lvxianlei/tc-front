import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, message, Upload } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, CommonTable } from '../common'
import { baseInfoData, enclosure, cargoVOListColumns } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
import AuthUtil from "../../utils/AuthUtil"
import { downLoadFile } from "../../utils"
import ApplicationContext from "../../configuration/ApplicationContext"
const dictionaryOptions: any = ApplicationContext.get().dictionaryOption
export default function BaseInfoEdit(): JSX.Element {
  const history = useHistory()
  const [attachVosData, setAttachVosData] = useState<any[]>([])
  const [selectAdress, setSelectAdress] = useState<string>("")
  const [baseInfoForm] = Form.useForm()
  const [cargoVOListForm] = Form.useForm()
  const typeNameEnum = dictionaryOptions["121"].map((item: any) => ({ value: item.id, label: item.name }))
  const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/projectInfo`, postData)
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { manual: true })

  const { data: address } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    try {
      const result: any[] = await RequestUtil.get(`/tower-system/region/00`)
      resole([...result.map((item: any) => ({ value: item.code, label: item.name })), { value: "其他-国外", label: "其他-国外" }])
    } catch (error) {
      reject(error)
    }
  }))

  const handleSubmit = async () => {
    try {
      const baseInfoData = await baseInfoForm.validateFields()
      const cargoVOListData = await cargoVOListForm.validateFields()
      const result = await run({
        ...baseInfoData,
        attachInfoDtos: attachVosData,
        cargoDTOList: cargoVOListData.submit,
        projectLeaderId: baseInfoData.projectLeader?.records[0]?.id,
        projectLeader: baseInfoData.projectLeader?.value,
        biddingPerson: baseInfoData.biddingPerson?.value,
        biddingAgency: baseInfoData.biddingAgency?.value
      })
      if (result) {
        message.success("保存成功...")
        history.goBack()
      }
    } catch (error) {
      console.log(error)
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

  const handleBaseInfoChange = (fields: any) => {
    if (fields.address) {
      setSelectAdress(fields.address)
    }
  }

  return <DetailContent operation={[
    <Button
      key="save"
      type="primary"
      onClick={handleSubmit}
      loading={saveStatus}
      style={{ marginRight: 16 }}
    >保存</Button>,
    <Button key="cacel" onClick={() => history.goBack()}>取消</Button>
  ]}>
    <DetailTitle title="基本信息" />
    <BaseInfo onChange={handleBaseInfoChange} form={baseInfoForm} columns={baseInfoData.map((item: any) => {
      if (item.dataIndex === "biddingPerson") {
        return ({
          ...item,
          columns: item.columns.map((columnItem: any) => columnItem.dataIndex === "type" ? ({
            ...columnItem,
            enum: typeNameEnum
          }) : columnItem)
        })
      }
      if (item.dataIndex === "address") {
        return ({ ...item, type: "select", enum: address || [] })
      }
      return item
    }).filter((item: any) => {
      if (item.dataIndex === "country") {
        return selectAdress === "其他-国外"
      }
      return true
    })} dataSource={{}} edit />
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
    ><Button key="enclosure" type="primary" ghost>上传附件</Button></Upload>]} />
    <CommonTable columns={[{
      title: "操作", dataIndex: "opration",
      render: (_: any, record: any) => (<>
        <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
        <Button type="link" onClick={() => downLoadFile(record.link || record.filePath, record.name)}>下载</Button>
      </>)
    }, ...enclosure]} dataSource={attachVosData} />
  </DetailContent>
}