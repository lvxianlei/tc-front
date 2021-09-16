import React from "react";
import { Table } from "antd";
import { withRouter } from "react-router-dom";
import { IRenderdSummariableItem } from "../../../utils/SummaryRenderUtil";
import {
  ContractSummary,
  IOrderItem,
} from "../../prom/contract/ContractSummary";
import { IProduct } from "../../IProduct";
import RequestUtil from "../../../utils/RequestUtil";

class ManagementContractSummary extends ContractSummary {
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
            label: "合同名称",
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
            value: baseInfo?.isIta,
          },
        ],
        [
          {
            label: "所属区域",
            value: baseInfo?.region,
          },
          {
            label: "销售员",
            value: baseInfo?.salesman,
          },
        ],
        [
          {
            label: "备注",
            value: baseInfo?.description,
          },
        ],
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
      },
      {
        title: "采购订单号",
        dataIndex: "saleOrderNumber",
      },
      {
        title: "订单工程名称",
        dataIndex: "orderProjectName",
      },
      {
        title: "含税金额(元)",
        dataIndex: "taxAmount",
      },
      {
        title: "合同重量(吨)",
        dataIndex: "orderWeight",
      },
      {
        title: "含税单价(元/吨)",
        dataIndex: "taxPrice",
      },
      {
        title: "签订日期",
        dataIndex: "signContractTime	",
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
        dataIndex: "createUser",
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

    this.setState({
      orderItems: orderItems.records as any[],
    });
  }
}

export default withRouter(ManagementContractSummary);
