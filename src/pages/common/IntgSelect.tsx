import React, { useState, useCallback, useEffect } from "react"
import { TreeSelect, Select, Spin } from "antd"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface IntgSelectProps {
    id?: string,
    onChange?: (value: any) => void
    value?: undefined | string
    width?: number | string
}

export const generateTreeNode: (data: any) => any[] = (data: any[]) => {
    return data.map((item: any) => ({
        title: item.name,
        value: item.id,
        disabled: item.type === 2 || item.parentId === '0',
        children: item.children ? generateTreeNode(item.children) : []
    }))
}

export default function IntgSelect({ onChange, width, value = "", ...props }: IntgSelectProps): JSX.Element {
    const [IValue, setIValue] = useState<string>(value || "")

    useEffect(() => {
        setIValue(value)
    }, [value])

    const { loading: fetching, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee`, { fuzzyName: IValue })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [IValue] })

    const handleSearch = useCallback((value: string) => {
        setIValue(value)
    }, [setIValue, onChange])

    return <Select
        showSearch
        value={IValue}
        style={{ width }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onSearch={handleSearch}
        {...props} >
        {userData?.records?.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)}
    </Select>
}