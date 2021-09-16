import React from "react";
import { Input, Select, InputNumber } from "antd";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ContractSelectionComponent from "../../../components/ContractSelectionModal";
import {
  currencyTypeOptions,
  taxRateOptions,
} from "../../../configuration/DictionaryOptions";
import { IFormItemGroup } from "../../entrust/EntrustDetail";
import {
  ISaleOrder,
  ChargeType,
} from "../../prom/order/AbstractSaleOrderSetting";
import { SaleOrderSetting } from "../../prom/order/SaleOrderSetting";
import layoutStyles from "../../../layout/Layout.module.less";

export interface ManagementSaleOrder extends ISaleOrder {
  orderWeight?: number;
}

class ManagementSaleOrderSetting extends SaleOrderSetting {
  requestPath = "/saleOrder";
  public getFormItemGroups(): IFormItemGroup[][] {
    const saleOrder: ManagementSaleOrder | undefined = this.state
      .saleOrder as ManagementSaleOrder;
    const orderQuantity: number | undefined = this.state.orderQuantity;
    const setting: boolean | undefined = this.state?.isSetting;
    return [
      [
        {
          title: "基础信息",
          itemCol: {
            span: 8,
          },
          itemProps: [
            {
              label: "采购订单号",
              name: "purchaseOrderNumber",
              initialValue: saleOrder?.purchaseOrderNumber,
              children: <Input maxLength={50} />,
            },
            {
              label: "关联合同",
              name: "contractNumber",
              initialValue: saleOrder?.contractInfoDto?.contractNumber,
              rules: [
                {
                  required: true,
                  message: "请选择关联合同",
                },
              ],
              children: (
                <>
                  {setting ? (
                    <Input
                      value={saleOrder?.contractInfoDto?.contractNumber}
                      disabled
                    />
                  ) : (
                    <Input
                      value={saleOrder?.contractInfoDto?.contractNumber}
                      suffix={
                        <ContractSelectionComponent
                          onSelect={this.onSelect}
                          selectKey={[saleOrder?.contractInfoDto?.contractId]}
                          status={1}
                        />
                      }
                    />
                  )}
                </>
              ),
            },
            {
              label: "内部合同编号",
              name: "internalNumber",
              initialValue: saleOrder?.contractInfoDto?.internalNumber,
              children: <Input disabled />,
            },
            {
              label: "订单工程名称",
              name: "projectName",
              initialValue: saleOrder?.contractInfoDto?.projectName,
              children: <Input />,
            },
            {
              label: "业主单位",
              name: "customerCompany",
              initialValue: saleOrder?.contractInfoDto?.customerCompany,
              children: <Input disabled />,
            },
            {
              label: "合同签订单位",
              name: "signCustomerName",
              initialValue: saleOrder?.contractInfoDto?.signCustomerName,
              children: <Input disabled />,
            },
            {
              label: "合同签订日期",
              name: "signContractTime",
              initialValue: saleOrder?.contractInfoDto?.signContractTime,
              children: <Input disabled />,
            },
            {
              label: "合同要求交货日期",
              name: "deliveryTime",
              initialValue: saleOrder?.contractInfoDto?.deliveryTime,
              children: <Input disabled />,
            },
            {
              label: "币种",
              name: "currencyType",
              initialValue:
                saleOrder?.contractInfoDto?.currencyType ||
                (currencyTypeOptions &&
                  currencyTypeOptions.length > 0 &&
                  currencyTypeOptions[0].id),
              children: (
                <Select disabled>
                  {currencyTypeOptions &&
                    currencyTypeOptions.map(({ id, name }, index) => {
                      return (
                        <Select.Option key={index} value={id}>
                          {name}
                        </Select.Option>
                      );
                    })}
                </Select>
              ),
            },
            {
              label: "订单重量",
              name: "orderWeight",
              initialValue: saleOrder?.orderWeight,
              children: <Input disabled suffix={"吨"} />,
            },
            {
              label: "含税金额",
              name: "taxAmount",
              initialValue: saleOrder?.taxAmount,
              rules: [
                {
                  required: true,
                  message: "请输入含税金额",
                },
              ],
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  disabled={
                    saleOrder?.contractInfoDto?.chargeType ===
                    ChargeType.UNIT_PRICE
                  }
                  onChange={this.amountBlur}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "不含税金额",
              name: "amount",
              initialValue:
                saleOrder?.amount === 0 ? undefined : saleOrder?.amount,
              children: <Input prefix="￥" disabled />,
            },
            {
              label: "含税单价",
              name: "taxPrice",
              initialValue: saleOrder?.taxPrice,
              children: <Input prefix="￥" />,
            },
            {
              label: "不含税单价",
              name: "price",
              initialValue:
                saleOrder?.price === 0 ? undefined : saleOrder?.price,
              children: <Input prefix="￥" />,
            },
            {
              label: "税率",
              name: "taxRate",
              initialValue:
                saleOrder?.taxRate === -1 ? undefined : saleOrder?.taxRate,
              children: (
                <Select
                  showSearch
                  onSearch={this.addNewOption}
                  onChange={this.getAmount}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {this.state.newOption ? (
                    <Select.Option
                      key={this.state.newOption.value}
                      value={this.state.newOption.label}
                    >
                      {this.state.newOption.value}
                    </Select.Option>
                  ) : (
                    ""
                  )}
                  {taxRateOptions &&
                    taxRateOptions.map(({ id, name }, index) => {
                      return (
                        <Select.Option key={index} value={name}>
                          {name}
                        </Select.Option>
                      );
                    })}
                </Select>
              ),
            },
            {
              label: "外汇金额",
              name: "foreignExchangeAmount",
              initialValue:
                saleOrder?.foreignExchangeAmount === -1
                  ? undefined
                  : saleOrder?.foreignExchangeAmount,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={2}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "汇率",
              name: "exchangeRate",
              initialValue:
                saleOrder?.exchangeRate === -1
                  ? undefined
                  : saleOrder?.exchangeRate,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  className={layoutStyles.width100}
                />
              ),
            },
            // 销售类型
            {
              label: "外汇单价",
              name: "foreignPrice",
              initialValue:
                saleOrder?.foreignPrice === -1
                  ? undefined
                  : saleOrder?.foreignPrice,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "保函类型",
              name: "guaranteeType",
              initialValue:
                saleOrder?.guaranteeType === "-1"
                  ? undefined
                  : saleOrder?.guaranteeType,
              children: (
                <Input maxLength={50} className={layoutStyles.width100} />
              ),
            },
            //   销售业务员
            {
              label: "港口费用",
              name: "portCharge",
              initialValue:
                saleOrder?.portCharge === -1 ? undefined : saleOrder?.portCharge,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "保函金额",
              name: "guaranteeAmount",
              initialValue:
                saleOrder?.guaranteeAmount === -1
                  ? undefined
                  : saleOrder?.guaranteeAmount,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={2}
                  className={layoutStyles.width100}
                />
              ),
            },

            {
              label: "海运及保险费",
              name: "insuranceCharge",
              initialValue:
                saleOrder?.insuranceCharge === -1
                  ? undefined
                  : saleOrder?.insuranceCharge,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "出口信用保险",
              name: "creditInsurance",
              initialValue:
                saleOrder?.creditInsurance === -1
                  ? undefined
                  : saleOrder?.creditInsurance,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "佣金",
              name: "commissionCharge",
              initialValue:
                saleOrder?.commissionCharge === -1
                  ? undefined
                  : saleOrder?.commissionCharge,
              children: (
                <InputNumber
                  min="0"
                  step="0.0001"
                  stringMode={false}
                  precision={4}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "备注",
              name: "description",
              initialValue: saleOrder?.description,
              children: (
                <Input.TextArea
                  rows={5}
                  showCount={true}
                  maxLength={300}
                  placeholder="请输入备注信息"
                />
              ),
            },
          ],
        },
      ],
    ];
  }
  protected getReturnPath(): string {
    this.props.history.goBack();
    return "";
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderSetting));
