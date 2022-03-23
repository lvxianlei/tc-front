import React from "react";
import { TableColumnType } from "antd";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { IRenderedGrid } from "../../../utils/SummaryRenderUtil";
import {
  ISaleOrderBaseInfo,
  SaleOrderSummary,
} from "../../prom/order/SaleOrderSummary";
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { doNumber } from "../../../utils/KeepDecimals";
interface ManagementSaleOrderBaseInfo extends ISaleOrderBaseInfo {
  createUser?: number;
  createTime?: string;
  orderWeight?: number;
  productType?: number;
  voltageGrade?: number;
  createUserName?: string;
}

class ManagementSaleOrderSummary extends SaleOrderSummary {
  requestPath = "/tower-market/saleOrder";

  protected getBaseInfoGrid(): IRenderedGrid {
    const baseInfo: ManagementSaleOrderBaseInfo | undefined = this.state
      .baseInfo as ManagementSaleOrderBaseInfo;
    return {
      labelCol: {
        span: 4,
      },
      valueCol: {
        span: 6,
      },
      rows: [
        [
          {
            label: "销售订单编号",
            value: baseInfo?.saleOrderNumber,
          },
          {
            label: "采购订单号",
            value: baseInfo?.purchaseOrderNumber,
          },
        ],
        [
          {
            label: "合同名称",
            value: baseInfo?.contractInfoVo?.contractName,
          },
          {
            label: "订单工程名称",
            value: (baseInfo as any)?.orderProjectName,
          },
        ],
        [
          {
            label: "内部合同编号",
            value: baseInfo?.contractInfoVo?.internalNumber,
          },
          {
            label: "业主单位",
            value: baseInfo?.contractInfoVo?.customerCompany,
          },
        ],
        [
          {
            label: "合同签订单位",
            value: baseInfo?.contractInfoVo?.signCustomerName,
          },
          {
            label: "合同签订日期",
            value: baseInfo?.contractInfoVo?.signContractTime,
          },
        ],
        [
          {
            label: "制单时间",
            value: baseInfo?.createTime,
          },
          {
            label: "合同要求交货日期",
            value: baseInfo?.contractInfoVo?.deliveryTime,
          },
        ],
        [
          {
            label: "制单人",
            value: baseInfo?.createUserName,
          },
          {
            label: "备注",
            value: baseInfo?.description,
          },
        ]
      ],
    };
  }
  protected getAmountInfoGrid(): IRenderedGrid {
    const baseInfo: ManagementSaleOrderBaseInfo | undefined = this.state
      .baseInfo as ManagementSaleOrderBaseInfo;
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
            label: "产品类型",
            value: productTypeOptions?.find((item: any) => baseInfo?.productType === item.id)?.name,
          },
          {
            label: "电压等级",
            value: voltageGradeOptions?.find((item: any) => baseInfo?.voltageGrade === item.id)?.name,
          },
        ],
        [
          {
            label: "订单总重",
            value: doNumber(baseInfo?.orderWeight, 8),
          },
          {
            label: "含税金额",
            value: baseInfo?.taxAmount,
          },
        ],
        [
          {
            label: "含税单价",
            value: baseInfo?.taxPrice,
          },
          {
            label: "不含税金额",
            value: baseInfo?.amount,
          },
        ],
        [
          {
            label: "不含税单价",
            value: baseInfo?.price,
          },
          {
            label: "币种",
            value: baseInfo?.contractInfoVo?.currencyTypeName,
          },
        ],
        [
          {
            label: "税率",
            value: baseInfo?.taxRate === -1 ? undefined : baseInfo?.taxRate,
          },
          {
            label: "汇率",
            value:
              baseInfo?.exchangeRate === -1 ? undefined : baseInfo?.exchangeRate,
          },
        ],
        [
          {
            label: "外汇金额",
            value:
              baseInfo?.foreignExchangeAmount === -1
                ? undefined
                : baseInfo?.foreignExchangeAmount,
          },
          {
            label: "外汇单价",
            value:
              baseInfo?.foreignPrice === -1 ? undefined : baseInfo?.foreignPrice,
          },
        ]
        // [
        //   {
        //     label: "保函金额",
        //     value:
        //       baseInfo?.guaranteeAmount === -1
        //         ? undefined
        //         : baseInfo?.guaranteeAmount,
        //   },
        //   {
        //     label: "佣金",
        //     value:
        //       baseInfo?.commissionCharge === -1
        //         ? undefined
        //         : baseInfo?.commissionCharge,
        //   },
        // ]
      ],
    };
  }
  protected getOrderColumns(): TableColumnType<object>[] {
    return [{
      title: '序号',
      dataIndex: 'index'
    }, {
      title: '状态',
      dataIndex: 'productStatus',
      render: (status: number): React.ReactNode => {
        return (
          <span>{
            status === 0 ? "未下发" :
              status === 1 ? "已下发" :
                "审批中"
          }</span>
        )
      }
    },
    {
      title: "线路名称",
      dataIndex: "lineName",
    },
    {
      title: "杆塔号",
      dataIndex: "productNumber",
    },
    {
      title: "塔型",
      dataIndex: "productCategoryName",
    },
    {
      title: "基数",
      dataIndex: "number",
    },
    {
      title: "产品类型",
      dataIndex: "productTypeName",
    },
    {
      title: "电压等级（KV）",
      dataIndex: "voltageGradeName",
    },
    {
      title: "呼高（m）",
      dataIndex: "productHeight",
    },
    {
      title: "单重（kg）",
      dataIndex: "singleWeight",
    },
    {
      title: "其他重量（kg）",
      dataIndex: "otherWeight",
    },
    {
      title: "总重（kg）",
      dataIndex: "totalWeight",
    },
    {
      title: "备注",
      dataIndex: "description",
    },
    ];
  }
}
export default withRouter(ManagementSaleOrderSummary);
