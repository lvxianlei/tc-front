import React, { useRef, useState } from "react"
import { Spin, Form, Button, Space, message } from 'antd'
import { BaseInfo, Attachment, AttachmentRef, DetailContent } from '../../common'
import { setting } from "./drawing.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { useHistory, useParams } from "react-router-dom"
import ConfirmDetail from "./confirmDetail"

export default function Edit() {
  const history = useHistory()
  const { id, type } = useParams<{ id: string, type: "create" | "edit" }>()
  const attchsRef = useRef<AttachmentRef>()
  const confirmRef = useRef<any>()
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
      setConfirmType(result?.confirmType)
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { manual: type === "create", refreshDeps: [id] })

  const { loading: saving, run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
    try {
      const submitData = type === "create" ? postData : { ...postData, id: id }
      const result: { [key: string]: any } = await RequestUtil[type === "create" ? "post" : "put"](`/tower-market/drawingConfirmation`, submitData)
      resole(result)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  }), { manual: true })

  const onSubmit = async (saveType: 1 | 2) => {
    const baseData = await baseForm.validateFields()
    await saveRun({
      ...baseData,
      internalNumber: baseData.internalNumber?.value,
      contractId: baseData.internalNumber?.id,
      serviceManager: baseData.serviceManager?.value,
      serviceManagerId: baseData.serviceManager?.id,
      saveType,
      fileIds: attchsRef.current?.getDataSource().map(item => item.id),
      productAssistDrawDTOS: confirmRef.current?.getDataSource()
    })
    await message.success("保存成功,等待跳转...")
    history.go(-1)
  }

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
    <DetailContent operation={[<Space key="space">
      <Button
        type="primary"
        key="save"
        loading={saving}
        onClick={() => onSubmit(1)}
      >保存</Button>
      <Button
        type="primary"
        key="saveOrSubmit"
        loading={saving}
        onClick={() => onSubmit(2)}
      >保存并发起</Button>
      <Button onClick={() => history.go(-1)}>取消</Button>
    </Space>
    ]}>
      <BaseInfo
        form={baseForm}
        onChange={handleBaseInfoChange}
        columns={setting.map((item: any) => {
          if (item.dataIndex === "confirmType") {
            return ({
              ...item,
              disabled: true
            })
          }
          return item
        })}
        col={3}
        dataSource={{ ...data, confirmType: data?.confirmType || 1 }}
        edit />
      {confirmType === 2 && type === "create" && <ConfirmDetail ref={confirmRef} id={id} type={type} />}
      <Attachment
        title="附件"
        ref={attchsRef}
        dataSource={data?.fileSources}
        edit />
    </DetailContent>
  </Spin>
}