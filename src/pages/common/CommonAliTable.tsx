import React from "react"
import { Checkbox, TableColumnProps, Typography } from "antd"
import styles from "./CommonTable.module.less"
import "./CommonTable.module.less"
import moment from "moment"
import AliTable from "./AliTable"
import { useTablePipeline, features } from "ali-react-table"
const { Paragraph } = Typography
export type ColumnsItemsType = "string" | "text" | "date" | "popTable" | "select" | "number" | undefined
export interface columnsProps {
    title: string,
    dataIndex: string,
    type?: ColumnsItemsType
    format?: string
    enum?: EnumObject[]
    render?: (value: any, records: { [key: string]: any }, index: number) => JSX.Element | React.ReactNode
    [key: string]: any
}
interface EnumObject {
    label: string
    value: string
}

export function generateRender(type: ColumnsItemsType, data: columnsProps) {
    switch (type) {
        case "date":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed,
                align: "left",
                render: (text: string) => <Paragraph
                    ellipsis={{
                        rows: 1
                    }}>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</Paragraph>,
                ...data
            })
        case "select":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed, align: "left",
                render: (text: string | number) => <Paragraph
                    ellipsis={{
                        rows: 1
                    }}
                >{((text || text === 0) && data.enum) ? data.enum?.find((item: EnumObject) => item.value === text)?.label : text}</Paragraph>,
                ...data
            })
        case "number":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed, align: "left",
                render: (text: number) => <Paragraph
                    ellipsis={{
                        rows: 1
                    }}>{text && !["-1", -1].includes(text) ? text : 0}</Paragraph>,
                ...data
            })
        case "string":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed, align: "left",
                render: data.render || ((text: number) => <Paragraph
                    ellipsis={{
                        rows: 1
                    }}>{text && !["-1", -1].includes(text) ? text : "-"}</Paragraph>),
                ...data
            })
        default:
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed, align: "left",
                render: data.render || ((text: number) => <Paragraph
                    ellipsis={{ rows: 1 }}>{text && !["-1", -1].includes(text) ? text : "-"}</Paragraph>),
                ...data
            })
    }
}

interface CommonTableProps {
    columns: TableColumnProps<object>[]
    dataSource?: object[]
    haveIndex?: boolean
    [key: string]: any
    rowKey?: any
    isPage?: boolean
}

export default function CommonTable({ columns, dataSource = [], rowKey, haveIndex = false, isPage = false, ...props }: CommonTableProps): JSX.Element {
    const formatColumns = columns.map((item: any) => generateRender(item.type || "text", item))
    const columnsResult = haveIndex ? [{
        title: "序号",
        dataIndex: "index",
        width: 50,
        fixed: "left", align: "left",
        onCell: () => ({ className: styles.tableCell }),
        render: (_: any, _a: any, index: number) => <>{index + 1}</>
    }, ...formatColumns] : formatColumns
    const pipeline = useTablePipeline({ components: { Checkbox } })
        .input({ dataSource, columns: columnsResult as any })
        .primaryKey(rowKey || "id")
        .use(features.columnResize({
            fallbackSize: 120,
            handleBackground: '#ececec',
            handleHoverBackground: '#ccc',
            handleActiveBackground: '#ccc',
        }));
    props?.tableProps?.rowSelection?.type === "checkbox" && pipeline.use(features.multiSelect({
        value: props?.tableProps?.rowSelection?.selectedRowKeys || [],
        onChange: props?.tableProps?.rowSelection?.onChange,
        isDisabled: props?.tableProps?.rowSelection?.getCheckboxProps,
        highlightRowWhenSelected: true,
        clickArea: "cell",
        checkboxColumn: { width: 40, lock: true, align: "left" }
    }))

    return <nav className={styles.componentsTable}>
        <AliTable
            size="small"
            className={styles.components}
            {...pipeline.getProps()}
            {...props}
        />
    </nav>
}