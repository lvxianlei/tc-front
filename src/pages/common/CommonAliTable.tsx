import React from "react"
import { Checkbox, TableColumnProps, Typography, Radio } from "antd"
import styles from "./CommonTable.module.less"
import "./CommonTable.module.less"
import moment from "moment"
import AliTable from "./AliTable"
import { useTablePipeline, features } from "ali-react-table"
const { Text } = Typography
export type ColumnsItemsType = "string" | "text" | "date" | "popTable" | "select" | "number" | undefined
export interface columnsProps {
    title: string,
    dataIndex: string,
    type?: ColumnsItemsType
    format?: string
    enum?: EnumObject[]
    editable?: boolean
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
                editable: data.editable || true,
                width: data.width || 140,
                render: (text: string) => <Text
                    style={{ width: "100%" }}
                    ellipsis={{
                        tooltip: text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"
                    }}>{text ? moment(text).format(data.format || "YYYY-MM-DD HH:mm:ss") : "-"}</Text>,
                ...data
            })
        case "select":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed,
                editable: data.editable || true,
                width: data.width || 140,
                render: (text: string | number) => <Text
                    style={{ width: "100%" }}
                    ellipsis={{
                        tooltip: ((text || text === 0) && data.enum) ? data.enum?.find((item: EnumObject) => item.value === text)?.label : text
                    }}
                >{((text || text === 0) && data.enum) ? data.enum?.find((item: EnumObject) => item.value === text)?.label : text}</Text>,
                ...data
            })
        case "number":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed,
                editable: data.editable || true,
                width: data.width || 140,
                render: (text: any) => <Text
                    style={{ width: "100%" }}
                    ellipsis={{
                        tooltip: text && !["-1"].includes(text) ? text : 0
                    }}>{text && !["-1"].includes(text) ? text : 0}</Text>,
                ...data
            })
        case "string":
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed,
                editable: data.editable || true,
                width: data.width || 140,
                render: data.render || ((text: number) => <Text
                    style={{ width: "100%" }}
                    ellipsis={{
                        tooltip: text && !["-1", -1].includes(text) ? text : "-"
                    }}>{text && !["-1", -1].includes(text) ? text : "-"}</Text>),
                ...data
            })
        default:
            return ({
                name: data.title,
                code: data.dataIndex,
                lock: data.fixed,
                editable: data.editable || true,
                width: data.width || 140,
                render: data.render || ((text: number) => <Text
                    style={{ width: "100%" }}
                    ellipsis={{ tooltip: text && !["-1", -1].includes(text) ? text : "-" }}>{text && !["-1", -1].includes(text) ? text : "-"}</Text>),
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

export default function CommonAliTable({ columns, dataSource = [], rowKey, haveIndex = false, isPage = false, ...props }: CommonTableProps): JSX.Element {
    const formatColumns = columns.map((item: any) => generateRender(item.type || "text", item))
    const columnsResult = haveIndex ? [
        {
            title: "序号",
            dataIndex: "index",
            width: 50,
            fixed: "left",
            onCell: () => ({ className: styles.tableCell }),
            render: (_: any, _a: any, index: number) => <>{index + 1}</>
        }, ...formatColumns] : formatColumns
    const pipeline = useTablePipeline({ components: { Checkbox, Radio } })
        .input({ dataSource, columns: columnsResult as any })
        .primaryKey(rowKey || "id")
        .use(features.columnResize({
            minSize: 40,
            maxSize: 500,
            handleBackground: '#ececec',
            handleHoverBackground: '#ccc',
            handleActiveBackground: '#ccc'
        }));

    props?.rowSelection && pipeline.use(
        props?.rowSelection.type === "radio" ?
            features.singleSelect({
                ...props?.rowSelection,
                onChange: (selectKey: string) => props?.rowSelection.onChange(selectKey, dataSource.find((item: any) => selectKey === (typeof rowKey === "function" ? rowKey(item) : item[rowKey || "id"])))
            }) : features.multiSelect({
                value: props?.rowSelection?.selectedRowKeys || [],
                onChange: (nextValue: string[]) => props?.rowSelection?.onChange(nextValue, dataSource.filter((item: any) => nextValue.includes(typeof rowKey === "function" ? rowKey(item) : item[rowKey || "id"]))),
                isDisabled: props?.rowSelection?.getCheckboxProps,
                highlightRowWhenSelected: true,
                checkboxPlacement: 'start',
                clickArea: "cell",
                checkboxColumn: { width: 40, lock: true, align: "left", ...props?.rowSelection?.checkboxColumn }
            }));
    pipeline.use(features.autoRowSpan());
    formatColumns.some((item: any) => item.features?.sortable) && pipeline.use(features.sort({ mode: 'single', highlightColumnWhenActive: true }));
    return <nav className={styles.componentsTable} style={{ paddingBottom: props.code && props.code === 1 ? "0px" : "88px" }}>
        <AliTable
            size="small"
            className={styles.components}
            useVirtual={{ vertical: true }}
            {...pipeline.getProps()}
            {...props}
        />
    </nav>
}