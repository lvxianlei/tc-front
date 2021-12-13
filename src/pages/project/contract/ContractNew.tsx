import React from "react";
import { Input, Select, DatePicker, Cascader, InputNumber } from "antd";
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";
import moment from "moment";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ClientSelectionComponent from "../../../components/ClientSelectionModal";
import {
  winBidTypeOptions,
  saleTypeOptions,
  currencyTypeOptions,
} from "../../../configuration/DictionaryOptions";
import { ContractNew } from "../../prom/contract/ContractNew";
import layoutStyles from "../../../layout/Layout.module.less";
import { IFormItemGroup } from "../../../components/AbstractFillableComponent";
import { ProjectContractInfo } from "../../prom/contract/AbstractContractSetting";

class ManagementContractNew extends ContractNew {
  public getFormItemGroups(): IFormItemGroup[][] {
    const contract = this.state.contract as ProjectContractInfo | undefined;
    return this.state.region === "其他-国外" ? [
      [
        {
          title: "基础信息",
          itemCol: {
            span: 8,
          },
          itemProps: [
            {
              label: "采购订单编号",
              name: "purchaseOrderNumber",
              initialValue: contract?.purchaseOrderNumber,
              children: (
                <Input value={contract?.contractNumber} maxLength={50} />
              ),
            },
            {
              label: "ECP合同编号",
              name: "ecpContractNumber",
              initialValue: contract?.ecpContractNumber,
              children: <Input placeholder="请输入ECP合同编号" />,
            },
            {
              label: "合同编号",
              name: "contractNumber",
              initialValue: contract?.contractNumber,
              rules: [
                {
                  required: true,
                  message: "请输入合同编号"
                },
              ],
              children: (
                <Input value={contract?.contractNumber} maxLength={50} />
              ),
            },
            {
              label: "内部合同编号",
              name: "internalNumber",
              initialValue: contract?.internalNumber,
              children: <Input placeholder="内部合同编号自动生成" disabled />,
            },
            {
              label: "合同/工程名称",
              name: "contractName",
              initialValue: contract?.contractName,
              rules: [
                {
                  required: true,
                  message: "请输入合同/工程名称",
                },
              ],
              children: <Input maxLength={100} />,
            },
            {
              label: "合同总重(吨)",
              name: "contractTotalWeight",
              initialValue: contract?.contractTotalWeight,
              rules: [
                {
                  required: true,
                  message: "请输入合同总重(吨)",
                },
              ],
              children: (
                <InputNumber
                  min="0"
                  stringMode={false}
                  className={layoutStyles.width100}
                  onChange={() => this.onContractTotalWeightChange()}
                />
              ),
            },
            {
              label: "合同单价(元/吨)",
              name: "contractPrice",
              initialValue: contract?.contractPrice,
              rules: [
                {
                  required: false,
                  message: "请输入合同单价(元/吨)",
                },
              ],
              children: (
                <InputNumber
                  min="0.01"
                  disabled
                  max="10000000000.00"
                  step="0.01"
                  stringMode={false}
                  precision={2}
                  prefix="￥"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "合同总价(元)",
              name: "contractAmount",
              initialValue: contract?.contractAmount,
              rules: [
                {
                  required: true,
                  message: "请输入合同总价(元)",
                },
              ],
              children: (
                <InputNumber
                  min="0.01"
                  max="999999999999.00"
                  step="0.01"
                  stringMode={false}
                  precision={2}
                  prefix="￥"
                  onChange={() => this.contractAmountBlur()}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "中标类型",
              name: "winBidType",
              initialValue: contract?.winBidType,
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {winBidTypeOptions &&
                    winBidTypeOptions.map(({ id, name }, index) => {
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
              label: "销售类型",
              name: "saleType",
              initialValue: contract?.saleType,
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {saleTypeOptions &&
                    saleTypeOptions.map(({ id, name }, index) => {
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
              label: "业主单位",
              name: "customerCompany",
              initialValue: contract?.customerInfoDto?.customerCompany,
              rules: [
                {
                  required: true,
                  message: "请选择业主单位",
                },
              ],
              children: (
                <>
                  <Input
                    value={contract?.customerInfoDto?.customerCompany}
                    suffix={
                      <ClientSelectionComponent
                        onSelect={this.onCustomerCompanySelect}
                        selectKey={[contract?.customerInfoDto?.customerId]}
                        id="1"
                      />
                    }
                  />
                </>
              ),
            },
            {
              label: "业主联系人",
              name: "customerLinkman",
              initialValue: contract?.customerInfoDto?.customerLinkman,
              children: (
                <Input
                  value={contract?.customerInfoDto?.customerLinkman}
                  maxLength={30}
                />
              ),
            },
            {
              label: "业主联系电话",
              name: "customerPhone",
              initialValue: contract?.customerInfoDto?.customerPhone,
              children: (
                <Input
                  value={contract?.customerInfoDto?.customerPhone}
                  maxLength={30}
                />
              ),
            },
            {
              label: "合同签订单位",
              name: "signCustomerName",
              initialValue: contract?.signCustomerName,
              rules: [
                {
                  required: true,
                  message: "请选择合同签订单位",
                },
              ],
              children: (
                <>
                  <Input
                    value={contract?.signCustomerName}
                    suffix={
                      <ClientSelectionComponent
                        onSelect={this.onCustomerNameSelect}
                        selectKey={[contract?.signCustomerId]}
                        id="2"
                      />
                    }
                  />
                </>
              ),
            },
            {
              label: "付款方式",
              name: "customerPhone",
              initialValue: contract?.customerInfoVo?.customerPhone,
              children: (
                <>
                  <Select
                    value={contract?.customerInfoVo?.customerPhone}
                  >
                    <Select.Option value="1">转账</Select.Option>
                    <Select.Option value="2">现金</Select.Option>
                    <Select.Option value="3">支票</Select.Option>
                    <Select.Option value="4">电汇</Select.Option>
                    <Select.Option value="5">承兑</Select.Option>
                  </Select>
                </>
              ),
            },
            {
              label: "结算单位",
              name: "payCompanyName",
              initialValue: contract?.payCompanyName,
              rules: [
                {
                  required: true,
                  message: "请选择结算单位",
                },
              ],
              children: (
                <>
                  <Input
                    value={contract?.payCompanyName}
                    suffix={
                      <ClientSelectionComponent
                        onSelect={this.onPayCompanyNameSelect}
                        selectKey={[contract?.signCustomerId]}
                      />
                    }
                  />
                </>
              ),
            },
            {
              label: "合同签订日期",
              name: "signContractTime",
              initialValue: contract?.signContractTime
                ? moment(contract?.signContractTime)
                : "",
              rules: [
                {
                  required: true,
                  message: "请选择合同签订日期",
                },
              ],
              children: (
                <DatePicker
                  format="YYYY-MM-DD"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "签订人",
              name: "signUserName",
              initialValue: contract?.signUserName,
              rules: [
                {
                  required: true,
                  message: "请输入签订人",
                },
              ],
              children: <Input maxLength={20} />,
            },
            {
              label: "要求交货日期",
              name: "deliveryTime",
              initialValue: contract?.deliveryTime
                ? moment(contract?.deliveryTime)
                : "",
              rules: [
                {
                  required: true,
                  message: "请选择要求交货日期",
                },
              ],
              children: (
                <DatePicker
                  format="YYYY-MM-DD"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "有无技术协议",
              name: "isIta",
              initialValue: contract?.isIta,
              rules: [
                {
                  required: true,
                  message: "请选择技术协议",
                },
              ],
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Select.Option value={0}>无</Select.Option>
                  <Select.Option value={1}>原件</Select.Option>
                  <Select.Option value={2}>复印件</Select.Option>
                </Select>
              ),
            },
            {
              label: "所属区域",
              name: "region",
              initialValue: contract?.region,
              rules: [
                {
                  required: true,
                  message: "请选择所属区域",
                },
                {
                  validator: (
                    rule: RuleObject,
                    value: StoreValue,
                    callback: (error?: string) => void
                  ) => {
                    if (value.length >= 1) {
                      callback();
                    } else {
                      callback("所属区域需选择到省级");
                    }
                  },
                },
              ],
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={
                    this.getForm()?.getFieldValue("countryCode") === 1 ||
                    contract?.countryCode === 1
                  }
                  onChange={this.regionChange.bind(this)}
                >
                  {this.state.regionInfoData?.map((opt: any) => {
                    return (
                      <Select.Option key={opt.code} value={opt.code}>
                        {opt.name}
                      </Select.Option>
                    );
                  })}
                  <Select.Option value="其他-国外">其他-国外</Select.Option>
                </Select>
              ),
            },
            {
              label: "国家",
              name: "regionOther",
              initialValue: contract?.regionOther,
              children: (<Input value={contract?.regionOther} />),
            },
            {
              label: "销售业务员",
              name: "salesman",
              rules: [
                {
                  required: true,
                  message: "请输入销售业务员",
                },
              ],
              initialValue: contract?.salesman,
              children: (<Input value={contract?.salesman} />),
            },
            {
              label: "合同接管人",
              name: "takeOverUser",
              initialValue: contract?.takeOverUser,
              children: (<Input value={contract?.takeOverUser} />),
            },
            {
              label: "合同接管日期",
              name: "takeOverTime",
              initialValue: contract?.takeOverTime,
              children: (
                <DatePicker
                  format="YYYY-MM-DD"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "是否收到合同原件",
              name: "isReceivedContract",
              initialValue: contract?.isReceivedContract || 0,
              children: (
                <Select value={contract?.isReceivedContract}
                >
                  <Select.Option value={0}>是</Select.Option>
                  <Select.Option value={1}>否</Select.Option>
                </Select>
              ),
            }
          ],
        },
      ],
    ] : [
      [
        {
          title: "基础信息",
          itemCol: {
            span: 8,
          },
          itemProps: [
            {
              label: "采购订单编号",
              name: "purchaseOrderNumber",
              initialValue: contract?.purchaseOrderNumber,
              children: (
                <Input value={contract?.contractNumber} maxLength={50} />
              ),
            },
            {
              label: "ECP合同编号",
              name: "ecpContractNumber",
              initialValue: contract?.ecpContractNumber,
              children: <Input placeholder="请输入ECP合同编号" />,
            },
            {
              label: "合同编号",
              name: "contractNumber",
              initialValue: contract?.contractNumber,
              rules: [
                {
                  required: true,
                  message: "请输入合同编号"
                },
              ],
              children: (
                <Input value={contract?.contractNumber} maxLength={50} />
              ),
            },
            {
              label: "内部合同编号",
              name: "internalNumber",
              initialValue: contract?.internalNumber,
              children: <Input placeholder="内部合同编号自动生成" disabled />,
            },
            {
              label: "合同/工程名称",
              name: "contractName",
              initialValue: contract?.contractName,
              rules: [
                {
                  required: true,
                  message: "请输入合同/工程名称",
                },
              ],
              children: <Input maxLength={100} />,
            },
            {
              label: "合同总重(吨)",
              name: "contractTotalWeight",
              initialValue: contract?.contractTotalWeight,
              rules: [
                {
                  required: true,
                  message: "请输入合同总重(吨)",
                },
              ],
              children: (
                <InputNumber
                  min="0"
                  stringMode={false}
                  className={layoutStyles.width100}
                  onChange={() => this.onContractTotalWeightChange()}
                />
              ),
            },
            {
              label: "合同单价(元/吨)",
              name: "contractPrice",
              initialValue: contract?.contractPrice,
              rules: [
                {
                  required: false,
                  message: "请输入合同单价(元/吨)",
                },
              ],
              children: (
                <InputNumber
                  min="0.01"
                  disabled
                  max="10000000000.00"
                  step="0.01"
                  stringMode={false}
                  precision={2}
                  prefix="￥"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "合同总价(元)",
              name: "contractAmount",
              initialValue: contract?.contractAmount,
              rules: [
                {
                  required: true,
                  message: "请输入合同总价(元)",
                },
              ],
              children: (
                <InputNumber
                  min="0.01"
                  max="999999999999.00"
                  step="0.01"
                  stringMode={false}
                  precision={2}
                  prefix="￥"
                  onChange={() => this.contractAmountBlur()}
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "中标类型",
              name: "winBidType",
              initialValue: contract?.winBidType,
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {winBidTypeOptions &&
                    winBidTypeOptions.map(({ id, name }, index) => {
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
              label: "销售类型",
              name: "saleType",
              initialValue: contract?.saleType,
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {saleTypeOptions &&
                    saleTypeOptions.map(({ id, name }, index) => {
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
              label: "业主单位",
              name: "customerCompany",
              initialValue: contract?.customerInfoDto?.customerCompany,
              rules: [
                {
                  required: true,
                  message: "请选择业主单位",
                },
              ],
              children: (
                <>
                  <Input
                    value={contract?.customerInfoDto?.customerCompany}
                    suffix={
                      <ClientSelectionComponent
                        onSelect={this.onCustomerCompanySelect}
                        selectKey={[contract?.customerInfoDto?.customerId]}
                        id="1"
                      />
                    }
                  />
                </>
              ),
            },
            {
              label: "业主联系人",
              name: "customerLinkman",
              initialValue: contract?.customerInfoDto?.customerLinkman,
              children: (
                <Input
                  value={contract?.customerInfoDto?.customerLinkman}
                  maxLength={30}
                />
              ),
            },
            {
              label: "业主联系电话",
              name: "customerPhone",
              initialValue: contract?.customerInfoDto?.customerPhone,
              children: (
                <Input
                  value={contract?.customerInfoDto?.customerPhone}
                  maxLength={30}
                />
              ),
            },
            {
              label: "合同签订单位",
              name: "signCustomerName",
              initialValue: contract?.signCustomerName,
              rules: [
                {
                  required: true,
                  message: "请选择合同签订单位",
                },
              ],
              children: (
                <>
                  <Input
                    value={contract?.signCustomerName}
                    suffix={
                      <ClientSelectionComponent
                        onSelect={this.onCustomerNameSelect}
                        selectKey={[contract?.signCustomerId]}
                        id="2"
                      />
                    }
                  />
                </>
              ),
            },
            {
              label: "付款方式",
              name: "customerPhone",
              initialValue: contract?.customerInfoVo?.customerPhone,
              children: (
                <>
                  <Select
                    value={contract?.customerInfoVo?.customerPhone}
                  >
                    <Select.Option value="1">转账</Select.Option>
                    <Select.Option value="2">现金</Select.Option>
                    <Select.Option value="3">支票</Select.Option>
                    <Select.Option value="4">电汇</Select.Option>
                    <Select.Option value="5">承兑</Select.Option>
                  </Select>
                </>
              ),
            },
            {
              label: "结算单位",
              name: "payCompanyName",
              initialValue: contract?.payCompanyName,
              rules: [
                {
                  required: true,
                  message: "请选择结算单位",
                },
              ],
              children: (
                <>
                  <Input
                    value={contract?.payCompanyName}
                    suffix={
                      <ClientSelectionComponent
                        onSelect={this.onPayCompanyNameSelect}
                        selectKey={[contract?.signCustomerId]}
                      />
                    }
                  />
                </>
              ),
            },
            {
              label: "合同签订日期",
              name: "signContractTime",
              initialValue: contract?.signContractTime
                ? moment(contract?.signContractTime)
                : "",
              rules: [
                {
                  required: true,
                  message: "请选择合同签订日期",
                },
              ],
              children: (
                <DatePicker
                  format="YYYY-MM-DD"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "签订人",
              name: "signUserName",
              initialValue: contract?.signUserName,
              rules: [
                {
                  required: true,
                  message: "请输入签订人",
                },
              ],
              children: <Input maxLength={20} />,
            },
            {
              label: "要求交货日期",
              name: "deliveryTime",
              initialValue: contract?.deliveryTime
                ? moment(contract?.deliveryTime)
                : "",
              rules: [
                {
                  required: true,
                  message: "请选择要求交货日期",
                },
              ],
              children: (
                <DatePicker
                  format="YYYY-MM-DD"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "有无技术协议",
              name: "isIta",
              initialValue: contract?.isIta,
              rules: [
                {
                  required: true,
                  message: "请选择技术协议",
                },
              ],
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Select.Option value={0}>无</Select.Option>
                  <Select.Option value={1}>原件</Select.Option>
                  <Select.Option value={2}>复印件</Select.Option>
                </Select>
              ),
            },
            {
              label: "所属区域",
              name: "region",
              initialValue: contract?.region,
              rules: [
                {
                  required: true,
                  message: "请选择所属区域",
                },
                {
                  validator: (
                    rule: RuleObject,
                    value: StoreValue,
                    callback: (error?: string) => void
                  ) => {
                    if (value.length >= 1) {
                      callback();
                    } else {
                      callback("所属区域需选择到省级");
                    }
                  },
                },
              ],
              children: (
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={
                    this.getForm()?.getFieldValue("countryCode") === 1 ||
                    contract?.countryCode === 1
                  }
                  onChange={this.regionChange.bind(this)}
                >
                  {this.state.regionInfoData?.map((opt: any) => {
                    return (
                      <Select.Option key={opt.code} value={opt.code}>
                        {opt.name}
                      </Select.Option>
                    );
                  })}
                  <Select.Option value="其他-国外">其他-国外</Select.Option>
                </Select>
              ),
            },
            {
              label: "销售业务员",
              name: "salesman",
              rules: [
                {
                  required: true,
                  message: "请输入销售业务员",
                },
              ],
              initialValue: contract?.salesman,
              children: (<Input value={contract?.salesman} />),
            },
            {
              label: "合同接管人",
              name: "takeOverUser",
              initialValue: contract?.takeOverUser,
              children: (<Input value={contract?.takeOverUser} />),
            },
            {
              label: "合同接管日期",
              name: "takeOverTime",
              initialValue: contract?.takeOverTime,
              children: (
                <DatePicker
                  format="YYYY-MM-DD"
                  className={layoutStyles.width100}
                />
              ),
            },
            {
              label: "是否收到合同原件",
              name: "isReceivedContract",
              initialValue: contract?.isReceivedContract || 0,
              children: (
                <Select value={contract?.isReceivedContract}
                >
                  <Select.Option value={0}>是</Select.Option>
                  <Select.Option value={1}>否</Select.Option>
                </Select>
              ),
            }
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

export default withRouter(withTranslation()(ManagementContractNew));
