/***
 * 保函申请
 * 2021/11/22
 */
import React, { useState } from 'react';
import { Button, Input, DatePicker, Radio, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import { Page } from '../common';
import { collectionListHead, approvalStatus } from "./applicationColunm.json";
import RequestUtil from '../../utils/RequestUtil';

// 引入填写保函信息的弹框
import FillGuaranteeInformation from './fillGuaranteeInformation';
// 引入回收保函信息的弹框
import RecoveryGuaranteeLayer from './recoveryGuarantee';
// 引入查看保函申请
import SeeGuarantee from './seeGuarantee';

const { Option } = Select;

export default function ApplicationColunm() {
    const history = useHistory();
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [ visible, setVisible ] = useState<boolean>(false);
    const [visibleRecovery, setVisibleRecovery] = useState<boolean>(false);
    const [ visibleSee, setVisibleSee ] = useState<boolean>(false);
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startRefundTime = formatDate[0]
            value.endRefundTime = formatDate[1]
        }
        if (value.issuanceDateTime) {
            const formatDate = value.issuanceDateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startRefundTime = formatDate[0]
            value.endRefundTime = formatDate[1]
        }
        if (value.guaranteeTime) {
            const formatDate = value.guaranteeTime.map((item: any) => item.format("YYYY-MM-DD"))
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

    // 新增回调
    const handleOk = () => {
        setVisible(false);
    }

    // 回收保函信息
    const handleOkuseState = (data: object, callBack: any) => {
        // setVisibleRecovery(false);
        setTimeout(() => {
            callBack();
            setVisibleRecovery(false);
        }, 1000);
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
                                        <Button type="link" onClick={() => setVisibleSee(true)}>查看</Button>
                                        <Button type="link" onClick={() => setVisible(true)}>填写保函信息</Button>
                                        <Button type="link">生成文件</Button>
                                    </>
                                )
                            } else if (record.confirmStatus === 1) {
                                return (
                                    <>
                                        <Button type="link" onClick={() => setVisibleSee(true)}>查看</Button>
                                        <Button type="link" onClick={() => setVisibleRecovery(true)}>回收保函</Button>
                                    </>
                                )
                            }
                            return <Button type="link" onClick={() => setVisibleSee(true)}>查看</Button>
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
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'issuanceDateTime',
                        label: '出具日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'guaranteeTime',
                        label: '保函交回日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
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
            {/* 填写保函信息 */}
            <FillGuaranteeInformation
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleOk}
            />
            {/* 回收保函弹框 */}
            <RecoveryGuaranteeLayer
                visible={visibleRecovery}
                onCancel={() => setVisibleRecovery(false)}
                onOk={handleOkuseState}
            />
            {/* 查看保函申请 */}
            <SeeGuarantee
                visible={visibleSee}
                onCancel={() => setVisibleSee(false)}
                onOk={() => setVisibleSee(false)}
            />
        </>
    )
}