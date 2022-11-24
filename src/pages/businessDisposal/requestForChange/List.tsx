/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-明细变更申请
 */

import React, { useEffect, useRef, useState } from "react";
import { Space, Input, DatePicker, Select, Button, Form, message, Popconfirm, Row, Col, TreeSelect, Modal, TablePaginationConfig, Spin } from "antd";
import { FixedType } from "rc-table/lib/interface";
import styles from "./RequestForChange.module.less";
import { useHistory } from "react-router-dom";
import Page, { IResponseData } from "../../common/Page";
import RequestUtil from "../../../utils/RequestUtil";
import useRequest from "@ahooksjs/use-request";
import SelectUser from "../../common/SelectUser";
import { useForm } from "antd/lib/form/Form";
import { CommonTable } from "../../common";
import ApplyForChange from "./ApplyForChange";
import ApplyOrDetail from "./ApplyOrDetail";
import { columns, detailColumns } from "./requestForChange.json"

interface EditRefProps {
    onSubmit: () => void;
    resetFields: () => void;
    onSave: () => void;
    onPass: () => void;
    onReject: () => void;
}

export default function List(): React.ReactNode {
    const history = useHistory();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [visible, setVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const addRef = useRef<EditRefProps>();
    const detailRef = useRef<EditRefProps>();
    const [type, setType] = useState<"new" | "edit">("new");
    const [rowId, setRowId] = useState<string>();
    const [searchForm] = useForm();
    const [detailData, setDetailData] = useState<any>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })

    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])


    const { loading, data, run } = useRequest<any[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-science/productChange`, { current: pagenation?.current || 1, size: pagenation?.size || 10, ...filterValue });
        setPage({ ...data });
        if (data.records.length > 0 && data.records[0]?.id) {
            detailRun(data.records[0]?.id)
        } else {
            setDetailData([]);
        }
        resole(data?.records);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/productChange/detail/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSave()
            message.success("保存成功！")
            setVisible(false)
            addRef.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleLaunchOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("保存并发起成功！")
            setVisible(false)
            addRef.current?.resetFields();
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const searchItems = [
        {
            name: "updateStatusTime",
            label: "最新状态变更时间",
            children: <DatePicker.RangePicker />
        },
        {
            name: "examineStatus",
            label: "审批状态",
            children: <Select placeholder="请选择审批状态">
                <Select.Option key={1} value={1}>未发起</Select.Option>
                <Select.Option key={2} value={2}>待审批</Select.Option>
                <Select.Option key={3} value={3}>审批中</Select.Option>
                <Select.Option key={4} value={4}>已通过</Select.Option>
                <Select.Option key={5} value={5}>已撤回</Select.Option>
                <Select.Option key={0} value={0}>已拒绝</Select.Option>
            </Select>
        },
        {
            name: "userIdName",
            label: "发起人",
            children: <Input size="small" style={{ width: "80%" }} disabled suffix={[
                <SelectUser requests={{ deptName: "" }} onSelect={(selectedRows: Record<string, any>) => {
                    searchForm?.setFieldsValue({
                        userId: selectedRows[0]?.userId,
                        userIdName: selectedRows[0]?.name
                    })
                }} />
            ]} />
        },
        {
            name: "fuzzyMsg",
            label: "模糊查询项",
            children: <Input style={{ width: "300px" }} placeholder="计划号/单号/塔型/工程名称/说明" />
        }
    ]


    const onFilterSubmit = (values: Record<string, any>) => {
        if (values?.updateStatusTime) {
            const formatDate = values?.updateStatusTime?.map((item: any) => item.format("YYYY-MM-DD"));
            values.updateStatusTimeStart = formatDate[0] + " 00:00:00";
            values.updateStatusTimeEnd = formatDate[1] + " 23:59:59";
        }
        values.userId = searchForm?.getFieldsValue(true)?.userId
        setFilterValues(values);
        run({}, values)
    }

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key="Detail"
            visible={detailVisible}
            title={"详情"}
            footer={<Space direction="horizontal" size="small">
                <Button onClick={() => {
                    setDetailVisible(false);
                    addRef.current?.resetFields();
                }}>关闭</Button>
            </Space>}
            width="90%"
            onCancel={() => {
                setDetailVisible(false);
            }}>
            <ApplyOrDetail id={rowId} ref={detailRef} />
        </Modal>
        <Modal
            destroyOnClose
            key="RequestForChange"
            visible={visible}
            title={type === "new" ? "申请" : "编辑"}
            footer={<Space direction="horizontal" size="small">
                <Button onClick={handleOk} type="primary" loading={confirmLoading} ghost>保存并关闭</Button>
                <Button onClick={handleLaunchOk} type="primary" loading={confirmLoading} ghost>保存并发起</Button>
                <Button onClick={() => {
                    setVisible(false);
                    addRef.current?.resetFields();
                }}>关闭</Button>
            </Space>}
            width="90%"
            onCancel={() => {
                setVisible(false);
                addRef.current?.resetFields();
            }}>
            <ApplyForChange type={type} getLoading={(loading) => setConfirmLoading(loading)} id={rowId} ref={addRef} />
        </Modal>
        <Form form={searchForm} className={styles.bottom16} layout="inline" onFinish={(values: Record<string, any>) => onFilterSubmit(values)}>
            {
                searchItems?.map((res: any) => {
                    return <Form.Item name={res?.name} label={res?.label}>
                        {res?.children}
                    </Form.Item>
                })
            }
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button onClick={async () => {
                    searchForm?.resetFields();
                }}>重置</Button>
            </Form.Item>
        </Form>
        <Button type="primary" className={styles.bottom16} onClick={() => {
            setType("new");
            setVisible(true)
        }} ghost>申请</Button>
        <CommonTable
            className={styles.bottom16}
            haveIndex
            columns={[
                ...columns,
                {
                    key: "operation",
                    title: "操作",
                    width: 180,
                    dataIndex: "operation",
                    fixed: "right" as FixedType,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type="link" onClick={() => {
                                setRowId(record?.id);
                                setDetailVisible(true);
                            }}>详情</Button>
                            <Popconfirm
                                title="确认发起?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/productChange/submit/${record.id}`).then(res => {
                                        message.success("发起成功");
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={!(record.examineStatus === 1 || record.examineStatus === 5)}
                            >
                                <Button disabled={!(record.examineStatus === 1 || record.examineStatus === 5)} type="link">发起</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确认撤回?"
                                onConfirm={() => {
                                    RequestUtil.post(`/tower-science/productChange/retract/${record.id}`).then(res => {
                                        message.success("撤回成功");
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={record.examineStatus !== 2}
                            >
                                <Button disabled={record.examineStatus !== 2} type="link">撤回</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => {
                                    RequestUtil.delete(`/tower-science/productChange/${record.id}`).then(res => {
                                        message.success("删除成功");
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={!(record.examineStatus === 1 || record.examineStatus === 5)}
                            >
                                <Button disabled={!(record.examineStatus === 1 || record.examineStatus === 5)} type="link">删除</Button>
                            </Popconfirm>
                            <Button type="link" disabled={!(record.examineStatus === 1 || record.examineStatus === 5)} onClick={() => {
                                setRowId(record?.id);
                                setVisible(true);
                                setType("edit");
                            }}>编辑</Button>
                        </Space>
                    )
                }
            ]}
            dataSource={data}
            pagination={{
                current: page.current,
                pageSize: page.size,
                total: page?.total,
                showSizeChanger: true,
                onChange: handleChangePage
            }}
            onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })}
        />
        <CommonTable
            haveIndex
            columns={detailColumns}
            dataSource={detailData || []}
            pagination={false} />
    </Spin>
}