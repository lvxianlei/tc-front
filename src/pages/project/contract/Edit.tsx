import React, { useRef, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { Button, Form, message, Radio, Spin } from "antd";
import { Attachment, AttachmentRef, BaseInfo, DetailContent, EditableTable, DetailTitle } from "../../common";
import {
  winBidTypeOptions,
  saleTypeOptions,
  contractPlanStatusOptions, // 合同计划状态
  contractFormOptions, // 收到合同形式
  deliverywayOptions, // 交货方式
  currencyTypeOptions, // 币种
  planNameOptions, // 计划名称
} from "../../../configuration/DictionaryOptions";
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";
import { setting, payment } from "./contract.json"
const winBidTypeEnum = winBidTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const saleTypeEnum = saleTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const contractPlanStatusEnum = contractPlanStatusOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const contractFormEnum = contractFormOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const deliverywayEnum = deliverywayOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const currencyTypeEnum = currencyTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const planNameEnum = planNameOptions?.map((item: any) => ({ label: item.name, value: item.id }))
export default function Edit() {
  const history = useHistory()
  const routerMatch = useRouteMatch<{ type: "new" | "edit" }>("/project/management/:type/contract")
  const params = useParams<{ projectId: string, id: string }>()
  const [planType, setPlanType] = useState<1 | 2>(1)
  const [when, setWhen] = useState<boolean>(true)
  const attchmentRef = useRef<AttachmentRef>()
  const [form] = Form.useForm()
  const [editform] = Form.useForm()
  const type = routerMatch?.params?.type
  const { loading: projectLoading, data: projectData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${params.projectId}`)
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { ready: (params.projectId !== "undefined") })

  const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/contract/${params.id}`)
      resole({
        ...result,
        ...result.customerInfoVo,
        payType: result.payType?.split(",") || [],
        customerCompany: {
          value: result.customerInfoVo.customerCompany,
          id: result.customerInfoVo.customerId
        },
        signCustomer: {
          value: result.signCustomerName,
          id: result.signCustomerId
        },
        payCompany: {
          value: result.payCompanyName,
          id: result.payCompanyId
        },
        salesman: {
          value: result.salesman,
          id: result.salesmanId
        },
        ascription: {
          value: result.ascriptionName,
          id: result.ascriptionId
        }
      })
    } catch (error) {
      reject(error)
    }
  }), { manual: !params.id })

  const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
    try {
      const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-market/contract`, {
        ...saveData,
        id: type === "new" ? "" : params.id,
        projectId: params.projectId && params.projectId !== "undefined" ? params.projectId : undefined
      })
      resole(result)
    } catch (error) {
      reject(error)
    }
  }), { manual: true })

  const handleSubmit = async () => {
    const baseInfo = await form.validateFields()
    const editformData = await editform.validateFields()
    const attchs = attchmentRef.current?.getDataSource()
    const {
      totalReturnedRate,
      totalReturnedAmount
    } = (editformData.submit || []).reduce((
      { totalReturnedRate, totalReturnedAmount }: any,
      item: any
    ) => ({
      totalReturnedRate: parseFloat(
        (Number(item.returnedRate || 0) + Number(totalReturnedRate || 0)).toString()
      ).toFixed(2),
      totalReturnedAmount: parseFloat(
        (Number(item.returnedAmount || 0) + Number(totalReturnedAmount || 0)).toString()
      ).toFixed(2)
    }), { totalReturnedRate: 0, totalReturnedAmount: 0 })
    if ((editformData.submit || []).length <= 0) {
      message.error('回款计划无数据，需新增！');
      return
    }
    if (totalReturnedRate !== "100.00") {
      message.error('计划回款总占比必须等于100');
      return
    }
    if (totalReturnedAmount !== parseFloat(baseInfo.contractAmount).toFixed(2)) {
      message.error('计划回款总金额必须等于合同总价');
      return
    }
    const result = await saveRun({
      ...baseInfo,
      signCustomerName: baseInfo.signCustomer.value,
      signCustomerId: baseInfo.signCustomer.id,
      payCompanyName: baseInfo.payCompany.value,
      payCompanyId: baseInfo.payCompany.id,
      salesman: baseInfo.salesman.value,
      salesmanId: baseInfo.salesman.id,
      ascriptionName: baseInfo.ascription.value,
      ascriptionId: baseInfo.ascription.id,
      payType: baseInfo.payType?.join(","),
      planType,
      customerInfoDto: {
        customerCompany: baseInfo.customerCompany.value,
        customerId: baseInfo.customerCompany.id,
        customerLinkman: baseInfo.customerLinkman,
        customerPhone: baseInfo.customerPhone
      },
      paymentPlanDtos: editformData.submit?.map((item: any) => ({
        ...item,
        contractId: params.id
      })),
      fileIds: attchs?.map((item: any) => item.id)
    })
    if (result) {
      setWhen(false)
      message.success("保存成功...")
      history.goBack()
    }
  }

  const handleBaseInfoChange = (fields: { [key: string]: any }, allFields: any) => {
    const { contractAmount, contractTotalWeight, customerCompany } = allFields
    if (fields.contractTotalWeight || fields.contractAmount) {
      const contractPrice = (contractAmount / contractTotalWeight).toFixed(2)
      form.setFieldsValue({ contractPrice })
      if (fields.contractAmount) {
        const editFormData = editform.getFieldsValue()
        editform.setFieldsValue({
          submit: editFormData.submit?.map((item: any) => {
            if (planType === 1) {
              return ({
                ...item,
                returnedAmount: (item.returnedRate * (fields.contractAmount || 0) / 100).toFixed(2)
              })
            }
            if (planType === 2) {
              return ({
                ...item,
                returnedRate: (item.returnedAmount / (fields.contractAmount || 0) * 100).toFixed(2)
              })
            }
            return item
          })
        })
      }
    }
    if (fields.customerCompany) {
      form.setFieldsValue({
        signCustomer: customerCompany,
        payCompany: customerCompany
      })
    }
  }

  const handleEditableChange = (fields: any, allFields: any) => {
    if (fields.submit.length - 1 >= 0) {
      const contractAmount = form.getFieldValue("contractAmount")
      const result = allFields.submit[fields.submit.length - 1];
      if (planType === 1 && (fields.type !== "add")) {
        editform.setFieldsValue({
          submit: allFields.submit.map((item: any) => {
            if (item.id === result.id) {
              return ({
                ...item,
                returnedAmount: (parseFloat(contractAmount || 0) * (result.returnedRate || 0) * 0.01).toFixed(2)
              })
            }
            return item
          })
        })
      }
      if (planType === 2 && (fields.type !== "add")) {
        editform.setFieldsValue({
          submit: allFields.submit.map((item: any) => {
            if (item.id === result.id) {
              return ({
                ...item,
                returnedRate: (parseFloat(contractAmount || 0) / (result.returnedAmount || 0) * 100).toFixed(2)
              })
            }
            return item
          })
        })
      }
    }
  }

  return <DetailContent
    when={when}
    operation={[
      <Button
        key="save"
        type="primary"
        onClick={handleSubmit}
        style={{ marginRight: 16 }}
        loading={saveLoading}
      >保存</Button>,
      <Button key="cacel" onClick={() => history.goBack()}>取消</Button>
    ]}>
    <Spin spinning={loading || projectLoading}>
      <DetailTitle title="基础信息" />
      <BaseInfo
        onChange={handleBaseInfoChange}
        columns={[...setting.map((item: any) => {
          switch (item.dataIndex) {
            case "winBidType":
              return ({ ...item, enum: winBidTypeEnum })
            case "saleType":
              return ({ ...item, enum: saleTypeEnum })
            case "contractPlanStatus":
              return ({ ...item, enum: contractPlanStatusEnum })
            case "receivedContractShape":
              return ({ ...item, enum: contractFormEnum })
            case "deliveryWay":
              return ({ ...item, enum: deliverywayEnum })
            case "currencyType":
              return ({ ...item, enum: currencyTypeEnum })
            case "country":
              return ({ ...item, hidden: projectData?.address !== "其他-国外" })
            default:
              return item
          }
        })]}
        form={form}
        dataSource={{
          ...data,
          bidBatch: projectData?.bidBatch,
          region: projectData?.address === "其他-国外" ? projectData.address : ((!projectData?.bigRegion && !projectData?.address) ? "" : `${projectData.bigRegion || ""}-${projectData.address || ""}`),
          country: projectData?.country || ""
        } || {
          region: projectData?.address === "其他-国外" ? projectData.address : ((!projectData?.bigRegion && !projectData?.address) ? "" : `${projectData.bigRegion || ""}-${projectData.address || ""}`),
          country: projectData?.country || ""
        }}
        edit />
      <DetailTitle title="回款计划" />
      <EditableTable
        haveIndex={false}
        addData={(data: any) => ({
          period: (data?.[0]?.period || 0) + 1,
          returnedAmount: 0.00,
          returnedRate: 0.00
        })}
        opration={[
          <Radio.Group
            defaultValue={planType}
            key="type"
            onChange={(event: any) => setPlanType(event.target.value)}
            options={[
              { label: "按占比", value: 1 },
              { label: "按金额", value: 2 }
            ]} />
        ]}
        form={editform}
        onChange={handleEditableChange}
        columns={[...payment.map(item => {
          if (item.dataIndex === "returnedAmount") {
            return ({
              ...item,
              disabled: planType === 1
            })
          }
          if (item.dataIndex === "returnedRate") {
            return ({
              ...item,
              disabled: planType === 2
            })
          }
          if (item.dataIndex === "name") {
            return ({
              ...item,
              enum: planNameEnum
            })
          }
          return item
        })]}
        dataSource={data?.paymentPlanVos || []} />
      <Attachment ref={attchmentRef} dataSource={data?.attachVos || []} edit />
    </Spin>
  </DetailContent>
}