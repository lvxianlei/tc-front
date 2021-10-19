import React, { useState } from 'react'
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
    columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string, type: FormItemTypesType })[]
    dataSource: any[]
    form?: FormInstance
    opration?: React.ReactNode[]
    haveNewButton?: boolean
    newButtonTitle?: string
    haveOpration?: boolean
    onChange?: (changeFiled: any, allChangeFileds: any) => void
}

export default function EditableTable({ columns = [], dataSource = [], form,
    haveNewButton = true, newButtonTitle, haveOpration = true, opration, onChange }: EditTableProps): JSX.Element {
    const [dataState] = useState<any>({ data: dataSource || [], loading: false })
    const baseRowData: { [key: string]: string | number | null } = {}
    columns.forEach(item => baseRowData[item.dataIndex] = null)
    columns = haveOpration ? [
        { title: '序号', dataIndex: 'index', width: 50, editable: false, render: (key: number, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        ...columns,
        {
            title: '操作', dataIndex: 'opration', width: 50, editable: false,
            render: (key: number, _: number, remove: (index: number | number[]) => void): JSX.Element => <Button type="link" onClick={() => handleRemove(remove, key)}>删除</Button>
        }
    ] : [
        { title: '序号', dataIndex: 'index', width: 50, editable: false, render: (key: number, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        ...columns
    ]
    const handleRemove = (remove: any, key: any) => {
        remove(key)
    }
    const vlist: React.FC<any> = ({
        height,
        isScrolling,
        onChildScroll,
        scrollTop,
        onRowsRendered,
        width,
        fields, remove }) => (
        <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            overscanRowCount={2}
            rowCount={dataState.data.length}
            rowHeight={36}
            rowRenderer={({ index, key, style }) => {
                const { fieldKey, name, ...restField } = fields[index]
                return (<Row key={`EditableRow_${key}`} style={style} className={`${styles.FormHeader} ${styles.FormRow}`}>
                    {columns.map((coItem, coIndex) => {
                        return (<Col key={`EditableCol_${coIndex}`} span={2}>
                            <Form.Item
                                {...restField}
                                className={styles.formItem}
                                name={[name, coItem.dataIndex]}
                                fieldKey={[fieldKey, coItem.dataIndex]}
                            >
                                {coItem.editable === false ? <EditableCell columnItem={coItem as EditableCellProps['columnItem']} fieldKey={name} index={index} remove={remove} /> : <FormItemType type={coItem.type} data={coItem} />}
                            </Form.Item>
                        </Col>)
                    }
                    )}
                </Row>)
            }}
            onRowsRendered={onRowsRendered}
            scrollTop={scrollTop}
            width={width}
        />
    )

    const autoSizer: React.FC<any> = ({ height, isScrolling, onChildScroll,
        scrollTop, onRowsRendered, fields, remove }) => <AutoSizer disableHeight>{({ width }) =>
            vlist({
                height,
                isScrolling,
                onChildScroll,
                scrollTop,
                onRowsRendered,
                width,
                fields,
                remove
            })
        }</AutoSizer>

    return (
        <Form form={form} onValuesChange={onChange} initialValues={{ submit: dataState.data }} className={styles.editable}>
            <Form.List name="submit">
                {
                    (fields: FormListFieldData[], { add, remove }: FormListOperation): React.ReactNode => (
                        <>
                            {haveNewButton && <Row><Button onClick={async () => {
                                try {
                                    await form?.validateFields()
                                    add({ ...baseRowData, uid: dataState.data.length + 1 })
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
                                <Row className={styles.FormHeader}>
                                    {columns.map((item, index) => (<Col
                                        key={`Editable_${index}`}
                                        style={{ width: 100, backgroundColor: "#f5f5f5" }}
                                        className={item.required ? styles.required : ""} span={2}>{item.title}</Col>))}
                                </Row>
                                {fields.map(({ key, name, fieldKey, ...restField }, index: number) => (
                                    <Row style={{ width: "100%" }} key={`EditableRow_${key}`} className={`${styles.FormHeader} ${styles.FormRow}`}>
                                        {columns.map((coItem, coIndex) => (<Col key={`EditableCol_${coIndex}`} span={2}>
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
                        </>
                    )
                }
            </Form.List>
        </Form>
    )
}