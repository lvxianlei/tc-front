import React, { useCallback, useEffect, useState } from 'react'
import { FormInstance, message, Button, Form, Space } from "antd"
import FormItemType from './FormItemType'
import { generateRules } from "./BaseInfo"
import CommonAliTable from './CommonAliTable'
interface EditableTableProps {
    columns: any[]
    dataSource: any[]
    haveNewButton?: boolean
    newButtonTitle?: string
    haveOpration?: boolean
    haveIndex?: boolean
    form?: FormInstance
    opration?: React.ReactNode[]
    addData?: { [key: string]: any } | ((data: any) => { [key: string]: any })
    onChange?: (data: any[], allFields: any[]) => void
    rowKey?: string | ((row: any) => string)
    [key: string]: any
}

const formatColunms = (columns: any[], haveIndex: boolean) => {
    const newColumns = columns.map(item => {
        const rules = generateRules(item.type, item)
        if (item.type === "popTable") {
            return ({
                title: item.required ? <><span style={{ color: "#ff4d4f", padding: "0px 4px" }}>*</span>{item.title}</> : item.title,
                code: item.dataIndex,
                render: (_value: any, _record: any, index: number) => <Form.Item
                    style={{ margin: 0 }}
                    rules={rules}
                    name={['submit', index, item.dataIndex]}>
                    <FormItemType data={item} type={item.type} />
                </Form.Item>
            })
        }
        return ({
            ...item,
            title: item.required ? <><span style={{ color: "#ff4d4f", padding: "0px 4px" }}>*</span>{item.title}</> : item.title,
            code: item.dataIndex,
            render: (value: any, _record: any, index: number) => {
                return item.edit === false ? <>
                    {value}
                    <Form.Item
                        style={{ margin: 0 }}
                        hidden
                        rules={rules}
                        name={['submit', index, item.dataIndex]}>
                        <FormItemType data={{ ...item, width: "100%" }} type={item.type} />
                    </Form.Item>
                </> : <Form.Item
                    style={{ margin: 0 }}
                    rules={rules}
                    name={['submit', index, item.dataIndex]}>
                    <FormItemType data={{ ...item, title: "", width: "100%" }} type={item.type} />
                </Form.Item>
            }
        })
    })
    haveIndex && newColumns.unshift({
        title: '序号',
        width: 50,
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
            render: (_value: any, _record: any, index: number) => {
                return <Form.Item
                    hidden
                    name={['submit', index, "id"]}>
                    <FormItemType data={{ title: "", dataIndex: "id" }} type="text" />
                </Form.Item>
            }
        }]
}


export default function EditableTable({
    columns, dataSource = [], onChange, form, haveNewButton = true, addData = {},
    newButtonTitle = "新增一行", haveOpration = true, haveIndex = true, opration, rowKey, ...props
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
        form && form.setFieldsValue({ submit: removedDataSource })
        onFormChange && onFormChange({
            submit: [editableDataSource.find((item: any) => item.id === id)],
            type: "remove"
        }, { submit: removedDataSource })
        setEditableDataSource(removedDataSource)
    }, [editableDataSource, setEditableDataSource, form])

    const onFormChange = useCallback((changedValues: any, allChangeValues: any) => {
        const changedDataSource = editableDataSource
        const currentRowData = { ...editableDataSource[changedValues.submit.length - 1], ...changedValues.submit[changedValues.submit.length - 1] }
        changedDataSource[changedValues.submit.length - 1] = currentRowData
        setEditableDataSource(changedDataSource)
        onChange && onChange(changedValues, allChangeValues)
    }, [setEditableDataSource, onChange, editableDataSource])

    const handleNewButtonClick = async () => {
        try {
            form && await form.validateFields();
            const editableDataSource = form?.getFieldsValue()
            const newRowData = {
                id: (Math.random() * 1000000).toFixed(0),
                ...(typeof addData === "function" ? addData(editableDataSource?.submit || []) : addData)
            }
            const addedEditDataSource = [newRowData, ...editableDataSource?.submit || []]
            form && form.setFieldsValue({ submit: addedEditDataSource })
            onFormChange && onFormChange({ submit: [newRowData], type: "add" }, { submit: addedEditDataSource })
            setEditableDataSource(addedEditDataSource)
        } catch (error) {
            console.log(error)
            message.warning("所有数据校验通过才能继续新增...")
        }
    }
    return <Form
        form={form}
        onValuesChange={onFormChange}
    >
        {(haveNewButton || opration) && <Space size={16} style={{ height: 32, margin: "0 16px 16px 0" }}>{haveNewButton && <Button
            onClick={handleNewButtonClick}
            type="primary"
        >{newButtonTitle}</Button>}
            {opration}
        </Space>}
        <CommonAliTable
            size="small"
            className="edit"
            primaryKey={rowKey || "id"}
            style={{ overflow: 'auto', paddingBottom: 20 }}
            defaultColumnWidth={150}
            columns={haveOpration ? [
                ...eidtableColumns,
                {
                    title: "操作",
                    lock: true,
                    width: 40,
                    code: "opration",
                    render: (_: undefined, record: any) => <Button
                        style={{ paddingLeft: 0 }}
                        size="small"
                        type="link"
                        onClick={() => removeItem(record.id)}
                    >删除</Button>
                }
            ] : eidtableColumns}
            dataSource={editableDataSource}
            useVirtual={{ vertical: true }}
            {...props}
        />
    </Form>
}