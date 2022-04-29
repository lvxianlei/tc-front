import React, { FC, useCallback, useState } from "react"
import { useHistory } from "react-router-dom"
import { DatePicker, Dropdown, Input, Menu, Radio, Row, Space, Spin } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { SearchTable as Page } from "../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { tableHeader, commonHeader } from "./data.json"
import style from "./index.module.less"
interface CountObjProps {
    totalProcessNum: number
    totalHolesNum: number
    totalWeight: number
}
export default () => {
    const history = useHistory()
    const [columns, setColumns] = useState<any[]>(tableHeader)
    const [status, setStatus] = useState<string>()
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [filterStatus, setFilterStatus] = useState<{ [key: string]: any }>({})
    const [selectRows, setSelectRows] = useState<any[]>([])
    const [countObj, setCountObj] = useState<CountObjProps>({
        totalProcessNum: 0,
        totalHolesNum: 0,
        totalWeight: 0
    })
    const { loading: loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/planBoard?size=1000`)
            setStatus(result.records?.[0]?.productTypeId)
            setFilterValue({ ...filterValue, productTypeId: result.records?.[0]?.productTypeId })
            resole(result.records)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }))

    const handleChange = useCallback((data: string | number, name: string) => {
        const newfilterStatus = { ...filterStatus, [name]: data }
        setFilterValue({ ...filterValue, status: Object.keys(newfilterStatus).map((item: string) => `${item}-${newfilterStatus[item]}`).join(",") })
        setFilterStatus(newfilterStatus)
    }, [filterStatus, filterValue, setFilterValue, setFilterStatus])

    return <Spin spinning={loading}>
        <Page
            path="/tower-aps/planBoard"
            filterValue={filterValue}
            rowKey="onlyId"
            transformResult={(dataSource: any) => {
                setColumns([...tableHeader, ...dataSource.header.map(((item: any) => ({
                    title: item.productionLinks,
                    align: "center",
                    children: commonHeader.map((head: any) => {
                        if (head.code === "status") {
                            return ({
                                ...head,
                                title: <Dropdown
                                    overlay={(<Menu selectable onClick={({ key }) => handleChange(key, item.productionLinkIds)}>
                                        <Menu.Item key={3}>已下发</Menu.Item>
                                        <Menu.Item key={5} >已完成</Menu.Item>
                                        <Menu.Item key={6} >取消</Menu.Item>
                                        <Menu.Item key={7} >暂停</Menu.Item>
                                    </Menu>)}>
                                    <div className={style.dropdown}>
                                        <span>{head.title}</span>
                                        <DownOutlined />
                                    </div>
                                </Dropdown>,
                                code: `${item.productionLinkIds}-${head.code}`,
                                render: (value: any, records: any) => records.unitData[item.productionLinkIds]?.[head.code] || ""
                            })
                        }
                        return ({
                            ...head,
                            code: `${item.productionLinkIds}-${head.code}`,
                            render: (value: any, records: any) => records.unitData[item.productionLinkIds]?.[head.code] || ""
                        })
                    })
                })))])
                return ({
                    ...dataSource.planBoards,
                    records: dataSource.planBoards.records.map((item: any, index: number) => ({
                        ...item,
                        onlyId: `${item.id}-${index}`
                    }))
                })
            }}
            columns={columns}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: selectRows,
                    onChange: (selectRowKeys: any[], selectedRows: any[]) => {
                        const newCounts = selectedRows.reduce((result: CountObjProps, item: any) => ({
                            totalProcessNum: result.totalProcessNum + parseFloat(item.totalProcessNum || "0"),
                            totalHolesNum: result.totalHolesNum + parseFloat(item.totalHolesNum || "0"),
                            totalWeight: result.totalWeight + parseFloat(item.totalWeight || "0")
                        }), {
                            totalProcessNum: 0,
                            totalHolesNum: 0,
                            totalWeight: 0
                        })
                        setSelectRows(selectRowKeys)
                        setCountObj(newCounts)
                    }
                }
            }}
            extraOperation={
                <>
                    <Radio.Group
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value)
                            setFilterValue({ ...filterValue, productTypeId: event.target.value })
                        }}
                    >
                        {data?.map((item: any) => <Radio.Button
                            key={item.productTypeId}
                            value={item.productTypeId}>{item.productType}</Radio.Button>)}
                    </Radio.Group>
                    <Row style={{ width: "100%", paddingLeft: 20 }}>
                        <Space>
                            <span style={{ fontWeight: 600 }}>合计：</span>
                            <span>总件数：</span>{countObj.totalProcessNum}
                            <span>总孔数：</span>{countObj.totalHolesNum}
                            <span>总重量：</span>{countObj.totalWeight}
                        </Space>
                    </Row>
                </>
            }
            searchFormItems={[
                {
                    name: "planNum",
                    label: "计划号",
                    children: <Input placeholder="计划号" style={{ width: 150 }} />
                },
                {
                    name: "productCategoryName",
                    label: "塔型",
                    children: <Input placeholder="塔型" style={{ width: 150 }} />
                },
                {
                    name: "productionBatchNo",
                    label: "批次号",
                    children: <Input placeholder="批次号" style={{ width: 150 }} />
                },
                {
                    name: "voltageGradeName",
                    label: "电压等级",
                    children: <Input placeholder="电压等级" style={{ width: 150 }} />
                },
                {
                    name: "businessManagerName",
                    label: "业务经理",
                    children: <Input placeholder="业务经理" style={{ width: 150 }} />
                },
                {
                    name: "trialAssemble",
                    label: "试装类型",
                    children: <Input placeholder="试装类型" style={{ width: 150 }} />
                },
                {
                    name: "planDeliveryStartTime",
                    label: "计划交货日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "customerDeliveryStartTime",
                    label: "客户交货日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
            onFilterSubmit={(values: any) => {
                if (values.planDeliveryStartTime) {
                    const formatDate = values.planDeliveryStartTime.map((item: any) => item.format("YYYY-MM-DD"))
                    values.planDeliveryStartTime = formatDate[0] + ' 00:00:00';
                    values.planDeliveryEndTime = formatDate[1] + ' 23:59:59';
                    delete values.time
                }
                if (values.customerDeliveryStartTime) {
                    const formatDate = values.customerDeliveryStartTime.map((item: any) => item.format("YYYY-MM-DD"))
                    values.customerDeliveryStartTime = formatDate[0] + ' 00:00:00';
                    values.customerDeliveryEndTime = formatDate[1] + ' 23:59:59';
                    delete values.time
                }
                return values;
            }}
        />
    </Spin>
}