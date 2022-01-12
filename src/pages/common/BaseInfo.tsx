import React, { useEffect } from "react"
import { Descriptions, Form, FormInstance, Row, Col } from "antd"
import { FormItemType } from '../common'
import { FormItemTypesType } from "./FormItemType"
import moment from "moment"
import './BaseInfo.less'
export interface BaseInfoItemProps {
    name: string
    label: string
    value: string | number | null | undefined
    type?: 'text' | 'number' | 'date' | 'select' | 'phone'
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
    classStyle?: string
}

function formatDataType(dataItem: any, dataSource: any): string {
    const value = dataSource[dataItem.dataIndex]
    const types: any = {
        number: (value && value !== -1) ? value : 0,
        select: ((value || value === 0 || value === false) && dataItem.enum) ? (dataItem.enum.find((item: any) => item.value === value)?.label || "-") : "-",
        date: value ? moment(value).format(dataItem.format || "YYYY-MM-DD HH:mm:ss") : "-",
        string: (value && !["-1", -1, "0", 0].includes(value)) ? value : "-",
        text: (value && !["-1", -1, "0", 0].includes(value)) ? value : "-",
        phone: (value && !["-1", -1, "0", 0].includes(value)) ? value : "-",
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
                number: (value && ![-1, "-1"].includes(value)) ? value : 0,
                select: ([-1, "-1"].includes(value)) ? null : value,
                date: value ? moment(value).format(dataItem.format || "YYYY-MM-DD HH:mm:ss") : undefined,
                string: (value && !["-1", -1, "0", 0].includes(value)) ? value : "",
                phone: (value && !["-1", -1, "0", 0].includes(value)) ? value : "",
                textarea: value || "",
                popTable: value || {
                    value: "",
                    id: ""
                }
            }
            formatedData[dataSourceKey] = types[dataItem.type || "string"]
        }
    })
    return formatedData
}

const popTableTransform = (value: any) => {
    if ((value && value.value)) {
        return value.value
    }
    return value
}
const generateRules = (type: string, columnItems: any) => {
    let rules = columnItems.rules || []
    if (columnItems.required) {
        const inputType = ["date", "select", "popTable"].includes(columnItems.type) ? "选择" : "输入"
        rules = [
            {
                "required": true,
                "message": `请${inputType}${columnItems.title}...`
            },
            ...rules
        ]
    }
    if (type === "popTable") {
        rules = rules.map((item: any) => {
            if (item.required) {
                return ({ ...item, transform: popTableTransform })
            }
            return item
        })
    }
    if (type === "phone") {
        rules = [
            ...rules,
            {
                pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                message: `${columnItems.title}不合法...`
            }]
    }
    return rules
}

const generatePlaceholder = (columnItems: any): string => {
    let placeholder = columnItems.placeholder || ""
    if (!columnItems.disabled) {
        const inputType = ["date", "select", "popTable"].includes(columnItems.type) ? "选择" : "输入"
        placeholder = `请${inputType}${columnItems.title}`
    }
    return placeholder
}
export default function BaseInfo({ dataSource, columns, form, edit, col = 4, onChange = () => { }, classStyle = "" }: BaseInfoProps): JSX.Element {

    useEffect(() => {
        form && form.setFieldsValue(formatData(columns, dataSource))
    }, [JSON.stringify(dataSource), form])

    if (edit) {
        return <Form
            style={{ width: "100%" }}
            onValuesChange={(changedFields, allFields) => onChange(changedFields, allFields, dataSource)}
            form={form}
            initialValues={formatData(columns, dataSource)}
            labelAlign="right"
            layout="inline"
            labelCol={{ style: { width: '100px', whiteSpace: "break-spaces" } }}
            className={`bottom ${classStyle}`}
        >
            <Row wrap={true} style={{ width: "100%" }}>
                {columns.map((item: any, index: number) => <Col
                    key={`form_item_${index}`}
                    {...{
                        xs: {
                            span: item.type === "textarea" ? 24 : 24
                        },
                        sm: {
                            span: item.type === "textarea" ? 24 : 24
                        },
                        md: {
                            span: item.type === "textarea" ? 24 : 12
                        },
                        lg: {
                            span: item.type === "textarea" ? 24 : (24 / col)
                        },
                        xl: {
                            span: item.type === "textarea" ? 24 : (24 / col)
                        },
                        xxl: {
                            span: item.type === "textarea" ? 24 : (24 / col)
                        }
                    }}
                >
                    <Col span={24} >
                        <div style={{ minHeight: 56, marginBottom: item.type === "textarea" ? 20 : 0 }}>
                            <Form.Item
                                className="baseInfoForm"
                                name={item.dataIndex}
                                label={item.title}
                                validateTrigger={item.validateTrigger}
                                rules={generateRules(item.type, item)}
                            >
                                <FormItemType type={item.type} data={item} placeholder={generatePlaceholder(item)} render={item.render} />
                            </Form.Item>
                        </div>
                    </Col>
                </Col>
                )}
            </Row>
        </Form >
    }
    return <Descriptions bordered column={col} size="small" className={`bottom ${classStyle}`}>
        {columns.map((item: any, index: number) => <Descriptions.Item
            contentStyle={{ ...item.contentStyle, width: `${100 / (col * 2)}%` }}
            labelStyle={{ ...item.labelStyle, width: `${100 / (col * 4)}%` }}
            span={item.type === "textarea" ? col : 1}
            key={`desc_${index}`}
            label={item.title}>{item.render ?
                item.render(dataSource) : formatDataType(item, dataSource)}
        </Descriptions.Item>)}
    </Descriptions>
}