import React from "react"
import { Descriptions, Form, Input, FormInstance } from "antd"

export interface BaseInfoItemProps {
    name: string
    label: string
    value: string | number | null | undefined
    type?: 'text' | 'number' | 'date' | 'select'
}

export interface BaseInfoColumnsProps {
    title: string | number,
    dataIndex: string,
    render?: () => JSX.Element
}

interface BaseInfoProps {
    dataSource: { [key in BaseInfoColumnsProps['title']]: any }
    columns: BaseInfoColumnsProps[]
    edit?: boolean
    col?: number
    onSave?: (form: FormInstance<any>) => void
}

export default function BaseInfo({ dataSource, columns, onSave, edit, col = 2 }: BaseInfoProps): JSX.Element {
    const [form] = Form.useForm()
    onSave && onSave(form)
    if (edit) {
        return <Form form={form} initialValues={dataSource} >
            <Descriptions bordered column={col}>
                {columns.map((item: any, index: number) => <Descriptions.Item contentStyle={{ width: `${100 / (col * 2)}%` }} key={`desc_${index}`} label={item.title}>
                    <Form.Item name={item.dataIndex} label={dataSource[item.title]}>
                        <Input />
                    </Form.Item>
                </Descriptions.Item>)}
            </Descriptions>
        </Form>
    }

    return <Descriptions bordered column={col}>
        {columns.map((item: any, index: number) => <Descriptions.Item contentStyle={{ width: `${100 / (col * 2)}%` }} key={`desc_${index}`} label={item.title}>{dataSource[item.dataIndex] || ''}</Descriptions.Item>)}
    </Descriptions>
}