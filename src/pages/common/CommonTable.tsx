import React, { SyntheticEvent, useState } from "react"
import { Table, TableColumnProps } from "antd"
import { Resizable, ResizeCallbackData } from "react-resizable"
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
                width: 100,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: string) => <>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</>,
                ...data
            })
        case "select":
            return ({
                ellipsis: { showTitle: false },
                width: 100,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: string | number) => <>{((text || text === 0) && data.enum) ? data.enum.find((item: { value: string, label: string }) => item.value === text)?.label : (text || "-")}</>,
                ...data
            })
        case "number":
            return ({
                ellipsis: { showTitle: false },
                width: 100,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : 0}</>,
                ...data
            })
        case "string":
            return ({
                ellipsis: { showTitle: false },
                width: 100,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : "-"}</>,
                ...data
            })
        default:
            return ({
                ellipsis: { showTitle: false },
                width: 100,
                onCell: () => ({ className: styles.tableCell }),
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : "-"}</>,
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
}

interface ResizableTitleProps extends React.Attributes {
    isResizable?: boolean
    width?: number
    onResize?: () => void
}

export function ResizableTitle({ isResizable = false, onResize, width = 120, ...props }: ResizableTitleProps): JSX.Element {
    return <Resizable
        {...props as any}
        axis="x"
        width={width}
        height={36}
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
        handle={
            <span
                className={styles.reactResizableHandle}
                onClick={e => {
                    e.stopPropagation();
                }}
            />
        }
    >
        <th {...props} />
    </ Resizable >
}

export default function CommonTable({ columns, dataSource = [], rowKey, haveIndex = false, ...props }: CommonTableProps): JSX.Element {
    const formatColumns = columns.map((item: any) => generateRender(item.type || "text", item))
    const columnsResult = haveIndex ? [{
        title: "序号",
        dataIndex: "index",
        width: 50,
        className: styles.tableCell,
        render: (_: any, _a: any, index: number) => <>{index + 1}</>
    }, ...formatColumns] : formatColumns
    const [IColumns, setIColumns] = useState<any[]>(columnsResult)

    const handleResize = (index: number) => (event: SyntheticEvent, { size }: ResizeCallbackData) => {
        const newColumns = [...IColumns]
        newColumns[index] = {
            ...newColumns[index],
            width: size.width
        }
        setIColumns(newColumns)
    }

    return <nav className={styles.componentsTableResizableColumn}>
        <Table
            size="small"
            scroll={{ x: 1200 }}
            rowKey={rowKey || "id"}
            columns={(columnsResult as any).map(((item: any, index: number) => ({
                ...item,
                onHeaderCell: (colItem: any) => ({
                    width: colItem.width,
                    isResizable: colItem.isResizable,
                    onResize: handleResize(index)
                })
            })))}
            components={props.components || ({
                header: {
                    cell: ResizableTitle
                }
            })}
            className={layoutStyles.opration}
            onRow={() => ({ className: styles.tableRow })}
            dataSource={dataSource}
            {...props}
        />
    </nav>
}