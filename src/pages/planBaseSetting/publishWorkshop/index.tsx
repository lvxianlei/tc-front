import React, { Key, useState } from "react"
import { Link } from "react-router-dom"
import { Button, DatePicker, Input, message, Modal, Radio, Row, Select } from "antd"
import { Page } from "../../common"
import { pageTable, workShopOrder } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"

export default () => {
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({ status: 1 });
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    const [status, setStatus] = useState<number>(1)
    const { data, run } = useRequest<any>((params: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/workshopOrder/autoDistribute`, params);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleAuto = async () => {
        await run(selectedRowKeys)
        if (data?.length) {
            Modal.warn({
                title: "自动分配车间",
                icon: null,
                okText: "确定",
                content: <nav>
                    <h6>以下下达单未匹配到生产车间</h6>
                    <ul>
                        { }
                    </ul>
                    <Row><h6>请配置分配规则</h6></Row>
                </nav>
            })
        } else {
            message.success("自动分配车间完成")
        }
    }

    return <Page
        path="/tower-aps/workshopOrder"
        filterValue={filterValue}
        columns={status === 1 ? pageTable : [...workShopOrder, {
            title: "操作",
            width: 50,
            fixed: "right",
            dataIndex: "opration",
            render: (_, record: any) => <Link
                to={`/planProd/publishWorkshop/${record.id}`}
            ><Button type="link">手动分配车间</Button></Link>
        }]}
        extraOperation={
            <>
                <Radio.Group
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value)
                        setFilterValue({ ...filterValue, status: event.target.value })
                    }}
                >
                    <Radio.Button value={1}>待分配下达单</Radio.Button>
                    <Radio.Button value={2}>已分配下达单</Radio.Button>
                </Radio.Group>
                {status === 1 && <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={handleAuto}>自动分配车间</Button>}
            </>
        }
        searchFormItems={[
            {
                name: 'pleasePayStatus',
                label: '产品类型',
                children: <Select style={{ width: 200 }} defaultValue="全部">
                    <Select.Option value="">全部</Select.Option>
                    <Select.Option value="1">已创建</Select.Option>
                    <Select.Option value="2">待付款</Select.Option>
                    <Select.Option value="3">部分付款</Select.Option>
                    <Select.Option value="4">已付款</Select.Option>
                </Select>
            },
            {
                name: 'time',
                label: '生产下达日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="计划号/塔型/下达单号" style={{ width: 300 }} />
            }
        ]}
        tableProps={status === 1 ? {
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }
        } : {}}
        onFilterSubmit={(values: any) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />
}