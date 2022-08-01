/***
 * 订单列表
 */
import React, { useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import { Page } from '../../common';
import RequestUtil from "../../../utils/RequestUtil";
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import ConfirmableButton from "../../../components/ConfirmableButton";
import AuthorityComponent from "../../../components/AuthorityComponent";
export default function SaleOrder(): JSX.Element {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
    const [filterValue, setFilterValue] = useState({ projectId: params.id });
    const onFilterSubmit = (value: any) => {
        value["projectId"] = params.id;
        setFilterValue({ projectId: params.id })
        return value
    }
    const columns = [{
        title: "销售订单编号",
        dataIndex: "saleOrderNumber",
        render: (_: undefined, record: any): React.ReactNode => {
            return (
                <Link
                    to={`/project/management/detail/order/${params.id}/${record?.id}`}
                >
                    {record.saleOrderNumber}
                </Link>
            );
        },
    },
    {
        title: "任务下发状态",
        dataIndex: "taskStatus",
        width: 120,
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
        title: "内部合同编号",
        dataIndex: "internalNumber",
        width: 140,
        render: (_: undefined, record: any): React.ReactNode => {
            return (
                <Link
                    to={`/project/contract/detail/${params.id}/${record.contractId
                        }`}
                >
                    {record.internalNumber}
                </Link>
            );
        },
    },
    {
        title: "订单工程名称",
        dataIndex: "orderProjectName",
        width: 120,
    },
    {
        title: "业主单位",
        dataIndex: "customerCompany",
        width: 100,
    },
    {
        title: "合同签订单位",
        dataIndex: "signCustomerName",
        width: 120,
    },
    {
        title: "产品类型",
        dataIndex: "productType",
        width: 100,
        render: (text: any) => <>{productTypeOptions?.find((item: any) => text === item.id)?.name}</>
    },
    {
        title: "电压等级",
        dataIndex: "voltageGrade",
        width: 100,
        render: (text: any) => <>{voltageGradeOptions?.find((item: any) => text === item.id)?.name}</>
    },
    {
        title: "订单总价",
        dataIndex: "taxAmount",
        width: 100,
    },
    {
        title: "订单重量",
        dataIndex: "orderWeight",
        width: 100,
    },
    {
        title: "已下计划重量(吨)",
        dataIndex: "orderWeight",
        width: 120,
    },
    {
        title: "未下计划重量(吨)",
        dataIndex: "orderWeight",
        width: 120,
    },
    {
        title: "订单单价",
        dataIndex: "taxPrice",
        width: 100,
    },
    {
        title: "签订日期",
        dataIndex: "signContractTime",
        width: 100,
    },
    {
        title: "合同交货日期",
        dataIndex: "deliveryTime",
        width: 120,
    },
    {
        title: "制单人",
        dataIndex: "createUserName", // createUserName修改为salesman
        width: 100,
    },
    {
        title: "制单时间",
        dataIndex: "createTime",
        width: 100,
    }
    ]
    return (
        <>
            <Page
                path="/tower-market/saleOrder"
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                extraOperation={(data: any) => <>
                    <Button type="primary" onClick={() => {
                        history.push(`/project/management/new/order/${params.id}`);
                    }}>新增订单</Button>
                </>}
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
                                <Button
                                    type="link"
                                    disabled={record.isProductGroupRef !== 0}
                                    onClick={() => history.push(`/project/management/edit/order/${params.id}/${record.id}`)}>编辑</Button>
                                <AuthorityComponent permissions="sale_order_del">
                                    <ConfirmableButton
                                        confirmTitle="要删除该订单吗？"
                                        type="link"
                                        placement="topRight"
                                        onConfirm={async () => {
                                            let id = record.id;
                                            const resData = await RequestUtil.delete(
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
                refresh={refresh}
                searchFormItems={[]}
            />
        </>
    )
}