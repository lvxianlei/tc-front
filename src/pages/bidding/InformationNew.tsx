import React from "react";
import { Button, TableColumnProps } from 'antd';
import { EditTable } from '../common'
export default function InfomationNew(): JSX.Element {
    const columns: TableColumnProps<object>[] = [
        {
            title: '状态',
            dataIndex: 'productStatus',
            render: (productStatus: number): React.ReactNode => {
                return productStatus === 1 ? '待下发' : productStatus === 2 ? '审批中' : '已下发'
            }
        },
        { title: '线路名称', dataIndex: 'lineName' },
        { title: '产品类型', dataIndex: 'productTypeName' },
        { title: '塔型', dataIndex: 'productShape' },
        { title: '杆塔号', dataIndex: 'productNumber' },
        { title: '电压等级（KV）', dataIndex: 'voltageGradeName' },
        { title: '呼高（米）', dataIndex: 'productHeight' },
        { title: '单位', dataIndex: 'unit' },
        {
            title: '数量',
            dataIndex: 'num',
            render: (num: number | string): React.ReactNode => {
                return num == -1 ? '' : num;
            }
        },
        { title: '单价', dataIndex: 'price' },
        { title: '金额', dataIndex: 'totalAmount' },
        { title: '标段', dataIndex: 'tender' },
        { title: '备注', dataIndex: 'description' },
        { title: '操作', dataIndex: 'opration',render:():React.ReactNode=><Button type="link">删除</Button> },
    ]
    return <EditTable columns={columns} dataSource={[]} />
}