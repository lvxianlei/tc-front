import React, { SyntheticEvent, useState } from "react"
import { Table, TableColumnProps } from "antd"
import { Resizable, ResizeCallbackData } from "react-resizable"
import styles from "./CommonTable.module.less"
import "./CommonTable.module.less"
import moment from "moment"
type ColumnsItemsType = "text" | "string" | "number" | "select" | "date" | undefined

export function generateRender(type: ColumnsItemsType, data: (SelectData | TextData)) {
    switch (type) {
        case "date":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                onHeaderCell: () => ({ isResizable: data.isResizable }),
                render: (text: string) => <>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</>,
                ...data
            })
        case "select":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                onHeaderCell: () => ({ isResizable: data.isResizable }),
                render: (text: string | number) => <>{((text || text === 0) && data.enum) ? data.enum.find((item: { value: string, label: string }) => item.value === text)?.label : text}</>,
                ...data
            })
        case "number":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                onHeaderCell: () => ({ isResizable: data.isResizable }),
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : 0}</>,
                ...data
            })
        case "string":
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                onHeaderCell: () => ({ isResizable: data.isResizable }),
                render: (text: number) => <>{text && !["-1", -1].includes(text) ? text : "-"}</>,
                ...data
            })
        default:
            return ({
                ellipsis: { showTitle: false },
                onCell: () => ({ className: styles.tableCell }),
                onHeaderCell: () => ({ isResizable: data.isResizable }),
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
}

export function ResizableTitle({ isResizable = false, width = 120, ...props }: ResizableTitleProps): JSX.Element {
    const [IWidth, setIWidth] = useState<number>(120)
    //TODO 拖拽改变宽度
    const onResize = (event: SyntheticEvent, { size }: ResizeCallbackData) => {
        setIWidth(size.width)
    }

    return isResizable ? <Resizable
        {...props as any}
        axis="x"
        width={IWidth}
        height={36}
        minConstraints={[20, 36]}
        maxConstraints={[Infinity, 36]}
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
        <th {...props} style={{ width: 300 }} />
    </ Resizable > : <th {...props} />
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
    return <nav className={styles.componentsTableResizableColumn}>
        <Table
            size="small"
            scroll={{ x: true }}
            rowKey={rowKey || "id"}
            columns={columnsResult as any}
            components={props.components || ({
                header: {
                    cell: ResizableTitle
                }
            })}
            onRow={() => ({ className: styles.tableRow })}
            dataSource={dataSource}
            {...props}
        />
    </nav>
}