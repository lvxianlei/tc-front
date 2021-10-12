import React from "react";
import { Button, Spin, Form, message } from "antd"
import { withTranslation } from "react-i18next"
import { withRouter, useHistory } from "react-router-dom";
import { SaleOrderNew } from "../../prom/order/SaleOrderNew";
import { DetailContent, BaseInfo, DetailTitle } from "../../common"
class ManagementSaleOrderNew extends SaleOrderNew {
  protected getReturnPath(): string {
    this.props.history.goBack();
    return "";
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderNew));

// const columns = [
//   {
//     title: "采购订单号",
//     dataIndex: "purchaseOrderNumber"
//   },
//   {
//     title: "关联合同",
//     dataIndex: "contractNumber",
//     rules: [
//       {
//         required: true,
//         message: "请选择关联合同",
//       },
//     ]
//   },
//   {
//     title: "内部合同编号",
//     dataIndex: "internalNumber"
//   },
//   {
//     title: "订单工程名称",
//     dataIndex: "orderProjectName",
//     rules: [
//       {
//         required: true,
//         message: "请输入订单工程名称",
//       },
//     ],
//   },
//   {
//     title: "业主单位",
//     dataIndex: "customerCompany"
//   },
//   {
//     title: "合同签订单位",
//     dataIndex: "signCustomerName"
//   },
//   {
//     title: "合同签订日期",
//     dataIndex: "signContractTime"
//   },
//   {
//     title: "合同要求交货日期",
//     dataIndex: "deliveryTime"
//   },
//   {
//     title: "币种",
//     dataIndex: "currencyType",
//     type: "select"
//   },
//   {
//     title: "订单重量",
//     dataIndex: "orderWeight",
//     type: "number"
//   },
//   {
//     title: "含税金额",
//     dataIndex: "taxAmount",
//     rules: [
//       {
//         required: true,
//         message: "请输入含税金额",
//       },
//     ],
//     type: "number"
//   },
//   {
//     title: "不含税金额",
//     dataIndex: "amount",
//     type: "number"
//   },
//   {
//     title: "含税单价",
//     dataIndex: "taxPrice",
//     rules: [
//       {
//         required: true,
//         message: "请输入含税单价",
//       }
//     ],
//     type: "number"
//   },
//   {
//     title: "不含税单价",
//     dataIndex: "price",
//     type: "number"
//   },
//   {
//     title: "税率",
//     dataIndex: "taxRate",
//     type: "select"
//   },
//   {
//     title: "外汇金额",
//     dataIndex: "foreignExchangeAmount",
//     type: "number"
//   },
//   {
//     title: "汇率",
//     dataIndex: "exchangeRate",
//     type: "number"
//   },
//   {
//     title: "销售类型",
//     dataIndex: "saleType",
//     type: "select"
//   },
//   {
//     title: "外汇单价",
//     dataIndex: "foreignPrice",
//     type: "number"
//   },
//   {
//     title: "保函类型",
//     dataIndex: "guaranteeType"
//   },
//   {
//     title: "销售业务员",
//     dataIndex: "salesman"
//   },
//   {
//     title: "港口费用",
//     dataIndex: "portCharge",
//     type: "number"
//   },
//   {
//     title: "保函金额",
//     dataIndex: "guaranteeAmount",
//     type: "number"
//   },

//   {
//     title: "海运及保险费",
//     dataIndex: "insuranceCharge",
//     type: "number"
//   },
//   {
//     title: "出口信用保险",
//     dataIndex: "creditInsurance",
//     type: "number"
//   },
//   {
//     title: "佣金",
//     dataIndex: "commissionCharge",
//     type: "number"
//   },
//   {
//     title: "备注",
//     dataIndex: "description",
//     type: "textarea"
//   },
// ]

// export default function ManagementSaleOrderNew() {
//   const history = useHistory()
//   const [baseInfoForm] = Form.useForm()
//   const handleSubmit = async () => {
//     try {
//       const baseInfoData = await baseInfoForm.validateFields()

//       // const result = await run({

//       // })
//       // if (result) {
//       //   message.success("保存成功...")
//       //   history.goBack()
//       // }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleBaseInfoChange = () => {

//   }

//   return <DetailContent operation={[
//     <Button
//       key="save"
//       type="primary"
//       onClick={handleSubmit}
//       // loading={saveStatus}
//       style={{ marginRight: 16 }}
//     >保存</Button>,
//     <Button key="cacel" onClick={() => history.goBack()}>取消</Button>
//   ]}>
//     <DetailTitle title="基本信息" />
//     <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={columns} dataSource={{}} edit />
//   </DetailContent>
// }