import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col, FormInstance, message } from 'antd'
import List from 'react-virtualized/dist/commonjs/List'
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { FormItemType, FormItemTypesType } from '../common'
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList'
import styles from './EditTable.module.less'
import './EditTable.module.less'
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

export interface EditTableProps {
    columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string,
        type: FormItemTypesType,
        span?: number
    })[]
    dataSource: any[]
    form?: FormInstance
    opration?: React.ReactNode[]
    haveNewButton?: boolean
    newButtonTitle?: string
    addRowData?: { [key: string]: any }
    haveOpration?: boolean
    haveIndex?: boolean
    onChange?: (changeFiled: any, allChangeFileds: any) => void
    autoScroll?: boolean
}

export default function EditableTable({
    columns = [],
    dataSource = [],
    form,
    addRowData = {},
    haveNewButton = true,
    newButtonTitle,
    haveOpration = true,
    haveIndex = true,
    opration, onChange,
    autoScroll = false }: EditTableProps): JSX.Element {
    const [IDataSource, setDataSource] = useState<any>(dataSource)
    const baseRowData: { [key: string]: string | number | null } = {}
    columns.forEach(item => baseRowData[item.dataIndex] = null)
    columns = haveOpration ? [
        ...columns,
        {
            title: '操作',
            dataIndex: 'opration',
            span: 1,
            editable: false,
            render: (fieldKey: number, index: number, remove: (index: number | number[]) => void): JSX.Element => <Button type="link" onClick={() => handleRemove(remove, fieldKey)}>删除</Button>
        }
    ] : columns
    columns = haveIndex ? [
        { title: '序号', dataIndex: 'index', span: 1, editable: false, render: (key: number, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        ...columns
    ] : columns
    const handleRemove = (remove: any, key: any) => {
        remove(key)
        onchange && (onChange as any)({ submit: [] }, form?.getFieldsValue())
    }

    useEffect(() => {
        setDataSource({ submit: dataSource })
        form && form.setFieldsValue({ submit: dataSource })
    }, [JSON.stringify(dataSource)])
    return (
        <Form form={form} onValuesChange={onChange} initialValues={{ submit: IDataSource }} className={styles.editable}>
            <Form.List name="submit">
                {
                    (fields: FormListFieldData[], { add, remove }: FormListOperation): React.ReactNode => (
                        <>
                            {haveNewButton && <Row><Button onClick={async () => {
                                try {
                                    await form?.validateFields()
                                    add({ ...baseRowData, uid: IDataSource.length + 1, ...(addRowData) })
                                } catch (error) {
                                    message.error("当前行验证通过后才可以继续新增...")
                                    console.log(error)
                                }
                            }} type="primary" style={{ height: 32, margin: "0 16px 16px 0" }}>{newButtonTitle || "新增一行"}</Button>{opration}</Row>}

                            {/* <Row style={{ position: "relative", height: 400 }}>
                                <WindowScroller>
                                    {({ height, isScrolling, onChildScroll, scrollTop }) => autoSizer({
                                        height,
                                        isScrolling,
                                        onChildScroll,
                                        scrollTop,
                                        fields,
                                        remove
                                    })}
                                </WindowScroller>
                            </Row> */}
                            <div style={{ overflowX: "auto" }}>
                                <Row className={styles.FormHeader} style={{height: 36, lineHeight: 36}}>
                                    {columns.map((item, index) => (<Col
                                        key={`Editable_${index}`}
                                        style={{ width: 100, backgroundColor: "#f5f5f5" }}
                                        className={item.required ? styles.required : ""} span={item.span || 2}>{item.title}</Col>))}
                                </Row>
                                <div style={{ height: autoScroll ? "600px" : '', overflow: autoScroll ? 'auto' : '' }}>
                                    {fields.map(({ key, name, fieldKey, ...restField }, index: number) => (
                                        <Row style={{ width: "100%" }} key={`EditableRow_${key}`} className={`${styles.FormHeader} ${styles.FormRow}`}>
                                            {columns.map((coItem, coIndex) => (<Col key={`EditableCol_${coIndex}`} span={coItem.span || 2}>
                                                <Form.Item
                                                    {...restField}
                                                    className={styles.formItem}
                                                    name={[name, coItem.dataIndex]}
                                                    fieldKey={[fieldKey, coItem.dataIndex]}
                                                    rules={coItem.rules || []}
                                                >
                                                    {coItem.editable === false ? <EditableCell columnItem={coItem as EditableCellProps['columnItem']} fieldKey={name} index={index} remove={remove} /> : <FormItemType type={coItem.type} data={coItem} />}
                                                </Form.Item>
                                            </Col>)
                                            )}
                                        </Row>
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                }
            </Form.List>
        </Form>
    )
}