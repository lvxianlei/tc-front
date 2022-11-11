import React from "react"
import { Spin } from "antd"
import { BaseInfo, DetailTitle } from "../../../common"
import Attachment from "./Attach"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { detail } from "./data.json"
interface EditProps {
    id: "create" | string
}

export default function Overview({ id }: EditProps) {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-system/doc/detail`, { id })
            resole(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: id === "create" })

    return <Spin spinning={loading}>
        <DetailTitle title="基本信息" />
        <BaseInfo
            col={3}
            columns={detail.base.map((item: any) => {
                if (item.dataIndex === "typeId") {
                    return ({
                        ...item,
                        transformData: (data: any) => data?.records?.map((item: any) => ({
                            label: item.name,
                            value: item.id
                        }))
                    })
                }
                if (item.dataIndex === "tag") {
                    return ({
                        ...item,
                        transformData: (data: any) => data.map((item: any) => ({
                            value: item,
                            label: item
                        }))
                    })
                }
                if (item.dataIndex === "approvalProcessId") {
                    return ({
                        ...item,
                        transformData: (data: any) => data?.records?.map((item: any) => ({
                            label: item.name,
                            value: item.id
                        }))
                    })
                }
                return item
            })}
            dataSource={{
                ...data,
            }}
        />
        <Attachment dataSource={data?.attachInfoVos} />
    </Spin>
}