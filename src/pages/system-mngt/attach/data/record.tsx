import React from "react"
import { Input, Select } from "antd"
import { OperationRecord, SearchTable } from "../../../common"
import { signIn } from "./data.json"
const recordEnum: { [key: string]: any } = {
    signIn: "签收日志",
    opration: "操作日志",
    examine: "审核日志"
}
interface EditProps {
    id: "create" | string
    noticeId: string | undefined
    type: "signIn" | "opration" | "examine"
}

export default function Records({ id, type, noticeId }: EditProps) {
    if (type === "opration") {
        return <OperationRecord serviceId={id} serviceName="tower-system" />
    }
    if (type === "signIn") {
        return <SearchTable
            path="/tower-system/notice/staff/sign"
            columns={signIn as any[]}
            modal
            filterValue={{ id: noticeId }}
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