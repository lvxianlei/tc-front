import React from "react"
import { Table, TableColumnProps } from "antd"
import styles from "./CommonTable.module.less"
import moment from "moment"
type ColumnsItemsType = "text" | "string" | "number" | "select" | "date" | undefined

function generateRender(type: ColumnsItemsType, data: (SelectData | TextData)) {
    switch (type) {
        case "date":
            return ({ ...data, ellipsis: true, onCell: () => ({ className: styles.tableCell }), render: (text: string, record: any) => <>{text ? moment(text).format(record.format || "YYYY-MM-DD HH:mm:ss") : "-"}</> })
        case "select":
            return ({ ...data, ellipsis: true, onCell: () => ({ className: styles.tableCell }), render: (text: string, record: any) => <>{record.enum ? record.enum.find((item: { value: string, label: string }) => item.value === text).label : text}</> })
        default:
            return ({ ...data, ellipsis: true, onCell: () => ({ className: styles.tableCell }) })
    }
}

interface ColumnsItem {
    title: string
    dataIndex: string
    type?: ColumnsItemsType
    [key: string]: any
}

interface SelectOption {
    value: string | number
    label: string
    [key: string]: any
}

interface SelectData extends ColumnsItem {
    type: "select"
    enum?: SelectOption[]
    path?: string
    [key: string]: any
}

interface TextData extends ColumnsItem {
    type?: "text" | undefined
    [key: string]: any
}

interface CommonTableProps {
    columns: TableColumnProps<object>[]
    dataSource?: object[]
}

export default function CommonTable({ columns, dataSource = [] }: CommonTableProps): JSX.Element {
    columns = columns.map((item: any, index: number) => generateRender(item.type || "text", item))
    return <Table
        size="small"
        rowKey={(_: any, record: any) => `common_table_${record.id || record.title || JSON.stringify(record)}`}
        columns={columns}
        onRow={() => ({ className: styles.tableRow })}
        dataSource={dataSource}
    />
}