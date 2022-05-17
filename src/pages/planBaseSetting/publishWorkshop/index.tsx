import React, { Key, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, DatePicker, Form, Input, message, Modal, Radio, Row, Select } from "antd"
import { CommonTable, DetailTitle, SearchTable as Page } from "../../common"
import { pageTable, workShopOrder, componentdetails } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { productTypeOptions } from "../../../configuration/DictionaryOptions"

export default () => {
    const history = useHistory()
    const [weldingForm] = Form.useForm()
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({ status: 1 });
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const [tableDataSource, setTableDataSource] = useState<any[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    const [status, setStatus] = useState<number>(1)
    const tableColumns = [
        {
            title: '零件号',
            dataIndex: 'code',
            width: 150,
        },
        {
            title: '生产环节',
            dataIndex: 'linkName',
            width: 150,
        },
        {

            title: "生产单元",
            dataIndex: 'unitNames',
            width: 150,
        },
        {
            title: '操作',
            dataIndex: 'unit',
            width: 180,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "unit"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择生产单元"
                }]}>
                    <Select>
                        {record?.unitVOList && record?.unitVOList.map(({ id, name }:any, index:number) => {
                            return <Select.Option key={index} value={id+','+name}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        }
    ]

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
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/welding`);
            resole(result || [])
        } catch (error) {
            reject(error)
        }
    }))

    const { run: weldingRun } = useRequest<any>((params) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/workshopOrder/welding/distribution`, params);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleAuto = async () => {
        const result = await run(selectedRowKeys)
        console.log(result, "----")
        if (result?.code === 200) {
            result?.data&&result?.data?.needUpdateList&&result?.data?.needUpdateList.length>0&&setTableDataSource(result?.data?.needUpdateList);
            result?.data&&result?.data?.needUpdateList&&result?.data?.needUpdateList.length>0&&form.setFieldsValue({
                list: result?.data?.needUpdateList
            })
            if((result?.data&&result?.data?.needUpdateList&&result?.data?.needUpdateList.length>0)||(result?.data&&result?.data?.needUpdateList&&result?.data?.needUpdateList.length>0)){
                Modal.confirm({
                    title: "分配生产单元提示",
                    icon: null,
                    okText: "确定",
                    width:'80%',
                    content: <>
                        {result?.data&&result?.data?.needUpdateList&&result?.data?.needUpdateList.length>0&&<>
                            <DetailTitle  title='构件匹配到多个生产单元，请选择生产单元'/>
                            <Form form={form}>
                                <CommonTable
                                    // rowKey="id"
                                    dataSource={[...tableDataSource]}
                                    pagination={false}
                                    columns={ tableColumns }
                                />
                            </Form>
                        </>}
                        {result?.data&&result?.data?.notMatchList&&result?.data?.notMatchList.length>0&&<>
                            <DetailTitle  title='构件未匹配到生产单元，请配置分配规则'/>
                            <CommonTable columns={componentdetails} dataSource={result?.data?.notMatchList|| []} />
                        </>}
                    </>,
                    onOk: async () => {
                        if(result?.data&&result?.data?.needUpdateList&&result?.data?.needUpdateList.length>0){
                            await form.validateFields()
                            const value = form.getFieldsValue(true)?.list
                            const submitValue = value.map((item:any,index:number)=>{
                                return {
                                    unitId: item.unit.split(',')[0],
                                    unitName: item.unit.split(',')[1],
                                    structureCycleIds: tableDataSource[index]?.structureCycleIds,
                                }
                            })
                            RequestUtil.post(`/tower-aps/workshopOrder/distribute/productionUnit`,submitValue).then(()=>{
                                message.success("快速分配单元完成")
                                history.go(0)
                            })
                        }
                        else{
                            history.go(0)
                        }
                        
                    }
                })
            }else{
                await message.success("快速分配单元完成")
                history.go(0)
            }
            
        } else {
            await message.success("快速分配单元完成")
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
                        {listData.map((item: any) => <Select.Option
                            key={item.weldingWorkshopId}
                            value={item.weldingWorkshopId}>{item.weldingWorkshopName}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>,
            onOk: async () => new Promise(async (resove, reject) => {
                const workshop = await weldingForm.validateFields()
                try {
                    await weldingRun({
                        workshopId: workshop.workshopId,
                        workshopName: listData.find((item: any) => item.weldingWorkshopId === workshop.workshopId).weldingWorkshopName,
                        issueOrderIds: selectedRowKeys
                    })
                    resove(true)
                    await message.success("电焊分配车间完成...")
                    setSelectedRowKeys([])
                    weldingForm.resetFields()
                    history.go(0)
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            }),
            onCancel: () => weldingForm.resetFields()
        })
    }

    return <Page
        path="/tower-aps/workshopOrder"
        filterValue={filterValue}
        columns={status === 1 ? [
            ...pageTable,
            {
                title: "操作",
                width: 160,
                fixed: "right",
                dataIndex: "opration",
                render: (_, record: any) => <>
                    <Link to={`/planProd/publishWorkshop/structure/${record.id}/${record.issuedNumber}/${record.productCategory}`}><Button type="link" size="small">构件明细</Button></Link>
                    <Link to={`/planProd/publishWorkshop/welding/${record.id}/${record.issuedNumber}/${record.productCategory}`}><Button type="link" size="small">组焊明细</Button></Link>
                </>
            }] : [
            ...workShopOrder,
            {
                title: "操作",
                width: 100,
                fixed: "right",
                dataIndex: "opration",
                render: (_, record: any) => <Link
                    to={`/planProd/publishWorkshop/manual/${record.id}/${record.issuedNumber}/${record.productCategory}`}
                >手动分配生产单元</Link>
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
                    {/* <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={handleWeldingClick}>电焊分配车间</Button> */}
                    <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={handleAuto}>快速分配单元</Button>
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