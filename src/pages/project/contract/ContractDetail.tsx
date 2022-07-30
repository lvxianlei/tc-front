import React from "react"
import { withTranslation } from "react-i18next"
import { withRouter } from "react-router"
import { ITabItem } from "../../../components/ITabableComponent"
import { ContractDetail } from "../../prom/contract/ContractDetail"
import ManagementContractSummary from "./ContractSummary"
import ManagementContractRefundRecord from "./ContractRefundRecord"
import { Button, Popconfirm } from "antd"
import RequestUtil from "../../../utils/RequestUtil"
import { IResponseData } from "../../common/Page"
import { Link } from "react-router-dom"
import { Attachment } from "../../common"

/**
 * 项目管理-合同详情
 */

class ManagementContractDetail extends ContractDetail {
  public getTabItems(): ITabItem[] {
    const tabs = [...super.getTabItems()];

    return [
      Object.assign({}, tabs[0], {
        content: (
          <ManagementContractSummary
            baseInfo={this.state.detail}
            sysInfo={this.state.detail}
          />
        ),
      }),
      Object.assign({}, tabs[1], {
        content: (
          <Attachment title={false} dataSource={this.state.detail.attachVos as any} />
        ),
      }),
      Object.assign({}, tabs[2], {
        content: (
          <ManagementContractRefundRecord
            paymentPlanVos={[...this.state.detail.paymentPlanVos]}
            contractStatus={this.state.detail.contractStatus}
            onDeleted={() => this.fetchTableData()}
          />
        ),
      }),
    ];
  }
  public renderOperationArea(): React.ReactNode | React.ReactNode[] {
    return [
      <Button key="add">
        <Link to={`/project/contract/paymentRecord/${this.state.detail.id
          }/${(this.state.detail as any).contractName}/${this.state.detail.signCustomerId
          }/${this.state.detail.signCustomerName}/${this.state.detail.contractNumber}/${(this.state.detail as any).projectId}
          `}>添加回款记录</Link>
      </Button>,
      <Button key="setting">
        <Link to={`/project/contract/setting/${(this.props.match?.params as any).projectId}/${this.props.match?.params.id}`}>
          编辑
        </Link>
      </Button>,
      <Popconfirm
        key="delete"
        title="要删除该合同吗？"
        okText="确认"
        cancelText="取消"
        onConfirm={async () => {
          const resData: IResponseData = await RequestUtil.delete(
            `/tower-market/contract?id=${this.props.match?.params.id}`
          );
          if (resData) {
            this.props.history.goBack();
          }
        }}
        disabled={this.state.detail.isRelateOrder === 1}
      >
        <Button
          type="default"
          disabled={this.state.detail.isRelateOrder === 1}
        >
          删除
        </Button>
      </Popconfirm>,
      <Button type="default" key="goback" onClick={() => this.props.history.go(-1)}>返回</Button>
    ];
  }
}

export default withRouter(
  withTranslation(["translation"])(ManagementContractDetail)
);
