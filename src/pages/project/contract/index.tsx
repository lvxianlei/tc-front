import React, { useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Button, Popconfirm, message, Input, Upload, Typography, Row, Space } from 'antd';
import { SearchTable as Page } from '../../common';
import { IContract } from "../../IContract";
import RequestUtil from "../../../utils/RequestUtil";
import { IResponseData } from "../../common/Page";
import MiddleModal from '../../../components/MiddleModal';
import AuthUtil from '../../../utils/AuthUtil';
const { Text } = Typography

const calcContractTotal = (records: any[]) => {
  return records.reduce((result: { weight: string, amount: string }, item: any) => ({
    weight: (parseFloat(result.weight) + parseFloat(item.contractTotalWeight || "0.00")).toFixed(2),
    amount: (parseFloat(result.amount) + parseFloat(item.contractAmount || "0.00")).toFixed(2)
  }), { weight: "0.00", amount: "0.00" })
}

export default function ContractList(): JSX.Element {
  const history = useHistory();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const params = useParams<{ id: string }>();
  const entryPath = params.id ? "management" : "contract"
  const [filterValue, setFilterValue] = useState({ projectId: params.id });
  const total: any = calcContractTotal(selectedRows)
  const onFilterSubmit = (value: any) => {
    value["projectId"] = params.id;
    setFilterValue({ projectId: params.id, ...value })
    return value
  }

  const columns = [
    {
      title: "合同编号",
      width: 140,
      dataIndex: "contractNumber",
      render: (_: undefined, record: any): React.ReactNode => {
        return (<Link to={`/project/${entryPath}/detail/contract/${record?.projectId}/${(record as IContract).id}`}>
          <Text
            style={{ width: "100%", color: "#FF8C00" }}
            ellipsis={{
              tooltip: record.contractNumber
            }}>
            {(record as IContract).contractNumber}
          </Text>
        </Link>
        );
      },
    },
    {
      title: "内部合同编号",
      width: 140,
      dataIndex: "internalNumber",
      render: (_: undefined, record: any): React.ReactNode => (<Link to={`/project/${entryPath}/detail/contract/${record?.projectId}/${(record as IContract).id}`}>
        <Text
          style={{ width: "100%", color: "#FF8C00" }}
          ellipsis={{
            tooltip: record.internalNumber
          }}>
          {(record as IContract).internalNumber}
        </Text></Link>),
    },
    {
      title: "合同/工程名称",
      width: 100,
      dataIndex: "contractName",
    },
    {
      title: "合同类型",
      dataIndex: "contractType",
      type: "select",
      enum: [
        {
          label: "销售合同",
          value: 1
        },
        {
          label: "补充合同",
          value: 2
        },
        {
          label: "变更合同",
          value: 3
        }
      ],
      width: 100,
    },
    {
      title: "合同总重(吨)",
      width: 100,
      dataIndex: "contractTotalWeight",
    },
    {
      title: "已下计划重量(吨)",
      dataIndex: "released",
      width: 120,
    },
    {
      title: "未下计划重量(吨)",
      dataIndex: "notReleased",
      width: 120,
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
      dataIndex: "createTime",
      width: 100,
    },
    {
      title: "关联单据",
      dataIndex: "relationInternalNumber",
      width: 100,
    }
  ]

  return (
    <>
      <Page
        path="/tower-market/contract/getContractPackPage"
        sourceKey=""
        pageSize={50}
        onFilterSubmit={onFilterSubmit}
        transformResult={(result: any) => result.contractList}
        filterValue={filterValue}
        extraOperation={(data: any) => {
          return (<>
            <Button
              type="primary"
              onClick={() => history.push(`/project/${entryPath}/new/contract/${params.id}`)}
            >新增合同</Button>
            <Upload
              accept=".xls,.xlsx"
              action={() => {
                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                return baseUrl + '/tower-market/contract/import'
              }}
              headers={
                {
                  'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                  'Tenant-Id': AuthUtil.getTenantId(),
                  'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                }
              }
              showUploadList={false}
              onChange={(info) => {
                if (info.file.response && !info.file.response?.success) {
                  message.warning(info.file.response?.msg)
                } else if (info.file.response && info.file.response?.success) {
                  message.success('导入成功！');
                  history.go(0)
                }
              }}
            >
              <Button type="primary" ghost>导入</Button>
            </Upload>
            <span style={{ marginLeft: "20px" }}>
              合同重量合计：{data?.contractTotalWeight || 0.00}吨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合同金额合计：{data?.contractTotalAmount || 0.00}元
            </span>
            {
              selectedRows.length > 0 && <Row style={{ width: 1200 }}>
                <Row style={{ color: "#FF8C00", fontWeight: 600, fontSize: 14 }}>合计：</Row>
                <Space>
                  <div>合同重量：<span style={{ color: "#FF8C00" }}>{total.weight}吨</span></div>
                  <div>合同金额：<span style={{ color: "#FF8C00" }}>{total.amount}元</span></div>
                </Space>
              </Row>
            }
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
          ...columns as any,
          {
            title: "操作",
            fixed: "right",
            dataIndex: "operation",
            width: 400,
            render: (_: undefined, record: any): React.ReactNode => (
              <>
                <Button type="link">
                  <Link
                    to={`/project/${entryPath}/edit/contract/${record?.projectId || "undefined"}/${record?.id}/${record?.contractType}`}
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
                    to={`/project/${entryPath}/pamentRecord/contract/${(record as IContract).id
                      }/${(record as any).contractName}/${(record as IContract).signCustomerId
                      }/${(record as IContract).signCustomerName
                      }/${(record as any).contractNumber}/${record?.projectId}`}
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
                <Button type="link" disabled={record?.contractType !== 1}>
                  <Link
                    to={`/project/${entryPath}/edit/contract/${record?.projectId || "undefined"}/${record?.id}/2`}
                  >
                    补充合同
                  </Link>
                </Button>
                <Button type="link" disabled={record?.contractType !== 1}>
                  <Link
                    to={`/project/${entryPath}/edit/contract/${record?.projectId || "undefined"}/${record?.id}/3`}
                  >
                    变更合同
                  </Link>
                </Button>
              </>
            )
          },
        ]}
        refresh={refresh}
        searchFormItems={[
          {
            name: 'internalNumber',
            label: '内部合同编号',
            children: <Input placeholder="内部合同编号" style={{ width: 210 }} />
          },
          {
            name: 'customerCompany',
            label: '业主单位',
            children: <Input placeholder="业主单位" style={{ width: 210 }} />
          },
          {
            name: 'fuzzyQuery',
            label: '模糊查询项',
            children: <Input placeholder="内部合同号/合同名称/采购订单号/业主单位" style={{ width: 210 }} />
          }
        ]}
        tableProps={{
          rowSelection: {
            type: "checkbox",
            selectedRowKeys: selectedRows?.map((item: any) => item.id),
            onChange: (_: string[], selectedRows: any[]) => {
              setSelectedRows(selectedRows)
            },
          }
        }}
      />
    </>
  )
}