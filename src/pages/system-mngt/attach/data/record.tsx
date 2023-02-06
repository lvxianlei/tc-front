import React from "react"
import { Input, Select, Spin } from "antd"
import { DetailTitle, OperationRecord, SearchTable } from "../../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { signIn, examine } from "./data.json"
const recordEnum: { [key: string]: any } = {
    signIn: "签收日志",
    opration: "操作日志",
    examine: "审核日志"
}
interface EditProps {
    id: "create" | string
    type: "signIn" | "opration" | "examine"
}

export default function Records({ id, type }: EditProps) {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-system/notice/staff/sign`, { id })
            resole(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: type === "signIn" })

    if (type === "opration") {
        return <OperationRecord serviceId={id} serviceName="tower-science" />
    }
    if (type === "signIn") {
        return <SearchTable
            path="/tower-system/notice/staff/sign"
            columns={signIn as any[]}
            modal
            filterValue={{ id }}
            searchFormItems={[{
                name: 'staffName',
                label: "姓名",
                children: <Input placeholder="姓名" style={{ width: 200 }} />
            },
            {
                name: 'status',
                label: "状态",
                children: <Select placeholder="状态" style={{ width: 200 }} >
                    <Select.Option value={0}>未读</Select.Option>
                    <Select.Option value={1}>已读</Select.Option>
                    <Select.Option value={3}>签收</Select.Option>
                </Select>
            },]}
        />
    }
    return <></>
}