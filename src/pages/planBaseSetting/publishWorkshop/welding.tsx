import React, { ReactElement, useState, useCallback } from "react"
import { welding } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { useParams } from "react-router"
import { Button, Col, Form, Input, Pagination, Row, Space } from "antd"
import { CommonAliTable } from "../../common"
import { groupBy } from "ali-react-table"
import styles from "../../common/CommonTable.module.less"
export default function Welding(): ReactElement {
    const params = useParams<{ id: string, issuedNumber: string, productCategory: string }>()
    const [pagenation, setPagenation] = useState<any>({ current: 1, pageSize: 10 })
    const [form] = Form.useForm()
    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const formValue = await form.getFieldsValue()
            const result: any = await RequestUtil.get(`/tower-aps/workshopOrder/weldingStat`, {
                issueOrderId: params.id,
                ...formValue,
                current: pagenation.current,
                size: pagenation.pageSize
            })
            const records = result.recordDate.records.reduce((count: any[], item: any) => {
                const components = item.weldingStructureVOList.reduce((cCount: any[], cItem: any[]) => {
                    delete item.weldingStructureVOList
                    return cCount.concat({ ...cItem, ...item })
                }, [])
                return count.concat(components)
            }, [])
            resole({
                ...result,
                recordDate: {
                    ...result.recordDate,
                    records: records.map((item: any, index: number) => ({ ...item, index }))
                }
            })
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [pagenation.current, pagenation.pageSize] })

    const paginationChange = useCallback((page: number, pageSize?: number) => {
        setPagenation({
            ...pagenation,
            current: page,
            pageSize: pageSize || pagenation.pageSize
        })
    }, [setPagenation, JSON.stringify(pagenation)])

    return <>
        <Form style={{ marginBottom: 16 }} form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={[8, 8]}>
                <Col>
                    <Form.Item name="materialName" label="材料">
                        <Input />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="structureTexture" label="材质">
                        <Input />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="processWorkshop" label="生产单元">
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{ height: 32 }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                        <Button type="default" onClick={() => form.resetFields()} style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <Row style={{ paddingLeft: 20 }}>
            <Space>
                <span><label>下达单号：</label>{params.issuedNumber}</span>
                <span><label>塔型：</label>{params.productCategory}</span>
            </Space>
        </Row>
        <Row style={{ paddingLeft: 20 }}>
            <Space>
                <span><label>合计：</label>{ }</span>
                <span><label>总组数：</label>{data?.totalGroupNum || "0"}</span>
                <span><label>总重量(t)：</label>{data?.totalWeight || "0"}</span>
            </Space>
        </Row>
        <CommonAliTable
            rowKey={(records: any) => `${records.id}-${records.index}`}
            columns={welding.map((item: any) => {
                if (item.dataIndex === "totalProcessNum") {
                    return ({
                        ...item,
                        features: {
                            ...item.features,
                            autoRowSpan: (v1: any, v2: any, row1: any, row2: any) => row1.id + row1.componentId === row2.id + row2.componentId
                        }
                    })
                }
                if (item.dataIndex === "segmentName") {
                    return ({
                        ...item,
                        features: {
                            ...item.features,
                            autoRowSpan: (v1: any, v2: any, row1: any, row2: any) => row1.id + row1.segmentName === row2.id + row2.segmentName
                        }
                    })
                }
                return item
            })}
            size="small"
            className="bordered"
            isLoading={loading}
            dataSource={data?.recordDate.records || []}
        />
        <footer className={styles.pagenationWarp}>
            <Pagination
                total={data?.recordDate.total}
                current={pagenation.current}
                showTotal={(total: number) => `共${total}条记录`}
                showSizeChanger
                onChange={paginationChange}
            />
        </footer>
    </>
}