import React from "react";
import moment from "moment";
import { Table } from "antd";
import { withRouter } from "react-router-dom";
import { ContractSummary } from "../../prom/contract/ContractSummary";
import RequestUtil from "../../../utils/RequestUtil";
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions'
import { doNumber } from "../../../utils/KeepDecimals";
const isIta: any = {
  0: "无",
  1: "原件",
  2: "复印件"
}

const taskStatus: any = {
  0: "未下发",
  1: "部分下发",
  2: "已下发"
}

class ManagementContractSummary extends ContractSummary {
  requestPath = "/tower-market/saleOrder";
  getBaseInfoGrid() {
    const baseInfo: any | undefined = this.state.baseInfo;
    return {
      labelCol: {
        span: 4,
      },
      valueCol: {
        span: 8,
      },
      rows: [
        [
          {
            label: "采购订单编号",
            value: baseInfo?.purchaseOrderNumber
          },
          {
            label: "ECP合同编号",
            value: baseInfo?.ecpContractNumber
          }
        ],
        [
          {
            label: "合同编号",
            value: baseInfo?.contractNumber,
          },
          {
            label: "内部合同编号",
            value: baseInfo?.internalNumber,
          },
        ],
        [
          {
            label: "合同/工程名称",
            value: baseInfo?.contractName,
          },
          {
            label: "合同总重(吨)",
            value: baseInfo?.contractTotalWeight,
          },
        ],
        [
          {
            label: "合同单价(元/吨)",
            value: baseInfo?.contractPrice,
          },
          {
            label: "合同总价(元)",
            value: baseInfo?.contractAmount,
          },
        ],
        [
          {
            label: "中标类型",
            value: baseInfo?.winBidTypeName,
          },
          {
            label: "销售类型",
            value: baseInfo?.saleTypeName,
          },
        ],
        [
          {
            label: "业主单位",
            value: baseInfo?.customerInfoVo?.customerCompany,
          },
          {
            label: "业主联系人",
            value: baseInfo?.customerInfoVo?.customerLinkman,
          },
        ],
        [
          {
            label: "业主联系电话",
            value: baseInfo?.customerInfoVo?.customerPhone,
          },
          {
            label: "合同签订单位",
            value: baseInfo?.signCustomerName,
          },
        ],
        [
          {
            label: "付款方式",
            value: baseInfo?.payType ?
              baseInfo?.payType === "1" ?
              "转账" : baseInfo?.payType === "2" ?
              "现金" : baseInfo?.payType === "3" ? 
              "支票" : baseInfo?.payType === "4" ?
              "电汇" : "承兑"
              : "-",
          },
          {
            label: "结算单位",
            value: baseInfo?.payCompanyName,
          },
        ],
        [
          {
            label: "合同签订日期",
            value: baseInfo?.signContractTime,
          },
          {
            label: "签订人",
            value: baseInfo?.signUserName,
          },
        ],
        [
          {
            label: "要求交货日期",
            value: baseInfo?.deliveryTime,
          },
          {
            label: "有无技术协议",
            value: isIta[baseInfo?.isIta || 0],
          },
        ],
        [
          {
            label: "所属区域",
            value: this.state.region?.find((reItem: any) => reItem.code === baseInfo?.region)?.name || baseInfo?.region,
          },
          {
            label: "国家",
            value: baseInfo?.country,
          },
        ],
        [
          {
            label: "合同接管日期",
            value: baseInfo?.takeOverTime ? moment(baseInfo?.takeOverTime).format("YYYY-MM-DD") : "-"
          },
          {
            label: "收到合同形式",
            value: baseInfo?.receivedContractShapeName
          }],
        [
          {
            label: "合同份数",
            value: baseInfo?.contractFraction || 0,
          },
          {
            label: "合同页数",
            value: baseInfo?.contractPage || 0,
          },
        ],
        [
          {
            label: "合同计划状态",
            value: baseInfo?.contractPlanStatusName,
          },
          {
            label: "合同重量与计划重量差值",
            value: baseInfo?.contractWeightDiff
          }
        ],
        [
          {
            label: "交货方式",
            value: baseInfo?.deliveryWayName,
          },
          {
            label: "交货地点",
            value: baseInfo?.deliveryAddress
          }
        ],
        [
          {
            label: "招标批次",
            value: baseInfo?.bidBatch,
          },
          {
            label: "币种",
            value: baseInfo?.currencyTypeName
          }
        ],
        [
          {
            label: "跟单业务员",
            value: baseInfo?.salesman,
          },
          {
            label: "合同接管人",
            value: baseInfo?.takeOverUser,
          },
        ],
        [
          {
            label: "备注",
            value: baseInfo?.description,
          },
          {
            label: "归属业务经理",
            value: baseInfo?.ascriptionName,
          },
        ]
      ],
    };
  }
  getOrderSummariableItems() {
    const orderItems: any[] = this.state.orderItems || [];
    return [
      {
        fieldItems: [],
        render: () => {
          return (
            <Table
              rowKey="index"
              dataSource={orderItems?.map((productVos: any, index: number) => ({
                ...productVos,
                index: index + 1,
              }))}
              pagination={false}
              bordered={true}
              columns={this.getOrderColumns()}
            />
          );
        },
      },
    ];
  }
  getOrderColumns() {
    return [
      {
        title: "订单编号",
        dataIndex: "saleOrderNumber",
      },
      {
        title: "下发状态",
        dataIndex: "taskStatus",
        render: (text: any) => <>{taskStatus[text || 0]}</>
      },
      {
        title: "采购订单号",
        dataIndex: "purchaseOrderNumber",
      },
      {
        title: "订单工程名称",
        dataIndex: "orderProjectName",
      },
      {
        key: "productType",
        title: "产品类型",
        dataIndex: "productType",
        render: (text: any) => <>{productTypeOptions?.find((item: any) => text === item.id)?.name}</>
      },
      {
        key: "voltageGrade",
        title: "电压等级",
        dataIndex: "voltageGrade",
        render: (text: any) => <>{voltageGradeOptions?.find((item: any) => text === item.id)?.name}</>
      },
      {
        title: "含税金额(元)",
        dataIndex: "taxAmount",
        render: (text: any) => <span>{doNumber(text, 4)}</span>
      },
      {
        title: "合同重量(吨)",
        dataIndex: "orderWeight",
        render: (text: any) => <span>{doNumber(text, 4)}</span>
      },
      {
        title: "含税单价(元/吨)",
        dataIndex: "taxPrice",
        render: (text: any) => <span>{doNumber(text, 4)}</span>
      },
      {
        title: "签订日期",
        dataIndex: "signContractTime",
      },
      {
        title: "要求交货日期",
        dataIndex: "deliveryTime",
      },
      {
        title: "业主单位",
        dataIndex: "customerCompany",
      },
      {
        title: "制单人",
        dataIndex: "createUserName",
      },
      {
        title: "制单时间",
        dataIndex: "createTime",
      },
    ];
  }
  public async componentDidMount() {
    const orderItems = await RequestUtil.get<any>(this.requestPath, {
      contractId: this.props.match.params.id,
    });
    const region = await RequestUtil.get<any>("/tower-system/region/00");

    this.setState({
      orderItems: orderItems.records as any[],
      region: region
    });
  }
}

export default withRouter(ManagementContractSummary);
