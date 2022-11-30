import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Row, Space, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, CommonTable } from "../common"
import { newProductGroup, productAssist } from './managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
const calcContractTotal = (records: any[]) => {
    return records.reduce((result: { weight: string, amount: string }, item: any) => ({
        weight: (parseFloat(result.weight) + parseFloat(item.totalWeight || "0.00")).toFixed(2),
        amount: (parseFloat(result.amount) + parseFloat(item.number || "0.00")).toFixed(2)
    }), { weight: "0.00", amount: "0.00" })
}
export default function ProductGroupEdit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [select, setSelect] = useState<any[]>([])
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const total: any = calcContractTotal(selectedRows)
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productGroup/${params.id}`)
            setSelect(result.productDetails)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    return <DetailContent
        operation={[
            <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
        ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={newProductGroup} dataSource={data || {}} />
            <DetailTitle title="明细" />
            {
                selectedRows.length > 0 && <Row style={{ width: 1600 }}>
                    <Row style={{ color: "#FF8C00", fontWeight: 600, fontSize: 14 }}>合计：</Row>
                    <Space>
                        <div>总基数：<span style={{ color: "#FF8C00" }}>{total.amount}基</span></div>
                        <div>总重量：<span style={{ color: "#FF8C00" }}>{total.weight}吨</span></div>
                    </Space>
                </Row>
            }
            <CommonTable
                columns={[{
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }, ...productAssist]}
                dataSource={select}
                pagination={false}
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRows?.map((item: any) => item.id),
                    onChange: (_: string[], selectedRows: any[]) => {
                        setSelectedRows(selectedRows)
                    },
                }}
            />
        </Spin>
    </DetailContent>
}