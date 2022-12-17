import React, { useRef, useState } from "react"
import { Spin, Form } from 'antd'
import { BaseInfo, Attachment, AttachmentRef } from '../../common'
import { setting } from "./drawing.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { useParams } from "react-router-dom"
import ConfirmDetail from "./confirmDetail"

export default function Edit() {
  const { id, type } = useParams<{ id: string, type: "create" | "edit" }>()
  const attchsRef = useRef<AttachmentRef>()
  const [baseForm] = Form.useForm()
  const [confirmType, setConfirmType] = useState<number>(1)
  const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/drawingConfirmation/${id}`)
      result.serviceManager = {
        value: result?.serviceManager,
        id: result?.serviceManagerId
      }
      result.internalNumber = {
        value: result?.internalNumber,
        id: result?.contractId
      }
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { manual: type === "create", refreshDeps: [id] })

  const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
    try {
      const submitData = type === "create" ? postData : { ...postData, id: id }
      const result: { [key: string]: any } = await RequestUtil[type === "create" ? "post" : "put"](`/tower-market/drawingConfirmation`, submitData)
      resole(result)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  }), { manual: true })

  const onSubmit = (saveType: 1 | 2) => new Promise(async (resolve, reject) => {
    try {
      const baseData = await baseForm.validateFields()
      await saveRun({
        ...baseData,
        internalNumber: baseData.internalNumber?.value,
        contractId: baseData.internalNumber?.id,
        serviceManager: baseData.serviceManager?.value,
        serviceManagerId: baseData.serviceManager?.id,
        saveType,
        fileIds: attchsRef.current?.getDataSource().map(item => item.id)
      })
      resolve(true)
    } catch (error) {
      console.log(error)
      reject(false)
    }
  })

  const handleBaseInfoChange = (fields: any) => {
    if (fields.internalNumber) {
      baseForm.setFieldsValue({
        contractName: fields.internalNumber.records?.[0]?.contractName,
        customerCompany: fields.internalNumber.records?.[0]?.customerCompany,
        projectName: fields.internalNumber.records?.[0]?.contractName
      })
    }
    if (fields.serviceManager) {
      baseForm.setFieldsValue({
        serviceManagerTel: fields.serviceManager.records?.[0]?.phone
      })
    }
    if (fields.confirmType) {
      setConfirmType(fields.confirmType)
    }
  }

  return <Spin spinning={loading}>
    <BaseInfo
      form={baseForm}
      onChange={handleBaseInfoChange}
      columns={setting}
      col={3}
      dataSource={data || {}}
      edit />
    {confirmType === 1 && <ConfirmDetail />}
    <Attachment
      title="附件"
      ref={attchsRef}
      dataSource={data?.fileSources}
      edit />
  </Spin>
}