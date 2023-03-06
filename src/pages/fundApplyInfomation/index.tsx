/***
 * 请款申请列表
 * 2021/11/22
 */
import React, { useState, useRef } from 'react';
import { Button, Input, DatePicker, Radio, Select, Form, TreeSelect, Table } from 'antd'
// import { useHistory } from 'react-router-dom'
import { SearchTable } from '../common'
import { fundListColumns, approvalStatus, payStatuOptions } from "./fundListHead.json"
import { costTypeOptions } from '../../configuration/DictionaryOptions';
import AddModal from './addModal'; // 新增付款记录
import OverView from './overView'; // 查看付款记录详情
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
interface ViewRefProps {
    getDetail: () => void
}
export default function FaundInfomation() {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [payStatus, setPayStatus] = useState<number>(1);
    const [departData, setDepartData] = useState<SelectDataNode[]>([]);
    const [AddVisible, setAddVisible] = useState(false);
    const [visibleOverView, setVisibleOverView] = useState<boolean>(false);
    const [payApplyId, setPayApplyId] = useState<string>("");
    const [amountPayable, setAmountPayable] = useState<string>("0"); // 应付款金额
    const confirmed = [{ "title": "备注", "dataIndex": "description" }];
    const viewRef = useRef<ViewRefProps>();
    //请求部门
    useRequest(() => new Promise(async (resole, reject) => {
        const deptData: SelectDataNode[] = await RequestUtil.get(`/tower-system/department`);
        setDepartData(deptData);
    }), {})
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            if (role.type === 2) {
                role.disabled = true;
            }
            role.value = role.id;
            role.title = role.name;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.endPayApplyTime) {
            const formatDate = value.endPayApplyTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.endPayApplyTime = `${formatDate[1]} 23:59:59`
            value.startPayApplyTime = `${formatDate[0]} 00:00:00`
        }
        value.payStatus = payStatus;
        return value
    }
    // tab切换
    const operationChange = (event: any) => {
        setPayStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }
    // 新增回调
    const handleOk = (result: object, callBack: any) => {
        setAddVisible(false);
        setRefresh(!refresh);
    }
    //查看详情
    const viewShow = (record: { id: string }) => {
        setVisibleOverView(true);
        setPayApplyId(record.id);
        setTimeout(() => {
            viewRef.current?.getDetail()
        })
    }
    const changeTwoDecimal_f = (x: string) => {
        var f_x = parseFloat(x);
        if (isNaN(f_x)) return 0;
        var f_x = Math.round(100 * Number(x)) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }
    return (
        <>
            <SearchTable
                path="/tower-finance/payApply"
                onFilterSubmit={onFilterSubmit}
                filterValue={{ payStatus }}
                refresh={refresh}
                searchFormItems={[
                    {
                        name: 'costType',
                        label: '费用类型',
                        children: <Form.Item name="costType">
                            <Select placeholder="费用类型" style={{ width: "100px" }}>
                                {costTypeOptions && costTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={name}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'payerDeptId',
                        label: '请款部门',
                        children: <Form.Item name="payerDeptId">
                            <TreeSelect
                                style={{ width: '150px' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', width: 200 }}
                                treeData={wrapRole2DataNode(departData)}
                                placeholder="请选择"

                            />
                        </Form.Item>
                    },
                    {
                        name: 'endPayApplyTime',
                        label: '请款日期：',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: "200px" }} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                    }
                ]}
                transformResult={(result) => result?.payApplyListVOIPage}
                extraOperation={(data: any) => <>
                    <Radio.Group defaultValue={payStatus} onChange={operationChange}>
                        {approvalStatus.map((item: any) =>
                            <Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>
                        )}
                    </Radio.Group>
                    {payStatus == 1 ?
                        <span style={{ marginLeft: "20px" }}>
                            请款金额总计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data ? changeTwoDecimal_f(data.totalSumMoney) : 0.00}元</span>
                            已付金额合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data ? changeTwoDecimal_f(data.totalMoney) : 0.00}元</span>
                            应付款余额合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data ? changeTwoDecimal_f(data.totalPayMoney) : 0.00}元</span>
                        </span>
                        :
                        <span style={{ marginLeft: "20px" }}>请款金额总计：{data ? changeTwoDecimal_f(data.totalSumMoney) : 0.00}元</span>
                    }
                </>}
                columns={[
                    ...fundListColumns.map((item: any) => {
                        if (item.dataIndex === 'payStatus') {
                            return ({
                                title: item.title,
                                dataIndex: 'payStatus',
                                width: 150,
                                render: (_: any, record: any):
                                    React.ReactNode => (
                                    <span>{!record.Sunmry ? payStatuOptions[record.payStatus] : ""}</span>
                                )
                            })
                        }
                        if (item.dataIndex === "sumMoney") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.sumMoney ? changeTwoDecimal_f(record.sumMoney) : ''}</span>)
                            })
                        }
                        if (item.dataIndex === "money") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.money ? changeTwoDecimal_f(record.money) : ''}</span>)
                            })
                        }
                        if (item.dataIndex === "payMoney") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.payMoney ? changeTwoDecimal_f(record.payMoney) : ''}</span>)
                            })
                        }
                        return item;
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 120,
                        render: (_: any, record: any) => {
                            if (!record.Sunmry) {
                                if (payStatus === 1) {
                                    return (
                                        <>
                                            {/* 等于2为已付款 */}
                                            {record.payStatus != 2 ?
                                                <Button type="link" className="btn-operation-link" onClick={() => {
                                                    setAddVisible(true);
                                                    setPayApplyId(record.id);
                                                    setAmountPayable(record.payMoney);
                                                }}>新增付款记录</Button>
                                                : ""}
                                            <Button type="link" className="btn-operation-link" onClick={() => { viewShow(record) }}>详情</Button>
                                        </>
                                    )
                                }
                                return <Button type="link" className="btn-operation-link" onClick={() => { viewShow(record) }}>详情</Button>
                            }
                        }
                    }]}
                tableProps={{
                    summary: (pageData: any) => {
                        const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
                        let subMomeny = 0, // 已付金额
                            sumMoney = 0, // 请款金额
                            payMoney = 0; // 应付金额
                        if (pageData && pageData.length > 0) {
                            for (let i = 0; i <= pageData.length; i += 1) {
                                if (pageData[i] && pageData[i].payMoney) {
                                    subMomeny += pageData[i].money * 1;
                                    sumMoney += pageData[i].sumMoney * 1;
                                    payMoney += pageData[i].payMoney * 1;
                                }
                            }
                        }
                        return (
                            <>
                                {
                                    pageData && pageData.length > 0 ? (
                                        <Table.Summary.Row style={{ background: "rgba(255, 140, 0, .08)" }}>
                                            {
                                                number.map((item: any, index: number) => {
                                                    if (index === 0) {
                                                        return <Table.Summary.Cell index={index} key={index}>合计：</Table.Summary.Cell>
                                                    } else
                                                        if (index === 8) {
                                                            return <Table.Summary.Cell index={index} key={index}>{changeTwoDecimal_f(sumMoney + "")}</Table.Summary.Cell>
                                                        } else
                                                            if (index === 9) {
                                                                return <Table.Summary.Cell index={index} key={index}>{changeTwoDecimal_f(subMomeny + "")}</Table.Summary.Cell>
                                                            } else
                                                                if (index === 10) {
                                                                    return <Table.Summary.Cell index={index} key={index}>{changeTwoDecimal_f(payMoney + "")}</Table.Summary.Cell>
                                                                } else
                                                                    return <Table.Summary.Cell index={index} key={index}></Table.Summary.Cell>
                                                })
                                            }
                                        </Table.Summary.Row>
                                    ) : null
                                }
                            </>
                        );
                    }
                }}
            />
            {/* 新增 */}
            <AddModal
                payApplyId={payApplyId}
                visible={AddVisible}
                amountPayable={amountPayable}
                onCancel={() => setAddVisible(false)}
                onOk={handleOk}
            />
            {/* 查看 */}
            <OverView
                payApplyId={payApplyId}
                title={confirmed}
                visible={visibleOverView}
                ref={viewRef}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}