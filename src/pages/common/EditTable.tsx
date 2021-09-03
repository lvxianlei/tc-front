import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Input, Button, Popconfirm, Form, TableColumnProps } from 'antd'
import { FormInstance } from 'antd/lib/form'
import './EditTable.less'
const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
    key: string
    name: string
    age: string
    address: string
}

interface EditableRowProps {
    index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
    handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef<Input>(null)
    const form = useContext(EditableContext)!

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
        try {
            const values = await form.validateFields()

            toggleEdit()
            handleSave({ ...record, ...values })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    let childNode = children

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        )
    }

    return <td {...restProps}>{childNode}</td>
}

interface DataType {
    key: React.Key
    name: string
    age: string
    address: string
}

interface EditableTableState {
    dataSource: DataType[]
    count: number
}

export interface EditableTableProps {
    columns: TableColumnProps<object>[]
    dataSource: object[]
}

export default function EditTable({ columns = [], dataSource = [] }: EditableTableProps): JSX.Element {
    const [tableData, setTableData] = useState<EditableTableState>({ dataSource: [], count: 2 })

    const handleDelete = (key: React.Key) => {
        const dataSource = [...tableData.dataSource]
        setTableData({ ...tableData, dataSource: dataSource.filter(item => item.key !== key) })
    }

    const handleAdd = () => {
        const { count, dataSource } = tableData
        const newData: DataType = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        }
        setTableData({
            dataSource: [...dataSource, newData],
            count: count + 1,
        })
    }

    const handleSave = (row: DataType) => {
        const newData = [...tableData.dataSource]
        const index = newData.findIndex(item => row.key === item.key)
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...row,
        })
        setTableData({ ...tableData, dataSource: newData })
    }
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    }

    return (
        <>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>新增一条</Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={tableData.dataSource}
                columns={columns.map((col: any) => {
                    if (!col.editable) { return col }
                    return {
                        ...col,
                        onCell: (record: DataType) => ({
                            record,
                            editable: col.editable,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            handleSave: handleSave,
                        }),
                    }
                })}
            />
        </>
    )
}