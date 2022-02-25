import React from 'react'
import { Button, Input, Select, Form } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import { particulars } from "./contract.json";

export default function Particulars(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const onFilterSubmit = (value: any) => {
        value.contractId = params.id
        return value
    }

    return (<Page
        path="/tower-storage/receiveStock/detail"
        onFilterSubmit={onFilterSubmit}
        exportPath="/tower-storage/receiveStock/detail"
        extraOperation={(data) => {
            return (
                <>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    <span style={{ marginLeft: "20px" }}>
                        已收货：重量(支)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data?.receiveStockMessage?.receiveWeight || 0}</span>
                        价税合计(元)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data?.receiveStockMessage?.receivePrice || 0}</span>
                        未收货：重量(支)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data?.receiveStockMessage?.waitWeight || 0}</span>
                        价税合计(元)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{data?.receiveStockMessage?.waitPrice || 0}</span>
                    </span>
                </>
            )
        }
        }
        filterValue={{ contractId: params.id }}
        searchFormItems={[
            {
                name: 'receiveStatus',
                label: '采购状态',
                children: <Form.Item name="receiveStatus" initialValue="">
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        <Select.Option value={''} key="3">全部</Select.Option>
                        <Select.Option value={0} key="0">待收货</Select.Option>
                        <Select.Option value={1} key="1">已收货</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'receiveNumber',
                children: <Input placeholder="请输入收货单进行查询" style={{ width: 300 }} />
            },
        ]}
        columns={[
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                fixed: "left",
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...particulars,
            // v1.1去除质保单以及质检单
            // {
            //     key: 'operation',
            //     title: '操作',
            //     dataIndex: 'operation',
            //     fixed: "right",
            //     render: (_: any, records: any) => <>
            //         <Button type="link" onClick={() => { }}>质保单</Button>
            //         <Button type="link" onClick={() => { }}>质检单</Button>
            //     </>
            // }
        ]}
    />)
}