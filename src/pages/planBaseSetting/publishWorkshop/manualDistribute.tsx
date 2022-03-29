import React, { Key, ReactElement, useState } from "react"
import { Button, Form, Input, Modal, Radio, Select } from "antd"
import { Page } from "../../common"
import { welding, workShopOrder } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
export default function ManualDistribute(): ReactElement {
    const [form] = Form.useForm()
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    const [status, setStatus] = useState<number>(1)
    const [refresh, setRefrensh] = useState<boolean>(false)

    const { data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/list`);
            resole(result.records || [])
        } catch (error) {
            reject(error)
        }
    }), {})
    const { data: weldingData, run: weldingRun } = useRequest<any>((params) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.put(`/tower-aps/workshopOrder/manualDistribute`, params);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const handleClick = () => {
        Modal.confirm({
            title: "手动分配车间",
            icon: null,
            content: <Form form={form}>
                <Form.Item name="" label="生产/组焊车间" rules={[{ required: true, message: "请选择生产/组焊车间..." }]}>
                    <Select>
                        {data.map((item: any) => <Select.Option value={item.factoryId}>{item.factoryName}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>,
            onOk: async () => {

            }
        })
    }
    return <Page
        path={`/tower-aps/workshopOrder/${status === 1 ? "structure" : "welding"}`}
        sourceKey={"data.galvanizedDailyPlanVOS"}
        refresh={refresh}
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
                    onChange={(event) => {
                        setStatus(event.target.value)
                        setRefrensh(!refresh)
                    }}
                >
                    <Radio.Button value={1}>构建明细</Radio.Button>
                    <Radio.Button value={2}>组焊明细</Radio.Button>
                </Radio.Group>
                <Button type="primary" onClick={handleClick}>手动分配车间</Button>
            </>
        }
        searchFormItems={[
            {
                name: 'materialName',
                label: '材料',
                children: <Input />
            },
            {
                name: 'structureTexture',
                label: '材质',
                children: <Input />
            },
            {
                name: 'processWorkshop',
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