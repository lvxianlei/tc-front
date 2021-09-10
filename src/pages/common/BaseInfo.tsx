import React from "react"
import { Descriptions, Form, FormInstance } from "antd"
import { FormItemType } from '../common'
import styles from './BaseInfo.module.less'
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
    form?: FormInstance<any>
}

export default function BaseInfo({ dataSource, columns, form, edit, col = 4 }: BaseInfoProps): JSX.Element {
    if (edit) {
        return <Form form={form} initialValues={dataSource} >
            <Descriptions bordered column={col} size="small" className={styles.baseInfo}>
                {columns.map((item: any, index: number) => <Descriptions.Item contentStyle={{ width: `${100 / (col * 2)}%` }} key={`desc_${index}`} label={item.title}>
                    <Form.Item name={item.dataIndex} label={dataSource[item.title]}>
                        <FormItemType type={item.type} />
                    </Form.Item>
                </Descriptions.Item>)}
            </Descriptions>
        </Form>
    }

    return <Descriptions bordered column={col} size="small" className={styles.baseInfo} >
        {columns.map((item: any, index: number) => <Descriptions.Item contentStyle={{ width: `${100 / (col * 2)}%` }} key={`desc_${index}`} label={item.title}>{dataSource[item.dataIndex] || ''}</Descriptions.Item>)}
    </Descriptions>
}