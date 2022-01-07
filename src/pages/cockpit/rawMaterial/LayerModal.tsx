import React, { useEffect, useState } from 'react'
import { Input, InputNumber, Select, DatePicker, Modal, Form, Row, Col, Button } from 'antd'
import {CommonTable, FormItemType} from "../../common"
import { PlusOutlined } from "@ant-design/icons"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import moment from 'moment'
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
    const initValue = value?.records?.map((item: any) => item.id)
    const [select, setSelect] = useState<any[]>(initValue)
    const [columns, setColumns] = useState<any[]>(data.columns)
    const [ type, setType ] = useState<any[]>([]); // 类型
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
    const [form] = Form.useForm()
    const searchs = data.columns.filter((item: any) => item.search)
    // 获取类型/类别
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: [] = await RequestUtil.get(`/tower-system/materialCategory/tree`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {  })
    const { loading, data: popTableData, run } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const params = await form.getFieldsValue()
            params.current = pagenation.current
            params.pageSize = pagenation.pageSize
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
    }), { refreshDeps: [pagenation.current] })

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        onChange && onChange(selectRows)
        setSelect(selectedRowKeys)
    }

    useEffect(() => {
        setColumns(data.columns)
    }, [JSON.stringify(data.columns)])

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })

    return <>
        {searchs.length > 0 && <Form form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={[8, 8]} style={{marginBottom: 16}}>
                <Col style={{ height: 32 }} span={(searchs.length + 1) / 24}>
                    <div style={{display: "flex", flexWrap: "nowrap"}}>
                        <Form.Item name="materialType" label="类别">
                            <Select style={{ width: 120 }} placeholder="请选择类别" onChange={(val) => {
                                const result = userData?.filter((item: any) => item.id === val)[0].children || [];
                                setType(result);
                                form.setFieldsValue({
                                    materialCategory: undefined
                                })
                            }}>
                                {
                                    userData && userData.length > 0 && userData.map((item: any, index: number) => {
                                        return <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        &nbsp;&nbsp;
                        <Form.Item name="materialCategory" label="类型">
                            <Select style={{ width: 120 }} placeholder="请选择类型">
                                {
                                    type && type.length > 0 && type.map((item: any, index: number) => {
                                        return <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        &nbsp;&nbsp;
                        <Form.Item name="fuzzyQuery" label="查询">
                            <Input placeholder="请输入编号/品名/规格" />
                        </Form.Item>
                    </div>
                </Col>
                <Col style={{ height: 32 }} span={(searchs.length + 1) / 24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="small" style={{ marginLeft: 12 }}>查询</Button>
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