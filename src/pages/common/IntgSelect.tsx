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

export default function IntgSelect({ onChange, width, value = { first: "", second: "" } }: IntgSelectProps): JSX.Element {
    const [deptId, setDeptId] = useState<string>(value?.first || "")
    const [userId, setUserId] = useState<string>(value?.second || "")

    useEffect(() => {
        setDeptId(value.first)
        setUserId(value.second)
        value.first && getUser(value.first)
    }, [value.first])

    const { loading, data: deptData } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-system/department`)
            resole(generateTreeNode(result))
        } catch (error) {
            reject(error)
        }
    }))

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee?dept=${id}&size=1000`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleFirstChange = useCallback((value: string) => {
        setDeptId(value)
        setUserId("")
        onChange && onChange({ first: value, second: "" })
    }, [setDeptId, getUser, setUserId])

    const handleChange = useCallback((value: string) => {
        setUserId(value)
        onChange && onChange({ first: deptId, second: value })
    }, [setUserId, deptId, onChange])

    return <div style={{ width: width || "100%" }}>
        <Spin spinning={loading}>
            <TreeSelect
                placeholder="部门"
                value={deptId || undefined}
                style={{ width: "50%" }}
                onChange={handleFirstChange}
                treeData={deptData}
            />
            <Select
                placeholder="人员"
                value={userId || undefined}
                style={{ width: "50%" }}
                onChange={handleChange}
                disabled={!deptId}
            >
                {userData?.records?.map((item: any) => <Select.Option
                    value={item.userId}
                    key={item.id}
                >
                    {item.name}
                </Select.Option>)}
            </Select>
        </Spin>
    </div>
}