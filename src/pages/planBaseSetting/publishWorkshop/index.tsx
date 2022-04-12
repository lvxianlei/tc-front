import React, { Key, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, message, Modal, Radio, Row, Select } from "antd"
import { SearchTable as Page } from "../../common"
import { pageTable, workShopOrder } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { productTypeOptions } from "../../../configuration/DictionaryOptions"

export default () => {
    const history = useHistory()
    const [weldingForm] = Form.useForm()
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

    const { data: listData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
            resole(result.records || [])
        } catch (error) {
            reject(error)
        }
    }))

    const { run: weldingRun } = useRequest<any>((params) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/workshopOrder/welding/distribution`, params);
            message.success("电焊分配车间完成...")
            setSelectedRowKeys([])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

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
            history.go(0)
        }
    }

    const handleWeldingClick = async () => {
        Modal.confirm({
            icon: null,
            title: "电焊分配车间",
            content: <Form form={weldingForm}>
                <Form.Item name="workshopId" label="电焊车间" rules={[{ required: true, message: "请选择组焊车间..." }]}>
                    <Select>
                        {listData.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>,
            onOk: async () => {
                const workshop = await weldingForm.validateFields()
                return weldingRun({
                    workshopId: workshop.workshopId,
                    workshopName: listData.find((item: any) => item.id === workshop.workshopId).name,
                    issueOrderIds: selectedRowKeys
                })
            }
        })
    }

    return <Page
        path="/tower-aps/workshopOrder"
        filterValue={filterValue}
        columns={status === 1 ? [
            ...pageTable,
            {
                title: "操作",
                width: 100,
                fixed: "right",
                dataIndex: "opration",
                render: (_, record: any) => <>
                    <Link to={`/planProd/publishWorkshop/welding/${record.id}`}><Button type="link" size="small">构件明细</Button></Link>
                    <Link to={`/planProd/publishWorkshop/structure/${record.id}`}><Button type="link" size="small">组焊明细</Button></Link>
                </>
            }] : [
            ...workShopOrder,
            {
                title: "操作",
                width: 50,
                fixed: "right",
                dataIndex: "opration",
                render: (_, record: any) => <Link
                    to={`/planProd/publishWorkshop/manual/${record.id}`}
                >手动分配车间</Link>
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
                {status === 1 && <>
                    <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={handleWeldingClick}>电焊分配车间</Button>
                    <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={handleAuto}>快速分配车间</Button>
                </>}
            </>
        }
        searchFormItems={[
            {
                name: 'productType',
                label: '产品类型',
                children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
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
                delete values.time
            }
            return values;
        }}
    />
}