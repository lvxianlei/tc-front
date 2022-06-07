import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IntgSelect, SearchTable as Page } from '../../common'
import { baseInfoList } from "./planListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
// 引入编辑采购计划
import EditPurchasePlan from './EditPurchasePlan';
import CreatePlan from "./CreatePlan";
interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}
export default function Invoicing() {
    const [visible, setVisible] = useState<boolean>(false);
    const addRef = useRef<EditRefProps>();
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({
        ...history.location.state as object,
        purchaserId: history.location.state ? sessionStorage.getItem('USER_ID') : "",
    })
    const [id, setId] = useState<string>();
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.purchaserId) {
            value.purchaserDeptId = value.purchaserId.first
            value.purchaserId = value.purchaserId.second
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "取消计划",
            content: "确定取消此计划吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteRun(id)
                    await message.success("计划已取消...")
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    // 编辑采购计划回调
    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("编辑回调计划成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    // 创建采购计划关闭
    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }

    return (
        <>
            <Page
                path="/tower-supply/materialPurchasePlan"
                exportPath={`/tower-supply/materialPurchasePlan`}
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        width: 40,
                        render: (_: any, _a: any, index: number) => <>{index + 1}</>
                    },
                    ...baseInfoList.map((item: any) => {
                        switch (item.dataIndex) {
                            case "roundSteelTotal":
                                return ({ ...item, render: (_: any, record: any) => `${record.roundSteelArrival} / ${record.roundSteelTotal}` })
                            case "angleSteelTotal":
                                return ({ ...item, render: (_: any, record: any) => `${record.angleSteelArrival} / ${record.angleSteelTotal}` })
                            case "steelPlateTotal":
                                return ({ ...item, render: (_: any, record: any) => `${record.steelPlateArrival} / ${record.steelPlateTotal}` })
                            default:
                                return item
                        }
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 80,
                        render: (_: any, record: any) => {
                            return <>
                                {/* <Link className="btn-operation-link" to={`/ingredients/planList/relationTower/${record.id}`}>关联塔型</Link> */}
                                <Link className="btn-operation-link" to={{
                                    pathname: `/ingredients/planList/purchaseList/${record.id}`,
                                    search: `productionBatchNos=${record.productionBatchNos}`
                                }}>采购清单</Link>
                                {/* <Button type="link" className="btn-operation-link" disabled={record.purchasePlanStatus === 3} onClick={() => handleDelete(record.id)}>取消计划</Button>
                                <Button type="link" disabled={record.purchasePlanStatus === 2} className="btn-operation-link" onClick={() => {
                                    setId(record.id);
                                    setVisible(true);
                                }}>编辑计划</Button> */}
                            </>
                        }
                    }]}
                extraOperation={<Button type="primary" ghost onClick={() => setIsOpenId(true)}>创建采购计划</Button>}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'startStatusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'planStatus',
                        label: '计划状态',
                        children: <Select style={{ width: 200 }}>
                            <Select.Option value="1">待完成</Select.Option>、
                            <Select.Option value="2">已完成</Select.Option>
                            <Select.Option value="3">已取消</Select.Option>
                        </Select>
                    },
                    {
                        name: 'purchaseType',
                        label: '采购类型',
                        children: <Select style={{ width: 200 }}>
                            <Select.Option value="1">配料采购</Select.Option>
                            <Select.Option value="2">库存采购</Select.Option>
                            <Select.Option value="3">缺料采购</Select.Option>
                        </Select>
                    },
                    {
                        name: 'purchaserId',
                        label: '采购人',
                        children: <IntgSelect width={400} />
                    },
                    {
                        name: 'purchasePlanCode',
                        label: '采购计划编号',
                        children: <Input />
                    }
                ]}
            />
            {/* <Modal
                title={'编辑采购计划'}
                visible={visible}
                width={1000}
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button key="back" onClick={() => {
                        addRef.current?.resetFields();
                        setVisible(false);
                    }}>
                        关闭
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleOk()}>
                        保存并提交
                    </Button>
                ]}
            >
                <EditPurchasePlan ref={addRef} id={id} />
            </Modal> */}
            <CreatePlan
                visible={isOpenId}
                handleCreate={handleCreate}
            />
        </>
    )
}
