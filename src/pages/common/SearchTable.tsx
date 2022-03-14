
import React, { useCallback, useState } from "react"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../utils/RequestUtil"
import CommonTable, { columnsProps } from "./CommonAliTable"
import { Button, Col, Form, Pagination, Row } from "antd"
import styles from "./CommonTable.module.less"
import { stringify } from "querystring"

interface SearchFormItemsProps {
    name: string
    label?: string
    children: React.ReactNode | JSX.Element
}

interface SearchTableProps {
    path: string
    columns: columnsProps[]
    rowKey?: string | ((row: any) => string)
    searchFormItems: SearchFormItemsProps[]
    onFilterSubmit?: <T>(arg: T) => T
    filterValue?: { [key: string]: any }
    [key: string]: any
}

interface PagenationProps {
    current: number
    pageSize: number
}

export default function SearchTable({ path, columns, rowKey, onFilterSubmit, searchFormItems = [], filterValue, ...props }: SearchTableProps): JSX.Element {
    const [pagenation, setPagenation] = useState<PagenationProps>({ current: 1, pageSize: 10 })
    const [form] = Form.useForm()
    const { loading, data, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const formValue = await form.getFieldsValue()
            const params = onFilterSubmit ? onFilterSubmit(formValue) : formValue
            params.current = pagenation.current
            params.size = pagenation.pageSize
            const paramsOptions = filterValue ? stringify(filterValue) + stringify(params) : stringify(params)
            const fetchPath = path.includes("?") ? `${path}&${paramsOptions || ''}` : `${path}?${paramsOptions || ''}`
            const result: any = await RequestUtil.get(fetchPath)
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
                {searchFormItems.length > 0 && searchFormItems.map((fItem: any) => <Col
                    style={{ height: 32 }}
                    span={(searchFormItems.length + 1) / 24}
                    key={fItem.dataIndex || fItem.name}><Form.Item
                        name={fItem.dataIndex || fItem.name}
                        label={fItem.label}
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
                onChange={paginationChange}
            />
        </footer>
    </>
}

