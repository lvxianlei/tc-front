import React, { useEffect, useState } from 'react'
import { Input, InputNumber, Select, DatePicker, Modal, Form, Row, Col, Button } from 'antd'
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
    dependencies?: boolean
    selectType?: "checkbox" | "radio"
    value?: string
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
    [key: string]: any
}

interface PagenationProps {
    current: number
    pageSize: number
}

const PopTableContent: React.FC<{ data: PopTableData, onChange?: (event: any) => void }> = ({ data, onChange }) => {
    const [select, setSelect] = useState<any[]>([])
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
    const [form] = Form.useForm()
    const searchs = data.columns.filter((item: any) => item.search)
    const { loading, data: popTableData, run } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const params = await form.getFieldsValue()
            params.current = pagenation.current
            params.pageSize = pagenation.pageSize
            const paramsOptions = Object.keys(params).map((item: string) => `${item}=${params[item] || ""}`).join("&")
            const path = data.path.includes("?") ? `${data.path}&${paramsOptions || ''}` : `${data.path}?${paramsOptions || ''}`
            resolve(await RequestUtil.get<{ data: any }>(path))
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [pagenation.current] })

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        onChange && onChange(selectRows)
        setSelect(selectedRowKeys)
    }

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })

    return <>
        <Form form={form} onFinish={async () => await run()}>
            <Row gutter={2} style={{ height: 32 }}>
                {searchs.map((fItem: any) => <Col span={searchs.length / 24} key={fItem.dataIndex}><Form.Item
                    name={fItem.dataIndex}
                    label={fItem.title}
                    style={{ height: 32, fontSize: 12 }}
                >
                    <FormItemType data={fItem} />
                </Form.Item>
                </Col>)}
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="small" style={{ marginLeft: 12 }}>搜索</Button>
                    <Button type="default" size="small" onClick={() => form.resetFields()} style={{ marginLeft: 12 }}>重置</Button>
                </Form.Item>
            </Row>
        </Form>
        <CommonTable
            columns={data.columns}
            rowSelection={{
                selectedRowKeys: select,
                type: data.selectType || "radio",
                onChange: onSelectChange,
            }}
            size="small"
            loading={loading}
            dataSource={popTableData?.records}
            pagination={{
                size: "small",
                pageSize: pagenation.pageSize,
                onChange: paginationChange,
                current: pagenation.current,
                total: popTableData?.total
            }} />
    </>
}

export const PopTable: React.FC<PopTableProps> = ({ data, ...props }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [popContent, setPopContent] = useState<{ id: string, value: string, records: any }>({ value: (props as any).value, id: "", records: {} })
    const [value, setValue] = useState<{ id: string, value: string, records: any }>({ value: (props as any).value, id: "", records: {} })

    const handleChange = (event: any) => setPopContent({ id: event[0].id, value: event[0][data.value || "name" || "id"], records: event })

    const handleOk = () => {
        const depFalseValue = popContent.id || popContent.value
        const changeValue = data.dependencies ? popContent : depFalseValue;
        (props as any).onChange(changeValue)
        setValue(popContent)
        setVisible(false)
    }

    const inputChange = (event: any) => {
        const inputValue = event.target.value
        const changeValue = { ...value, value: inputValue };
        (props as any).onChange({ ...changeValue })
        setValue({ ...value, ...changeValue })
        setPopContent({ ...value, ...changeValue })
    }

    const handleCancel = () => {
        setVisible(false)
    }

    return <>
        <Modal width={data.width || 520} title={`选择${data.title}`} destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <PopTableContent data={data} onChange={handleChange} />
        </Modal>
        <Input
            {...props}
            disabled={data.disabled}
            style={{ width: "100%", height: "100%", ...props.style }}
            onChange={inputChange}
            readOnly={data.readOnly === undefined ? true : data.readOnly}
            value={typeof props.value === "string" ? props.value : value.value}
            addonAfter={<PlusOutlined onClick={() => !data.disabled && setVisible(true)} />} />
    </>
}
interface SelfSelectProps {
    data: SelectData
}
const SelfSelect: React.FC<SelfSelectProps> = ({ data, ...props }) => {
    return <Select {...props} disabled={data.disabled} style={{ width: "100%" }}>
        {data.enum?.map((item: SelectOption, index: number) => (<Select.Option key={`select_option_${index}_${item.value}`} value={item.value} >{item.label}</Select.Option>))}
    </Select>
}

const FormItemType: React.FC<FormItemTypes> = ({ type = "text", data, ...props }) => {
    const ItemTypes = {
        text: <Input {...props} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        number: <InputNumber {...props} disabled={data.disabled} max={data?.max} min={data?.min} style={{ width: "100%", height: "100%", ...props.style }} />,
        select: <SelfSelect {...props} data={data as SelectData} />,
        date: <DatePicker
            {...data.picker ? { ...props, picker: data.picker } : { ...props }}
            onChange={(value) => props.onChange(value?.format(data.format || "YYYY-MM-DD HH:mm:ss"))}
            value={props.value ? moment(props.value) : null}
            format={data.format || "YYYY-MM-DD HH:mm:ss"} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        textarea: <Input.TextArea {...props} disabled={data.disabled} rows={1} maxLength={300} showCount style={{ width: "100%", height: "100%", ...props.style }} />,
        popForm: <Input {...props} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        popTable: <PopTable {...props} data={data as PopTableData} />
    }
    return <>{ItemTypes[type]}</>
}

export default FormItemType