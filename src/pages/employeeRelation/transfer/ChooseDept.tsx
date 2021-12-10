import React, { useEffect, useState } from 'react'
import { Input, DatePicker, Modal, Form, Row, Col, Button } from 'antd'
import { CommonTable, FormItemType } from "../../common"
import { PlusOutlined } from "@ant-design/icons"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { stringify } from 'query-string';
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

interface PopTableProps {
    data: PopTableData
    [key: string]: any
}

interface PagenationProps {
    current: number
    pageSize: number
}

export const PopTableContent: React.FC<{ data: PopTableData, value?: { id: string, records: any[], value: string }, onChange?: (event: any) => void }> = ({ data, value = { id: "", records: [], value: "" }, onChange }) => {
    const initValue = value?.records?.map((item: any) => item.id)
    const [select, setSelect] = useState<any[]>(initValue)
    const [columns, setColumns] = useState<any[]>(data.columns)

    const [form] = Form.useForm()
    const searchs = data.columns.filter((item: any) => item.search)
    const { loading, data: popTableData, run } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const params = await form.getFieldsValue()
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
            })
            const paramsOptions = stringify(params)
            const path = data.path.includes("?") ? `${data.path}&${paramsOptions || ''}` : `${data.path}?${paramsOptions || ''}`
            resolve(await RequestUtil.get<{ data: any }>(path))
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [] })

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        onChange && onChange(selectRows)
        setSelect(selectedRowKeys)
    }

    useEffect(() => {
        setColumns(data.columns)
    }, [JSON.stringify(data.columns)])



    return <>
        {searchs.length > 0 && <Form form={form} onFinish={async () => {
            await run()
        }}>
            <Row gutter={[8, 8]}>
                {searchs.map((fItem: any) => <Col style={{ height: 32 }} span={(searchs.length + 1) / 24} key={fItem.dataIndex}><Form.Item
                    name={fItem.dataIndex}
                    label={fItem.title}
                    style={{ height: 32, fontSize: 12 }}
                >
                    {fItem.type === "date" ? <DatePicker.RangePicker style={{ height: 32, fontSize: 12 }} format={fItem.format || "YYYY-MM-DD"} /> : <FormItemType type={fItem.type} data={fItem} />}
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
            columns={columns}
            rowSelection={{
                selectedRowKeys: select,
                type: data.selectType || "radio",
                onChange: onSelectChange,
                getCheckboxProps: (record: any) => ({
                    disabled: record.type === 2
                })
            }}
            rowKey={(record: any) => record.id}
            size="small"
            loading={loading}
            dataSource={popTableData?.records || popTableData || []}
            pagination={false} />
    </>
}

const PopTable: React.FC<PopTableProps> = ({ data, ...props }) => {
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
            <PopTableContent value={props.value} data={data} onChange={handleChange} />
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

export default PopTable