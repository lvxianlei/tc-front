import React, { useState } from "react"
import { Button, Input, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IntgSelect, SearchTable as Page } from '../../common'
import { baseInfoList } from "./planListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import CreatePlan from "./CreatePlan";

export default function Invoicing() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({
        ...history.location.state as object,
        purchaserId: history.location.state ? sessionStorage.getItem('USER_ID') : "",
    })
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>('');
    const [operationType, setOperationType] = useState<'create'|'edit'>('create');
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
            value.purchaserId = value.purchaserId.value
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
                        width: 120,
                        render: (_: any, record: any) => {
                            return <>
                                <Link className="btn-operation-link" to={{
                                    pathname: `/ingredients/planList/purchaseList/${record.id}/${record.purchaseType}/${record.purchasePlanStatus}`,
                                    search: `productionBatchNos=${record.productionBatchNos}`
                                }}>采购清单</Link>
                                <Button
                                    type="link"
                                    disabled={record.purchasePlanStatus === 2}
                                    onClick={
                                        () => {
                                            setIsOpenId(true)
                                            setEditId(record.id)
                                            setOperationType("edit")
                                        }
                                    }
                                >编辑</Button>
                            </>
                        }
                    }]}
                extraOperation={<Button type="primary" ghost onClick={() =>{ 
                    setIsOpenId(true)
                    setEditId('')
                    setOperationType("create")
                }}>创建采购计划</Button>}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                searchFormItems={[
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
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="采购计划编号" style={{ width: 300 }} />
                    }
                ]}
            />
            <CreatePlan
                visible={isOpenId}
                handleCreate={handleCreate}
                id={editId}
                type={operationType}
            />
        </>
    )
}
