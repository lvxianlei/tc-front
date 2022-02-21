/***
 * 订单列表
 */
 import React, { useState } from 'react';
 import { 
     Button,
     Space,
 } from 'antd';
 import { useHistory, useParams, Link } from 'react-router-dom';
 import { Page } from '../../common';
 import RequestUtil from "../../../utils/RequestUtil";
 import { IResponseData } from "../../common/Page";
 import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
 import { ITableDataItem } from "../../prom/order/SaleOrder";
 import ConfirmableButton from "../../../components/ConfirmableButton";
 import AuthorityComponent from "../../../components/AuthorityComponent";
 export default function SaleOrder(): JSX.Element {
     const history = useHistory();
     const [ refresh, setRefresh ] = useState<boolean>(false);
     const params = useParams<{ id: string }>();
     const [ filterValue, setFilterValue ] = useState({projectId: params.id});
     const onFilterSubmit = (value: any) => {
         value["projectId"] = params.id;
         setFilterValue({projectId: params.id})
         return value
     }
    const columns = [{ 
        key: "saleOrderNumber",
        title: "销售订单编号",
        dataIndex: "saleOrderNumber",
        render: (_: undefined, record: object): React.ReactNode => {
        return (
            <Link
            to={`/project/order/detail/${params.id}/${(record as ITableDataItem).id
                }`}
            >
            {(record as ITableDataItem).saleOrderNumber}
            </Link>
        );
        },
    },
    {
        key: "taskStatus",
        title: "任务下发状态",
        dataIndex: "taskStatus",
        render: (value: number, record: object): React.ReactNode => {
        const renderEnum: any = [
            {
            value: 0,
            label: "未下发"
            },
            {
            value: 1,
            label: "部分下发"
            },
            {
            value: 2,
            label: "全部下发"
            },
        ]
        return <>{renderEnum.find((item: any) => item.value === value).label}</>
        }
    },
    {
        key: "internalNumber",
        title: "内部合同编号",
        dataIndex: "internalNumber",
        render: (_: undefined, record: object): React.ReactNode => {
        return (
            <Link
            to={`/project/contract/detail/${params.id}/${(record as ITableDataItem).contractId
                }`}
            >
            {(record as ITableDataItem).internalNumber}
            </Link>
        );
        },
    },
    {
        key: "orderProjectName",
        title: "订单工程名称",
        dataIndex: "orderProjectName",
    },
    {
        key: "customerCompany",
        title: "业主单位",
        dataIndex: "customerCompany",
    },
    {
        key: "signCustomerName",
        title: "合同签订单位",
        dataIndex: "signCustomerName",
    },
    {
        key: "productType",
        title: "产品类型",
        dataIndex: "productType",
        render: (text: any) => <>{productTypeOptions?.find((item: any) => text === item.id)?.name}</>
    },
    {
        key: "voltageGrade",
        title: "电压等级",
        dataIndex: "voltageGrade",
        render: (text: any) => <>{voltageGradeOptions?.find((item: any) => text === item.id)?.name}</>
    },
    {
        key: "taxAmount",
        title: "订单总价",
        dataIndex: "taxAmount",
    },
    {
        key: "orderWeight",
        title: "订单重量",
        dataIndex: "orderWeight",
    },
    {
        key: "taxPrice",
        title: "订单单价",
        dataIndex: "taxPrice",
    },
    {
        key: "signContractTime",
        title: "签订日期",
        dataIndex: "signContractTime",
    },
    {
        key: "deliveryTime",
        title: "合同交货日期",
        dataIndex: "deliveryTime",
    },
    {
        key: "createUserName",
        title: "制单人",
        dataIndex: "createUserName", // createUserName修改为salesman
    },
    {
        key: "createTime",
        title: "制单时间",
        dataIndex: "createTime",
    },
    ]
    return (
        <>
            <Page
                path="/tower-market/saleOrder"
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                extraOperation={(data: any) => <>
                    <Button type="primary" onClick={() => {
                        history.push(`/project/order/new/${params.id}/new`);
                    }}>新增订单</Button>
                </>}
                columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                    ...columns,
                    {
                    key: "operation",
                    title: "操作",
                    fixed: "right",
                    dataIndex: "operation",
                    render: (_: undefined, record: any): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                        <Button
                            type="link"
                            disabled={record.isProductGroupRef !== 0}
                            onClick={() => history.push(`/project/order/setting/${params.id}/${(record as ITableDataItem).id}`)}>编辑</Button>
                            <AuthorityComponent permissions="sale_order_del">
                                <ConfirmableButton
                                    confirmTitle="要删除该订单吗？"
                                    type="link"
                    
                                    placement="topRight"
                                    onConfirm={async () => {
                                        let id = (record as ITableDataItem).id;
                                        const resData: IResponseData = await RequestUtil.delete(
                                        `/tower-market/saleOrder?id=${id}`
                                        );
                                        setRefresh(true);
                                    }}
                                >
                                    <Button type="link" disabled={record.isProductGroupRef !== 0}>删除</Button>
                                </ConfirmableButton>
                            </AuthorityComponent>
                        </Space>
                    ),
                    },
                ]}
                refresh={ refresh }
                searchFormItems={[]}
            />
        </>
    )
 }