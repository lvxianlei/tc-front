
import React, { useCallback, useState } from "react"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../utils/RequestUtil"
import CommonTable from "./CommonTable"
import moment from "moment"
import { Button, Col, Form, Pagination, Row } from "antd"
import styles from "./CommonTable.module.less"
import { stringify } from "querystring"
type ColumnsItemsType = "string" | "text" | "date" | "popTable" | "select" | "number"

interface EnumObject {
    label: string
    value: string
}

interface columnsProps {
    title: string,
    dataIndex: string,
    type?: ColumnsItemsType
    format?: string
    enum?: EnumObject[]
    render?: (value: any, records: { [key: string]: any }, index: number) => JSX.Element | React.ReactNode
    [key: string]: any
}

interface SearchTableProps {
    path: string
    columns: columnsProps[]
    rowKey?: string | ((row: any) => string)
    [key: string]: any
}

interface PagenationProps {
    current: number
    pageSize: number
}

export function generateRender(type: ColumnsItemsType, data: columnsProps) {
    switch (type) {
        case "date":
            return ({
                name: data.title,
                code: data.dataIndex,
                ellipsis: { showTitle: false },
                render: (text: string) => <>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</>,
                ...data
            })
        case "select":
            return ({
                name: data.title,
                code: data.dataIndex,
                ellipsis: { showTitle: false },
                render: (text: string | number) => <>{((text || text === 0) && data.enum) ? data.enum!.find((item: EnumObject) => item.value === text)!.label : text}</>,
                ...data
            })
        case "number":
            return ({
                name: data.title,
                code: data.dataIndex,
                ellipsis: { showTitle: false },
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : 0}</>,
                ...data
            })
        case "string":
            return ({
                name: data.title,
                code: data.dataIndex,
                ellipsis: { showTitle: false },
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : "-"}</>,
                ...data
            })
        default:
            return ({
                name: data.title,
                code: data.dataIndex,
                ellipsis: { showTitle: false },
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : "-"}</>,
                ...data
            })
    }
}

export default function SearchTable({ path, columns, rowKey, onFilterSubmit, searchFormItems, ...props }: SearchTableProps): JSX.Element {
    const [pagenation, setPagenation] = useState<PagenationProps>({ current: 1, pageSize: 10 })
    const [form] = Form.useForm()
    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const formValue = await form.getFieldsValue()
            const params = onFilterSubmit ? onFilterSubmit(formValue) : formValue
            params.current = pagenation.current
            params.size = pagenation.pageSize
            const paramsOptions = stringify(params)
            const fetchPath = path.includes("?") ? `${path}&${paramsOptions || ''}` : `${path}?${paramsOptions || ''}`
            const result: any = await RequestUtil.get(fetchPath)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [pagenation.current, pagenation.pageSize] })
    const paginationChange = useCallback((page: number, pageSize: number) => {
        setPagenation({
            ...pagenation,
            current: 1,
            pageSize
        })
    }, [setPagenation, JSON.stringify(pagenation)])
    return <>
        <Form style={{ marginBottom: 16 }} form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={[8, 8]}>
                {searchFormItems.length > 0 && searchFormItems.map((fItem: any) => <Col
                    style={{ height: 32 }}
                    span={(searchFormItems.length + 1) / 24}
                    key={fItem.dataIndex || fItem.name}><Form.Item
                        name={fItem.dataIndex || fItem.name}
                        label={fItem.title}
                        style={{ height: 32, fontSize: 12 }}
                    >
                        {fItem.children}
                    </Form.Item>
                </Col>)}
                <Col style={{ height: 32 }} span={(searchFormItems.length + 1) / 24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                        <Button type="default" onClick={() => form.resetFields()} style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <CommonTable
            columns={columns}
            rowKey={rowKey || ((record: any) => record.id)}
            size="small"
            loading={loading}
            dataSource={data?.records || data || []}
            {...props}
        />
        <footer className={styles.pagenationWarp}>
            <Pagination
                className={styles.pagination}
                total={data?.total}
                showTotal={(total: number) => `共${total}条记录`}
                showSizeChanger
                onShowSizeChange={paginationChange}
            />
        </footer>
    </>
}

