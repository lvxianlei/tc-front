import React, { useState, useCallback, useEffect, ReactNode } from "react"
import { Select, Spin } from "antd"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface IntgSelectProps {
    id?: string,
    onChange?: (value: any) => void
    value?: undefined | { value: string | number, label: string | ReactNode }
    width?: number | string
    [key: string]: any
}

export const generateTreeNode: (data: any) => any[] = (data: any[]) => {
    return data.map((item: any) => ({
        title: item.name,
        value: item.id,
        disabled: item.type === 2 || item.parentId === '0',
        children: item.children ? generateTreeNode(item.children) : []
    }))
}

export default function IntgSelect({ onChange, width, value = { value: "", label: "" }, ...props }: IntgSelectProps): JSX.Element {
    const [IValue, setIValue] = useState<any>(value || { value: "", label: "" })
    useEffect(() => {
        setIValue(value)
    }, [JSON.stringify(value)])

    const { loading: fetching, data: userData, run } = useRequest<{ [key: string]: any }>((fuzzyName: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee`, { fuzzyName })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSearch = useCallback((value: string) => run(value), [run])

    const handleChange = useCallback((value: string) => {
        setIValue(value)
        onChange && onChange(value)
    }, [setIValue, onChange])

    return <Select
        showSearch
        style={{ width }}
        defaultActiveFirstOption={false}
        showArrow={false}
        labelInValue={true}
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onSearch={handleSearch}
        onChange={handleChange}
        placeholder={props.placeholder || "请输入"}
        value={IValue}
        {...props} >
        {userData?.records?.map((item: any) => <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>)}
    </Select>
}