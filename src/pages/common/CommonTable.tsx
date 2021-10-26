import React from "react"
import { Table, TableColumnProps } from "antd"
import styles from "./CommonTable.module.less"
import moment from "moment"
type ColumnsItemsType = "text" | "string" | "number" | "select" | "date" | undefined

export function generateRender(type: ColumnsItemsType, data: (SelectData | TextData)) {
    switch (type) {
        case "date":
            return ({
                ellipsis: true,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: string) => <>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</>,
                ...data
            })
        case "select":
            return ({
                ellipsis: true,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: string | number) => <>{((text || text === 0) && data.enum) ? data.enum.find((item: { value: string, label: string }) => item.value === text)?.label : text}</>,
                ...data
            })
        case "number":
            return ({
                ellipsis: true,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: number) => <>{text && text !== -1 ? text : 0}</>,
                ...data
            })
        default:
            return ({ ellipsis: true, onCell: () => ({ className: styles.tableCell }), ...data })
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
    [key: string]: any
}

export default function CommonTable({ columns, dataSource = [], ...props }: CommonTableProps): JSX.Element {
    columns = columns.map((item: any, index: number) => generateRender(item.type || "text", item))
    return <Table
        size="small"
        scroll={{ x: true }}
        rowKey={(_: any, record: any) => `common_table_${record.id || record.title || JSON.stringify(record)}`}
        columns={columns}
        onRow={() => ({ className: styles.tableRow })}
        dataSource={dataSource}
        {...props}
    />
}