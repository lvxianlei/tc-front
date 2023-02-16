import React, { useEffect, useState } from 'react'
import { Input, InputNumber, Select, DatePicker, Modal, Form, Row, Col, Button, TreeSelect } from 'antd'
import CommonTable from "./CommonTable"
import { PlusOutlined } from "@ant-design/icons"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import moment from 'moment'
import { stringify } from 'query-string';
import FetchSelect from './FetchSelect'
import ChooseUser, { ChooseUserData } from './ChooseUser'
export type FormItemTypesType = "text" | "number" | "phone" | "select" | "fetchSelect" | "date" | "textarea" | "popForm" | "rangePicker" | undefined

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
    columns: { title: string, dataIndex: string, type?: string, render?:()=>any, format?:(data:any)=>any }[]
    search?: { title: string, dataIndex: string, type?: string, render?:()=>any, format?:(data:any)=>any }[]
    dependencies?: boolean
    selectType?: "checkbox" | "radio"
    value?: string
    transformData?: (data: any) => any //请求到数据后转换为需要的数据
    getCheckboxProps?: (records: any) => ({ [key: string]: any })
    
    [key: string]: any
}
export interface FetchSelectData {
    type: 'fetchSelect'
    path: string
    title: string
    transformData?: (data: any) => any[]
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

export const PopTableContent: React.FC<{ data: PopTableData, value?: { id: string, records: any[], value: string }, onChange?: (event: any) => void }> = ({ data, value = { id: "", records: [], value: "" }, onChange }) => {
    const initValue = value?.records?.map((item: any) => {
        return typeof item === "string" ? item : typeof data.rowKey === "function" ? item[data.rowKey(item)] : item[data.rowKey || "id"]
    }) || []
    const [select, setSelect] = useState<any[]>(initValue)
    const [selectRows, setSelectRows] = useState<any[]>(value?.records || [])
    const [columns, setColumns] = useState<any[]>(data.columns)
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
    const [form] = Form.useForm()
    const searchs = data.search || data.columns.filter((item: any) => item.search)
    const { loading, data: popTableData, run } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const params = await form.getFieldsValue()
            params.current = pagenation.current
            params.size = pagenation.pageSize
            Object.keys(params).forEach((item: any) => {
                const columnItem = searchs.find((sItem: any) => sItem.dataIndex === item)
                if (columnItem?.type === "date" && params[item]) {
                    const startTimeName = columnItem.dataIndex.split("")
                    const endTimeName = columnItem.dataIndex.split("")
                    startTimeName[0] = startTimeName[0].toLocaleUpperCase()
                    endTimeName[0] = endTimeName[0].toLocaleUpperCase()
                    const formatDate = params[columnItem?.dataIndex].map((item: any) => item.format("YYYY-MM-DD"))
                    params[`start${startTimeName.join("")}`] = formatDate[0] + " 00:00:00"
                    params[`end${startTimeName.join("")}`] = formatDate[1] + " 23:59:59"
                    delete params[columnItem?.dataIndex]
                } 
                if(columnItem?.render&&columnItem?.format){
                    const value:any = params[columnItem?.dataIndex]
                    params[columnItem?.dataIndex] =  value?columnItem?.format(value):''
                }
            })
            const paramsOptions = stringify(params)
            const path = data.path.includes("?") ? `${data.path}&${paramsOptions || ''}` : `${data.path}?${paramsOptions || ''}`
            const result: any = await RequestUtil.get<{ data: any }>(path)
            resolve(data.transformData ? data.transformData(result) : result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [pagenation.current, pagenation.pageSize] })

