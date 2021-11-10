import React, { useState, useCallback, useEffect } from "react"
import { Select } from "antd"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface IntgSelectProps {
    id?: string,
    onChange?: (value: any) => void
    value?: undefined | { first: string, second: string }
    width?: number | string
}
export default function IntgSelect({ onChange, width, value = { first: "", second: "" } }: IntgSelectProps): JSX.Element {
    const [deptId, setDeptId] = useState<string>(value?.first || "")
    const [userId, setUserId] = useState<string>(value?.second || "")

    useEffect(() => {
        setDeptId(value.first)
        setUserId(value.second)
        value.first && getUser(value.first)
    }, [value.first])

    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/department`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/user?departmentId=${id}`)
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
        <Select placeholder="部门" style={{ width: "50%" }} onChange={handleFirstChange} value={deptId} >{deptData?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
        <Select placeholder="人员" style={{ width: "50%" }} onChange={handleChange} value={userId} disabled={!deptId}>{userData?.records?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
    </div>
}