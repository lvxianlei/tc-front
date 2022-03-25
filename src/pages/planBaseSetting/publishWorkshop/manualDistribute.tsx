import React, { Key, ReactElement, useState } from "react"
import { Button, Form, Input, Modal, Radio, Select } from "antd"
import { Page } from "../../common"
import { welding, workShopOrder } from "./data.json"
export default function ManualDistribute(): ReactElement {
    const [form] = Form.useForm()
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    const [status, setStatus] = useState<number>(1)
    const handleClick = () => {
        Modal.confirm({
            title: "手动分配车间",
            icon: null,
            content: <Form form={form}>
                <Form.Item name="" label="生产/组焊车间" rules={[{ required: true, message: "请选择生产/组焊车间..." }]}>
                    <Select></Select>
                </Form.Item>
            </Form>
        })
    }
    return <Page
        path="/tower-aps/workshopOrder"
        columns={status === 1 ? welding : [...workShopOrder, {
            title: "操作",
            width: 100,
            fixed: "right",
            dataIndex: "opration",
            render: () => <Button type="link">手动分配车间</Button>
        }]}
        extraOperation={
            <>
                <Radio.Group
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                >
                    <Radio.Button value={1}>构建明细</Radio.Button>
                    <Radio.Button value={2}>组焊明细</Radio.Button>
                </Radio.Group>
                <Button type="primary" onClick={handleClick}>手动分配车间</Button>
            </>
        }
        searchFormItems={[
            {
                name: '',
                label: '材料',
                children: <Input />
            },
            {
                name: '',
                label: '材质',
                children: <Input />
            },
            {
                name: '',
                label: '规格',
                children: <Input />
            },
            {
                name: '',
                label: '加工车间',
                children: <Input />
            }
        ]}
        filterValue={filterValue}
        tableProps={status === 1 ? {
            rowSelection: {
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }
        } : {}}
        onFilterSubmit={(values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        }}
    />
}