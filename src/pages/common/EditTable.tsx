import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { FormInstance } from 'antd/lib/form';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    {/* <tr {...props} /> */ }
    return (
        <Form.List name="editTable">
            {(fields, { add, remove }) => (<>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                    
                ))}
            </>)}
        </Form.List>
    )
}

interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    ...restProps
}) => {
    let childNode = children;
    if (!editable) {
        childNode = (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
            >
                <Input />
            </Form.Item>
        )
    }
    return <td {...restProps}>{childNode}</td>
}

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
    [key: string]: any
}

interface EditableTableState {
    dataSource: DataType[]
    count: number
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface EditTableProps {
    columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[]
    dataSource: object[]
}

export default function EditableTable({ columns = [], dataSource = [] }: EditTableProps): JSX.Element {
    const [tableData, setTableData] = useState<EditableTableState>({ dataSource: dataSource.map((item, index) => ({ ...item, key: index })) || [], count: dataSource.length })
    const [form] = Form.useForm()

    const handleDelete = (key: React.Key) => {
        setTableData({ ...tableData, dataSource: tableData.dataSource.filter(item => item.key !== key) })
    }

    const handleAdd = () => {
        const { count, dataSource } = tableData
        const newData: DataType = {
            key: count,
            index: dataSource.length + 1
        }
        setTableData({
            dataSource: [...dataSource, newData],
            count: count + 1
        })
    }

    const handleSave = async () => {
        const result = await form.validateFields()
        console.log("---------", result)
    }

    columns = [
        { title: '序号', dataIndex: 'index', editable: true, render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        ...columns,
        { title: '操作', dataIndex: 'opration', editable: true, render: (_a: any, _b: any): JSX.Element => <Button type="link" onClick={() => handleDelete(_b.key)}>删除</Button> }
    ]

    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                新增一行
            </Button>
            <Button onClick={handleSave}>保存</Button>
            <Form form={form} initialValues={{ editTable: { editTable: { editTable: dataSource } } }}>
                <Table
                    components={{
                        body: {
                            row: EditableRow,
                            cell: EditableCell,
                        }
                    }}
                    rowClassName={() => 'editable-row'}
                    bordered
                    rowKey={(record: any) => `EditTable_${record.id}`}
                    dataSource={dataSource}
                    columns={columns.map((col: any) => ({
                        ...col,
                        onCell: (record: DataType) => ({
                            record,
                            editable: col.editable,
                            dataIndex: col.dataIndex,
                            title: col.title
                        })
                    })) as ColumnTypes}
                />
            </Form>
        </div>
    )
}