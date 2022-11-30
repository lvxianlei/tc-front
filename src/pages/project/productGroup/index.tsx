import React, { useState } from "react";
import { Button, Input, Modal, Radio, Row, Select } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { CommonTable, DetailContent, SearchTable } from "../../common";
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
    const [filterValue, setFilterValue] = useState({ projectId: params.id });
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
    const onFilterSubmit = (value: any) => {
        value["projectId"] = params.id;
        setFilterValue({ projectId: params.id })
        return value
    }
    const { run: projectGroupRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
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

    return <DetailContent style={{ paddingTop: 16 }}>
        <SearchTable
            path={`/tower-market/productGroup`}
            modal={true}
            filterValue={filterValue}
            extraOperation={<Button
                key="new"
                type="primary"
                onClick={() => history.push(
                    `/project/${entryPath}/new/productGroup/${params.id}`
                )}>
                新增
            </Button>}
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...productGroupColumns,
                {
                    title: "操作",
                    dataIndex: "opration",
                    ellipsis: false,
                    fixed: "right",
                    width: 250,
                    render: (_: any, record: any) => <>
                        <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => handleProductGroupClick(record.id)}>详情</Button>
                        <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => history.push(`/project/${entryPath}/productGroup/item/${params.id}/${record.id}`)}>查看</Button>
                        <Button type="link" style={{ marginRight: 12 }} size="small" onClick={() => history.push(`/project/${entryPath}/edit/productGroup/${params.id}/${record.id}`)}>编辑</Button>
                        <Button type="link" size="small" disabled={`${record.status}` !== "0"} onClick={() => deleteProductGroupItem(record.id)}>删除</Button>
                    </>
                }
            ] as any}
            searchFormItems={[
                {
                    name: 'status',
                    label: '杆塔明细状态',
                    children: <Select style={{ width: "150px" }} placeholder="杆塔明细状态">
                        <Select.Option value={0}>未下发</Select.Option>
                        <Select.Option value={1}>部分下发</Select.Option>
                        <Select.Option value={2}>已下发</Select.Option>
                    </Select>
                },
                {
                    name: 'saleOrderNumber',
                    label: '订单编号',
                    children: <Input placeholder="订单编号" style={{ width: 210 }} />
                },
                {
                    name: 'orderProjectName',
                    label: '订单工程名称',
                    children: <Input placeholder="订单工程名称" style={{ width: 210 }} />
                },
                {
                    name: 'internalNumber',
                    label: '内部编号',
                    children: <Input placeholder="内部编号" style={{ width: 210 }} />
                },
            ]}
            onFilterSubmit={onFilterSubmit}
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
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...(productGroupFlag === "productAssistStatisticsVos" ? productAssistStatistics : productAssist)]}
            dataSource={productGroupData[productGroupFlag]}
        />
    </DetailContent>
}