import React, { useCallback, useEffect, useState } from 'react'
import AliTable from './AliTable'
import { FormInstance, message, Row, Button, Form, Table } from "antd"
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

const formatColunms = (columns: any[], haveOpration: boolean, haveIndex: boolean) => {
    const newColumns = columns.map(item => {
        if (item.type === "popTable") {
            return ({
                title: item.title,
                dataIndex: item.dataIndex,
                render: (value: any, record: any) => <Form.Item
                    style={{ margin: 0 }}
                    rules={item.rules}
                    name={[record.id, item.dataindex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            })
        }
        return ({
            title: item.title,
            dataIndex: item.dataIndex,
            render: (value: any, record: any) => {
                return <Form.Item
                    style={{ margin: 0 }}
                    rules={item.rules}
                    name={[record.id, item.dataindex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            },
            ...item
        })
    })
    haveOpration && newColumns.push({
        title: "操作",
        fixed: "right",
        width: "80px",
        dataIndex: "opration",
        render: (_: undefined, record: any) => {
            return <Button style={{ paddingLeft: 0 }} size="small" type="link">删除</Button>
        }
    })
    haveIndex && newColumns.unshift({
        title: '序号',
        width: "60px",
        fixed: "left",
        dataIndex: 'index',
        editable: false,
        render: (_: any, $: any, index: number): React.ReactNode => index + 1
    })
    return newColumns
}

function VirtualList(props: any) {
    console.log(props)
    return <div key={props.id}>aaaaaaaaaa</div>
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
    const [editableDataSource, setEditableDatasource] = useState<any[]>(dataSource)
    const [eidtableColumns, setEditableColumns] = useState<any[]>(formatColunms(columns, haveOpration, haveIndex))

    const handleChange = useCallback((data: any[]) => {
        onChange && onChange(data, editableDataSource)
    }, [dataSource, onChange, JSON.stringify(editableDataSource)])

    useEffect(() => {
        setEditableColumns(formatColunms(columns, haveOpration, haveIndex))
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
        <AliTable
            size="small"
            columns={eidtableColumns}
            dataSource={editableDataSource}
        />
    </Form>
}