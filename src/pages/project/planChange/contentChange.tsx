import React, { useState, useEffect } from "react"
import { Button, Col, Form, Row } from "antd"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { FormItemType } from "../../common";
import { edit } from "./data.json"
import { materialStandardOptions } from "../../../configuration/DictionaryOptions"
const materialStandardEnum = materialStandardOptions?.map((item: any) => ({
    label: item.name,
    value: item.id
}))

interface ContentChangeProps {
    form?: any
    dataSource: any
    onChange: (fields: any, allFields: any) => void
}

export default function ContentChange({ form, dataSource, onChange }: ContentChangeProps) {
    const [contentColumns, setContentColumns] = useState<any[]>(dataSource?.map(() => edit.content))
    const baseRowData: { [key: string]: string | number | null } = {}
    edit.content.forEach(item => baseRowData[item.dataIndex] = null)

    const onValuesChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const result = allFields.submit[fields.submit.length - 1]
            if (result.field?.value === "materialStandardName") {
                let newContentColumns = [...contentColumns]
                newContentColumns[fields.submit.length - 1] = newContentColumns[fields.submit.length - 1]
                    .map((item: any) => {
                        if (item.dataIndex === "editAfter") {
                            return ({
                                ...item,
                                type: "select",
                                enum: materialStandardEnum
                            })
                        }
                        return item
                    })
                setContentColumns(newContentColumns)
            }
        }
        onChange && onChange(fields, allFields)
    }

    useEffect(() => {
        setContentColumns(dataSource?.map((item: any) => {
            if (item.field?.value === "materialStandardName") {
                return edit.content.map((contentItem: any) => {
                    if (contentItem.dataIndex === "editAfter") {
                        return ({
                            ...contentItem,
                            type: "select",
                            enum: materialStandardEnum
                        })
                    }
                    return contentItem
                })
            }
            return edit.content
        }))
        form && form.setFieldsValue({ submit: dataSource })
    }, [JSON.stringify(dataSource)])

    return <Form
        form={form}
        name="dynamic_form_nest_item"
        onValuesChange={onValuesChange}
        autoComplete="off">
        <Form.List name="submit">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Row key={key} gutter={[6, 6]} style={{ justifyContent: "space-between" }}>
                            {contentColumns[key]?.map((coItem: any, coIndex: any) => (<Col key={coIndex} span={5}>
                                <Form.Item
                                    {...restField}
                                    name={[name, coItem.dataIndex]}
                                    label={coItem.title}
                                    style={{ margin: 0, padding: "6px 0" }}
                                    fieldKey={[fieldKey, coItem.dataIndex]}
                                    rules={coItem.rules?.map((item: any) => {
                                        if (item.validator) {
                                            return ({
                                                ...item,
                                                validator: (rules: any, value: any) => item.validator(rules, value, fieldKey)
                                            })
                                        }
                                        return item
                                    }) || []}
                                >
                                    <FormItemType type={coItem.type} data={coItem} render={coItem.render} />
                                </Form.Item>
                            </Col>)
                            )}
                            <Col
                                span={2}
                                style={{
                                    display: "inline-flex",
                                    justifyContent: "start",
                                    alignItems: "center"
                                }}><MinusCircleOutlined onClick={() => remove(name)} /></Col>
                        </Row>
                    ))}
                    <Form.Item>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => {
                                add(baseRowData)
                                setContentColumns([...contentColumns, edit.content])
                            }}
                            block
                            icon={<PlusOutlined />}>
                            新增一行
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List></Form>
}