import React, { useImperativeHandle, forwardRef, useRef } from "react"
import { Spin, Form } from 'antd'
import { BaseInfo, Attachment, AttachmentRef } from '../../common'
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
      const submitData = type === "new" ? postData : { ...postData, id: id }
      const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-market/drawingConfirmation`, submitData)
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
  }
  useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])
  return <Spin spinning={loading}>
    <BaseInfo
      form={baseForm}
      onChange={handleBaseInfoChange}
      columns={setting}
      col={3}
      dataSource={data || {}}
      edit />
    <Attachment title="附件" ref={attchsRef} dataSource={data?.fileSources} edit />
  </Spin>
})