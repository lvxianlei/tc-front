import React, { useState } from "react"
import DetailTitle from "./DetailTitle"
import CommonTable from "./CommonTable"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
const recordColumns: any[] = [
    {
        "title": "部门名称",
        "dataIndex": "deptName"
    },
    {
        "title": "操作人",
        "dataIndex": "optUserName"
    },
    {
        "title": "操作时间",
        "dataIndex": "optTime"
    },
    {
        "title": "操作类型",
        "dataIndex": "optName"
    },
    {
        "title": "意见",
        "dataIndex": "description"
    }
]

interface OperationRecordProps {
    title?: string | false
    columns?: any[]
    serviceId: string
    serviceName: string
    operateTypeEnum?: "OPERATION" | "APPROVAL"
}

interface OperationRecordStates {
    current: number
    operateTypeEnum: "OPERATE_RECORD" | "APPROVAL_RECORD"
    serviceName: string
    size: number
    total: number
}

interface FetchDataSource {
    current: number
    pages: number
    records: any[]
    size: number
    total: number
}

export default function OperationRecord({
    title = "操作记录",
    columns = recordColumns,
    operateTypeEnum = "OPERATION",
    serviceId,
    serviceName
}: OperationRecordProps): JSX.Element {
    const [params, setParams] = useState<OperationRecordStates>({
        current: 1,
        operateTypeEnum: operateTypeEnum === "OPERATION" ? "OPERATE_RECORD" : "APPROVAL_RECORD",
        serviceName,
        size: 10,
        total: 0
    })

    const { loading, data, run } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: FetchDataSource = await RequestUtil.get(`/tower-system/log`, { ...params, serviceId, ...data })
            setParams({
                ...params,
                current: result?.current,
                total: result?.total
            })
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [serviceId] })

    const handleCHange = async (page: number, pageSize: number) => {
        run({
            size: pageSize,
            current: page
        })
        setParams({
            ...params,
            size: pageSize,
            current: page
        })
    }

    return <>
        {title && <DetailTitle title={title} />}
        <CommonTable
            style={{ padding: "0" }}
            haveIndex
            loading={loading}
            columns={columns}
            rowKey={(item: any) => `${item.deptId}-${item.optTime}`}
            pagination={{
                current: params.current,
                pageSize: params.size,
                total: params.total,
                onChange: handleCHange
            }}
            dataSource={data as any || []}
        />
    </>
}