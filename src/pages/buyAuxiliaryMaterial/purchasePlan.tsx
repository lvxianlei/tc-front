import React, { useState, useRef } from 'react';
import { Modal, Button, DatePicker, Select, Input, message, Space } from 'antd';
import { IntgSelect, SearchTable as Page } from '../common'
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import { purchasePlan } from './purchasePlan.json'
import useRequest from '@ahooksjs/use-request';
import Edit from "./edit";
interface TaskAssignRef {
    onSubmit: () => void
    resetFields: () => void
    onSubmitApproval: () => void
    onSubmitCancel: () => void
}
export default function PurchasePlan() {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [id, setId] = useState<string>("")
    const [type, setType] = useState<"new" | "edit">("new")
    // 选中数据列表
    const [generateIds, setGenerateIds] = useState<string[]>([])
    // 筛选组
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        inquirer: history.location.state ? sessionStorage.getItem('USER_ID') : "",
        purchaseType: 1
    })
    const editRef = useRef<TaskAssignRef>({ onSubmit: () => { }, resetFields: () => { }, onSubmitApproval: () => { }, onSubmitCancel: () => { } })
    // 模态窗
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleCancel = () => {
        // setType('new')
        editRef.current?.resetFields();
        setId("")
        setIsModalVisible(false);
        history.go(0)
    };

    // 汇总request
    const selectMerge = async () => {
        const result: { [key: string]: any } = await RequestUtil.post('/tower-supply/auxiliaryMaterialPurchasePlan/collect', generateIds)
    }

    const buttons: {} | null | undefined = [
        <Button onClick={() => handleCancel()} key='close'>关闭</Button>,
        <Button type="primary" onClick={async () => {
            console.log(generateIds)
            if (!editRef.current) {
                message.warning("请先选择辅材...")
                return
            }

            // planPurchaseNum

            await editRef.current?.onSubmit();
            setIsModalVisible(false);
            history.go(0)
        }} key='submit'>提交</Button>,
        <Button type="primary" onClick={async () => {
            console.log(generateIds)
            if (!editRef.current) {
                message.warning("请先选择辅材...")
                return
            }

            // planPurchaseNum

            await editRef.current?.onSubmitApproval();
            setIsModalVisible(false);
            history.go(0)
        }} key='submit'>保存并提交审批</Button>
    ]
    const buttonsEdit: {} | null | undefined = [
        <Button onClick={() => handleCancel()} key='close'>关闭</Button>,
        <Button type="primary" onClick={async () => {
            console.log(generateIds)
            if (!editRef.current) {
                message.warning("请先选择辅材...")
                return
            }

            // planPurchaseNum

            await editRef.current?.onSubmit();
            setIsModalVisible(false);
            history.go(0)
        }} key='submit'>提交</Button>,
        <Button type="primary" onClick={async () => {
            console.log(generateIds)
            if (!editRef.current) {
                message.warning("请先选择辅材...")
                return
            }
            await editRef.current?.onSubmitApproval();
            setIsModalVisible(false);
            history.go(0)
        }} key='submit'>保存并提交审批</Button>,
        <Button type="primary" onClick={async () => {
            await editRef.current?.onSubmitCancel();
            setIsModalVisible(false);
            history.go(0)
        }} key='submit'>撤销审批</Button>
    ]
    const onFilterSubmit = (value: any) => {
        if (value.createTime) {
            const formatDate = value.createTime.map((item: any) => item.format("YYYY-MM-DD"))
            delete value.createTime
            value.startCreateTime = formatDate[0] + ' 00:00:00';
            value.endCreateTime = formatDate[1] + ' 23:59:59';
        } else {
            value.startCreateTime = null
            value.endCreateTime = null
        }
        if (value.applyName) {
            value.purchaserId = value.applyName.value
        } else {
            value.purchaserId = null
        }
        // setFilterValue({ ...filterValue, ...value })
        return value
    }
    return (
        <>
            <Page
                path="/tower-supply/auxiliaryMaterialPurchasePlan"
                exportPath="/tower-supply/auxiliaryMaterialPurchasePlan"
                refresh={refresh}
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...purchasePlan.map((item: any) => {
                        return ({ ...item })
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 120,
                        render: (_: any, records: any) => <Space>
                            <Button type="link" className="btn-operation-link" onClick={
                                () => { setId(records.id) }
                            }>
                                <Link className="btn-operation-link" to={{
                                    pathname: `/buyAuxiliaryMaterial/purchasePlan/${records.id}`,
                                    search: `${records.purchasePlanNumber || records.collectPurchasePlanNumber},${records.repurchaseTime == null ? '' : records.repurchaseTime},${records.purchasePlanStatus},${records.collectPurchasePlanNumber ? 1 : 0}`
                                }}>采购清单</Link>
                            </Button>
                            <Button type="link" className="btn-operation-link" onClick={() => {
                                setType('edit')
                                console.log(records.id)
                                setId(records.id)
                                setIsModalVisible(true)
                            }}>
                                编辑
                            </Button>
                        </Space>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<>
                    <Button type="primary" ghost onClick={() => {
                        editRef.current?.resetFields()
                        setType('new')
                        setIsModalVisible(true)
                    }}>创建采购计划</Button>
                    <Button type="primary" ghost onClick={() => {
                        if (!generateIds.length) {
                            return message.warn('请选择采购计划')
                        }
                        Modal.confirm({
                            title: "汇总",
                            content: "确定汇总计划吗？",
                            onOk: async () => {
                                await selectMerge()
                                message.success("操作成功")
                                setRefresh(!refresh)
                                history.go(0)
                            }
                        })
                    }}>采购计划汇总</Button>
                </>}
                searchFormItems={[
                    {
                        name: 'planStatus',
                        label: '计划状态',
                        children: <Select style={{ width: 100 }}>
                            <Select.Option value="" key="">全部</Select.Option>
                            <Select.Option value={1} key={1}>待完成</Select.Option>
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                            <Select.Option value={3} key={3}>已取消</Select.Option>
                        </Select>
                    },
                    {
                        name: 'createTime',
                        label: '创建日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'collectType',
                        label: '汇总状态',
                        children: <Select style={{ width: 100 }}>
                            <Select.Option value="" key="">全部</Select.Option>
                            <Select.Option value={0} key={0}>未汇总</Select.Option>
                            <Select.Option value={1} key={1}>已汇总</Select.Option>
                        </Select>
                    },
                    {
                        name: 'approval',
                        label: '审批状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                            <Select.Option value="0">待发起</Select.Option>
                            <Select.Option value="1">审批中</Select.Option>
                            <Select.Option value="2">审批通过</Select.Option>
                            <Select.Option value="3">审批驳回</Select.Option>
                            <Select.Option value="4">已撤销</Select.Option>
                        </Select>
                    },
                    // todo 申请人字段未返回
                    {
                        name: 'purchaserId',
                        label: '申请人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'materialName',
                        label: '品名',
                        children: <Input placeholder="请输入品名" style={{ width: 150 }} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '模糊查询',
                        children: <Input placeholder="采购任务编号/使用部门" style={{ width: 260 }} maxLength={200} />
                    }
                ]}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: generateIds,
                        onChange: (selectedRowKeys: any[]) => {
                            setGenerateIds(selectedRowKeys)
                        },
                        getCheckboxProps: (record: any) => record.collectType === 1
                    }
                }}
            />
            <Modal width={1011} title={type === 'new' ? "创建采购计划" : '编辑采购计划'} visible={isModalVisible} footer={type === 'new' ? buttons : buttonsEdit} onCancel={handleCancel}
                onOk={() => { }}
            >
                <Edit ref={editRef} id={id} type={type} visibleP={isModalVisible} />
            </Modal>
        </>
    )
}