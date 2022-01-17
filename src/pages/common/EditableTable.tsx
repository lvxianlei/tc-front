import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { Pagination, FormInstance, message, Row, Button, Form } from "antd"
import style from "./EditTable.module.less"
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

interface PagenationState {
    current: number
    pageSize: number
    total: number
}

const formatColunms = (columns: any[], haveOpration: boolean, haveIndex: boolean) => {
    let newColumns = columns.map(item => ({
        title: item.title,
        dataIndex: item.dataIndex,
        formItemProps: {
            rules: item.rules || []
        },
        renderFormItem: () => <FormItemType data={item} type={item.type} />,
        ...item
    }))
    haveOpration && newColumns.push({
        title: "操作",
        fixed: "right",
        width: 50,
        dataIndex: "opration",
        valueType: "option"
    })
    haveIndex && newColumns.unshift({
        title: '序号',
        width: 50,
        fixed: "left",
        dataIndex: 'index',
        editable: false,
        render: (_: any, $: any, index: number): React.ReactNode => index + 1
    })
    return newColumns
}

export default function EditableTable({
    columns,
    dataSource = [],
    onChange,
    form,
    haveNewButton = true,
    newButtonTitle = "新增一行",
    haveOpration = true,
    haveIndex = true,
    opration,
    ...props }: EditableTableProps): JSX.Element {
    const actionRef = useRef<ActionType>()
    // const [form] = Form.useForm<FormInstance>()
    // const [{ current, pageSize, total }, setPagenaton] = useState<PagenationState>({ current: 1, pageSize: 1000, total: dataSource.length })
    const [editableDataSource, setEditableDatasource] = useState<any[]>(dataSource)
    // const [currentDatasource, setCurrentDatasource] = useState<any[]>(editableDataSource.slice((current - 1) * pageSize, current * pageSize))
    const [eidtableColumns, setEditableColumns] = useState<any[]>(formatColunms(columns, haveOpration, haveIndex))

    const handleChange = useCallback((data: any[]) => {
        // setCurrentDatasource(dataSource)
        onChange && onChange(data, editableDataSource)
    }, [dataSource, onChange, JSON.stringify(editableDataSource)])

    useEffect(() => {
        setEditableColumns(formatColunms(columns, haveOpration, haveIndex))
    }, [JSON.stringify(columns)])

    // useEffect(() => {
    // setPagenaton({ current, pageSize, total: editableDataSource.length })
    // setCurrentDatasource(editableDataSource.slice((current - 1) * pageSize, current * pageSize))
    // }, [current, pageSize, total, editableDataSource.length])

    return <nav>
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
        <EditableProTable<any>
            rowKey="id"
            size="small"
            actionRef={actionRef}
            maxLength={5}
            className={style.editableTable}
            recordCreatorProps={false}
            columns={eidtableColumns}
            // value={currentDatasource}
            value={editableDataSource}
            onChange={handleChange}
            editable={{
                form,
                type: "multiple",
                editableKeys: editableDataSource.map(item => item.id),
                onDelete: key => new Promise(() => {
                    const newEditableDatasource: any[] = editableDataSource.filter((item: any) => item.id !== key)
                    setEditableDatasource(newEditableDatasource)
                    // setCurrentDatasource(newEditableDatasource.slice((current - 1) * pageSize, current * pageSize))
                }),
                onValuesChange: (recordKey, recordList) => {
                    recordKey && setEditableDatasource(editableDataSource.map((item: any) => {
                        if (recordList.map(item => item.id).includes(item.id)) {
                            return recordList.find(fItem => fItem.id === item.id)
                        } else {
                            return item
                        }
                    }))
                },
                // onChange: () => setCurrentDatasource(editableDataSource.slice((current - 1) * pageSize, current * pageSize)),
                actionRender: (row, config, dom) => [dom.delete],
            }}
            {...props}
        />
        {/* <Pagination
            current={current}
            total={total}
            showTotal={(total, range) => `第${range[0]}-${range[1]}条/ 共${total}条`}
            pageSize={pageSize}
            size="small"
            showSizeChanger
            onChange={async (page: number, size: number | undefined) => {
                if (size !== pageSize) {
                    setPagenaton({ current, total: editableDataSource.length, pageSize: size || pageSize })
                    return
                }
                try {
                    form && await form.validateFields()
                    setPagenaton({ current: page, total: editableDataSource.length, pageSize: size || pageSize })
                } catch (error) {
                    message.warning("本页数据校验通过后，才能切换分页...")
                }
            }}
        /> */}
    </nav>
}