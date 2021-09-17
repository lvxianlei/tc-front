import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Row,
  Radio,
  Table,
  TableProps,
  TablePaginationConfig,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { DetailContent, CommonTable } from "../../common";
import {
  productGroupColumns,
  cargoVOListColumns,
} from "../managementDetailData.json";
import styles from "../../../components/AbstractMngtComponent.module.less";
import RequestUtil from "../../../utils/RequestUtil";

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

interface DataTableForSinzetec extends TableProps<object> {
  requestFun?: (pagination?: TablePaginationConfig | false) => void;
}

const DataTableForSinzetec = (props: DataTableForSinzetec) => {
  const [_pagination, setpagination] = useState<
    TablePaginationConfig | false
  >();
  const [data, setdata] = useState<any[]>();

  const {
    requestFun,
    rowKey = "id",
    bordered = false,
    pagination = false,
    onChange,
    dataSource,
    columns,
    size = "small",
    onRow,
    ...extraProps
  } = props;

  const _columns = useMemo(() => {
    return columns?.map((col) => {
      return {
        ...col,
        ellipsis: col.ellipsis === undefined ? true : col.ellipsis,
        onCell(...params: any[]) {
          const inputonCell =
            col.onCell && col.onCell.apply(null, params as any);
          const inputClassName = inputonCell?.className;
          return {
            ...inputonCell,
            className: `${styles.tableCell} ${inputClassName || ""}`,
          };
        },
      };
    });
  }, [columns]);

  const _onRow = useCallback(
    (...params: any[]) => {
      const inputOnRow = onRow && onRow.apply(null, params as any);
      const inputClassName = inputOnRow?.className;
      return {
        ...inputOnRow,
        className: `${styles.tableRow} ${inputClassName || ""}`,
      };
    },
    [onRow]
  );

  useEffect(() => {
    setpagination(pagination);
  }, [pagination]);

  const _onChange = useCallback(
    (pagination: TablePaginationConfig, ...extraParams) => {
      setpagination(_pagination);
      onChange && onChange.apply(null, [pagination, ...extraParams] as any);
    },
    [_pagination, onChange]
  );

  useEffect(() => {
    requestFun && requestFun(_pagination);
  }, [_pagination, requestFun]);

  return (
    <Table
      {...extraProps}
      rowKey={rowKey}
      bordered={bordered}
      size={size}
      columns={_columns}
      onRow={_onRow}
      onChange={_onChange}
      pagination={_pagination}
      dataSource={data}
    />
  );
};

const ProductGroupList = () => {
  const [data, setData] = useState<ProductGroupItem[]>();

  const requestFun = useCallback(
    (pagination?: TablePaginationConfig | false) => {},
    []
  );

  return (
    <DataTableForSinzetec
      columns={cargoVOListColumns}
      requestFun={requestFun}
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
