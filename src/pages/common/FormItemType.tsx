import React from 'react'
import { Input, InputNumber, Select, DatePicker } from 'antd'

export type FormItemTypesType = "text" | "number" | "select" | "date" | "textarea" | "popForm" | undefined

interface FormItemTypes {
    type?: FormItemTypesType
    [key: string]: any
}
const FormItemType: React.FC<FormItemTypes> = ({ type = "text", ...props }) => {
    const ItemTypes = {
        text: <Input value={props.value} />,
        number: <InputNumber value={props.value} />,
        select: <Select value={props.value} />,
        date: <DatePicker value={props.value} />,
        textarea: <Input.TextArea value={props.value} />,
        popForm: <Input value={props.value} />
    }
    return <>{ItemTypes[type]}</>
}

export default FormItemType