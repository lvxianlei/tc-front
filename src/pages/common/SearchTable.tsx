
import React, { ReactElement, useCallback, useState } from "react"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../utils/RequestUtil"
import CommonAliTable, { columnsProps } from "./CommonAliTable"
import { Button, Col, Form, Pagination, Row, Space } from "antd"
import styles from "./CommonTable.module.less"
import { stringify } from "querystring"
import ExportList from "../../components/export/list"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"

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
    transformResult?: (result: any) => any
    onFilterSubmit?: <T>(arg: T) => T
    filterValue?: { [key: string]: any }
    extraOperation?: React.ReactNode | React.ReactNode[] | ((result: any) => any)
    tableProps?: { [i: string]: any }
    pagination?: boolean
    pageSize?: number
    modal?: boolean // 分页栏是否固定到底部
    readonly exportPath?: string; //导出接口
    exportObject?: { [key: string]: any }, // 导出可能会包含的id等
    exportFileName?: string
    getDataSource?: (dataSource: any[]) => void
    tableRender?: (dom: ReactElement) => ReactElement
    [key: string]: any
}

interface PagenationProps {
    current: number
    pageSize: number
}

export default function SearchTable({
    path,
    columns,
    rowKey,
    onFilterSubmit,
    extraOperation,
    transformResult,
    getDataSource,
    exportFileName,
    searchFormItems = [],
    filterValue = {},
    tableProps,
    pagination,
    paginationProps,
    pageSize = 10,
    modal = false,
    exportPath,
    exportObject = {},
    tableRender,
    ...props }: SearchTableProps): JSX.Element {
    const [pagenationParams, setPagenationParams] = useState<PagenationProps>({ current: 1, pageSize })
    const [form] = Form.useForm()
    const [isExport, setIsExport] = useState<boolean>(false);
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const history = useHistory()
    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: { [key: string]: any } = {}) => new Promise(async (resole, reject) => {
        try {
            if (pagination !== false) {
                params.current = pagenationParams.current
                params.size = pagenationParams.pageSize
            }
            const paramsOptions = stringify({ ...params, ...filterValue })
            const fetchPath = path.includes("?") ? `${path}&${paramsOptions || ''}` : `${path}?${paramsOptions || ''}`
            const result: any = await RequestUtil.get(fetchPath)
            resole({
                source: result,
                result: transformResult ? transformResult(result) : result
            })
            getDataSource && getDataSource((transformResult ? transformResult(result) : result))
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [pagenationParams.current, pagenationParams.pageSize, JSON.stringify(filterValue), path] })

    const paginationChange = useCallback((page: number, pageSize?: number) => {
        setPagenationParams({
            ...pagenationParams,
            current: page,
            pageSize: pageSize || pagenationParams.pageSize
        })
    }, [setPagenationParams, JSON.stringify(pagenationParams)])

    return <>
        {searchFormItems.length > 0 && <Form
            style={{ marginBottom: 16 }}
            form={form}
            onFinish={async () => {
                const formValue = await form.getFieldsValue()
                const params = onFilterSubmit ? onFilterSubmit(formValue) : formValue
                setPagenationParams({ ...pagenationParams, current: 1, pageSize: pagenationParams?.pageSize || 10 })
                run(params)
            }}
            onReset={async () => {
                const formValue = await form.getFieldsValue()
                const params = onFilterSubmit ? onFilterSubmit(formValue) : formValue
                setPagenationParams({ ...pagenationParams, current: 1, pageSize: pagenationParams?.pageSize || 10 })
                run(params)
            }}
        >
            <Row gutter={[8, 8]}>
                {searchFormItems.map((fItem: any) => <Col
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
                        <Button type="default" htmlType="reset" style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>}
        <Space
            style={{
                width: "100%",
                marginBottom: 0,
                paddingLeft: 12,
                overflow: "hidden"
            }}
            size={12}
            wrap
        >
            {
                exportPath && exportPath && <Button type="primary" ghost onClick={() => {
                    setIsExport(true)
                }}>导出</Button>
            }
            {typeof extraOperation === "function" ? extraOperation(data?.source) : extraOperation}
        </Space>
        {tableRender ? tableRender(<>
            <CommonAliTable
                columns={columns}
                rowKey={rowKey || ((record: any) => record.id)}
                size="small"
                isLoading={loading}
                dataSource={data?.result?.records || data?.result || []}
                {...tableProps}
                {...props}
            />
            {
                pagination !== false && <footer className={modal ? styles.pagenationWarpModal : styles.pagenationWarp}>
                    <Pagination
                        className={styles.pagination}
                        total={data?.result?.total}
                        pageSize={pagenationParams.pageSize}
                        current={pagenationParams.current}
                        showTotal={(total: number) => `共${total}条记录`}
                        showSizeChanger
                        onChange={paginationChange}
                        {...paginationProps}
                    />
                </footer>
            }
        </>) : <>
            <CommonAliTable
                columns={columns}
                rowKey={rowKey || ((record: any) => record.id)}
                size="small"
                isLoading={loading}
                dataSource={data?.result?.records || data?.result || []}
                {...tableProps}
                {...props}
            />
            {
                pagination !== false && <footer className={modal ? styles.pagenationWarpModal : styles.pagenationWarp}>
                    <Pagination
                        className={styles.pagination}
                        total={data?.result?.total}
                        pageSize={pagenationParams.pageSize}
                        current={pagenationParams.current}
                        showTotal={(total: number) => `共${total}条记录`}
                        showSizeChanger
                        onChange={paginationChange}
                        {...paginationProps}
                    />
                </footer>
            }
        </>}
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => columns.filter((item: any) => item.title !== "操作")}
            current={pagenationParams.current || 1}
            size={pagenationParams.pageSize || 10}
            total={data?.result?.total || 0}
            url={exportPath}
            fileName={exportFileName}
            serchObj={{
                ...JSON.parse(JSON.stringify(filterValue || {})),
                ...JSON.parse(JSON.stringify(exportObject || {}))
            }}
            closeExportList={() => {
                setIsExport(false)
            }}
        /> : null}
    </>
}

