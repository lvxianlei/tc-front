/***
 * 保函申请
 */
import React, { useState, useRef } from 'react';
import { Button, Input, DatePicker, Radio, message, Modal } from 'antd';
import moment from 'moment';
import useRequest from '@ahooksjs/use-request'
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import { SearchTable } from '../common';
import { collectionListHead, approvalStatus } from "./applicationColunm.json";
// 引入填写保函信息的弹框
import FillGuaranteeInformation from './fillGuaranteeInformation';
// 引入回收保函信息的弹框
import RecoveryGuaranteeLayer from './recoveryGuarantee';
// 引入查看保函申请
import SeeGuarantee from './seeGuarantee';
// 引入interface类型
import { EditRefProps } from './application';
import OverView from "./OverView";

export default function ApplicationColunm(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [clearSearch, setClearSearch] = useState<boolean>(false);
    const [acceptStatus, setAcceptStatus] = useState<number>(1);
    const [visible, setVisible] = useState<boolean>(false);
    const [visibleRecovery, setVisibleRecovery] = useState<boolean>(false);
    const [visibleSee, setVisibleSee] = useState<boolean>(false);
    const [visibleOverView, setVisibleOverView] = useState<boolean>(false);
    const [id, setId] = useState<string>();
    const [guaranteePrice, setGuaranteePrice] = useState<number>(0);
    const [effectiveTime, setEffectiveTime] = useState<string>("");
    const [requiredReturnTime, setRequiredReturnTime] = useState<string>("");
    const addRef = useRef<EditRefProps>();
    const addRecoveryRef = useRef<EditRefProps>()
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/guarantee/${id}`)
            resole(result)
            setVisibleSee(true);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        // 申请日期
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.applicantStartTime = `${formatDate[0]} 00:00:00`
            value.applicantEndTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        // 出具日期
        if (value.issuanceDateTime) {
            const formatDate = value.issuanceDateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.issuanceStartTime = `${formatDate[0]} 00:00:00`
            value.issuanceEndTime = `${formatDate[1]} 23:59:59`
            delete value.issuanceDateTime
        }
        // 保函交回日期
        if (value.guaranteeTime) {
            const formatDate = value.guaranteeTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.recoveryStartTime = `${formatDate[0]} 00:00:00`
            value.recoveryEndTime = `${formatDate[1]} 23:59:59`
            delete value.guaranteeTime
        }
        value["acceptStatus"] = acceptStatus;
        return value
    }

    // tab切换
    const operationChange = (event: any) => {
        setAcceptStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
        setClearSearch(!clearSearch);
    }

    // 新增回调
    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("回款信息新增成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    // 回收保函信息
    const handleOkuseState = () => new Promise(async (resove, reject) => {
        try {
            await addRecoveryRef.current?.onSubmit()
            message.success("回款保函新增成功...")
            setVisibleRecovery(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    // 保留小数
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
                path="/tower-finance/guarantee"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => {
                            return (
                                <span>
                                    {index + 1}
                                </span>
                            )
                        }
                    },
                    ...collectionListHead.map((item: any) => {
                        if (item.dataIndex === 'requiredReturnTime') {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => (
                                    <span
                                        style={{
                                            color: (
                                                acceptStatus === 2 && moment(record.requiredReturnTime).diff(moment(moment(new Date()).format("YYYY-MM-DD")), 'days') < 0)
                                                ?
                                                'red'
                                                : ''
                                        }}
                                    >
                                        {record.requiredReturnTime ? record.requiredReturnTime : ''}
                                    </span>
                                )
                            })
                        }
                        if (item.dataIndex === "guaranteePrice") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>
                                            {record.guaranteePrice ? changeTwoDecimal_f(record.guaranteePrice) : ''}
                                        </span>)
                                }
                            })
                        }
                        return item;
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 140,
                        render: (_: any, record: any) => {
                            return (
                                <>
                                    <Button type="link"
                                        className="btn-operation-link"
                                        onClick={() => {
                                            if (acceptStatus === 1) {
                                                setId(record.id);
                                                setVisibleOverView(true)
                                            } else {
                                                getUser(record.id)
                                                setId(record.id);
                                            }
                                        }}
                                    >查看</Button>
                                    {acceptStatus === 1 && <Button
                                        type="link"
                                        className="btn-operation-link"
                                        onClick={() => {
                                            setGuaranteePrice(record?.guaranteePrice || 0);
                                            setEffectiveTime(record?.effectiveTime || "");
                                            setVisible(true);
                                            setId(record.id);
                                        }}
                                    >填写保函信息</Button>}
                                    {acceptStatus === 2 && <Button
                                        className="btn-operation-link"
                                        type="link"
                                        onClick={() => {
                                            setVisibleRecovery(true);
                                            setId(record.id);
                                            setRequiredReturnTime(record.requiredReturnTime)
                                        }}
                                    >回收保函</Button>}
                                </>
                            )
                        }
                    }]}
                refresh={refresh}
                clearSearch={clearSearch}
                extraOperation={
                    <>
                        <Radio.Group
                            defaultValue={acceptStatus}
                            onChange={operationChange}>
                            {
                                approvalStatus.map((item: any, index: number) => {
                                    return <Radio.Button
                                        value={item.value}
                                        key={`${index}_${item.value}`}>{item.label}
                                    </Radio.Button>
                                })
                            }
                        </Radio.Group>
                    </>
                }
                onFilterSubmit={onFilterSubmit}
                filterValue={{ acceptStatus: acceptStatus }}
                searchFormItems={[
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
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入项目名称/受益人名称/申请人进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
            {/* 填写保函信息 */}
            <Modal
                title={'填写保函信息'}
                visible={visible}
                width={1000}
                maskClosable={false}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => handleOk()}
                    >
                        提交
                    </Button>,
                    <Button
                        key="back"
                        onClick={() => {
                            addRef.current?.resetFields();
                            setVisible(false);
                        }}
                    >
                        取消
                    </Button>
                ]}
            >
                <FillGuaranteeInformation ref={addRef} id={id} effectiveTime={effectiveTime} guaranteePrice={guaranteePrice} />
            </Modal>
            {/* 回收保函弹框 */}
            <Modal
                title={'回收保函'}
                visible={visibleRecovery}
                maskClosable={false}
                width={1000}
                onCancel={() => {
                    setVisibleRecovery(false)
                    addRecoveryRef.current?.resetFields();
                }}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => handleOkuseState()}
                    >
                        提交
                    </Button>,
                    <Button
                        key="back"
                        onClick={() => {
                            setVisibleRecovery(false)
                            addRecoveryRef.current?.resetFields();
                        }}
                    >
                        取消
                    </Button>
                ]}
            >
                <RecoveryGuaranteeLayer ref={addRecoveryRef} id={id} requiredReturnTime={requiredReturnTime} />
            </Modal>
            {/* 查看保函申请 */}
            <SeeGuarantee
                visible={visibleSee}
                userData={userData}
                id={id}
                acceptStatus={acceptStatus}
                onCancel={() => setVisibleSee(false)}
                onOk={() => setVisibleSee(false)}
            />
            <OverView
                visible={visibleOverView}
                id={id}
                acceptStatus={acceptStatus}
                onCancel={() => setVisibleOverView(false)}
                onOk={() => setVisibleOverView(false)}
            />
        </>
    )
}