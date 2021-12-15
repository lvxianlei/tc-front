import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle, Attachment, AttachmentRef } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"

import {drawingConfiremationitem} from './Drawingdata.json'


export default function Drawingnew(): JSX.Element {
  const history = useHistory()
  const attachRef = useRef<AttachmentRef>()
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
  }),{})


  const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.put(`/drawingConfirmation`, postData)
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

  const handleBaseInfoChange =()=>{

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
        <DetailTitle title="图纸确认任务" />
        <BaseInfo
          onChange={handleBaseInfoChange}
          form={baseInfoForm}
          columns={
            drawingConfiremationitem
          } 
          dataSource={data || {}} edit />
        <Attachment edit ref={attachRef} />
      </Spin>
    </DetailContent>
  </>
}