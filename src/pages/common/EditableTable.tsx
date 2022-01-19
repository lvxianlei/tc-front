import React, { useCallback, useEffect, useRef, useState } from 'react'
import { VariableSizeGrid } from "react-window";
import ResizeObserver from 'rc-resize-observer';
import { FormInstance, message, Row, Button, Form, Table } from "antd"
import CommonTable from "./CommonTable"
import FormItemType from './FormItemType'
interface EditableTableProps {
    columns: any[]
    dataSource: any[]
    haveNewButton?: boolean
    newButtonTitle?: string
    haveOpration?: boolean
    haveIndex?: boolean
    form?: FormInstance
    opration?: React.ReactNode[]
    onChange?: (data: any[], allFields: any[]) => void
    scroll?: { x: number, y: number }
}



const formatColunmsB = (columns: any[], haveOpration: boolean, haveIndex: boolean) => {
    let newColumns = columns.map(item => ({
        title: item.title,
        dataIndex: item.dataIndex,
        // render: (value: any, record: any) => <Form.Item
        //     style={{ margin: 0 }}
        //     rules={item.rules}
        //     name={[record.id, item.dataindex]}>
        //     <FormItemType data={item} type={item.type} />
        // </Form.Item>,
        ...item
    }))
    haveOpration && newColumns.push({
        title: "操作",
        fixed: "right",
        width: 50,
        dataIndex: "opration",
        render: (_: undefined, record: any) => {
            return <Button style={{ paddingLeft: 0 }} size="small" type="link">删除</Button>
        }
    })
    haveIndex && newColumns.unshift({
        title: '序号',
        width: 50,
        fixed: "left",
        dataIndex: 'index',
        editable: false,
        render: (_: any, $: any, index: number): React.ReactNode => index + 1
    })
    return newColumns
}

function VirtualList() {
    console.log("================")
    return <div>aaaaaaaaaa</div>
}

export default function Edit({
    columns,
    dataSource = [],
    onChange,
    form,
    haveNewButton = true,
    newButtonTitle = "新增一行",
    haveOpration = true,
    haveIndex = true,
    opration,
    scroll,
    ...props }: EditableTableProps): JSX.Element {
    const [tableWidth, setTableWidth] = useState<number>(0)
    const [editableDataSource, setEditableDatasource] = useState<any[]>(dataSource)
    const [eidtableColumns, setEditableColumns] = useState<any[]>(formatColunmsB(columns, haveOpration, haveIndex))
    const widthColumnCount = columns.filter(({ width }) => !width).length;
    const mergedColumns = columns.map((column) => {
        if (column.width) {
            return column;
        }
        return { ...column, width: Math.floor(tableWidth / widthColumnCount) };
    });
    const gridRef = useRef<any>();
    const [connectObject] = useState(() => {
        const obj = {};
        Object.defineProperty(obj, 'scrollLeft', {
            get: () => null,
            set: (scrollLeft) => {
                if (gridRef.current) {
                    gridRef.current?.scrollTo({
                        scrollLeft
                    })
                }
            }
        })
        return obj
    })

    const resetVirtualGrid = () => {
        gridRef.current?.resetAfterIndices({
            columnIndex: 0,
            shouldForceUpdate: true,
        })
    }

    useEffect(() => resetVirtualGrid, [tableWidth]);

    const handleChange = useCallback((data: any[]) => {
        onChange && onChange(data, editableDataSource)
    }, [dataSource, onChange, JSON.stringify(editableDataSource)])

    useEffect(() => {
        setEditableColumns(formatColunmsB(columns, haveOpration, haveIndex))
    }, [JSON.stringify(columns)])

    return <Form form={form}>
        <Row>{haveNewButton && <Button
            onClick={async () => {
                try {
                    form && await form.validateFields()
                    const id = (Math.random() * 1000000).toFixed(0)
                    setEditableDatasource([{ id }, ...editableDataSource])
                } catch (error) {
                    message.warning("所有数据校验通过才能继续新增")
                }
            }}
            type="primary"
            style={{ height: 32, margin: "0 16px 16px 0" }}>{newButtonTitle}</Button>
        }
            {opration}
        </Row>
        <ResizeObserver onResize={({ width }) => setTableWidth(width)}>
            <Table
                columns={eidtableColumns}
                dataSource={editableDataSource}
                pagination={false}
                onChange={() => handleChange(editableDataSource)}
                components={{
                    body: VirtualList,
                }}
            />
        </ResizeObserver>
    </Form>
}