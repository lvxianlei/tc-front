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

export const PopTableContent: React.FC<{ data: PopTableData, value?: string, onChange?: (event: any) => void }> = ({ data, value = "", onChange }) => {
    const initValue = data.selectType === "checkbox" && value ? value.split(",") : []
    const [select, setSelect] = useState<any[]>(initValue)
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
        {searchs.length > 0 && <Form form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={4}>
                {searchs.map((fItem: any) => <Col style={{ height: 32 }} span={(searchs.length + 1) / 24} key={fItem.dataIndex}><Form.Item
                    name={fItem.dataIndex}
                    label={fItem.title}
                    style={{ height: 32, fontSize: 12 }}
                >
                    <FormItemType type={fItem.type} data={fItem} />
                </Form.Item>
                </Col>)}
                <Col style={{ height: 32 }} span={(searchs.length + 1) / 24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="small" style={{ marginLeft: 12 }}>搜索</Button>
                        <Button type="default" size="small" onClick={() => form.resetFields()} style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>}
        <CommonTable
            columns={data.columns}
            rowSelection={{
                selectedRowKeys: select,
                type: data.selectType || "radio",
                onChange: onSelectChange,
            }}
            rowKey={(record: any) => record.id}
            size="small"
            loading={loading}
            dataSource={popTableData?.records || popTableData || []}
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
    const [popContent, setPopContent] = useState<{ id: string, value: string, records: any }>({ value: (props as any).value, id: "", records: [] })
    const [value, setValue] = useState<{ id: string, value: string, records: any }>({ value: (props as any).value, id: "", records: [] })

    useEffect(() => setValue(props.value || ({ value: (props as any).value, id: "", records: [] })), [JSON.stringify(props.value || "")])
    const handleChange = (event: any) => {
        const newPopContent = { id: event[0]?.id, value: event[0]?.[data.value || "name" || "id"], records: event }
        const checkboxContent = { id: event[0]?.id, value: event.map((item: any) => item[data.value || "name" || "id"]).join(","), records: event }
        setPopContent(data.selectType === "checkbox" ? checkboxContent : newPopContent)
    }

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

    const formatValue = () => {
        let initValue = typeof props.value === "string" ? props.value : value?.value
        return initValue
    }

    return <>
        <Modal width={data.width || 520} title={`选择${data.title}`} destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <PopTableContent value={formatValue()} data={data} onChange={handleChange} />
        </Modal>
        <Input
            {...props}
            disabled={data.disabled}
            style={{ width: "100%", height: "100%", ...props.style }}
            onChange={inputChange}
            readOnly={data.readOnly === undefined ? true : data.readOnly}
            value={formatValue()}
            addonAfter={<PlusOutlined onClick={() => !data.disabled && setVisible(true)} />} />
    </>
}
interface SelfSelectProps {
    data: SelectData
}
const SelfSelect: React.FC<SelfSelectProps> = ({ data, ...props }) => {
    return <Select {...props} disabled={data.disabled} style={{ width: "100%", minWidth: 100 }}>
        {data.enum?.map((item: SelectOption, index: number) => (<Select.Option key={`select_option_${index}_${item.value}`} value={item.value} >{item.label}</Select.Option>))}
    </Select>
}

const FormItemType: React.FC<FormItemTypes> = ({ type = "text", data, ...props }) => {
    const ItemTypes = {
        string: <Input {...props} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        text: <Input {...props} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        number: <InputNumber {...props} disabled={data.disabled} max={data?.max || 999999999999} min={data?.min || 0} step={data?.step || 1} style={{ width: "100%", height: "100%", ...props.style }} />,
        select: <SelfSelect {...props} data={data as SelectData} />,
        date: <DatePicker
            {...data.picker ? { ...props, picker: data.picker } : { ...props }}
            onChange={(value) => props.onChange(value?.format(data.format || "YYYY-MM-DD HH:mm:ss"))}
            value={props.value ? moment(props.value) : null}
            format={data.format || "YYYY-MM-DD HH:mm:ss"} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        textarea: <Input.TextArea {...props} disabled={data.disabled} rows={data.rows || 2} maxLength={400} showCount style={{ width: "100%", height: "100%", ...props.style }} />,
        popForm: <Input {...props} disabled={data.disabled} style={{ width: "100%", height: "100%", ...props.style }} />,
        popTable: <PopTable {...props} data={data as PopTableData} />
    }
    return <>{ItemTypes[type]}</>
}

export default FormItemType