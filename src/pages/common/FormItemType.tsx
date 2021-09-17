import React, { useState } from 'react'
import { Input, InputNumber, Select, DatePicker, Modal, Form, Row, Col } from 'antd'
import CommonTable from "./CommonTable"
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

const PopTableContent: React.FC<{ data: PopTableData }> = ({ data }) => {
    const [select, setSelect] = useState<any[]>([])
    const searchs = data.columns.filter((item: any) => item.search)
    const { loading, data: popTableData, run } = useRequest<any>((params: {}) => new Promise(async (resolve, reject) => {
        resolve(await RequestUtil.get<{ data: any }>(data.path, params))
        console.log(popTableData)
    }))
    const onSelectChange = (selectedRowKeys: any[]) => setSelect(selectedRowKeys)
    return <>
        <Form>
            <Row gutter={6}>
                {searchs.map((fItem: any) => <Col span={searchs.length / 24} key={fItem.dataIndex}><Form.Item
                    name={fItem.dataIndex}
                    label={fItem.title}>
                    <FormItemType data={fItem} />
                </Form.Item></Col>)}
            </Row>
        </Form>
        <CommonTable
            columns={data.columns}
            rowSelection={{
                select,
                onChange: onSelectChange,
            }}
            dataSource={popTableData?.records}
            pagination={{ size: popTableData?.size, current: popTableData?.current, total: popTableData?.total }} />
    </>
}

export const PopTable: React.FC<PopTableProps> = ({ data, ...props }) => {
    const [visible, setVisible] = useState<boolean>(false)
    return <>
        <Modal width={data.width || 520} title={`选择${data.title}`} destroyOnClose visible={visible} onCancel={() => setVisible(false)}>
            <PopTableContent data={data} />
        </Modal>
        <Input {...props} addonAfter={<PlusOutlined onClick={() => setVisible(true)} />} />
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
        text: <Input {...props} disabled={data.disabled} />,
        number: <InputNumber {...props} />,
        select: <SelfSelect {...props} data={data as SelectData} />,
        date: <DatePicker
            {...data.picker ? { ...props, picker: data.picker } : { ...props }}
            value={props.value ? moment(props.value, data.format || "YYYY-MM-DD HH:mm:ss") : null}
            format={data.format || "YYYY-MM-DD HH:mm:ss"} />,
        textarea: <Input.TextArea {...props} />,
        popForm: <Input {...props} />,
        popTable: <PopTable {...props} data={data as PopTableData} />
    }
    return <>{ItemTypes[type]}</>
}

export default FormItemType