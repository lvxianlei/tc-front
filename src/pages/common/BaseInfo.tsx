import React from "react"
import { Descriptions, Form, FormInstance, Row, Col, TableColumnProps } from "antd"
import { FormItemType } from '../common'
import styles from './BaseInfo.module.less'
import { SelectData, InputData, PopTableData, FormItemTypesType } from "./FormItemType"
export interface BaseInfoItemProps {
    name: string
    label: string
    value: string | number | null | undefined
    type?: 'text' | 'number' | 'date' | 'select'
}

export interface BaseInfoColumnsProps {
    type?: FormItemTypesType
    path?: string
    columns?: any[]
    [key: string]: any
}

interface BaseInfoProps {
    dataSource: { [key in BaseInfoColumnsProps['title']]: any }
    columns: any[]
    edit?: boolean
    col?: number
    form?: FormInstance<any>
}

export default function BaseInfo({ dataSource, columns, form, edit, col = 4 }: BaseInfoProps): JSX.Element {
    if (edit) {
        return <Form form={form} initialValues={dataSource} labelAlign="right" layout="inline" labelCol={{ style: { width: '80px', whiteSpace: "break-spaces" } }}>
            <Row gutter={[0, 10]}>
                {columns.map((item: any, index: number) => <Col key={`form_item_${index}`} span={24 / col}>
                    <Col span={24}>
                        <Form.Item name={item.dataIndex} label={item.title}>
                            <FormItemType type={item.type} data={item} />
                        </Form.Item>
                    </Col>
                </Col>
                )}
            </Row>
        </Form>
    }

    return <Descriptions bordered column={col} size="small" className={styles.baseInfo} >
        {columns.map((item: any, index: number) => <Descriptions.Item contentStyle={{ width: `${100 / (col * 2)}%` }} key={`desc_${index}`} label={item.title}>{dataSource[item.dataIndex] || ''}</Descriptions.Item>)}
    </Descriptions>
}