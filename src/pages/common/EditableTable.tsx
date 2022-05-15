import React, { useCallback, useEffect, useState } from 'react'
import AliTable from './AliTable'
import { FormInstance, message, Button, Form, Space } from "antd"
import FormItemType from './FormItemType'
import { generateRules } from "./BaseInfo"
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
    rowKey?: string | ((row: any) => string)
}

const formatColunms = (columns: any[], haveIndex: boolean) => {
    const newColumns = columns.map(item => {
        const rules = generateRules(item.type, item)
        if (item.type === "popTable") {
            return ({
                title: `${item.required ? "*" : ""} ${item.title}`,
                code: item.dataIndex,
                render: (value: any, record: any, index: number) => <Form.Item
                    style={{ margin: 0 }}
                    rules={rules}
                    name={['submit', index, item.dataIndex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            })
        }
        return ({
            ...item,
            title: `${item.required ? "*" : ""} ${item.title}`,
            code: item.dataIndex,
            render: (value: any, record: any, index: number) => {
                return <Form.Item
                    style={{ margin: 0 }}
                    rules={rules}
                    name={['submit', index, item.dataIndex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            }
        })
    })
    haveIndex && newColumns.unshift({
        title: '序号',
        width: "60px",
        fixed: "left",
        dataIndex: 'index',
        render: (_: any, $: any, index: number): React.ReactNode => index + 1
    })
    return [
        ...newColumns,
        {
            title: "",
            code: "id",
            width: 0,
            render: (value: any, record: any, index: number) => {
                return <Form.Item
                    hidden
                    name={['submit', index, "id"]}>
                    <FormItemType data={{ title: "", dataIndex: "id" }} type="text" />
                </Form.Item>
            }
        }]
}


export default function EditableTable({
    columns, dataSource = [], onChange, form, haveNewButton = true,
    newButtonTitle = "新增一行", haveOpration = true, haveIndex = true, opration, rowKey
}: EditableTableProps): JSX.Element {
    const [editableDataSource, setEditableDataSource] = useState<any[]>(dataSource.map(item => ({
        ...item,
        id: item.id || (Math.random() * 1000000).toFixed(0)
    })))

    const [eidtableColumns, setEditableColumns] = useState<any[]>(formatColunms(columns, haveIndex))

    useEffect(() => {
        setEditableColumns(formatColunms(columns, haveIndex))
    }, [JSON.stringify(columns)])

    useEffect(() => {
        const newDataSource = dataSource.map(item => ({ ...item, id: item.id || (Math.random() * 1000000).toFixed(0) }))
        setEditableDataSource(newDataSource)
        form && form.setFieldsValue({ submit: newDataSource })
    }, [JSON.stringify(dataSource)])

    const removeItem = useCallback((id: string) => {
        const removedDataSource = editableDataSource.filter(item => item.id !== id);
        setEditableDataSource(removedDataSource)
        form && form.setFieldsValue({ submit: removedDataSource })
    }, [editableDataSource, setEditableDataSource, form])

    const onFormChange = useCallback((changedValues: any, allChangeValues: any) => {
        const changedDataSource = editableDataSource
        const currentRowData = { ...editableDataSource[changedValues.submit.length - 1], ...changedValues.submit[changedValues.submit.length - 1] }
        changedDataSource[changedValues.submit.length - 1] = currentRowData
        setEditableDataSource(changedDataSource)
        onChange && onChange(changedValues, allChangeValues)
    }, [setEditableDataSource, onChange, editableDataSource])

    return <Form
        form={form}
        onValuesChange={onFormChange}
    >
        {(haveNewButton || opration) && <Space size={16} style={{ height: 32, margin: "0 16px 16px 0" }}>{haveNewButton && <Button
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
        >{newButtonTitle}</Button>}
            {opration}
        </Space>}
        <AliTable
            size="small"
            className="edit"
            primaryKey={rowKey || "id"}
            style={{ overflow: 'auto', minHeight: 400 }}
            defaultColumnWidth={150}
            columns={haveOpration ? [
                ...eidtableColumns,
                {
                    title: "操作",
                    lock: true,
                    width: 40,
                    code: "opration",
                    render: (_: undefined, record: any) => <Button style={{ paddingLeft: 0 }} size="small" type="link" onClick={() => removeItem(record.id)}>删除</Button>
                }
            ] : eidtableColumns}
            dataSource={editableDataSource}
            useVirtual={{ vertical: true }}
        />
    </Form>
}