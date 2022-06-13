import React, { useEffect, useState } from 'react'
import { Input, Select, Modal, Form, Row, Col, Button } from 'antd'
import { CommonTable } from "../../common"
import { PlusOutlined } from "@ant-design/icons"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { stringify } from 'query-string';
import { IMaterialType } from '../../system-mngt/material/IMaterial'
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
    // const initValue = value?.records?.map((item: any) => item.id)
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
    const searchs = data.columns.filter((item: any) => item.search);
    const [materialType, setMaterialType] = useState<IMaterialType[]>([]);
    const [materialList, setMaterialList] = useState<IMaterialType[]>([]);
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
            const materialTypeList: IMaterialType[] = await RequestUtil.get<IMaterialType[]>(`/tower-system/materialCategory`);
            setMaterialType(materialTypeList);
            resolve(await RequestUtil.get<{ data: any }>(path))
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [pagenation.current] })

    // const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
    //     onChange && onChange(selectRows)
    //     setSelect(selectedRowKeys)
    // }

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
                setSelectRows(currentSelectRows.filter((item: any) => item.id !== recordItemKey))
                onChange && onChange(currentSelectRows.filter((item: any) => item.id !== recordItemKey))
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

    useEffect(() => {
        setColumns(data.columns)
    }, [JSON.stringify(data.columns)])

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })

    return <>
        {searchs.length > 0 && <Form form={form} onFinish={async () => {
            setPagenation({ ...pagenation, current: 1, pageSize: 10 })
            await run()
        }}>
            <Row gutter={[8, 8]}>
                <Col>
                    <Form.Item name="materialType" label="类别" initialValue="">
                        <Select placeholder="请选择" style={{ width: "150px" }} onChange={(e) => {
                            const list = materialType.filter((res: IMaterialType) => res.id === e);
                            setMaterialList(list[0].children || []);
                        }}>
                            <Select.Option value="" key="6">全部</Select.Option>
                            {materialType && materialType.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="materialCategory" label="类型" initialValue="">
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value="" key="6">全部</Select.Option>
                            {materialList && materialList.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="fuzzyQuery" label="查询" initialValue="">
                        <Input placeholder="品名/规格/物料编号" />
                    </Form.Item>
                </Col>
                <Col style={{ height: 32 }} span={(searchs.length + 1) / 24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>搜索</Button>
                        <Button type="default" onClick={() => {
                            form.resetFields();
                            setMaterialList([]);
                        }} style={{ marginLeft: 12 }}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>}
        <CommonTable
            style={{ margin: 0, padding: 0 }}
            columns={columns}
            rowSelection={{
                selectedRowKeys: select,
                type: data.selectType || "radio",
                // onChange: onSelectChange,
                onSelect: onSelectChange,
                onSelectAll,
                getCheckboxProps: data?.getCheckboxProps
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
        const itemContentId = typeof data.rowKey === "function" ? data.rowKey(event[0]) : event[0]?.[data.rowKey || "id"]
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
        setPopContent({ value: (props as any).value, id: "", records: [] })
        setVisible(false)
    }

    const formatValue = () => {
        let initValue = typeof props.value === "string" ? props.value : value?.value
        return initValue
    }
    console.log(props, "props")
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