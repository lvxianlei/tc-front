import {
  TableColumnType,
  Space,
  Button,
  Popconfirm,
  FormItemProps,
  Upload,
  message
} from "antd";
import React from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { ITabItem } from "../../../components/ITabableComponent";
import RequestUtil from "../../../utils/RequestUtil";
import { IResponseData } from "../../common/Page";
import { IContract } from "../../IContract";
import { PromContract } from "../../prom/contract/PromContract";
import AuthUtil from "../../../utils/AuthUtil"
/**
 * 项目管理-合同
 */
class ManagementContract extends PromContract {
  /**
   * @implements
   * @description Gets table columns
   * @param item
   * @returns table columns
   */

  public uploadChange = (event: any) => {
    if (event.file.status === "done") {
      if (event.file.response.code === 200) {
        message.success("杆塔信息导入成功...")
      }
    }
  }

  public getTableColumns(item: ITabItem): TableColumnType<object>[] {
    const projectId = (this.props.match.params as any).id;
    return [
      {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        fixed: "left",
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
      },
      {
        key: "contractNumber",
        title: "合同编号",
        dataIndex: "contractNumber",
        render: (_: undefined, record: object): React.ReactNode => {
          return (
            <Link
              to={`/project/contract/detail/${projectId}/${(record as IContract).id
                }`}
            >
              {(record as IContract).contractNumber}
            </Link>
          );
        },
      },
      {
        key: "internalNumber",
        title: "内部合同编号",
        dataIndex: "internalNumber",
        render: (_: undefined, record: object): React.ReactNode => {
          return (
            <Link to={`/project/contract/detail/${projectId}/${(record as IContract).id}`}>
              {(record as IContract).internalNumber}
            </Link>
          );
        },
      },
      {
        key: "contractName",
        title: "合同/工程名称",
        dataIndex: "contractName",
      },
      {
        key: "contractTotalWeight",
        title: "合同总重(吨)",
        dataIndex: "contractTotalWeight",
      },
      {
        title: "合同金额(元)",
        dataIndex: "contractAmount",
      },
      {
        title: "业主单位",
        dataIndex: "customerCompany",
      },
      {
        title: "合同签订单位",
        dataIndex: "signCustomerName",
      },
      {
        title: "签订日期",
        dataIndex: "signContractTime",
      },
      {
        title: "要求发货日期",
        dataIndex: "deliveryTime",
      },
      {
        title: "有无技术协议",
        dataIndex: "isIta",
        render: (text: any, records: any) => {
          let value = "无";
          if (text === 1) {
            value = "原件"
          } else if (text === 2) {
            value = "复印件"
          }
          return <>{value}</>
        }
      },
      {
        title: "跟单业务员",
        dataIndex: "salesman",
      },
      {
        title: "备注",
        dataIndex: "description",
      },
      {
        title: "制单人",
        dataIndex: "createUserName",
      },
      {
        title: "制单时间",
        dataIndex: "createTime",
      },
      {
        key: "operation",
        title: "操作",
        fixed: "right",
        dataIndex: "operation",
        render: (_: undefined, record: object): React.ReactNode => (
          <Space direction="horizontal" size="small">
            <Button type="link">
              <Link
                to={`/project/contract/setting/${projectId}/${(record as IContract).id}`}
              >
                编辑
              </Link>
            </Button>
            <Popconfirm
              title="要删除该合同吗？"
              placement="topRight"
              okText="确认"
              cancelText="取消"
              onConfirm={async () => {
                let id = (record as IContract).id;
                const resData: IResponseData = await RequestUtil.delete(
                  `/tower-market/contract?id=${id}`
                )
                if (resData) {
                  message.success("合同已成功删除...")
                  this.fetchTableData({})
                }
              }}
              disabled={(record as IContract).isRelateOrder === 1}
            >
              <Button type="link" disabled={(record as IContract).isRelateOrder === 1}>
                删除
              </Button>
            </Popconfirm>
            <Button type="link">
              <Link
                to={`/project/contract/paymentRecord/${(record as IContract).id
                  }/${(record as any).contractName}/${(record as IContract).signCustomerId
                  }/${(record as IContract).signCustomerName
                  }/${(record as any).contractNumber}/${(this.props.match.params as any).id}`}
              >
                添加回款记录
              </Link>
            </Button>
            {/* <Upload
              key="sub"
              name="file"
              multiple={true}
              action={`${process.env.REQUEST_API_PATH_PREFIX}/tower-market/productAssist/importProductAssist`}
              headers={{
                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                'Tenant-Id': AuthUtil.getTenantId(),
                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
              }}
              data={{ contractId: (record as any).id }}
              showUploadList={false}
              onChange={this.uploadChange}
            ><Button key="enclosure" type="link">导入杆塔信息</Button></Upload> */}
          </Space>
        ),
      },
    ];
  }

  /**
   * @implements
   * @description Gets tab items
   * @returns tab items
   */
  public getTabItems(): ITabItem[] {
    let tab = [
      {
        label: "",
        key: "item_0",
      },
    ];
    return tab;
  }

  /**
   * @implements
   * @description Determines whether new click on
   * @param event
   */
  public onNewClick(event: React.MouseEvent<HTMLButtonElement>): void {
    this.props.history.push(`/project/contract/new/${(this.props.match.params as any).id}`);
  }

  protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
    return (
      <>
        <Button type="primary" onClick={this.onNewClick}>新增合同</Button>
        <p>合同重量合计：{this.state.contractWeightAll}吨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合同金额合计：{this.state.contractAmountAll}元</p>
      </>
    );
  }

  /**
   * @implements
   * @description Renders filter components
   * @param item
   * @returns filter components
   */
  public getFilterFormItemProps(item: ITabItem): FormItemProps[] {
    return [];
  }
}

export default withRouter(withTranslation(["translation"])(ManagementContract));
