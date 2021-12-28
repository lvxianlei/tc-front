import React, { useState } from "react"
import DetailTitle from "./DetailTitle"
import CommonTable from "./CommonTable"
import RequestUtil from "../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request'
const recordColumns: any[] = [
    {
        "title": "部门",
        "dataIndex": "department"
    },
    {
        "title": "审批人",
        "dataIndex": "approver"
    },
    {
        "title": "职位",
        "dataIndex": "position"
    },
    {
        "title": "审批时间",
        "dataIndex": "batchTime"
    },
    {
        "title": "审批结果",
        "dataIndex": "batchResult",
        "type": "select",
        "enum": [
            {
                "value": 1,
                "label": "审批中"
            },
            {
                "value": 2,
                "label": "已同意"
            },
            {
                "value": 3,
                "label": "已驳回"
            },
            {
                "value": 4,
                "label": "已转审"
            }
        ]
    },
    {
        "title": "意见",
        "dataIndex": "opinion"
    }
]

interface OperationRecordProps {
    title?: string
    columns?: any[]
    serviceId: string
    serviceName: string
    operateTypeEnum?: "OPERATION" | "APPROVAL"
}

interface OperationRecordStates {
    current: number
    operateTypeEnum: "OPERATE_RECORD" | "APPROVAL_RECORD"
    serviceId: string
    serviceName: string
    size: number
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
        serviceId,
        serviceName,
        size: 10
    })
    const { loading, data, run } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: FetchDataSource = await RequestUtil.get(`/tower-system/log`, params)
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [serviceId] })

    const handleCHange = async (page: number, pageSize: number) => {
        console.log(page, pageSize)
    }

    return <>
        <DetailTitle title={title} />
        <CommonTable
            haveIndex
            loading={loading}
            columns={columns}
            scroll={false}
            pagination={{
                current: params.current,
                pageSize: params.size,
                onChange: handleCHange
            }}
            dataSource={data as any || []}
        />
    </>
}