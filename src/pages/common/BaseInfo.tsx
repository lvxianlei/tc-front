import React from "react"
import { Descriptions, Form, FormInstance, Row, Col } from "antd"
import { FormItemType } from '../common'
import { FormItemTypesType } from "./FormItemType"
import moment from "moment"
import './BaseInfo.less'
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
        number: (value && value !== -1 && value !== 0 && value !== "0") ? value : "-",
        select: ((value || value === 0) && dataItem.enum) ? (dataItem.enum.find((item: any) => item.value === value)?.label || "-") : "-",
        date: value ? moment(value).format(dataItem.format || "YYYY-MM-DD HH:mm:ss") : "-",
        string: (value && !["-1", -1, "0", 0].includes(value)) ? value : "-",
        textarea: value || "-",
        popTable: value || "-"
    }
    return types[dataItem.type || "string"]
}

export function formatData(columns: any[], dataSource: any): object {
    const formatedData: { [key: string]: any } = {}
    Object.keys(dataSource).forEach((dataSourceKey: string) => {
        const dataItem = columns.find((columnItem: any) => columnItem.dataIndex === dataSourceKey)
        if (!dataItem) {
            formatedData[dataSourceKey] = ""
        } else {
            const value = dataSource[dataItem.dataIndex]
            const types: any = {
                number: (value && value !== -1) ? value : 0,
                select: [-1, "-1"].includes(value) || !value ? null : value,
                date: value ? moment(value).format(dataItem.format || "YYYY-MM-DD HH:mm:ss") : undefined,
                string: (value && !["-1", -1, "0", 0].includes(value)) ? value : "",
                textarea: value || "",
                popTable: value || ""
            }
            formatedData[dataSourceKey] = types[dataItem.type || "string"]
        }

    })
    return formatedData
}

export default function BaseInfo({ dataSource, columns, form, edit, col = 4, onChange = () => { } }: BaseInfoProps): JSX.Element {
    if (edit) {
        return <Form
            onValuesChange={(changedFields, allFields) => onChange(changedFields, allFields, dataSource)}
            form={form}
            initialValues={formatData(columns, dataSource)}
            labelAlign="right"
            layout="inline"
            labelCol={{ style: { width: '80px', whiteSpace: "break-spaces" } }}
        >
            <Row>
                {columns.map((item: any, index: number) => <Col key={`form_item_${index}`} span={item.type === "textarea" ? 24 : (24 / col)}>
                    <Col span={24} >
                        <div style={{ height: 56, marginBottom: item.type === "textarea" ? 20 : 0 }}>
                            <Form.Item className="baseInfoForm" name={item.dataIndex} label={item.title} rules={item.rules || []}>
                                {item.render ? item.render() : <FormItemType type={item.type} data={item} />}
                            </Form.Item>
                        </div>
                    </Col>
                </Col>
                )}
            </Row>
        </Form>
    }

    return <Descriptions bordered column={col} size="small" >
        {columns.map((item: any, index: number) => <Descriptions.Item
            contentStyle={{ width: `${100 / (col * 2)}%` }}
            span={item.type === "textarea" ? col : 1}
            key={`desc_${index}`}
            label={item.title}>{formatDataType(item, dataSource)}</Descriptions.Item>)}
    </Descriptions>
}