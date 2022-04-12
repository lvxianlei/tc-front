import React, { ReactElement, useState, useCallback } from "react"
import { structure } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { useParams } from "react-router"
import { Button, Col, Form, Input, Pagination, Row } from "antd"
import { CommonAliTable } from "../../common"
import styles from "../../common/CommonTable.module.less"
export default function Structure(): ReactElement {
    const params = useParams<{ id: string }>()
    const [pagenation, setPagenation] = useState<any>({ current: 1, pageSize: 10 })
    const [form] = Form.useForm()
    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const formValue = await form.getFieldsValue()
            const result: any = await RequestUtil.get(`/tower-aps/workshopOrder/structure`, {
                issueOrderId: params.id,
                ...formValue,
                current: pagenation.current,
                size: pagenation.pageSize
            })
            resole(result)
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
                    <Form.Item name="processWorkshop" label="加工车间">
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
        <CommonAliTable
            columns={structure}
            size="small"
            isLoading={loading}
            dataSource={data?.recordDate.records || []}
        />
        <footer className={styles.pagenationWarp}>
            <Pagination
                total={data?.total}
                current={pagenation.current}
                showTotal={(total: number) => `共${total}条记录`}
                showSizeChanger
                onChange={paginationChange}
            />
        </footer>
    </>
}