import React, { useState, useCallback, useEffect, ReactNode } from "react"
import { Select, Spin } from "antd"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface SupplySelectProps {
    id?: string,
    onChange?: (value: any) => void
    value?: undefined | { value: string | number, label: string | ReactNode }
    width?: number | string
    [key: string]: any
}

export default function SupplySelect({ onChange, width, value = { value: "", label: "" }, ...props }: SupplySelectProps): JSX.Element {
    const [IValue, setIValue] = useState<any>(value || { value: "", label: "" })
    useEffect(() => {
        setIValue(value)
    }, [JSON.stringify(value)])

    const { loading: fetching, data: userData, run } = useRequest<{ [key: string]: any }>((fuzzyQuery: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier`, { fuzzyQuery })
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
        {...props} >
        {userData?.records?.map((item: any) => <Select.Option key={item.id} value={item.supplierName}>{item.supplierName}</Select.Option>)}
    </Select>
}