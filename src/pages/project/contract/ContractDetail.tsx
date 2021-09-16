import React from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { ITabItem } from "../../../components/ITabableComponent";
import { ContractDetail } from "../../prom/contract/ContractDetail";
import ManagementContractSummary from "./ContractSummary";
import ManagementContractAttachment from "./ContractAttachment";
import ManagementContractRefundRecord from "./ContractRefundRecord";
import { Button, Popconfirm } from "antd";
import RequestUtil from "../../../utils/RequestUtil";
import { IResponseData } from "../../common/Page";
import { Link } from "react-router-dom";

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
          <ManagementContractAttachment
            attachVos={this.state.detail.attachVos}
          />
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
      <Button key="new">
        <Link to={"/project/contract/new"}>新增</Link>
      </Button>,
      <Button key="setting" disabled={this.state.detail.contractStatus === 1}>
        <Link to={`/project/contract/setting/${this.props.match.params.id}`}>
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
            `/tower-market/contract?id=${this.props.match.params.id}`
          );
          if (resData) {
            this.props.history.push(`/project/contract`);
          }
        }}
        disabled={this.state.detail.contractStatus === 1}
      >
        <Button
          type="default"
          disabled={this.state.detail.contractStatus === 1}
        >
          删除
        </Button>
      </Popconfirm>,
    ];
  }
}

export default withRouter(
  withTranslation(["translation"])(ManagementContractDetail)
);
