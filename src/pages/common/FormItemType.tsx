import React, { useState } from 'react'
import { Input, InputNumber, Select, DatePicker, Modal, Table, Button } from 'antd'
import { PlusOutlined } from "@ant-design/icons"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import moment from 'moment'
export type FormItemTypesType = "text" | "number" | "select" | "date" | "textarea" | "popForm" | undefined

interface SelectOption {
    value: string | number
    label: string
    [key: string]: any
}

export interface SelectData {
    type: "select"
    enum?: SelectOption[]
    path?: string
    [key: string]: any
}

export interface InputData {
    type?: "text"
    [key: string]: any
}

export interface PopTableData {
    type: "PopTable"
    title: string
    path: string
    columns: { title: string, dataIndex: string, type?: string }[]
    search?: boolean
    [key: string]: any
}

interface FormItemTypes {
    type?: FormItemTypesType
    readonly?: boolean
    data: SelectData | InputData | PopTableData
    [key: string]: any
}

interface PopTableProps {
    data: PopTableData
}

const PopTable: React.FC<PopTableProps> = ({ data, ...props }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const { loading, data: popTableData, run } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        resolve(await RequestUtil.get<{ data: any }>(data.path))
    }))
    return <>
        <Modal title={`选择${data.title}`} destroyOnClose visible={visible} onCancel={() => setVisible(false)}>
            <Table size="small" loading={loading} columns={data.columns} dataSource={popTableData?.records} />
        </Modal>
        <Input {...props} readOnly addonAfter={<PlusOutlined onClick={() => setVisible(true)} />} />
    </>
}
interface SelfSelectProps {
    data: SelectData
}
const SelfSelect: React.FC<SelfSelectProps> = ({ data, ...props }) => {
    return <Select {...props}>
        {data.enum?.map((item: SelectOption, index: number) => (<Select.Option key={`select_option_${index}_${item.value}`} value={item.value} >{item.label}</Select.Option>))}
    </Select>
}

const FormItemType: React.FC<FormItemTypes> = ({ type = "text", data, ...props }) => {
    const ItemTypes = {
        text: <Input {...props} />,
        number: <InputNumber {...props} />,
        select: <SelfSelect {...props} data={data as SelectData} />,
        date: <DatePicker {...props} value={props.value ? moment(props.value, "YYYY-MM-DD HH:mm:ss") : null} format="YYYY-MM-DD HH:mm:ss" />,
        textarea: <Input.TextArea {...props} />,
        popForm: <Input {...props} />,
        popTable: <PopTable {...props} data={data as PopTableData} />
    }
    return <>{ItemTypes[type]}</>
}

export default FormItemType