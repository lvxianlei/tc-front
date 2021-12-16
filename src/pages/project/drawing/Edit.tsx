import React, { useImperativeHandle, forwardRef, useRef, useState } from "react"
import { Spin, Form } from 'antd'
import { DetailTitle, BaseInfo, Attachment, AttachmentRef } from '../../common'
import { setting } from "./drawing.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface EditProps {
  type: "new" | "edit",
  id: string
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
  const attchsRef = useRef<AttachmentRef>()
  const [baseForm] = Form.useForm()
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
  }), { manual: type === "new", refreshDeps: [id] })

  const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-market/drawingConfirmation`, { ...postData, id: data?.id })
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { manual: true })

  const onSubmit = () => new Promise(async (resolve, reject) => {
    try {
      const baseData = await baseForm.validateFields()
      await saveRun({
        ...baseData,
        internalNumber: baseData.internalNumber.value,
        contractId: baseData.internalNumber.id,
        serviceManager: baseData.serviceManager.id,
        serviceManagerId: baseData.serviceManager.id,
      })
      resolve(true)
    } catch (error) {
      reject(false)
    }
  })

  useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])
  return <Spin spinning={loading}>
    <BaseInfo form={baseForm} columns={setting} col={3} dataSource={data || {}} edit />
    <Attachment title="附件" ref={attchsRef} dataSource={data?.invoiceAttachInfoVos} edit />
  </Spin>
})