/***
 * 付款记录列表
 * 2021/11/22
 */
import React, { useState, useRef } from 'react';
import { Button, Input, DatePicker, Select, Form, TreeSelect, Table } from 'antd'
import { SearchTable } from '../common'
import { fundRecordColumns } from "./fundRecord.json"
import { payTypeOptions } from '../../configuration/DictionaryOptions';
import OverViewRecord from './overViewRecord'; // 查看付款记录详情
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil'

interface ViewRefProps {
    getDetail: () => void
}
export default function FaundInfomation() {
    const [payApplyId, setPayApplyId] = useState<string>("");
    const [visibleOverView, setVisibleOverView] = useState<boolean>(false);
    const [departData, setDepartData] = useState<SelectDataNode[]>([]);
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
            role.title = role.name;
            role.value = role.id;
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
            value.endPayTime = `${formatDate[1]} 23:59:59`
            value.startPayTime = `${formatDate[0]} 00:00:00`
        }
        return value
    }
    //查看详情
    const viewShow = (record: { id: string }) => {
        setVisibleOverView(true);
        setPayApplyId(record.id);
        setTimeout(() => {
            viewRef.current?.getDetail()
        })
    }
    //表格增加底部计算
    const addList = (data: any) => {
        //如果没有数据
        if (!data.paymentDetailListVOIPage.records.length) {
            return;
        }
        const records = data.paymentDetailListVOIPage.records;
        let payMoney = 0;
        records.forEach((item: any) => {
            payMoney = (payMoney * 100 + Number(item.payMoney) * 100) / 100;
        });
        let list: { [t: string]: any } = {}
        fundRecordColumns.forEach((item: any) => {
            list[item.dataIndex] = ""
        });
        list.id = 1000;
        list.paymentNumber = "合计";
        list.Sunmry = true;
        list.payMoney = payMoney;
        records.push(list)
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
                path="/tower-finance/payApply/payment"
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'payType',
                        label: '付款方式',
                        children: <Form.Item name="payType">
                            <Select placeholder="费用类型" style={{ width: "100px" }}>
                                {payTypeOptions && payTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
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
                        label: '付款日期：',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: "200px" }} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入请款单号/收款方进行查询" style={{ width: 200 }} />
                    }
                ]}
                transformResult={(result) => result?.paymentDetailListVOIPage}
                extraOperation={(data: any) => <>
                    金额合计：<span style={{ color: "#FF8C00" }}>{data ? changeTwoDecimal_f(data.totalSumMoney) : 0.00}元</span>
                </>}
                isSunmryLine={addList}
                columns={[
                    ...fundRecordColumns.map((item: any) => {
                        if (item.dataIndex === 'payType') {
                            return ({
                                title: item.title,
                                dataIndex: 'payType',
                                width: 150,
                                render: (_: any, record: any):
                                    React.ReactNode => (
                                    <span>
                                        {(payTypeOptions as Array<any>)?.find((item: any) => item.id === record.payType) ?
                                            (payTypeOptions as Array<any>)?.find((item: any) => item.id === record.payType)["name"]
                                            : ""
                                        }
                                    </span>
                                )
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
                                return <Button className="btn-operation-link" type="link"
                                    onClick={() => { viewShow(record) }}>详情</Button>
                            }
                        }
                    }]}
                tableProps={{
                    summary: (pageData: any) => {
                        const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                        let momeny = 0;
                        if (pageData && pageData.length > 0) {
                            for (let i = 0; i <= pageData.length; i += 1) {
                                if (pageData[i] && pageData[i].payMoney) {
                                    momeny += pageData[i].payMoney * 1;
                                }

                            }
                        }
                        return (
                            <>
                                {
                                    (pageData && pageData.length > 0) ? (
                                        <Table.Summary.Row style={{ background: "rgba(255, 140, 0, .08)" }}>
                                            {
                                                number.map((item: any, index: number) => {
                                                    if (index === 0) {
                                                        return <Table.Summary.Cell index={index} key={index}>合计：</Table.Summary.Cell>
                                                    } else
                                                        if (index === 8) {
                                                            return <Table.Summary.Cell index={index} key={index}>{momeny}</Table.Summary.Cell>
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
            {/* 查看 */}
            <OverViewRecord
                payApplyId={payApplyId}
                title={confirmed}
                visible={visibleOverView}
                ref={viewRef}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}