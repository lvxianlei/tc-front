import React, { useEffect, useState } from "react"
import { Button, Col, Form, Input, Modal, Row } from "antd"
import { CommonTable, DetailTitle } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { contract, productAssist } from '../managementDetailData.json'
export default function SelectProductGroup(props: any): JSX.Element {
    const [select, setSelect] = useState<any[]>([])
    const [projectSelect, setProjectSelect] = useState<string[]>(props.select || [])
    const [projectSelectRows, setProjectSelectRows] = useState<any[]>([])
    const [pagenation, setPagenation] = useState<{ [key: string]: any }>({
        current: 1,
        pageSize: 10
    })
    useEffect(() => {
        setProjectSelect(props.select)
        setProjectSelectRows(projectSelectRows.filter((item: any) => props.select.includes(item.id)))
    }, [JSON.stringify(props.select)])

    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-market/contract`,
                {
                    projectId: props.projectId === "undefined" ? undefined : props.projectId,
                    size: pagenation.pageSize,
                    current: pagenation.current,
                    ...params
                }
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [pagenation.current, pagenation.pageSize] })

    const { loading: productGroupLoading, data: productGroup, run: productGroupRun } = useRequest<any>(({ id }) => new Promise(async (resole, reject) => {
        try {
            const productGroupId = props.productGroupId ? `&productGroupId=${props.productGroupId}` : ""
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductByContractId?contractId=${id}${productGroupId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setSelect(selectedRowKeys)
        productGroupRun({ id: selectRows[0].id })
    }
    const onProductGroupChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setProjectSelect(selectedRowKeys)
        setProjectSelectRows(selectRows)
    }

    const paginationChange = (page: number, pageSize: number) => setPagenation({
        ...pagenation, current: page,
        pageSize
    })

    return <Modal title="选择确认明细" width={1011} {...props} destroyOnClose onOk={() => props.onOk && props.onOk(projectSelectRows)} >
        <Form
            style={{ marginBottom: 16 }}
            onFinish={(value) => {
                run({
                    ...value,
                })
            }}
            onReset={() => { run({}) }}
        >
            <Row gutter={[8, 8]}>
                <Col style={{ height: 32 }} >
                    <Form.Item
                        name="internalNumber"
                        label="内部合同编号"
                        style={{ height: 32, fontSize: 12 }}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{ height: 32 }}>
                    <Form.Item
                        name="contractName"
                        label="工程名称"
                        style={{ height: 32, fontSize: 12 }}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{ height: 32 }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                        <Button type="default" htmlType="reset" style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <CommonTable
            loading={loading}
            columns={contract}
            dataSource={data?.records}
            scroll={{ y: 400 }}
            pagination={{
                size: "small",
                pageSize: pagenation.pageSize,
                onChange: paginationChange,
                current: pagenation.current,
                total: data?.total
            }}
            rowSelection={{
                selectedRowKeys: select,
                type: "radio",
                onChange: onSelectChange,
            }} />
        <DetailTitle title="明细" />
        <CommonTable
            loading={productGroupLoading}
            columns={productAssist}
            dataSource={productGroup || []}
            rowSelection={{
                selectedRowKeys: projectSelect,
                type: "checkbox",
                onChange: onProductGroupChange
            }}
        />
    </Modal>
}