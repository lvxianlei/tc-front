import { TableColumnType } from "antd";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { IRenderedGrid } from "../../../utils/SummaryRenderUtil";
import {
  ISaleOrderBaseInfo,
  SaleOrderSummary,
} from "../../prom/order/SaleOrderSummary";

interface ManagementSaleOrderBaseInfo extends ISaleOrderBaseInfo {
  createUser?: number;
  createTime?: string;
  orderWeight?: number;
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
        span: 8,
      },
      rows: [
        [
          {
            label: "订单编号",
            value: baseInfo?.saleOrderNumber,
          },
          {
            label: "采购订单号",
            value: baseInfo?.purchaseOrderNumber,
          },
        ],
        [
          {
            label: "关联合同",
            value: baseInfo?.contractInfoVo?.internalNumber,
          },
          {
            label: "订单工程名称",
            value: baseInfo?.contractInfoVo?.projectName,
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
            label: "签订人",
            value: baseInfo?.contractInfoVo?.signUserName,
          },
          {
            label: "合同要求交货日期",
            value: baseInfo?.contractInfoVo?.deliveryTime,
          },
        ],
        [
          {
            label: "订单交货日期",
            value: baseInfo?.orderDeliveryTime,
          },
          {
            label: "备注",
            value: baseInfo?.description,
          },
        ],
        [
          {
            label: "制单人",
            value: baseInfo?.createUser,
          },
          {
            label: "制单时间",
            value: baseInfo?.createTime,
          },
        ],
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
            label: "订单总重",
            value: baseInfo?.orderWeight,
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
        ],
        [
          {
            label: "保函类型",
            value:
              baseInfo?.guaranteeType === "-1"
                ? undefined
                : baseInfo?.guaranteeType,
          },
          {
            label: "保函金额",
            value:
              baseInfo?.guaranteeAmount === -1
                ? undefined
                : baseInfo?.guaranteeAmount,
          },
        ],
        [
          {
            label: "海运及保险费",
            value:
              baseInfo?.insuranceCharge === -1
                ? undefined
                : baseInfo?.insuranceCharge,
          },
          {
            label: "港口费用",
            value:
              baseInfo?.portCharge === -1 ? undefined : baseInfo?.portCharge,
          },
        ],
        [
          {
            label: "出口信用保险",
            value:
              baseInfo?.creditInsurance === -1
                ? undefined
                : baseInfo?.creditInsurance,
          },
          {
            label: "佣金",
            value:
              baseInfo?.commissionCharge === -1
                ? undefined
                : baseInfo?.commissionCharge,
          },
        ],
      ],
    };
  }
  protected getOrderColumns(): TableColumnType<object>[] {
    const productStatus: any = {
      0: "未下发",
      1: "已下发"
    }
    return [{
      title: '序号',
      dataIndex: 'index'
    }, {
      title: '状态',
      dataIndex: 'productStatus',
      render: (status: number): React.ReactNode => {
        return productStatus[status]
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
      title: "杆塔重量（kg）",
      dataIndex: "productWeight",
    },
    {
      title: "备注",
      dataIndex: "description",
    },
    ];
  }
}
export default withRouter(withTranslation()(ManagementSaleOrderSummary));
