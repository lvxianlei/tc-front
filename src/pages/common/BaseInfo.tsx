import React from "react"
import { Descriptions, Form, FormInstance, Row, Col } from "antd"
import { FormItemType } from '../common'
import styles from './BaseInfo.module.less'
import { FormItemTypesType } from "./FormItemType"
import moment from "moment"
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
    dataSource: { [key: string]: any }
    columns: any[]
    edit?: boolean
    col?: number
    form?: FormInstance<any>
    onChange?: (changedFields: any, allFields: any, dataSource: { [key: string]: any }) => void
}

function formatDataType(dataItem: any, dataSource: any): string {
    const value = dataSource[dataItem.dataIndex]
    const types: any = {
        number: value && value !== -1 ? value : "-",
        select: (value && dataItem.enum && value !== -1) ? dataItem.enum.find((item: any) => item.value === value)?.label : "-",
        date: value ? moment(value).format(dataItem.format || "YYYY-MM-DD HH:mm:ss") : "-",
        string: value || "-",
        textarea: value || "-",
        popTable: value || "-"
    }
    return types[dataItem.type || "string"]
}

export default function BaseInfo({ dataSource, columns, form, edit, col = 4, onChange = () => { } }: BaseInfoProps): JSX.Element {
    if (edit) {
        return <Form
            onValuesChange={(changedFields, allFields) => onChange(changedFields, allFields, dataSource)}
            form={form}
            initialValues={dataSource}
            labelAlign="right"
            layout="inline"
            labelCol={{ style: { width: '80px', whiteSpace: "break-spaces" } }}
        >
            <Row gutter={[0, 10]}>
                {columns.map((item: any, index: number) => <Col key={`form_item_${index}`} span={24 / col}>
                    <Col span={24}>
                        <Form.Item name={item.dataIndex} label={item.title} rules={item.rules || []}>
                            {item.render ? item.render() : <FormItemType type={item.type} data={item} />}
                        </Form.Item>
                    </Col>
                </Col>
                )}
            </Row>
        </Form>
    }

    return <Descriptions bordered column={col} size="small" className={styles.baseInfo} >
        {columns.map((item: any, index: number) => <Descriptions.Item contentStyle={{ width: `${100 / (col * 2)}%` }} key={`desc_${index}`} label={item.title}>{formatDataType(item, dataSource)}</Descriptions.Item>)}
    </Descriptions>
}