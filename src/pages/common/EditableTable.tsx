import React, { useRef, useState } from 'react'
import type { ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { Form } from 'antd'

interface EditableTableProps {
    columns: ProColumns<any>[]
    dataSource: any[]
    onChange?: () => void
}

export default function EditableTable({ columns, dataSource, onChange, ...props }: EditableTableProps): JSX.Element {
    const actionRef = useRef<ActionType>()
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
    const [form] = Form.useForm()
    return <EditableProTable<any>
        rowKey="id"
        actionRef={actionRef}
        headerTitle="可编辑表格"
        maxLength={5}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        value={dataSource}
        onChange={onChange}
        editable={{
            form,
            editableKeys,
            onSave: async () => {
                
            },
            onChange: setEditableRowKeys,
            actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
    />
}