import React, { useCallback, useEffect, useState } from 'react'
import AliTable from './AliTable'
import { FormInstance, message, Row, Button, Form } from "antd"
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
}

const formatColunms = (columns: any[], haveOpration: boolean, haveIndex: boolean, onRemove: (id: string) => void) => {
    const newColumns = columns.map(item => {
        if (item.type === "popTable") {
            return ({
                title: item.title,
                code: item.dataIndex,
                render: (value: any, record: any, index: number) => <Form.Item
                    style={{ margin: 0 }}
                    rules={item.rules}
                    name={['submit', index, item.dataIndex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            })
        }
        return ({
            title: item.title,
            code: item.dataIndex,
            render: (value: any, record: any, index: number) => {
                return <Form.Item
                    style={{ margin: 0 }}
                    rules={item.rules}
                    name={['submit', index, item.dataIndex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            },
            ...item
        })
    })
    haveOpration && newColumns.push({
        title: "操作",
        lock: true,
        width: "80px",
        code: "opration",
        render: (_: undefined, record: any) => {
            return <Button style={{ paddingLeft: 0 }} size="small" type="link" onClick={() => onRemove(record.id)}>删除</Button>
        }
    })
    haveIndex && newColumns.unshift({
        title: '序号',
        width: "60px",
        fixed: "left",
        dataIndex: 'index',
        render: (_: any, $: any, index: number): React.ReactNode => index + 1
    })
    return newColumns
}


export default function EditableTable({
    columns, dataSource = [], onChange, form, haveNewButton = true,
    newButtonTitle = "新增一行", haveOpration = true, haveIndex = true, opration
}: EditableTableProps): JSX.Element {
    const [editableDataSource, setEditableDataSource] = useState<any[]>(dataSource.map(item => ({
        ...item,
        id: item.id || (Math.random() * 1000000).toFixed(0)
    })))

    const removeItem = (id: string) => {
        console.log("id:", id, editableDataSource)
        const removedDataSource = editableDataSource.filter(item => item.id !== id);
        setEditableDataSource(removedDataSource)
        console.log(editableDataSource)
        form && form.setFieldsValue({ submit: editableDataSource })
        console.log(form?.getFieldsValue())

    }

    const [eidtableColumns, setEditableColumns] = useState<any[]>(formatColunms(columns, haveOpration, haveIndex, removeItem))

    useEffect(() => {
        setEditableColumns(formatColunms(columns, haveOpration, haveIndex, removeItem))
    }, [JSON.stringify(columns)])

    useEffect(() => {
        setEditableDataSource(dataSource.map(item => ({ ...item, id: item.id || (Math.random() * 1000000).toFixed(0) })))
        form && form.setFieldsValue({ submit: dataSource })
    }, [JSON.stringify(dataSource)])
    console.log(editableDataSource)
    return <Form
        form={form}
        onValuesChange={onChange}
    >
        <Row>{haveNewButton && <Button
            onClick={async () => {
                try {
                    form && await form.validateFields();
                    const addedEditDataSource = [{ id: (Math.random() * 1000000).toFixed(0) }, ...editableDataSource]
                    setEditableDataSource(addedEditDataSource)
                    form && form.setFieldsValue({ submit: addedEditDataSource })
                } catch (error) {
                    message.warning("所有数据校验通过才能继续新增...")
                }
            }}
            type="primary"
            style={{ height: 32, margin: "0 16px 16px 0" }}>{newButtonTitle}</Button>
        }
            {opration}
        </Row>
        <AliTable
            size="small"
            primaryKey="id"
            style={{ overflow: 'auto', maxHeight: 400 }}
            defaultColumnWidth={150}
            columns={eidtableColumns}
            dataSource={editableDataSource}
            useVirtual={{ vertical: true }}
        />
    </Form>
}