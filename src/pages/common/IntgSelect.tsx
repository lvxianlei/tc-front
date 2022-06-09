import React, { useState, useCallback, useEffect } from "react"
import { TreeSelect, Select, Spin } from "antd"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface IntgSelectProps {
    id?: string,
    onChange?: (value: any) => void
    value?: undefined | { first: string, second: string }
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

export default function IntgSelect({ onChange, width, value = { first: "", second: "" }, ...props }: IntgSelectProps): JSX.Element {
    const [deptId, setDeptId] = useState<string>(value?.first || "")
    const [userId, setUserId] = useState<string>(value?.second || "")

    useEffect(() => {
        setDeptId(value.first)
        setUserId(value.second)
        value.first && getUser(value.first)
    }, [value.first])

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee?dept=${id}&size=1000`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleChange = useCallback((value: string) => {
        console.log(value, '------')
    }, [setUserId, deptId, onChange])

    return <Select
        showSearch
        style={{ width }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleChange}
        {...props} />
}