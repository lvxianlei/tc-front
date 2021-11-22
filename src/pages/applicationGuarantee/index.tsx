/***
 * 保函申请
 * 2021/11/22
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Radio, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import { Page } from '../common';
import { collectionListHead, approvalStatus } from "./applicationColunm.json";

const { Option } = Select;

export default function ApplicationColunm() {
    const history = useHistory()
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [confirmStatus, setConfirmStatus] = useState<number>(0);

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startRefundTime = formatDate[0]
            value.endRefundTime = formatDate[1]
        }
        return value
    }
    
    // tab切换
    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }
    return (
        <>
            <Page
                path="/tower-market/backMoney"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...collectionListHead,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 100,
                        render: (_: any, record: any) => {
                            /**
                             * 这一块重新处理
                             */
                            if (record.confirmStatus === 0) {
                                return (
                                    <>
                                        <Button type="link">查看</Button>
                                        <Button type="link">填写保函信息</Button>
                                        <Button type="link">生成文件</Button>
                                    </>
                                )
                            } else if (record.confirmStatus === 1) {
                                return (
                                    <>
                                        <Button type="link">查看</Button>
                                        <Button type="link">回收保函</Button>
                                    </>
                                )
                            }
                            return <Button type="link">查看</Button>
                        }
                    }]}
                refresh={ refresh }
                extraOperation={
                    <>
                    <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                        {
                            approvalStatus.map((item: any) => <Radio.Button value={item.value}>{item.label}</Radio.Button>)
                        }
                    </Radio.Group>
                    </>
                }
                onFilterSubmit={onFilterSubmit}
                filterValue={{ confirmStatus }}
                searchFormItems={[
                    {
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入项目名称/受益人名称/申请人进行查询" style={{ width: 300 }} />
                    },
                    {
                        name: 'startRefundTime',
                        label: '申请日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'approvalStatus',
                        label: '审批状态',
                        children: (
                            <Select style={{ width: 120 }} placeholder="请选择">
                                <Option value="1">全部</Option>
                                <Option value="2">审批中</Option>
                                <Option value="3">已通过</Option>
                            </Select>
                        )
                    }
                ]}
            />
        </>
    )
}