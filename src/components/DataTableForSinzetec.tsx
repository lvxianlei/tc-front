import React, { forwardRef, useImperativeHandle } from "react";
import { TableProps, TablePaginationConfig, Table } from "antd";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import RequestUtil from "../utils/RequestUtil";
import styles from "./AbstractMngtComponent.module.less";

interface DataTableForSinzetecProps extends TableProps<object> {
  reqPath: string;
  reqMethod?: "get";
  reqParams?: any;
  pagination?: TablePaginationConfig;
  dataSource?: undefined;
}
export interface SinzetecSevePageRes {
  current?: number;
  size?: number;
  total?: number;
  records?: any[];
  [key: string]: any;
}

const dafaultPage = { current: 1, pageSize: 10 };
export const DataTableForSinzetec = forwardRef(
  (props: DataTableForSinzetecProps, ref?: any) => {
    const {
      reqPath,
      reqMethod = "get",
      reqParams,
      rowKey = "id",
      bordered = false,
      pagination,
      onChange,
      dataSource,
      columns,
      size = "small",
      onRow,
      ...extraProps
    } = props;

    const [_pagination, setpagination] =
      useState<TablePaginationConfig>(dafaultPage);
    const [data, setdata] = useState<any[]>();

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

    const requeatAbort = useRef<AbortController>();

    const _onChange = useCallback(
      (pagination: TablePaginationConfig, ...extraParams) => {
        const baseParms = reqParams || {};
        const wholeParams = {
          current: pagination.current,
          size: pagination.pageSize,
          ...baseParms,
        };
        requeatAbort.current && requeatAbort.current.abort();
        RequestUtil[reqMethod](reqPath, wholeParams, undefined, (abort) => {
          requeatAbort.current = abort;
        })
          .then((_res: any) => {
            const res = _res as SinzetecSevePageRes;
            if (res?.current === pagination.current) {
              setpagination((pre) => {
                if (
                  pre.current !== pagination.current ||
                  pre.pageSize !== pagination.pageSize ||
                  pre.total !== pagination.total
                ) {
                  return Object.assign({}, pre, pagination);
                }
                return pre;
              });
              setdata(res?.records);
            }
          })
          .finally(() => {
            requeatAbort.current = undefined;
          });
      },
      [reqMethod, reqParams, reqPath]
    );

    useEffect(() => {
      _onChange(_pagination);
      return () => {
        requeatAbort.current && requeatAbort.current.abort();
      };
    }, [_onChange, _pagination]);

    useImperativeHandle(
      ref,
      () => {
        return {
          refresh() {
            _onChange(_pagination);
          },
          goFirstPage() {
            _onChange(dafaultPage);
          },
        };
      },
      [_onChange, _pagination]
    );

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
  }
);
