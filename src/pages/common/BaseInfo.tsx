import React from "react"
import { Descriptions, Form, Input } from "antd"

export interface BaseInfoItemProps {
    name: string
    label: string
    value: string | number | null | undefined
    type?: 'string' | 'number' | 'date' | 'select'
}

interface BaseInfoProps {
    dataSource: BaseInfoItemProps[]
    edit?: boolean
}

export default function BaseInfo({ dataSource, edit }: BaseInfoProps): JSX.Element {

    if (edit) {
        const formData: { [key: string]: any } = {}
        dataSource.forEach((item: BaseInfoItemProps) => formData[item.name] = item.value)
        return <Form initialValues={formData}>
            <Descriptions bordered>
                {dataSource.map((item: any, index) => <Descriptions.Item key={`desc_${index}`} label={item.label}>
                    <Form.Item name={item.name}>
                        <Input />
                    </Form.Item>
                </Descriptions.Item>)}
            </Descriptions>
        </Form>
    }

    return <Descriptions bordered column={2}>
        {dataSource.map((item: any, index) => <Descriptions.Item key={`desc_${index}`} label={item.label}>{item.value}</Descriptions.Item>)}
    </Descriptions>
}