    const onSelectChange = (record: any, selected: boolean, selectAllRows: any[]) => {
        const currentSelect = [...select]
        const currentSelectRows = [...selectRows]
        const recordItemKey = typeof data.rowKey === "function" ? record[data.rowKey(record)] : record[data.rowKey || "id"]
        if (data.selectType && data.selectType === "checkbox") {
            if (selected) {
                currentSelect.push(recordItemKey)
                currentSelectRows.push(record)
                onChange && onChange(currentSelectRows)
                setSelect(currentSelect)
                setSelectRows(currentSelectRows)
            } else {
                setSelect(currentSelect.filter(item => item !== recordItemKey))
                setSelectRows(currentSelectRows.filter((item: any) => typeof data.rowKey === "function" ? data.rowKey(item) : item[data.rowKey || "id"] !== recordItemKey))
                onChange && onChange(currentSelectRows.filter((item: any) => typeof data.rowKey === "function" ? data.rowKey(item) : item[data.rowKey || "id"] !== recordItemKey))
            }
        } else {
            onChange && onChange(selectAllRows)
            setSelect([recordItemKey])
        }
    }
    const onSelectAll = (selected: any[], _: any, changeRows: any[]) => {
        let currentSelect = [...select]
        let currentSelectRows = [...selectRows]
        const changeSelectRows = selectRows.filter((item: any) => !changeRows.map((mItem: any) => typeof data.rowKey === "function" ? mItem[data.rowKey(mItem)] : mItem[data.rowKey || "id"]).includes(typeof data.rowKey === "function" ? item[data.rowKey(item)] : item[data.rowKey || "id"]))
        if (selected) {
            currentSelect = currentSelect.concat(changeRows.map(item => typeof data.rowKey === "function" ? item[data.rowKey(item)] : item[data.rowKey || "id"]))
            currentSelectRows = currentSelectRows.concat(changeRows)
            onChange && onChange(currentSelectRows)
            setSelect(currentSelect)
            setSelectRows(currentSelectRows)
        } else {
            onChange && onChange(changeSelectRows)
            setSelect(select.filter((item: any) => !changeRows.map((mItem: any) => typeof data.rowKey === "function" ? mItem[data.rowKey(mItem)] : mItem[data.rowKey || "id"]).includes(item)))
            setSelectRows(changeSelectRows)
        }
    }

    useEffect(() => setColumns(data.columns), [JSON.stringify(data.columns)])

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })
    return <>
        {(searchs.length > 0 || data.search) && <Form style={{ marginBottom: 16 }} form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={[8, 8]}>
                {searchs.length > 0 && searchs.map((fItem: any) => <Col style={{ height: 32 }} span={(searchs.length + 1) / 24} key={fItem.dataIndex}><Form.Item
                    name={fItem.dataIndex}
                    label={fItem.title}
                    style={{ height: 32, fontSize: 12 }}
                >
                    {fItem.type === "date" ? <DatePicker.RangePicker style={{ height: 32, fontSize: 12 }} format={fItem.format || "YYYY-MM-DD"} /> : fItem.render?fItem.render():<FormItemType type={fItem.type} data={fItem} />}
                </Form.Item>
                </Col>)}
                <Col style={{ height: 32 }} span={(searchs.length + 1) / 24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                        <Button type="default" onClick={() => form.resetFields()} style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>}
        <CommonTable
            columns={columns}
            rowSelection={{
                checkStrictly: false,
                selectedRowKeys: select,
                type: data.selectType || "radio",
                onSelect: onSelectChange,
                onSelectAll,
                getCheckboxProps: data?.getCheckboxProps
            }}
            rowKey={data.rowKey || ((record: any) => record.id)}
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

    useEffect(() => {
        setValue(props.value || ({ value: (props as any).value, id: "", records: [] }))
        setPopContent(props.value || ({ value: (props as any).value, id: "", records: [] }))
    }, [JSON.stringify(props.value || "")])

    const handleChange = (event: any) => {
        const itemContentId = typeof data.rowKey === "function" ? data.rowKey(event[0]) : event[0]?.[data.rowKey || "id"]
        const newPopContent = { id: itemContentId, value: event[0]?.[data.value || "name" || "id"], records: event }
        const checkboxContent = { id: itemContentId, value: event.map((item: any) => item[data.value || "name" || "id"]).join(","), records: event }
        setPopContent(data.selectType === "checkbox" ? checkboxContent : newPopContent)
    }

    const handleOk = () => {
        const depFalseValue = popContent.id || popContent.value
        const changeValue = data.dependencies ? popContent : depFalseValue;
        depFalseValue && (props as any).onChange(changeValue)
        data.selectType === "checkbox" && (props as any).onChange(changeValue)
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
        setPopContent({ value: (props as any).value, id: "", records: [] })
        setVisible(false)
    }

    const formatValue = () => typeof props.value === "string" ? props.value : value?.value

    return <>
        <Modal width={data.width || 520} title={`选择${data.title}`} destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <PopTableContent value={data.selectType === "checkbox" ? props.value : { id: props.value?.id, records: props.value?.id ? [props.value?.id] : [] }} data={data} onChange={handleChange} />
        </Modal>
        <Input
            {...props}
            disabled={data.disabled}
            style={{ width: "100%", height: "100%", ...props.style }}
            onChange={inputChange}
            allowClear
            onClick={(data.readOnly === undefined || data.readOnly) ? (() => !data.disabled && setVisible(true)) : (() => { })}
            readOnly={data.readOnly === undefined ? true : data.readOnly}
            value={formatValue()}
            suffix={<PlusOutlined onClick={() => !data.disabled && setVisible(true)} />} />
    </>
}
interface SelfSelectProps {
    data: SelectData
}
const SelfSelect: React.FC<SelfSelectProps> = ({ data, ...props }) => {
    const componentProps: any = {}
    Object.keys(data).forEach((item: any) => {
        if (!["title", "dataIndex", "width", "type", "enum", "dependencies", "value", "path", "search", "columns"].includes(item)) {
            componentProps[item] = data[item]
        }
    })
    return <Select
        {...props}
        disabled={data.disabled}
        style={{ width: "100%", minWidth: 80 }}
        {...componentProps}
    >
        {data.enum?.map((item: SelectOption, index: number) => (<Select.Option key={`select_option_${index}_${item.value}`} value={item.value} >{item.label}</Select.Option>))}
    </Select>
}

