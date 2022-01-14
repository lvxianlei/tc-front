import React, { useEffect, useRef, useState } from 'react'
import type { ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { Pagination, FormInstance, message } from "antd"
import style from "./EditTable.module.less"
import FormItemType from './FormItemType'
interface EditableTableProps {
    columns: ProColumns<any>[]
    dataSource: any[]
    form: FormInstance
    onChange?: (data: any[]) => void
}

interface PagenationState {
    current: number
    pageSize: number
    total: number
}

export default function EditableTable({ columns, dataSource, onChange, form, ...props }: EditableTableProps): JSX.Element {
    const actionRef = useRef<ActionType>()
    const [{ current, pageSize, total }, setPagenaton] = useState<PagenationState>({
        current: 1,
        pageSize: 3,
        total: dataSource.length
    })
    const [editableDataSource, setEditableDatasource] = useState<any[]>(dataSource)
    const [currentDatasource, setCurrentDatasource] = useState<any[]>(editableDataSource.slice((current - 1) * pageSize, current * pageSize))
    const handleChange = (data: any[]) => {
        setCurrentDatasource(dataSource)
        onChange && onChange(data)
    }

    useEffect(() => {
        setPagenaton({ current, pageSize, total: editableDataSource.length })
        setCurrentDatasource(editableDataSource.slice((current - 1) * pageSize, current * pageSize))
    }, [current, pageSize, total, editableDataSource.length])

    return <nav>
        <EditableProTable<any>
            rowKey="id"
            size="small"
            actionRef={actionRef}
            maxLength={5}
            className={style.editableTable}
            recordCreatorProps={false}
            columns={columns.map((item: any) => {
                if (item.type === "opration") {
                    return ({
                        title: item.title,
                        dataIndex: item.dataIndex,
                        valueType: "option",
                        ...item
                    })
                } else {
                    return ({
                        title: item.title,
                        dataIndex: item.dataIndex,
                        formItemProps: {
                            rules: item.rules || []
                        },
                        renderFormItem: () => <FormItemType data={item} type={item.type} />,
                        ...item
                    })
                }
            })}
            value={currentDatasource}
            onChange={handleChange}
            editable={{
                form,
                editableKeys: editableDataSource.map(item => item.id),
                onDelete: key => new Promise(() => {
                    const newEditableDatasource: any[] = editableDataSource.filter((item: any) => item.id !== key)
                    setEditableDatasource(newEditableDatasource)
                    setCurrentDatasource(newEditableDatasource.slice((current - 1) * pageSize, current * pageSize))
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
                onChange: () => {
                    setCurrentDatasource(editableDataSource.slice((current - 1) * pageSize, current * pageSize))
                },
                actionRender: (row, config, dom) => [dom.delete],
            }}
            {...props}
        />
        <Pagination
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
        />
    </nav>
}