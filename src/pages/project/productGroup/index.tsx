import React, { useMemo, useRef } from "react";
import { Button, Row, Radio, Space } from "antd";
import { Link, useHistory, useParams } from "react-router-dom";
import { DetailContent, CommonTable } from "../../common";
import { productGroupColumns } from "../managementDetailData.json";
import { DataTableForSinzetec } from "../../../components/DataTableForSinzetec";
import { ColumnsType } from "antd/lib/table";
import AuthorityComponent from "../../../components/AuthorityComponent";
import ConfirmableButton from "../../../components/ConfirmableButton";
import RequestUtil from "../../../utils/RequestUtil";
import { IResponseData } from "../../common/Page";
import { ITableDataItem } from "../../prom/order/SaleOrder";

interface ProductGroupItem {
  createTime?: string;
  createUserName?: string;
  description?: string;
  id?: number;
  internalNumber?: string;
  number?: string;
  orderNumber?: string;
  projectName?: string;
  status?: string;
}

const ProductGroupList = () => {
  const params = useParams<any>();
  const datatable = useRef<any>();

  const columns: ColumnsType<ProductGroupItem> = useMemo(() => {
    return [
      {
        title: "序号",
        dataIndex: "index",
      },
      {
        title: "下发状态",
        dataIndex: "status",
      },
      {
        title: "杆塔明细编号",
        dataIndex: "number",
      },
      {
        title: "订单编号",
        dataIndex: "orderNumber",
      },
      {
        title: "订单工程名称",
        dataIndex: "projectName",
      },
      {
        title: "内部合同编号",
        dataIndex: "internalNumber",
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
        title: "操作",
        dataIndex: "",
        render(_, record) {
          return (
            <Space direction="horizontal" size="small">
              <Link to={`/prom/order/setting/${record.id}`}>编辑</Link>
              <Link to={`/prom/order/setting/${(record as ITableDataItem).id}`}>
                编辑
              </Link>
              <AuthorityComponent permissions="sale_order_del">
                <ConfirmableButton
                  confirmTitle="要删除该条数据吗？"
                  type="link"
                  placement="topRight"
                  onConfirm={async () => {
                    let id = (record as ITableDataItem).id;
                    const resData: IResponseData = await RequestUtil.delete(
                      `/tower-market/saleOrder?id=${id}`
                    );
                    datatable.current?.goFirstPage();
                  }}
                >
                  删除
                </ConfirmableButton>
              </AuthorityComponent>
            </Space>
          );
        },
      },
    ];
  }, []);

  return (
    <DataTableForSinzetec
      ref={datatable}
      columns={columns}
      reqPath={"/tower-market/productGroup"}
      reqParams={{
        projectId: params.id,
      }}
    />
  );
};

const ProductGroup = () => {
  const history = useHistory();
  const params = useParams<any>();

  return (
    <DetailContent
      title={[
        <Button
          key="new"
          type="primary"
          onClick={() =>
            history.push(
              `/project/management/detail/edit/productGroup/${params.id}`
            )
          }
        >
          新增
        </Button>,
      ]}
    >
      <ProductGroupList />
      <Row>
        <Radio.Group
          options={[
            { label: "明细", value: "Apple" },
            { label: "统计", value: "Pear" },
          ]}
          optionType="button"
        />
      </Row>
      <CommonTable columns={productGroupColumns} />
    </DetailContent>
  );
};

export default ProductGroup;
