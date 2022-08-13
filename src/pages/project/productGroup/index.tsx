import React, { useState } from "react";
import { Button, Modal, Radio, Row } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { CommonTable, DetailContent } from "../../common";
import { productAssist, productGroupColumns } from "../managementDetailData.json"
import RequestUtil from "../../../utils/RequestUtil";
import useRequest from "@ahooksjs/use-request";
const productAssistStatistics = [
    {
        "title": "塔型",
        "dataIndex": "productCategoryName"
    },
    {
        "title": "基数",
        "dataIndex": "number"
    },
    {
        "title": "重量（吨）",
        "dataIndex": "weight"
    }
]
export default function Index() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const entryPath = params.id ? "management" : "productGroup"
    const [productGroupFlag, setProductGroupFlag] = useState<"productAssistDetailVos" | "productAssistStatisticsVos">("productAssistDetailVos")
    const [productGroupData, setProductGroupData] = useState<{ productAssistDetailVos: any[], productAssistStatisticsVos: any[] }>({
        productAssistDetailVos: [],
        productAssistStatisticsVos: []
    })

    const handleProductGroupClick = async (id: string) => {
        const result: any = await projectGroupRun(id)
        setProductGroupData(result)
    }
    const { loading, data } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productGroup/${params.id || ''}`)
        resole(result)
    }))
    const { loading: projectGroupLoading, data: projectGroupData, run: projectGroupRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductAssist?productGroupId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/productGroup/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const deleteProductGroupItem = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteRun(id)
                    resove("")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    return <DetailContent title={[
        <Button key="new" type="primary" onClick={() => history.push(`/project/${entryPath}/new/productGroup/${params.id}`)} style={{ marginBottom: 16 }}>新增</Button>
    ]}>
        <CommonTable
            columns={[
                ...productGroupColumns,
                {
                    title: "操作",
                    dataIndex: "opration",
                    ellipsis: false,
                    width: 250,
                    render: (_: any, record: any) => <>
                        <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => handleProductGroupClick(record.id)}>详情</Button>
                        <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => history.push(`/project/${entryPath}/productGroup/item/${params.id}/${record.id}`)} >查看</Button>
                        <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => history.push(`/project/${entryPath}/edit/productGroup/${params.id}/${record.id}`)}>编辑</Button>
                        <Button type="link" size="small" disabled={`${record.status}` !== "0"} onClick={() => deleteProductGroupItem(record.id)} >删除</Button>
                    </>
                }]}
            dataSource={data?.records}
        />
        <Row style={{ marginBottom: 16 }}><Radio.Group
            value={productGroupFlag}
            onChange={(event: any) => setProductGroupFlag(event.target.value)}
            options={[
                { label: '明细', value: 'productAssistDetailVos' },
                { label: '统计', value: 'productAssistStatisticsVos' }
            ]}
            optionType="button"
        /></Row>
        <CommonTable
            // rowKey="productCategoryName"
            columns={productGroupFlag === "productAssistStatisticsVos" ? productAssistStatistics : productAssist}
            dataSource={productGroupData[productGroupFlag]}
        />
    </DetailContent>
}