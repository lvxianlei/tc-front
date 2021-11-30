import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, Attachment, AttachmentRef } from '../common'
import { baseInfoData, cargoVOListColumns } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
export default function BaseInfoEdit(): JSX.Element {
  const history = useHistory()
  const attachRef = useRef<AttachmentRef>()
  const [address, setAddress] = useState<string>("")
  const [baseInfoForm] = Form.useForm()
  const [cargoVOListForm] = Form.useForm()

  const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    try {
      const addressList: any[] = await RequestUtil.get(`/tower-system/region/00`)
      resole({ addressList: [...addressList.map(item => ({ value: item.name, label: item.name })), { value: "其他-国外", label: "其他-国外" }] })
      baseInfoForm.setFieldsValue({})
    } catch (error) {
      reject(error)
    }
  }))

  const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/projectInfo`, postData)
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
        fileIds: attachRef.current?.getDataSource().map(item => item.id),
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

  const handleBaseInfoChange = async (fields: any) => {
    if (fields.address) {
      const formData = await baseInfoForm.getFieldsValue()
      setAddress(fields.address)
      data && (data.projectLeaderId = formData.projectLeader?.id)
      baseInfoForm.setFieldsValue({
        ...formData,
        projectLeader: formData.projectLeader?.value || formData.projectLeader,
        biddingPerson: formData.biddingPerson?.value || formData.biddingPerson,
        biddingAgency: formData.biddingAgency?.value || formData.biddingAgency
      })
    }
  }

  return <>
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
              baseInfoData.map((item: any) => item.dataIndex === "address" ? ({ ...item, type: "select", enum: data?.addressList }) : item) :
              baseInfoData.map((item: any) => item.dataIndex === "address" ? ({ ...item, type: "select", enum: data?.addressList }) : item).filter((item: any) => item.dataIndex !== "country")
          } dataSource={data || {}} edit />
        <DetailTitle title="物资清单" />
        <EditTable form={cargoVOListForm} columns={cargoVOListColumns} dataSource={data?.cargoVOList} />
        <Attachment edit ref={attachRef} />
      </Spin>
    </DetailContent>
  </>
}