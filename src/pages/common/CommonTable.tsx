import React from "react"
import { Table, TableColumnProps, Tooltip } from "antd"
import styles from "./CommonTable.module.less"
import "./CommonTable.module.less"
import moment from "moment"
import layoutStyles from '../../layout/Layout.module.less'
type ColumnsItemsType = "text" | "string" | "number" | "select" | "date" | undefined

export function generateRender(type: ColumnsItemsType, data: (SelectData | TextData)) {
    switch (type) {
        case "date":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                render: (text: string) => <>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</>,
                ...data
            })
        case "select":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                render: (text: string | number) => {
                    if (data.mode === "multiple") {
                        const result = `${text}`.split(",").map((item: string) => data.enum.find((dItem: { value: string, label: string }) => dItem.value === item))
                        return result.join(",")
                    }
                    return <>{((text || text === 0) && data.enum) ? data.enum.find((item: { value: string, label: string }) => item.value === text)?.label : text}</>
                },
                ...data
            })
        case "number":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                render: (text: any) => <>{text && !["-1"].includes(text) ? text : 0}</>,
                ...data
            })
        case "string":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                render: (text: any) => <span title={text}>{text && !["-1", -1].includes(text) ? text : "-"}</span>,
                ...data
            })
        default:
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                render: (text: any) => <span title={text}>{text && !["-1", -1].includes(text) ? text : "-"}</span>,
                ...data
            })
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
        fixed: "left",
        onCell: () => ({ className: styles.tableCell }),
        render: (_: any, _a: any, index: number) => <>{index + 1}</>
    }, ...formatColumns] : formatColumns
    const height = document.documentElement.clientHeight - 320;
    const scroll = isPage ? { x: true, y: height } : { x: true }

    return <nav className={styles.componentsTableResizableColumn}>
        <Table
            size="small"
            scroll={scroll as any}
            rowKey={rowKey || "id"}
            columns={columnsResult as any}
            className={`${styles.opration} ${layoutStyles.opration}`}
            onRow={() => ({ className: styles.tableRow })}
            dataSource={dataSource}
            {...props}
        />
    </nav>
}