const FormItemType: React.FC<FormItemTypes> = ({ type = "text", data, render, ...props }) => {
    const formatRangePickerValue: any = (value: any) => {
        return (props.value && props.value instanceof Array && props.value.length === 2) ? props.value.map((valueItem: any) => moment(valueItem, data.format || "YYYY-MM-DD")) : [undefined, undefined]
    }
    const componentProps: any = {}
    Object.keys(data).forEach((item: any) => {
        if (!["title",
            "dataIndex", "width", "type", "enum",
            "dependencies", "value", "path",
            "edit", "search",
            "columns", "transformData"].includes(item)) {
            componentProps[item] = data[item]
        }
    })
    const ItemTypes = {
        string: <Input
            {...props}
            disabled={data.disabled}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        text: <Input {...props}
            disabled={data.disabled}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        phone: <Input {...props}
            disabled={data.disabled}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        number: <InputNumber
            {...props}
            disabled={data.disabled}
            max={data?.max || 999999999999}
            min={data?.min || 0}
            precision={data?.precision}
            step={data?.step || 1}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        select: <SelfSelect {...props} data={data as SelectData} />,
        tree: <TreeSelect
            {...props}
            treeData={data?.treeData as any}
            disabled={data.disabled}
            style={{ width: "100px", ...props.style }}
            {...componentProps}
        />,
        date: <DatePicker
            {...data.picker ? { ...props, picker: data.picker } : { ...props }}
            onChange={(value) => props.onChange(value?.format(data.format || "YYYY-MM-DD HH:mm:ss"))}
            value={props.value ? moment(props.value) : null}
            format={data.format || "YYYY-MM-DD HH:mm:ss"}
            disabled={data.disabled}
            showTime={data?.isShowTime || false}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        rangePicker: <DatePicker.RangePicker format={data.format || "YYYY-MM-DD"}
            {...data.picker ? { ...props, picker: data.picker } : { ...props }}
            onChange={(value) => props.onChange(value?.map((valueItem: any) => valueItem.format(data.format || "YYYY-MM-DD")))}
            value={formatRangePickerValue(props.value)}
            disabled={data.disabled}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        textarea: <Input.TextArea
            {...props} disabled={data.disabled}
            rows={data.rows || 2}
            maxLength={400}
            showCount
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        popForm: <Input
            {...props}
            disabled={data.disabled}
            style={{ width: data.width || "100%", height: "100%", ...props.style }}
            {...componentProps}
        />,
        popTable: <PopTable {...props} data={data as PopTableData} />,
        fetchSelect: <FetchSelect {...props}
            value={props.value}
            data={data as unknown} {...componentProps} />,
        chooseUser: <ChooseUser {...props} data={data as ChooseUserData} />
    }
    return <>{render ? render(data, props) : ItemTypes[type]}</>
}

export default FormItemType