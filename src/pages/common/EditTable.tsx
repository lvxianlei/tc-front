import React from 'react'
import { Button, Form, Row, Col, FormInstance } from 'antd'
import { FormItemType, FormItemTypesType } from '../common'
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList'
import styles from './EditTable.module.less'
interface EditableCellProps {
    columnItem: {
        title: string
        dataIndex: string
        key?: string
        render?: (fieldKey: number, index: number, remove: (index: number | number[]) => void) => JSX.Element
    }
    fieldKey: number
    index: number
    remove: (index: number | number[]) => void
    [key: string]: any
}

const EditableCell: React.FC<EditableCellProps> = ({ columnItem, fieldKey, index, remove, ...props }) => {
    if (columnItem.render) {
        return columnItem.render(fieldKey, index, remove)
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
    form?: FormInstance
}

export default function EditableTable({ columns = [], dataSource = [], form }: EditTableProps): JSX.Element {
    const baseRowData: { [key: string]: string | number | null } = {}
    columns.forEach(item => baseRowData[item.dataIndex] = null)
    columns = [
        { title: '序号', dataIndex: 'index', width: 50, editable: false, render: (key: number, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        {
            title: '操作', dataIndex: 'opration', width: 50, editable: false,
            render: (key: number, _: number, remove: (index: number | number[]) => void): JSX.Element => <Button type="link" onClick={() => remove(key)}>删除</Button>
        },
        ...columns
    ]
    return (
        <Form form={form} initialValues={{ submit: dataSource }} className={styles.editable}>
            <Form.List name="submit">
                {
                    (fields: FormListFieldData[], { add, remove }: FormListOperation): React.ReactNode => (
                        <>
                            <Button onClick={() => add(baseRowData)} type="primary" style={{ marginBottom: 16 }}>
                                新增一行
                            </Button>
                            <Row className={styles.FormHeader}>
                                {columns.map((item, index) => (<Col key={`Editable_${index}`} span={item.width || 2}>{item.title}</Col>))}
                            </Row>
                            {fields.map(({ key, name, fieldKey, ...restField }, index: number) => (
                                <Row key={`EditableRow_${key}`} className={`${styles.FormHeader} ${styles.FormRow}`}>
                                    {columns.map((coItem, coIndex) => {
                                        return (<Col key={`EditableCol_${coIndex}`} span={coItem.width || 2}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, coItem.dataIndex]}
                                                fieldKey={[fieldKey, coItem.dataIndex]}
                                            >
                                                {coItem.editable === false ? <EditableCell columnItem={coItem as EditableCellProps['columnItem']} fieldKey={name} index={index} remove={remove} /> : <FormItemType type={coItem.type} data={coItem} />}
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