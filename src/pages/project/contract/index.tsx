import React, { useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Button, Popconfirm, Space, message } from 'antd';
import { Page } from '../../common';
import { IContract } from "../../IContract";
import RequestUtil from "../../../utils/RequestUtil";
import { IResponseData } from "../../common/Page";
import MiddleModal from '../../../components/MiddleModal';

export default function ContractList(): JSX.Element {
  const history = useHistory();
  const [refresh, setRefresh] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [filterValue, setFilterValue] = useState({ projectId: params.id });
  const onFilterSubmit = (value: any) => {
    value["projectId"] = params.id;
    setFilterValue({ projectId: params.id })
    return value
  }

  const columns = [
    {
      title: "合同编号",
      width: 140,
      dataIndex: "contractNumber",
      render: (_: undefined, record: object): React.ReactNode => {
        return (
          <Link
            to={`/project/management/detail/contract/${params.id}/${(record as IContract).id}`}
          >
            {(record as IContract).contractNumber}
          </Link>
        );
      },
    },
    {
      title: "内部合同编号",
      width: 140,
      dataIndex: "internalNumber",
      render: (_: undefined, record: object): React.ReactNode => {
        return (
          <Link to={`/project/management/detail/contract/${params.id}/${(record as IContract).id}`}>
            {(record as IContract).internalNumber}
          </Link>
        );
      },
    },
    {
      title: "合同/工程名称",
      width: 100,
      dataIndex: "contractName",
    },
    {
      title: "合同总重(吨)",
      width: 100,
      dataIndex: "contractTotalWeight",
    },
    {
      title: "合同金额(元)",
      width: 100,
      dataIndex: "contractAmount",
    },
    {
      title: "业主单位",
      width: 100,
      dataIndex: "customerCompany",
    },
    {
      title: "合同签订单位",
      width: 140,
      dataIndex: "signCustomerName",
    },
    {
      title: "签订日期",
      dataIndex: "signContractTime",
      width: 100
    },
    {
      title: "要求发货日期",
      dataIndex: "deliveryTime",
      width: 120,
    },
    {
      title: "有无技术协议",
      dataIndex: "isIta",
      width: 130,
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
      width: 100,
    },
    {
      title: "备注",
      dataIndex: "description",
      width: 100,
    },
    {
      title: "制单人",
      dataIndex: "createUserName",
      width: 100,
    },
    {
      title: "制单时间",
      dataIndex: "createTime", width: 100,
    }
  ]
  return (
    <>
      <Page
        path="/tower-market/contract/getContractPackPage"
        sourceKey="contractList.records"
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        extraOperation={(data: any) => {
          return (<>
            <Button
              type="primary"
              onClick={() => history.push(`/project/management/new/contract/${params.id}`)}
            >新增合同</Button>
            <span style={{ marginLeft: "20px" }}>
              合同重量合计：{data?.contractTotalWeight || 0.00}吨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合同金额合计：{data?.contractTotalAmount || 0.00}元
            </span>
          </>)
        }}
        columns={[
          {
            title: '序号',
            dataIndex: 'index',
            fixed: "left",
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
          },
          ...columns,
          {
            title: "操作",
            fixed: "right",
            dataIndex: "operation",
            render: (_: undefined, record: any): React.ReactNode => (
              <Space direction="horizontal" size="small">
                <Button type="link">
                  <Link
                    to={`/project/management/edit/contract/${params.id}/${(record as IContract).id}`}
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
                      setRefresh(true);
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
                    to={`/project/management/pamentRecord/contract/${record?.id}/${record?.contractName}/${record?.signCustomerId}/${record?.signCustomerName}/${record?.contractNumber}/${params.id}`}
                  >
                    添加回款记录
                  </Link>
                </Button>
                <MiddleModal
                  onSelect={async (selectedRows: any[]): Promise<void> => {
                    await RequestUtil.post(`/tower-market/contract/contractBid`, {
                      id: record?.id, bidStatisticsId: selectedRows[0].id
                    })
                    message.success('关联成功！')
                    history.go(0)
                  }}
                  projectId={record?.projectId}
                  selectKey={record?.bidStatisticsId} />
              </Space>
            ),
          },
        ]}
        refresh={refresh}
        searchFormItems={[]}
      />
    </>
  )
}