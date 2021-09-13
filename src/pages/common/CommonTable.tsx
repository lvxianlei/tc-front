import React from "react"
import { Table, TableColumnProps } from "antd"
import styles from "./CommonTable.module.less"
import moment from "moment"
type FormItemTypesType = "text" | "number" | "select" | "date" | undefined

function generateRender(type: FormItemTypesType, data: ColumnsItem) {
    switch (type) {
        case "date":
            return ({ ...data, expect: true, onCell: () => ({ className: styles.tableCell }), render: (text: string, record: any) => <>{moment(text, record.format || "YYYY-MM-DD HH:mm:ss")}</> })
        case "select":
            return ({ ...data, expect: true, onCell: () => ({ className: styles.tableCell }), render: (text: string, record: any) => <>{record.enum ? record.enum.find((item: { value: string, label: string }) => item.value === text).label : text}</> })
        default:
            return ({ ...data, expect: true, onCell: () => ({ className: styles.tableCell }) })
    }
}


interface ColumnsItem {
    title: string
    dataIndex: string
    type?: FormItemTypesType
    key?: string
    rowKey?: string
    width?: string | number
    render?: (text: string, record: any, index: number) => JSX.Element | React.ReactNode
}

interface CommonTableProps {
    columns: ColumnsItem[]
    dataSource?: object[]
}

export default function CommonTable({ columns, dataSource = [] }: CommonTableProps): JSX.Element {
    columns = columns.map((item: ColumnsItem, index: number) => generateRender(item.type || "text", item))
    return <Table
        size="small"
        rowKey={(record: any) => `common_table_${record.id || record.title || record.dataIndex}`}
        columns={columns}
        onRow={() => ({ className: styles.tableRow })}
        dataSource={dataSource} />
}