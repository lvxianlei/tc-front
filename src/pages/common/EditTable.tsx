import React from 'react'
import { Input, Button, Form, Row, Col } from 'antd'
import { FormItemType, FormItemTypesType } from '../common'
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList'
import styles from './EditTable.module.less'
interface EditableCellProps {
    columnItem: {
        title: string
        dataIndex: string
        key?: string
        render?: (fieldKey: number, remove: (index: number | number[]) => void) => JSX.Element
    }
    fieldKey: number
    remove: (index: number | number[]) => void
    [key: string]: any
}

const EditableCell: React.FC<EditableCellProps> = ({ columnItem, fieldKey, remove, ...props }) => {
    if (columnItem.render) {
        return columnItem.render(fieldKey, remove)
    }
    return <>{props.value}</>
}

interface DataType {
    [key: string]: any
}

type ColumnTypes = any[]

interface EditTableProps {
    columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string, type: FormItemTypesType })[]
    dataSource: DataType[]
}

export default function EditableTable({ columns = [], dataSource = [] }: EditTableProps): JSX.Element {
    const [form] = Form.useForm()
    columns = [
        { title: '序号', dataIndex: 'index', editable: false, render: (key: number): React.ReactNode => (<span>{key + 1}</span>) },
        ...columns,
        {
            title: '操作', dataIndex: 'opration', editable: false,
            render: (key: number, remove: (index: number | number[]) => void): JSX.Element => <Button type="link" onClick={() => remove(key)}>删除</Button>
        }
    ]
    console.log(columns,'-----')
    return (
        <Form form={form} initialValues={{ editableData: dataSource }}>
            <Form.List name="editableData">
                {
                    (fields: FormListFieldData[], { add, remove }: FormListOperation): React.ReactNode => (
                        <>
                            <Button onClick={() => add()} type="primary" style={{ marginBottom: 16 }}>
                                新增一行
                            </Button>
                            <Row className={styles.FormHeader}>
                                {columns.map((item, index) => (<Col key={`Editable_${index}`} span={item.width || 2}>{item.title}</Col>))}
                            </Row>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Row key={`EditableRow_${key}`} className={styles.FormHeader}>
                                    {columns.map((coItem, coIndex) => {
                                        return (<Col key={`EditableCol_${coIndex}`} span={coItem.width || 2}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, coItem.dataIndex]}
                                                fieldKey={[fieldKey, coItem.dataIndex]}
                                            >
                                                {coItem.editable === false ? <EditableCell columnItem={coItem as EditableCellProps['columnItem']} fieldKey={fieldKey} remove={remove} /> : <FormItemType type={coItem.type} />}
                                            </Form.Item>
                                        </Col>)
                                    }
                                    )}
                                </Row>
                            ))}
                        </>
                    )
                }
            </Form.List>
        </Form>
    )
}